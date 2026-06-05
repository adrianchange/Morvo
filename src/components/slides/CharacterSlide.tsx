import type { PaletteTheme } from "../../theme/palettes";
import { slideText } from "../../theme/palettes";
import { fontBody, fontDisplay } from "./slideStyles";
import { SlideShell } from "./shared";
import { useIsMobile } from "../../hooks/useIsMobile";

const CHAR_DESC = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Donec sed odio dui. Cras mattis consectetur purus sit amet fermentum.`;

const PICSUM_IDS = [1025, 1074, 1005];
let picIdx = 0;
function nextPicsumUrl() {
  const id = PICSUM_IDS[picIdx % PICSUM_IDS.length];
  picIdx++;
  return `https://picsum.photos/id/${id}/1200/800`;
}

export type CharacterSlideData = {
  index: string;
  characterName: string;
  actorName: string;
  photoLabel: string;
  photoUrl?: string;
  roleLabel?: string;
};

type Props = {
  theme: PaletteTheme;
  data: CharacterSlideData;
};

export function CharacterSlide({ theme, data }: Props) {
  const mobile = useIsMobile();
  const text = slideText(theme);
  const bgUrl = data.photoUrl ?? nextPicsumUrl();
  const bg = theme.bg;

  if (mobile) {
    return (
      <SlideShell theme={theme} index={data.index}>
        {/* Bottom half: photo */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "55%",
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient blending photo into solid bg */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "55%",
            background: `linear-gradient(to bottom, ${bg} 0%, ${bg}99 25%, transparent 70%)`,
          }}
        />
        {/* Text on the top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 24px 20px",
            boxSizing: "border-box",
            maxHeight: "50%",
            overflow: "hidden",
            gap: 10,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: fontDisplay(theme),
              fontWeight: 700,
              fontSize: 22,
              color: text,
              letterSpacing: "0.1em",
              lineHeight: 1.2,
            }}
          >
            {data.characterName}
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: fontBody(theme),
              fontStyle: "italic",
              fontSize: 14,
              color: text,
              opacity: 0.7,
              letterSpacing: "0.06em",
            }}
          >
            {data.roleLabel ?? "interpretado por"} {data.actorName}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: fontBody(theme),
              fontSize: 13,
              lineHeight: 1.5,
              color: text,
              opacity: 0.78,
              whiteSpace: "pre-line",
            }}
          >
            {CHAR_DESC}
          </p>
        </div>
      </SlideShell>
    );
  }

  return (
    <SlideShell theme={theme} index={data.index}>
      {/* Right half: photo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "55%",
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Gradient blending photo into the solid bg color */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "55%",
          background: `linear-gradient(to right, ${bg} 0%, ${bg}99 25%, transparent 70%)`,
        }}
      />
      {/* Text on the left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(48px, 8vh, 72px) clamp(48px, 8vw, 96px) clamp(40px, 6vh, 56px)",
          boxSizing: "border-box",
          maxWidth: "50%",
          gap: "clamp(12px, 2vh, 20px)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: fontDisplay(theme),
            fontWeight: 700,
            fontSize: "clamp(22px, 2.8vw, 36px)",
            color: text,
            letterSpacing: "0.1em",
            lineHeight: 1.2,
          }}
        >
          {data.characterName}
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: fontBody(theme),
            fontStyle: "italic",
            fontSize: "clamp(14px, 1.35vw, 20px)",
            color: text,
            opacity: 0.7,
            letterSpacing: "0.06em",
          }}
        >
          {data.roleLabel ?? "interpretado por"} {data.actorName}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: fontBody(theme),
            fontSize: "clamp(14px, 1.3vw, 19px)",
            lineHeight: 1.6,
            color: text,
            opacity: 0.78,
            whiteSpace: "pre-line",
          }}
        >
          {CHAR_DESC}
        </p>
      </div>
    </SlideShell>
  );
}
