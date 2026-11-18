import db from "../db/conexion.js";

export const usuariosRepositorio = {
  async buscarPorCorreo(correo) {
    const { rows } = await db.query("SELECT id FROM usuario WHERE lower(correo) = lower($1)", [correo.trim()]);
    return rows[0];
  },

  async crear({ nombre, correo, telefono, clave }) {
    const { rows } = await db.query(
      `INSERT INTO usuario (nombre, correo, telefono, clave_hash) VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, correo, telefono`,
      [nombre.trim(), correo.trim().toLowerCase(), telefono.trim(), clave]);
    return rows[0];
  },
};
