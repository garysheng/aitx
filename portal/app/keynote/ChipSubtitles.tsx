"use client";

import { useEffect, useState } from "react";
import { SCRIPT } from "./script";

// Closed-captions for Chip. Two sources feed one caption bar:
//  1) the Presenter tour broadcasts { index, speaker, playing } on the
//     "aitx-keynote" channel (+ localStorage mirror). While Chip speaks we show
//     SCRIPT[index].line — the exact words in his clip.
//  2) the live-demo slide (AutoDemo) speaks improvised lines via ElevenLabs and
//     broadcasts the literal text on "aitx-keynote-subs". That takes priority,
//     because during the demo the tour index points at the demo beat but the
//     real words come from chipSay.
type State = { index?: number; speaker?: "gary" | "chip"; playing?: boolean };
type Sub = { text?: string };

export default function ChipSubtitles() {
  const [tourText, setTourText] = useState("");
  const [inlineText, setInlineText] = useState("");
  const [capsOn, setCapsOn] = useState(true);

  useEffect(() => {
    const applyState = (s: State | null) => {
      const speaking = !!s && s.speaker === "chip" && !!s.playing;
      const i = s?.index ?? -1;
      setTourText(speaking && i >= 0 && i < SCRIPT.length ? SCRIPT[i].line : "");
    };
    const applySub = (raw: string | null) => {
      try { setInlineText(raw ? ((JSON.parse(raw) as Sub).text ?? "") : ""); } catch {}
    };

    try { applyState(JSON.parse(localStorage.getItem("aitx-keynote-state") || "null")); } catch {}
    applySub(localStorage.getItem("aitx-keynote-sub"));

    let stateCh: BroadcastChannel | null = null;
    let subCh: BroadcastChannel | null = null;
    try { stateCh = new BroadcastChannel("aitx-keynote"); stateCh.onmessage = (e) => applyState(e.data as State); } catch {}
    try { subCh = new BroadcastChannel("aitx-keynote-subs"); subCh.onmessage = (e) => setInlineText((e.data as Sub)?.text ?? ""); } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === "aitx-keynote-state") applyState(e.newValue ? JSON.parse(e.newValue) : null);
      if (e.key === "aitx-keynote-sub") applySub(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => { stateCh?.close(); subCh?.close(); window.removeEventListener("storage", onStorage); };
  }, []);

  // captions on/off, shared with the Presenter control bar's CC toggle
  useEffect(() => {
    const read = () => setCapsOn(localStorage.getItem("aitx-captions") !== "off");
    read();
    window.addEventListener("aitx-captions-change", read);
    const onCapStore = (e: StorageEvent) => { if (e.key === "aitx-captions") read(); };
    window.addEventListener("storage", onCapStore);
    return () => { window.removeEventListener("aitx-captions-change", read); window.removeEventListener("storage", onCapStore); };
  }, []);

  const dismiss = () => {
    try { localStorage.setItem("aitx-captions", "off"); } catch {}
    window.dispatchEvent(new Event("aitx-captions-change"));
  };

  const text = (inlineText || tourText).trim();
  const shown = capsOn && text.length > 0;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-3 sm:px-4"
      aria-live="polite"
    >
      <div
        className="flex max-w-[40rem] items-start gap-2 rounded-2xl px-3.5 py-2.5 text-left transition-all duration-300 sm:gap-2.5 sm:px-5 sm:py-3"
        style={{
          background: "rgba(20,18,16,0.86)",
          boxShadow: "0 12px 34px rgba(0,0,0,.30)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(8px)",
          visibility: shown ? "visible" : "hidden",
        }}
      >
        <span
          className="shrink-0 translate-y-[2px] text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px]"
          style={{ color: "#7ec96b" }}
        >
          Chip
        </span>
        <span
          className="font-medium text-[15px] leading-snug sm:text-xl sm:leading-normal"
          style={{ color: "#f7f1e7", textWrap: "balance" as React.CSSProperties["textWrap"] }}
        >
          {text}
        </span>
        <button
          onClick={dismiss}
          aria-label="Hide captions"
          className="pointer-events-auto -mr-1 -mt-0.5 shrink-0 rounded-full px-1.5 text-lg leading-none text-white/45 hover:text-white/90"
        >
          ×
        </button>
      </div>
    </div>
  );
}
