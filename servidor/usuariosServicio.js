import { validarRegistro } from "../src/registro.js";

export async function registrarUsuario(repositorio, datos) {
  const error = validarRegistro(datos);
  if (error) return { error };
  if (await repositorio.buscarUsuarioPorCorreo(datos.correo)) return { error: "Ese correo ya está registrado" };
  const { clave, ...usuario } = await repositorio.crear(datos);
  return { usuario };
}
