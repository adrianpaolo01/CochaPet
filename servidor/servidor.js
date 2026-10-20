import http from "node:http";
import { crearManejador } from "./aplicacion.js";
import { publicacionesRepositorio } from "./publicacionesRepositorio.js";

const PUERTO = 3000;

http
  .createServer(crearManejador(publicacionesRepositorio))
  .listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));
