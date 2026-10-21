import db from "../db/conexion.js";

export const publicacionesRepositorio = {
  async listar() {
    const { rows } = await db.query(`
      SELECT p.id, p.tipo, p.especie, p.nombre, p.raza, p.color, p.fecha, p.estado,
             b.nombre AS barrio,
             coalesce(array_agg(f.url ORDER BY f.orden) FILTER (WHERE f.id IS NOT NULL), '{}') AS fotos,
             EXISTS (SELECT 1 FROM promocion pr WHERE pr.publicacion_id = p.id AND pr.estado = 'EN_CURSO') AS destacada
      FROM publicacion p
      JOIN barrio b ON b.id = p.barrio_id
      LEFT JOIN foto f ON f.publicacion_id = p.id
      GROUP BY p.id, b.nombre`);
    return rows;
  },

  async obtenerPorId(id) {
    const { rows } = await db.query(`
      SELECT p.id, p.tipo, p.especie, p.nombre, p.raza, p.color, p.descripcion, p.fecha, p.estado,
             p.telefono_contacto AS telefono, b.nombre AS barrio,
             coalesce(array_agg(f.url ORDER BY f.orden) FILTER (WHERE f.id IS NOT NULL), '{}') AS fotos
      FROM publicacion p
      JOIN barrio b ON b.id = p.barrio_id
      LEFT JOIN foto f ON f.publicacion_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, b.nombre`, [id]);
    return rows[0];
  },
};
