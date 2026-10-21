import { barriosParaLista } from "./barriosServicio.js";

describe("Barrios servicio", () => {
  it("deberia devolver los nombres de los barrios en orden alfabetico", async () => {
    const repositorio = {
      listar: async () => [
        { id: 1, nombre: "Sarco" },
        { id: 2, nombre: "Hipódromo" },
        { id: 3, nombre: "Aranjuez" },
      ],
    };

    const resultado = await barriosParaLista(repositorio);

    expect(resultado).toEqual(["Aranjuez", "Hipódromo", "Sarco"]);
  });
});
