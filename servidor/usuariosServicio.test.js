import { registrarUsuario } from "./usuariosServicio.js";

const datos = { nombre: "Ana Perez", correo: "ana@correo.com", telefono: "71234567", clave: "secreta123" };

describe("Usuarios servicio", () => {
  it("deberia crear la cuenta con datos validos", async () => {
    const repositorio = { buscarUsuarioPorCorreo: async () => undefined, crear: jest.fn(async () => ({ id: 1, ...datos })) };

    const resultado = await registrarUsuario(repositorio, datos);

    expect(repositorio.crear).toHaveBeenCalledWith(datos);
    expect(resultado.usuario.id).toEqual(1);
  });

  it("deberia devolver el usuario creado sin la contrasena", async () => {
    const repositorio = { buscarUsuarioPorCorreo: async () => undefined, crear: async () => ({ id: 1, ...datos }) };

    const { usuario } = await registrarUsuario(repositorio, datos);

    expect(usuario).toEqual({ id: 1, nombre: "Ana Perez", correo: "ana@correo.com", telefono: "71234567" });
  });

  it("deberia dar error y no crear la cuenta si el correo ya esta registrado", async () => {
    const repositorio = { buscarUsuarioPorCorreo: async () => ({ id: 7 }), crear: jest.fn() };

    const resultado = await registrarUsuario(repositorio, datos);

    expect(resultado).toEqual({ error: "Ese correo ya está registrado" });
    expect(repositorio.crear).not.toHaveBeenCalled();
  });

  it("deberia dar error y no crear la cuenta si la contrasena es corta", async () => {
    const repositorio = { buscarUsuarioPorCorreo: async () => undefined, crear: jest.fn() };

    const resultado = await registrarUsuario(repositorio, { ...datos, clave: "corta" });

    expect(resultado).toEqual({ error: "La contraseña debe tener al menos 8 caracteres" });
    expect(repositorio.crear).not.toHaveBeenCalled();
  });
});
