export function buscarPorNombre(publicaciones, texto) {
  const termino = texto.toLowerCase();
  return publicaciones.filter((p) => p.nombre && p.nombre.toLowerCase().includes(termino));
}
