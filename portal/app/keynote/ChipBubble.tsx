"use client";

import { useEffect, useState } from "react";

// The two co-presenters' on-stage presence: Chip bottom-left, Gary bottom-right.
// Whoever holds the mic glows and pulses; the other dims. Driven by the presenter
// broadcast { speaker, playing } on the "aitx-keynote" channel (+ localStorage).
type State = { speaker?: "gary" | "chip"; playing?: boolean };

type Host = {
  who: "gary" | "chip";
  name: string;
  role: string;
  img: string;
  side: "left" | "right";
  glow: string;   // ring/accent color when speaking
  label: string;  // idle label text color
  active: string; // "…is speaking" text color
};

const HOSTS: Host[] = [
  { who: "chip", name: "Chip", role: "brand czar", img: "/assets/keynote/robot.jpg", side: "left", glow: "#4a9d3a", label: "#8a7d68", active: "#3a7d2e" },
  { who: "gary", name: "Gary", role: "host", img: "/assets/keynote/gary-master.jpg", side: "right", glow: "#ff4201", label: "#8a7d68", active: "#c2340a" },
];

function Bubble({ host, speaking }: { host: Host; speaking: boolean }) {
  const nameBadge = (
    <div
      className="rounded-full px-3 py-1 text-xs font-bold transition-opacity duration-300"
      style={{ background: "#ffffffdd", color: speaking ? host.active : host.label, opacity: speaking ? 1 : 0.7 }}
    >
      {speaking ? `${host.name} is speaking…` : `${host.name} · ${host.role}`}
    </div>
  );
  const avatar = (
    <div
      className="relative h-20 w-20 overflow-hidden rounded-full border-2 bg-white transition-all duration-300"
      style={{
        borderColor: speaking ? host.glow : "rgba(0,0,0,0.12)",
        boxShadow: speaking ? `0 0 0 4px ${host.glow}33, 0 8px 24px rgba(0,0,0,.18)` : "0 4px 14px rgba(0,0,0,.12)",
        transform: speaking ? "scale(1.06)" : "scale(1)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={host.img} alt={host.name} className="h-full w-full object-cover object-top" />
      {speaking && <span className="absolute inset-0 animate-ping rounded-full" style={{ boxShadow: `inset 0 0 0 2px ${host.glow}` }} />}
    </div>
  );
  return (
    <div
      className={`pointer-events-none fixed bottom-5 z-40 hidden items-center gap-3 sm:flex ${host.side === "left" ? "left-5" : "right-5 flex-row-reverse"}`}
    >
      {avatar}
      {nameBadge}
    </div>
  );
}

export default function ChipBubble() {
  const [speaker, setSpeaker] = useState<"gary" | "chip" | null>(null);

  useEffect(() => {
    const apply = (s: State | null) => setSpeaker(s && s.playing && s.speaker ? s.speaker : null);
    try { const raw = localStorage.getItem("aitx-keynote-state"); if (raw) apply(JSON.parse(raw)); } catch {}
    let ch: BroadcastChannel | null = null;
    try { ch = new BroadcastChannel("aitx-keynote"); ch.onmessage = (e) => apply(e.data as State); } catch {}
    const onStorage = (e: StorageEvent) => { if (e.key === "aitx-keynote-state" && e.newValue) apply(JSON.parse(e.newValue)); };
    window.addEventListener("storage", onStorage);
    return () => { ch?.close(); window.removeEventListener("storage", onStorage); };
  }, []);

  return (
    <>
      {HOSTS.map((h) => (
        <Bubble key={h.who} host={h} speaking={speaker === h.who} />
      ))}
    </>
  );
}
