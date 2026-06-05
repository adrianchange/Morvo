import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ALL_STOCK_TEASER,
  COACHING_TEASER,
  INYECCIONES_TEASER,
  RITUALES_TEASER,
} from "../assets/stockImages";

const SEQUOIA_IMG = "https://images.unsplash.com/photo-1758010408745-351cc25037c5?w=1600&h=900&fit=crop&auto=format";

const MASK_HORSE_SHOP = "https://images.unsplash.com/photo-1516944486937-aca8e1c5cfce?w=800&h=450&fit=crop&auto=format";
const MASK_HORSE_RED = "https://images.unsplash.com/photo-1771980590254-cbe347e4003e?w=800&h=450&fit=crop&auto=format";
const MASK_CREEPY = "https://images.unsplash.com/photo-1724380597255-944485791d3d?w=800&h=450&fit=crop&auto=format";
const MASK_HORNS = "https://images.unsplash.com/photo-1736507020688-414d0f88f6b5?w=800&h=450&fit=crop&auto=format";
const WOLVES_IMG = "https://images.unsplash.com/photo-1518504361720-82ccdc540022?w=800&h=450&fit=crop&auto=format";
const MASK_BUNNY = "https://images.unsplash.com/photo-1757975113966-d39e968e6110?w=800&h=450&fit=crop&auto=format";

const [INJ1, INJ2, INJ3] = INYECCIONES_TEASER;
const [COA1, COA2, COA3] = COACHING_TEASER;
const [RIT1, RIT2, RIT3] = RITUALES_TEASER;

const SALMON = "#FA8072";
const WHITE = "#ffffff";
const BLACK = "#000000";
const RED = "#CC0000";
const DARK_RED = "#880000";

// All palette colors from the project
const PINO = "#1E3A2C";
const PETROLEO = "#1A3A3F";
const HELECHO = "#3A5A42";
const NIEBLA = "#4A5D52";
const ESMERALDA = "#186B52";
const MEZCLA_RED = "#6B1020";
const RAIZ_OXIDO = "#7D5A4A";
const PETROLEO_LIGHT = "#D8E8E6";
const PINO_LIGHT = "#D4E0D0";
const ESMERALDA_LIGHT = "#B8E6D4";
const AMBER = "#FF6B35";

const ALL_MASKS = [MASK_HORSE_SHOP, MASK_HORSE_RED, MASK_CREEPY, MASK_HORNS, WOLVES_IMG, MASK_BUNNY];
const FLASH_POOL = [...ALL_STOCK_TEASER, ...ALL_MASKS];

type Frame = {
  duration: number;
  bg?: string;
  bgImg?: string;
  morvo?: boolean;
  morvoColor?: string;
};

