import { validarRegistro } from "./registro.js";

const datosValidos = { nombre: "Ana Perez", correo: "ana@correo.com", telefono: "71234567", clave: "secreta123" };

describe("Registro", () => {
  it("deberia aceptar datos validos sin error", () => {
    expect(validarRegistro(datosValidos)).toBeNull();
  });
});
