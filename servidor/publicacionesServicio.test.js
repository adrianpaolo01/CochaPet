import { detalleDePublicacion, misPublicaciones, publicacionesParaInicio, reportarPerdida } from "./publicacionesServicio.js";

describe("Publicaciones servicio", () => {
  const reporte = { especie: "PERRO", barrio: "Cala Cala", fecha: "2026-11-17", descripcion: "Collar rojo" };
  const barrios = { listar: async () => [{ id: 1, nombre: "Cala Cala" }] };

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

  it("deberia devolver las publicaciones del autor sin las ocultas", async () => {
    const repositorio = {
      listarPorAutor: async (autorId) => [
        { id: 1, autorId, estado: "ACTIVA" },
        { id: 2, autorId, estado: "VOLVIO_A_CASA" },
        { id: 3, autorId, estado: "OCULTA" },
      ],
    };

    const resultado = await misPublicaciones(repositorio, 7);

    expect(resultado).toEqual([{ id: 1, autorId: 7, estado: "ACTIVA" }, { id: 2, autorId: 7, estado: "VOLVIO_A_CASA" }]);
  });

  it("deberia rechazar un reporte de perdida sin los datos obligatorios", async () => {
    const resultado = await reportarPerdida({}, { id: 7 }, { especie: "" });

    expect(resultado).toEqual({ error: "Elige la especie de tu mascota" });
  });

  it("deberia rechazar un barrio que no es de Cochabamba", async () => {
    const datos = { ...reporte, barrio: "Miraflores" };

    expect(await reportarPerdida({ barrios }, { id: 7 }, datos)).toEqual({ error: "Elige un barrio de Cochabamba" });
  });


  it("deberia crear la publicacion como perdida con la cuenta y el telefono del autor", async () => {
    const publicaciones = { crear: jest.fn(async () => ({ id: 30 })) };

    await reportarPerdida({ publicaciones, barrios }, { id: 7, telefono: "70000000" }, reporte);

    expect(publicaciones.crear).toHaveBeenCalledWith({ ...reporte, tipo: "PERDIDA", autorId: 7, telefono: "70000000" });
  });
});
