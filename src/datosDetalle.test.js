import { badgeEstado } from "./publicaciones.js";

describe("Datos del detalle", () => {
  it("deberia identificar el texto y estilo de ambos estados", () => {
    expect(["PERDIDA", "ENCONTRADA"].map((tipo) => badgeEstado({ tipo }))).toEqual([
      { texto: "Perdida", clase: "badge badge-perdida" },
      { texto: "Encontrada", clase: "badge badge-encontrada" },
    ]);
  });
});
