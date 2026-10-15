import fs from "node:fs";
import db from "./conexion.js";

const sql = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8");

try {
  await db.query(sql);
  console.log("Esquema creado.");
} finally {
  await db.end();
}
