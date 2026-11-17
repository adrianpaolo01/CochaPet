import { publicaciones } from "./publicacionesDemo.js";
import { tituloPublicacion } from "../src/publicaciones.js";

describe("Publicaciones de ejemplo", () => {
  it("deberia mostrar los nombres de las tres mascotas encontradas", () => {
    const encontradas = publicaciones.filter((p) => p.tipo === "ENCONTRADA");
    expect(Object.fromEntries(encontradas.map((p) => [p.especie, tituloPublicacion(p)])))
      .toEqual({ GATO: "Moka", OTRO: "Copito", PERRO: "Bruno" });
  });
});
