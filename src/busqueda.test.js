import { buscarPorNombre, filtrarPorColor, filtrarPorRaza, mensajeBusqueda } from "./busqueda.js";

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

  it("deberia filtrar por raza sin distinguir mayusculas", () => {
    const publicaciones = [{ raza: "Mestizo" }, { raza: "Husky" }, { raza: null }];
    expect(filtrarPorRaza(publicaciones, "mestizo")).toEqual([publicaciones[0]]);
  });

  it("deberia mostrar todas las mascotas si no se elige raza", () => {
    const publicaciones = [{ raza: "Husky" }, { raza: null }];
    expect(filtrarPorRaza(publicaciones, "")).toEqual(publicaciones);
  });

  it("deberia filtrar por color sin distinguir mayusculas", () => {
    const publicaciones = [{ color: "negro" }, { color: "Blanco" }, { color: null }];
    expect(filtrarPorColor(publicaciones, "blanco")).toEqual([publicaciones[1]]);
  });

  it("deberia mostrar todas las mascotas si no se elige color", () => {
    const publicaciones = [{ color: "negro" }, { color: null }];
    expect(filtrarPorColor(publicaciones, "")).toEqual(publicaciones);
  });
});
