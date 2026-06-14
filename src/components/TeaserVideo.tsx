import { useEffect, useRef, useState, useCallback, useMemo, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  TEASER_FAMILIA_URLS,
  TEASER_MONTAGE_POOL,
  teaserRestPool,
} from "../assets/stockImages";

import { ACTIVE_TEASER_AUDIO } from "../assets/teaserAudio";
import {
  TEASER_FAMILIA_BEAT_CUTS_MS,
  TEASER_FAMILIA_USE_BEAT_SYNC,
} from "../assets/teaserFamiliaBeatCuts";

const SEQUOIA_IMG = "https://images.unsplash.com/photo-1758010408745-351cc25037c5?w=1600&h=900&fit=crop&auto=format";
const MASK_HORSE_SHOP = "https://images.unsplash.com/photo-1516944486937-aca8e1c5cfce?w=800&h=450&fit=crop&auto=format";
const MASK_CREEPY = "https://images.unsplash.com/photo-1724380597255-944485791d3d?w=800&h=450&fit=crop&auto=format";
const MASK_HORNS = "https://images.unsplash.com/photo-1736507020688-414d0f88f6b5?w=800&h=450&fit=crop&auto=format";
const WOLVES_IMG = "https://images.unsplash.com/photo-1518504361720-82ccdc540022?w=800&h=450&fit=crop&auto=format";

const EXTRA_TEASER_IMAGES = [SEQUOIA_IMG, MASK_HORSE_SHOP, MASK_CREEPY, MASK_HORNS, WOLVES_IMG];
const TEASER_REST_IMAGES = teaserRestPool(TEASER_MONTAGE_POOL, EXTRA_TEASER_IMAGES);
const ALL_TEASER_IMAGES = [...TEASER_FAMILIA_URLS, ...TEASER_REST_IMAGES];

const SALMON = "#FA8072";
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const RED = "#CC0000";
const DARK_RED = "#880000";

const TYPEWRITER_TEXT = "UNA VEZ NOS CONTARON UN CUENTO...";
const SYNTH_OVERLAY_TEXT = "Hoy te han traído aquí para que lo cambies";
const INTRO_REVEAL_MS = 4_800;
const INTRO_HOLD_MS = 800;
const INTRO_TYPEWRITER_MS = INTRO_REVEAL_MS + INTRO_HOLD_MS;
const OVERLAY_REVEAL_MS = 4_000;
const OVERLAY_HOLD_MS = 800;
/** Pitido/sintetizador — rellena el hueco (tiempo recuperado sin énfasis aislados) */
const SYNTH_FILL_MS = 8_000;
const SYNTH_MIDDLE_MS = OVERLAY_REVEAL_MS + OVERLAY_HOLD_MS + SYNTH_FILL_MS;
const OVERLAY_TEXT_MS = OVERLAY_REVEAL_MS + OVERLAY_HOLD_MS;
const AUDIO_BRIDGE_FADE_MS = 900;
/** Fade de cierre — últimos 3 s del teaser */
const AUDIO_END_FADE_MS = 3_000;
/** MORVO parpadeando — cierre del teaser */
const MORVO_FINAL_MS = 2_000;
/** Duración total del teaser */
const TOTAL_TEASER_MS =
  52_000 + (INTRO_TYPEWRITER_MS - 5_500) + (SYNTH_MIDDLE_MS - 4_500);
/** ~0,8 s por foto de familia (28 fotos → 22,4 s) */
const FAMILY_MONTAGE_CUT_MS = 800;
const FAMILY_MONTAGE_MS = TEASER_FAMILIA_URLS.length * FAMILY_MONTAGE_CUT_MS;
const REST_MONTAGE_MS =
  TOTAL_TEASER_MS -
  INTRO_TYPEWRITER_MS -
  SYNTH_MIDDLE_MS -
  MORVO_FINAL_MS -
  FAMILY_MONTAGE_MS;
const MUSIC1_SECTION_MS = INTRO_TYPEWRITER_MS + FAMILY_MONTAGE_MS;
const MUSIC2_START_MS = MUSIC1_SECTION_MS + SYNTH_MIDDLE_MS;
const MUSIC2_SECTION_MS = REST_MONTAGE_MS;

function teaserEndVolume(elapsedSec: number, teaserEndSec: number, baseVolume: number): number {
  const fadeSec = AUDIO_END_FADE_MS / 1000;
  const fadeStart = teaserEndSec - fadeSec;
  if (elapsedSec <= fadeStart) return baseVolume;
  if (elapsedSec >= teaserEndSec) return 0;
  return baseVolume * (1 - (elapsedSec - fadeStart) / fadeSec);
}

type ImageFit = "cover" | "contain";

type Frame = {
  duration: number;
  bg?: string;
  bgImg?: string;
  morvo?: boolean;
  typewriter?: boolean;
  overlayText?: string;
  fit?: ImageFit;
  /** Foto anterior a cover de fondo + actual a contain — solo 2.ª parte */
  layered?: boolean;
};

