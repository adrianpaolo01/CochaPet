import { htmlVistaLogin } from "./vistaLogin.js";

describe("Vista login", () => {
  it("deberia mostrar el titulo y una frase de ayuda", () => {
    expect(htmlVistaLogin()).toContain("<h1>Iniciar sesión</h1>");
    expect(htmlVistaLogin()).toContain("Escribe el correo y la contraseña con los que te registraste.");
  });

  it("deberia pedir el correo y la contraseña con los tipos y autocompletado correctos", () => {
    expect(htmlVistaLogin()).toMatch(/id="login-correo" type="email" autocomplete="username"/);
    expect(htmlVistaLogin()).toMatch(/id="login-clave" type="password" autocomplete="current-password"/);
  });

  it("deberia tener un boton para entrar y un lugar oculto para los errores", () => {
    expect(htmlVistaLogin()).toMatch(/<button id="login-enviar"[^>]*type="submit">Entrar<\/button>/);
    expect(htmlVistaLogin()).toMatch(/<p id="login-mensaje"[^>]*role="alert" hidden><\/p>/);
  });

  it("deberia dejar volver al inicio", () => {
    expect(htmlVistaLogin()).toContain('<a href="#/" class="enlace-volver">← Volver</a>');
  });
});
