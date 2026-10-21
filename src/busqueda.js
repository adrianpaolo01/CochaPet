export function buscarPorNombre(publicaciones, texto) {
  if (texto === "") return publicaciones;
  const termino = texto.toLowerCase();
  return publicaciones.filter((p) => p.nombre && p.nombre.toLowerCase().includes(termino));
}

export function mensajeBusqueda(publicaciones) {
  return publicaciones.length === 0 ? "No se encontraron mascotas." : null;
}

export function filtrarPorRaza(publicaciones, raza) {
  if (raza === "") return publicaciones;
  return publicaciones.filter((p) => p.raza && p.raza.toLowerCase() === raza.toLowerCase());
}
