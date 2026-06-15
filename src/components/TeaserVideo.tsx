import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  TEASER_FAMILIA_URLS,
  buildTeaserRestImages,
} from "../assets/stockImages";

import { ACTIVE_TEASER_AUDIO, type TeaserAudioPreset } from "../assets/teaserAudio";
import { useIsMobile } from "../hooks/useIsMobile";
import {
  TEASER_FAMILIA_BEAT_CUTS_MS,
  TEASER_FAMILIA_USE_BEAT_SYNC,
} from "../assets/teaserFamiliaBeatCuts";

const SEQUOIA_IMG = "https://images.unsplash.com/photo-1758010408745-351cc25037c5?w=1600&h=900&fit=crop&auto=format";
const MASK_HORSE_SHOP = "https://images.unsplash.com/photo-1516944486937-aca8e1c5cfce?w=800&h=450&fit=crop&auto=format";
const MASK_CREEPY = "https://images.unsplash.com/photo-1724380597255-944485791d3d?w=800&h=450&fit=crop&auto=format";
const MASK_HORNS = "https://images.unsplash.com/photo-1736507020688-414d0f88f6b5?w=800&h=450&fit=crop&auto=format";
const WOLVES_IMG = "https://images.unsplash.com/photo-1518504361720-82ccdc540022?w=800&h=450&fit=crop&auto=format";
const MORVO_FINAL_BG = "/images/teaser/morvo-final-paris-bilal.png";
const TEASER_COVER_BG = "/images/teaser/teaser-cover-paris-bilal-arches.jpg";
const TEASER_TYPEWRITER_BG = "/images/teaser/teaser-cover-mainak-bose.jpg";
const TYPEWRITER_TEXT_COLOR = "#F2EBE0";
const TYPEWRITER_ACCENT_COLOR = "#E85D4C";
const TEASER_COVER_LINE_TOP = "Compañía OBSCENA TEATRAL";
const TEASER_COVER_LINE_BOTTOM = "PRESENTA";
/** 2.ª frase empieza aquí (s) */
const SECOND_PHRASE_START_MS = 30_000;
/** Portada con crédito de producción */
const TEASER_COVER_MS = 5_000;

const EXTRA_TEASER_IMAGES = [SEQUOIA_IMG, MASK_HORSE_SHOP, MASK_CREEPY, MASK_HORNS, WOLVES_IMG];
const TEASER_REST_IMAGES = buildTeaserRestImages(EXTRA_TEASER_IMAGES);
const FAMILY_MONTAGE_ELENA_MUSHROOM =
  "/images/teaser/nuevas/elena-mozhvilo-hmcF-Lx9jig-unsplash.jpg";
const FAMILY_MONTAGE_LIANA_HAND = "/images/teaser/nuevas/liana-s-JsXDxr4eI0Y-unsplash.jpg";

const ALL_TEASER_IMAGES = [
  ...TEASER_FAMILIA_URLS,
  FAMILY_MONTAGE_ELENA_MUSHROOM,
  FAMILY_MONTAGE_LIANA_HAND,
  ...TEASER_REST_IMAGES,
  TEASER_COVER_BG,
  TEASER_TYPEWRITER_BG,
  MORVO_FINAL_BG,
];

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
/** Tras la 2.ª frase — pitido / relleno (recortado para fundido de textos portada → 1.ª frase) */
const SYNTH_FILL_MS = 1_000;
const SYNTH_MIDDLE_MS = OVERLAY_REVEAL_MS + OVERLAY_HOLD_MS + SYNTH_FILL_MS;
const OVERLAY_TEXT_MS = OVERLAY_REVEAL_MS + OVERLAY_HOLD_MS;
const AUDIO_BRIDGE_FADE_MS = 900;
/** Salta los primeros N s del archivo de audio al reproducir */
const AUDIO_START_TRIM_MS = 4_000;
/** Fade de cierre — últimos 3 s del teaser */
const AUDIO_END_FADE_MS = 3_000;
/** MORVO + créditos de reparto — cierre del teaser */
const MORVO_FINAL_MS = 5_000;

const TEASER_CAST = [
  { character: "Mario", actor: "Javier Estévez" },
  { character: "Víctor", actor: "Adrian Popovici" },
  { character: "Cristian", actor: "Ciprian Gheorghe" },
] as const;

/** Duración objetivo del teaser */
const TARGET_TOTAL_MS = 60_000;

/** Tramo 1: portada + 1.ª frase + montaje familia → 2.ª frase a los 30 s */
const FAMILY_MONTAGE_MS = SECOND_PHRASE_START_MS - TEASER_COVER_MS - INTRO_TYPEWRITER_MS;

const FIXED_BEFORE_REST_MS =
  TEASER_COVER_MS + INTRO_TYPEWRITER_MS + FAMILY_MONTAGE_MS + SYNTH_MIDDLE_MS + MORVO_FINAL_MS;
const REST_MONTAGE_MS = TARGET_TOTAL_MS - FIXED_BEFORE_REST_MS;

