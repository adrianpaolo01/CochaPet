import { saludoSesion } from "./sesion.js";

describe("Sesion", () => {
  it("deberia saludar al usuario con su primer nombre", () => {
    expect(saludoSesion({ nombre: "Ana Maria Perez" })).toEqual("Hola, Ana");
  });
});
