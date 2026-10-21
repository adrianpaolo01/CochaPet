import { idDesdeHash } from "./publicaciones.js";

const vistaLista = document.querySelector("#vista-lista");
const vistaDetalle = document.querySelector("#vista-detalle");
const fotos = document.querySelector("#detalle-fotos");

async function mostrarVista() {
  const id = idDesdeHash(location.hash);
  vistaLista.hidden = id !== null;
  vistaDetalle.hidden = id === null;
  if (id === null) return;
  const respuesta = await fetch(`/api/publicaciones/${id}`);
  const publicacion = await respuesta.json();
  fotos.replaceChildren(...publicacion.fotos.map((url) => Object.assign(new Image(), { src: url, alt: "" })));
}

window.addEventListener("hashchange", mostrarVista);
mostrarVista();