const TOTAL_TEASER_MS = TARGET_TOTAL_MS;

const MUSIC1_SECTION_MS = INTRO_TYPEWRITER_MS + FAMILY_MONTAGE_MS;
const MUSIC1_SECTION_WALL_MS = TEASER_COVER_MS + MUSIC1_SECTION_MS;
const MUSIC2_START_WALL_MS = MUSIC1_SECTION_WALL_MS + SYNTH_MIDDLE_MS;
const MUSIC2_SECTION_MS = REST_MONTAGE_MS;
const TEASER_COVER_SEC = TEASER_COVER_MS / 1000;

function teaserContentSec(elapsedSec: number): number {
  return Math.max(0, elapsedSec - TEASER_COVER_SEC);
}

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
  presenta?: boolean;
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

const FAMILY_MONTAGE_START_MS = TEASER_COVER_MS + INTRO_TYPEWRITER_MS;
/** Fundido portada → 1.ª frase */
const COVER_TO_TYPEWRITER_FADE_MS = 1_200;
const COVER_TO_TYPEWRITER_FADE_START_MS = TEASER_COVER_MS - COVER_TO_TYPEWRITER_FADE_MS;

function coverToTypewriterFadeT(elapsedMs: number): number {
  if (elapsedMs <= COVER_TO_TYPEWRITER_FADE_START_MS) return 0;
  if (elapsedMs >= TEASER_COVER_MS) return 1;
  return (elapsedMs - COVER_TO_TYPEWRITER_FADE_START_MS) / COVER_TO_TYPEWRITER_FADE_MS;
}

const crossfadeGpuLayerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  willChange: "opacity",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
  transform: "translateZ(0)",
};

/** Fundido textos portada → 1.ª frase (solapado, en ms de pared) */
const COVER_TITLE_FADE_START_MS = TEASER_COVER_MS - 900;
const COVER_TITLE_FADE_END_MS = TEASER_COVER_MS + 400;
const INTRO_PHRASE_FADE_IN_MS = 1_400;
const INTRO_PHRASE_DELAY_MS = 550;

function coverPresentaOpacity(elapsedMs: number): number {
  if (elapsedMs < COVER_TITLE_FADE_START_MS) return 1;
  if (elapsedMs >= COVER_TITLE_FADE_END_MS) return 0;
  return 1 - (elapsedMs - COVER_TITLE_FADE_START_MS) / (COVER_TITLE_FADE_END_MS - COVER_TITLE_FADE_START_MS);
}

function introPhraseOpacity(elapsedMs: number): number {
  if (elapsedMs < TEASER_COVER_MS) return 0;
  const end = TEASER_COVER_MS + INTRO_PHRASE_FADE_IN_MS;
  if (elapsedMs >= end) return 1;
  return (elapsedMs - TEASER_COVER_MS) / INTRO_PHRASE_FADE_IN_MS;
}

function introPhraseLocalMs(elapsedMs: number): number {
  return Math.max(0, elapsedMs - TEASER_COVER_MS - INTRO_PHRASE_DELAY_MS);
}

function familyMontageIndexAtMs(elapsedMs: number, photoCount: number): number {
  const t = elapsedMs - FAMILY_MONTAGE_START_MS;
  if (t < 0) return 0;
  const base = Math.floor(FAMILY_MONTAGE_MS / photoCount);
  const extra = FAMILY_MONTAGE_MS % photoCount;
  let acc = 0;
  for (let i = 0; i < photoCount; i++) {
    acc += base + (i < extra ? 1 : 0);
    if (t < acc) return i;
  }
  return photoCount - 1;
}

/** Segundos de pared calibrados con portada 3 s — se desplazan si TEASER_COVER_MS cambia */
const LEGACY_COVER_MS = 3_000;

function wallMsFromLegacySecond(second: number): number {
  return second * 1000 + (TEASER_COVER_MS - LEGACY_COVER_MS);
}

function familyMontageIndexAtLegacySecond(second: number, photoCount: number): number {
  return familyMontageIndexAtMs(wallMsFromLegacySecond(second), photoCount);
}

function montageIndicesInLegacySecond(second: number, photoCount: number): number[] {
  const out: number[] = [];
  const start = wallMsFromLegacySecond(second);
  const end = start + 1000;
  for (let ms = start; ms < end; ms += 50) {
    const idx = familyMontageIndexAtMs(ms, photoCount);
    if (!out.includes(idx)) out.push(idx);
  }
  return out;
}

function insertUrlAfter(pool: string[], afterIndex: number, url: string): string[] {
  const at = afterIndex + 1;
  return [...pool.slice(0, at), url, ...pool.slice(at)];
}

function insertUrlBefore(pool: string[], beforeIndex: number, url: string): string[] {
  return [...pool.slice(0, beforeIndex), url, ...pool.slice(beforeIndex)];
}

