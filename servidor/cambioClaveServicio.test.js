import { cambiarClave } from "./cambioClaveServicio.js";
import { hashearClave, verificarClave } from "./claves.js";

const usuario = { id: 7, correo: "ana@ejemplo.com" };
const datos = { claveActual: "anterior123", claveNueva: "nueva123", confirmacion: "nueva123" };
const claveHash = hashearClave(datos.claveActual);
const crearRepositorio = () => ({
  buscarUsuarioPorCorreo: jest.fn(async () => ({ ...usuario, claveHash })),
  actualizarClave: jest.fn(async () => true),
});

describe("Cambio de clave servicio", () => {
  it("deberia guardar la nueva clave como hash para el usuario de la sesion", async () => {
    const repositorio = crearRepositorio();
    expect(await cambiarClave(repositorio, usuario, datos)).toEqual({ ok: true });
    const [id, nuevaHash, anteriorHash] = repositorio.actualizarClave.mock.calls[0];
    expect([id, anteriorHash]).toEqual([usuario.id, claveHash]);
    expect(verificarClave(datos.claveNueva, nuevaHash)).toBe(true);
    expect(nuevaHash).not.toBe(datos.claveNueva);
  });
});
