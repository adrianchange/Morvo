import {
  HELECHO_V_ADVANCE,
  HELECHO_V_FLIP,
  HELECHO_V_INK_H,
  HELECHO_V_INNER_JOINT,
  HELECHO_V_PATH,
  HELECHO_V_UPEM,
} from "./helechoVGlyph";
import { motion } from "motion/react";
import { PALETTES, type PaletteId, type PaletteTheme } from "../theme/palettes";
import { type ReactNode } from "react";
import { fontDisplay, paletteFonts, HELECHO_FONTS, HELECHO_TITLE_STYLE } from "../theme/typography";
import {
  GREEN_PINO,
  GREEN_PINO_LIGHT,
  HELECHO_CYAN,
  MEZCLA_RED,
  RAIZ_OXIDO,
  swapColorTransition,
} from "../theme/swap";

const BG = "#0A0A08";

const LIT_LETTERS = "#2A1F35";
const LIT_V = "#E6E0EC";

const POD_RED = "#6B1020";
const POD_LIT = "#E6E0EC";

const INV_LETTERS = "#6B1020";

const moroColorTransition = swapColorTransition;
const vColorTransition = swapColorTransition;

const vBlinkTransition = {
  duration: 2.2,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.06, 0.12, 0.2, 0.28, 0.42, 0.5, 0.66, 0.74, 0.9, 1],
  repeatDelay: 0.6,
};

/** Parpadeo por resplandor; opacidad nunca baja de ~0.78 */
const invertidaVBlinkAnimate = {
  opacity: [1, 0.88, 1, 0.82, 1, 0.86, 1, 0.9, 1, 0.84, 1],
  textShadow: [
    "0 0 10px rgba(237,232,213,0.28)",
    "0 0 38px rgba(237,232,213,0.7)",
    "0 0 12px rgba(237,232,213,0.22)",
    "0 0 30px rgba(107,16,32,0.5)",
    "0 0 10px rgba(237,232,213,0.26)",
    "0 0 34px rgba(237,232,213,0.65)",
    "0 0 12px rgba(237,232,213,0.24)",
    "0 0 26px rgba(107,16,32,0.42)",
    "0 0 10px rgba(237,232,213,0.28)",
    "0 0 32px rgba(237,232,213,0.58)",
    "0 0 10px rgba(237,232,213,0.28)",
  ],
};

const TIERRA_GLOW_LIGHT = "rgba(230,224,236,0.8)";
const TIERRA_GLOW_DARK = "rgba(107,16,32,0.45)";

const RAIZ_GLOW_SOFT = "rgba(125,90,74,0.38)";
const RAIZ_GLOW_DIM = "rgba(27,61,46,0.28)";

const raizVTransition = {
  duration: 2.2,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.14, 0.28, 0.38, 0.52, 0.68, 1],
  repeatDelay: 0.35,
};

function raizVAnimate(greenDark: string) {
  return {
    opacity: [1, 0.9, 1, 0.88, 1, 0.92, 1, 0.9, 1, 0.91, 1],
    color: [greenDark, greenDark, RAIZ_OXIDO, "#6B5042", greenDark, RAIZ_OXIDO, greenDark],
    textShadow: [
      `0 0 12px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
      `0 0 4px ${RAIZ_GLOW_DIM}`,
      `0 0 14px ${RAIZ_GLOW_SOFT}, 0 0 6px ${RAIZ_GLOW_DIM}`,
      `0 0 5px ${RAIZ_GLOW_DIM}`,
      `0 0 12px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
      `0 0 4px ${RAIZ_GLOW_DIM}`,
      `0 0 13px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
    ],
  };
}

/** Crédito portada Raíz: verde claro ↔ verde oscuro, sin desaparecer */
export function RaizCredit({
  greenDark,
  greenLight,
}: {
  greenDark: string;
  greenLight: string;
}) {
  return (
    <motion.p
      style={{
        margin: 0,
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: "clamp(18px, 2.25vw, 48px)",
        letterSpacing: "0.22em",
        textTransform: "lowercase",
        color: greenLight,
      }}
      initial={{ opacity: 0.88 }}
      animate={{
        opacity: [1, 0.9, 1, 0.88, 1, 0.92, 1, 0.9, 1, 0.91, 1],
        color: [greenLight, greenDark, greenLight, greenDark, greenLight, greenDark, greenLight],
        textShadow: [
          `0 0 12px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
          `0 0 4px ${RAIZ_GLOW_DIM}`,
          `0 0 14px ${RAIZ_GLOW_SOFT}, 0 0 6px ${RAIZ_GLOW_DIM}`,
          `0 0 5px ${RAIZ_GLOW_DIM}`,
          `0 0 12px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
          `0 0 4px ${RAIZ_GLOW_DIM}`,
          `0 0 13px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
        ],
      }}
      transition={{
        opacity: { ...vBlinkTransition, delay: 0.5 },
        color: raizVTransition,
        textShadow: raizVTransition,
      }}
    >
      por Nazaret Montes
    </motion.p>
  );
}

