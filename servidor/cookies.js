export function leerCookie(cabecera, nombre) {
  const par = String(cabecera ?? "").split("; ").find((cookie) => cookie.startsWith(`${nombre}=`));
  return par ? par.slice(nombre.length + 1) : null;
}
