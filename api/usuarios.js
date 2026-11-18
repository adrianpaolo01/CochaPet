import { crearManejador } from "../servidor/aplicacion.js";
import { usuariosRepositorio } from "../servidor/usuariosRepositorio.js";

export default crearManejador(null, null, usuariosRepositorio);
