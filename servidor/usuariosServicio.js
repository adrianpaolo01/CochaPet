export async function registrarUsuario(repositorio, datos) {
  if (await repositorio.buscarPorCorreo(datos.correo)) return { error: "Ese correo ya está registrado" };
  const usuario = await repositorio.crear(datos);
  return { usuario };
}
