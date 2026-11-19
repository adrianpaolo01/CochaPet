export const LONGITUD_MINIMA_CLAVE = 8;

const CAMPOS_OBLIGATORIOS = ["nombre", "correo", "telefono"];
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarRegistro(datos) {
  if (CAMPOS_OBLIGATORIOS.some((campo) => !datos[campo]?.trim())) {
    return "Completa todos los campos";
  }
  if (!FORMATO_CORREO.test(datos.correo.trim())) return "Ingresa un correo válido";
  if (datos.clave.length < LONGITUD_MINIMA_CLAVE) {
    return `La contraseña debe tener al menos ${LONGITUD_MINIMA_CLAVE} caracteres`;
  }
  return null;
}
