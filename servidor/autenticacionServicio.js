import { verificarClave } from "./claves.js";

export async function iniciarSesion(repositorio, { correo, clave }) {
  const usuario = await repositorio.buscarUsuarioPorCorreo(correo);
  return { ok: verificarClave(clave, usuario.claveHash) };
}
