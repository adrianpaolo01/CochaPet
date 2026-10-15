import { etiquetaEstado, tituloPublicacion } from "./publicaciones.js";

describe("Publicaciones", () => {
  it("deberia usar el nombre de la mascota como titulo", () => {
    expect(tituloPublicacion({ nombre: "Firulais", especie: "PERRO" })).toEqual("Firulais");
  });

  it("deberia usar la especie como titulo cuando no tiene nombre", () => {
    expect(tituloPublicacion({ nombre: null, especie: "PERRO" })).toEqual("Perro");
  });

  it("deberia mostrar Perdida para un reporte de mascota perdida", () => {
    expect(etiquetaEstado({ tipo: "PERDIDA" })).toEqual("Perdida");
  });
});
