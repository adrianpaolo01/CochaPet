import { verificarClave } from "./claves.js";

const CREDENCIALES_INCORRECTAS = { ok: false, estado: 401, error: "Correo o contraseña incorrectos" };

export async function iniciarSesion(repositorio, { correo, clave }) {
  const usuario = await repositorio.buscarUsuarioPorCorreo(correo);
  if (!verificarClave(clave, usuario.claveHash)) return CREDENCIALES_INCORRECTAS;
  return { ok: true };
}
