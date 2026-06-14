/**
 * Duraciones por foto del tramo familia, alineadas a beats del audio
 * `teaser-grabacion-14-06-2026.m4a` (librosa, tramo 5,6 s → 40 s).
 * Regenerar con el script de análisis si cambia el audio.
 */
export const TEASER_FAMILIA_BEAT_CUTS_MS: readonly number[] = [
  368, 1022, 1556, 1022, 1556, 882, 1533, 1022, 1579, 1022, 1370, 1022, 1579, 1463, 929, 1579,
  1045, 1533, 1022, 1556, 1045, 1533, 1045, 1556, 1022, 1556, 1556, 433,
];

/** Desactivado por ahora — activar cuando retomemos el sync al ritmo */
export const TEASER_FAMILIA_USE_BEAT_SYNC = false;
