export function cookieDeSesion(token, expiraEn, { ahora = new Date() } = {}) {
  const segundos = Math.floor((expiraEn - ahora) / 1000);
  return `sesion=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${segundos}`;
}

export function leerCookie(cabecera, nombre) {
  const cookies = String(cabecera ?? "").split(";").map((cookie) => cookie.trim());
  const par = cookies.find((cookie) => cookie.startsWith(`${nombre}=`));
  return par ? par.slice(nombre.length + 1) : null;
}
