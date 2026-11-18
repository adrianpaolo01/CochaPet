const TEXTOS_ESTADO = { ACTIVA: "Activa", VOLVIO_A_CASA: "Volvió a casa" };

export function textoEstado(estado) {
  return TEXTOS_ESTADO[estado];
}
