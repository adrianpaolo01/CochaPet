function capitalizar(texto) {
  return texto.charAt(0) + texto.slice(1).toLowerCase();
}

export function tituloPublicacion(publicacion) {
  if (publicacion.nombre) return publicacion.nombre;
  return capitalizar(publicacion.especie);
}

export function etiquetaEstado(publicacion) {
  return capitalizar(publicacion.tipo);
}
