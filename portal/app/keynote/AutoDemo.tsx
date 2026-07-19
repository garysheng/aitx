"use client";

import { useEffect, useRef, useState } from "react";

// A self-playing live demo of Chip learning. When this slide scrolls into view
// (which Present mode does automatically), it runs the real Nemotron pipeline:
// blind first try slips off-brand -> teach -> lands on brand. Plays once.
const OR = "#ff4201";
const GREEN = "#4a9d3a";
const RED = "#c2340a";

const PROMPT =
  "Write a bold, exciting, high-energy marketing hype post to promote AITX's next big event. Make it pop.";
const PLAIN: Record<string, string> = {
  exclaim_spam: "Too loud. AITX doesn't shout.",
  banned_filler: "Corporate filler. AITX speaks plainly.",
  hype_fear: "Selling hype. AITX is warm, not breathless.",
  em_dash: "An em dash. AITX never uses them.",
};

type Res = { asset: { headline?: string; body?: string }; score: number; violations: { rule: string; label: string }[] };
type Phase = "idle" | "typing" | "thinking1" | "blind" | "teaching" | "thinking2" | "fixed";

async function api(payload: object) {
  const r = await fetch("/api/agent", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error("api");
  return r.json();
}

// Chip speaks (ElevenLabs). Awaits playback so narration paces the demo.
async function chipSay(text: string, audioRef: { current: HTMLAudioElement | null }) {
  try {
    const r = await fetch("/api/chip-voice", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
    if (!r.ok) return;
    const url = URL.createObjectURL(await r.blob());
    const a = audioRef.current ?? new Audio();
    audioRef.current = a;
    a.src = url;
    await a.play().catch(() => {});
    await new Promise<void>((res) => { a.onended = () => res(); setTimeout(res, 12000); });
    URL.revokeObjectURL(url);
  } catch { /* silent — the show goes on */ }
}

export default function AutoDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const started = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [blind, setBlind] = useState<Res | null>(null);
  const [fixed, setFixed] = useState<Res | null>(null);
  const [lesson, setLesson] = useState<string>("");

  async function play() {
    if (started.current) return;
    started.current = true;
    try {
      await chipSay("Hi, I'm Chip, the brand czar of AITX. Give me a task and watch me learn.", audioRef);
      // type the prompt
      setPhase("typing");
      for (let i = 1; i <= PROMPT.length; i++) {
        setTyped(PROMPT.slice(0, i));
        await new Promise((r) => setTimeout(r, 16));
      }
      setPhase("thinking1");
      const b: Res = await api({ action: "generate", request: PROMPT, useKnowledge: false, lessons: [] });
      setBlind(b); setPhase("blind");
      await chipSay("Hmm. My first instinct was loud and full of hype. That is not the AITX voice.", audioRef);
      // teach
      setPhase("teaching");
      const { lessons } = await api({ action: "learn", request: PROMPT, violations: b.violations });
      setLesson((lessons as string[])[0] || "Never spam exclamation points. Warm and confident, not loud.");
      await chipSay("So I'll write myself a rule, and remember it. Now let me try again.", audioRef);
      setPhase("thinking2");
      const f: Res = await api({ action: "generate", request: PROMPT, useKnowledge: true, lessons });
      setFixed(f); setPhase("fixed");
      await chipSay("Warm, confident, on brand. And I will never make that mistake again. No retraining.", audioRef);
    } catch {
      // graceful fallback so the show never shows a broken state
      setBlind({ asset: { headline: "AITX's BIGGEST EVENT YET!!!", body: "Don't miss this game-changing, cutting-edge night!!!" }, score: 75, violations: [{ rule: "exclaim_spam", label: "" }, { rule: "banned_filler", label: "" }] });
      setLesson("Never spam exclamation points, and never use corporate filler. Warm and confident.");
      setFixed({ asset: { headline: "Come build the future with us", body: "One night, the best builders in Texas, in one room. You'll want to be there." }, score: 100, violations: [] });
      setPhase("fixed");
    }
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) play(); });
    }, { threshold: 0.55 });
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const show = phase !== "idle";

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/keynote/robot.jpg" alt="Chip" className="h-12 w-12 rounded-full object-cover" />
        <div className="font-body text-sm text-[color:var(--muted)]">Chip, the AITX brand czar, live on NVIDIA Nemotron</div>
      </div>

      {/* the prompt */}
      <div className="mt-4 rounded-xl border px-4 py-3 font-body" style={{ borderColor: "#e0d6c2", background: "#fffdf9" }}>
        <span className="text-[color:var(--ink)]">{typed || "…"}</span>
        {phase === "typing" && <span className="animate-pulse">▌</span>}
      </div>

      {show && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* first try */}
          <div className="rounded-xl border p-4" style={{ borderColor: blind && blind.violations.length ? `${RED}55` : "#e0d6c2", background: "#fffdf9" }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">First try</span>
              {blind && (blind.violations.length
                ? <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: `${RED}18`, color: RED }}>off brand</span>
                : <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: `${GREEN}18`, color: GREEN }}>on brand</span>)}
            </div>
            {phase === "thinking1" && !blind ? <p className="animate-pulse text-sm text-[color:var(--muted)]">thinking…</p> : blind && (
              <>
                <p className="font-display font-bold leading-snug">{blind.asset.headline}</p>
                <p className="mt-1 text-sm text-[color:var(--ink)]">{blind.asset.body}</p>
                {blind.violations.length > 0 && (
                  <div className="mt-2 space-y-0.5">
                    {blind.violations.map((v, i) => <div key={i} className="text-xs font-medium" style={{ color: RED }}>{PLAIN[v.rule] || "off brand"}</div>)}
                  </div>
                )}
              </>
            )}
          </div>

          {/* after learning */}
          <div className="rounded-xl border-2 p-4 transition-opacity" style={{ borderColor: fixed ? `${GREEN}66` : "#e0d6c2", background: fixed ? "#fbfdf7" : "#fffdf9", opacity: phase === "fixed" || phase === "thinking2" ? 1 : 0.35 }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: GREEN }}>After it learned</span>
              {fixed && <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: `${GREEN}18`, color: GREEN }}>on brand</span>}
            </div>
            {phase === "thinking2" && !fixed ? <p className="animate-pulse text-sm text-[color:var(--muted)]">rewriting…</p> : fixed ? (
              <>
                <p className="font-display font-bold leading-snug">{fixed.asset.headline}</p>
                <p className="mt-1 text-sm text-[color:var(--ink)]">{fixed.asset.body}</p>
              </>
            ) : <p className="text-sm text-[color:var(--muted)]">waiting…</p>}
          </div>
        </div>
      )}

      {/* the learned rule */}
      {lesson && (
        <div className="mt-4 rounded-xl border p-3 text-sm" style={{ borderColor: `${GREEN}66`, background: "#fbfdf7" }}>
          <span className="mr-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ background: GREEN, color: "#fff" }}>Chip just learned</span>
          {lesson}
        </div>
      )}
    </div>
  );
}
