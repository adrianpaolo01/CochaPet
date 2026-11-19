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

async function editarPerfil(headers, datos, autenticacionRepositorio = {}) {
  const respuesta = { writeHead: jest.fn(), end: jest.fn() };
  const peticion = { method: "PUT", url: "/api/perfil", headers, [Symbol.asyncIterator]: async function* () { yield JSON.stringify(datos); } };
  await crearManejador({}, {}, autenticacionRepositorio)(peticion, respuesta);
  return { estado: respuesta.writeHead.mock.calls[0][0], cuerpo: JSON.parse(respuesta.end.mock.calls[0][0]) };
}

describe("PUT /api/perfil", () => {
  it("responde 401 si no hay sesion", async () => {
    const { estado } = await editarPerfil({}, { nombre: "Ana", telefono: "71234567" });
    expect(estado).toBe(401);
  });

  it("responde 200 con mis datos guardados y 400 si son invalidos", async () => {
    const autenticacionRepositorio = {
      obtenerSesion: async () => ({ expiraEn: new Date(Date.now() + 60000), usuario: { id: 7 } }),
      actualizar: async (id, nuevos) => ({ id, ...nuevos }),
    };
    const nuevos = { nombre: "Ana", telefono: "71234567", foto: "" };
    expect(await editarPerfil({ cookie: "sesion=abc" }, nuevos, autenticacionRepositorio)).toEqual({ estado: 200, cuerpo: { id: 7, ...nuevos } });
    expect((await editarPerfil({ cookie: "sesion=abc" }, { ...nuevos, telefono: "" }, autenticacionRepositorio)).estado).toBe(400);
  });
});
