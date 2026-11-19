import { validarCambioClave } from "./cambioClave.js";

export function conectarCambioClave() {
  const formulario = document.querySelector("#formulario-cambio-clave");
  const mensaje = document.querySelector("#cambio-clave-mensaje");
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const error = validarCambioClave(Object.fromEntries(new FormData(formulario)));
    mensaje.textContent = error ?? "";
    mensaje.hidden = !error;
  });
}
