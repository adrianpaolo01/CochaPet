import { idDesdeHash } from "./publicaciones.js";

export function vistaParaHash(hash) {
  if (idDesdeHash(hash) !== null) return "detalle";
  return hash === "#/ingresar" ? "login" : "lista";
}