/** Reparte el tiempo entre todas las imágenes del pool, cada una una sola vez */
function buildUniqueMontage(
  pool: string[],
  totalMs: number,
  fit: ImageFit,
  layered = false,
): Frame[] {
  if (totalMs <= 0 || pool.length === 0) return [];

  const base = Math.floor(totalMs / pool.length);
  const extra = totalMs % pool.length;

  return pool.map((url, i) => ({
    duration: base + (i < extra ? 1 : 0),
    bgImg: url,
    fit,
    layered,
  }));
}

/** Montaje familia con duraciones fijas (p. ej. al ritmo del audio) */
function buildTimedMontage(
  pool: string[],
  cutMs: readonly number[],
  fit: ImageFit,
  layered = false,
): Frame[] {
  const n = Math.min(pool.length, cutMs.length);
  return pool.slice(0, n).map((url, i) => ({
    duration: cutMs[i],
    bgImg: url,
    fit,
    layered,
  }));
}

function buildFamilyMontage(): Frame[] {
  if (
    TEASER_FAMILIA_USE_BEAT_SYNC &&
    TEASER_FAMILIA_BEAT_CUTS_MS.length >= TEASER_FAMILIA_URLS.length
  ) {
    return buildTimedMontage(TEASER_FAMILIA_URLS, TEASER_FAMILIA_BEAT_CUTS_MS, "contain", false);
  }
  return buildUniqueMontage(TEASER_FAMILIA_URLS, FAMILY_MONTAGE_MS, "contain", false);
}

function buildTeaserFrames(): Frame[] {
  return [
    { duration: INTRO_TYPEWRITER_MS, bg: BLACK, typewriter: true },
    ...buildFamilyMontage(),
    { duration: SYNTH_MIDDLE_MS, bg: BLACK, overlayText: SYNTH_OVERLAY_TEXT },
    ...buildUniqueMontage(TEASER_REST_IMAGES, REST_MONTAGE_MS, "contain", true),
    { duration: MORVO_FINAL_MS, bg: BLACK, morvo: true },
  ];
}

function frameLocalElapsedMs(elapsedMs: number, frameIndex: number, frames: Frame[]): number {
  let acc = 0;
  for (let i = 0; i < frameIndex; i++) acc += frames[i].duration;
  return Math.max(0, elapsedMs - acc);
}

function frameIndexAt(elapsedMs: number, frames: Frame[]): number {
  let acc = 0;
  for (let i = 0; i < frames.length; i++) {
    acc += frames[i].duration;
    if (elapsedMs < acc) return i;
  }
  return Math.max(0, frames.length - 1);
}

function formatTime(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type TeaserVideoProps = {
  font: string;
  accentColor?: string;
  onEnd?: () => void;
  style?: React.CSSProperties;
};

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

function TeaserFilmGrain() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 4,
        opacity: 0.09,
        backgroundImage: GRAIN_SVG,
        backgroundRepeat: "repeat",
        backgroundSize: "180px 180px",
        mixBlendMode: "overlay",
      }}
    />
  );
}

const teaserImageCache = new Map<string, HTMLImageElement>();

function preloadTeaserImages(urls: readonly string[]): Promise<void> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          if (teaserImageCache.has(url)) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => {
            const done = () => {
              teaserImageCache.set(url, img);
              resolve();
            };
            if (img.decode) void img.decode().then(done).catch(done);
            else done();
          };
          img.onerror = () => resolve();
          img.src = url;
        }),
    ),
  ).then(() => undefined);
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const ir = iw / ih;
  const cr = width / height;
  let dw: number;
  let dh: number;
  let dx: number;
  let dy: number;
  if (ir > cr) {
    dh = height;
    dw = height * ir;
    dx = (width - dw) / 2;
    dy = 0;
  } else {
    dw = width;
    dh = width / ir;
    dx = 0;
    dy = (height - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawContainImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  letterbox: string,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.min(width / iw, height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;
  ctx.fillStyle = letterbox;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, dx, dy, dw, dh);
}

const montageImgBaseStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectPosition: "center",
  pointerEvents: "none",
  userSelect: "none",
};

