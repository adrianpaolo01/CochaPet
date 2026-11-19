import { textoEstado, validarDatosPerfil } from "./perfil.js";

describe("Perfil", () => {
  it("deberia mostrar Activa para una publicacion activa", () => {
    expect(textoEstado("ACTIVA")).toEqual("Activa");
  });

  it("deberia mostrar Volvio a casa para una publicacion resuelta", () => {
    expect(textoEstado("VOLVIO_A_CASA")).toEqual("Volvió a casa");
  });

  it("deberia pedir el nombre si lo dejo vacio al editar mis datos", () => {
    expect(validarDatosPerfil({ nombre: " ", telefono: "71234567", foto: "" })).toEqual("Completa tu nombre y teléfono");
  });

  it("deberia aceptar mis datos si nombre y telefono estan completos", () => {
    expect(validarDatosPerfil({ nombre: "Ana", telefono: "71234567", foto: "" })).toBeNull();
  });
});
