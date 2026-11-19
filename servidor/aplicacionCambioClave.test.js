import { Readable } from "node:stream";
import { crearManejador } from "./aplicacion.js";
import { hashearClave, verificarClave } from "./claves.js";
import { iniciarSesion } from "./autenticacionServicio.js";

const datos = { claveActual: "anterior123", claveNueva: "nueva123", confirmacion: "nueva123" };
const usuario = { id: 7, correo: "ana@ejemplo.com" };
const claveHash = hashearClave(datos.claveActual);
const crearRepositorio = () => ({
  obtenerSesion: async () => ({ expiraEn: new Date(Date.now() + 60000), usuario }),
  buscarUsuarioPorCorreo: async () => ({ ...usuario, claveHash }),
  actualizarClave: jest.fn(async () => true),
});

async function cambiar(datos, repositorio = {}, cookie = "") {
  const req = Object.assign(Readable.from([JSON.stringify(datos)]), { method: "PATCH", url: "/api/usuarios/clave", headers: { cookie } });
  const res = { writeHead: jest.fn(), end: jest.fn() };
  await crearManejador({}, {}, repositorio)(req, res);
  return { estado: res.writeHead.mock.calls[0]?.[0], cuerpo: res.end.mock.calls[0] ? JSON.parse(res.end.mock.calls[0][0]) : undefined };
}

describe("PATCH /api/usuarios/clave", () => {
  it("deberia permitir entrar con la nueva clave y rechazar la anterior", async () => {
    const cuenta = { ...usuario, claveHash };
    const repositorio = { ...crearRepositorio(), crearSesion: async () => {},
      buscarUsuarioPorCorreo: async () => cuenta,
      actualizarClave: async (_id, hash) => { cuenta.claveHash = hash; return true; } };
    expect((await cambiar(datos, repositorio, "sesion=token")).estado).toBe(200);
    expect((await iniciarSesion(repositorio, { correo: usuario.correo, clave: datos.claveNueva })).ok).toBe(true);
    expect((await iniciarSesion(repositorio, { correo: usuario.correo, clave: datos.claveActual })).ok).toBe(false);
  });

  it("deberia rechazar sesiones vencidas o inexistentes sin guardar", async () => {
    for (const sesion of [undefined, { expiraEn: new Date(0), usuario }]) {
      const repositorio = { ...crearRepositorio(), obtenerSesion: async () => sesion };
      expect((await cambiar(datos, repositorio, "sesion=token")).estado).toBe(401);
      expect(repositorio.actualizarClave).not.toHaveBeenCalled();
    }
  });

  it("deberia conservar la clave ante credenciales o confirmacion invalidas", async () => {
    for (const cambios of [{ claveActual: "incorrecta" }, { claveNueva: "corta" }, { confirmacion: "otra1234" }, { claveActual: null }]) {
      const repositorio = crearRepositorio();
      expect((await cambiar({ ...datos, ...cambios }, repositorio, "sesion=token")).estado).toBe(400);
      expect(repositorio.actualizarClave).not.toHaveBeenCalled();
    }
  });

  it("deberia guardar la clave y confirmar para el usuario de la cookie", async () => {
    const repositorio = crearRepositorio();
    expect(await cambiar({ ...datos, usuarioId: 99 }, repositorio, "sesion=token"))
      .toEqual({ estado: 200, cuerpo: { mensaje: "Contraseña actualizada." } });
    const [id, hash] = repositorio.actualizarClave.mock.calls[0];
    expect(id).toBe(7);
    expect(verificarClave(datos.claveNueva, hash)).toBe(true);
  });

  it("deberia exigir sesion antes de leer las credenciales", async () => {
    expect(await cambiar({})).toEqual({ estado: 401, cuerpo: { error: "Inicia sesión para cambiar tu contraseña" } });
  });
});
