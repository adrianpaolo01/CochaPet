import { htmlEncabezadoLista, htmlFiltros } from "./vistaLista.js";

describe("Vista lista", () => {
  it("deberia mostrar el titulo de la lista", () => {
    expect(htmlEncabezadoLista()).toContain("<h1>Mascotas perdidas y encontradas</h1>");
  });

  it("deberia mostrar el buscador y los filtros deshabilitados", () => {
    for (const id of ["buscar-mascotas", "filtro-especie", "filtro-raza", "filtro-color", "filtro-barrio"]) {
      expect(htmlFiltros()).toMatch(new RegExp(`id="${id}"[^>]* disabled`));
    }
  });
});
