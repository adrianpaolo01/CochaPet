import { leerCookie } from "./cookies.js";

describe("Cookies", () => {
  it("deberia leer el valor de una cookie por su nombre", () => {
    expect(leerCookie("tema=oscuro; sesion=abc123; idioma=es", "sesion")).toBe("abc123");
  });
});
