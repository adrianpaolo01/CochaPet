export function htmlVistaLogin() {
  return `
    <a href="#/" class="enlace-volver">← Volver</a>
    <div class="login-tarjeta">
      <h1>Iniciar sesión</h1>
      <p class="subtitulo">Escribe el correo y la contraseña con los que te registraste.</p>
      <form id="formulario-login" novalidate>
        <label for="login-correo">Correo</label>
        <input id="login-correo" type="email" autocomplete="username" placeholder="nombre@correo.com" />
        <label for="login-clave">Contraseña</label>
        <input id="login-clave" type="password" autocomplete="current-password" />
        <p id="login-mensaje" class="mensaje-error" role="alert" hidden></p>
        <button id="login-enviar" class="boton" type="submit">Entrar</button>
      </form>
    </div>`;
}
