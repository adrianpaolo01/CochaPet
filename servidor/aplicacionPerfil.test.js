import { crearManejador } from "./aplicacion.js";

async function pedirMisPublicaciones(headers, repositorio = {}, autenticacionRepositorio = {}) {
  const respuesta = { writeHead: jest.fn(), end: jest.fn() };
  await crearManejador(repositorio, {}, autenticacionRepositorio)({ method: "GET", url: "/api/mis-publicaciones", headers }, respuesta);
  return { estado: respuesta.writeHead.mock.calls[0][0], cuerpo: JSON.parse(respuesta.end.mock.calls[0][0]) };
}

describe("GET /api/mis-publicaciones", () => {
  it("responde 401 si no hay sesion", async () => {
    const { estado, cuerpo } = await pedirMisPublicaciones({});
    expect(estado).toBe(401);
    expect(cuerpo).toEqual({ error: "Inicia sesion para ver tus publicaciones" });
  });

  it("responde 200 con las publicaciones del usuario de la sesion", async () => {
    const autenticacionRepositorio = { obtenerSesion: async () => ({ expiraEn: new Date(Date.now() + 60000), usuario: { id: 7 } }) };
    const repositorio = { listarPorAutor: jest.fn(async () => [{ id: 1, estado: "ACTIVA" }]) };
    const { estado, cuerpo } = await pedirMisPublicaciones({ cookie: "sesion=abc123" }, repositorio, autenticacionRepositorio);
    expect(estado).toBe(200);
    expect(cuerpo).toEqual([{ id: 1, estado: "ACTIVA" }]);
    expect(repositorio.listarPorAutor).toHaveBeenCalledWith(7);
  });
});

async function pedirPerfil(metodo, { headers = {}, datos, autenticacionRepositorio = {} }) {
  const respuesta = { writeHead: jest.fn(), end: jest.fn() };
  const peticion = { method: metodo, url: "/api/perfil", headers, [Symbol.asyncIterator]: async function* () { yield JSON.stringify(datos); } };
  await crearManejador({}, {}, autenticacionRepositorio)(peticion, respuesta);
  const [estado] = respuesta.writeHead.mock.calls[0] ?? [];
  const [cuerpo] = respuesta.end.mock.calls[0] ?? [];
  return { estado, cuerpo: cuerpo && JSON.parse(cuerpo) };
}

describe("PUT /api/perfil", () => {
  it("responde 401 si no hay sesion", async () => {
    const { estado } = await pedirPerfil("PUT", { datos: { nombre: "Ana", telefono: "71234567" } });
    expect(estado).toBe(401);
  });

  it("responde 200 con mis datos guardados y 400 si son invalidos", async () => {
    const autenticacionRepositorio = {
      obtenerSesion: async () => ({ expiraEn: new Date(Date.now() + 60000), usuario: { id: 7 } }),
      actualizar: async (id, nuevos) => ({ id, ...nuevos }),
    };
    const nuevos = { nombre: "Ana", telefono: "71234567", foto: "" };
    expect(await pedirPerfil("PUT", { headers: { cookie: "sesion=abc" }, datos: nuevos, autenticacionRepositorio })).toEqual({ estado: 200, cuerpo: { id: 7, ...nuevos } });
    expect((await pedirPerfil("PUT", { headers: { cookie: "sesion=abc" }, datos: { ...nuevos, telefono: "" }, autenticacionRepositorio })).estado).toBe(400);
  });
});

describe("DELETE /api/perfil", () => {
  it("responde 401 si no hay sesion", async () => {
    expect(await pedirPerfil("DELETE", {})).toEqual({ estado: 401, cuerpo: { error: "Inicia sesion para eliminar tu cuenta" } });
  });
});
