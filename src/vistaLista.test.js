import { htmlEncabezadoLista } from "./vistaLista.js";

describe("Vista lista", () => {
  it("deberia mostrar el titulo de la lista", () => {
    expect(htmlEncabezadoLista()).toContain("<h1>Mascotas perdidas y encontradas</h1>");
  });
});
