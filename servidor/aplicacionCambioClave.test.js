import { Readable } from "node:stream";
import { crearManejador } from "./aplicacion.js";

async function cambiar(datos, repositorio = {}, cookie = "") {
  const req = Object.assign(Readable.from([JSON.stringify(datos)]), { method: "PATCH", url: "/api/usuarios/clave", headers: { cookie } });
  const res = { writeHead: jest.fn(), end: jest.fn() };
  await crearManejador({}, {}, repositorio)(req, res);
  return { estado: res.writeHead.mock.calls[0][0], cuerpo: JSON.parse(res.end.mock.calls[0][0]) };
}

describe("PATCH /api/usuarios/clave", () => {
  it("deberia exigir sesion antes de leer las credenciales", async () => {
    expect(await cambiar({})).toEqual({ estado: 401, cuerpo: { error: "Inicia sesión para cambiar tu contraseña" } });
  });
});
