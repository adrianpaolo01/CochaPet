import { idDesdeHash } from "./publicaciones.js";

export function vistaParaHash(hash) {
  if (idDesdeHash(hash) !== null) return "detalle";
  if (hash === "#/perfil") return "perfil";
  return hash === "#/ingresar" ? "login" : "lista";
}
