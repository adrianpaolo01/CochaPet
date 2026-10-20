export function buscarPorNombre(publicaciones, texto) {
  if (texto === "") return publicaciones;
  const termino = texto.toLowerCase();
  return publicaciones.filter((p) => p.nombre && p.nombre.toLowerCase().includes(termino));
}
