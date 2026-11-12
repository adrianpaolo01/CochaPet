import { htmlAccionesDetalle, htmlVistaDetalle } from "./vistaDetalle.js";

describe("Vista detalle", () => {
  it("deberia mostrar los botones de WhatsApp y llamar con su icono", () => {
    expect(htmlAccionesDetalle()).toMatch(/id="detalle-whatsapp"[^>]*><span class="icono icono-whatsapp"/);
    expect(htmlAccionesDetalle()).toMatch(/id="detalle-llamar"[^>]*><span class="icono icono-llamar"/);
  });

  it("deberia armar el detalle con volver, acciones y aviso de seguridad", () => {
    expect(htmlVistaDetalle()).toContain('<a href="#/" class="enlace-volver">');
    expect(htmlVistaDetalle()).toContain(htmlAccionesDetalle());
    expect(htmlVistaDetalle()).toContain('id="aviso-seguridad"');
  });
});
