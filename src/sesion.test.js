import { textoSesion, validarCredenciales } from "./sesion.js";

const CORREO_NO_VALIDO = "Escribe un correo válido, por ejemplo nombre@correo.com";

describe("Sesion", () => {
  it.each([
    [{ correo: "", clave: "abc" }, "Escribe tu correo"],
    [{ correo: "   ", clave: "abc" }, "Escribe tu correo"],
    [{ correo: "ana", clave: "abc" }, CORREO_NO_VALIDO],
    [{ correo: "ana@correo", clave: "abc" }, CORREO_NO_VALIDO],
    [{ correo: "ana@correo.com", clave: "" }, "Escribe tu contraseña"],
    [{ correo: "ana@correo.com", clave: "abc" }, null],
    [{ correo: " ana@correo.com ", clave: "abc" }, null],
  ])("deberia validar el formulario de inicio de sesion %p", (datos, esperado) => {
    expect(validarCredenciales(datos)).toBe(esperado);
  });

  it.each([
    [null, "Iniciar sesión"],
    [undefined, "Iniciar sesión"],
    [{ nombre: "Usuario de Prueba" }, "Hola, Usuario"],
    [{ nombre: "   " }, "Mi cuenta"],
  ])("deberia mostrar en el encabezado el texto de la sesion %p", (usuario, esperado) => {
    expect(textoSesion(usuario)).toBe(esperado);
  });
});
