// Datos de ejemplo para desarrollo y demos: npm run db:seed
// Borra todos los datos y los vuelve a cargar. Nunca correr contra produccion.

import { randomBytes, scryptSync } from "node:crypto";
import db from "./conexion.js";
import { publicaciones } from "./publicacionesDemo.js";

const DIA = 24 * 60 * 60 * 1000;

function haceDias(dias) {
  return new Date(Date.now() - dias * DIA);
}

// Formato "sal:hash". El inicio de sesion (HU32) debe verificar con el mismo formato.
function hashClave(clave) {
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(clave, sal, 64).toString("hex");
  return `${sal}:${hash}`;
}

const barrios = [
  "Cala Cala",
  "Queru Queru",
  "Sarco",
  "Hipódromo",
  "Tupuraya",
  "Muyurina",
  "Las Cuadras",
  "Villa Busch",
  "Temporal",
  "Mayorazgo",
  "Aranjuez",
  "Pacata",
];

const usuarios = [
  { clave: "prueba", nombre: "Usuario de Prueba", correo: "prueba@cochapet.bo", telefono: "70000001", contrasena: "prueba123", rol: "USUARIO" },
  { clave: "ana", nombre: "Ana Mendoza", correo: "ana@cochapet.bo", telefono: "70000003", contrasena: "ana12345", rol: "USUARIO" },
  { clave: "admin", nombre: "Administrador CochaPet", correo: "admin@cochapet.bo", telefono: "70000002", contrasena: "admin123", rol: "ADMIN" },
];

// Valores de ejemplo: la empresa define los planes reales.
const planes = [
  { nombre: "Básico", precioBs: "50.00", duracionDias: 3, redes: "Facebook", zona: "Cercado", alcanceEstimado: 3000 },
  { nombre: "Estándar", precioBs: "100.00", duracionDias: 7, redes: "Facebook, Instagram", zona: "Cercado y alrededores", alcanceEstimado: 8000 },
  { nombre: "Premium", precioBs: "180.00", duracionDias: 14, redes: "Facebook, Instagram, TikTok", zona: "Todo Cochabamba", alcanceEstimado: 20000 },
];

const cliente = await db.connect();

try {
  await cliente.query("BEGIN");

  await cliente.query(
    "TRUNCATE aviso, mensaje, conversacion, promocion, plan, foto, publicacion, barrio, sesion, usuario RESTART IDENTITY CASCADE"
  );

  const idBarrio = {};
  for (const nombre of barrios) {
    const { rows } = await cliente.query("INSERT INTO barrio (nombre) VALUES ($1) RETURNING id", [nombre]);
    idBarrio[nombre] = rows[0].id;
  }

  const usuarioPorClave = {};
  for (const u of usuarios) {
    const { rows } = await cliente.query(
      "INSERT INTO usuario (nombre, correo, telefono, clave_hash, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [u.nombre, u.correo, u.telefono, hashClave(u.contrasena), u.rol]
    );
    usuarioPorClave[u.clave] = { id: rows[0].id, telefono: u.telefono };
  }

  const idPublicacion = {};
  for (const p of publicaciones) {
    const autor = usuarioPorClave[p.autor];
    const { rows } = await cliente.query(
      `INSERT INTO publicacion
         (tipo, especie, nombre, raza, color, descripcion, fecha, barrio_id, telefono_contacto, estado, autor_id, creado_en)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $7)
       RETURNING id`,
      [p.tipo, p.especie, p.nombre, p.raza, p.color, p.descripcion, haceDias(p.dias), idBarrio[p.barrio], autor.telefono, p.estado, autor.id]
    );
    const id = rows[0].id;
    if (p.clave) idPublicacion[p.clave] = id;

    for (const [orden, url] of p.fotos.entries()) {
      await cliente.query("INSERT INTO foto (url, orden, publicacion_id) VALUES ($1, $2, $3)", [url, orden, id]);
    }
  }

  const idPlan = {};
  for (const plan of planes) {
    const { rows } = await cliente.query(
      "INSERT INTO plan (nombre, precio_bs, duracion_dias, redes, zona, alcance_estimado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [plan.nombre, plan.precioBs, plan.duracionDias, plan.redes, plan.zona, plan.alcanceEstimado]
    );
    idPlan[plan.nombre] = rows[0].id;
  }

  // Una promocion En curso para que el inicio muestre una "Destacada" (HU13).
  const inicio = haceDias(1);
  await cliente.query(
    `INSERT INTO promocion (publicacion_id, plan_id, estado, metodo_pago, monto_bs, pagada_en, inicio_en, fin_en)
     VALUES ($1, $2, 'EN_CURSO', 'QR', $3, $4, $5, $6)`,
    [idPublicacion.firulais, idPlan["Estándar"], "100.00", haceDias(2), inicio, new Date(inicio.getTime() + 7 * DIA)]
  );

  await cliente.query("COMMIT");
  console.log(
    `Seed cargado: ${barrios.length} barrios, ${usuarios.length} usuarios, ${publicaciones.length} publicaciones, ${planes.length} planes, 1 promoción En curso.`
  );
} catch (error) {
  await cliente.query("ROLLBACK");
  throw error;
} finally {
  cliente.release();
  await db.end();
}
