export function validarCambioClave(datos) {
  const claves = [datos?.claveActual, datos?.claveNueva, datos?.confirmacion];
  if (claves.some((clave) => typeof clave !== "string" || clave === "")) return "Completa las tres contraseñas";
  return null;
}
