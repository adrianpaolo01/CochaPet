import { etiquetaEstado, formatearFecha, fotoPrincipal, tituloPublicacion } from "./publicaciones.js";

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

  it("deberia mostrar Encontrada para un reporte de mascota encontrada", () => {
    expect(etiquetaEstado({ tipo: "ENCONTRADA" })).toEqual("Encontrada");
  });

  it("deberia mostrar la fecha como dia/mes/anio", () => {
    expect(formatearFecha(new Date(2026, 9, 3, 10, 30))).toEqual("03/10/2026");
  });

  it("deberia usar la primera foto como foto principal", () => {
    expect(fotoPrincipal({ fotos: ["frente.jpg", "perfil.jpg"] })).toEqual("frente.jpg");
  });
});
