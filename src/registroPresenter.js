import { validarRegistro } from "./registro.js";
import { saludoSesion } from "./sesion.js";

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

function iniciarSesion(usuario) {
  localStorage.setItem("usuario", JSON.stringify(usuario));
  document.querySelector("#abrir-registro").hidden = true;
  const saludo = document.querySelector("#saludo-sesion");
  saludo.textContent = saludoSesion(usuario);
  saludo.hidden = false;
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const datos = leerFormulario();
  const error = validarRegistro(datos);
  if (error) return mostrarError(error);
  try {
    const respuesta = await fetch("/api/usuarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
    const cuerpo = await respuesta.json();
    if (!respuesta.ok) return mostrarError(cuerpo.error);
    iniciarSesion(cuerpo);
    dialogo.close();
  } catch {
    mostrarError("No se pudo crear la cuenta. Intenta nuevamente más tarde.");
  }
});
