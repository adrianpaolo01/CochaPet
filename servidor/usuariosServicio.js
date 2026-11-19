import { validarDatosPerfil } from "../src/perfil.js";
import { validarRegistro } from "../src/registro.js";
import { hashearClave } from "./claves.js";

export async function registrarUsuario(repositorio, datos) {
  const error = validarRegistro(datos);
  if (error) return { error };
  if (await repositorio.buscarUsuarioPorCorreo(datos.correo)) return { error: "Ese correo ya está registrado" };
  const { clave, ...publicos } = datos;
  const { id, nombre, correo, telefono, rol } = await repositorio.crear({ ...publicos, claveHash: hashearClave(clave) });
  return { usuario: { id, nombre, correo, telefono, rol } };
}

export async function actualizarDatos(repositorio, usuarioId, { nombre, telefono, foto }) {
  const error = validarDatosPerfil({ nombre, telefono });
  if (error) return { error };
  return { usuario: await repositorio.actualizar(usuarioId, { nombre, telefono, foto }) };
}