/** Inserta en s 9–12 las fotos que caían en s 25 y s 27; setas (s 12) y mano magenta (antes de s 13) */
function buildFamilyMontageUrls(): string[] {
  const urls = TEASER_FAMILIA_URLS;
  const n = urls.length;
  const earlyIdx = [9, 10, 11, 12].map((s) => familyMontageIndexAtLegacySecond(s, n));
  const ins25 = familyMontageIndexAtLegacySecond(25, n);
  const ins27 = familyMontageIndexAtLegacySecond(27, n);
  const skip = new Set([...earlyIdx, ins25, ins27]);
  const earlyBlock = [
    urls[earlyIdx[0]!],
    urls[ins25]!,
    urls[earlyIdx[1]!],
    urls[ins27]!,
    urls[earlyIdx[2]!],
    urls[earlyIdx[3]!],
  ].filter((url, i, arr) => url && arr.indexOf(url) === i);
  const tail = urls.filter((_, i) => !skip.has(i));
  let pool = [...earlyBlock, ...tail];

  const s12 = montageIndicesInLegacySecond(12, pool.length);
  const s13Photo = pool[familyMontageIndexAtLegacySecond(13, pool.length)];

  if (s12.length >= 2) {
    pool = insertUrlAfter(pool, s12[0]!, FAMILY_MONTAGE_ELENA_MUSHROOM);
  }

  if (s13Photo) {
    const s13Idx = pool.lastIndexOf(s13Photo);
    if (s13Idx >= 0) {
      pool = insertUrlBefore(pool, s13Idx, FAMILY_MONTAGE_LIANA_HAND);
    }
  }

  return pool;
}

function buildFamilyMontage(): Frame[] {
  const pool = buildFamilyMontageUrls();
  if (
    TEASER_FAMILIA_USE_BEAT_SYNC &&
    TEASER_FAMILIA_BEAT_CUTS_MS.length >= pool.length
  ) {
    return buildTimedMontage(pool, TEASER_FAMILIA_BEAT_CUTS_MS, "contain", false);
  }
  return buildUniqueMontage(pool, FAMILY_MONTAGE_MS, "contain", false);
}

function buildTeaserFrames(): Frame[] {
  return [
    { duration: TEASER_COVER_MS, bgImg: TEASER_COVER_BG, fit: "cover", presenta: true },
    { duration: INTRO_TYPEWRITER_MS, bgImg: TEASER_TYPEWRITER_BG, fit: "cover", typewriter: true },
    ...buildFamilyMontage(),
    { duration: SYNTH_MIDDLE_MS, bgImg: TEASER_TYPEWRITER_BG, fit: "cover", overlayText: SYNTH_OVERLAY_TEXT },
    ...buildUniqueMontage(TEASER_REST_IMAGES, REST_MONTAGE_MS, "contain", true),
    { duration: MORVO_FINAL_MS, bgImg: MORVO_FINAL_BG, fit: "cover", morvo: true },
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
const teaserAudioUrlReady = new Map<string, Promise<void>>();

function waitForAudioMetadata(audio: HTMLAudioElement): Promise<void> {
  const isReady = () => audio.readyState >= HTMLMediaElement.HAVE_METADATA;
  if (isReady()) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearInterval(pollId);
      clearTimeout(timeoutId);
      for (const ev of events) audio.removeEventListener(ev, finish);
      resolve();
    };

    const events = ["loadedmetadata", "loadeddata", "canplay", "durationchange", "error"] as const;
    for (const ev of events) audio.addEventListener(ev, finish);

    const pollId = window.setInterval(() => {
      if (isReady()) finish();
    }, 120);

    const timeoutId = window.setTimeout(finish, 12_000);

    audio.preload = "auto";
    audio.load();
  });
}

function preloadTeaserAudioUrl(url: string): Promise<void> {
  const cached = teaserAudioUrlReady.get(url);
  if (cached) return cached;

  const promise = new Promise<void>((resolve) => {
    const probe = new Audio();
    probe.src = url;
    void waitForAudioMetadata(probe).then(resolve);
  });

  teaserAudioUrlReady.set(url, promise);
  return promise;
}

function preloadTeaserAudioPreset(preset: TeaserAudioPreset): Promise<void> {
  const urls = [
    preset.tracks[0],
    preset.tracks[1],
    preset.middleTrack,
  ].filter((url): url is string => Boolean(url));

  return Promise.all(urls.map(preloadTeaserAudioUrl)).then(() => undefined);
}

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

const TEASER_COVER_PRIORITY_URLS = [TEASER_COVER_BG, TEASER_TYPEWRITER_BG] as const;

/** Portada visible al abrir el teaser — precarga en cuanto se importa el módulo */
export function preloadTeaserCoverImages(): Promise<void> {
  return preloadTeaserImages(TEASER_COVER_PRIORITY_URLS);
}

void preloadTeaserCoverImages();

