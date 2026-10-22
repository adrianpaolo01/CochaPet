import { buscarPorNombre, filtrarMascotas, filtrarPorBarrio, filtrarPorColor, filtrarPorEspecie, filtrarPorRaza, mensajeBusqueda, opcionesDe } from "./busqueda.js";

describe("Busqueda de mascotas", () => {
  it("deberia mostrar solo las mascotas de la especie elegida", () => {
    const publicaciones = [{ especie: "PERRO" }, { especie: "GATO" }, { especie: "OTRO" }];
    expect(filtrarPorEspecie(publicaciones, "PERRO")).toEqual([publicaciones[0]]);
  });

  it("deberia limitar las opciones de raza a la especie elegida", () => {
    const publicaciones = [{ especie: "PERRO", raza: "Labrador" }, { especie: "GATO", raza: "Siames" },
      { especie: "OTRO", raza: "Loro" }, { especie: "OTRO", raza: "Conejo" }];
    expect(opcionesDe(publicaciones, "raza", "OTRO")).toEqual(["Conejo", "Loro"]);
  });

  it("deberia combinar especie con texto y barrio", () => {
    const base = { nombre: "Michi", barrio: "Sarco" };
    const publicaciones = [{ ...base, especie: "GATO" }, { ...base, especie: "PERRO" },
      { ...base, especie: "GATO", barrio: "Cala Cala" }, { ...base, especie: "GATO", nombre: "Luna" }];
    expect(filtrarMascotas(publicaciones, { texto: "mi", raza: "", color: "", barrio: "Sarco", especie: "GATO" })).toEqual([publicaciones[0]]);
  });

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

  it("deberia filtrar por barrio sin distinguir mayusculas", () => {
    const publicaciones = [{ barrio: "Cala Cala" }, { barrio: "Sarco" }, { barrio: null }];
    expect(filtrarPorBarrio(publicaciones, "cala cala")).toEqual([publicaciones[0]]);
  });

  it("deberia mostrar todas las mascotas si no se elige barrio", () => {
    const publicaciones = [{ barrio: "Cala Cala" }, { barrio: null }];
    expect(filtrarPorBarrio(publicaciones, "")).toEqual(publicaciones);
  });

  it("deberia devolver una lista vacia si ninguna mascota es del barrio elegido", () => {
  const publicaciones = [{ barrio: "Cala Cala" }, { barrio: "Sarco" }];
  expect(filtrarPorBarrio(publicaciones, "Pacata")).toEqual([]);
});


  it("deberia listar las razas sin repetir, sin vacios y en orden", () => {
    const publicaciones = [{ raza: "Mestizo" }, { raza: "Husky" }, { raza: null }, { raza: "Mestizo" }];
    expect(opcionesDe(publicaciones, "raza")).toEqual(["Husky", "Mestizo"]);
  });

  it("deberia combinar los filtros de nombre, raza y color", () => {
    const publicaciones = [
      { nombre: "Luna", raza: "Husky", color: "gris" },
      { nombre: "Lulu", raza: "Husky", color: "negro" },
      { nombre: "Lucas", raza: "Mestizo", color: "gris" },
    ];
    expect(filtrarMascotas(publicaciones, { texto: "lu", raza: "Husky", color: "gris" })).toEqual([publicaciones[0]]);
  });

  it("deberia filtrar por barrio al combinar los filtros", () => {
    const publicaciones = [
      { barrio: "Cala Cala" },
      { barrio: "Sarco" },
      { barrio: "Sarco" },
    ];
    expect(filtrarMascotas(publicaciones, { texto: "", raza: "", color: "", barrio: "Sarco" })).toEqual([publicaciones[1], publicaciones[2]]);
  });
});
