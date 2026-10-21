import { enlaceLlamada, enlaceWhatsApp, etiquetaEstado, formatearFecha, fotoPrincipal, idDesdeHash, mensajeInicio, ordenarParaInicio, tituloPublicacion } from "./publicaciones.js";

describe("Publicaciones", () => {
  it("deberia usar el nombre de la mascota como titulo", () => {
    expect(tituloPublicacion({ nombre: "Firulais", especie: "PERRO" })).toEqual("Firulais");
  });

  it("deberia usar la especie como titulo cuando no tiene nombre", () => {
    expect(tituloPublicacion({ nombre: null, especie: "PERRO" })).toEqual("Perro");
  });

  it("deberia mostrar Perdida para un reporte de mascota perdida", () => {
    expect(etiquetaEstado({ tipo: "PERDIDA" })).toEqual("Perdida");
  });

  it("deberia mostrar Encontrada para un reporte de mascota encontrada", () => {
    expect(etiquetaEstado({ tipo: "ENCONTRADA" })).toEqual("Encontrada");
  });

  it("deberia mostrar la fecha como dia/mes/anio", () => {
    expect(formatearFecha(new Date(2026, 9, 3, 10, 30))).toEqual("03/10/2026");
  });

  it("deberia usar la primera foto como foto principal", () => {
    expect(fotoPrincipal({ fotos: ["frente.jpg", "perfil.jpg"] })).toEqual("frente.jpg");
  });

  it("deberia mostrar primero las publicaciones destacadas", () => {
    const publicaciones = [{ id: 1, destacada: false }, { id: 2, destacada: true }];
    expect(ordenarParaInicio(publicaciones).map((p) => p.id)).toEqual([2, 1]);
  });

  it("deberia mostrar primero las mas recientes dentro de cada grupo", () => {
    const publicaciones = [
      { id: 1, destacada: false, fecha: "2026-10-10T10:00:00Z" },
      { id: 2, destacada: false, fecha: "2026-10-12T10:00:00Z" },
    ];
    expect(ordenarParaInicio(publicaciones).map((p) => p.id)).toEqual([2, 1]);
  });

  it("deberia dar un mensaje solo cuando no hay publicaciones activas", () => {
    expect(mensajeInicio([])).toEqual("Todavía no hay mascotas publicadas.");
    expect(mensajeInicio([{ id: 1 }])).toBeNull();
  });

  it("deberia sacar el id de la publicacion desde el hash", () => {
    expect(idDesdeHash("#/mascota/3")).toEqual(3);
  });

  it("deberia armar el enlace de WhatsApp avisando que encontre a la mascota por su nombre", () => {
    const mensaje = encodeURIComponent("Hola, creo que encontré a Firulais, la mascota que publicaste en CochaPet.");
    expect(enlaceWhatsApp({ telefono: "70000001", nombre: "Firulais", especie: "PERRO" })).toEqual(`https://wa.me/59170000001?text=${mensaje}`);
  });

  it("deberia mencionar a tu perro en el WhatsApp cuando la mascota no tiene nombre", () => {
    const mensaje = encodeURIComponent("Hola, creo que encontré a tu perro, la mascota que publicaste en CochaPet.");
    expect(enlaceWhatsApp({ telefono: "70000001", nombre: null, especie: "PERRO" })).toEqual(`https://wa.me/59170000001?text=${mensaje}`);
  });

  it("deberia armar el enlace de llamada con el telefono de la publicacion", () => {
    expect(enlaceLlamada({ telefono: "70000001" })).toEqual("tel:+59170000001");
  });

  it.each(["", "#/", "#/mascota/", "#/mascota/abc", "#/otra/3"])("deberia dar null si el hash %p no es de una mascota", (hash) => {
    expect(idDesdeHash(hash)).toBeNull();
  });
});
