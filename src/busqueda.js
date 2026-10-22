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

export function filtrarPorBarrio(publicaciones, barrio) {
  return filtrarPorCampo(publicaciones, "barrio", barrio);
}

export function filtrarPorEspecie(publicaciones, especie) {
  return filtrarPorCampo(publicaciones, "especie", especie);
}

export function opcionesDe(publicaciones, campo) {
  const valores = publicaciones.map((p) => p[campo]).filter(Boolean);
  return [...new Set(valores)].sort((a, b) => a.localeCompare(b, "es"));
}

export function filtrarMascotas(publicaciones, { texto, raza, color, barrio = "" }) {
  return filtrarPorBarrio(filtrarPorColor(filtrarPorRaza(buscarPorNombre(publicaciones, texto), raza), color), barrio);
}
