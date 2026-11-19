import { LONGITUD_MINIMA_CLAVE } from "./registro.js";

export function validarCambioClave(datos) {
  const claves = [datos?.claveActual, datos?.claveNueva, datos?.confirmacion];
  if (claves.some((clave) => typeof clave !== "string" || clave === "")) return "Completa las tres contraseñas";
  if (datos.claveNueva.length < LONGITUD_MINIMA_CLAVE) return `La nueva contraseña debe tener al menos ${LONGITUD_MINIMA_CLAVE} caracteres`;
  return null;
}
