import { tituloPublicacion } from "./publicaciones.js";

describe("Publicaciones", () => {
  it("deberia usar el nombre de la mascota como titulo", () => {
    expect(tituloPublicacion({ nombre: "Firulais", especie: "PERRO" })).toEqual("Firulais");
  });
});
