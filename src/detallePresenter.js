import { enlaceLlamada, enlaceWhatsApp, formatearFecha, idDesdeHash, tituloPublicacion } from "./publicaciones.js";
import { anteriorIndice, fotoAmpliada, hayVariasFotos, siguienteIndice } from "./galeria.js";

const vistaLista = document.querySelector("#vista-lista");
const vistaDetalle = document.querySelector("#vista-detalle");
const fotos = document.querySelector("#detalle-fotos");
const visor = document.querySelector("#visor");
let indiceVisor = 0;

function mostrarEnVisor(indice) {
  const urls = [...fotos.children].map((img) => img.src);
  const foto = fotoAmpliada(urls, indice);
  if (!foto) return;
  indiceVisor = indice;
  document.querySelector("#visor-foto").src = foto;
  for (const boton of visor.querySelectorAll("#visor-anterior, #visor-siguiente")) boton.hidden = !hayVariasFotos(urls);
  if (!visor.open) visor.showModal();
}

fotos.addEventListener("click", (evento) => mostrarEnVisor([...fotos.children].indexOf(evento.target)));
document.querySelector("#visor-siguiente").addEventListener("click", () =>
  mostrarEnVisor(siguienteIndice(indiceVisor, fotos.children.length))
);
document.querySelector("#visor-anterior").addEventListener("click", () =>
  mostrarEnVisor(anteriorIndice(indiceVisor, fotos.children.length))
);

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
