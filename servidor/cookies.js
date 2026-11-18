export function cookieBorrada({ seguro = false } = {}) {
  return `sesion=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${seguro ? "; Secure" : ""}`;
}

export function cookieDeSesion(token, expiraEn, { ahora = new Date(), seguro = false } = {}) {
  const segundos = Math.floor((expiraEn - ahora) / 1000);
  return `sesion=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${segundos}${seguro ? "; Secure" : ""}`;
}

export function leerCookie(cabecera, nombre) {
  const cookies = String(cabecera ?? "").split(";").map((cookie) => cookie.trim());
  const par = cookies.find((cookie) => cookie.startsWith(`${nombre}=`));
  return par ? par.slice(nombre.length + 1) : null;
}