function TeaserCoverBackdrop() {
  const coverUrl = teaserImageCache.get(TEASER_COVER_BG)?.src ?? TEASER_COVER_BG;
  const [ready, setReady] = useState(() => {
    const c = teaserImageCache.get(TEASER_COVER_BG);
    return Boolean(c && c.complete && c.naturalWidth > 0);
  });

  useLayoutEffect(() => {
    const cached = teaserImageCache.get(TEASER_COVER_BG);
    if (cached?.complete && cached.naturalWidth > 0) {
      setReady(true);
      return;
    }
    const probe = cached ?? new Image();
    const onDone = () => setReady(true);
    probe.onload = onDone;
    if (probe.decode) void probe.decode().then(onDone).catch(onDone);
    if (!cached) {
      probe.src = TEASER_COVER_BG;
      void preloadTeaserCoverImages();
    }
  }, []);

  return (
    <>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: BLACK,
          backgroundImage: `url("${coverUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <img
        src={coverUrl}
        alt=""
        decoding="sync"
        loading="eager"
        fetchPriority="high"
        onLoad={() => setReady(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          pointerEvents: "none",
          userSelect: "none",
          opacity: ready ? 1 : 0,
          transition: ready ? "opacity 0.15s ease-out" : undefined,
        }}
      />
    </>
  );
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

/** 2.ª parte: anterior a cover (canvas) + actual a contain — controlado por el padre */
function TeaserLayeredMontage({ backSrc, frontSrc }: { backSrc: string | null; frontSrc: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paintBack = useCallback(() => {
    if (!backSrc) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const img = teaserImageCache.get(backSrc);
    if (!wrap || !canvas || !img) return;

    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w < 2 || h < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    drawCoverImage(ctx, img, w, h);
  }, [backSrc]);

  useLayoutEffect(() => {
    if (!backSrc) return;
    if (teaserImageCache.has(backSrc)) {
      paintBack();
      return;
    }
    void preloadTeaserImages([backSrc]).then(paintBack);
  }, [backSrc, paintBack]);

  useEffect(() => {
    if (!backSrc) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver(() => paintBack());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [backSrc, paintBack]);

  const frontResolved = teaserImageCache.get(frontSrc)?.src ?? frontSrc;

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0, background: BLACK, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", zIndex: 0 }}
      />
      <img
        src={frontResolved}
        alt=""
        decoding="sync"
        style={{
          position: "absolute",
          left: "3.5%",
          top: "3.5%",
          width: "93%",
          height: "93%",
          objectFit: "contain",
          objectPosition: "center",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 2,
        }}
      />
    </div>
  );
}

function TeaserMontageSurface({
  src,
  fit = "cover",
}: {
  src: string;
  fit?: ImageFit;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<HTMLImageElement>(null);
  const activeLayerRef = useRef<"back" | "front">("back");
  const shownSrcRef = useRef<string | null>(null);
  const canvasOnlyContain = fit === "contain";

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
      if (canvasOnlyContain) {
        if (paintCanvas(url)) shownSrcRef.current = url;
        return;
      }
      if (!showCached(url) && !paintCanvas(url)) return;
      shownSrcRef.current = url;
    },
    [canvasOnlyContain, paintCanvas, showCached],
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
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onResize = () => {
      if (shownSrcRef.current) paintCanvas(shownSrcRef.current);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paintCanvas]);

  useEffect(() => {
    if (src && teaserImageCache.has(src)) reveal(src);
  }, [src, reveal]);

  const backImgStyle: CSSProperties = {
    ...montageImgBaseStyle,
    objectFit: fit,
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
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", zIndex: 0 }}
      />
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
  textColor = WHITE,
  words,
  visible,
  pacing,
  uppercase,
  fontSize,
  showCursor,
}: {
  font: string;
  accentColor: string;
  textColor?: string;
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
              color: textColor,
              textTransform: uppercase ? "uppercase" : "none",
              textShadow: `0 0 24px ${accentColor}55, 0 2px 16px rgba(0,0,0,0.75)`,
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
  textColor = WHITE,
  scrim = false,
  scrimOpacity = 0.38,
  pacing,
  uppercase = true,
  revealMs,
}: {
  font: string;
  text: string;
  localMs: number;
  accentColor: string;
  textColor?: string;
  scrim?: boolean;
  scrimOpacity?: number;
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
        background: scrim ? `rgba(0,0,0,${scrimOpacity})` : BLACK,
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
        textColor={textColor}
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

function TeaserFullscreenButton({
  accentColor,
  isFullscreen,
  onToggle,
  style,
}: {
  accentColor: string;
  isFullscreen: boolean;
  onToggle: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
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
        ...style,
      }}
    >
      {isFullscreen ? "⤡" : "⤢"}
    </button>
  );
}

function TeaserControls({
  playing,
  elapsedMs,
  totalMs,
  accentColor,
  isFullscreen,
  visible,
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
  visible: boolean;
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
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.22s ease",
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
      <TeaserFullscreenButton
        accentColor={accentColor}
        isFullscreen={isFullscreen}
        onToggle={onToggleFullscreen}
      />
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
  const [controlsVisible, setControlsVisible] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const controlsHideTimerRef = useRef<number | null>(null);
  const frames = useMemo(() => buildTeaserFrames(), []);
  const totalMs = TOTAL_TEASER_MS;
  const frameIndex = frameIndexAt(elapsedMs, frames);
  const frame = frames[frameIndex];
  const frameLocalMs = frameLocalElapsedMs(elapsedMs, frameIndex, frames);
  const coverPhraseFadeT = coverToTypewriterFadeT(elapsedMs);
  const layeredBackSrc =
    frame?.layered && frame.bgImg && frameIndex > 0 ? (frames[frameIndex - 1]?.bgImg ?? null) : null;

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

  const clearControlsHideTimer = useCallback(() => {
    if (controlsHideTimerRef.current !== null) {
      window.clearTimeout(controlsHideTimerRef.current);
      controlsHideTimerRef.current = null;
    }
  }, []);

  const revealControls = useCallback(() => {
    clearControlsHideTimer();
    setControlsVisible(true);
  }, [clearControlsHideTimer]);

  const scheduleHideControls = useCallback(
    (delayMs = 900) => {
      clearControlsHideTimer();
      controlsHideTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false);
        controlsHideTimerRef.current = null;
      }, delayMs);
    },
    [clearControlsHideTimer],
  );

  useEffect(() => {
    if (!hasStarted) {
      setControlsVisible(false);
      return;
    }
    if (!playing) {
      revealControls();
      return;
    }
    revealControls();
    scheduleHideControls(1200);
    return clearControlsHideTimer;
  }, [hasStarted, playing, revealControls, scheduleHideControls, clearControlsHideTimer]);

  useEffect(() => () => clearControlsHideTimer(), [clearControlsHideTimer]);

  useEffect(() => {
    let cancelled = false;
    void preloadTeaserCoverImages().then(() => {
      if (cancelled) return;
      return preloadTeaserImages(ALL_TEASER_IMAGES);
    }).then(() => {
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
    let cancelled = false;
    const preset = ACTIVE_TEASER_AUDIO;

    void preloadTeaserAudioPreset(preset).then(() => {
      if (cancelled) return;

      const a1 = new Audio(preset.tracks[0]);
      a1.preload = "auto";
      music1Ref.current = a1;

      let a2: HTMLAudioElement | null = null;
      if (preset.mode === "dual-with-synth" && preset.tracks[1]) {
        a2 = new Audio(preset.tracks[1]);
        a2.preload = "auto";
        music2Ref.current = a2;
      } else {
        music2Ref.current = null;
      }

      let mid: HTMLAudioElement | null = null;
      if (preset.middleTrack) {
        mid = new Audio(preset.middleTrack);
        mid.preload = "auto";
        middleRef.current = mid;
      } else {
        middleRef.current = null;
      }

      setAudioReady(true);
    });

    return () => {
      cancelled = true;
      music1Ref.current?.pause();
      music2Ref.current?.pause();
      middleRef.current?.pause();
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
    const audioTrim = AUDIO_START_TRIM_MS / 1000;
    const contentSec = teaserContentSec(elapsedSec);

    if (elapsedSec < TEASER_COVER_SEC) {
      a1.pause();
      a1.volume = 0;
      music2Ref.current?.pause();
      if (music2Ref.current) music2Ref.current.volume = 0;
      middleRef.current?.pause();
      if (middleRef.current) middleRef.current.volume = 0;
      if (Math.abs(a1.currentTime - audioTrim) > 0.25) a1.currentTime = audioTrim;
      return;
    }

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
      const contentEnd = teaserEnd - TEASER_COVER_SEC;
      const t = Math.min(contentSec + audioTrim, audioTrim + Math.max(0, contentEnd - 0.05));
      if (Math.abs(a1.currentTime - t) > 0.3) a1.currentTime = t;
      if (shouldPlay && a1.paused && !a1.ended) void a1.play().catch(() => {});
      if (!shouldPlay) a1.pause();
      return;
    }

    if (ACTIVE_TEASER_AUDIO.mode === "single") {
      music2Ref.current?.pause();
      if (music2Ref.current) music2Ref.current.volume = 0;

      const middleStart = MUSIC1_SECTION_WALL_MS / 1000;
      const middleEnd = MUSIC2_START_WALL_MS / 1000;
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
        const t = Math.min(contentSec + audioTrim, audioTrim + Math.max(0, MUSIC1_SECTION_MS / 1000 - 0.05));
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
            a1.currentTime = middleStart + audioTrim;
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
          a1.currentTime = middleStart + audioTrim;
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

      const t = middleStart + (elapsedSec - middleEnd) + audioTrim;
      a1.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
      if (Math.abs(a1.currentTime - t) > 0.35) a1.currentTime = Math.max(0, t);
      if (shouldPlay && a1.paused && !a1.ended) void a1.play().catch(() => {});
      if (!shouldPlay) a1.pause();
      return;
    }

    const a2 = music2Ref.current;
    if (!a2) return;

    const music1End = MUSIC1_SECTION_WALL_MS / 1000;
    const middleEnd = MUSIC2_START_WALL_MS / 1000;
    const music2End = (TOTAL_TEASER_MS - MORVO_FINAL_MS) / 1000;

    if (elapsedSec < music1End && !a1.ended) {
      a2.pause();
      a2.volume = 0;
      if (a2.currentTime > 0.05) a2.currentTime = 0;
      a1.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
      const t1 = Math.min(contentSec + audioTrim, audioTrim + Math.max(0, MUSIC1_SECTION_MS / 1000 - 0.05));
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
      const middleStartWall = MUSIC1_SECTION_WALL_MS / 1000;
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
      onMouseEnter={revealControls}
      onMouseMove={() => {
        if (!hasStarted) return;
        revealControls();
        if (playing) scheduleHideControls(1000);
      }}
      onMouseLeave={() => {
        if (!hasStarted) return;
        if (playing) scheduleHideControls(200);
        else setControlsVisible(false);
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
            backgroundColor: BLACK,
            backgroundImage: `url("${TEASER_COVER_BG}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 5,
            containerType: "size",
            overflow: "hidden",
          }}
        >
          <TeaserCoverBackdrop />
          <TeaserPresentaTitle font={font} isFullscreen={isFullscreen} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              pointerEvents: "none",
            }}
          >
            <button
              type="button"
              onClick={play}
              disabled={!imagesReady || !audioReady}
              aria-label="Reproducir teaser"
              style={{
                pointerEvents: "auto",
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
          </div>
          <TeaserFullscreenButton
            accentColor={accentColor}
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,
              zIndex: 6,
            }}
          />
        </div>
      )}

      {hasStarted && frame && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: frame.bg ?? BLACK,
            overflow: "hidden",
            containerType: "size",
          }}
        >
          {frame.presenta && coverPhraseFadeT < 1 && (
            <div style={{ ...crossfadeGpuLayerStyle, opacity: 1 - coverPhraseFadeT }}>
              <TeaserMontageSurface src={TEASER_COVER_BG} fit="cover" />
            </div>
          )}
          {frame.presenta && coverPhraseFadeT > 0 && (
            <div style={{ ...crossfadeGpuLayerStyle, opacity: coverPhraseFadeT }}>
              <TeaserMontageSurface src={TEASER_TYPEWRITER_BG} fit="cover" />
            </div>
          )}
          {frame.typewriter && (
            <TeaserMontageSurface src={TEASER_TYPEWRITER_BG} fit="cover" />
          )}
          {frame.bgImg && !frame.typewriter && !frame.presenta && frame.layered && (
            <TeaserLayeredMontage backSrc={layeredBackSrc} frontSrc={frame.bgImg} />
          )}
          {frame.bgImg && !frame.typewriter && !frame.presenta && !frame.layered && (
            <TeaserMontageSurface src={frame.bgImg} fit={frame.fit ?? "cover"} />
          )}
          {frame.typewriter && introPhraseOpacity(elapsedMs) > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                opacity: introPhraseOpacity(elapsedMs),
                pointerEvents: "none",
              }}
            >
              <TeaserVerticalGrowText
                font={font}
                accentColor={TYPEWRITER_ACCENT_COLOR}
                textColor={TYPEWRITER_TEXT_COLOR}
                scrim
                scrimOpacity={0.38 * introPhraseOpacity(elapsedMs)}
                localMs={introPhraseLocalMs(elapsedMs)}
                text={TYPEWRITER_TEXT}
                pacing="progressive"
                uppercase
                revealMs={INTRO_REVEAL_MS}
              />
            </div>
          )}
          {frame.overlayText && (
            <TeaserVerticalGrowText
              font={font}
              accentColor={TYPEWRITER_ACCENT_COLOR}
              textColor={TYPEWRITER_TEXT_COLOR}
              scrim
              localMs={frameLocalMs}
              text={frame.overlayText}
              pacing="burst"
              uppercase={false}
              revealMs={OVERLAY_REVEAL_MS}
            />
          )}
          {!frame.typewriter && !frame.overlayText && !frame.presenta && <TeaserFilmGrain />}
          {coverPresentaOpacity(elapsedMs) > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                opacity: coverPresentaOpacity(elapsedMs),
                pointerEvents: "none",
              }}
            >
              <TeaserPresentaTitle font={font} isFullscreen={isFullscreen} />
            </div>
          )}
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
          visible={controlsVisible}
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
    <MorvoFlickerText delay={delay} style={{ display: "inline-block" }}>
      {letter}
    </MorvoFlickerText>
  );
}

