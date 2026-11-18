import { idDesdeHash } from "./publicaciones.js";

export const RUTA_REPORTE_PERDIDA = "#/reportar/perdida";

export function vistaParaHash(hash) {
  if (idDesdeHash(hash) !== null) return "detalle";
  if (hash === RUTA_REPORTE_PERDIDA) return "reporte";
  if (hash === "#/perfil") return "perfil";
  return hash.split("?")[0] === "#/ingresar" ? "login" : "lista";
}

export function destinoTrasIngresar(hash) {
  const consulta = new URLSearchParams(hash.split("?")[1]);
  return `#${consulta.get("volver") ?? "/"}`;
}
