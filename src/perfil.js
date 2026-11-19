const TEXTOS_ESTADO = { ACTIVA: "Activa", VOLVIO_A_CASA: "Volvió a casa" };

export function textoEstado(estado) {
  return TEXTOS_ESTADO[estado];
}

export function validarDatosPerfil({ nombre, telefono }) {
  if (!nombre?.trim() || !telefono?.trim()) return "Completa tu nombre y teléfono";
  return null;
}
