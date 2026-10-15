export async function publicacionesParaInicio(repositorio) {
  const publicaciones = await repositorio.listar();
  return publicaciones.filter((p) => p.estado === "ACTIVA");
}
