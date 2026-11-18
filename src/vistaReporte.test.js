import { htmlVistaReporte } from "./vistaReporte.js";

describe("Vista reporte", () => {
  it("deberia mostrar el titulo del reporte de mascota perdida", () => {
    expect(htmlVistaReporte()).toContain("<h1>Perdí mi mascota</h1>");
  });

  it("deberia tener un aviso oculto para iniciar sesion o registrarse y volver al formulario", () => {
    expect(htmlVistaReporte()).toMatch(/<p id="reporte-aviso-sesion"[^>]*hidden>/);
    expect(htmlVistaReporte()).toContain('<a href="#/ingresar?volver=/reportar/perdida">inicia sesión</a>');
    expect(htmlVistaReporte()).toContain('<button type="button" id="reporte-registrarse" class="enlace-boton">regístrate</button>');
  });

  it("deberia pedir la especie entre perro, gato u otro", () => {
    expect(htmlVistaReporte()).toContain('<label for="reporte-especie">Especie</label>');
    expect(htmlVistaReporte()).toMatch(/<select id="reporte-especie" name="especie">.*value="PERRO".*value="GATO".*value="OTRO"/s);
  });

  it.each([
    ["nombre", "Nombre (opcional)"],
    ["raza", "Raza (opcional)"],
    ["color", "Color (opcional)"],
  ])("deberia tener el campo opcional %s", (campo, etiqueta) => {
    expect(htmlVistaReporte()).toContain(`<label for="reporte-${campo}">${etiqueta}</label><input id="reporte-${campo}" name="${campo}" />`);
  });

  it("deberia pedir la fecha en que se perdio con un selector de fecha", () => {
    expect(htmlVistaReporte()).toContain('<label for="reporte-fecha">¿Cuándo se perdió?</label><input id="reporte-fecha" name="fecha" type="date" />');
  });

  it("deberia pedir el barrio con una lista que se llena desde la API", () => {
    expect(htmlVistaReporte()).toContain('<label for="reporte-barrio">Barrio de Cochabamba</label>');
    expect(htmlVistaReporte()).toContain('<select id="reporte-barrio" name="barrio"><option value="">Elige el barrio</option></select>');
  });
});
