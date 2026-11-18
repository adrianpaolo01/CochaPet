import { crearManejador } from "../servidor/aplicacion.js";
import { autenticacionRepositorio } from "../servidor/autenticacionRepositorio.js";
import { barriosRepositorio } from "../servidor/barriosRepositorio.js";
import { publicacionesRepositorio } from "../servidor/publicacionesRepositorio.js";

export default crearManejador(publicacionesRepositorio, barriosRepositorio, autenticacionRepositorio);
