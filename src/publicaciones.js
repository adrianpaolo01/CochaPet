const PREFIJO_BOLIVIA = "591";

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

export function badgeEstado(publicacion) {
  return { texto: etiquetaEstado(publicacion), clase: `badge badge-${publicacion.tipo.toLowerCase()}` };
}

export function caracteristicasMascota({ especie, raza, color }) {
  const datos = [`Especie: ${capitalizar(especie)}`];
  if (raza) datos.push(`Raza: ${raza}`);
  if (color) datos.push(`Color: ${color}`);
  return datos.join(" · ");
}

export function formatearFecha(fecha) {
  const fechaConvertida = new Date(fecha);
  const dia = String(fechaConvertida.getDate()).padStart(2, "0");
  const mes = String(fechaConvertida.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${fechaConvertida.getFullYear()}`;
}

export function fotoPrincipal(publicacion) {
  return publicacion.fotos[0] ?? null;
}

export function ordenarParaInicio(publicaciones) {
  return [...publicaciones].sort(
    (a, b) => Number(b.destacada) - Number(a.destacada) || new Date(b.fecha) - new Date(a.fecha)
  );
}

export function mensajeInicio(publicaciones) {
  return publicaciones.length === 0 ? "Todavía no hay mascotas publicadas." : null;
}

export function mensajeDetalle(respuesta) {
  return respuesta.ok ? null : "Esta publicación no existe o ya no está disponible";
}

export function idDesdeHash(hash) {
  const coincidencia = hash.match(/^#\/mascota\/(\d+)$/);
  return coincidencia ? Number(coincidencia[1]) : null;
}

export function enlaceWhatsApp(publicacion) {
  const nombreMascota = publicacion.nombre ?? `tu ${publicacion.especie.toLowerCase()}`;
  const mensaje = `Hola, creo que encontré a ${nombreMascota}, la mascota que publicaste en CochaPet.`;
  return `https://wa.me/${PREFIJO_BOLIVIA}${publicacion.telefono}?text=${encodeURIComponent(mensaje)}`;
}

export function enlaceLlamada(publicacion) {
  return `tel:+${PREFIJO_BOLIVIA}${publicacion.telefono}`;
}
