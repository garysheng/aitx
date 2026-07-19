"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import FlyerLayout from "./FlyerLayout";
import { DEFAULT_FLYER, FLYER_SIZES, flyerFilename, type FlyerSizeKey, type FlyerValues } from "@/lib/flyer/schema";

const PREVIEW_W = 460;

export default function FlyerStudio() {
  const [values, setValues] = useState<FlyerValues>(DEFAULT_FLYER);
  const [sizeKey, setSizeKey] = useState<FlyerSizeKey>("square");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const size = FLYER_SIZES[sizeKey];
  const scale = PREVIEW_W / size.w;

  function set<K extends keyof FlyerValues>(key: K, v: FlyerValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function download() {
    if (!captureRef.current) return;
    setBusy(true);
    setErr(null);
    try {
      const dataUrl = await toPng(captureRef.current, { pixelRatio: 2, width: size.w, height: size.h, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = flyerFilename(values, sizeKey);
      a.click();
    } catch {
      setErr("Could not render the PNG. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm";
  const label = "text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
      {/* form */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {(["meetup", "hackathon"] as const).map((k) => (
            <button key={k} type="button" onClick={() => set("kind", k)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${values.kind === k ? "bg-[color:var(--orange)] text-white" : "border border-black/15"}`}>
              {k === "meetup" ? "Meetup" : "Hackathon"}
            </button>
          ))}
        </div>
        <div><div className={label}>Event title</div><input className={input} value={values.eventTitle} onChange={(e) => set("eventTitle", e.target.value)} /></div>
        <div><div className={label}>Subhead</div><input className={input} value={values.subhead} onChange={(e) => set("subhead", e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><div className={label}>When</div><input className={input} value={values.dateLine} onChange={(e) => set("dateLine", e.target.value)} /></div>
          <div><div className={label}>Where</div><input className={input} value={values.venueLine} onChange={(e) => set("venueLine", e.target.value)} /></div>
        </div>
        <div><div className={label}>Register line</div><input className={input} value={values.registerLine} onChange={(e) => set("registerLine", e.target.value)} /></div>
        <div><div className={label}>Sponsors (comma-separated)</div>
          <input className={input} value={values.sponsors.join(", ")} onChange={(e) => set("sponsors", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} /></div>
        <div className="flex items-center gap-3 pt-1">
          <select className={input + " max-w-[180px]"} value={sizeKey} onChange={(e) => setSizeKey(e.target.value as FlyerSizeKey)}>
            {Object.entries(FLYER_SIZES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button type="button" onClick={download} disabled={busy}
            className="rounded-md bg-[color:var(--orange)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--orange-deep)] disabled:opacity-60">
            {busy ? "Rendering..." : "Download PNG"}
          </button>
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>

      {/* live preview (CSS-scaled; the captured node is true size) */}
      <div className="lg:justify-self-end">
        <div style={{ width: PREVIEW_W, height: size.h * scale, overflow: "hidden", borderRadius: 10, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: size.w, height: size.h }}>
            <div ref={captureRef}>
              <FlyerLayout width={size.w} height={size.h} values={values} />
            </div>
          </div>
        </div>
        <p className="mt-3 max-w-[460px] text-xs text-[color:var(--muted)]">Rendered from code and your inputs. Same inputs give the same flyer, every time.</p>
      </div>
    </div>
  );
}
