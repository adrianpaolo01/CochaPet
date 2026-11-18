import { destinoTrasIngresar, vistaParaHash } from "./rutas.js";
import { estadoEncabezado, validarCredenciales } from "./sesion.js";
import { htmlVistaLogin } from "./vistaLogin.js";

const vistaLogin = document.querySelector("#vista-login");
vistaLogin.innerHTML = htmlVistaLogin();
const enlaceSesion = document.querySelector("#enlace-sesion");
const formulario = document.querySelector("#formulario-login");
const campoCorreo = document.querySelector("#login-correo");
const campoClave = document.querySelector("#login-clave");
const mensaje = document.querySelector("#login-mensaje");
const botonEnviar = document.querySelector("#login-enviar");
const botonRegistro = document.querySelector("#abrir-registro");
const botonCerrar = document.querySelector("#cerrar-sesion");
const mensajeSesion = document.querySelector("#mensaje-sesion");
let usuarioActual = null;

function mostrarUsuario(usuario) {
  usuarioActual = usuario;
  const estado = estadoEncabezado(usuario);
  enlaceSesion.textContent = estado.texto;
  enlaceSesion.href = estado.href;
  botonRegistro.hidden = !estado.mostrarRegistro;
  botonCerrar.hidden = !estado.mostrarCerrar;
}

function mostrarVista() {
  mensajeSesion.hidden = true;
  const enLogin = vistaParaHash(location.hash) === "login";
  if (enLogin && usuarioActual) {
    location.hash = destinoTrasIngresar(location.hash);
    return;
  }
  vistaLogin.hidden = !enLogin;
}

function mostrarError(texto) {
  mensaje.textContent = texto;
  mensaje.hidden = !texto;
}

async function iniciarSesion(evento) {
  evento.preventDefault();
  const datos = { correo: campoCorreo.value.trim(), clave: campoClave.value };
  const error = validarCredenciales(datos);
  if (error) return mostrarError(error);
  mostrarError("");
  botonEnviar.disabled = true;
  try {
    const respuesta = await fetch("/api/sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const cuerpo = await respuesta.json();
    if (!respuesta.ok) return mostrarError(cuerpo.error ?? "No se pudo iniciar sesión. Intenta nuevamente.");
    formulario.reset();
    mostrarUsuario(cuerpo.usuario);
    location.hash = destinoTrasIngresar(location.hash);
  } catch {
    mostrarError("No se pudo iniciar sesión. Revisa tu conexión e intenta nuevamente.");
  } finally {
    botonEnviar.disabled = false;
  }
}

async function cerrarSesion() {
  botonCerrar.disabled = true;
  try {
    const respuesta = await fetch("/api/sesion", { method: "DELETE" });
    if (!respuesta.ok) throw new Error("no se pudo cerrar la sesion");
    window.dispatchEvent(new CustomEvent("sesion-cerrada"));
    location.hash = "#/";
  } catch {
    mensajeSesion.textContent = "No se pudo cerrar la sesión. Intenta nuevamente.";
    mensajeSesion.hidden = false;
  } finally {
    botonCerrar.disabled = false;
  }
}

async function cargarSesion() {
  try {
    const respuesta = await fetch("/api/sesion");
    if (respuesta.ok) mostrarUsuario((await respuesta.json()).usuario);
  } catch {
    // sin conexion con la API: la pagina sigue funcionando como visitante
  }
  mostrarVista();
}

formulario.addEventListener("submit", iniciarSesion);
window.addEventListener("hashchange", mostrarVista);
window.addEventListener("sesion-iniciada", (evento) => mostrarUsuario(evento.detail));
window.addEventListener("sesion-cerrada", () => mostrarUsuario(null));
botonCerrar.addEventListener("click", cerrarSesion);
mostrarVista();
cargarSesion();
