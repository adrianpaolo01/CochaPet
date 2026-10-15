import { etiquetaEstado, formatearFecha, fotoPrincipal, tituloPublicacion } from "./publicaciones.js";

const lista = document.querySelector("#lista-publicaciones");
const plantilla = document.querySelector("#plantilla-tarjeta");

function crearTarjeta(publicacion) {
  const tarjeta = plantilla.content.cloneNode(true);
  tarjeta.querySelector(".tarjeta-foto").src = fotoPrincipal(publicacion);
  tarjeta.querySelector(".badge").textContent = etiquetaEstado(publicacion);
  tarjeta.querySelector(".badge").classList.add(`badge-${publicacion.tipo.toLowerCase()}`);
  tarjeta.querySelector(".tarjeta-titulo").textContent = tituloPublicacion(publicacion);
  tarjeta.querySelector(".tarjeta-datos").textContent = `${publicacion.barrio} · ${formatearFecha(publicacion.fecha)}`;
  return tarjeta;
}

async function mostrarPublicaciones() {
  const respuesta = await fetch("/api/publicaciones");
  const publicaciones = await respuesta.json();
  lista.replaceChildren(...publicaciones.map(crearTarjeta));
}

mostrarPublicaciones();
