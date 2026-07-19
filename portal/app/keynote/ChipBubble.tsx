"use client";

import { useEffect, useState } from "react";

// Chip's on-stage presence: an avatar bubble bottom-left (mirrors Gary's Loom
// webcam bubble bottom-right). It glows and pulses while Chip is the speaker,
// and dims when Gary has the mic. Driven by the same presenter broadcast.
type State = { speaker?: "gary" | "chip"; playing?: boolean };

export default function ChipBubble() {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const apply = (s: State | null) => setSpeaking(!!s && s.speaker === "chip" && !!s.playing);
    try { const raw = localStorage.getItem("aitx-keynote-state"); if (raw) apply(JSON.parse(raw)); } catch {}
    let ch: BroadcastChannel | null = null;
    try { ch = new BroadcastChannel("aitx-keynote"); ch.onmessage = (e) => apply(e.data as State); } catch {}
    const onStorage = (e: StorageEvent) => { if (e.key === "aitx-keynote-state" && e.newValue) apply(JSON.parse(e.newValue)); };
    window.addEventListener("storage", onStorage);
    return () => { ch?.close(); window.removeEventListener("storage", onStorage); };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-40 flex items-center gap-3">
      <div
        className="relative h-20 w-20 overflow-hidden rounded-full border-2 bg-white transition-all duration-300"
        style={{
          borderColor: speaking ? "#4a9d3a" : "rgba(0,0,0,0.12)",
          boxShadow: speaking ? "0 0 0 4px #4a9d3a33, 0 8px 24px rgba(0,0,0,.18)" : "0 4px 14px rgba(0,0,0,.12)",
          transform: speaking ? "scale(1.06)" : "scale(1)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/keynote/robot.jpg" alt="Chip" className="h-full w-full object-cover object-top" />
        {speaking && <span className="absolute inset-0 animate-ping rounded-full" style={{ boxShadow: "inset 0 0 0 2px #4a9d3a" }} />}
      </div>
      <div
        className="rounded-full px-3 py-1 text-xs font-bold transition-opacity duration-300"
        style={{ background: "#ffffffdd", color: speaking ? "#3a7d2e" : "#8a7d68", opacity: speaking ? 1 : 0.7 }}
      >
        {speaking ? "Chip is speaking…" : "Chip · brand czar"}
      </div>
    </div>
  );
}
