export function htmlVistaReporte() {
  return `
    <a href="#/" class="enlace-volver">← Volver</a>
    <div class="reporte-tarjeta">
      <h1 id="reporte-titulo">Perdí mi mascota</h1>
      <p id="reporte-subtitulo" class="subtitulo">Cuéntanos cómo es y dónde se perdió para que otras personas te ayuden a encontrarla.</p>
      <p id="reporte-aviso-sesion" class="aviso-sesion" hidden>
        Para publicar necesitas una cuenta: <a id="reporte-ingresar" href="#/ingresar?volver=/reportar/perdida">inicia sesión</a>
        o <button type="button" id="reporte-registrarse" class="enlace-boton">regístrate</button>. Lo que escribas no se pierde.
      </p>
      <form id="formulario-reporte" novalidate>
        <label for="reporte-especie">Especie</label>
        <select id="reporte-especie" name="especie">
          <option value="">Elige una opción</option><option value="PERRO">Perro</option><option value="GATO">Gato</option><option value="OTRO">Otro</option>
        </select>
        <label for="reporte-nombre">Nombre (opcional)</label><input id="reporte-nombre" name="nombre" />
        <label for="reporte-raza">Raza (opcional)</label><input id="reporte-raza" name="raza" />
        <label for="reporte-color">Color (opcional)</label><input id="reporte-color" name="color" />
        <label id="reporte-pregunta-fecha" for="reporte-fecha">¿Cuándo se perdió?</label><input id="reporte-fecha" name="fecha" type="date" />
        <label for="reporte-barrio">Barrio de Cochabamba</label>
        <select id="reporte-barrio" name="barrio"><option value="">Elige el barrio</option></select>
        <label for="reporte-descripcion">Descripción</label>
        <textarea id="reporte-descripcion" name="descripcion" rows="4" placeholder="Ej.: collar rojo, cojea de la pata izquierda, responde a su nombre"></textarea>
        <p id="reporte-mensaje" class="mensaje-error" role="alert" hidden></p>
        <button id="reporte-publicar" class="boton" type="submit">Publicar</button>
      </form>
    </div>`;
}
