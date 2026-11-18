import { destinoTrasIngresar, vistaParaHash } from "./rutas.js";

describe("Rutas", () => {
  it.each([
    ["#/ingresar", "login"],
    ["#/reportar/perdida", "reporte"],
    ["#/ingresar?volver=/reportar/perdida", "login"],
    ["#/mascota/3", "detalle"],
    ["", "lista"],
    ["#/", "lista"],
    ["#/otra", "lista"],
    ["#/mascota/abc", "lista"],
  ])("deberia mostrar la vista correcta para el hash %p", (hash, esperada) => {
    expect(vistaParaHash(hash)).toBe(esperada);
  });

  it("deberia volver a la ruta indicada despues de iniciar sesion", () => {
    expect(destinoTrasIngresar("#/ingresar?volver=/reportar/perdida")).toBe("#/reportar/perdida");
  });

  it("deberia volver al inicio si no se indico a donde volver", () => {
    expect(destinoTrasIngresar("#/ingresar")).toBe("#/");
  });
});
