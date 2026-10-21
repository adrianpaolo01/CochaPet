import { fotoAmpliada, siguienteIndice } from "./galeria.js";

describe("Galeria", () => {
  it("deberia mostrar ampliada la primera foto al abrirla", () => {
    expect(fotoAmpliada(["frente.jpg", "perfil.jpg"], 0)).toEqual("frente.jpg");
  });

  it("deberia mostrar ampliada la foto elegida al abrirla", () => {
    expect(fotoAmpliada(["frente.jpg", "perfil.jpg", "cola.jpg"], 2)).toEqual("cola.jpg");
  });

  it("deberia no mostrar foto si la posicion no existe", () => {
    expect(fotoAmpliada(["frente.jpg"], 5)).toBeNull();
  });

  it("deberia pasar a la siguiente foto", () => {
    expect(siguienteIndice(0, 3)).toEqual(1);
  });

  it("deberia volver a la primera foto despues de la ultima", () => {
    expect(siguienteIndice(2, 3)).toEqual(0);
  });
});
