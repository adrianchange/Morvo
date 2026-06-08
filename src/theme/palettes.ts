import type { PaletteFonts } from "./typography";

import { HELECHO_FONTS, INVERTIDA_FONTS } from "./typography";

import {

  GREEN_HELECHO,

  GREEN_HELECHO_LIGHT,

  HELECHO_BG,

  HELECHO_CYAN,

  HELECHO_CYAN_BRIGHT,

  NIEBLA_BLACK,

  NIEBLA_RED,

  GREEN_ESMERALDA,

  GREEN_ESMERALDA_LIGHT,

  GREEN_NIEBLA,

  GREEN_NIEBLA_LIGHT,

  GREEN_PETROLEO,

  GREEN_PETROLEO_LIGHT,

  GREEN_PINO,

  GREEN_PINO_LIGHT,

  GREEN_RAIZ_BOSQUE,

  MEZCLA_RED,

  RAIZ_OXIDO,

  RAIZ_TEXT_LIGHT,

} from "./swap";



export type PaletteId =
  | "liturgico"
  | "hospital"
  | "tierra"
  | "invertida"
  | "mezcla"
  | "raiz"
  | "raiz_pino"
  | "raiz_petroleo"
  | "raiz_helecho"
  | "raiz_niebla"
  | "raiz_esmeralda";



export type PaletteTheme = {

  id: PaletteId;

  label: string;

  /** Nombre del verde bosque (selector de paletas) */

  greenLabel: string;

  greenDark: string;

  greenLight: string;

  accent: string;

  line: string;

  /** Tipografías propias de la paleta (solo invertida por ahora) */

  fonts?: PaletteFonts;

  /** Fondo de slide (paletas de dos tonos: litúrgico, mezcla…) */

  bg?: string;

  /** Texto principal sobre ese fondo */

  text?: string;

  /** Título MORVO en portada cuando hay fondo claro/lila */

  titleLetters?: string;

  titleV?: string;

  /** Portada mezcla: swap = fondo alterna; band = franja negra en el título */

  mezclaCoverMode?: "swap" | "band";

};



export const DEFAULT_BG = "#0A0A08";

export const DEFAULT_TEXT = "#EDE8D5";



export function slideBackground(theme: PaletteTheme): string {

  return theme.bg ?? DEFAULT_BG;

}



export function slideText(theme: PaletteTheme): string {

  return theme.text ?? DEFAULT_TEXT;

}



/** Portadas Raíz con layout premium (esmeralda / helecho / petróleo) */
export function isRaizPremium(theme: { id: PaletteId }): boolean {
  return (
    theme.id === "raiz_esmeralda" ||
    theme.id === "raiz_helecho" ||
    theme.id === "raiz_petroleo" ||
    theme.id === "raiz_niebla" ||
    theme.id === "raiz_pino"
  );
}

/** Mismos estilos que Raíz Helecho (layout, tipografía Killing, V con chorreo) */
export function isHelechoStyle(theme: { id: PaletteId }): boolean {
  return (
    theme.id === "raiz" ||
    theme.id === "raiz_helecho" ||
    theme.id === "raiz_petroleo" ||
    theme.id === "raiz_niebla" ||
    theme.id === "raiz_pino"
  );
}



