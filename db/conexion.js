import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("Falta DATABASE_URL. Revisa el archivo .env en la raiz del proyecto.");
}

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export default db;
