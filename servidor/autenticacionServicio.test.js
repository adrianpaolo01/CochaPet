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
});
