export async function registrarUsuario(repositorio, datos) {
  const usuario = await repositorio.crear(datos);
  return { usuario };
}
