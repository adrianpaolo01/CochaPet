import { createHash, randomBytes } from "node:crypto";
import { verificarClave } from "./claves.js";

const VIGENCIA_SESION_MS = 7 * 24 * 60 * 60 * 1000;
const FALTAN_DATOS = { ok: false, estado: 400, error: "Ingresa tu correo y tu contraseña" };
const CREDENCIALES_INCORRECTAS = { ok: false, estado: 401, error: "Correo o contraseña incorrectos" };

export function hashDeToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export async function usuarioDeSesion(repositorio, token) {
  const sesion = await repositorio.obtenerSesion(hashDeToken(token));
  return sesion.usuario;
}

export async function iniciarSesion(repositorio, { correo, clave }, { generarToken = () => randomBytes(32).toString("hex"), ahora = new Date() } = {}) {
  const correoLimpio = typeof correo === "string" ? correo.trim() : "";
  if (!correoLimpio || typeof clave !== "string" || clave === "") return FALTAN_DATOS;
  const usuario = await repositorio.buscarUsuarioPorCorreo(correoLimpio);
  if (!usuario || !verificarClave(clave, usuario.claveHash)) return CREDENCIALES_INCORRECTAS;
  const { id, nombre, telefono, rol } = usuario;
  const token = generarToken();
  const expiraEn = new Date(ahora.getTime() + VIGENCIA_SESION_MS);
  await repositorio.crearSesion({ id: hashDeToken(token), usuarioId: id, expiraEn });
  return { ok: true, token, expiraEn, usuario: { id, nombre, correo: usuario.correo, telefono, rol } };
}
