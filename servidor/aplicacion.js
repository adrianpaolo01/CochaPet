import { barriosParaLista } from "./barriosServicio.js";
import { detalleDePublicacion, publicacionesParaInicio } from "./publicacionesServicio.js";

function responderJson(res, estado, datos) {
  res.writeHead(estado, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(datos));
}

export function crearManejador(repositorio, barriosRepositorio) {
  return async (req, res) => {
    const ruta = new URL(req.url, "http://localhost").pathname;
    if (req.method === "GET" && ruta === "/api/publicaciones") {
      try {
        responderJson(res, 200, await publicacionesParaInicio(repositorio));
      } catch (error) {
        console.error(error);
        responderJson(res, 500, { error: "No se pudieron cargar las publicaciones" });
      }
      return;
    }
    const detalle = ruta.match(/^\/api\/publicaciones\/(\d+)$/);
    if (req.method === "GET" && detalle) {
      try {
        const publicacion = await detalleDePublicacion(repositorio, Number(detalle[1]));
        if (publicacion) responderJson(res, 200, publicacion);
        else responderJson(res, 404, { error: "No encontrado" });
      } catch (error) {
        console.error(error);
        responderJson(res, 500, { error: "No se pudo cargar la publicacion" });
      }
      return;
    }
    if (req.method === "GET" && ruta === "/api/barrios") {
      try {
        responderJson(res, 200, await barriosParaLista(barriosRepositorio));
      } catch (error) {
        console.error(error);
        responderJson(res, 500, { error: "No se pudieron cargar los barrios" });
      }
      return;
    }
    responderJson(res, 404, { error: "No encontrado" });
  };
}
