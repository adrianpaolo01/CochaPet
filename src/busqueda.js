export function buscarPorNombre(publicaciones, texto) {
  if (texto === "") return publicaciones;
  const termino = texto.toLowerCase();
  return publicaciones.filter((p) => p.nombre && p.nombre.toLowerCase().includes(termino));
}

export function mensajeBusqueda(publicaciones) {
  return publicaciones.length === 0 ? "No se encontraron mascotas." : null;
}

function filtrarPorCampo(publicaciones, campo, valor) {
  if (valor === "") return publicaciones;
  return publicaciones.filter((p) => p[campo] && p[campo].toLowerCase() === valor.toLowerCase());
}

export function filtrarPorRaza(publicaciones, raza) {
  return filtrarPorCampo(publicaciones, "raza", raza);
}

export function filtrarPorColor(publicaciones, color) {
  return filtrarPorCampo(publicaciones, "color", color);
}
