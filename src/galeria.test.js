import { fotoAmpliada } from "./galeria.js";

describe("Galeria", () => {
  it("deberia mostrar ampliada la primera foto al abrirla", () => {
    expect(fotoAmpliada(["frente.jpg", "perfil.jpg"], 0)).toEqual("frente.jpg");
  });

  it("deberia mostrar ampliada la foto elegida al abrirla", () => {
    expect(fotoAmpliada(["frente.jpg", "perfil.jpg", "cola.jpg"], 2)).toEqual("cola.jpg");
  });
});
