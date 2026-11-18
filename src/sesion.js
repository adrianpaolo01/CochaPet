const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarCredenciales({ correo, clave }) {
  const correoLimpio = correo.trim();
  if (!correoLimpio) return "Escribe tu correo";
  if (!FORMATO_CORREO.test(correoLimpio)) return "Escribe un correo válido, por ejemplo nombre@correo.com";
  if (!clave) return "Escribe tu contraseña";
  return null;
}

export function textoSesion(usuario) {
  if (!usuario) return "Iniciar sesión";
  const primerNombre = String(usuario.nombre ?? "").trim().split(/\s+/)[0];
  return primerNombre ? `Hola, ${primerNombre}` : "Mi cuenta";
}
