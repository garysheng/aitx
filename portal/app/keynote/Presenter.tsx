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

// Scroll the keynote's scroll container (the <main>) to slide n. scrollIntoView
// is unreliable inside the scroll-snap-mandatory container on mobile Safari, so
// scroll the container to the slide's offset directly.
function scrollToSlide(n: number) {
  const main = document.querySelector("main");
  const el = document.getElementById(`s${n}`);
  if (!main || !el) { el?.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  const top = el.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop;
  main.scrollTo({ top, behavior: "smooth" });
}

export default function Presenter() {
  const [on, setOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loop, setLoop] = useState(false);
  const [index, setIndex] = useState(0);
  const [caps, setCaps] = useState(true);
  const audio = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopRef = useRef(false);
  loopRef.current = loop;

  const stopMedia = () => {
    if (audio.current) { audio.current.pause(); audio.current.onended = null; audio.current = null; }
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
  };

  // play slide i's narration; when it finishes, advance to i+1 (chaining the tour)
  const play = useCallback((i: number) => {
    stopMedia();
    if (i >= SCRIPT.length) {
      // kiosk/loop mode: restart the tour from the top and keep playing
      if (loopRef.current) { play(0); return; }
      setOn(false); broadcast(i - 1, false); return;
    }
    setIndex(i);
    scrollToSlide(i + 1);
    const beat = SCRIPT[i];
    // a slight breath between slides so Chip's narration doesn't run one clip
    // straight into the next
    const advance = () => { timer.current = setTimeout(() => play(i + 1), 650); };

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
  // captions on/off, shared with ChipSubtitles via localStorage + a window event
  useEffect(() => {
    const read = () => setCaps(localStorage.getItem("aitx-captions") !== "off");
    read();
    window.addEventListener("aitx-captions-change", read);
    return () => window.removeEventListener("aitx-captions-change", read);
  }, []);
  const toggleCaps = () => {
    const next = !caps;
    setCaps(next);
    try { localStorage.setItem("aitx-captions", next ? "on" : "off"); } catch {}
    window.dispatchEvent(new Event("aitx-captions-change"));
  };
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
    <div className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-0.5 rounded-full border border-neutral-400/50 bg-white/90 px-2 py-1.5 shadow-md backdrop-blur sm:bottom-5 sm:gap-2 sm:px-3 sm:py-2">
      {!on ? (
        <>
          <button onClick={start} className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold text-white sm:px-5" style={{ background: "#ff4201" }}>
            ▶ Play the tour<span className="hidden sm:inline">&nbsp;with Chip</span>
          </button>
          <button onClick={() => setLoop((l) => !l)} title="Loop the tour (kiosk mode)" aria-label="Loop"
            className="rounded-full px-2.5 py-1.5 text-sm font-semibold sm:px-3"
            style={{ background: loop ? "#ff420122" : "transparent", color: loop ? "#c2340a" : "#8a8a8a" }}>
            🔁<span className="hidden sm:inline"> Loop{loop ? " on" : ""}</span>
          </button>
        </>
      ) : (
        <>
          <button onClick={() => jump(index - 1)} className="rounded-full px-2 py-1 text-lg text-neutral-600 hover:text-neutral-900 sm:px-3" aria-label="Back">‹</button>
          <button onClick={paused ? resume : pause} className="rounded-full px-3 py-1.5 text-sm font-semibold text-white sm:px-4" style={{ background: "#ff4201" }}>
            {paused ? "▶" : "⏸"}
          </button>
          <span className="whitespace-nowrap px-0.5 font-mono text-xs tabular-nums text-neutral-600 sm:px-1 sm:text-sm">{index + 1} / {SCRIPT.length}</span>
          <button onClick={() => jump(index + 1)} className="rounded-full px-2 py-1 text-lg text-neutral-600 hover:text-neutral-900 sm:px-3" aria-label="Next">›</button>
          <button onClick={toggleCaps} title="Toggle captions" aria-label="Toggle captions"
            className="rounded-full px-1.5 py-1 text-xs font-bold sm:px-2.5"
            style={{ background: caps ? "#ff420122" : "transparent", color: caps ? "#c2340a" : "#9a9a9a" }}>
            CC
          </button>
          <button onClick={() => setLoop((l) => !l)} title="Loop the tour (kiosk mode)" aria-label="Loop"
            className="rounded-full px-1.5 py-1 text-sm sm:px-2.5" style={{ color: loop ? "#c2340a" : "#9a9a9a" }}>
            🔁<span className="hidden sm:inline"> Loop{loop ? " on" : ""}</span>
          </button>
          <button onClick={stop} className="rounded-full px-2 py-1.5 text-sm text-neutral-500 hover:text-neutral-800 sm:px-3">Exit</button>
        </>
      )}
    </div>
  );
}
