import { leerBorrador } from "./reporte.js";
import { vistaParaHash } from "./rutas.js";
import { htmlVistaReporte } from "./vistaReporte.js";

const vistaReporte = document.querySelector("#vista-reporte");
vistaReporte.innerHTML = htmlVistaReporte();
const formulario = document.querySelector("#formulario-reporte");
const CLAVE_BORRADOR = "borrador-reporte-perdida";

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

function mostrarVista() {
  vistaReporte.hidden = vistaParaHash(location.hash) !== "reporte";
}

window.addEventListener("hashchange", mostrarVista);
mostrarVista();
formulario.addEventListener("input", guardarBorrador);
cargarBarrios().then(restaurarBorrador);
