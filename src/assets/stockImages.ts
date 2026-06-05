/**
 * Banco de imágenes stock para MORVO.
 *
 * Lorem Picsum no permite buscar por temática (solo IDs aleatorios).
 * Para estas categorías usamos URLs fijas de Unsplash — la misma fuente
 * que alimenta Picsum — con `stockImage()`.
 * Para placeholders genéricos sigue disponible `picsum()`.
 */

export type StockImage = {
  id: string;
  label: string;
  url: string;
};

export type ImageCategory = {
  id: string;
  label: string;
  images: StockImage[];
};

/** Placeholder genérico vía Lorem Picsum */
export function picsum(id: number, width = 1200, height = 800): string {
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}

/** Imagen temática fija vía Unsplash (misma librería que Picsum) */
export function stockImage(
  photoPath: string,
  width = 1200,
  height = 800,
): string {
  return `https://images.unsplash.com/${photoPath}?w=${width}&h=${height}&fit=crop&auto=format`;
}

/** Inyecciones / jeringas — clínica estética */
export const INYECCIONES_CLINICA: StockImage[] = [
  {
    id: "inyeccion-1",
    label: "Jeringas y viales sobre superficie verde",
    url: stockImage("photo-1579684270320-dbe2a2eed886"),
  },
  {
    id: "inyeccion-2",
    label: "Jeringa y medicación, estética clínica",
    url: stockImage("photo-1584308666744-24d5c474f2ae"),
  },
  {
    id: "inyeccion-3",
    label: "Material de inyección y botox, still life",
    url: stockImage("photo-1631815589750-d645253112a2"),
  },
];

/** Charlas de coaching / dinámicas de grupo tipo secta */
export const CHARLAS_COACHING: StockImage[] = [
  {
    id: "coaching-1",
    label: "Grupo sentado en círculo al aire libre",
    url: stockImage("photo-1529156069898-49953db96173"),
  },
  {
    id: "coaching-2",
    label: "Taller grupal — orador y audiencia",
    url: stockImage("photo-1556761175-b413da4baf72"),
  },
  {
    id: "coaching-3",
    label: "Conferencia / multitud escuchando",
    url: stockImage("photo-1475721027880-d7718a47ac6b"),
  },
];

/** Rituales de gente en el bosque */
export const RITUALES_BOSQUE: StockImage[] = [
  {
    id: "ritual-1",
    label: "Mujer con máscara con cuernos en el bosque",
    url: stockImage("photo-1736507020688-414d0f88f6b5"),
  },
  {
    id: "ritual-2",
    label: "Figura enmascarada en bosque, atmósfera ritual",
    url: stockImage("photo-1726962083545-235ea66eb340"),
  },
  {
    id: "ritual-3",
    label: "Figura encapuchada caminando por el bosque",
    url: stockImage("photo-1726968317549-78819e56deef"),
  },
];

export const IMAGE_BANK: ImageCategory[] = [
  {
    id: "inyecciones",
    label: "Inyecciones / clínica estética",
    images: INYECCIONES_CLINICA,
  },
  {
    id: "coaching",
    label: "Charlas coaching / sectas",
    images: CHARLAS_COACHING,
  },
  {
    id: "rituales-bosque",
    label: "Rituales en el bosque",
    images: RITUALES_BOSQUE,
  },
];

/** Todas las imágenes del banco en un solo array */
export const ALL_STOCK_IMAGES: StockImage[] = IMAGE_BANK.flatMap((c) => c.images);

/** Imagen temática en tamaño teaser (16:9 pequeño) */
export function stockTeaserUrl(stock: StockImage): string {
  return stock.url.replace("w=1200&h=800", "w=800&h=450");
}

/** URLs teaser de cada categoría */
export const INYECCIONES_TEASER = INYECCIONES_CLINICA.map(stockTeaserUrl);
export const COACHING_TEASER = CHARLAS_COACHING.map(stockTeaserUrl);
export const RITUALES_TEASER = RITUALES_BOSQUE.map(stockTeaserUrl);
export const ALL_STOCK_TEASER = ALL_STOCK_IMAGES.map(stockTeaserUrl);

/** Buscar por id dentro del banco */
export function getStockImage(id: string): StockImage | undefined {
  return ALL_STOCK_IMAGES.find((img) => img.id === id);
}
