import { htmlEncabezadoLista, htmlFiltros, htmlTarjeta, htmlVistaLista } from "./vistaLista.js";

describe("Vista lista", () => {
  it("deberia mostrar el titulo de la lista", () => {
    expect(htmlEncabezadoLista()).toContain("<h1>Mascotas perdidas y encontradas</h1>");
  });

  it("deberia mostrar el boton grande para reportar una mascota perdida", () => {
    expect(htmlEncabezadoLista()).toContain('<a id="reportar-perdida" class="boton boton-grande" href="#/reportar/perdida">Perdí mi mascota</a>');
  });

  it("deberia mostrar el buscador y los filtros deshabilitados", () => {
    for (const id of ["buscar-mascotas", "filtro-especie", "filtro-raza", "filtro-color", "filtro-barrio"]) {
      expect(htmlFiltros()).toMatch(new RegExp(`id="${id}"[^>]* disabled`));
    }
  });

  it("deberia dar la clase campo-filtro a los 5 campos", () => {
    expect(htmlFiltros().match(/id="[\w-]+" class="campo-filtro"/g)).toHaveLength(5);
  });

  it("deberia dar la clase etiqueta-filtro a las 5 etiquetas", () => {
    expect(htmlFiltros().match(/<label class="etiqueta-filtro"/g)).toHaveLength(5);
  });

  it("deberia armar la vista lista con filtros, mensaje y grilla", () => {
    expect(htmlVistaLista()).toContain(htmlFiltros());
    expect(htmlVistaLista()).toContain('<div id="lista-publicaciones" class="grilla"></div>');
  });

  it("deberia generar la tarjeta con el badge de destacada oculto", () => {
    expect(htmlTarjeta()).toContain('<span class="badge badge-destacada" hidden>Destacada</span>');
  });
});
