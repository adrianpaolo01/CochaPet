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

  async listarPorAutor(autorId) {
    const { rows } = await db.query(`
      SELECT p.id, p.tipo, p.especie, p.nombre, p.fecha, p.estado, b.nombre AS barrio,
             coalesce(array_agg(f.url ORDER BY f.orden) FILTER (WHERE f.id IS NOT NULL), '{}') AS fotos
      FROM publicacion p
      JOIN barrio b ON b.id = p.barrio_id
      LEFT JOIN foto f ON f.publicacion_id = p.id
      WHERE p.autor_id = $1
      GROUP BY p.id, b.nombre
      ORDER BY p.fecha DESC`, [autorId]);
    return rows;
  },

  async obtenerPorId(id) {
    const { rows } = await db.query(`
      SELECT p.id, p.tipo, p.especie, p.nombre, p.raza, p.color, p.descripcion, p.fecha, p.estado,
             p.telefono_contacto AS telefono, b.nombre AS barrio,
             u.nombre AS autor, u.foto_url AS "autorFoto",
             coalesce(array_agg(f.url ORDER BY f.orden) FILTER (WHERE f.id IS NOT NULL), '{}') AS fotos
      FROM publicacion p
      JOIN barrio b ON b.id = p.barrio_id
      JOIN usuario u ON u.id = p.autor_id
      LEFT JOIN foto f ON f.publicacion_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, b.nombre, u.nombre, u.foto_url`, [id]);
    return rows[0];
  },

  async crear({ tipo, especie, nombre, raza, color, descripcion, fecha, barrio, telefono, autorId }) {
    const { rows } = await db.query(`
      INSERT INTO publicacion (tipo, especie, nombre, raza, color, descripcion, fecha, barrio_id, telefono_contacto, autor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, (SELECT id FROM barrio WHERE nombre = $8), $9, $10) RETURNING id`,
      [tipo, especie, nombre || null, raza || null, color || null, descripcion.trim(), fecha, barrio, telefono, autorId]);
    return rows[0];
  },
};
