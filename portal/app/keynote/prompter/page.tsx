"use client";

import { useEffect, useRef, useState } from "react";

type State = { index: number; total: number; line: string; next: string; seconds: number; at: number; playing: boolean; speaker?: "gary" | "chip"; garyCue?: string };

export default function Prompter() {
  const [s, setS] = useState<State | null>(null);
  const [pct, setPct] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    try { const raw = localStorage.getItem("aitx-keynote-state"); if (raw) setS(JSON.parse(raw)); } catch {}
    let ch: BroadcastChannel | null = null;
    try { ch = new BroadcastChannel("aitx-keynote"); ch.onmessage = (e) => setS(e.data as State); } catch {}
    const onStorage = (e: StorageEvent) => {
      if (e.key === "aitx-keynote-state" && e.newValue) setS(JSON.parse(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => { ch?.close(); window.removeEventListener("storage", onStorage); };
  }, []);

  useEffect(() => {
    const tick = () => {
      if (s && s.playing && s.seconds) setPct(Math.min(1, (Date.now() - s.at) / 1000 / s.seconds));
      else if (s && !s.playing) { /* freeze */ }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [s]);

  return (
    <main className="flex min-h-screen flex-col bg-neutral-950 px-8 py-8 text-neutral-100">
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span className="font-semibold tracking-widest" style={{ color: "#ff4201" }}>AITX · TELEPROMPTER</span>
        <span className="font-mono tabular-nums">{s ? `${s.index + 1} / ${s.total}` : "— / —"}</span>
      </div>

      {/* progress within the current slide */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-[width] duration-100" style={{ width: `${pct * 100}%`, background: s?.speaker === "chip" ? "#4a9d3a" : "#ff4201" }} />
      </div>

      {s?.speaker === "chip" ? (
        /* Chip is speaking — Gary listens (and does his stage cue) */
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm font-bold" style={{ background: "#4a9d3a22", color: "#7ec96a" }}>
            🤖 CHIP IS SPEAKING — listen
          </div>
          {s.garyCue && <p className="mb-4 text-xl text-amber-300">You: {s.garyCue}</p>}
          <p className="text-2xl leading-snug text-neutral-400">“{s.line}”</p>
        </div>
      ) : (
        /* Gary's line to read */
        <div className="flex flex-1 items-center">
          <p className="font-semibold leading-[1.25]" style={{ fontSize: "clamp(28px, 5vw, 52px)" }}>
            {s?.line || "Press ▶ Present on the keynote to begin."}
          </p>
        </div>
      )}

      {/* next line */}
      <div className="border-t border-white/10 pt-4">
        <div className="text-xs uppercase tracking-widest text-neutral-600">Next</div>
        <p className="mt-1 text-lg text-neutral-400">{s?.next || "—"}</p>
        {s && !s.playing && <p className="mt-2 text-xs text-neutral-600">paused</p>}
      </div>
    </main>
  );
}
