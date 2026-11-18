import { createHash, randomBytes } from "node:crypto";
import { verificarClave } from "./claves.js";

const FALTAN_DATOS = { ok: false, estado: 400, error: "Ingresa tu correo y tu contraseña" };
const CREDENCIALES_INCORRECTAS = { ok: false, estado: 401, error: "Correo o contraseña incorrectos" };

export function hashDeToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export async function iniciarSesion(repositorio, { correo, clave }, { generarToken = () => randomBytes(32).toString("hex") } = {}) {
  const correoLimpio = typeof correo === "string" ? correo.trim() : "";
  if (!correoLimpio || typeof clave !== "string" || clave === "") return FALTAN_DATOS;
  const usuario = await repositorio.buscarUsuarioPorCorreo(correoLimpio);
  if (!usuario || !verificarClave(clave, usuario.claveHash)) return CREDENCIALES_INCORRECTAS;
  const { id, nombre, telefono, rol } = usuario;
  const token = generarToken();
  await repositorio.crearSesion({ id: hashDeToken(token), usuarioId: id });
  return { ok: true, token, usuario: { id, nombre, correo: usuario.correo, telefono, rol } };
}
