/** Fotos locales — paleta Raíz Petróleo (carpeta Morvo del escritorio) */
export const PETROLEO_PHOTOS = {
  mario: "/images/petroleo/Mario.jpg",
  cristian: "/images/petroleo/Cristian.jpg",
  victor: "/images/petroleo/Victor.jpg",
  portada: "/images/petroleo/Portada.jpg",
  sinopsis: "/images/petroleo/Sinopsis.jpg",
} as const;

/** Retratos 04–06: tono B/N unificado (referencia Cristian) */
export const PETROLEO_PORTRAIT_URLS = new Set<string>([
  PETROLEO_PHOTOS.mario,
  PETROLEO_PHOTOS.cristian,
  PETROLEO_PHOTOS.victor,
]);

export const PETROLEO_PORTRAIT_FILTER = "grayscale(100%) contrast(1.04) brightness(0.98)";

export function isPetroleoPortrait(url?: string): url is (typeof PETROLEO_PHOTOS)[keyof typeof PETROLEO_PHOTOS] {
  return url != null && PETROLEO_PORTRAIT_URLS.has(url);
}

export function getPetroleoPortraitFilter(url?: string): string | undefined {
  if (!isPetroleoPortrait(url)) return undefined;
  return PETROLEO_PORTRAIT_FILTER;
}
