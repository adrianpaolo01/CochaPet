export function fotoAmpliada(fotos, indice) {
  return fotos[indice] ?? null;
}

export function siguienteIndice(indice, total) {
  return (indice + 1) % total;
}

export function anteriorIndice(indice) {
  return indice - 1;
}
