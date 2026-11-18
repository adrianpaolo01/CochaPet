import { textoEstado } from "./perfil.js";

describe("Perfil", () => {
  it("deberia mostrar Activa para una publicacion activa", () => {
    expect(textoEstado("ACTIVA")).toEqual("Activa");
  });
});
