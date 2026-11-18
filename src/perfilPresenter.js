import { vistaParaHash } from "./rutas.js";

const vistaPerfil = document.querySelector("#vista-perfil");
vistaPerfil.innerHTML = `
  <h1>Mi perfil</h1>
  <p id="perfil-datos" class="perfil-datos"></p>`;

async function mostrarPerfil() {
  vistaPerfil.hidden = vistaParaHash(location.hash) !== "perfil";
  if (vistaPerfil.hidden) return;
  const { usuario } = await (await fetch("/api/sesion")).json();
  if (!usuario) return void (location.hash = "#/ingresar");
  document.querySelector("#perfil-datos").textContent = `${usuario.nombre} · ${usuario.correo} · ${usuario.telefono}`;
}

window.addEventListener("hashchange", mostrarPerfil);
mostrarPerfil();
