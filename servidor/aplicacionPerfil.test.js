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
});
