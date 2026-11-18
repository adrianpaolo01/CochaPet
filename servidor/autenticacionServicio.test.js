import { scryptSync } from "node:crypto";
import { hashDeToken, iniciarSesion } from "./autenticacionServicio.js";

const SAL = "00ff00ff00ff00ff00ff00ff00ff00ff";
const claveHash = `${SAL}:${scryptSync("prueba123", SAL, 64).toString("hex")}`;
const usuario = { id: 1, nombre: "Usuario de Prueba", correo: "prueba@cochapet.bo", telefono: "70000001", rol: "USUARIO", claveHash };
const repositorio = { buscarUsuarioPorCorreo: async () => usuario, crearSesion: async () => {} };

describe("Autenticacion servicio", () => {
  it("deberia calcular el hash sha256 de un token", () => {
    expect(hashDeToken("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });

  it("deberia iniciar sesion con el correo y la clave correctos", async () => {
    const resultado = await iniciarSesion(repositorio, { correo: "prueba@cochapet.bo", clave: "prueba123" });
    expect(resultado.ok).toBe(true);
  });

  it("deberia devolver solo los datos publicos del usuario sin la clave guardada", async () => {
    const resultado = await iniciarSesion(repositorio, { correo: "prueba@cochapet.bo", clave: "prueba123" });
    expect(resultado.usuario).toEqual({ id: 1, nombre: "Usuario de Prueba", correo: "prueba@cochapet.bo", telefono: "70000001", rol: "USUARIO" });
  });

  it("deberia rechazar una clave incorrecta con un mensaje general", async () => {
    const resultado = await iniciarSesion(repositorio, { correo: "prueba@cochapet.bo", clave: "equivocada" });
    expect(resultado).toEqual({ ok: false, estado: 401, error: "Correo o contraseña incorrectos" });
  });

  it.each([["", "prueba123"], ["   ", "prueba123"], ["prueba@cochapet.bo", ""], [undefined, undefined], ["prueba@cochapet.bo", 123]])(
    "deberia pedir correo y clave sin consultar la base con %p y %p",
    async (correo, clave) => {
      const buscarUsuarioPorCorreo = jest.fn();
      const resultado = await iniciarSesion({ ...repositorio, buscarUsuarioPorCorreo }, { correo, clave });
      expect(resultado).toEqual({ ok: false, estado: 400, error: "Ingresa tu correo y tu contraseña" });
      expect(buscarUsuarioPorCorreo).not.toHaveBeenCalled();
    }
  );

  it("deberia buscar al usuario con el correo sin espacios sobrantes", async () => {
    const buscarUsuarioPorCorreo = jest.fn(async () => usuario);
    await iniciarSesion({ ...repositorio, buscarUsuarioPorCorreo }, { correo: "  prueba@cochapet.bo ", clave: "prueba123" });
    expect(buscarUsuarioPorCorreo).toHaveBeenCalledWith("prueba@cochapet.bo");
  });

  it("deberia rechazar un correo inexistente con el mismo mensaje general", async () => {
    const sinUsuario = { ...repositorio, buscarUsuarioPorCorreo: async () => undefined };
    const resultado = await iniciarSesion(sinUsuario, { correo: "nadie@cochapet.bo", clave: "prueba123" });
    expect(resultado).toEqual({ ok: false, estado: 401, error: "Correo o contraseña incorrectos" });
  });
});