const SALMON = "#FA8072";
export function EsmeraldaSalmonCredit() {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: "clamp(23.6px, 2.95vw, 63px)",
        letterSpacing: "0.11em",
        color: SALMON,
        alignSelf: "flex-end",
        paddingRight: "clamp(20px, 5vw, 80px)",
      }}
    >
      Nazareth Montés
    </p>
  );
}

function RaizBlinkV({ greenDark }: { greenDark: string }) {
  return (
    <motion.span
      style={{ display: "inline-block", color: greenDark }}
      animate={raizVAnimate(greenDark)}
      transition={{
        opacity: { ...vBlinkTransition },
        color: raizVTransition,
        textShadow: raizVTransition,
      }}
    >
      V
    </motion.span>
  );
}

import { GREEN_ESMERALDA } from "../theme/swap";

const SALMON_NEON = "rgba(250,128,114,0.9)";
const SALMON_NEON_MID = "rgba(230,100,90,0.7)";
const SALMON_NEON_DIM = "rgba(200,102,91,0.3)";

const esmeraldaNeonTransition = {
  duration: 2.18,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.05, 0.1, 0.18, 0.26, 0.36, 0.46, 0.58, 0.7, 0.84, 0.92, 1],
  repeatDelay: 0.12,
};

function esmeraldaVAnimate() {
  return {
    opacity: [1, 0.12, 1, 0.3, 1, 0.06, 1, 0.45, 1, 0.1, 1],
    color: [
      SALMON,
      "#FFFFFF",
      SALMON,
      "#FFFFFF",
      SALMON,
      "#FFFFFF",
      SALMON,
    ],
    textShadow: [
      `0 0 24px ${SALMON_NEON}, 0 0 52px ${SALMON_NEON_MID}, 0 0 90px ${SALMON_NEON_MID}, 0 0 130px rgba(230,100,90,0.25)`,
      `0 0 6px ${SALMON_NEON_DIM}`,
      `0 0 36px ${SALMON_NEON}, 0 0 70px ${SALMON_NEON_MID}, 0 0 110px rgba(230,100,90,0.5), 0 0 160px rgba(230,100,90,0.2)`,
      `0 0 8px ${SALMON_NEON_DIM}`,
      `0 0 30px ${SALMON_NEON}, 0 0 58px ${SALMON_NEON_MID}, 0 0 100px ${SALMON_NEON_MID}`,
      `0 0 7px ${SALMON_NEON_DIM}`,
      `0 0 42px ${SALMON_NEON}, 0 0 80px ${SALMON_NEON_MID}, 0 0 120px rgba(230,100,90,0.45), 0 0 170px rgba(230,100,90,0.18)`,
      `0 0 10px ${SALMON_NEON_DIM}`,
      `0 0 20px ${SALMON_NEON}, 0 0 42px ${SALMON_NEON_MID}`,
      `0 0 6px ${SALMON_NEON_DIM}`,
      `0 0 25px ${SALMON_NEON}, 0 0 48px ${SALMON_NEON_MID}`,
    ],
  };
}

export function EsmeraldaNeonV() {
  return (
    <motion.span
      style={{ display: "inline-block", color: SALMON }}
      animate={esmeraldaVAnimate()}
      transition={{
        opacity: esmeraldaNeonTransition,
        color: esmeraldaNeonTransition,
        textShadow: esmeraldaNeonTransition,
      }}
    >
      V
    </motion.span>
  );
}

const CYAN_NEON = "rgba(0,206,209,0.92)";
const CYAN_NEON_MID = "rgba(0,210,255,0.75)";
const CYAN_NEON_DIM = "rgba(0,206,209,0.28)";

function helechoVAnimate() {
  return {
    opacity: [1, 0.12, 1, 0.3, 1, 0.06, 1, 0.45, 1, 0.1, 1],
    textShadow: [
      `0 0 24px ${CYAN_NEON}, 0 0 52px ${CYAN_NEON_MID}, 0 0 90px ${CYAN_NEON_MID}, 0 0 130px rgba(0,210,255,0.25)`,
      `0 0 6px ${CYAN_NEON_DIM}`,
      `0 0 36px ${CYAN_NEON}, 0 0 70px ${CYAN_NEON_MID}, 0 0 110px rgba(0,210,255,0.5), 0 0 160px rgba(0,210,255,0.2)`,
      `0 0 8px ${CYAN_NEON_DIM}`,
      `0 0 30px ${CYAN_NEON}, 0 0 58px ${CYAN_NEON_MID}, 0 0 100px ${CYAN_NEON_MID}`,
      `0 0 7px ${CYAN_NEON_DIM}`,
      `0 0 42px ${CYAN_NEON}, 0 0 80px ${CYAN_NEON_MID}, 0 0 120px rgba(0,210,255,0.45), 0 0 170px rgba(0,210,255,0.18)`,
      `0 0 10px ${CYAN_NEON_DIM}`,
      `0 0 20px ${CYAN_NEON}, 0 0 42px ${CYAN_NEON_MID}`,
      `0 0 6px ${CYAN_NEON_DIM}`,
      `0 0 25px ${CYAN_NEON}, 0 0 48px ${CYAN_NEON_MID}`,
    ],
  };
}

