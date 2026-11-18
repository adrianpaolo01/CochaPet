import { scryptSync } from "node:crypto";
import { verificarClave } from "./claves.js";

const SAL = "00ff00ff00ff00ff00ff00ff00ff00ff";

function hashDe(clave) {
  return `${SAL}:${scryptSync(clave, SAL, 64).toString("hex")}`;
}

describe("Claves", () => {
  it("deberia aceptar la clave que coincide con el hash guardado", () => {
    expect(verificarClave("prueba123", hashDe("prueba123"))).toBe(true);
  });

  it("deberia rechazar una clave que no coincide con el hash guardado", () => {
    expect(verificarClave("otraClave", hashDe("prueba123"))).toBe(false);
  });
});