function MorvoFlickerText({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <motion.span
      style={{ color: RED, ...style }}
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
      {children}
    </motion.span>
  );
}

const morvoSubtitleFlickerTransition = (delay: number) => ({
  duration: 3.6,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay,
  repeatDelay: 0.35,
});

const SUBTITLE_GOLD = "#FFD36A";
const SUBTITLE_GOLD_BRIGHT = "#FFF0B0";

function MorvoSubtitleFlicker({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <motion.span
      style={{ color: RED, display: "inline-block", ...style }}
      animate={{
        opacity: [0.94, 1, 0.96, 1, 0.95, 1],
        textShadow: [
          `0 0 10px ${RED}99, 0 0 20px ${SUBTITLE_GOLD}33`,
          `0 0 16px ${RED}cc, 0 0 32px ${SUBTITLE_GOLD}aa, 0 0 56px ${SUBTITLE_GOLD_BRIGHT}66`,
          `0 0 8px ${RED}88, 0 0 18px ${SUBTITLE_GOLD}44`,
          `0 0 22px ${SUBTITLE_GOLD}ee, 0 0 44px ${SUBTITLE_GOLD}bb, 0 0 72px ${SUBTITLE_GOLD_BRIGHT}88, 0 0 6px ${RED}bb`,
          `0 0 12px ${RED}aa, 0 0 26px ${SUBTITLE_GOLD}77`,
          `0 0 18px ${RED}bb, 0 0 36px ${SUBTITLE_GOLD}99, 0 0 60px ${SUBTITLE_GOLD_BRIGHT}55`,
        ],
      }}
      transition={morvoSubtitleFlickerTransition(delay)}
    >
      {children}
    </motion.span>
  );
}

