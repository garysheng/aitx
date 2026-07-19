import React from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { COLORS, FONTS, MARK } from "./brand";
import type { FlyerProps } from "./props";

// One composition, responsive across formats (square 1080x1080, wide 1200x630),
// driven by useVideoConfig — no per-size duplication. Brand rules come from
// ./brand; only the event data comes in as props.

const Detail: React.FC<{ label: string; value: string; scale: number }> = ({ label, value, scale }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <span style={{ fontSize: 11 * scale, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.55 }}>{label}</span>
    <span style={{ fontSize: 20 * scale, fontWeight: 600 }}>{value}</span>
  </div>
);

export const EventFlyer: React.FC<FlyerProps> = ({
  eventTitle, subhead, dateLine, venueLine, registerLine, sponsors,
}) => {
  const { width, height } = useVideoConfig();
  const wide = width / height > 1.4;
  const s = width / 1080; // scale factor keyed to the square baseline
  const pad = Math.round(width * (wide ? 0.05 : 0.075));
  const titleSize = Math.round(width * (wide ? 0.08 : 0.135));

  return (
    <AbsoluteFill
      style={{
        background: COLORS.paper,
        color: COLORS.ink,
        fontFamily: FONTS.body,
        padding: pad,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* warm orange corner glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(130% 90% at 100% 0%, ${COLORS.orange}22, transparent 55%)` }} />

      {/* header: the mark */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Img src={staticFile(MARK)} style={{ height: Math.round(width * 0.058), width: "auto" }} />
      </div>

      {/* headline block */}
      <div style={{ position: "relative", maxWidth: wide ? "62%" : "100%" }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 0.9,
            fontSize: titleSize,
            color: COLORS.orange,
            textWrap: "balance" as React.CSSProperties["textWrap"],
          }}
        >
          {eventTitle}
        </div>
        {subhead ? (
          <div style={{ marginTop: 18 * s, fontSize: Math.round(width * 0.03), color: COLORS.muted, maxWidth: "24ch", lineHeight: 1.35 }}>
            {subhead}
          </div>
        ) : null}
      </div>

      {/* details band */}
      <div
        style={{
          position: "relative",
          background: COLORS.ink,
          color: COLORS.white,
          borderRadius: 16 * s,
          padding: `${Math.round(pad * 0.55)}px ${Math.round(pad * 0.6)}px`,
          display: "flex",
          flexDirection: wide ? "row" : "column",
          gap: 18 * s,
          alignItems: wide ? "center" : "stretch",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 34 * s, flexWrap: "wrap" }}>
          <Detail label="When" value={dateLine} scale={s} />
          <Detail label="Where" value={venueLine} scale={s} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: wide ? "flex-end" : "flex-start" }}>
          <span
            style={{
              background: COLORS.orange,
              color: COLORS.white,
              fontWeight: 700,
              padding: `${12 * s}px ${22 * s}px`,
              borderRadius: 999,
              fontSize: Math.round(width * 0.024),
              whiteSpace: "nowrap",
            }}
          >
            {registerLine}
          </span>
        </div>
      </div>

      {/* sponsor strip */}
      {sponsors.length > 0 ? (
        <div style={{ position: "relative", display: "flex", gap: 12 * s, alignItems: "center", color: COLORS.muted, fontSize: Math.round(width * 0.017), textTransform: "uppercase", letterSpacing: "0.16em" }}>
          <span style={{ opacity: 0.6 }}>Backed by</span>
          <span style={{ fontWeight: 600, color: COLORS.ink }}>{sponsors.join("   ·   ")}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
