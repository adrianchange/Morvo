import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const MORVO_RED = "#CC0000";
const MORVO_DARK_RED = "#880000";
export { MORVO_RED };
export const ESMERALDA_SALMON = "#FA8072";
export const ESMERALDA_SALMON_DARK = "#C45A4E";
export const TEASER_CREDIT_DARK_BLUE = "#1A2F4A";

const MORVO_LETTERS = ["M", "O", "R", "V", "O"] as const;
const MORVO_FLICKER_DELAYS = [0, 0.45, 0.9, 0.22, 0.68];

const morvoFlickerTransition = (delay: number) => ({
  duration: 1.6,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay,
  repeatDelay: 0.15,
  times: [0, 0.08, 0.16, 0.28, 0.38, 0.5, 0.62, 0.76, 0.88, 1],
});

function morvoFlickerShadows(color: string, darkColor: string) {
  return [
    `0 0 28px ${color}ee, 0 0 56px ${color}99`,
    `0 0 2px ${darkColor}33`,
    `0 0 36px ${color}ff, 0 0 72px ${color}aa`,
    `0 0 4px ${darkColor}44`,
    `0 0 32px ${color}ee, 0 0 64px ${color}88`,
    `0 0 1px ${darkColor}22`,
    `0 0 40px ${color}ff, 0 0 80px ${color}bb`,
    `0 0 6px ${darkColor}55`,
    `0 0 30px ${color}ee, 0 0 60px ${color}99`,
  ];
}

function MorvoFlickerText({
  children,
  delay = 0,
  color = MORVO_RED,
  darkColor = MORVO_DARK_RED,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  color?: string;
  darkColor?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.span
      style={{ color, ...style }}
      animate={{
        opacity: [1, 0.1, 1, 0.35, 1, 0.06, 1, 0.55, 1],
        textShadow: morvoFlickerShadows(color, darkColor),
      }}
      transition={morvoFlickerTransition(delay)}
    >
      {children}
    </motion.span>
  );
}

function MorvoFlickerLetter({
  letter,
  delay,
  color,
  darkColor,
}: {
  letter: string;
  delay: number;
  color?: string;
  darkColor?: string;
}) {
  return (
    <MorvoFlickerText
      delay={delay}
      color={color}
      darkColor={darkColor}
      style={{ display: "inline-block" }}
    >
      {letter}
    </MorvoFlickerText>
  );
}

const morvoSubtitleFlickerTransition = (delay: number) => ({
  duration: 3.6,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay,
  repeatDelay: 0.35,
});

function MorvoSubtitleFlicker({
  children,
  delay = 0,
  style,
  color = MORVO_RED,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: CSSProperties;
  color?: string;
}) {
  return (
    <motion.span
      style={{ color, display: "inline-block", ...style }}
      animate={{
        opacity: [0.94, 1, 0.96, 1, 0.95, 1],
        textShadow: [
          `0 0 10px ${color}99, 0 0 20px ${color}33`,
          `0 0 16px ${color}cc, 0 0 32px ${color}66`,
          `0 0 8px ${color}88, 0 0 18px ${color}44`,
          `0 0 22px ${color}ee, 0 0 44px ${color}88, 0 0 6px ${color}bb`,
          `0 0 12px ${color}aa, 0 0 26px ${color}55`,
          `0 0 18px ${color}bb, 0 0 36px ${color}77`,
        ],
      }}
      transition={morvoSubtitleFlickerTransition(delay)}
    >
      {children}
    </motion.span>
  );
}

type MorvoTeaserTitleHeadlineProps = {
  font: string;
  /** cqw/cqh dentro del vídeo; vw/vh en portada dossier */
  sizeUnit?: "cq" | "vw";
  style?: CSSProperties;
  /** Color de «de Naz Montés» — por defecto azul del cierre teaser */
  creditColor?: string;
  /** Color del título MORVO — por defecto rojo parpadeante */
  titleColor?: string;
  titleDarkColor?: string;
  /** Centra el crédito en escritorio (móvil siempre centrado) */
  centerCredit?: boolean;
  /** Ajuste vertical del crédito en escritorio (px) */
  creditDesktopOffsetY?: number;
};

/** Título MORVO + «de Naz Montés» — igual que el cierre del teaser */
export function MorvoTeaserTitleHeadline({
  font,
  sizeUnit = "cq",
  style,
  creditColor = TEASER_CREDIT_DARK_BLUE,
  titleColor = MORVO_RED,
  titleDarkColor = MORVO_DARK_RED,
  centerCredit = false,
  creditDesktopOffsetY = 0,
}: MorvoTeaserTitleHeadlineProps) {
  const isMobile = useIsMobile();
  const w = sizeUnit === "cq" ? "cqw" : "vw";
  const h = sizeUnit === "cq" ? "cqh" : "vh";
  const creditCentered = isMobile || centerCredit;
  const desktopCreditNudge =
    !isMobile && creditDesktopOffsetY !== 0 ? creditDesktopOffsetY : 0;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: isMobile
          ? `clamp(4px, 1${h}, 8px)`
          : centerCredit
            ? `clamp(2px, 0.9${h}, 8px)`
            : `clamp(8px, 1.8${h}, 16px)`,
        maxWidth: "100%",
        transform: isMobile
          ? `translateY(clamp(-28px, -10${h}, -56px))`
          : `translateY(clamp(-8px, -2.5${h}, -18px))`,
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: font,
          fontSize: isMobile
            ? `clamp(14px, min(13${w}, 18${h}), 56px)`
            : `clamp(16px, min(15${w}, 22${h}), 80px)`,
          fontWeight: 700,
          letterSpacing: `clamp(0.04em, 1.2${w}, 0.12em)`,
          display: "inline-flex",
          alignItems: "baseline",
          justifyContent: "center",
          alignSelf: "center",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
      >
        {MORVO_LETTERS.map((ch, i) => (
          <MorvoFlickerLetter
            key={`${ch}-${i}`}
            letter={ch}
            delay={MORVO_FLICKER_DELAYS[i]}
            color={titleColor}
            darkColor={titleDarkColor}
          />
        ))}
      </span>
      <span
        style={{
          ...(creditCentered ? { alignSelf: "center" } : { alignSelf: "flex-end" }),
          ...(desktopCreditNudge !== 0 ? { marginTop: desktopCreditNudge } : {}),
        }}
      >
        <MorvoSubtitleFlicker
          delay={0.8}
          color={creditColor}
          style={{
            fontFamily: font,
            fontSize: isMobile
              ? `clamp(6px, min(2.2${w}, 3.2${h}), 11px)`
              : `clamp(7px, min(2.6${w}, 4${h}), 15px)`,
            fontWeight: 500,
            letterSpacing: isMobile ? "0.05em" : "0.06em",
            textAlign: creditCentered ? "center" : "right",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            maxWidth: "100%",
            lineHeight: 1.2,
            paddingRight: creditCentered ? 0 : "0.04em",
            display: "inline-block",
          }}
        >
          de Naz Montés
        </MorvoSubtitleFlicker>
      </span>
    </div>
  );
}
