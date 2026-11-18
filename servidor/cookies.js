export function leerCookie(cabecera, nombre) {
  const cookies = String(cabecera ?? "").split(";").map((cookie) => cookie.trim());
  const par = cookies.find((cookie) => cookie.startsWith(`${nombre}=`));
  return par ? par.slice(nombre.length + 1) : null;
}
