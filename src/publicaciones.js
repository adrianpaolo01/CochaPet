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

export function formatearFecha(fecha) {
  const f = new Date(fecha);
  const dia = String(f.getDate()).padStart(2, "0");
  const mes = String(f.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${f.getFullYear()}`;
}

export function fotoPrincipal(publicacion) {
  return publicacion.fotos[0];
}

export function ordenarParaInicio(publicaciones) {
  return [...publicaciones].sort(
    (a, b) => Number(b.destacada) - Number(a.destacada) || new Date(b.fecha) - new Date(a.fecha)
  );
}

export function mensajeInicio(publicaciones) {
  return publicaciones.length === 0 ? "Todavía no hay mascotas publicadas." : null;
}

export function idDesdeHash(hash) {
  const coincidencia = hash.match(/^#\/mascota\/(\d+)$/);
  return coincidencia ? Number(coincidencia[1]) : null;
}
