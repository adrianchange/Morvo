/**
 * Duraciones por foto del tramo familia, alineadas a beats del audio activo
 * (`teaser-grabacion-14-06-2026.m4a`, ventana audio 9,6 s → 35,2 s, trim +4 s).
 * 35 fotos (25 base + 10 inserts).
 */
export const TEASER_FAMILIA_BEAT_CUTS_MS: readonly number[] = [
  477, 511, 1045, 372, 998, 1045, 511, 1045, 534, 1022, 859, 511, 1022, 1068, 511, 1022, 441, 929,
  1045, 534, 1045, 488, 1045, 1022, 534, 1022, 1045, 511, 1022, 534, 1045, 1022, 511, 1022, 1045, 389,
];

export const TEASER_FAMILIA_USE_BEAT_SYNC = false;

export function teaserFamiliaMontageMs(photoCount: number): number {
  if (!TEASER_FAMILIA_USE_BEAT_SYNC || TEASER_FAMILIA_BEAT_CUTS_MS.length < photoCount) {
    return 0;
  }
  return TEASER_FAMILIA_BEAT_CUTS_MS.slice(0, photoCount).reduce((sum, ms) => sum + ms, 0);
}
