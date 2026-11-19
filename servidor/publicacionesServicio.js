import { validarReporte } from "../src/reporte.js";

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

export async function reportarPerdida(repositorios, usuario, datos) {
  const error = validarReporte(datos);
  if (error) return { error };
  const barrios = await repositorios.barrios.listar();
  if (!barrios.some((b) => b.nombre === datos.barrio)) return { error: "Elige un barrio de Cochabamba" };
  const publicacion = await repositorios.publicaciones.crear({ tipo: "PERDIDA", ...datos, autorId: usuario.id, telefono: usuario.telefono });
  return { publicacion };
}
