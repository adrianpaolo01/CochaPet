const ESPECIES = ["PERRO", "GATO", "OTRO"];

export function validarReporte(datos) {
  if (!ESPECIES.includes(datos.especie)) return "Elige la especie de tu mascota";
}
