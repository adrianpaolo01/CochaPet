import { etiquetaEstado, formatearFecha, fotoPrincipal, mensajeInicio, ordenarParaInicio, tituloPublicacion } from "./publicaciones.js";
import { filtrarMascotas, mensajeBusqueda, opcionesDe } from "./busqueda.js";

const lista = document.querySelector("#lista-publicaciones");
const plantilla = document.querySelector("#plantilla-tarjeta");
const mensaje = document.querySelector("#mensaje-inicio");
const buscador = document.querySelector("#buscar-mascotas");
const filtroRaza = document.querySelector("#filtro-raza");
const filtroColor = document.querySelector("#filtro-color");

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
    buscador.disabled = false;
    filtroRaza.append(...opcionesDe(publicaciones, "raza").map((raza) => new Option(raza, raza)));
    filtroRaza.disabled = false;
    filtroColor.append(...opcionesDe(publicaciones, "color").map((color) => new Option(color, color)));
    filtroColor.disabled = false;
    const aplicarFiltros = () => {
      const filtros = { texto: buscador.value, raza: filtroRaza.value, color: filtroColor.value };
      const filtradas = filtrarMascotas(publicaciones, filtros);
      lista.replaceChildren(...ordenarParaInicio(filtradas).map(crearTarjeta));
      mensaje.textContent = mensajeInicio(publicaciones) ?? mensajeBusqueda(filtradas) ?? "";
      mensaje.hidden = !mensaje.textContent;
    };
    buscador.addEventListener("input", aplicarFiltros);
    filtroRaza.addEventListener("change", aplicarFiltros);
    filtroColor.addEventListener("change", aplicarFiltros);
  } catch {
    mensaje.textContent = "No se pudieron cargar las publicaciones. Intenta nuevamente más tarde.";
    mensaje.hidden = false;
  }
}

mostrarPublicaciones();
