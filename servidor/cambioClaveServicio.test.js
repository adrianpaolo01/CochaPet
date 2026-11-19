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
  it("deberia validar los datos en el servidor antes de consultar la cuenta", async () => {
    const repositorio = crearRepositorio();
    const resultado = await cambiarClave(repositorio, usuario, { ...datos, claveNueva: "corta", confirmacion: "corta" });
    expect(resultado).toEqual({ ok: false, estado: 400, error: "La nueva contraseña debe tener al menos 8 caracteres" });
    expect(repositorio.buscarUsuarioPorCorreo).not.toHaveBeenCalled();
    expect(repositorio.actualizarClave).not.toHaveBeenCalled();
  });

  it("deberia rechazar la clave actual incorrecta sin guardar", async () => {
    const repositorio = crearRepositorio();
    expect(await cambiarClave(repositorio, usuario, { ...datos, claveActual: "incorrecta" }))
      .toEqual({ ok: false, estado: 400, error: "La contraseña actual es incorrecta" });
    expect(repositorio.actualizarClave).not.toHaveBeenCalled();
  });

  it("deberia guardar la nueva clave como hash para el usuario de la sesion", async () => {
    const repositorio = crearRepositorio();
    expect(await cambiarClave(repositorio, usuario, datos)).toEqual({ ok: true });
    const [id, nuevaHash, anteriorHash] = repositorio.actualizarClave.mock.calls[0];
    expect([id, anteriorHash]).toEqual([usuario.id, claveHash]);
    expect(verificarClave(datos.claveNueva, nuevaHash)).toBe(true);
    expect(nuevaHash).not.toBe(datos.claveNueva);
  });
});
