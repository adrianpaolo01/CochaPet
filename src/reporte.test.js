import { fechaDelDia, validarReporte } from "./reporte.js";

describe("Reporte", () => {
  const datosValidos = { especie: "PERRO", barrio: "Cala Cala", fecha: "2026-11-17", descripcion: "Collar rojo" };

  it("deberia pedir la especie si no es perro, gato u otro", () => {
    expect(validarReporte({ ...datosValidos, especie: "" })).toBe("Elige la especie de tu mascota");
  });

  it("deberia pedir el barrio donde se perdio", () => {
    expect(validarReporte({ ...datosValidos, barrio: " " })).toBe("Elige el barrio donde se perdió");
  });

  it("deberia pedir la fecha en que se perdio", () => {
    expect(validarReporte({ ...datosValidos, fecha: "" })).toBe("Indica la fecha en que se perdió");
  });

  it("deberia pedir una descripcion de la mascota", () => {
    expect(validarReporte({ ...datosValidos, descripcion: "  " })).toBe("Describe a tu mascota para que la reconozcan");
  });

  it("deberia aceptar un reporte con todos los datos obligatorios", () => {
    expect(validarReporte(datosValidos)).toBeNull();
  });

  it("deberia conservar el dia elegido sin importar la zona horaria", () => {
    expect(new Date(fechaDelDia("2026-11-17")).getDate()).toBe(17);
  });
});
