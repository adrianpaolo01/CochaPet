import { textoEstado } from "./perfil.js";
import { formatearFecha, tituloPublicacion } from "./publicaciones.js";
import { vistaParaHash } from "./rutas.js";
import { htmlCambioClave } from "./vistaCambioClave.js";

const vistaPerfil = document.querySelector("#vista-perfil");
vistaPerfil.innerHTML = `
  <h1>Mi perfil</h1>
  <p id="perfil-datos" class="perfil-datos"></p>
  <h2>Mis publicaciones</h2>
  <ul id="perfil-publicaciones" class="perfil-publicaciones"></ul>${htmlCambioClave()}`;

function crearItem(publicacion) {
  const item = document.createElement("li");
  item.textContent = `${tituloPublicacion(publicacion)} · ${publicacion.barrio} · ${formatearFecha(publicacion.fecha)} · ${textoEstado(publicacion.estado)}`;
  return item;
}

async function mostrarPerfil() {
  vistaPerfil.hidden = vistaParaHash(location.hash) !== "perfil";
  if (vistaPerfil.hidden) return;
  const { usuario } = await (await fetch("/api/sesion")).json();
  if (!usuario) {
    location.hash = "#/ingresar";
    return;
  }
  document.querySelector("#perfil-datos").textContent = `${usuario.nombre} · ${usuario.correo} · ${usuario.telefono}`;
  const publicaciones = await (await fetch("/api/mis-publicaciones")).json();
  document.querySelector("#perfil-publicaciones").replaceChildren(...publicaciones.map(crearItem));
}

window.addEventListener("hashchange", mostrarPerfil);
mostrarPerfil();
