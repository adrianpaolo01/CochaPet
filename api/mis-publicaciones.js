import { crearManejador } from "../servidor/aplicacion.js";
import { autenticacionRepositorio } from "../servidor/autenticacionRepositorio.js";
import { publicacionesRepositorio } from "../servidor/publicacionesRepositorio.js";

export default crearManejador(publicacionesRepositorio, null, autenticacionRepositorio);
