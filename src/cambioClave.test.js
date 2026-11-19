import { validarCambioClave } from "./cambioClave.js";

const datos = { claveActual: "anterior123", claveNueva: "nueva123", confirmacion: "nueva123" };

describe("Cambio de contrasena", () => {
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
