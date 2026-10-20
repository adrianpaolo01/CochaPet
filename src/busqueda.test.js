import { buscarPorNombre } from "./busqueda.js";

describe("Busqueda de mascotas", () => {
  it("deberia buscar por parte del nombre sin distinguir mayusculas", () => {
    const publicaciones = [{ nombre: "Firulais" }, { nombre: "Luna" }, { nombre: null }];
    expect(buscarPorNombre(publicaciones, "FIRU")).toEqual([publicaciones[0]]);
  });

  it("deberia mostrar todas las mascotas al borrar el texto", () => {
    const publicaciones = [{ nombre: "Firulais" }, { nombre: null }];
    expect(buscarPorNombre(publicaciones, "")).toEqual(publicaciones);
  });
});
