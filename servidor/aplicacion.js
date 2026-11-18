import { iniciarSesion } from "./autenticacionServicio.js";
import { barriosParaLista } from "./barriosServicio.js";
import { cookieDeSesion } from "./cookies.js";
import { detalleDePublicacion, publicacionesParaInicio } from "./publicacionesServicio.js";

const LIMITE_CUERPO = 10000;

function responderJson(res, estado, datos, cabeceras = {}) {
  res.writeHead(estado, { "Content-Type": "application/json; charset=utf-8", ...cabeceras });
  res.end(JSON.stringify(datos));
}

async function leerCuerpoJson(req) {
  const partes = [];
  let total = 0;
  for await (const parte of req) {
    total += parte.length;
    if (total > LIMITE_CUERPO) return { ok: false, estado: 413, error: "Los datos enviados son demasiado grandes" };
    partes.push(Buffer.from(parte));
  }
  try {
    const datos = JSON.parse(Buffer.concat(partes).toString("utf8"));
    if (datos !== null && typeof datos === "object") return { ok: true, datos };
  } catch {
    // el cuerpo no es JSON: se responde igual que un objeto invalido
  }
  return { ok: false, estado: 400, error: "Los datos enviados no son validos" };
}

export async function manejarErrores(res, mensaje, accion) {
  try {
    await accion();
  } catch (error) {
    console.error(error);
    responderJson(res, 500, { error: mensaje });
  }
}

export function crearManejador(repositorio, barriosRepositorio, autenticacionRepositorio) {
  return async (req, res) => {
    const ruta = new URL(req.url, "http://localhost").pathname;
    if (req.method === "POST" && ruta === "/api/sesion") {
      return manejarErrores(res, "No se pudo iniciar sesion", async () => {
        const entrada = await leerCuerpoJson(req);
        if (!entrada.ok) return responderJson(res, entrada.estado, { error: entrada.error });
        const resultado = await iniciarSesion(autenticacionRepositorio, entrada.datos);
        if (!resultado.ok) return responderJson(res, resultado.estado, { error: resultado.error });
        const seguro = req.headers?.["x-forwarded-proto"] === "https";
        const cookie = cookieDeSesion(resultado.token, resultado.expiraEn, { seguro });
        responderJson(res, 200, { usuario: resultado.usuario }, { "Set-Cookie": cookie });
      });
    }
    if (req.method === "GET" && ruta === "/api/publicaciones") {
      return manejarErrores(res, "No se pudieron cargar las publicaciones", async () =>
        responderJson(res, 200, await publicacionesParaInicio(repositorio)));
    }
    const detalle = ruta.match(/^\/api\/publicaciones\/(\d+)$/);
    if (req.method === "GET" && detalle) {
      return manejarErrores(res, "No se pudo cargar la publicacion", async () => {
        const publicacion = await detalleDePublicacion(repositorio, Number(detalle[1]));
        if (publicacion) responderJson(res, 200, publicacion);
        else responderJson(res, 404, { error: "No encontrado" });
      });
    }
    if (req.method === "GET" && ruta === "/api/barrios") {
      return manejarErrores(res, "No se pudieron cargar los barrios", async () =>
        responderJson(res, 200, await barriosParaLista(barriosRepositorio)));
    }
    responderJson(res, 404, { error: "No encontrado" });
  };
}
