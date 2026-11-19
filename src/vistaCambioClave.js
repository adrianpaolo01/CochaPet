import { LONGITUD_MINIMA_CLAVE } from "./registro.js";

export function htmlCambioClave() {
  return `<section class="cambio-clave" aria-labelledby="cambio-clave-titulo">
    <h2 id="cambio-clave-titulo">Cambiar contraseña</h2>
    <p>La nueva contraseña debe tener al menos ${LONGITUD_MINIMA_CLAVE} caracteres.</p>
    <form id="formulario-cambio-clave" novalidate>
      <label for="clave-actual">Contraseña actual</label><input id="clave-actual" name="claveActual" type="password" autocomplete="current-password" required />
      <label for="clave-nueva">Nueva contraseña</label><input id="clave-nueva" name="claveNueva" type="password" autocomplete="new-password" minlength="${LONGITUD_MINIMA_CLAVE}" required />
      <label for="clave-confirmacion">Repite la nueva contraseña</label><input id="clave-confirmacion" name="confirmacion" type="password" autocomplete="new-password" required />
      <p id="cambio-clave-mensaje" role="status" aria-live="polite" hidden></p>
      <button id="cambio-clave-enviar" class="boton" type="submit">Guardar contraseña</button>
    </form></section>`;
}