function petroleoVBlinkFill(baseColor: string) {
  return [
    baseColor,
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    baseColor,
    baseColor,
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    baseColor,
    baseColor,
  ] as const;
}

const petroleoVBlinkTransition = {
  duration: 2.8,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.05, 0.12, 0.22, 0.34, 0.46, 0.52, 0.6, 0.7, 0.84, 1],
  repeatDelay: 0.15,
};

const HALO_CYAN_STRONG = `drop-shadow(0 0 24px ${CYAN_NEON}) drop-shadow(0 0 52px ${CYAN_NEON_MID}) drop-shadow(0 0 96px rgba(0,210,255,0.35))`;
const HALO_CYAN_DIM = `drop-shadow(0 0 8px ${CYAN_NEON_DIM})`;
const HALO_WHITE_GLOW_CYAN = `drop-shadow(0 0 32px rgba(255,255,255,0.92)) drop-shadow(0 0 64px ${CYAN_NEON_MID}) drop-shadow(0 0 110px rgba(0,210,255,0.5))`;

const BLACK_NEON = "rgba(10,10,8,0.88)";
const BLACK_NEON_MID = "rgba(10,10,8,0.58)";
const BLACK_NEON_DIM = "rgba(10,10,8,0.22)";
const HALO_BLACK_STRONG = `drop-shadow(0 0 24px ${BLACK_NEON}) drop-shadow(0 0 52px ${BLACK_NEON_MID}) drop-shadow(0 0 96px rgba(10,10,8,0.35))`;
const HALO_BLACK_DIM = `drop-shadow(0 0 8px ${BLACK_NEON_DIM})`;
const HALO_WHITE_GLOW_BLACK = `drop-shadow(0 0 32px rgba(255,255,255,0.92)) drop-shadow(0 0 64px ${BLACK_NEON_MID}) drop-shadow(0 0 110px rgba(10,10,8,0.45))`;

function premiumVBlinkSvgAnimate(halo: "cyan" | "black") {
  const strong = halo === "cyan" ? HALO_CYAN_STRONG : HALO_BLACK_STRONG;
  const dim = halo === "cyan" ? HALO_CYAN_DIM : HALO_BLACK_DIM;
  const white = halo === "cyan" ? HALO_WHITE_GLOW_CYAN : HALO_WHITE_GLOW_BLACK;

  return {
    opacity: [1, 0.12, 1, 0.3, 1, 0.06, 1, 0.45, 1, 0.1, 1],
    filter: [
      strong,
      dim,
      white,
      white,
      white,
      dim,
      strong,
      white,
      white,
      white,
      dim,
    ],
  };
}

/** Chorreo — hilo + gota; el hilo va detrás de la V y emerge por la punta */
const DRIP_LEN = 300;
const DRIP_LINE_W = 6;
const DRIP_DROP_R = 9;
const FONT_TIP_X = 168;
const FONT_TIP_Y = -199;
/** Arranca dentro del relleno de la V para salir sin hueco por la punta */
const DRIP_ORIGIN_Y = FONT_TIP_Y + 50;

const dripLineEndFont = (len: number) => FONT_TIP_Y - len + DRIP_DROP_R;

const dripStrokePath = (endY: number) =>
  `M${FONT_TIP_X},${DRIP_ORIGIN_Y} L${FONT_TIP_X},${endY}`;

const DRIP_PATHS = [
  dripStrokePath(DRIP_ORIGIN_Y),
  dripStrokePath(dripLineEndFont(90)),
  dripStrokePath(dripLineEndFont(200)),
  dripStrokePath(dripLineEndFont(DRIP_LEN)),
  dripStrokePath(dripLineEndFont(DRIP_LEN)),
  dripStrokePath(DRIP_ORIGIN_Y),
] as const;

const DRIP_DROP_CY = [
  FONT_TIP_Y,
  FONT_TIP_Y - 90 + DRIP_DROP_R * 0.35,
  FONT_TIP_Y - 200 + DRIP_DROP_R * 0.2,
  FONT_TIP_Y - DRIP_LEN,
  FONT_TIP_Y - DRIP_LEN,
  FONT_TIP_Y,
] as const;

const DRIP_DROP_R_ANIM = [0, DRIP_DROP_R * 0.55, DRIP_DROP_R * 0.85, DRIP_DROP_R, DRIP_DROP_R, 0] as const;

/** Niebla — recto desde junta, en línea junta → punta → final */
const NIEBLA_DRIP_DX = FONT_TIP_X - HELECHO_V_INNER_JOINT.x;
const NIEBLA_DRIP_DY = FONT_TIP_Y - HELECHO_V_INNER_JOINT.y;

