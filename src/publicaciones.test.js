import { tituloPublicacion } from "./publicaciones.js";

describe("Publicaciones", () => {
  it("deberia usar el nombre de la mascota como titulo", () => {
    expect(tituloPublicacion({ nombre: "Firulais", especie: "PERRO" })).toEqual("Firulais");
  });

  it("deberia usar la especie como titulo cuando no tiene nombre", () => {
    expect(tituloPublicacion({ nombre: null, especie: "PERRO" })).toEqual("Perro");
  });
});
