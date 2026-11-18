export async function publicacionesParaInicio(repositorio) {
  const publicaciones = await repositorio.listar();
  return publicaciones.filter((p) => p.estado === "ACTIVA");
}

export async function detalleDePublicacion(repositorio, id) {
  const publicacion = await repositorio.obtenerPorId(id);
  return publicacion?.estado === "ACTIVA" ? publicacion : null;
}

export async function misPublicaciones(repositorio, autorId) {
  const publicaciones = await repositorio.listarPorAutor(autorId);
  return publicaciones.filter((p) => p.estado !== "OCULTA");
}
