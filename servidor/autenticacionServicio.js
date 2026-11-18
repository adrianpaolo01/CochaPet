import { verificarClave } from "./claves.js";

const FALTAN_DATOS = { ok: false, estado: 400, error: "Ingresa tu correo y tu contraseña" };
const CREDENCIALES_INCORRECTAS = { ok: false, estado: 401, error: "Correo o contraseña incorrectos" };

export async function iniciarSesion(repositorio, { correo, clave }) {
  const correoLimpio = typeof correo === "string" ? correo.trim() : "";
  if (!correoLimpio || typeof clave !== "string" || clave === "") return FALTAN_DATOS;
  const usuario = await repositorio.buscarUsuarioPorCorreo(correoLimpio);
  if (!usuario || !verificarClave(clave, usuario.claveHash)) return CREDENCIALES_INCORRECTAS;
  return { ok: true };
}
