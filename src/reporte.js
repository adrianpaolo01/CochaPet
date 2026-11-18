const ESPECIES = ["PERRO", "GATO", "OTRO"];

export function validarReporte(datos) {
  if (!ESPECIES.includes(datos.especie)) return "Elige la especie de tu mascota";
  if (!datos.barrio?.trim()) return "Elige el barrio donde se perdió";
  if (!datos.fecha) return "Indica la fecha en que se perdió";
  if (!datos.descripcion?.trim()) return "Describe a tu mascota para que la reconozcan";
  return null;
}

export function textosReporte() {
  return { titulo: "Encontré una mascota" };
}

// Mediodia local: asi la fecha no cambia de dia al convertirse a UTC en el servidor.
export function fechaDelDia(dia) {
  return new Date(`${dia}T12:00`).toISOString();
}

export function leerBorrador(texto) {
  try {
    return JSON.parse(texto) ?? {};
  } catch {
    return {};
  }
}
