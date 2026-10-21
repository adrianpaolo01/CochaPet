import { detalleDePublicacion, publicacionesParaInicio } from "./publicacionesServicio.js";

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
});
