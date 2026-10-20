import { etiquetaEstado, formatearFecha, fotoPrincipal, mensajeInicio, ordenarParaInicio, tituloPublicacion } from "./publicaciones.js";

const lista = document.querySelector("#lista-publicaciones");
const plantilla = document.querySelector("#plantilla-tarjeta");
const mensaje = document.querySelector("#mensaje-inicio");

function crearTarjeta(publicacion) {
  const tarjeta = plantilla.content.cloneNode(true);
  tarjeta.querySelector(".tarjeta-foto").src = fotoPrincipal(publicacion);
  tarjeta.querySelector(".badge").textContent = etiquetaEstado(publicacion);
  tarjeta.querySelector(".badge").classList.add(`badge-${publicacion.tipo.toLowerCase()}`);
  tarjeta.querySelector(".tarjeta-titulo").textContent = tituloPublicacion(publicacion);
  if (publicacion.destacada) {
    tarjeta.querySelector(".tarjeta").classList.add("tarjeta-destacada");
    tarjeta.querySelector(".badge-destacada").hidden = false;
  }
  tarjeta.querySelector(".tarjeta-datos").textContent = `${publicacion.barrio} · ${formatearFecha(publicacion.fecha)}`;
  return tarjeta;
}

async function mostrarPublicaciones() {
  try {
    const respuesta = await fetch("/api/publicaciones");
    if (!respuesta.ok) throw new Error("No se pudieron cargar las publicaciones");
    const publicaciones = await respuesta.json();
    lista.replaceChildren(...ordenarParaInicio(publicaciones).map(crearTarjeta));
    mensaje.textContent = mensajeInicio(publicaciones) ?? "";
    mensaje.hidden = !mensaje.textContent;
  } catch {
    mensaje.textContent = "No se pudieron cargar las publicaciones. Intenta nuevamente más tarde.";
    mensaje.hidden = false;
  }
}

mostrarPublicaciones();
