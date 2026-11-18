import db from "../db/conexion.js";

export const autenticacionRepositorio = {
  async buscarUsuarioPorCorreo(correo) {
    const { rows } = await db.query(
      `SELECT id, nombre, correo, telefono, rol, clave_hash AS "claveHash"
       FROM usuario WHERE lower(correo) = lower($1)`,
      [correo]
    );
    return rows[0];
  },

  async crear({ nombre, correo, telefono, claveHash }) {
    const { rows } = await db.query(
      `INSERT INTO usuario (nombre, correo, telefono, clave_hash) VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, correo, telefono, rol`,
      [nombre.trim(), correo.trim().toLowerCase(), telefono.trim(), claveHash]);
    return rows[0];
  },

  async eliminarSesion(id) {
    await db.query("DELETE FROM sesion WHERE id = $1", [id]);
  },

  async crearSesion({ id, usuarioId, expiraEn }) {
    await db.query("DELETE FROM sesion WHERE expira_en < now()");
    await db.query("INSERT INTO sesion (id, usuario_id, expira_en) VALUES ($1, $2, $3)", [id, usuarioId, expiraEn]);
  },

  async obtenerSesion(id) {
    const { rows } = await db.query(
      `SELECT s.expira_en AS "expiraEn", u.id, u.nombre, u.correo, u.telefono, u.rol
       FROM sesion s JOIN usuario u ON u.id = s.usuario_id
       WHERE s.id = $1`,
      [id]
    );
    if (!rows[0]) return undefined;
    const { expiraEn, ...usuario } = rows[0];
    return { expiraEn, usuario };
  },
};
