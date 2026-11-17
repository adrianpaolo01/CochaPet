import { badgeEstado, caracteristicasMascota } from "./publicaciones.js";

describe("Datos del detalle", () => {
  it("deberia identificar el texto y estilo de ambos estados", () => {
    expect(["PERDIDA", "ENCONTRADA"].map((tipo) => badgeEstado({ tipo }))).toEqual([
      { texto: "Perdida", clase: "badge badge-perdida" },
      { texto: "Encontrada", clase: "badge badge-encontrada" },
    ]);
  });

  it("deberia mostrar la especie y las caracteristicas disponibles", () => {
    expect(caracteristicasMascota({ especie: "PERRO", raza: "Husky", color: "gris" }))
      .toBe("Especie: Perro · Raza: Husky · Color: gris");
    expect(caracteristicasMascota({ especie: "GATO", raza: null, color: null })).toBe("Especie: Gato");
  });
});
