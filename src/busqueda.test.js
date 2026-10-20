import { buscarPorNombre } from "./busqueda.js";

describe("Busqueda de mascotas", () => {
  it("deberia buscar por parte del nombre sin distinguir mayusculas", () => {
    const publicaciones = [{ nombre: "Firulais" }, { nombre: "Luna" }, { nombre: null }];
    expect(buscarPorNombre(publicaciones, "FIRU")).toEqual([publicaciones[0]]);
  });
});
