# MORVO — Dossier interactivo

Dossier digital de la obra (React + Vite + Motion).

## Arrancar

```bash
cd morvo-dossier
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).

## Uso

1. Elige una **paleta** (litúrgico, hospital, podredumbre, invertida).
2. Navega el dossier con **← →** o **espacio**, o clic en los lados.
3. **Escape** o «cambiar paleta» vuelve al selector.

## Estructura

```
src/
  components/
    VColorPicker.tsx    # selector de paleta
    CoverTitle.tsx      # título MORVO animado
    Dossier.tsx         # navegación entre slides
    slides/
      CoverSlide.tsx    # portada
      PlaceholderSlide.tsx
  theme/palettes.ts     # colores por paleta
```

## Build

```bash
npm run build
npm run preview
```

El PDF para teatros se exporta aparte (captura o «Imprimir → PDF»); las animaciones viven en la versión web.