const FRAMES: Frame[] = [
  // Phase 1: Sequoia calm (2s)
  { duration: 2000, bgImg: SEQUOIA_IMG },

  // Phase 2: MORVO in all palette colors (5s)
  { duration: 450, bg: PINO, morvo: true, morvoColor: SALMON },
  { duration: 250, bgImg: SEQUOIA_IMG },
  { duration: 400, bg: PETROLEO, morvo: true, morvoColor: PETROLEO_LIGHT },
  { duration: 220, bgImg: SEQUOIA_IMG },
  { duration: 380, bg: ESMERALDA, morvo: true, morvoColor: ESMERALDA_LIGHT },
  { duration: 200, bgImg: SEQUOIA_IMG },
  { duration: 350, bg: HELECHO, morvo: true, morvoColor: WHITE },
  { duration: 180, bgImg: SEQUOIA_IMG },
  { duration: 320, bg: NIEBLA, morvo: true, morvoColor: PINO_LIGHT },
  { duration: 160, bgImg: SEQUOIA_IMG },
  { duration: 300, bg: MEZCLA_RED, morvo: true, morvoColor: PINO },
  { duration: 150, bgImg: SEQUOIA_IMG },
  { duration: 280, bg: BLACK, morvo: true, morvoColor: RAIZ_OXIDO },
  { duration: 140, bgImg: SEQUOIA_IMG },

  // Phase 3: Los tres idiomas — SONIDO / IMAGEN / ILUMINACIÓN (4s)
  { duration: 200, bgImg: INJ1 },
  { duration: 280, bg: PINO, morvo: true, morvoColor: SALMON },
  { duration: 180, bgImg: COA1 },
  { duration: 260, bg: PETROLEO, morvo: true, morvoColor: WHITE },
  { duration: 170, bgImg: RIT1 },
  { duration: 250, bg: ESMERALDA, morvo: true, morvoColor: ESMERALDA_LIGHT },
  { duration: 160, bgImg: INJ2 },
  { duration: 230, bg: HELECHO, morvo: true, morvoColor: SALMON },
  { duration: 150, bgImg: COA2 },
  { duration: 220, bg: MEZCLA_RED, morvo: true, morvoColor: WHITE },
  { duration: 140, bgImg: RIT2 },
  { duration: 200, bg: NIEBLA, morvo: true, morvoColor: PINO_LIGHT },
  { duration: 130, bgImg: INJ3 },
  { duration: 190, bg: BLACK, morvo: true, morvoColor: RAIZ_OXIDO },
  { duration: 120, bgImg: COA3 },
  { duration: 180, bg: PINO, morvo: true, morvoColor: SALMON },
  { duration: 110, bgImg: RIT3 },

  // Phase 4: Aceleración — stock + máscaras + colores (3s)
  { duration: 100, bgImg: INJ1 },
  { duration: 140, bg: PINO, morvo: true, morvoColor: AMBER },
  { duration: 90, bgImg: COA2 },
  { duration: 120, bg: MEZCLA_RED, morvo: true, morvoColor: WHITE },
  { duration: 80, bgImg: RIT1 },
  { duration: 110, bg: PETROLEO, morvo: true, morvoColor: SALMON },
  { duration: 75, bgImg: MASK_CREEPY },
  { duration: 100, bg: ESMERALDA, morvo: true, morvoColor: WHITE },
  { duration: 70, bgImg: INJ3 },
  { duration: 95, bg: BLACK, morvo: true, morvoColor: RAIZ_OXIDO },
  { duration: 65, bgImg: COA3 },
  { duration: 90, bg: HELECHO, morvo: true, morvoColor: SALMON },
  { duration: 60, bgImg: RIT3 },
  { duration: 85, bg: NIEBLA, morvo: true, morvoColor: WHITE },
  { duration: 55, bgImg: MASK_HORNS },
  { duration: 80, bg: MEZCLA_RED, morvo: true, morvoColor: AMBER },

  // Phase 5: Frenético — todo mezclado (2s)
  { duration: 50, bgImg: INJ2 },
  { duration: 60, bg: PINO, morvo: true, morvoColor: SALMON },
  { duration: 45, bgImg: COA1 },
  { duration: 55, bg: MEZCLA_RED, morvo: true, morvoColor: WHITE },
  { duration: 40, bgImg: RIT2 },
  { duration: 50, bg: BLACK, morvo: true, morvoColor: RED },
  { duration: 38, bgImg: MASK_HORSE_SHOP },
  { duration: 48, bg: ESMERALDA, morvo: true, morvoColor: RED },
  { duration: 35, bgImg: INJ3 },
  { duration: 45, bg: PETROLEO, morvo: true, morvoColor: RED },
  { duration: 35, bgImg: COA3 },
  { duration: 42, bg: PINO, morvo: true, morvoColor: RED },
  { duration: 32, bgImg: RIT1 },
  { duration: 40, bg: BLACK, morvo: true, morvoColor: RED },
  { duration: 30, bgImg: WOLVES_IMG },
  { duration: 38, bg: MEZCLA_RED, morvo: true, morvoColor: RED },

  // Phase 6: RED HEARTBEAT finale (5s)
  { duration: 5000, bg: BLACK, morvo: true, morvoColor: RED },
];

const TOTAL_DURATION = FRAMES.reduce((sum, f) => sum + f.duration, 0);

type TeaserVideoProps = {
  font: string;
  accentColor?: string;
  onEnd?: () => void;
  style?: React.CSSProperties;
};

