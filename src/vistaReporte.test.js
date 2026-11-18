import { htmlVistaReporte } from "./vistaReporte.js";

describe("Vista reporte", () => {
  it("deberia mostrar el titulo del reporte de mascota perdida", () => {
    expect(htmlVistaReporte()).toContain("<h1>Perdí mi mascota</h1>");
  });
});
