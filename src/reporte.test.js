import { validarReporte } from "./reporte.js";

describe("Reporte", () => {
  const datosValidos = { especie: "PERRO", barrio: "Cala Cala", fecha: "2026-11-17", descripcion: "Collar rojo" };

  it("deberia pedir la especie si no es perro, gato u otro", () => {
    expect(validarReporte({ ...datosValidos, especie: "" })).toBe("Elige la especie de tu mascota");
  });
});
