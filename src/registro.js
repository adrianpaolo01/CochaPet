const LONGITUD_MINIMA_CLAVE = 8;

const CAMPOS_OBLIGATORIOS = ["nombre", "correo", "telefono"];

export function validarRegistro(datos) {
  if (CAMPOS_OBLIGATORIOS.some((campo) => !datos[campo]?.trim())) {
    return "Completa todos los campos";
  }
  if (datos.clave.length < LONGITUD_MINIMA_CLAVE) {
    return `La contraseña debe tener al menos ${LONGITUD_MINIMA_CLAVE} caracteres`;
  }
  return null;
}