function TeaserPresentaTitle({ font, isFullscreen }: { font: string; isFullscreen: boolean }) {
  const isMobile = useIsMobile();
  const mobileFullscreen = isMobile && isFullscreen;
  const textGlow = `0 0 16px ${RED}cc, 0 0 32px ${RED}55, 0 2px 10px rgba(0,0,0,0.5)`;
  const sidePad = "clamp(10px, 4cqw, 32px)";
  const baseTop = "clamp(24px, 8cqh, 56px)";
  const baseBottom = "clamp(24px, 8cqh, 56px)";

  const top = mobileFullscreen
    ? `calc(${baseTop} + 10px)`
    : isMobile
      ? baseTop
      : `calc(${baseTop} + 20px)`;
  const bottom = isMobile ? baseBottom : `calc(${baseBottom} + 10px)`;

  const topTextStyle: CSSProperties = {
    position: "absolute",
    top,
    left: sidePad,
    right: sidePad,
    margin: 0,
    fontFamily: font,
    fontSize: "clamp(9px, min(4.2cqw, 5.5cqh), 28px)",
    fontWeight: 700,
    letterSpacing: "clamp(0.04em, 0.65cqw, 0.12em)",
    lineHeight: 1.3,
    textAlign: "center",
    textTransform: "uppercase",
    color: RED,
    textShadow: textGlow,
    maxWidth: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        containerType: "size",
        pointerEvents: "none",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.22)",
        }}
      />
      {mobileFullscreen ? (
        <p style={topTextStyle}>
          <span style={{ display: "block" }}>Compañía</span>
          <span style={{ display: "block" }}>OBSCENA TEATRAL</span>
        </p>
      ) : (
        <p style={topTextStyle}>{TEASER_COVER_LINE_TOP}</p>
      )}
      <p
        style={{
          position: "absolute",
          bottom,
          left: sidePad,
          right: sidePad,
          margin: 0,
          fontFamily: font,
          fontSize: "clamp(14px, min(7cqw, 10cqh), 44px)",
          fontWeight: 700,
          letterSpacing: "clamp(0.08em, 1.4cqw, 0.18em)",
          lineHeight: 1.1,
          textAlign: "center",
          textTransform: "uppercase",
          color: RED,
          textShadow: textGlow,
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {TEASER_COVER_LINE_BOTTOM}
      </p>
    </div>
  );
}

