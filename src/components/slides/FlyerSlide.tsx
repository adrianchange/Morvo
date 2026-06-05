import type { PaletteTheme } from "../../theme/palettes";
import { isHelechoStyle, isRaizPremium, slideText } from "../../theme/palettes";
import { CoverTitle } from "../CoverTitle";
import { fontDisplay } from "./slideStyles";
import { MediaFrame, SlideShell } from "./shared";

type Props = { theme: PaletteTheme };

const FLYER_IMG = "https://images.unsplash.com/photo-1518504361720-82ccdc540022?w=1600&h=900&fit=crop&auto=format";

function EsmeraldaFlyer({ theme }: Props) {
  const bg = theme.bg;
  const text = slideText(theme);
  const helechoStyle = isHelechoStyle(theme);

  return (
    <SlideShell theme={theme} index="02">
      {/* Background photo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${FLYER_IMG})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 50%",
        }}
      />
      {/* Radial vignette: photo visible in center, fades to bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 65% at 50% 55%, transparent 0%, ${bg}66 45%, ${bg}cc 65%, ${bg} 85%)`,
        }}
      />
      {/* Top gradient for title readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: `linear-gradient(to bottom, ${bg}ee 0%, ${bg}aa 40%, transparent 100%)`,
        }}
      />
      {/* Bottom gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "25%",
          background: `linear-gradient(to top, ${bg}ee 0%, transparent 100%)`,
        }}
      />
      {/* Title MORVO */}
      <div
        style={{
          position: "absolute",
          top: "clamp(40px, 7vh, 72px)",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize:
              helechoStyle
                ? "clamp(56px, 9vw, 120px)"
                : "clamp(48px, 7vw, 96px)",
            color: text,
            opacity: 0.9,
            ...(helechoStyle
              ? { lineHeight: 1 }
              : {
                  fontFamily: fontDisplay(theme),
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }),
          }}
        >
          {helechoStyle ? (
            <CoverTitle palette={theme.id} />
          ) : (
            "MORVO"
          )}
        </h2>
        <div
          style={{
            marginTop: "clamp(6px, 1vh, 12px)",
            width: "clamp(60px, 8vw, 120px)",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${text}66, transparent)`,
            margin: "clamp(6px, 1vh, 12px) auto 0",
          }}
        />
      </div>
    </SlideShell>
  );
}

export function FlyerSlide({ theme }: Props) {
  if (isRaizPremium(theme)) {
    return <EsmeraldaFlyer theme={theme} />;
  }

  return (
    <SlideShell theme={theme} index="02">
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(40px, 6vh, 64px) clamp(56px, 8vw, 100px)",
          boxSizing: "border-box",
        }}
      >
        <MediaFrame
          theme={theme}
          label="[Foto del flyer — los tres personajes]"
          style={{
            width: "min(88%, 920px)",
            height: "min(78%, 520px)",
            maxHeight: "100%",
          }}
        />
      </div>
    </SlideShell>
  );
}
