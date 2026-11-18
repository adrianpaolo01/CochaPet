import { validarRegistro } from "./registro.js";

const dialogo = document.querySelector("#registro");
const formulario = document.querySelector("#formulario-registro");
const mensajeError = document.querySelector("#registro-error");

function leerFormulario() {
  const valor = (campo) => document.querySelector(`#registro-${campo}`).value;
  return { nombre: valor("nombre"), correo: valor("correo"), telefono: valor("telefono"), clave: valor("clave") };
}

function mostrarError(texto) {
  mensajeError.textContent = texto;
  mensajeError.hidden = false;
}

document.querySelector("#abrir-registro").addEventListener("click", () => dialogo.showModal());

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const error = validarRegistro(leerFormulario());
  if (error) mostrarError(error);
});