const CAST_GOLD = "#FFD89A";
const CAST_GOLD_BRIGHT = "#FFF4C8";

const castRowFlickerTransition = (delay: number) => ({
  duration: 3.4,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay,
  repeatDelay: 0.2,
});

const CAST_ROW_OPACITY = [0.86, 1, 0.9, 1, 0.88, 1] as const;

function CastCreditColumn({
  character,
  actor,
  font,
  delay,
  isMobile,
}: {
  character: string;
  actor: string;
  font: string;
  delay: number;
  isMobile: boolean;
}) {
  const rowTransition = castRowFlickerTransition(delay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.94, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: delay - 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "clamp(2px, 0.45cqh, 5px)",
        textAlign: "center",
        minWidth: 0,
      }}
    >
      <motion.div
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "inherit", width: "100%" }}
        animate={{ opacity: [...CAST_ROW_OPACITY] }}
        transition={rowTransition}
      >
        <motion.span
          style={{
            fontFamily: font,
            fontSize: isMobile
              ? "clamp(7px, min(3.5cqw, 5cqh), 14px)"
              : "clamp(8px, min(3.6cqw, 5.2cqh), 17px)",
            fontWeight: 600,
            letterSpacing: "0.03em",
            color: RED,
            lineHeight: 1.15,
          }}
          animate={{
            textShadow: [
              `0 0 8px ${RED}66`,
              `0 0 16px ${RED}cc, 0 0 28px ${SUBTITLE_GOLD}55`,
              `0 0 6px ${RED}55`,
              `0 0 14px ${RED}bb, 0 0 24px ${SUBTITLE_GOLD}44`,
              `0 0 8px ${RED}77`,
              `0 0 12px ${RED}aa, 0 0 20px ${SUBTITLE_GOLD}33`,
            ],
          }}
          transition={rowTransition}
        >
          {character}
        </motion.span>
        <motion.span
          aria-hidden
          style={{
            fontFamily: font,
            fontSize: "clamp(4px, min(1.2cqw, 1.8cqh), 8px)",
            lineHeight: 1,
            letterSpacing: "0.08em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
          animate={{
            color: [
              "rgba(255,215,130,0.35)",
              "rgba(255,230,160,0.85)",
              "rgba(255,215,130,0.4)",
              "rgba(255,240,190,0.9)",
              "rgba(255,215,130,0.38)",
              "rgba(255,225,150,0.75)",
            ],
          }}
          transition={rowTransition}
        >
          <span>·</span>
          <span>·</span>
          <span>·</span>
        </motion.span>
        <motion.span
          style={{
            fontFamily: font,
            fontSize: isMobile
              ? "clamp(6px, min(2.8cqw, 4cqh), 11px)"
              : "clamp(7px, min(3.2cqw, 4.6cqh), 15px)",
            fontWeight: 500,
            letterSpacing: isMobile ? "0.05em" : "0.08em",
            textTransform: "uppercase",
            lineHeight: 1.2,
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
          animate={{
            color: [
              "rgba(255,216,154,0.82)",
              CAST_GOLD_BRIGHT,
              "rgba(255,216,154,0.86)",
              CAST_GOLD,
              "rgba(255,216,154,0.8)",
              "rgba(255,244,200,0.95)",
            ],
            textShadow: [
              `0 0 6px ${CAST_GOLD}33`,
              `0 0 14px ${CAST_GOLD}aa, 0 0 26px ${SUBTITLE_GOLD}66`,
              `0 0 4px ${CAST_GOLD}22`,
              `0 0 12px ${CAST_GOLD}99, 0 0 22px ${SUBTITLE_GOLD}55`,
              `0 0 5px ${CAST_GOLD}28`,
              `0 0 10px ${CAST_GOLD}77`,
            ],
          }}
          transition={rowTransition}
        >
          {actor}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

function FinalMorvoCastCredits({ font }: { font: string }) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(3, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))",
        gap: isMobile ? "clamp(2px, 1.2cqw, 6px)" : "clamp(8px, 3.2cqw, 22px)",
        width: isMobile ? "min(92%, 260px)" : "min(78%, 460px)",
        marginLeft: isMobile ? 0 : 12,
        alignItems: "end",
        paddingBottom: isMobile ? "clamp(2px, 0.8cqh, 6px)" : 0,
      }}
    >
      {TEASER_CAST.map(({ character, actor }, i) => (
        <CastCreditColumn
          key={character}
          character={character}
          actor={actor}
          font={font}
          delay={0.55 + i * 0.48}
          isMobile={isMobile}
        />
      ))}
    </motion.div>
  );
}

