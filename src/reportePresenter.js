import { vistaParaHash } from "./rutas.js";
import { htmlVistaReporte } from "./vistaReporte.js";

const vistaReporte = document.querySelector("#vista-reporte");
vistaReporte.innerHTML = htmlVistaReporte();

function mostrarVista() {
  vistaReporte.hidden = vistaParaHash(location.hash) !== "reporte";
}

window.addEventListener("hashchange", mostrarVista);
mostrarVista();
