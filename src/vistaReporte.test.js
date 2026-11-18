import { htmlVistaReporte } from "./vistaReporte.js";

describe("Vista reporte", () => {
  it("deberia tener un titulo y un subtitulo que cambian segun el tipo de reporte", () => {
    expect(htmlVistaReporte()).toContain('<h1 id="reporte-titulo">Perdí mi mascota</h1>');
    expect(htmlVistaReporte()).toContain('<p id="reporte-subtitulo" class="subtitulo">');
  });

  it("deberia tener un aviso oculto para iniciar sesion o registrarse y volver al formulario", () => {
    expect(htmlVistaReporte()).toMatch(/<p id="reporte-aviso-sesion"[^>]*hidden>/);
    expect(htmlVistaReporte()).toContain('<a id="reporte-ingresar" href="#/ingresar?volver=/reportar/perdida">inicia sesión</a>');
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
    expect(htmlVistaReporte()).toContain('<label id="reporte-pregunta-fecha" for="reporte-fecha">¿Cuándo se perdió?</label><input id="reporte-fecha" name="fecha" type="date" />');
  });

  it("deberia pedir el barrio con una lista que se llena desde la API", () => {
    expect(htmlVistaReporte()).toContain('<label for="reporte-barrio">Barrio de Cochabamba</label>');
    expect(htmlVistaReporte()).toContain('<select id="reporte-barrio" name="barrio"><option value="">Elige el barrio</option></select>');
  });

  it("deberia pedir una descripcion de la mascota", () => {
    expect(htmlVistaReporte()).toMatch(/<label for="reporte-descripcion">Descripción<\/label>\s*<textarea id="reporte-descripcion" name="descripcion"/);
  });

  it("deberia tener un lugar oculto para errores y un boton para publicar", () => {
    expect(htmlVistaReporte()).toContain('<p id="reporte-mensaje" class="mensaje-error" role="alert" hidden></p>');
    expect(htmlVistaReporte()).toContain('<button id="reporte-publicar" class="boton" type="submit">Publicar</button>');
  });
});