function TeaserMontageSurface({
  src,
  fit = "cover",
  layered = false,
}: {
  src: string;
  fit?: ImageFit;
  layered?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<HTMLImageElement>(null);
  const activeLayerRef = useRef<"back" | "front">("back");
  const shownSrcRef = useRef<string | null>(null);
  const layeredContain = layered && fit === "contain";
  /** 1.ª parte (familia): letterbox negro vía canvas; evita bleed de la capa img anterior en móvil */
  const canvasOnlyContain = !layeredContain && fit === "contain";

  const paintCanvas = useCallback(
    (url: string) => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      const img = teaserImageCache.get(url);
      if (!wrap || !canvas || !img) return false;

      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) return false;

      const ctx = canvas.getContext("2d");
      if (!ctx) return false;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      if (fit === "contain") drawContainImage(ctx, img, w, h, BLACK);
      else drawCoverImage(ctx, img, w, h);
      return true;
    },
    [fit],
  );

  const showLayeredContain = useCallback((url: string) => {
    const img = teaserImageCache.get(url);
    const back = backRef.current;
    const front = frontRef.current;
    if (!img || !back || !front) return false;

    const prev = shownSrcRef.current;
    if (prev && prev !== url) {
      const prevImg = teaserImageCache.get(prev);
      if (prevImg) back.src = prevImg.src;
    }

    front.src = img.src;
    back.style.opacity = "1";
    front.style.opacity = "1";
    shownSrcRef.current = url;
    return true;
  }, []);

  const showCached = useCallback((url: string) => {
    const img = teaserImageCache.get(url);
    if (!img) return false;

    const back = backRef.current;
    const front = frontRef.current;
    if (!back || !front) return false;

    const next = activeLayerRef.current === "back" ? front : back;
    const prev = activeLayerRef.current === "back" ? back : front;

    next.src = img.src;
    next.style.opacity = "1";
    next.style.zIndex = "2";
    prev.style.zIndex = "1";

    activeLayerRef.current = activeLayerRef.current === "back" ? "front" : "back";
    shownSrcRef.current = url;
    return true;
  }, []);

  const reveal = useCallback(
    (url: string) => {
      if (layeredContain) {
        if (showLayeredContain(url)) return;
        return;
      }
      if (canvasOnlyContain) {
        if (paintCanvas(url)) shownSrcRef.current = url;
        return;
      }
      if (!showCached(url) && !paintCanvas(url)) return;
      shownSrcRef.current = url;
    },
    [canvasOnlyContain, layeredContain, paintCanvas, showCached, showLayeredContain],
  );

  useEffect(() => {
    if (!src || src === shownSrcRef.current) return;

    const cached = teaserImageCache.get(src);
    if (cached) {
      reveal(src);
      return;
    }

    void preloadTeaserImages([src]).then(() => reveal(src));
  }, [src, reveal]);

  useEffect(() => {
    if (layeredContain) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onResize = () => {
      if (shownSrcRef.current) paintCanvas(shownSrcRef.current);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [layeredContain, paintCanvas]);

  useEffect(() => {
    if (src && teaserImageCache.has(src)) reveal(src);
  }, [src, reveal]);

  const backImgStyle: CSSProperties = {
    ...montageImgBaseStyle,
    objectFit: layeredContain ? "cover" : fit,
    zIndex: 1,
    opacity: 0,
  };

  const frontImgStyle: CSSProperties = {
    ...montageImgBaseStyle,
    objectFit: fit,
    zIndex: 2,
    opacity: 0,
  };

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0, background: BLACK, overflow: "hidden" }}>
      {!layeredContain && (
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", zIndex: 0 }}
        />
      )}
      {!canvasOnlyContain && (
        <>
          <img ref={backRef} alt="" decoding="sync" style={backImgStyle} />
          <img ref={frontRef} alt="" decoding="sync" style={frontImgStyle} />
        </>
      )}
    </div>
  );
}

function splitTeaserWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function visibleWordCount(
  wordCount: number,
  localMs: number,
  revealMs: number,
  pacing: "progressive" | "burst",
): number {
  if (wordCount === 0 || revealMs <= 0) return 0;
  if (pacing === "progressive") {
    return Math.min(wordCount, Math.max(0, Math.ceil((localMs / revealMs) * wordCount)));
  }
  const burstWindow = revealMs * 0.62;
  const interval = burstWindow / wordCount;
  return Math.min(wordCount, Math.max(0, Math.floor(localMs / interval) + 1));
}

const verticalGrowEase = [0.16, 1, 0.3, 1] as const;

function TeaserTextBlock({
  font,
  accentColor,
  words,
  visible,
  pacing,
  uppercase,
  fontSize,
  showCursor,
}: {
  font: string;
  accentColor: string;
  words: string[];
  visible: number;
  pacing: "progressive" | "burst";
  uppercase: boolean;
  fontSize: string;
  showCursor: boolean;
}) {
  const progress = words.length > 0 ? visible / words.length : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        maxWidth: "min(92%, 560px)",
      }}
    >
      <motion.div
        aria-hidden
        style={{
          flexShrink: 0,
          width: 2,
          marginRight: "clamp(14px, 2.5vw, 22px)",
          minHeight: "clamp(120px, 28vh, 240px)",
          transformOrigin: "top center",
          background: `linear-gradient(180deg, ${accentColor}ee 0%, ${accentColor}55 55%, transparent 100%)`,
          boxShadow: `0 0 20px ${accentColor}55`,
        }}
        animate={{ scaleY: Math.max(0.08, progress) }}
        transition={{ duration: 0.55, ease: verticalGrowEase }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {words.slice(0, visible).map((word, i) => (
          <motion.span
            key={`${i}-${word}`}
            initial={{ scaleY: 0, opacity: 0, y: -10, filter: "blur(8px)" }}
            animate={{ scaleY: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ scaleY: 0.6, opacity: 0, y: -6, filter: "blur(6px)" }}
            transition={{
              duration: 0.72,
              ease: verticalGrowEase,
              delay: pacing === "burst" ? i * 0.11 : 0,
            }}
            style={{
              display: "block",
              transformOrigin: "top center",
              fontFamily: font,
              fontSize,
              fontWeight: 600,
              letterSpacing: uppercase ? "0.09em" : "0.035em",
              lineHeight: 1.12,
              color: WHITE,
              textTransform: uppercase ? "uppercase" : "none",
              textShadow: `0 0 32px ${accentColor}44, 0 0 64px ${accentColor}18, 0 2px 20px rgba(0,0,0,0.92)`,
              marginBottom: "clamp(3px, 0.7vh, 8px)",
            }}
          >
            {word}
          </motion.span>
        ))}
        {showCursor && (
          <motion.span
            aria-hidden
            animate={{ opacity: [0.2, 1, 0.2], scaleY: [0.85, 1, 0.85] }}
            transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "block",
              width: 2,
              height: "clamp(14px, 2.5vh, 22px)",
              marginTop: 4,
              transformOrigin: "top center",
              background: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
        )}
      </div>
    </div>
  );
}