const nieblaDripLead = (endY: number) => {
  const j = HELECHO_V_INNER_JOINT;
  if (endY >= j.y) return { x: j.x, y: j.y };
  const t = (endY - j.y) / NIEBLA_DRIP_DY;
  return { x: j.x + NIEBLA_DRIP_DX * t, y: endY };
};

const nieblaDripPath = (endY: number) => {
  const j = HELECHO_V_INNER_JOINT;
  if (endY >= j.y) return `M${j.x},${j.y} L${j.x},${j.y}`;
  const lead = nieblaDripLead(endY);
  return `M${j.x},${j.y} L${lead.x},${lead.y}`;
};

const NIEBLA_DRIP_END_Y = dripLineEndFont(DRIP_LEN);
const NIEBLA_DRIP_FULL = HELECHO_V_INNER_JOINT.y - NIEBLA_DRIP_END_Y;

const nieblaDripEndAt = (dripProgress: number) =>
  HELECHO_V_INNER_JOINT.y - (dripProgress / DRIP_LEN) * NIEBLA_DRIP_FULL;

const NIEBLA_DRIP_KEY_END_Y = [
  HELECHO_V_INNER_JOINT.y,
  nieblaDripEndAt(90),
  nieblaDripEndAt(200),
  NIEBLA_DRIP_END_Y,
  NIEBLA_DRIP_END_Y,
  HELECHO_V_INNER_JOINT.y,
] as const;

const NIEBLA_DRIP_PATHS = NIEBLA_DRIP_KEY_END_Y.map(nieblaDripPath);

const nieblaDropCxAt = (endY: number) => nieblaDripLead(endY).x;
const nieblaDropCyAt = (endY: number) => endY - DRIP_DROP_R * 0.35;

const NIEBLA_DRIP_DROP_CX = NIEBLA_DRIP_KEY_END_Y.map(nieblaDropCxAt);
const NIEBLA_DRIP_DROP_CY = NIEBLA_DRIP_KEY_END_Y.map(nieblaDropCyAt);

const nieblaDripTransition = {
  duration: 5,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.12, 0.28, 0.42, 0.78, 1],
  repeatDelay: 0.35,
};

const helechoDripTransition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.12, 0.28, 0.42, 0.78, 1],
  repeatDelay: 0.25,
};

