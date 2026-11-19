import { hashearClave, verificarClave } from "./claves.js";

export async function cambiarClave(repositorio, usuario, datos) {
  const cuenta = await repositorio.buscarUsuarioPorCorreo(usuario.correo);
  if (!cuenta || !verificarClave(datos.claveActual, cuenta.claveHash)) {
    return { ok: false, estado: 400, error: "La contraseña actual es incorrecta" };
  }
  await repositorio.actualizarClave(usuario.id, hashearClave(datos.claveNueva), cuenta.claveHash);
  return { ok: true };
}
