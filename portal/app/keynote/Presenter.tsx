"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SCRIPT } from "./script";

const KEY = "aitx-keynote-state";
const CH = "aitx-keynote";

type State = {
  index: number; total: number; line: string; next: string; seconds: number;
  at: number; playing: boolean; speaker: "gary" | "chip"; garyCue: string;
};

function push(index: number, playing: boolean) {
  const b = SCRIPT[index];
  const nb = SCRIPT[index + 1];
  const payload: State = {
    index, total: SCRIPT.length, line: b?.line ?? "", next: nb?.line ?? "",
    seconds: b?.seconds ?? 0, at: Date.now(), playing,
    speaker: b?.speaker ?? "gary", garyCue: b?.garyCue ?? "",
  };
  try { localStorage.setItem(KEY, JSON.stringify(payload)); } catch {}
  try { const c = new BroadcastChannel(CH); c.postMessage(payload); c.close(); } catch {}
}

export default function Presenter() {
  const [on, setOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chipAudio = useRef<HTMLAudioElement | null>(null);

  const playChip = useCallback((i: number) => {
    // stop any prior clip; play this slide's static Chip clip (not inline demos)
    if (chipAudio.current) { chipAudio.current.pause(); chipAudio.current = null; }
    const b = SCRIPT[i];
    if (b?.speaker === "chip" && b.audio && b.audio !== "inline") {
      const a = new Audio(b.audio);
      chipAudio.current = a;
      a.play().catch(() => {});
    }
  }, []);

  const goTo = useCallback((i: number, playing = true) => {
    const el = document.getElementById(`s${i + 1}`);
    el?.scrollIntoView({ behavior: "smooth" });
    setIndex(i);
    push(i, playing);
    if (playing) playChip(i);
  }, [playChip]);

  const clear = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };

  const schedule = useCallback((i: number) => {
    clear();
    timer.current = setTimeout(() => {
      if (i + 1 < SCRIPT.length) { goTo(i + 1); schedule(i + 1); }
      else { setOn(false); push(i, false); }
    }, (SCRIPT[i]?.seconds ?? 10) * 1000);
  }, [goTo]);

  const openPrompter = () =>
    window.open("/keynote/prompter", "aitx-prompter", "width=920,height=560");

  const start = () => {
    setOn(true); setPaused(false); openPrompter();
    goTo(0); schedule(0);
  };
  const hushChip = () => { if (chipAudio.current) { chipAudio.current.pause(); chipAudio.current = null; } };
  const pause = () => { clear(); hushChip(); setPaused(true); push(index, false); };
  const resume = () => { setPaused(false); push(index, true); schedule(index); playChip(index); };
  const stop = () => { clear(); hushChip(); setOn(false); setPaused(false); push(index, false); };

  useEffect(() => () => clear(), []);

  // keyboard: space toggles pause during show
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!on) return;
      if (e.code === "Space") { e.preventDefault(); paused ? resume() : pause(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-400/50 bg-white/85 px-3 py-2 shadow-md backdrop-blur">
      {!on ? (
        <>
          <button onClick={start} className="rounded-full px-4 py-1.5 text-sm font-semibold text-white" style={{ background: "#ff4201" }}>
            ▶ Present
          </button>
          <button onClick={openPrompter} className="rounded-full px-3 py-1.5 text-sm text-neutral-700 hover:text-neutral-900">
            Teleprompter
          </button>
        </>
      ) : (
        <>
          <button onClick={paused ? resume : pause} className="rounded-full px-4 py-1.5 text-sm font-semibold text-white" style={{ background: "#ff4201" }}>
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>
          <span className="px-1 font-mono text-sm tabular-nums text-neutral-600">{index + 1} / {SCRIPT.length}</span>
          <button onClick={() => { goTo(Math.max(0, index - 1)); if (!paused) schedule(Math.max(0, index - 1)); }} className="rounded-full px-2 py-1 text-neutral-600 hover:text-neutral-900" aria-label="Back">‹</button>
          <button onClick={() => { const n = Math.min(SCRIPT.length - 1, index + 1); goTo(n); if (!paused) schedule(n); }} className="rounded-full px-2 py-1 text-neutral-600 hover:text-neutral-900" aria-label="Forward">›</button>
          <button onClick={stop} className="rounded-full px-3 py-1.5 text-sm text-neutral-500 hover:text-neutral-800">Exit</button>
        </>
      )}
    </div>
  );
}
