import { publicacionesParaInicio } from "./publicacionesServicio.js";

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
});
