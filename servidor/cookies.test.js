import { cookieBorrada, cookieDeSesion, leerCookie } from "./cookies.js";

describe("Cookies", () => {
  it("deberia armar la cookie que le ordena al navegador borrar la sesion", () => {
    expect(cookieBorrada()).toBe("sesion=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
  });

  it("deberia mantener Secure al borrar la cookie en una conexion segura", () => {
    expect(cookieBorrada({ seguro: true })).toBe("sesion=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0; Secure");
  });

  it("deberia armar la cookie de sesion con sus protecciones y su duracion", () => {
    const ahora = new Date("2026-11-20T10:00:00Z");
    const expiraEn = new Date("2026-11-27T10:00:00Z");
    expect(cookieDeSesion("abc123", expiraEn, { ahora })).toBe("sesion=abc123; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800");
  });

  it("deberia agregar Secure a la cookie cuando la conexion es segura", () => {
    const ahora = new Date("2026-11-20T10:00:00Z");
    const expiraEn = new Date("2026-11-27T10:00:00Z");
    expect(cookieDeSesion("abc123", expiraEn, { ahora, seguro: true })).toContain("; Secure");
  });

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
