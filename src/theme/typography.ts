export type PaletteFonts = {
  display: string;
  body: string;
};

const DEFAULT_FONTS: PaletteFonts = {
  display: "'Cinzel', serif",
  body: "'Cormorant Garamond', serif",
};

/**
 * Solo paleta Invertida — no reutilizar en otras versiones.
 * Libre Baskerville (títulos) + Source Serif 4 (cuerpo).
 */
export const INVERTIDA_FONTS: PaletteFonts = {
  display: "'Libre Baskerville', serif",
  body: "'Source Serif 4', serif",
};

/** Raíz Helecho — cuerpo: sans condensada similar a Killing; acentos completos */
export const HELECHO_FONTS: PaletteFonts = {
  display: "'Barlow Condensed', sans-serif",
  body: "'Barlow Condensed', sans-serif",
};

/** Solo el título MORVO usa la réplica Killing Eve */
export const HELECHO_TITLE_FONT = "'Killing', sans-serif";

/** Título portada Helecho — Killing mide visualmente más pequeño que Cinzel a igual px */
export const HELECHO_TITLE_FONT_SIZE = "clamp(90px, 16.5vw, 265px)";

/** Estilo título MORVO — mayúsculas, kerning apretado como en la serie */
export const HELECHO_TITLE_STYLE = {
  fontFamily: HELECHO_TITLE_FONT,
  letterSpacing: "0.02em",
  fontWeight: 400,
  lineHeight: 1,
  textTransform: "uppercase" as const,
};

/** Raíz Selva — crédito portada (solo subtítulo) */
export const SELVA_CREDIT_FONT = "'Bodoni Moda', serif";

/** Raíz Niebla — estira el título en horizontal (misma altura, más presencia en portada) */
export const NIEBLA_TITLE_SCALE_X = 1.14;

/** Raíz Selva — un poco más ancho que Niebla/Pino */
export const SELVA_TITLE_SCALE_X = 1.34;

/** Raíz Helecho — estiramiento horizontal del título MORVO */
export const HELECHO_TITLE_SCALE_X = 1.26;

type ThemeWithFonts = { fonts?: PaletteFonts };

export function paletteFonts(theme: ThemeWithFonts): PaletteFonts {
  return theme.fonts ?? DEFAULT_FONTS;
}

export function fontDisplay(theme: ThemeWithFonts): string {
  return paletteFonts(theme).display;
}

export function fontBody(theme: ThemeWithFonts): string {
  return paletteFonts(theme).body;
}
