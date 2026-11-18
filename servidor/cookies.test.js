import { leerCookie } from "./cookies.js";

describe("Cookies", () => {
  it("deberia leer el valor de una cookie por su nombre", () => {
    expect(leerCookie("tema=oscuro; sesion=abc123; idioma=es", "sesion")).toBe("abc123");
  });

  it("deberia leer la cookie aunque no haya espacio despues del punto y coma", () => {
    expect(leerCookie("tema=oscuro;sesion=abc123", "sesion")).toBe("abc123");
  });

  it.each([undefined, "", "tema=oscuro", "xsesion=abc123"])("deberia devolver null si la cabecera es %p", (cabecera) => {
    expect(leerCookie(cabecera, "sesion")).toBeNull();
  });
});
