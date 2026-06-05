import type { PaletteTheme } from "../../theme/palettes";
import { isRaizPremium, slideText } from "../../theme/palettes";
import { fontBody, fontDisplay } from "./slideStyles";
import { SlideShell } from "./shared";
import { useIsMobile } from "../../hooks/useIsMobile";

const SYNOPSIS_LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const FOREST_IMG = "https://picsum.photos/id/15/1600/900";

type Props = { theme: PaletteTheme };

function SynopsisContent({ theme, text, mobile }: { theme: PaletteTheme; text: string; mobile: boolean }) {
  return (
    <>
      <h2
        style={{
          position: mobile ? "relative" : "absolute",
          top: 0,
          left: 0,
          right: 0,
          margin: 0,
          paddingTop: mobile ? 48 : "clamp(48px, 8vh, 72px)",
          paddingBottom: mobile ? 8 : 0,
          textAlign: "center",
          fontFamily: fontDisplay(theme),
          fontWeight: 700,
          fontSize: mobile ? 22 : "clamp(26px, 3.5vw, 44px)",
          color: text,
          letterSpacing: "0.14em",
          zIndex: 5,
        }}
      >
        Sinopsis
      </h2>
      <div
        style={{
          position: mobile ? "relative" : "absolute",
          inset: mobile ? undefined : 0,
          flex: mobile ? 1 : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: mobile
            ? "16px 24px 40px"
            : "clamp(100px, 14vh, 120px) clamp(56px, 10vw, 120px) clamp(48px, 8vh, 72px)",
          boxSizing: "border-box",
          overflow: mobile ? "auto" : undefined,
          zIndex: 5,
        }}
      >
        <p
          style={{
            margin: 0,
            maxWidth: mobile ? "100%" : "min(720px, 78%)",
            fontFamily: fontBody(theme),
            fontSize: mobile ? 15 : "clamp(15px, 1.55vw, 22px)",
            lineHeight: 1.65,
            color: text,
            opacity: 0.82,
            textAlign: "center",
            whiteSpace: "pre-line",
          }}
        >
          {SYNOPSIS_LOREM}
        </p>
      </div>
    </>
  );
}

export function SynopsisSlide({ theme }: Props) {
  const text = slideText(theme);
  const mobile = useIsMobile();
  if (isRaizPremium(theme)) {
    const bg = theme.bg;
    return (
      <SlideShell theme={theme} index="03">
        {/* Forest background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${FOREST_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Overlay: green tint for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `${bg}cc`,
          }}
        />
        <SynopsisContent theme={theme} text={text} mobile={mobile} />
      </SlideShell>
    );
  }

  return (
    <SlideShell theme={theme} index="03">
      <SynopsisContent theme={theme} text={text} mobile={mobile} />
    </SlideShell>
  );
}
