import type { CSSProperties } from "react";
import { CITIES, EVENT_KINDS, type FlyerValues } from "@/lib/events/flyer";

// The AITX Luma golden, in code: a 1080x1080 rounded card with a mauve gradient
// sky, faint AI-doodle texture, a wide techy stacked title, the city name, a
// sponsor row, and the city's skyline silhouette. Deterministic and reproducible.
export default function FlyerCanvas({ size, values }: { size: number; values: FlyerValues }) {
  const kind = EVENT_KINDS.find((k) => k.id === values.kindId) ?? EVENT_KINDS[0];
  const city = CITIES.find((c) => c.id === values.cityId) ?? CITIES[0];
  const s = size / 1080;

  const root: CSSProperties = {
    width: size, height: size, position: "relative", overflow: "hidden",
    borderRadius: 40 * s, boxSizing: "border-box",
    background: "linear-gradient(180deg, #6f6f9c 0%, #9a7f9e 55%, #c08f8f 100%)",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
  };

  return (
    <div style={root}>
      {/* faint AI-doodle texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(/assets/flyer/doodles.png)", backgroundSize: `${520 * s}px`,
        opacity: 0.12, mixBlendMode: "overlay",
      }} />

      {/* title block */}
      <div style={{ position: "absolute", top: 70 * s, left: 0, right: 0, textAlign: "center", padding: `0 ${60 * s}px` }}>
        {kind.title.map((line, i) => (
          <div key={i} style={{
            color: "#ffffff", fontWeight: 800, lineHeight: 1.02,
            fontSize: (line === "AITX" || kind.title.length <= 2 ? 92 : 88) * s,
            letterSpacing: `${10 * s}px`, textTransform: "uppercase",
            textShadow: `0 ${2 * s}px ${10 * s}px rgba(40,30,60,.25)`,
          }}>{line}</div>
        ))}

        {city.id !== "none" && kind.id === "meetup" && (
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 44 * s, letterSpacing: `${8 * s}px`, marginTop: 10 * s }}>
            {city.label.toUpperCase()}
          </div>
        )}
        {values.subtitle && (
          <div style={{ color: "#fbeff0", fontSize: 30 * s, marginTop: 16 * s, opacity: 0.95 }}>{values.subtitle}</div>
        )}
      </div>

      {/* sponsor row */}
      {values.sponsors.length > 0 && (
        <div style={{ position: "absolute", top: 470 * s, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ color: "#f3e7ea", fontSize: 24 * s, letterSpacing: `${2 * s}px`, marginBottom: 22 * s, opacity: 0.9 }}>
            in partnership with
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 44 * s, flexWrap: "wrap", padding: `0 ${60 * s}px` }}>
            {values.sponsors.slice(0, 4).map((sp, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={sp.src} alt={sp.label} style={{ height: 52 * s, width: "auto", filter: "brightness(0) invert(1)" }} />
            ))}
          </div>
        </div>
      )}

      {/* city skyline */}
      {city.skyline && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={city.skyline} alt={`${city.label} skyline`} style={{
          position: "absolute", bottom: 0, left: 0, width: "100%", height: "auto",
        }} />
      )}
    </div>
  );
}
