const ESPECIES = ["PERRO", "GATO", "OTRO"];
const TIPOS_REPORTE = ["PERDIDA", "ENCONTRADA"];

export function validarReporte(datos) {
  if (datos.tipo && !TIPOS_REPORTE.includes(datos.tipo)) return "Elige si la mascota se perdió o la encontraste";
  if (!ESPECIES.includes(datos.especie)) return "Elige la especie de tu mascota";
  if (!datos.barrio?.trim()) return "Elige el barrio donde se perdió";
  if (!datos.fecha) return "Indica la fecha en que se perdió";
  if (!datos.descripcion?.trim()) return "Describe a tu mascota para que la reconozcan";
  return null;
}

const TEXTOS_REPORTE = {
  PERDIDA: {
    titulo: "Perdí mi mascota",
    subtitulo: "Cuéntanos cómo es y dónde se perdió para que otras personas te ayuden a encontrarla.",
    preguntaFecha: "¿Cuándo se perdió?",
  },
  ENCONTRADA: {
    titulo: "Encontré una mascota",
    subtitulo: "Cuéntanos cómo es y dónde la encontraste para que su dueño pueda recuperarla.",
    preguntaFecha: "¿Cuándo la encontraste?",
  },
};

export function textosReporte(tipo) {
  return TEXTOS_REPORTE[tipo];
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
