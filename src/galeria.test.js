import { anteriorIndice, fotoAmpliada, hayVariasFotos, siguienteIndice } from "./galeria.js";

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

  it("deberia volver a la foto anterior", () => {
    expect(anteriorIndice(2, 3)).toEqual(1);
  });

  it("deberia ir a la ultima foto antes de la primera", () => {
    expect(anteriorIndice(0, 3)).toEqual(2);
  });

  it("deberia permitir pasar de foto cuando hay varias", () => {
    expect(hayVariasFotos(["frente.jpg", "perfil.jpg"])).toBe(true);
  });

  it("deberia no permitir pasar de foto cuando hay una sola", () => {
    expect(hayVariasFotos(["frente.jpg"])).toBe(false);
  });
});
