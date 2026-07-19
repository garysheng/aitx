import type { CSSProperties } from "react";
import { FLYER_COLORS as C, FLYER_FONTS as F, FLYER_MARK } from "@/lib/flyer/brand";
import type { FlyerValues } from "@/lib/flyer/schema";

function Detail({ label, value, s }: { label: string; value: string; s: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 * s }}>
      <span style={{ fontSize: 11 * s, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.55 }}>{label}</span>
      <span style={{ fontSize: 20 * s, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default function FlyerLayout({ width, height, values }: { width: number; height: number; values: FlyerValues }) {
  const { eventTitle, subhead, dateLine, venueLine, registerLine, sponsors } = values;
  const wide = width / height > 1.4;
  const s = width / 1080;
  const pad = Math.round(width * (wide ? 0.05 : 0.075));
  const titleSize = Math.round(width * (wide ? 0.08 : 0.135));

  const root: CSSProperties = {
    width, height, position: "relative", overflow: "hidden",
    background: C.paper, color: C.ink, fontFamily: F.body,
    padding: pad, display: "flex", flexDirection: "column", justifyContent: "space-between",
    boxSizing: "border-box",
  };

  return (
    <div style={root}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(130% 90% at 100% 0%, ${C.orange}22, transparent 55%)` }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FLYER_MARK} alt="AITX" style={{ height: Math.round(width * 0.06), width: "auto" }} />
      </div>
      <div style={{ position: "relative", maxWidth: wide ? "62%" : "100%" }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 0.9, fontSize: titleSize, color: C.orange }}>
          {eventTitle}
        </div>
        {subhead ? <div style={{ marginTop: 18 * s, fontSize: Math.round(width * 0.03), color: C.muted, maxWidth: "24ch", lineHeight: 1.35 }}>{subhead}</div> : null}
      </div>
      <div style={{ position: "relative", background: C.ink, color: C.white, borderRadius: 16 * s, padding: `${Math.round(pad * 0.55)}px ${Math.round(pad * 0.6)}px`, display: "flex", flexDirection: wide ? "row" : "column", gap: 18 * s, alignItems: wide ? "center" : "stretch", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 34 * s, flexWrap: "wrap" }}>
          <Detail label="When" value={dateLine} s={s} />
          <Detail label="Where" value={venueLine} s={s} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: wide ? "flex-end" : "flex-start" }}>
          <span style={{ background: C.orange, color: C.white, fontWeight: 700, padding: `${12 * s}px ${22 * s}px`, borderRadius: 999, fontSize: Math.round(width * 0.024), whiteSpace: "nowrap" }}>{registerLine}</span>
        </div>
      </div>
      {sponsors.length > 0 ? (
        <div style={{ position: "relative", display: "flex", gap: 12 * s, alignItems: "center", color: C.muted, fontSize: Math.round(width * 0.017), textTransform: "uppercase", letterSpacing: "0.16em" }}>
          <span style={{ opacity: 0.6 }}>Backed by</span>
          <span style={{ fontWeight: 600, color: C.ink }}>{sponsors.join("   ·   ")}</span>
        </div>
      ) : null}
    </div>
  );
}
