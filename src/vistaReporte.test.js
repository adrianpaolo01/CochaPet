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
});
