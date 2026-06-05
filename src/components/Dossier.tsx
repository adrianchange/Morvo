import { useCallback, useEffect, useRef, useState } from "react";
import type { PaletteId } from "../theme/palettes";
import { PALETTES, slideBackground, slideText } from "../theme/palettes";
import { fontBody } from "../theme/typography";
import { useIsMobile } from "../hooks/useIsMobile";
import { SlideNav } from "./SlideNav";
import { CoverSlide } from "./slides/CoverSlide";
import { CharacterSlide } from "./slides/CharacterSlide";
import { FlyerSlide } from "./slides/FlyerSlide";
import { SynopsisSlide } from "./slides/SynopsisSlide";
import { TeaserSlide } from "./slides/TeaserSlide";

type Props = {
  paletteId: PaletteId;
  onBack: () => void;
};

const SLIDE_COUNT = 8;

export function Dossier({ paletteId, onBack }: Props) {
  const [index, setIndex] = useState(0);
  const theme = PALETTES[paletteId];
  const mobile = useIsMobile();
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDE_COUNT);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onBack]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchRef.current.x;
      const dy = t.clientY - touchRef.current.y;
      touchRef.current = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next();
        else prev();
      }
    },
    [next, prev]
  );

  const slides = [
    <CoverSlide key="cover" theme={theme} />,
    <FlyerSlide key="photo" theme={theme} />,
    <SynopsisSlide key="synopsis" theme={theme} />,
    <CharacterSlide
      key="char1"
      theme={theme}
      data={{
        index: "04",
        characterName: "Mario",
        actorName: "Javier Estevez Permuy",
        photoLabel: "[Foto del personaje]",
        photoUrl: "https://images.unsplash.com/photo-1516944486937-aca8e1c5cfce?w=1200&h=800&fit=crop&auto=format",
      }}
    />,
    <CharacterSlide
      key="char2"
      theme={theme}
      data={{
        index: "05",
        characterName: "Cristian",
        actorName: "Ciprian Gheorghe",
        photoLabel: "[Foto del personaje]",
        photoUrl: "https://images.unsplash.com/photo-1771980590254-cbe347e4003e?w=1200&h=800&fit=crop&auto=format",
      }}
    />,
    <CharacterSlide
      key="char3"
      theme={theme}
      data={{
        index: "06",
        characterName: "Víctor",
        actorName: "Adrian Popovici",
        photoLabel: "[Foto del personaje]",
        photoUrl: "https://images.unsplash.com/photo-1724380597255-944485791d3d?w=1200&h=800&fit=crop&auto=format",
      }}
    />,
    <CharacterSlide
      key="director"
      theme={theme}
      data={{
        index: "07",
        characterName: "Nazareth Montés",
        actorName: "",
        roleLabel: "Escritora y Directora",
        photoLabel: "[Foto de la directora]",
        photoUrl: "https://images.unsplash.com/photo-1736507020688-414d0f88f6b5?w=1200&h=800&fit=crop&auto=format",
      }}
    />,
    <TeaserSlide key="teaser" theme={theme} />,
  ];

  const text = slideText(theme);
  const bg = slideBackground(theme);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: bg,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {slides[index]}
      </div>

      <SlideNav theme={theme} onPrev={prev} onNext={next} />

      <div
        style={{
          position: "absolute",
          bottom: mobile ? 12 : 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: mobile ? 6 : 8,
          zIndex: 50,
        }}
      >
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir a slide ${i + 1}`}
            style={{
              width: i === index ? (mobile ? 20 : 24) : (mobile ? 7 : 8),
              height: mobile ? 7 : 8,
              borderRadius: 4,
              border: "none",
              padding: 0,
              background:
                i === index
                  ? theme.bg
                    ? text
                    : theme.accent
                  : theme.bg
                    ? `${text}44`
                    : "rgba(237,232,213,0.25)",
              cursor: "pointer",
              transition: "width 0.2s",
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        style={{
          position: "absolute",
          top: mobile ? 8 : 12,
          right: mobile ? 8 : 12,
          zIndex: 50,
          fontFamily: fontBody(theme),
          fontSize: mobile ? 10 : 12,
          letterSpacing: "0.15em",
          color: text,
          opacity: theme.bg ? 0.65 : 0.4,
          background: "transparent",
          border: "none",
          textDecoration: "underline",
          cursor: "pointer",
          padding: mobile ? "6px 8px" : undefined,
        }}
      >
        {mobile ? "← paletas" : `cambiar paleta · ${theme.label}`}
      </button>
    </div>
  );
}
