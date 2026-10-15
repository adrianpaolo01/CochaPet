import http from "node:http";
import { publicacionesParaInicio } from "./publicacionesServicio.js";
import { publicacionesRepositorio } from "./publicacionesRepositorio.js";

const PUERTO = 3000;

function responderJson(res, estado, datos) {
  res.writeHead(estado, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(datos));
}

http
  .createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/api/publicaciones") {
      try {
        responderJson(res, 200, await publicacionesParaInicio(publicacionesRepositorio));
      } catch (error) {
        console.error(error);
        responderJson(res, 500, { error: "No se pudieron cargar las publicaciones" });
      }
      return;
    }
    responderJson(res, 404, { error: "No encontrado" });
  })
  .listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));
