import { fechaDelDia, leerBorrador, textosReporte, validarReporte } from "./reporte.js";
import { enlaceIngresarDesde, tipoDeReporte, vistaParaHash } from "./rutas.js";
import { htmlVistaReporte } from "./vistaReporte.js";

const vistaReporte = document.querySelector("#vista-reporte");
vistaReporte.innerHTML = htmlVistaReporte();
const formulario = document.querySelector("#formulario-reporte");
const avisoSesion = document.querySelector("#reporte-aviso-sesion");
const mensaje = document.querySelector("#reporte-mensaje");
const CLAVE_BORRADOR = "borrador-reporte";

function mostrarError(texto) {
  mensaje.textContent = texto;
  mensaje.hidden = !texto;
}

async function publicar(evento) {
  evento.preventDefault();
  const datos = Object.fromEntries(new FormData(formulario));
  const error = validarReporte(datos);
  mostrarError(error);
  if (error) return;
  try {
    const cuerpo = JSON.stringify({ ...datos, tipo: tipoDeReporte(location.hash), fecha: fechaDelDia(datos.fecha) });
    const respuesta = await fetch("/api/publicaciones", { method: "POST", headers: { "Content-Type": "application/json" }, body: cuerpo });
    if (!respuesta.ok) return mostrarError((await respuesta.json()).error);
    sessionStorage.removeItem(CLAVE_BORRADOR);
    location.hash = `#/mascota/${(await respuesta.json()).id}`;
    // recarga para que el inicio ya muestre la nueva publicacion a todos
    location.reload();
  } catch {
    mostrarError("No se pudo publicar el reporte. Intenta nuevamente más tarde.");
  }
}

async function mostrarAvisoSesion() {
  try {
    const { usuario } = await (await fetch("/api/sesion")).json();
    avisoSesion.hidden = Boolean(usuario);
  } catch {
    avisoSesion.hidden = false;
  }
}

function guardarBorrador() {
  sessionStorage.setItem(CLAVE_BORRADOR, JSON.stringify(Object.fromEntries(new FormData(formulario))));
}

function restaurarBorrador() {
  const borrador = leerBorrador(sessionStorage.getItem(CLAVE_BORRADOR));
  for (const [campo, valor] of Object.entries(borrador)) if (formulario.elements[campo]) formulario.elements[campo].value = valor;
}

async function cargarBarrios() {
  try {
    const respuesta = await fetch("/api/barrios");
    if (respuesta.ok) formulario.barrio.append(...(await respuesta.json()).map((nombre) => new Option(nombre, nombre)));
  } catch {
    // sin conexion: el formulario se muestra igual y el servidor rechaza un barrio vacio
  }
}

function pintarTipoDeReporte() {
  const textos = textosReporte(tipoDeReporte(location.hash));
  document.querySelector("#reporte-titulo").textContent = textos.titulo;
  document.querySelector("#reporte-subtitulo").textContent = textos.subtitulo;
  document.querySelector("#reporte-pregunta-fecha").textContent = textos.preguntaFecha;
  document.querySelector("#reporte-ingresar").href = enlaceIngresarDesde(location.hash);
}

function mostrarVista() {
  vistaReporte.hidden = vistaParaHash(location.hash) !== "reporte";
  if (vistaReporte.hidden) return;
  pintarTipoDeReporte();
  mostrarAvisoSesion();
}

window.addEventListener("hashchange", mostrarVista);
mostrarVista();
formulario.addEventListener("input", guardarBorrador);
formulario.addEventListener("submit", publicar);
document.querySelector("#reporte-registrarse").addEventListener("click", () => document.querySelector("#abrir-registro").click());
window.addEventListener("sesion-iniciada", () => {
  avisoSesion.hidden = true;
});
cargarBarrios().then(restaurarBorrador);
