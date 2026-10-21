import db from "../db/conexion.js";

export const barriosRepositorio = {
  async listar() {
    const { rows } = await db.query("SELECT id, nombre FROM barrio");
    return rows;
  },
};
