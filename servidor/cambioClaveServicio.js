import { hashearClave } from "./claves.js";

export async function cambiarClave(repositorio, usuario, datos) {
  const cuenta = await repositorio.buscarUsuarioPorCorreo(usuario.correo);
  await repositorio.actualizarClave(usuario.id, hashearClave(datos.claveNueva), cuenta.claveHash);
  return { ok: true };
}