function HelechoTitleRow({
  letterColor,
  whiteBlink = false,
  vColor = HELECHO_CYAN,
  halo = "cyan",
  dripVariant = "helecho",
}: {
  letterColor: string;
  whiteBlink?: boolean;
  vColor?: string;
  halo?: "cyan" | "black";
  dripVariant?: "helecho" | "niebla";
}) {
  const letters = ["M", "O", "R", "V", "O"] as const;
  return (
    <span
      style={{
        ...HELECHO_TITLE_STYLE,
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
      }}
    >
      {letters.map((ch, i) =>
        ch === "V" ? (
          <HelechoNeonV
            key={`helecho-${i}`}
            color={vColor}
            whiteBlink={whiteBlink}
            halo={halo}
            dripVariant={dripVariant}
          />
        ) : (
          <span
            key={`helecho-${i}`}
            style={{
              color: letterColor,
              fontFamily: HELECHO_TITLE_STYLE.fontFamily,
              fontWeight: HELECHO_TITLE_STYLE.fontWeight,
            }}
          >
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

export function HelechoNeonV({
  color = HELECHO_CYAN,
  whiteBlink = false,
  halo = "cyan",
  dripVariant = "helecho",
}: {
  color?: string;
  whiteBlink?: boolean;
  halo?: "cyan" | "black";
  dripVariant?: "helecho" | "niebla";
}) {
  const blinkFill = petroleoVBlinkFill(color);
  const isNieblaDrip = dripVariant === "niebla";
  const dripPaths = isNieblaDrip ? NIEBLA_DRIP_PATHS : DRIP_PATHS;
  const dripDropCy = isNieblaDrip ? NIEBLA_DRIP_DROP_CY : DRIP_DROP_CY;
  const dripDropCx = isNieblaDrip ? NIEBLA_DRIP_DROP_CX : undefined;
  const dripTransition = isNieblaDrip ? nieblaDripTransition : helechoDripTransition;
  const dripColor = isNieblaDrip ? MEZCLA_RED : color;

  const dripLineAnimate = {
    opacity: [0, 1, 1, 1, 1, 0],
    ...(whiteBlink && !isNieblaDrip ? { stroke: [...blinkFill] } : {}),
  };

  const dripLineTransition = {
    opacity: dripTransition,
    stroke: whiteBlink && !isNieblaDrip ? petroleoVBlinkTransition : dripTransition,
  };

  const dripLine = (
    <motion.path
      fill="none"
      stroke={whiteBlink && !isNieblaDrip ? undefined : dripColor}
      strokeWidth={DRIP_LINE_W}
      strokeLinecap={isNieblaDrip ? "butt" : "round"}
      shapeRendering="geometricPrecision"
      animate={{
        d: [...dripPaths],
        ...dripLineAnimate,
      }}
      transition={{
        d: dripTransition,
        ...dripLineTransition,
      }}
    />
  );

  const dripDrop = (
    <motion.circle
      cx={dripDropCx ? dripDropCx[0] : FONT_TIP_X}
      cy={dripDropCy[0]}
      r={DRIP_DROP_R_ANIM[0]}
      fill={whiteBlink && !isNieblaDrip ? undefined : dripColor}
      animate={{
        ...(dripDropCx ? { cx: [...dripDropCx] } : {}),
        cy: [...dripDropCy],
        r: [...DRIP_DROP_R_ANIM],
        opacity: [0, 1, 1, 1, 1, 0],
        ...(whiteBlink && !isNieblaDrip ? { fill: [...blinkFill] } : {}),
      }}
      transition={{
        ...(dripDropCx ? { cx: dripTransition } : {}),
        cy: dripTransition,
        r: dripTransition,
        opacity: dripTransition,
        fill: whiteBlink && !isNieblaDrip ? petroleoVBlinkTransition : dripTransition,
      }}
    />
  );

  return (
    <motion.svg
      viewBox={`0 0 ${HELECHO_V_ADVANCE} ${HELECHO_V_INK_H}`}
      aria-hidden
      style={{
        display: "inline-block",
        width: `${HELECHO_V_ADVANCE / HELECHO_V_UPEM}em`,
        height: `${HELECHO_V_INK_H / HELECHO_V_UPEM}em`,
        verticalAlign: "baseline",
        overflow: "visible",
        transform: "translateY(10px)",
      }}
      animate={whiteBlink ? premiumVBlinkSvgAnimate(halo) : helechoVAnimate()}
      transition={
        whiteBlink
          ? {
              opacity: petroleoVBlinkTransition,
              filter: petroleoVBlinkTransition,
            }
          : {
              opacity: esmeraldaNeonTransition,
              textShadow: esmeraldaNeonTransition,
            }
      }
    >
      <g transform={`translate(0, -12) ${HELECHO_V_FLIP}`}>
        {!isNieblaDrip && dripLine}
        <motion.path
          d={HELECHO_V_PATH}
          fill={whiteBlink ? undefined : color}
          shapeRendering="geometricPrecision"
          animate={whiteBlink ? { fill: [...blinkFill] } : undefined}
          transition={whiteBlink ? { fill: petroleoVBlinkTransition } : undefined}
        />
        {isNieblaDrip && dripLine}
        {dripDrop}
      </g>
    </motion.svg>
  );
}

export function HelechoChartreuseCredit({ color = HELECHO_CYAN }: { color?: string }) {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: HELECHO_FONTS.body,
        fontWeight: 500,
        fontSize: "clamp(23.6px, 2.95vw, 63px)",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color,
        alignSelf: "flex-end",
        paddingRight: "clamp(20px, 5vw, 80px)",
      }}
    >
      Nazareth Montés
    </p>
  );
}

export function EsmeraldaNeonCredit() {
  return (
    <motion.p
      style={{
        margin: 0,
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: "clamp(18px, 2.25vw, 48px)",
        letterSpacing: "0.22em",
        textTransform: "lowercase",
        color: GREEN_ESMERALDA,
      }}
      initial={{ opacity: 0 }}
      animate={esmeraldaVAnimate()}
      transition={{
        opacity: { ...esmeraldaNeonTransition, delay: 0.6 },
        color: esmeraldaNeonTransition,
        textShadow: esmeraldaNeonTransition,
      }}
    >
      por Nazaret Montes
    </motion.p>
  );
}

/** Crédito portada Podredumbre: mismo alternado rojo ↔ lavanda que la V */
export function TierraCredit() {
  return (
    <motion.p
      style={{
        margin: 0,
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: "clamp(18px, 2.25vw, 48px)",
        letterSpacing: "0.22em",
        textTransform: "lowercase",
        color: POD_RED,
      }}
      initial={{ opacity: 0 }}
      animate={{
        color: [POD_LIT, POD_LIT, POD_RED, POD_RED, POD_LIT, POD_RED, POD_LIT],
        opacity: [1, 0.15, 1, 0.7, 1, 0.05, 1, 0.85, 1],
        textShadow: [
          `0 0 40px ${TIERRA_GLOW_LIGHT}`,
          `0 0 4px ${TIERRA_GLOW_DARK}`,
          `0 0 55px ${TIERRA_GLOW_LIGHT}`,
          `0 0 8px ${TIERRA_GLOW_DARK}`,
          `0 0 45px ${TIERRA_GLOW_LIGHT}`,
        ],
      }}
      transition={{
        color: vColorTransition,
        opacity: { ...vBlinkTransition, delay: 0.8 },
        textShadow: vBlinkTransition,
      }}
    >
      por Nazaret Montes
    </motion.p>
  );
}

/** Crédito portada Invertida: mismo color y parpadeo que la V */
export function InvertidaCredit({ theme }: { theme: PaletteTheme }) {
  const vColor = theme.titleV ?? BG;
  return (
    <motion.p
      style={{
        margin: 0,
        fontFamily: paletteFonts(theme).body,
        fontStyle: "italic",
        fontSize: "clamp(18px, 2.25vw, 48px)",
        letterSpacing: "0.22em",
        textTransform: "lowercase",
        color: vColor,
      }}
      initial={{ opacity: 0.85, textShadow: "0 0 10px rgba(237,232,213,0.28)" }}
      animate={invertidaVBlinkAnimate}
      transition={{
        opacity: { ...vBlinkTransition, delay: 0.5 },
        textShadow: vBlinkTransition,
      }}
    >
      por Nazaret Montes
    </motion.p>
  );
}

function BlinkLetter({
  letter,
  color,
  glowLight = "rgba(230,224,236,0.8)",
  glowDark = "rgba(230,224,236,0.2)",
}: {
  letter: string;
  color: string;
  glowLight?: string;
  glowDark?: string;
}) {
  return (
    <motion.span
      style={{ display: "inline-block", color }}
      animate={{
        color,
        opacity: [1, 0.15, 1, 0.7, 1, 0.05, 1, 0.85, 1],
        textShadow: [
          `0 0 40px ${glowLight}`,
          `0 0 4px ${glowDark}`,
          `0 0 55px ${glowLight}`,
          `0 0 8px ${glowDark}`,
          `0 0 45px ${glowLight}`,
        ],
      }}
      transition={vBlinkTransition}
    >
      {letter}
    </motion.span>
  );
}

function BlinkV({
  color,
  glowLight,
  glowDark,
}: {
  color: string;
  glowLight?: string;
  glowDark?: string;
}) {
  return (
    <BlinkLetter
      letter="V"
      color={color}
      glowLight={glowLight}
      glowDark={glowDark}
    />
  );
}

/** Resplandor rojo vino + toque blanco neón en la V */
const HOSPITAL_V_GLOW_LIGHT = "rgba(138,30,45,0.75)";
const HOSPITAL_V_GLOW_DARK = "rgba(107,16,32,0.35)";
const HOSPITAL_V_GLOW_WHITE = "rgba(255,248,242,0.8)";

const LIT_V_GLOW_BRIGHT = "rgba(216,232,230,0.95)";
const LIT_V_GLOW_MID = "rgba(120,180,175,0.88)";
const LIT_V_GLOW_DIM = "rgba(30,58,44,0.28)";

const MEZCLA_V_BLACK = "#0A0A08";
const MEZCLA_V_GLOW_DARK = "rgba(0,0,0,0.9)";
const MEZCLA_V_GLOW_MID = "rgba(10,10,8,0.55)";

const mezclaVBlinkTransition = {
  duration: 1.5,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.05, 0.1, 0.16, 0.24, 0.34, 0.44, 0.58, 0.68, 0.82, 0.92, 1],
  repeatDelay: 0.2,
};

/** V en Hospital: rojo + destello blanco neón */
function HospitalBlinkV() {
  return (
    <motion.span
      style={{ display: "inline-block", color: POD_RED }}
      animate={{
        color: [POD_RED, "#B84858", POD_RED, "#9E2838", POD_RED, "#D06070", POD_RED],
        opacity: [1, 0.05, 1, 0.2, 1, 0.02, 1, 0.35, 1, 0.08, 1],
        textShadow: [
          `0 0 20px ${HOSPITAL_V_GLOW_WHITE}, 0 0 50px ${HOSPITAL_V_GLOW_LIGHT}, 0 0 8px ${HOSPITAL_V_GLOW_DARK}`,
          `0 0 6px ${HOSPITAL_V_GLOW_DARK}`,
          `0 0 35px ${HOSPITAL_V_GLOW_WHITE}, 0 0 65px ${HOSPITAL_V_GLOW_LIGHT}`,
          `0 0 10px ${HOSPITAL_V_GLOW_DARK}`,
          `0 0 28px ${HOSPITAL_V_GLOW_WHITE}, 0 0 55px ${HOSPITAL_V_GLOW_LIGHT}`,
          `0 0 8px ${HOSPITAL_V_GLOW_DARK}`,
          `0 0 40px ${HOSPITAL_V_GLOW_WHITE}, 0 0 70px ${HOSPITAL_V_GLOW_LIGHT}`,
          `0 0 12px ${HOSPITAL_V_GLOW_DARK}`,
          `0 0 32px ${HOSPITAL_V_GLOW_WHITE}, 0 0 60px ${HOSPITAL_V_GLOW_LIGHT}`,
        ],
      }}
      transition={{
        color: mezclaVBlinkTransition,
        opacity: mezclaVBlinkTransition,
        textShadow: mezclaVBlinkTransition,
      }}
    >
      V
    </motion.span>
  );
}

/** V en Litúrgico: alterna verde oscuro ↔ claro (mismo ritmo que Mezcla) */
function LiturgicoBlinkV() {
  return (
    <motion.span
      style={{ display: "inline-block", color: GREEN_PINO }}
      animate={{
        color: [
          GREEN_PINO,
          GREEN_PINO_LIGHT,
          GREEN_PINO,
          GREEN_PINO_LIGHT,
          GREEN_PINO,
          GREEN_PINO_LIGHT,
        ],
        opacity: [1, 0.05, 1, 0.2, 1, 0.02, 1, 0.35, 1, 0.08, 1],
        textShadow: [
          `0 0 55px ${LIT_V_GLOW_BRIGHT}`,
          `0 0 6px ${LIT_V_GLOW_DIM}`,
          `0 0 75px ${LIT_V_GLOW_MID}`,
          `0 0 10px ${LIT_V_GLOW_DIM}`,
          `0 0 60px ${LIT_V_GLOW_BRIGHT}`,
          `0 0 4px ${LIT_V_GLOW_DIM}`,
          `0 0 80px ${LIT_V_GLOW_MID}`,
          `0 0 8px ${LIT_V_GLOW_DIM}`,
          `0 0 65px ${LIT_V_GLOW_BRIGHT}`,
          `0 0 12px ${LIT_V_GLOW_DIM}`,
          `0 0 70px ${LIT_V_GLOW_MID}`,
        ],
      }}
      transition={{
        color: mezclaVBlinkTransition,
        opacity: mezclaVBlinkTransition,
        textShadow: mezclaVBlinkTransition,
      }}
    >
      V
    </motion.span>
  );
}

/** V en Mezcla: parpadeo intenso en negro */
function MezclaBlinkV() {
  return (
    <motion.span
      style={{ display: "inline-block", color: MEZCLA_V_BLACK }}
      animate={{
        color: [MEZCLA_V_BLACK, "#1A1A16", MEZCLA_V_BLACK, "#141412", MEZCLA_V_BLACK],
        opacity: [1, 0.05, 1, 0.2, 1, 0.02, 1, 0.35, 1, 0.08, 1],
        textShadow: [
          `0 0 50px ${MEZCLA_V_GLOW_DARK}, 0 0 25px ${MEZCLA_V_GLOW_MID}`,
          `0 0 6px rgba(0,0,0,0.3)`,
          `0 0 65px ${MEZCLA_V_GLOW_DARK}, 0 0 35px ${MEZCLA_V_GLOW_MID}`,
          `0 0 8px rgba(0,0,0,0.25)`,
          `0 0 55px ${MEZCLA_V_GLOW_DARK}, 0 0 30px ${MEZCLA_V_GLOW_MID}`,
          `0 0 5px rgba(0,0,0,0.2)`,
          `0 0 70px ${MEZCLA_V_GLOW_DARK}, 0 0 40px ${MEZCLA_V_GLOW_MID}`,
          `0 0 10px rgba(0,0,0,0.3)`,
          `0 0 60px ${MEZCLA_V_GLOW_DARK}, 0 0 32px ${MEZCLA_V_GLOW_MID}`,
        ],
      }}
      transition={{
        color: mezclaVBlinkTransition,
        opacity: mezclaVBlinkTransition,
        textShadow: mezclaVBlinkTransition,
      }}
    >
      V
    </motion.span>
  );
}

function titleLetterSpacing(compact?: boolean) {
  return compact ? "0.07em" : "0.18em";
}

function MezclaBlinkTitle({
  fontFamily,
  letterSpacing = "0.18em",
}: {
  fontFamily: string;
  letterSpacing?: string;
}) {
  const letters = ["M", "O", "R", "V", "O"] as const;
  return (
    <span
      style={{
        fontFamily,
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        letterSpacing,
      }}
    >
      {letters.map((ch, i) =>
        ch === "V" ? (
          <MezclaBlinkV key={`${ch}-${i}`} />
        ) : (
          <BlinkLetter
            key={`${ch}-${i}`}
            letter={ch}
            color={POD_RED}
            glowLight={HOSPITAL_V_GLOW_LIGHT}
            glowDark={HOSPITAL_V_GLOW_DARK}
          />
        )
      )}
    </span>
  );
}

function TitleAlternating({
  moroColors,
  vColors,
  glowLight,
  glowDark,
  fontFamily,
  letterSpacing = "0.18em",
}: {
  moroColors: string[];
  vColors: string[];
  glowLight: string;
  glowDark: string;
  fontFamily: string;
  letterSpacing?: string;
}) {
  return (
    <span
      style={{
        fontFamily,
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        letterSpacing,
      }}
    >
      <motion.span animate={{ color: moroColors }} transition={moroColorTransition}>
        MOR
      </motion.span>
      <motion.span
        style={{ display: "inline-block" }}
        animate={{
          color: vColors,
          opacity: [1, 0.15, 1, 0.7, 1, 0.05, 1, 0.85, 1],
          textShadow: [
            `0 0 40px ${glowLight}`,
            `0 0 4px ${glowDark}`,
            `0 0 55px ${glowLight}`,
            `0 0 8px ${glowDark}`,
            `0 0 45px ${glowLight}`,
          ],
        }}
        transition={{
          color: vColorTransition,
          opacity: vBlinkTransition,
          textShadow: vBlinkTransition,
        }}
      >
        V
      </motion.span>
      <motion.span animate={{ color: moroColors }} transition={moroColorTransition}>
        O
      </motion.span>
    </span>
  );
}

function TitleRow({
  letterColor,
  v,
  fontFamily,
  letterSpacing = "0.18em",
}: {
  letterColor: string;
  v: ReactNode;
  fontFamily: string;
  letterSpacing?: string;
}) {
  return (
    <span
      style={{
        fontFamily,
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        letterSpacing,
      }}
    >
      <span style={{ color: letterColor }}>MOR</span>
      {v}
      <span style={{ color: letterColor }}>O</span>
    </span>
  );
}

export function CoverTitle({
  palette,
  compact,
}: {
  palette: string;
  compact?: boolean;
}) {
  const theme = PALETTES[palette as PaletteId] ?? PALETTES.liturgico;
  const display = fontDisplay(theme);
  const ls = titleLetterSpacing(compact);

  switch (palette) {
    case "liturgico": {
      const lit = PALETTES.liturgico;
      if (lit.titleLetters && lit.titleV) {
        return (
          <TitleRow
            fontFamily={display}
            letterColor={lit.titleLetters}
            letterSpacing={ls}
            v={<LiturgicoBlinkV />}
          />
        );
      }
      return (
        <TitleRow
          fontFamily={display}
          letterColor={LIT_LETTERS}
          letterSpacing={ls}
          v={<BlinkV color={LIT_V} />}
        />
      );
    }
    case "hospital": {
      const hosp = PALETTES.hospital;
      return (
        <TitleRow
          fontFamily={display}
          letterColor={hosp.titleLetters ?? hosp.greenDark}
          letterSpacing={ls}
          v={<HospitalBlinkV />}
        />
      );
    }
    case "tierra":
      return (
        <TitleAlternating
          fontFamily={display}
          letterSpacing={ls}
          moroColors={[POD_RED, POD_RED, POD_LIT, POD_LIT, POD_RED]}
          vColors={[POD_LIT, POD_LIT, POD_RED, POD_RED, POD_LIT]}
          glowLight="rgba(230,224,236,0.8)"
          glowDark="rgba(107,16,32,0.45)"
        />
      );
    case "mezcla":
      return <MezclaBlinkTitle fontFamily={display} letterSpacing={ls} />;
    case "invertida": {
      const inv = PALETTES.invertida;
      const letters = inv.titleLetters ?? INV_LETTERS;
      const vColor = inv.titleV ?? BG;
      return (
        <span
          style={{
            fontFamily: display,
            display: "inline-flex",
            alignItems: "baseline",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
            letterSpacing: ls,
          }}
        >
          {["M", "O", "R"].map((ch) => (
            <span key={ch} style={{ color: letters }}>
              {ch}
            </span>
          ))}
          <motion.span
            style={{ display: "inline-block", color: vColor }}
            animate={invertidaVBlinkAnimate}
            transition={vBlinkTransition}
          >
            V
          </motion.span>
          <span style={{ color: letters }}>O</span>
        </span>
      );
    }
    default: {
      if (palette === "raiz_esmeralda") {
        return (
          <TitleRow
            fontFamily={display}
            letterColor={theme.titleLetters ?? theme.greenLight}
            letterSpacing={ls}
            v={<EsmeraldaNeonV />}
          />
        );
      }
      if (palette === "raiz_helecho" || palette === "raiz_petroleo" || palette === "raiz_niebla") {
        const isNiebla = palette === "raiz_niebla";
        return (
          <HelechoTitleRow
            letterColor={theme.titleLetters ?? HELECHO_CYAN}
            whiteBlink={palette === "raiz_petroleo" || isNiebla}
            vColor={isNiebla ? (theme.titleLetters ?? theme.text ?? HELECHO_CYAN) : HELECHO_CYAN}
            halo={isNiebla ? "black" : "cyan"}
            dripVariant={isNiebla ? "niebla" : "helecho"}
          />
        );
      }
      if (palette.startsWith("raiz")) {
        return (
          <TitleRow
            fontFamily={display}
            letterColor={theme.titleLetters ?? theme.greenLight}
            letterSpacing={ls}
            v={<RaizBlinkV greenDark={theme.greenDark} />}
          />
        );
      }
      return (
        <TitleRow
          fontFamily={display}
          letterColor={LIT_LETTERS}
          letterSpacing={ls}
          v={<BlinkV color={LIT_V} />}
        />
      );
    }
  }
}