function TeaserVerticalGrowText({
  font,
  text,
  localMs,
  accentColor,
  pacing,
  uppercase = true,
  revealMs,
}: {
  font: string;
  text: string;
  localMs: number;
  accentColor: string;
  pacing: "progressive" | "burst";
  uppercase?: boolean;
  revealMs: number;
}) {
  const words = useMemo(() => splitTeaserWords(text), [text]);
  const revealComplete = localMs >= revealMs;
  const visible = revealComplete
    ? words.length
    : visibleWordCount(words.length, localMs, revealMs, pacing);
  const baseFont = "clamp(15px, 2.6vw, 34px)";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: BLACK,
        zIndex: 2,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 40px)",
      }}
    >
      <TeaserTextBlock
        font={font}
        accentColor={accentColor}
        words={words}
        visible={visible}
        pacing={pacing}
        uppercase={uppercase}
        fontSize={baseFont}
        showCursor={pacing === "progressive" && !revealComplete}
      />
    </div>
  );
}

function TeaserControls({
  playing,
  elapsedMs,
  totalMs,
  accentColor,
  isFullscreen,
  onPlay,
  onPause,
  onSeek,
  onToggleFullscreen,
}: {
  playing: boolean;
  elapsedMs: number;
  totalMs: number;
  accentColor: string;
  isFullscreen: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (ms: number) => void;
  onToggleFullscreen: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = totalMs > 0 ? Math.min(100, (elapsedMs / totalMs) * 100) : 0;

  const seekFromClientX = (clientX: number) => {
    const bar = barRef.current;
    if (!bar || totalMs <= 0) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(ratio * totalMs);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        background: "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.35), transparent)",
      }}
    >
      <button
        type="button"
        onClick={playing ? onPause : onPlay}
        aria-label={playing ? "Pausar teaser" : "Reproducir teaser"}
        style={{
          flexShrink: 0,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: `1.5px solid ${accentColor}`,
          background: "rgba(0,0,0,0.55)",
          color: accentColor,
          cursor: "pointer",
          fontSize: 14,
          lineHeight: 1,
          padding: 0,
        }}
      >
        {playing ? "❚❚" : "▶"}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          ref={barRef}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={totalMs}
          aria-valuenow={elapsedMs}
          tabIndex={0}
          onClick={(e) => seekFromClientX(e.clientX)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") onSeek(Math.min(totalMs, elapsedMs + 2000));
            if (e.key === "ArrowLeft") onSeek(Math.max(0, elapsedMs - 2000));
          }}
          style={{
            height: 6,
            borderRadius: 3,
            background: "rgba(255,255,255,0.18)",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 3,
              background: accentColor,
              transition: playing ? "none" : "width 0.1s linear",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: `${pct}%`,
              transform: "translate(-50%, -50%)",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: "0 0 6px rgba(0,0,0,0.5)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 10,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.65)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {formatTime(elapsedMs)} / {formatTime(totalMs)}
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        style={{
          flexShrink: 0,
          width: 34,
          height: 34,
          borderRadius: 6,
          border: `1.5px solid ${accentColor}`,
          background: "rgba(0,0,0,0.55)",
          color: accentColor,
          cursor: "pointer",
          fontSize: 15,
          lineHeight: 1,
          padding: 0,
        }}
      >
        {isFullscreen ? "⤡" : "⤢"}
      </button>
    </div>
  );
}

