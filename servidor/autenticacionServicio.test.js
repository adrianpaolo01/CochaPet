import { scryptSync } from "node:crypto";
import { iniciarSesion } from "./autenticacionServicio.js";

const SAL = "00ff00ff00ff00ff00ff00ff00ff00ff";
const claveHash = `${SAL}:${scryptSync("prueba123", SAL, 64).toString("hex")}`;
const usuario = { id: 1, nombre: "Usuario de Prueba", correo: "prueba@cochapet.bo", telefono: "70000001", rol: "USUARIO", claveHash };
const repositorio = { buscarUsuarioPorCorreo: async () => usuario, crearSesion: async () => {} };

describe("Autenticacion servicio", () => {
  it("deberia iniciar sesion con el correo y la clave correctos", async () => {
    const resultado = await iniciarSesion(repositorio, { correo: "prueba@cochapet.bo", clave: "prueba123" });
    expect(resultado.ok).toBe(true);
  });

  it("deberia rechazar una clave incorrecta con un mensaje general", async () => {
    const resultado = await iniciarSesion(repositorio, { correo: "prueba@cochapet.bo", clave: "equivocada" });
    expect(resultado).toEqual({ ok: false, estado: 401, error: "Correo o contraseña incorrectos" });
  });

  it("deberia rechazar un correo inexistente con el mismo mensaje general", async () => {
    const sinUsuario = { ...repositorio, buscarUsuarioPorCorreo: async () => undefined };
    const resultado = await iniciarSesion(sinUsuario, { correo: "nadie@cochapet.bo", clave: "prueba123" });
    expect(resultado).toEqual({ ok: false, estado: 401, error: "Correo o contraseña incorrectos" });
  });
});
