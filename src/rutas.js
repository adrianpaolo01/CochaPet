import { idDesdeHash } from "./publicaciones.js";

export const RUTA_REPORTE_PERDIDA = "#/reportar/perdida";

export function vistaParaHash(hash) {
  if (idDesdeHash(hash) !== null) return "detalle";
  if (hash === RUTA_REPORTE_PERDIDA) return "reporte";
  return hash === "#/ingresar" ? "login" : "lista";
}