export function TeaserVideo({ font, accentColor = SALMON, onEnd, style }: TeaserVideoProps) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const frames = useMemo(() => buildTeaserFrames(), []);
  const totalMs = TOTAL_TEASER_MS;
  const frameIndex = frameIndexAt(elapsedMs, frames);
  const frame = frames[frameIndex];
  const frameLocalMs = frameLocalElapsedMs(elapsedMs, frameIndex, frames);

  const playAnchorRef = useRef({ wall: 0, elapsed: 0 });
  const music1Ref = useRef<HTMLAudioElement | null>(null);
  const music2Ref = useRef<HTMLAudioElement | null>(null);
  const middleRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioScheduledSourceNode[]>([]);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const keepAwakeVideoRef = useRef<HTMLVideoElement>(null);
  const keepAwakeStopRef = useRef<(() => void) | null>(null);

  const releaseWakeLock = useCallback(async () => {
    try {
      await wakeLockRef.current?.release();
    } catch {
      /* */
    }
    wakeLockRef.current = null;
  }, []);

  const acquireWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) return;
    try {
      if (wakeLockRef.current && !wakeLockRef.current.released) return;
      if (wakeLockRef.current?.released) wakeLockRef.current = null;
      const lock = await navigator.wakeLock.request("screen");
      wakeLockRef.current = lock;
      lock.addEventListener("release", () => {
        wakeLockRef.current = null;
        if (playingRef.current) void acquireWakeLock();
      });
    } catch {
      /* permiso denegado o API no disponible */
    }
  }, []);

  const stopKeepAwakeVideo = useCallback(() => {
    keepAwakeStopRef.current?.();
    keepAwakeStopRef.current = null;
  }, []);

  const startKeepAwakeVideo = useCallback(() => {
    stopKeepAwakeVideo();
    const video = keepAwakeVideoRef.current;
    if (!video || typeof HTMLCanvasElement === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext("2d");
    if (!ctx || !canvas.captureStream) return;

    const stream = canvas.captureStream(1);
    video.srcObject = stream;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    void video.play().catch(() => {});

    let raf = 0;
    const tick = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, 2, 2);
      raf = requestAnimationFrame(tick);
    };
    tick();

    keepAwakeStopRef.current = () => {
      cancelAnimationFrame(raf);
      video.pause();
      video.removeAttribute("src");
      video.srcObject = null;
    };
  }, [stopKeepAwakeVideo]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    let cancelled = false;
    void preloadTeaserImages(ALL_TEASER_IMAGES).then(() => {
      if (!cancelled) setImagesReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const ahead = [frames[frameIndex + 1]?.bgImg, frames[frameIndex + 2]?.bgImg].filter(
      (url): url is string => Boolean(url),
    );
    if (ahead.length > 0) void preloadTeaserImages(ahead);
  }, [frameIndex, frames]);

  useEffect(() => {
    const preset = ACTIVE_TEASER_AUDIO;
    const a1 = new Audio(preset.tracks[0]);
    a1.preload = "auto";
    music1Ref.current = a1;
    a1.load();

    let a2: HTMLAudioElement | null = null;
    if (preset.mode === "dual-with-synth" && preset.tracks[1]) {
      a2 = new Audio(preset.tracks[1]);
      a2.preload = "auto";
      a2.load();
      music2Ref.current = a2;
    } else {
      music2Ref.current = null;
    }

    let mid: HTMLAudioElement | null = null;
    if (preset.middleTrack) {
      mid = new Audio(preset.middleTrack);
      mid.preload = "auto";
      mid.load();
      middleRef.current = mid;
    } else {
      middleRef.current = null;
    }

    const onMeta = () => {
      const ready1 = a1.duration && Number.isFinite(a1.duration);
      const ready2 = !a2 || (a2.duration && Number.isFinite(a2.duration));
      const readyMid = !mid || (mid.duration && Number.isFinite(mid.duration));
      if (ready1 && ready2 && readyMid) setAudioReady(true);
    };

    a1.addEventListener("loadedmetadata", onMeta);
    a1.addEventListener("durationchange", onMeta);
    a2?.addEventListener("loadedmetadata", onMeta);
    a2?.addEventListener("durationchange", onMeta);
    mid?.addEventListener("loadedmetadata", onMeta);
    mid?.addEventListener("durationchange", onMeta);
    onMeta();

    return () => {
      a1.removeEventListener("loadedmetadata", onMeta);
      a1.removeEventListener("durationchange", onMeta);
      a2?.removeEventListener("loadedmetadata", onMeta);
      a2?.removeEventListener("durationchange", onMeta);
      mid?.removeEventListener("loadedmetadata", onMeta);
      mid?.removeEventListener("durationchange", onMeta);
      a1.pause();
      a2?.pause();
      mid?.pause();
      music1Ref.current = null;
      music2Ref.current = null;
      middleRef.current = null;
      setAudioReady(false);
    };
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void root.requestFullscreen();
    }
  }, []);

  const stopSynth = useCallback(() => {
    for (const n of nodesRef.current) {
      try {
        n.stop();
      } catch {
        /* */
      }
    }
    nodesRef.current = [];
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }, []);

  const pauseMusic = useCallback(() => {
    music1Ref.current?.pause();
    music2Ref.current?.pause();
    middleRef.current?.pause();
  }, []);

  const syncMusic = useCallback((elapsedSec: number, shouldPlay: boolean) => {
    const a1 = music1Ref.current;
    if (!a1) return;

    const teaserEnd = TOTAL_TEASER_MS / 1000;

    if (ACTIVE_TEASER_AUDIO.mode === "single-continuous") {
      music2Ref.current?.pause();
      if (music2Ref.current) music2Ref.current.volume = 0;
      middleRef.current?.pause();
      if (middleRef.current) middleRef.current.volume = 0;

      if (elapsedSec >= teaserEnd) {
        a1.pause();
        a1.volume = 0;
        return;
      }

      a1.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
      const t = Math.min(elapsedSec, Math.max(0, teaserEnd - 0.05));
      if (Math.abs(a1.currentTime - t) > 0.3) a1.currentTime = t;
      if (shouldPlay && a1.paused && !a1.ended) void a1.play().catch(() => {});
      if (!shouldPlay) a1.pause();
      return;
    }

    if (ACTIVE_TEASER_AUDIO.mode === "single") {
      music2Ref.current?.pause();
      if (music2Ref.current) music2Ref.current.volume = 0;

      const middleStart = MUSIC1_SECTION_MS / 1000;
      const middleEnd = MUSIC2_START_MS / 1000;
      const overlayTextEnd = middleStart + OVERLAY_TEXT_MS / 1000;
      const fadeSec = AUDIO_BRIDGE_FADE_MS / 1000;

      if (elapsedSec >= teaserEnd) {
        a1.pause();
        a1.volume = 0;
        middleRef.current?.pause();
        if (middleRef.current) middleRef.current.volume = 0;
        return;
      }

      if (elapsedSec < middleStart) {
        middleRef.current?.pause();
        if (middleRef.current) {
          middleRef.current.volume = 0;
          if (middleRef.current.currentTime > 0.05) middleRef.current.currentTime = 0;
        }
        a1.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
        const t = Math.min(elapsedSec, Math.max(0, middleStart - 0.05));
        if (Math.abs(a1.currentTime - t) > 0.3) a1.currentTime = t;
        if (shouldPlay && a1.paused && !a1.ended) void a1.play().catch(() => {});
        if (!shouldPlay) a1.pause();
        return;
      }

      if (elapsedSec < middleEnd) {
        const mid = middleRef.current;
        const localMiddle = elapsedSec - middleStart;

        if (mid) {
          if (elapsedSec < overlayTextEnd) {
            const into = Math.min(1, localMiddle / fadeSec);
            a1.volume = teaserEndVolume(elapsedSec, teaserEnd, Math.max(0, 1 - into * 0.88));
            a1.currentTime = middleStart;
            mid.volume = teaserEndVolume(elapsedSec, teaserEnd, Math.min(1, into * 0.95));
            if (Math.abs(mid.currentTime - localMiddle) > 0.25) mid.currentTime = Math.max(0, localMiddle);
            if (shouldPlay) {
              if (a1.paused && !a1.ended) void a1.play().catch(() => {});
              if (mid.paused && !mid.ended) void mid.play().catch(() => {});
            } else {
              a1.pause();
              mid.pause();
            }
          } else {
            a1.pause();
            a1.volume = 0;
            mid.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
            if (Math.abs(mid.currentTime - localMiddle) > 0.25) mid.currentTime = Math.max(0, localMiddle);
            if (shouldPlay && mid.paused && !mid.ended) void mid.play().catch(() => {});
            if (!shouldPlay) mid.pause();
          }
        } else if (elapsedSec < overlayTextEnd) {
          const into = Math.min(1, localMiddle / fadeSec);
          a1.volume = teaserEndVolume(elapsedSec, teaserEnd, Math.max(0, 1 - into * 0.88));
          a1.currentTime = middleStart;
          if (shouldPlay && a1.paused && !a1.ended) void a1.play().catch(() => {});
          if (!shouldPlay) a1.pause();
        } else {
          a1.pause();
          a1.volume = 0;
        }
        return;
      }

      middleRef.current?.pause();
      if (middleRef.current) middleRef.current.volume = 0;

      const t = middleStart + (elapsedSec - middleEnd);
      a1.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
      if (Math.abs(a1.currentTime - t) > 0.35) a1.currentTime = Math.max(0, t);
      if (shouldPlay && a1.paused && !a1.ended) void a1.play().catch(() => {});
      if (!shouldPlay) a1.pause();
      return;
    }

    const a2 = music2Ref.current;
    if (!a2) return;

    const music1End = MUSIC1_SECTION_MS / 1000;
    const middleEnd = MUSIC2_START_MS / 1000;
    const music2End = (TOTAL_TEASER_MS - MORVO_FINAL_MS) / 1000;

    if (elapsedSec < music1End && !a1.ended) {
      a2.pause();
      a2.volume = 0;
      if (a2.currentTime > 0.05) a2.currentTime = 0;
      a1.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
      const t1 = Math.min(elapsedSec, Math.max(0, music1End - 0.05));
      if (Math.abs(a1.currentTime - t1) > 0.3) a1.currentTime = t1;
      if (shouldPlay && a1.paused) void a1.play().catch(() => {});
      if (!shouldPlay) a1.pause();
      return;
    }

    if (elapsedSec < middleEnd) {
      a1.pause();
      a2.pause();
      a1.volume = 0;
      a2.volume = 0;
      return;
    }

    if (elapsedSec < music2End) {
      const t2 = Math.min(elapsedSec - middleEnd, MUSIC2_SECTION_MS / 1000 - 0.05);
      a1.pause();
      a1.volume = 0;
      a2.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
      if (Math.abs(a2.currentTime - t2) > 0.35) a2.currentTime = Math.max(0, t2);
      if (shouldPlay && a2.paused) void a2.play().catch(() => {});
      if (!shouldPlay) a2.pause();
      return;
    }

    a1.pause();
    a2.pause();
    a1.volume = 0;
    a2.volume = 0;
  }, []);

  const startSynth = useCallback(
    (elapsedWallSec: number) => {
      const mode = ACTIVE_TEASER_AUDIO.mode;
      if (mode === "single-continuous" || ACTIVE_TEASER_AUDIO.middleTrack) return;
      stopSynth();

      const middleDur = SYNTH_MIDDLE_MS / 1000;
      const middleStartWall = MUSIC1_SECTION_MS / 1000;
      const middleEndWall = middleStartWall + middleDur;
      if (elapsedWallSec >= middleEndWall) return;

      try {
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        void ctx.resume();
        const master = ctx.createGain();
        master.gain.value = 0.5;
        master.connect(ctx.destination);

        const delay = Math.max(0, middleStartWall - elapsedWallSec);
        const t0 = ctx.currentTime + delay;
        const effectiveFrom = Math.max(elapsedWallSec, middleStartWall);
        const remain = middleEndWall - effectiveFrom;
        if (remain <= 0) return;

        const fadeInSec = AUDIO_BRIDGE_FADE_MS / 1000;
        master.gain.setValueAtTime(0, t0);
        master.gain.linearRampToValueAtTime(0.22, t0 + fadeInSec);
        master.gain.linearRampToValueAtTime(0.5, t0 + Math.min(remain, fadeInSec + 1.2));

        const heartbeatWindow = Math.min(5, remain);
        const heartbeatStart = remain - heartbeatWindow;

        const makeOsc = (freq: number, type: OscillatorType, attack: number, peak: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, t0);
          gain.gain.setValueAtTime(0, t0);
          gain.gain.linearRampToValueAtTime(peak, t0 + attack);
          gain.gain.linearRampToValueAtTime(0, t0 + remain);
          osc.connect(gain).connect(master);
          osc.start(t0);
          osc.stop(t0 + remain);
          nodesRef.current.push(osc);
        };

        makeOsc(852, "sine", 2, 0.05);
        makeOsc(369, "sine", 1.5, 0.035);
        makeOsc(55, "sawtooth", 2, 0.025);

        let beatTime = heartbeatStart;
        let beatSpeed = 0.5;
        while (beatTime < remain) {
          const t = t0 + beatTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(40, t);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.4, t + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
          osc.connect(gain).connect(master);
          osc.start(t);
          osc.stop(t + 0.3);
          nodesRef.current.push(osc);
          beatTime += beatSpeed;
          beatSpeed = Math.max(0.18, beatSpeed * 0.88);
        }
      } catch {
        /* */
      }
    },
    [stopSynth],
  );

  const stopAll = useCallback(() => {
    pauseMusic();
    stopSynth();
  }, [pauseMusic, stopSynth]);

  const seek = useCallback(
    (ms: number) => {
      const clamped = Math.max(0, Math.min(totalMs, ms));
      setElapsedMs(clamped);
      playAnchorRef.current = { wall: performance.now(), elapsed: clamped };
      syncMusic(clamped / 1000, playing);
      if (playing) startSynth(clamped / 1000);
    },
    [totalMs, playing, syncMusic, startSynth],
  );

  const play = useCallback(() => {
    if (!audioReady) return;
    if (elapsedMs >= totalMs) {
      setElapsedMs(0);
      playAnchorRef.current = { wall: performance.now(), elapsed: 0 };
    } else {
      playAnchorRef.current = { wall: performance.now(), elapsed: elapsedMs };
    }
    setHasStarted(true);
    setPlaying(true);
    void acquireWakeLock();
    startKeepAwakeVideo();
    void ctxRef.current?.resume();
    syncMusic(playAnchorRef.current.elapsed / 1000, true);
    startSynth(playAnchorRef.current.elapsed / 1000);
  }, [audioReady, elapsedMs, totalMs, syncMusic, startSynth, acquireWakeLock, startKeepAwakeVideo]);

  useEffect(() => {
    if (!playing || !audioReady) return;
    const { wall, elapsed } = playAnchorRef.current;
    const e = elapsed + (performance.now() - wall);
    syncMusic(e / 1000, true);
    startSynth(e / 1000);
  }, [audioReady, playing, syncMusic, startSynth]);

  const pause = useCallback(() => {
    const { wall, elapsed } = playAnchorRef.current;
    const e = elapsed + (performance.now() - wall);
    setElapsedMs(e);
    playAnchorRef.current.elapsed = e;
    setPlaying(false);
    stopAll();
  }, [stopAll]);

  useEffect(() => {
    if (!playing) return;
    let raf: number;
    const tick = () => {
      const { wall, elapsed } = playAnchorRef.current;
      const e = elapsed + (performance.now() - wall);
      if (e >= totalMs) {
        setElapsedMs(totalMs);
        setPlaying(false);
        stopAll();
        onEnd?.();
        return;
      }
      setElapsedMs(e);
      syncMusic(e / 1000, true);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, totalMs, onEnd, stopAll, syncMusic]);

  useEffect(() => () => stopAll(), [stopAll]);

  /** Evita que el móvil atenúe la pantalla mientras el teaser está en play */
  useEffect(() => {
    if (!playing) {
      void releaseWakeLock();
      stopKeepAwakeVideo();
      return;
    }

    void acquireWakeLock();
    startKeepAwakeVideo();

    const interval = window.setInterval(() => {
      if (playingRef.current) void acquireWakeLock();
    }, 12000);

    const onVisibility = () => {
      if (document.visibilityState === "visible" && playingRef.current) {
        void acquireWakeLock();
        startKeepAwakeVideo();
        const { wall, elapsed } = playAnchorRef.current;
        const e = elapsed + (performance.now() - wall);
        void ctxRef.current?.resume();
        syncMusic(e / 1000, true);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      void releaseWakeLock();
      stopKeepAwakeVideo();
    };
  }, [playing, acquireWakeLock, releaseWakeLock, startKeepAwakeVideo, stopKeepAwakeVideo, syncMusic]);

  return (
    <div
      ref={rootRef}
      onClick={() => {
        if (hasStarted && playing) pause();
      }}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: isFullscreen ? undefined : "16/9",
        height: isFullscreen ? "100vh" : undefined,
        maxHeight: isFullscreen ? "100vh" : undefined,
        background: BLACK,
        overflow: "hidden",
        borderRadius: isFullscreen ? 0 : 4,
        cursor: hasStarted && playing ? "pointer" : undefined,
        ...style,
      }}
    >
      <video
        ref={keepAwakeVideoRef}
        muted
        playsInline
        loop
        aria-hidden
        tabIndex={-1}
        style={{
          position: "fixed",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      {!hasStarted && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: BLACK,
            zIndex: 5,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(16px, 5vw, 48px)",
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                margin: 0,
                maxWidth: "min(92%, 720px)",
                fontFamily: font,
                fontSize: "clamp(16px, 2.8vw, 28px)",
                fontWeight: 500,
                letterSpacing: "0.06em",
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.4)",
                textAlign: "center",
              }}
            >
              {TYPEWRITER_TEXT}
            </p>
          </div>
          <button
            type="button"
            onClick={play}
            disabled={!imagesReady || !audioReady}
            aria-label="Reproducir teaser"
            style={{
              position: "relative",
              zIndex: 2,
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: `2px solid ${accentColor}`,
              background: "rgba(0,0,0,0.45)",
              cursor: imagesReady && audioReady ? "pointer" : "wait",
              opacity: imagesReady && audioReady ? 1 : 0.55,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          </button>
          <div
            style={{
              position: "relative",
              zIndex: 2,
              fontFamily: font,
              fontSize: 13,
              letterSpacing: "0.2em",
              color: accentColor,
              opacity: 0.9,
            }}
          >
            {!imagesReady
              ? "CARGANDO IMÁGENES…"
              : !audioReady
                ? "CARGANDO AUDIO…"
                : "REPRODUCIR TEASER"}
          </div>
        </div>
      )}

      {hasStarted && frame && (
        <div style={{ position: "absolute", inset: 0, background: frame.bg ?? BLACK }}>
          {frame.typewriter && (
            <TeaserVerticalGrowText
              font={font}
              accentColor={accentColor}
              localMs={frameLocalMs}
              text={TYPEWRITER_TEXT}
              pacing="progressive"
              uppercase
              revealMs={INTRO_REVEAL_MS}
            />
          )}
          {frame.overlayText && (
            <TeaserVerticalGrowText
              font={font}
              accentColor={accentColor}
              localMs={frameLocalMs}
              text={frame.overlayText}
              pacing="burst"
              uppercase={false}
              revealMs={OVERLAY_REVEAL_MS}
            />
          )}
          {frame.bgImg && (
            <TeaserMontageSurface src={frame.bgImg} fit={frame.fit ?? "cover"} layered={frame.layered} />
          )}
          {!frame.typewriter && !frame.overlayText && <TeaserFilmGrain />}
          {frame.morvo && <FinalMorvoTitle font={font} />}
        </div>
      )}

      {hasStarted && (
        <TeaserControls
          playing={playing}
          elapsedMs={elapsedMs}
          totalMs={totalMs}
          accentColor={accentColor}
          isFullscreen={isFullscreen}
          onPlay={play}
          onPause={pause}
          onSeek={seek}
          onToggleFullscreen={toggleFullscreen}
        />
      )}
    </div>
  );
}

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

