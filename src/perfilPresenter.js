import { textoEstado, validarDatosPerfil } from "./perfil.js";
import { formatearFecha, tituloPublicacion } from "./publicaciones.js";
import { vistaParaHash } from "./rutas.js";
import { estadoEncabezado } from "./sesion.js";

const vistaPerfil = document.querySelector("#vista-perfil");
vistaPerfil.innerHTML = `
  <h1>Mi perfil</h1>
  <img id="perfil-foto" class="perfil-foto" alt="Mi foto" hidden />
  <p id="perfil-datos" class="perfil-datos"></p>
  <form id="formulario-perfil" class="formulario-perfil" novalidate>
    <h2>Editar mis datos</h2>
    <label for="perfil-nombre">Nombre</label><input id="perfil-nombre" autocomplete="name" />
    <label for="perfil-telefono">Teléfono</label><input id="perfil-telefono" type="tel" autocomplete="tel" />
    <label for="perfil-foto-url">Foto (enlace de la imagen)</label><input id="perfil-foto-url" type="url" placeholder="https://..." />
    <p id="perfil-mensaje" role="alert" hidden></p>
    <button type="submit" class="boton">Guardar</button>
  </form>
  <h2>Mis publicaciones</h2>
  <ul id="perfil-publicaciones" class="perfil-publicaciones"></ul>
  <section class="zona-eliminar-cuenta">
    <h2>Eliminar mi cuenta</h2>
    <p>Se borrarán tu cuenta y todas tus publicaciones. No se puede deshacer.</p>
    <p id="eliminar-cuenta-mensaje" class="mensaje-error" role="alert" hidden></p>
    <button type="button" id="eliminar-cuenta" class="boton boton-peligro">Eliminar mi cuenta</button>
  </section>`;

const formulario = document.querySelector("#formulario-perfil");
const mensaje = document.querySelector("#perfil-mensaje");
const CONFIRMACION_ELIMINAR_CUENTA = "¿Seguro que quieres eliminar tu cuenta? También se borrarán todas tus publicaciones.";

function crearItem(publicacion) {
  const item = document.createElement("li");
  item.textContent = `${tituloPublicacion(publicacion)} · ${publicacion.barrio} · ${formatearFecha(publicacion.fecha)} · ${textoEstado(publicacion.estado)}`;
  return item;
}

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  mensaje.hidden = !texto;
}

function mostrarDatos(usuario) {
  document.querySelector("#perfil-datos").textContent = `${usuario.nombre} · ${usuario.correo} · ${usuario.telefono}`;
  const foto = document.querySelector("#perfil-foto");
  foto.hidden = !usuario.foto;
  if (usuario.foto) foto.src = usuario.foto;
  document.querySelector("#perfil-nombre").value = usuario.nombre;
  document.querySelector("#perfil-telefono").value = usuario.telefono;
  document.querySelector("#perfil-foto-url").value = usuario.foto ?? "";
  document.querySelector("#enlace-sesion").textContent = estadoEncabezado(usuario).texto;
}

async function mostrarPerfil() {
  vistaPerfil.hidden = vistaParaHash(location.hash) !== "perfil";
  if (vistaPerfil.hidden) return;
  const { usuario } = await (await fetch("/api/sesion")).json();
  if (!usuario) {
    location.hash = "#/ingresar";
    return;
  }
  mostrarMensaje("");
  mostrarDatos(usuario);
  const publicaciones = await (await fetch("/api/mis-publicaciones")).json();
  document.querySelector("#perfil-publicaciones").replaceChildren(...publicaciones.map(crearItem));
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const datos = {
    nombre: document.querySelector("#perfil-nombre").value,
    telefono: document.querySelector("#perfil-telefono").value,
    foto: document.querySelector("#perfil-foto-url").value,
  };
  const error = validarDatosPerfil(datos);
  if (error) return mostrarMensaje(error);
  const respuesta = await fetch("/api/perfil", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });
  const cuerpo = await respuesta.json();
  if (!respuesta.ok) return mostrarMensaje(cuerpo.error);
  mostrarDatos(cuerpo);
  mostrarMensaje("Tus datos se guardaron");
});

async function eliminarCuenta() {
  if (!confirm(CONFIRMACION_ELIMINAR_CUENTA)) return;
  await fetch("/api/perfil", { method: "DELETE" });
  window.dispatchEvent(new CustomEvent("sesion-cerrada"));
  location.hash = "#/";
  // recarga para que el inicio ya no muestre las publicaciones borradas
  location.reload();
}

document.querySelector("#eliminar-cuenta").addEventListener("click", eliminarCuenta);
window.addEventListener("hashchange", mostrarPerfil);
mostrarPerfil();
