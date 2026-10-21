export async function barriosParaLista(repositorio) {
  const barrios = await repositorio.listar();
  return barrios.map((b) => b.nombre).sort((a, b) => a.localeCompare(b, "es"));
}
