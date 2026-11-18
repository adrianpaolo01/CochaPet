import { vistaParaHash } from "./rutas.js";
import { htmlVistaReporte } from "./vistaReporte.js";

const vistaReporte = document.querySelector("#vista-reporte");
vistaReporte.innerHTML = htmlVistaReporte();
const formulario = document.querySelector("#formulario-reporte");

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
cargarBarrios();
