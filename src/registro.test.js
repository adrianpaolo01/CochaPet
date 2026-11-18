import { validarRegistro } from "./registro.js";

const datosValidos = { nombre: "Ana Perez", correo: "ana@correo.com", telefono: "71234567", clave: "secreta123" };

describe("Registro", () => {
  it("deberia aceptar datos validos sin error", () => {
    expect(validarRegistro(datosValidos)).toBeNull();
  });

  it("deberia rechazar una contrasena de menos de 8 caracteres", () => {
    expect(validarRegistro({ ...datosValidos, clave: "1234567" })).toEqual("La contraseña debe tener al menos 8 caracteres");
  });
});
