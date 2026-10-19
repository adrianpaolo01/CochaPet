import http from "node:http";
import { manejarPublicaciones, responderJson } from "./publicacionesRuta.js";

const PUERTO = 3000;

http
  .createServer(async (req, res) => {
    if (req.url === "/api/publicaciones") {
      await manejarPublicaciones(req, res);
      return;
    }
    responderJson(res, 404, { error: "No encontrado" });
  })
  .listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));
