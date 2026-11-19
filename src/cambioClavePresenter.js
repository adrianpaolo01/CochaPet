import { validarCambioClave } from "./cambioClave.js";

export function conectarCambioClave() {
  const formulario = document.querySelector("#formulario-cambio-clave");
  const mensaje = document.querySelector("#cambio-clave-mensaje");
  const boton = document.querySelector("#cambio-clave-enviar");
  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (boton.disabled) return;
    const datos = Object.fromEntries(new FormData(formulario));
    const error = validarCambioClave(datos);
    mensaje.textContent = error ?? "";
    mensaje.hidden = !error;
    if (error) return;
    boton.disabled = true;
    try {
      const respuesta = await fetch("/api/usuarios/clave", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos),
      });
      const cuerpo = await respuesta.json();
      mensaje.textContent = respuesta.ok ? cuerpo.mensaje : (cuerpo.error ?? "No se pudo cambiar la contraseña.");
      if (respuesta.ok) formulario.reset();
    } catch {
      mensaje.textContent = "No se pudo cambiar la contraseña. Revisa tu conexión e intenta nuevamente.";
    } finally {
      boton.disabled = false;
    }
    mensaje.hidden = false;
  });
  const limpiar = () => { formulario.reset(); mensaje.hidden = true; mensaje.textContent = ""; };
  window.addEventListener("sesion-cerrada", limpiar);
  window.addEventListener("hashchange", limpiar);
}
