import { validarCambioClave } from "./cambioClave.js";

const datos = { claveActual: "anterior123", claveNueva: "nueva123", confirmacion: "nueva123" };

describe("Cambio de contrasena", () => {
  it("deberia rechazar una confirmacion diferente", () => {
    expect(validarCambioClave({ ...datos, confirmacion: "otra1234" })).toBe("Las contraseñas nuevas no coinciden");
  });

  it("deberia rechazar una nueva clave de siete caracteres", () => {
    expect(validarCambioClave({ ...datos, claveNueva: "1234567", confirmacion: "1234567" }))
      .toBe("La nueva contraseña debe tener al menos 8 caracteres");
  });

  it("deberia exigir las tres contrasenas como texto no vacio", () => {
    for (const campo of Object.keys(datos)) {
      for (const valor of ["", null, undefined, 123]) {
        expect(validarCambioClave({ ...datos, [campo]: valor })).toBe("Completa las tres contraseñas");
      }
    }
  });

  it("deberia aceptar la nueva clave de ocho caracteres repetida", () => {
    expect(validarCambioClave(datos)).toBeNull();
  });
});
