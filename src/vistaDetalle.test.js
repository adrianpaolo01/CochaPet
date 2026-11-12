import { htmlAccionesDetalle } from "./vistaDetalle.js";

describe("Vista detalle", () => {
  it("deberia mostrar los botones de WhatsApp y llamar con su icono", () => {
    expect(htmlAccionesDetalle()).toMatch(/id="detalle-whatsapp"[^>]*><span class="icono icono-whatsapp"/);
    expect(htmlAccionesDetalle()).toMatch(/id="detalle-llamar"[^>]*><span class="icono icono-llamar"/);
  });
});
