export function fotoAmpliada(fotos, indice) {
  return fotos[indice] ?? null;
}

export function siguienteIndice(indice, total) {
  return (indice + 1) % total;
}

export function anteriorIndice(indice, total) {
  return (indice - 1 + total) % total;
}

export function hayVariasFotos(fotos) {
  return fotos.length > 1;
}

export function textoContador(indice, total) {
  return `${indice + 1} de ${total}`;
}
