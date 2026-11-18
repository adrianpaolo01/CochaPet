import { registrarUsuario } from "./usuariosServicio.js";

const datos = { nombre: "Ana Perez", correo: "ana@correo.com", telefono: "71234567", clave: "secreta123" };

describe("Usuarios servicio", () => {
  it("deberia crear la cuenta con datos validos", async () => {
    const repositorio = { buscarPorCorreo: async () => undefined, crear: jest.fn(async () => ({ id: 1, ...datos })) };

    const resultado = await registrarUsuario(repositorio, datos);

    expect(repositorio.crear).toHaveBeenCalledWith(datos);
    expect(resultado.usuario.id).toEqual(1);
  });

  it("deberia dar error y no crear la cuenta si el correo ya esta registrado", async () => {
    const repositorio = { buscarPorCorreo: async () => ({ id: 7 }), crear: jest.fn() };

    const resultado = await registrarUsuario(repositorio, datos);

    expect(resultado).toEqual({ error: "Ese correo ya está registrado" });
    expect(repositorio.crear).not.toHaveBeenCalled();
  });
});
