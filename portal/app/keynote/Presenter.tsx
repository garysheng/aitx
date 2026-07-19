"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SCRIPT } from "./script";

// Self-serve tour, narrated by Chip. Hit Play: Chip narrates each slide in his
// own voice and the deck auto-advances when his clip ends. The live-demo slide
// (audio "inline") plays its own narration, so we advance on a timer instead.
// Pause/skip anytime. His bubble glows while he speaks (via the broadcast).
const CH = "aitx-keynote";
const KEY = "aitx-keynote-state";

function broadcast(index: number, speaking: boolean) {
  const payload = { index, speaker: "chip", playing: speaking, at: 0 };
  try { localStorage.setItem(KEY, JSON.stringify(payload)); } catch {}
  try { const c = new BroadcastChannel(CH); c.postMessage(payload); c.close(); } catch {}
}

export default function Presenter() {
  const [on, setOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopMedia = () => {
    if (audio.current) { audio.current.pause(); audio.current.onended = null; audio.current = null; }
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
  };

  // play slide i's narration; when it finishes, advance to i+1 (chaining the tour)
  const play = useCallback((i: number) => {
    stopMedia();
    if (i >= SCRIPT.length) { setOn(false); broadcast(i - 1, false); return; }
    setIndex(i);
    document.getElementById(`s${i + 1}`)?.scrollIntoView({ behavior: "smooth" });
    const beat = SCRIPT[i];
    const advance = () => play(i + 1);

    if (beat.audio && beat.audio !== "inline") {
      const a = new Audio(beat.audio);
      audio.current = a;
      broadcast(i, true);
      a.onended = advance;
      a.play().catch(() => { timer.current = setTimeout(advance, beat.seconds * 1000); });
    } else {
      // inline slide (the live demo narrates itself) — advance on its fallback timer
      broadcast(i, true);
      timer.current = setTimeout(advance, beat.seconds * 1000);
    }
  }, []);

  const start = () => { setOn(true); setPaused(false); play(0); };
  const pause = () => { stopMedia(); setPaused(true); broadcast(index, false); };
  const resume = () => { setPaused(false); play(index); };
  const stop = () => { stopMedia(); setOn(false); setPaused(false); broadcast(index, false); };
  const jump = (i: number) => { const n = Math.min(Math.max(i, 0), SCRIPT.length - 1); play(n); setPaused(false); };

  useEffect(() => () => stopMedia(), []);
  useEffect(() => {
    if (!on) return;
    const h = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.code)) { e.preventDefault(); jump(index + 1); }
      else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.code)) { e.preventDefault(); jump(index - 1); }
      else if (e.code === "Space") { e.preventDefault(); paused ? resume() : pause(); }
      else if (e.code === "Escape") stop();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-400/50 bg-white/90 px-3 py-2 shadow-md backdrop-blur">
      {!on ? (
        <button onClick={start} className="flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-semibold text-white" style={{ background: "#ff4201" }}>
          ▶ Play the tour with Chip
        </button>
      ) : (
        <>
          <button onClick={() => jump(index - 1)} className="rounded-full px-3 py-1 text-lg text-neutral-600 hover:text-neutral-900" aria-label="Back">‹</button>
          <button onClick={paused ? resume : pause} className="rounded-full px-4 py-1.5 text-sm font-semibold text-white" style={{ background: "#ff4201" }}>
            {paused ? "▶" : "⏸"}
          </button>
          <span className="px-1 font-mono text-sm tabular-nums text-neutral-600">{index + 1} / {SCRIPT.length}</span>
          <button onClick={() => jump(index + 1)} className="rounded-full px-3 py-1 text-lg text-neutral-600 hover:text-neutral-900" aria-label="Next">›</button>
          <button onClick={stop} className="rounded-full px-3 py-1.5 text-sm text-neutral-500 hover:text-neutral-800">Exit</button>
        </>
      )}
    </div>
  );
}
