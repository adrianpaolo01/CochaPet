export function htmlAccionesDetalle() {
  return `
      <div class="detalle-acciones">
        <a id="detalle-whatsapp" class="boton boton-whatsapp" target="_blank" rel="noopener"><span class="icono icono-whatsapp" aria-hidden="true"></span>Escribir por WhatsApp</a>
        <a id="detalle-llamar" class="boton boton-llamar"><span class="icono icono-llamar" aria-hidden="true"></span>Llamar</a>
      </div>`;
}

export function htmlVistaDetalle() {
  return `
    <a href="#/" class="enlace-volver">← Volver</a>
    <div class="detalle-tarjeta">
      <div id="detalle-fotos"></div>
      <h2 id="detalle-titulo"></h2>
      <p id="detalle-datos"></p>
      <p id="detalle-descripcion"></p>${htmlAccionesDetalle()}
      <p id="aviso-seguridad" class="aviso-seguridad" role="note"><strong>⚠️ Cuidado con las estafas:</strong> nunca pagues recompensas ni envíes dinero por adelantado. Entrega o recibe la recompensa solo cuando veas a la mascota en persona.</p>
    </div>`;
}