function MorvoFlickerLetter({
  letter,
  delay,
}: {
  letter: string;
  delay: number;
}) {
  return (
    <motion.span
      style={{ display: "inline-block", color: RED }}
      animate={{
        opacity: [1, 0.1, 1, 0.35, 1, 0.06, 1, 0.55, 1],
        textShadow: [
          `0 0 28px ${RED}ee, 0 0 56px ${RED}99`,
          `0 0 2px ${DARK_RED}33`,
          `0 0 36px ${RED}ff, 0 0 72px ${RED}aa`,
          `0 0 4px ${DARK_RED}44`,
          `0 0 32px ${RED}ee, 0 0 64px ${RED}88`,
          `0 0 1px ${DARK_RED}22`,
          `0 0 40px ${RED}ff, 0 0 80px ${RED}bb`,
          `0 0 6px ${DARK_RED}55`,
          `0 0 30px ${RED}ee, 0 0 60px ${RED}99`,
        ],
      }}
      transition={morvoFlickerTransition(delay)}
    >
      {letter}
    </motion.span>
  );
}

function FinalMorvoTitle({ font }: { font: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BLACK,
        zIndex: 2,
      }}
    >
      <span
        style={{
          fontFamily: font,
          fontSize: "clamp(36px, 7vw, 80px)",
          fontWeight: 700,
          letterSpacing: "0.14em",
          display: "inline-flex",
          alignItems: "baseline",
          whiteSpace: "nowrap",
        }}
      >
        {MORVO_LETTERS.map((ch, i) => (
          <MorvoFlickerLetter
            key={`${ch}-${i}`}
            letter={ch}
            delay={MORVO_FLICKER_DELAYS[i]}
          />
        ))}
      </span>
    </div>
  );
}
