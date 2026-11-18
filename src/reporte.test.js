import { fechaDelDia, leerBorrador, textosReporte, validarReporte } from "./reporte.js";

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

  it("deberia rechazar un reporte que no es de mascota perdida ni encontrada", () => {
    expect(validarReporte({ ...datosValidos, tipo: "ROBADA" })).toBe("Elige si la mascota se perdió o la encontraste");
  });

  it("deberia aceptar un reporte con todos los datos obligatorios", () => {
    expect(validarReporte(datosValidos)).toBeNull();
  });

  it("deberia conservar el dia elegido sin importar la zona horaria", () => {
    expect(new Date(fechaDelDia("2026-11-17")).getDate()).toBe(17);
  });

  it("deberia recuperar lo escrito en el borrador guardado", () => {
    expect(leerBorrador('{"nombre":"Toby"}')).toEqual({ nombre: "Toby" });
  });

  it.each([null, "{roto"])("deberia empezar sin datos si el borrador es %p", (texto) => {
    expect(leerBorrador(texto)).toEqual({});
  });

  it.each([
    ["PERDIDA", "Perdí mi mascota"],
    ["ENCONTRADA", "Encontré una mascota"],
  ])("deberia titular el reporte de tipo %s", (tipo, titulo) => {
    expect(textosReporte(tipo).titulo).toBe(titulo);
  });

  it.each([
    ["PERDIDA", "¿Cuándo se perdió?"],
    ["ENCONTRADA", "¿Cuándo la encontraste?"],
  ])("deberia preguntar la fecha del reporte de tipo %s", (tipo, pregunta) => {
    expect(textosReporte(tipo).preguntaFecha).toBe(pregunta);
  });

  it.each([
    ["PERDIDA", "Cuéntanos cómo es y dónde se perdió para que otras personas te ayuden a encontrarla."],
    ["ENCONTRADA", "Cuéntanos cómo es y dónde la encontraste para que su dueño pueda recuperarla."],
  ])("deberia explicar el reporte de tipo %s en el subtitulo", (tipo, subtitulo) => {
    expect(textosReporte(tipo).subtitulo).toBe(subtitulo);
  });
});
