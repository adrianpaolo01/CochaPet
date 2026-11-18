export function htmlVistaReporte() {
  return `
    <a href="#/" class="enlace-volver">← Volver</a>
    <div class="reporte-tarjeta">
      <h1>Perdí mi mascota</h1>
      <p class="subtitulo">Cuéntanos cómo es y dónde se perdió para que otras personas te ayuden a encontrarla.</p>
      <p id="reporte-aviso-sesion" class="aviso-sesion" hidden>
        Para publicar necesitas una cuenta: <a href="#/ingresar?volver=/reportar/perdida">inicia sesión</a>
        o <button type="button" id="reporte-registrarse" class="enlace-boton">regístrate</button>. Lo que escribas no se pierde.
      </p>
    </div>`;
}
