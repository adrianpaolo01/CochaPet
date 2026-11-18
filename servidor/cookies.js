export function leerCookie(cabecera, nombre) {
  const par = cabecera.split("; ").find((cookie) => cookie.startsWith(`${nombre}=`));
  return par.slice(nombre.length + 1);
}
