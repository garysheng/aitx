"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SCRIPT } from "./script";

// Manual presentation controller. No teleprompter, no auto-advance: Gary clicks
// through every slide himself (arrow keys or the on-screen buttons). When he
// lands on one of Chip's slides, Chip's voice plays and his bubble glows.
const CH = "aitx-keynote";
const KEY = "aitx-keynote-state";

function broadcast(index: number, speaking: boolean) {
  const b = SCRIPT[index];
  const payload = { index, speaker: b?.speaker ?? "gary", playing: speaking, at: 0 };
  try { localStorage.setItem(KEY, JSON.stringify(payload)); } catch {}
  try { const c = new BroadcastChannel(CH); c.postMessage(payload); c.close(); } catch {}
}

export default function Presenter() {
  const [on, setOn] = useState(false);
  const [index, setIndex] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);

  const hush = () => { if (audio.current) { audio.current.pause(); audio.current = null; } };

  const enter = useCallback((i: number) => {
    const b = SCRIPT[i];
    hush();
    // Chip's static clips (his intro + thank-you). The live demo (audio:"inline")
    // plays its own narration inside the slide, so we don't double-play it.
    if (b?.speaker === "chip" && b.audio && b.audio !== "inline") {
      const a = new Audio(b.audio);
      audio.current = a;
      a.play().catch(() => {});
      a.onended = () => broadcast(i, false);
      broadcast(i, true);
    } else {
      broadcast(i, b?.speaker === "chip");
    }
  }, []);

  const goTo = useCallback((i: number) => {
    const n = Math.min(Math.max(i, 0), SCRIPT.length - 1);
    document.getElementById(`s${n + 1}`)?.scrollIntoView({ behavior: "smooth" });
    setIndex(n);
    enter(n);
  }, [enter]);

  const start = () => { setOn(true); goTo(0); };
  const stop = () => { hush(); setOn(false); broadcast(index, false); };

  // keyboard nav while presenting
  useEffect(() => {
    if (!on) return;
    const h = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown", "Space"].includes(e.code)) { e.preventDefault(); goTo(index + 1); }
      else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.code)) { e.preventDefault(); goTo(index - 1); }
      else if (e.code === "Escape") stop();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  useEffect(() => () => hush(), []);

  return (
    <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-400/50 bg-white/85 px-3 py-2 shadow-md backdrop-blur">
      {!on ? (
        <button onClick={start} className="rounded-full px-4 py-1.5 text-sm font-semibold text-white" style={{ background: "#ff4201" }}>
          ▶ Present
        </button>
      ) : (
        <>
          <button onClick={() => goTo(index - 1)} className="rounded-full px-3 py-1 text-lg text-neutral-600 hover:text-neutral-900" aria-label="Previous">‹</button>
          <span className="px-1 font-mono text-sm tabular-nums text-neutral-600">{index + 1} / {SCRIPT.length}</span>
          <button onClick={() => goTo(index + 1)} className="rounded-full px-3 py-1 text-lg text-neutral-600 hover:text-neutral-900" aria-label="Next">›</button>
          {SCRIPT[index]?.speaker === "chip" && (
            <button onClick={() => enter(index)} className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: "#4a9d3a", color: "#fff" }} aria-label="Replay Chip">↻ Chip</button>
          )}
          <button onClick={stop} className="rounded-full px-3 py-1.5 text-sm text-neutral-500 hover:text-neutral-800">Exit</button>
        </>
      )}
    </div>
  );
}
