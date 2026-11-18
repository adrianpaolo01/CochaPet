import { validarRegistro } from "../src/registro.js";

export async function registrarUsuario(repositorio, datos) {
  const error = validarRegistro(datos);
  if (error) return { error };
  if (await repositorio.buscarPorCorreo(datos.correo)) return { error: "Ese correo ya está registrado" };
  const usuario = await repositorio.crear(datos);
  return { usuario };
}
