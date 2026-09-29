# MORVO — Laboratorio de identidad visual

> Laboratorio web para explorar la identidad gráfica de la producción teatral **MORVO** (*Compañía OBSCENA Teatral*).  
> React · TypeScript · Vite · Motion · **13 paletas** intercambiables.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

> **Versión de entrega para salas:** [MORVO-Final](https://github.com/adrianchange/MORVO-Final) · [Demo en vivo](https://morvo-final.vercel.app)

---

## Qué es este repo

**Morvo** es el **laboratorio de diseño** del dossier: un entorno para probar, comparar y afinar líneas visuales antes de fijar la versión institucional.

A diferencia de [MORVO-Final](https://github.com/adrianchange/MORVO-Final) (dossier cerrado en **Raíz Petróleo**), aquí el usuario elige una paleta en un selector animado y recorre el mismo dossier con tipografías, fondos, créditos y teaser adaptados a cada identidad.

Sirve para:

- Explorar variantes cromáticas de la marca MORVO sin duplicar contenido.
- Validar animaciones del título (gota / lágrima en la **V**) por línea visual.
- Generar material de referencia para redes, flyers y campañas.
- Iterar el sistema de temas que alimenta la versión de producción.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | **React 19** + **TypeScript 6** |
| Build | **Vite 8** |
| Animación | **Motion** |
| Tipografía | Google Fonts + **Killing Eve** (custom) |
| Despliegue | Build estático (`dist/`) |

Sin backend: contenido embebido, navegación 100 % cliente.

---

## Funcionalidades

- **Selector de paletas** (`VColorPicker`) con previsualización del logotipo MORVO.
- **Dossier de 8 slides** compartido entre identidades: portada, flyer, sinopsis, tres personajes, directora y teaser + contacto.
- **Navegación**: teclado (← →, espacio, Escape), swipe en móvil, indicadores de progreso.
- **Viewport 16:9** en escritorio; pantalla completa en móvil.
- Modo de grabación del teaser Petróleo (`?record=petroleo`) para exportar montajes.

---

## Sistema multi-paleta

Temas centralizados en `src/theme/`:

| Archivo | Rol |
|---------|-----|
| `palettes.ts` | Tokens por identidad (`greenDark`, `accent`, `bg`, `text`, `titleLetters`, `titleV`…) |
| `typography.ts` | Familias y escalas del título MORVO |
| `swap.ts` | Estado cromático compartido y transiciones |

### Concepto dramático

Litúrgico · Hospital · Podredumbre · Invertida · Mezcla

### Serie Raíz (Killing Eve / difusión)

Selva · Forest · Black · Pino · **Petróleo** · Helecho · Niebla · Esmeralda

Cada paleta cambia fondo, tipografía, créditos y comportamiento del teaser sin reescribir las slides.

---

## Animaciones de marca

`CoverTitle.tsx` monta el título **MORVO**:

- Glifo **V** en SVG a partir de `KillingEve.ttf` (métricas tipográficas reales).
- Variantes de chorreo según paleta (Helecho, Niebla, Pino, Selva…).
- Créditos sincronizados (*Naz Montés*, *Compañía OBSCENA Teatral*).
- Calibración responsive (breakpoint 768 px).

---

## Estructura

```
src/
├── App.tsx                 # Selector de paleta → dossier
├── components/
│   ├── VColorPicker.tsx    # Laboratorio de identidades
│   ├── CoverTitle.tsx      # Título MORVO + animaciones V
│   ├── Dossier.tsx         # Slides y navegación
│   ├── TeaserVideo.tsx     # Montaje audiovisual por paleta
│   └── slides/
├── theme/                  # Paletas, tipografía, tokens
└── hooks/
```

---

## Arrancar

```bash
npm install
npm run dev      # localhost + LAN
npm run build
npm run preview
```

1. Elige una **paleta** en el selector.
2. Navega con **← →** / **espacio**, clic o swipe.
3. **Escape** o «cambiar paleta» vuelve al laboratorio.

---

## Relación con MORVO-Final

| | **Morvo** (este repo) | **MORVO-Final** |
|--|----------------------|-----------------|
| Rol | Laboratorio / R&D visual | Entrega institucional |
| Paleta | 13, elegibles | Fija: Raíz Petróleo |
| Teaser | Montaje interactivo por tema | MP4 definitivo (`Teaser_v18`) |
| Demo | — | [morvo-final.vercel.app](https://morvo-final.vercel.app) |

---

## Documentación

- [Ficha de portfolio](docs/portfolio.md)
- [CV académico](docs/cv-academico.md)
- [LinkedIn](docs/linkedin.md)

---

## Licencia de fuentes

La fuente **Killing Eve** es freeware con condiciones de uso comercial — ver `public/fonts/KILLING-EVE-LICENSE.txt`.

---

## Tags

`react` · `typescript` · `vite` · `motion` · `design-system` · `multi-theme` · `svg-animation` · `theater` · `branding` · `spa`