function FinalMorvoTitle({ font }: { font: string }) {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        containerType: "size",
        padding: "0 clamp(10px, 4cqw, 28px)",
        boxSizing: "border-box",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.18)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: isMobile ? "clamp(4px, 1cqh, 8px)" : "clamp(8px, 1.8cqh, 16px)",
            maxWidth: "100%",
            transform: isMobile
              ? "translateY(clamp(-28px, -10cqh, -56px))"
              : "translateY(clamp(-8px, -2.5cqh, -18px))",
          }}
        >
          <span
            style={{
              fontFamily: font,
              fontSize: isMobile
                ? "clamp(14px, min(13cqw, 18cqh), 56px)"
                : "clamp(16px, min(15cqw, 22cqh), 80px)",
              fontWeight: 700,
              letterSpacing: "clamp(0.04em, 1.2cqw, 0.12em)",
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
              />
            ))}
          </span>
          <MorvoSubtitleFlicker
            delay={0.8}
            style={{
              fontFamily: font,
              fontSize: isMobile
                ? "clamp(6px, min(2.2cqw, 3.2cqh), 11px)"
                : "clamp(7px, min(2.6cqw, 4cqh), 15px)",
              fontWeight: 500,
              letterSpacing: isMobile ? "0.05em" : "0.06em",
              textAlign: isMobile ? "center" : "right",
              textTransform: "uppercase",
              alignSelf: isMobile ? "center" : "flex-end",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              lineHeight: 1.2,
              paddingRight: isMobile ? 0 : "0.04em",
            }}
          >
            de Naz Montés
          </MorvoSubtitleFlicker>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "clamp(10px, 4cqw, 28px)",
          right: "clamp(10px, 4cqw, 28px)",
          bottom: isMobile ? "clamp(2%, 4cqh, 6%)" : "clamp(10%, 13cqh, 17%)",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FinalMorvoCastCredits font={font} />
      </div>
    </div>
  );
}
