import { barriosParaLista } from "./barriosServicio.js";
import { detalleDePublicacion, publicacionesParaInicio } from "./publicacionesServicio.js";

function responderJson(res, estado, datos) {
  res.writeHead(estado, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(datos));
}

export async function manejarErrores(res, mensaje, accion) {
  try {
    await accion();
  } catch (error) {
    console.error(error);
    responderJson(res, 500, { error: mensaje });
  }
}

export function crearManejador(repositorio, barriosRepositorio) {
  return async (req, res) => {
    const ruta = new URL(req.url, "http://localhost").pathname;
    if (req.method === "GET" && ruta === "/api/publicaciones") {
      return manejarErrores(res, "No se pudieron cargar las publicaciones", async () =>
        responderJson(res, 200, await publicacionesParaInicio(repositorio)));
    }
    const detalle = ruta.match(/^\/api\/publicaciones\/(\d+)$/);
    if (req.method === "GET" && detalle) {
      return manejarErrores(res, "No se pudo cargar la publicacion", async () => {
        const publicacion = await detalleDePublicacion(repositorio, Number(detalle[1]));
        if (publicacion) responderJson(res, 200, publicacion);
        else responderJson(res, 404, { error: "No encontrado" });
      });
    }
    if (req.method === "GET" && ruta === "/api/barrios") {
      return manejarErrores(res, "No se pudieron cargar los barrios", async () =>
        responderJson(res, 200, await barriosParaLista(barriosRepositorio)));
    }
    responderJson(res, 404, { error: "No encontrado" });
  };
}
