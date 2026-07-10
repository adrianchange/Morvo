export type TeaserAudioPresetId =
  | "legacy-dual"
  | "grabacion-2026-06-12"
  | "grabacion-14-06-2026-full"
  | "grabacion-16-06-2026-full"
  | "ravel"
  | "siglocatorce"
  | "bach";

export type TeaserAudioPreset = {
  id: TeaserAudioPresetId;
  label: string;
  mode: "single" | "single-continuous" | "dual-with-synth";
  tracks: readonly [string] | readonly [string, string];
  /** 2.ª pista solo en `grabacion-2026-06-12` (tramo intermedio) */
  middleTrack?: string;
};

/** Audio intermedio del preset dual (grabación + intermedio) */
export const TEASER_MIDDLE_TRACK = "/audio/teaser-middle-13-06-2026.m4a";

export const TEASER_AUDIO_PRESETS: Record<TeaserAudioPresetId, TeaserAudioPreset> = {
  "legacy-dual": {
    id: "legacy-dual",
    label: "TeaserMusic1 + pitido + TeaserMusic2",
    mode: "dual-with-synth",
    tracks: ["/audio/TeaserMusic1.m4a", "/audio/TeaserMusic2.m4a"],
  },
  /** Setup que os gusta: grabación larga + audio intermedio (~15 s) */
  "grabacion-2026-06-12": {
    id: "grabacion-2026-06-12",
    label: "Grabación 12-06 + intermedio 13-06",
    mode: "single",
    tracks: ["/audio/teaser-grabacion-12-06-2026.m4a"],
    middleTrack: TEASER_MIDDLE_TRACK,
  },
  /** Prueba: un solo archivo ~61 s (sustituye a los dos anteriores) */
  "grabacion-14-06-2026-full": {
    id: "grabacion-14-06-2026-full",
    label: "Grabación completa 14-06-2026 (~61 s)",
    mode: "single-continuous",
    tracks: ["/audio/teaser-grabacion-14-06-2026.m4a"],
  },
  /** Grabación 16-06 (13:18) recortada a 60 s */
  "grabacion-16-06-2026-full": {
    id: "grabacion-16-06-2026-full",
    label: "Grabación 16-06-2026 13:57 (60 s)",
    mode: "single-continuous",
    tracks: ["/audio/teaser-grabacion-16-06-2026.m4a"],
  },
  /** Ravel — Descargas */
  ravel: {
    id: "ravel",
    label: "Ravel",
    mode: "single-continuous",
    tracks: ["/audio/teaser-ravel.m4a"],
  },
  /** Siglocatorce — Descargas */
  siglocatorce: {
    id: "siglocatorce",
    label: "Siglocatorce",
    mode: "single-continuous",
    tracks: ["/audio/teaser-siglocatorce.m4a"],
  },
  /** Bach — Descargas */
  bach: {
    id: "bach",
    label: "Bach",
    mode: "single-continuous",
    tracks: ["/audio/teaser-bach.m4a"],
  },
};

/**
 * Preset activo.
 * - Prueba ahora: `"grabacion-14-06-2026-full"`
 * - Volver al que os gusta (dos audios): `"grabacion-2026-06-12"`
 */
export const ACTIVE_TEASER_AUDIO_ID: TeaserAudioPresetId = "bach";

export const ACTIVE_TEASER_AUDIO = TEASER_AUDIO_PRESETS[ACTIVE_TEASER_AUDIO_ID];

export const TEASER_USES_SYNTH_MIDDLE = ACTIVE_TEASER_AUDIO.mode === "dual-with-synth";
