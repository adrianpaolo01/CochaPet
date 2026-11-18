import { registrarUsuario } from "./usuariosServicio.js";

const datos = { nombre: "Ana Perez", correo: "ana@correo.com", telefono: "71234567", clave: "secreta123" };

describe("Usuarios servicio", () => {
  it("deberia crear la cuenta con datos validos", async () => {
    const repositorio = { buscarPorCorreo: async () => undefined, crear: jest.fn(async () => ({ id: 1, ...datos })) };

    const resultado = await registrarUsuario(repositorio, datos);

    expect(repositorio.crear).toHaveBeenCalledWith(datos);
    expect(resultado.usuario.id).toEqual(1);
  });
});
