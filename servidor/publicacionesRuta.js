import { publicacionesParaInicio } from "./publicacionesServicio.js";
import { publicacionesRepositorio } from "./publicacionesRepositorio.js";

export function responderJson(res, estado, datos) {
  res.writeHead(estado, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(datos));
}

// GET /api/publicaciones. La usan servidor.js (local) y api/publicaciones.js (Vercel).
export async function manejarPublicaciones(req, res) {
  if (req.method !== "GET") {
    responderJson(res, 405, { error: "Metodo no permitido" });
    return;
  }
  try {
    responderJson(res, 200, await publicacionesParaInicio(publicacionesRepositorio));
  } catch (error) {
    console.error(error);
    responderJson(res, 500, { error: "No se pudieron cargar las publicaciones" });
  }
}
