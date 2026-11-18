import { scryptSync, timingSafeEqual } from "node:crypto";

export function verificarClave(clave, hashGuardado) {
  const [sal, hash] = hashGuardado.split(":");
  return timingSafeEqual(scryptSync(clave, sal, 64), Buffer.from(hash, "hex"));
}
