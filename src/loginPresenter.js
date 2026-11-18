import { vistaParaHash } from "./rutas.js";
import { textoSesion, validarCredenciales } from "./sesion.js";
import { htmlVistaLogin } from "./vistaLogin.js";

const vistaLogin = document.querySelector("#vista-login");
vistaLogin.innerHTML = htmlVistaLogin();
const enlaceSesion = document.querySelector("#enlace-sesion");
const formulario = document.querySelector("#formulario-login");
const campoCorreo = document.querySelector("#login-correo");
const campoClave = document.querySelector("#login-clave");
const mensaje = document.querySelector("#login-mensaje");
const botonEnviar = document.querySelector("#login-enviar");
let usuarioActual = null;

function mostrarUsuario(usuario) {
  usuarioActual = usuario;
  enlaceSesion.textContent = textoSesion(usuario);
  enlaceSesion.href = usuario ? "#/" : "#/ingresar";
}

function mostrarVista() {
  const enLogin = vistaParaHash(location.hash) === "login";
  if (enLogin && usuarioActual) {
    location.hash = "#/";
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
    location.hash = "#/";
  } catch {
    mostrarError("No se pudo iniciar sesión. Revisa tu conexión e intenta nuevamente.");
  } finally {
    botonEnviar.disabled = false;
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
mostrarVista();
cargarSesion();
