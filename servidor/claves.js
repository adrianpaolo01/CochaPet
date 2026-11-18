import { scryptSync, timingSafeEqual } from "node:crypto";

export function verificarClave(clave, hashGuardado) {
  const [sal, hash] = String(hashGuardado ?? "").split(":");
  if (!sal || !hash) return false;
  const esperado = Buffer.from(hash, "hex");
  const obtenido = scryptSync(clave, sal, 64);
  return esperado.length === obtenido.length && timingSafeEqual(obtenido, esperado);
}
