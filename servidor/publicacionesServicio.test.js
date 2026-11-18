import { detalleDePublicacion, publicacionesParaInicio, reportarPerdida } from "./publicacionesServicio.js";

describe("Publicaciones servicio", () => {
  it("deberia devolver solo las publicaciones activas", async () => {
    const repositorio = {
      listar: async () => [
        { id: 1, estado: "ACTIVA" },
        { id: 2, estado: "VOLVIO_A_CASA" },
        { id: 3, estado: "OCULTA" },
      ],
    };

    const resultado = await publicacionesParaInicio(repositorio);

    expect(resultado.map((p) => p.id)).toEqual([1]);
  });

  it("deberia devolver el detalle de una publicacion activa", async () => {
    const repositorio = { obtenerPorId: async () => ({ id: 1, estado: "ACTIVA" }) };

    const resultado = await detalleDePublicacion(repositorio, 1);

    expect(resultado).toEqual({ id: 1, estado: "ACTIVA" });
  });

  it("deberia devolver null si la publicacion no existe", async () => {
    const repositorio = { obtenerPorId: async () => undefined };

    const resultado = await detalleDePublicacion(repositorio, 99);

    expect(resultado).toBeNull();
  });

  it.each(["OCULTA", "VOLVIO_A_CASA"])("deberia devolver null si la publicacion esta %s", async (estado) => {
    const repositorio = { obtenerPorId: async () => ({ id: 1, estado }) };

    expect(await detalleDePublicacion(repositorio, 1)).toBeNull();
  });

  it("deberia rechazar un reporte de perdida sin los datos obligatorios", async () => {
    const resultado = await reportarPerdida({}, { id: 7 }, { especie: "" });

    expect(resultado).toEqual({ error: "Elige la especie de tu mascota" });
  });

  it("deberia rechazar un barrio que no es de Cochabamba", async () => {
    const barrios = { listar: async () => [{ id: 1, nombre: "Cala Cala" }] };
    const datos = { especie: "PERRO", barrio: "Miraflores", fecha: "2026-11-17", descripcion: "Collar rojo" };

    expect(await reportarPerdida({ barrios }, { id: 7 }, datos)).toEqual({ error: "Elige un barrio de Cochabamba" });
  });
});
