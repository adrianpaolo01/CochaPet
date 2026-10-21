import { enlaceLlamada, enlaceWhatsApp, formatearFecha, idDesdeHash, tituloPublicacion } from "./publicaciones.js";
import { fotoAmpliada } from "./galeria.js";

const vistaLista = document.querySelector("#vista-lista");
const vistaDetalle = document.querySelector("#vista-detalle");
const fotos = document.querySelector("#detalle-fotos");
const visor = document.querySelector("#visor");

fotos.addEventListener("click", (evento) => {
  const indice = [...fotos.children].indexOf(evento.target);
  const urls = [...fotos.children].map((img) => img.src);
  const foto = fotoAmpliada(urls, indice);
  if (!foto) return;
  document.querySelector("#visor-foto").src = foto;
  visor.showModal();
});

async function mostrarVista() {
  const id = idDesdeHash(location.hash);
  vistaLista.hidden = id !== null;
  vistaDetalle.hidden = id === null;
  if (id === null) return;
  const respuesta = await fetch(`/api/publicaciones/${id}`);
  const publicacion = await respuesta.json();
  document.querySelector("#detalle-titulo").textContent = tituloPublicacion(publicacion);
  document.querySelector("#detalle-datos").textContent = `${publicacion.barrio} · ${formatearFecha(publicacion.fecha)}`;
  document.querySelector("#detalle-descripcion").textContent = publicacion.descripcion;
  document.querySelector("#detalle-whatsapp").href = enlaceWhatsApp(publicacion);
  document.querySelector("#detalle-llamar").href = enlaceLlamada(publicacion);
  fotos.replaceChildren(...publicacion.fotos.map((url) => Object.assign(new Image(), { src: url, alt: "" })));
}

window.addEventListener("hashchange", mostrarVista);
mostrarVista();
