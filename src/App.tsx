import type { ReactNode } from "react";
import { useState } from "react";
import type { PaletteId } from "./theme/palettes";
import { Dossier } from "./components/Dossier";
import { VColorPicker } from "./components/VColorPicker";
import { useIsMobile } from "./hooks/useIsMobile";

function Stage({ children }: { children: ReactNode }) {
  const mobile = useIsMobile();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050504",
      }}
    >
      <div
        style={{
          position: "relative",
          ...(mobile
            ? { width: "100vw", height: "100vh" }
            : {
                width: "min(100vw, 177.78vh)",
                height: "min(56.25vw, 100vh)",
                aspectRatio: "16 / 9",
              }),
          overflow: "hidden",
          boxShadow: mobile ? "none" : "0 0 80px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [palette, setPalette] = useState<PaletteId | null>(null);

  return (
    <Stage>
      {palette === null ? (
        <VColorPicker onSelect={setPalette} />
      ) : (
        <Dossier paletteId={palette} onBack={() => setPalette(null)} />
      )}
    </Stage>
  );
}
