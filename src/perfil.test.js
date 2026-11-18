import { textoEstado } from "./perfil.js";

describe("Perfil", () => {
  it("deberia mostrar Activa para una publicacion activa", () => {
    expect(textoEstado("ACTIVA")).toEqual("Activa");
  });

  it("deberia mostrar Volvio a casa para una publicacion resuelta", () => {
    expect(textoEstado("VOLVIO_A_CASA")).toEqual("Volvió a casa");
  });
});
