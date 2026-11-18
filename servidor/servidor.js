import http from "node:http";
import { crearManejador } from "./aplicacion.js";
import { barriosRepositorio } from "./barriosRepositorio.js";
import { publicacionesRepositorio } from "./publicacionesRepositorio.js";
import { usuariosRepositorio } from "./usuariosRepositorio.js";

const PUERTO = 3000;

http
  .createServer(crearManejador(publicacionesRepositorio, barriosRepositorio, usuariosRepositorio))
  .listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));
