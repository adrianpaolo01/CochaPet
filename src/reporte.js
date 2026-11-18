const ESPECIES = ["PERRO", "GATO", "OTRO"];

export function validarReporte(datos) {
  if (!ESPECIES.includes(datos.especie)) return "Elige la especie de tu mascota";
  if (!datos.barrio?.trim()) return "Elige el barrio donde se perdió";
  if (!datos.fecha) return "Indica la fecha en que se perdió";
  if (!datos.descripcion?.trim()) return "Describe a tu mascota para que la reconozcan";
}
