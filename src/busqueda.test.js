import { buscarPorNombre, mensajeBusqueda } from "./busqueda.js";

describe("Busqueda de mascotas", () => {
  it("deberia buscar por parte del nombre sin distinguir mayusculas", () => {
    const publicaciones = [{ nombre: "Firulais" }, { nombre: "Luna" }, { nombre: null }];
    expect(buscarPorNombre(publicaciones, "FIRU")).toEqual([publicaciones[0]]);
  });

  it("deberia mostrar todas las mascotas al borrar el texto", () => {
    const publicaciones = [{ nombre: "Firulais" }, { nombre: null }];
    expect(buscarPorNombre(publicaciones, "")).toEqual(publicaciones);
  });

  it("deberia dar un mensaje solo cuando no hay coincidencias", () => {
    expect(mensajeBusqueda([])).toEqual("No se encontraron mascotas.");
    expect(mensajeBusqueda([{ nombre: "Luna" }])).toBeNull();
  });
});
