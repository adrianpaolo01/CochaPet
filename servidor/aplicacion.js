import { publicacionesParaInicio } from "./publicacionesServicio.js";

function responderJson(res, estado, datos) {
  res.writeHead(estado, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(datos));
}

export function crearManejador(repositorio) {
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
    responderJson(res, 404, { error: "No encontrado" });
  };
}