export const PALETTES: Record<PaletteId, PaletteTheme> = {

  liturgico: {

    id: "liturgico",

    label: "Litúrgico",

    greenLabel: "pino",

    greenDark: GREEN_PINO,

    greenLight: GREEN_PINO_LIGHT,

    accent: GREEN_PINO,

    line: GREEN_PINO_LIGHT,

    bg: MEZCLA_RED,

    text: GREEN_PINO,

    titleLetters: GREEN_PINO,

    titleV: GREEN_PINO_LIGHT,

  },

  hospital: {

    id: "hospital",

    label: "Hospital",

    greenLabel: "petróleo",

    greenDark: GREEN_PETROLEO,

    greenLight: GREEN_PETROLEO_LIGHT,

    accent: GREEN_PETROLEO_LIGHT,

    line: GREEN_PETROLEO,

    titleLetters: GREEN_PETROLEO,

    titleV: MEZCLA_RED,

  },

  tierra: {

    id: "tierra",

    label: "Podredumbre",

    greenLabel: "helecho",

    greenDark: GREEN_HELECHO,

    greenLight: GREEN_HELECHO_LIGHT,

    accent: GREEN_HELECHO_LIGHT,

    line: GREEN_HELECHO,

  },

  invertida: {

    id: "invertida",

    label: "Invertida",

    greenLabel: "niebla",

    greenDark: GREEN_NIEBLA,

    greenLight: GREEN_NIEBLA_LIGHT,

    accent: GREEN_NIEBLA,

    line: GREEN_NIEBLA_LIGHT,

    text: MEZCLA_RED,

    titleLetters: MEZCLA_RED,

    titleV: DEFAULT_BG,

    fonts: INVERTIDA_FONTS,

  },

  mezcla: {

    id: "mezcla",

    label: "Mezcla",

    greenLabel: "esmeralda",

    greenDark: GREEN_ESMERALDA,

    greenLight: GREEN_ESMERALDA_LIGHT,

    accent: GREEN_ESMERALDA_LIGHT,

    line: GREEN_ESMERALDA_LIGHT,

    bg: GREEN_ESMERALDA,

    text: GREEN_ESMERALDA_LIGHT,

    mezclaCoverMode: "swap",

  },

  raiz: {
    id: "raiz",
    label: "Raíz",
    greenLabel: "selva",
    greenDark: GREEN_RAIZ_BOSQUE,
    greenLight: RAIZ_TEXT_LIGHT,
    accent: RAIZ_OXIDO,
    line: RAIZ_TEXT_LIGHT,
    bg: GREEN_RAIZ_BOSQUE,
    text: RAIZ_TEXT_LIGHT,
    titleLetters: RAIZ_TEXT_LIGHT,
    titleV: GREEN_RAIZ_BOSQUE,
  },
  raiz_pino: {
    id: "raiz_pino",
    label: "Raíz Pino",
    greenLabel: "pino",
    greenDark: NIEBLA_BLACK,
    greenLight: NIEBLA_BLACK,
    accent: NIEBLA_BLACK,
    line: NIEBLA_BLACK,
    fonts: HELECHO_FONTS,
    bg: HELECHO_CYAN,
    text: NIEBLA_BLACK,
    titleLetters: NIEBLA_BLACK,
    titleV: HELECHO_CYAN,
  },
  raiz_petroleo: {
    id: "raiz_petroleo",
    label: "Raíz Petróleo",
    greenLabel: "cian",
    greenDark: HELECHO_CYAN,
    greenLight: HELECHO_CYAN_BRIGHT,
    accent: HELECHO_CYAN,
    line: HELECHO_CYAN,
    fonts: HELECHO_FONTS,
    bg: HELECHO_BG,
    text: HELECHO_CYAN,
    titleLetters: HELECHO_CYAN,
    titleV: HELECHO_BG,
  },
  raiz_helecho: {
    id: "raiz_helecho",
    label: "Raíz Helecho",
    greenLabel: "cian",
    greenDark: HELECHO_CYAN,
    greenLight: HELECHO_CYAN_BRIGHT,
    accent: HELECHO_CYAN,
    line: HELECHO_CYAN,
    fonts: HELECHO_FONTS,
    bg: HELECHO_BG,
    text: HELECHO_CYAN,
    titleLetters: HELECHO_CYAN,
    titleV: HELECHO_BG,
  },
  raiz_niebla: {
    id: "raiz_niebla",
    label: "Raíz Niebla",
    greenLabel: "niebla",
    greenDark: NIEBLA_BLACK,
    greenLight: NIEBLA_BLACK,
    accent: NIEBLA_BLACK,
    line: NIEBLA_BLACK,
    fonts: HELECHO_FONTS,
    bg: NIEBLA_RED,
    text: NIEBLA_BLACK,
    titleLetters: NIEBLA_BLACK,
    titleV: NIEBLA_RED,
  },
  raiz_esmeralda: {
    id: "raiz_esmeralda",
    label: "Raíz Esmeralda",
    greenLabel: "esmeralda",
    greenDark: GREEN_PINO,
    greenLight: GREEN_PINO_LIGHT,
    accent: "#FA8072",
    line: "#FA8072",
    bg: GREEN_PINO,
    text: "#FA8072",
    titleLetters: "#FA8072",
    titleV: GREEN_PINO,
  },
};

