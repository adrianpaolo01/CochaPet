export function saludoSesion(usuario) {
  return `Hola, ${usuario.nombre.trim().split(/\s+/)[0]}`;
}