export function TeaserVideo({ font, accentColor = SALMON, onEnd, style }: TeaserVideoProps) {
  const [frameIdx, setFrameIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioScheduledSourceNode[]>([]);

  const stopAudio = useCallback(() => {
    for (const n of nodesRef.current) {
      try { n.stop(); } catch { /* */ }
    }
    nodesRef.current = [];
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }, []);

  const startAudio = useCallback(() => {
    try {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const dur = TOTAL_DURATION / 1000;
      const heartbeatStart = (TOTAL_DURATION - 5000) / 1000;

      const makeOsc = (freq: number, type: OscillatorType, attack: number, peak: number, end: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + attack);
        gain.gain.linearRampToValueAtTime(peak * 2, ctx.currentTime + dur * 0.8);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + end);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + end);
        nodesRef.current.push(osc);
      };

      makeOsc(852, "sine", 5, 0.06, dur);
      makeOsc(369, "sine", 3, 0.04, dur);
      makeOsc(55, "sawtooth", 4, 0.03, dur * 0.65);
      makeOsc(1200, "triangle", 7, 0.012, dur * 0.5);

      // Heartbeat during finale: low thuds
      const beatInterval = 0.5;
      let beatTime = heartbeatStart;
      let beatSpeed = beatInterval;
      while (beatTime < dur) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(40, ctx.currentTime + beatTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + beatTime + 0.15);
        gain.gain.setValueAtTime(0, ctx.currentTime + beatTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + beatTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + beatTime + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + beatTime);
        osc.stop(ctx.currentTime + beatTime + 0.3);
        nodesRef.current.push(osc);

        // Second thud (lub-dub)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(50, ctx.currentTime + beatTime + 0.12);
        osc2.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + beatTime + 0.27);
        gain2.gain.setValueAtTime(0, ctx.currentTime + beatTime + 0.12);
        gain2.gain.linearRampToValueAtTime(0.35, ctx.currentTime + beatTime + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + beatTime + 0.35);
        osc2.connect(gain2).connect(ctx.destination);
        osc2.start(ctx.currentTime + beatTime + 0.12);
        osc2.stop(ctx.currentTime + beatTime + 0.4);
        nodesRef.current.push(osc2);

        beatTime += beatSpeed;
        beatSpeed = Math.max(0.18, beatSpeed * 0.88);
      }
    } catch { /* */ }
  }, []);

  const play = useCallback(() => {
    setPlaying(true);
    setFrameIdx(0);
    startAudio();
  }, [startAudio]);

  useEffect(() => {
    if (!playing || frameIdx < 0) return;
    if (frameIdx >= FRAMES.length) {
      setPlaying(false);
      stopAudio();
      onEnd?.();
      return;
    }
    const timer = setTimeout(() => setFrameIdx((i) => i + 1), FRAMES[frameIdx].duration);
    return () => clearTimeout(timer);
  }, [playing, frameIdx, onEnd, stopAudio]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const frame = frameIdx >= 0 && frameIdx < FRAMES.length ? FRAMES[frameIdx] : null;
  const isLastFrame = frameIdx === FRAMES.length - 1;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        background: BLACK,
        overflow: "hidden",
        cursor: playing ? "default" : "pointer",
        borderRadius: 4,
        ...style,
      }}
      onClick={!playing ? play : undefined}
    >
      {!playing && frameIdx < 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            backgroundImage: `url(${SEQUOIA_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: `2px solid ${accentColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `22px solid ${accentColor}`,
                borderTop: "14px solid transparent",
                borderBottom: "14px solid transparent",
                marginLeft: 6,
              }}
            />
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 2,
              fontFamily: font,
              fontSize: 14,
              letterSpacing: "0.2em",
              color: accentColor,
              opacity: 0.8,
            }}
          >
            REPRODUCIR TEASER
          </div>
        </div>
      )}

      <AnimatePresence mode="sync">
        {frame && (
          <motion.div
            key={frameIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: frame.duration > 400 ? 0.15 : 0.02 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: frame.bgImg ? undefined : (frame.bg ?? BLACK),
              backgroundImage: frame.bgImg ? `url(${frame.bgImg})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {frame.bgImg && !frame.morvo && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }} />
            )}
            {frame.morvo && !isLastFrame && (
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  fontFamily: font,
                  fontSize: "clamp(24px, 4.5vw, 56px)",
                  fontWeight: 700,
                  color: frame.morvoColor ?? accentColor,
                  letterSpacing: "0.14em",
                  textShadow: `0 0 20px ${(frame.morvoColor ?? accentColor)}88, 0 0 50px ${(frame.morvoColor ?? accentColor)}44`,
                }}
              >
                MORVO
              </div>
            )}
            {isLastFrame && <HeartbeatMorvo font={font} />}
          </motion.div>
        )}
      </AnimatePresence>

      {playing && frameIdx >= 0 && frameIdx < FRAMES.length && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 3,
            background: accentColor,
            transition: "width 0.15s linear",
            width: `${((FRAMES.slice(0, frameIdx + 1).reduce((s, f) => s + f.duration, 0)) / TOTAL_DURATION) * 100}%`,
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}

function HeartbeatMorvo({ font }: { font: string }) {
  const [beat, setBeat] = useState(0);
  const speedRef = useRef(500);

  useEffect(() => {
    let timer: number;
    const pulse = () => {
      setBeat((b) => b + 1);
      speedRef.current = Math.max(180, speedRef.current * 0.88);
      timer = window.setTimeout(pulse, speedRef.current);
    };
    timer = window.setTimeout(pulse, speedRef.current);
    return () => clearTimeout(timer);
  }, []);

  const isContracted = beat % 2 === 0;
  const scale = isContracted ? 1.12 : 0.95;
  const intensity = Math.min(1, beat / 20);
  const glowBase = 30 + intensity * 50;
  const color = isContracted ? RED : DARK_RED;
  const maskFlash = beat > 10 && beat % 5 === 0;
  const maskIdx = beat % FLASH_POOL.length;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: maskFlash ? undefined : BLACK,
        backgroundImage: maskFlash ? `url(${FLASH_POOL[maskIdx]})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {maskFlash && (
        <div style={{ position: "absolute", inset: 0, background: `${RED}66` }} />
      )}
      <div
        style={{
          fontFamily: font,
          fontSize: "clamp(36px, 7vw, 80px)",
          fontWeight: 700,
          color,
          letterSpacing: "0.14em",
          transform: `scale(${scale})`,
          transition: `transform ${speedRef.current * 0.4}ms ease-out, color 0.05s`,
          textShadow: [
            `0 0 ${glowBase}px ${RED}dd`,
            `0 0 ${glowBase * 2}px ${RED}99`,
            `0 0 ${glowBase * 3}px ${DARK_RED}66`,
            `0 0 ${glowBase * 4}px ${DARK_RED}33`,
          ].join(", "),
          position: "relative",
          zIndex: 2,
        }}
      >
        MORVO
      </div>
    </div>
  );
}
