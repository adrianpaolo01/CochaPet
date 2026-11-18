import { vistaParaHash } from "./rutas.js";

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
});
