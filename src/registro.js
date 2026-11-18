const LONGITUD_MINIMA_CLAVE = 8;

export function validarRegistro(datos) {
  if (datos.clave.length < LONGITUD_MINIMA_CLAVE) {
    return `La contraseña debe tener al menos ${LONGITUD_MINIMA_CLAVE} caracteres`;
  }
  return null;
}
