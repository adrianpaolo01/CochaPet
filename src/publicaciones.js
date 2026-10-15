export function tituloPublicacion(publicacion) {
  if (publicacion.nombre) return publicacion.nombre;
  return publicacion.especie.charAt(0) + publicacion.especie.slice(1).toLowerCase();
}

export function etiquetaEstado() {
  return "Perdida";
}
