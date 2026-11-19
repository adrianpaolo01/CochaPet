import { validarCambioClave } from "./cambioClave.js";

const datos = { claveActual: "anterior123", claveNueva: "nueva123", confirmacion: "nueva123" };

describe("Cambio de contrasena", () => {
  it("deberia aceptar la nueva clave de ocho caracteres repetida", () => {
    expect(validarCambioClave(datos)).toBeNull();
  });
});
