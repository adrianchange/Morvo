/**
 * Duraciones por foto del tramo familia, alineadas al audio activo
 * (`teaser-bach.m4a`, ventana 10,6 s → 30,0 s, ~94 BPM).
 * 37 fotos — generado con `node scripts/gen-familia-beat-cuts.mjs`.
 */
export const TEASER_FAMILIA_BEAT_CUTS_MS: readonly number[] = [
  420, 620, 640, 320, 620, 640, 260, 680, 560, 420, 640, 340, 640, 680, 340, 560, 640, 320, 640,
  640, 320, 620, 600, 400, 640, 320, 640, 580, 340, 680, 580, 380, 640, 320, 640, 660, 420,
];

export const TEASER_FAMILIA_USE_BEAT_SYNC = true;

export function teaserFamiliaMontageMs(photoCount: number): number {
  if (!TEASER_FAMILIA_USE_BEAT_SYNC || TEASER_FAMILIA_BEAT_CUTS_MS.length < photoCount) {
    return 0;
  }
  return TEASER_FAMILIA_BEAT_CUTS_MS.slice(0, photoCount).reduce((sum, ms) => sum + ms, 0);
}
