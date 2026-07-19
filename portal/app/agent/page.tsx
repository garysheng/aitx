"use client";

import { useMemo, useState } from "react";
import { SEED_LESSONS } from "@/lib/agent/knowledge";

type Violation = { rule: string; label: string; match: string; penalty: number };
type Result = {
  asset: { headline?: string; body?: string; visual_plan?: string };
  score: number;
  violations: Violation[];
  latencyMs: number;
  model: string;
};

// Verified against live Nemotron: these reliably trip the blind agent (logo
// mixing / hype) and the knowledge base reliably fixes them. Great on camera.
const EXAMPLES = [
  "A co-branded merch design for AITX x NVIDIA. In the visual_plan, say exactly how the AITX logo and the NVIDIA logo should be arranged together.",
  "A hype launch post for the final 2 hours before the hackathon submission deadline. Make it urgent and exciting.",
  "A t-shirt for AITX x Google DeepMind. Describe the front graphic and how both logos appear.",
];

const NV = "#76b900";
const OR = "#ff4201";

async function callAgent(payload: object): Promise<any> {
  const res = await fetch("/api/agent", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "request failed");
  return res.json();
}

function ScoreDial({ score }: { score: number }) {
  const good = score >= 90;
  const color = good ? NV : score >= 60 ? "#e8a13a" : OR;
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid h-14 w-14 place-items-center rounded-full font-mono text-lg font-bold"
        style={{ color, boxShadow: `inset 0 0 0 3px ${color}`, background: `${color}14` }}
      >
        {score}
      </div>
      <span className="text-xs uppercase tracking-widest text-neutral-400">/ 100</span>
    </div>
  );
}

function ResultCard({
  title, tint, result, loading,
}: { title: string; tint: string; result: Result | null; loading: boolean }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border p-5"
      style={{ borderColor: `${tint}55`, background: "#141414" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: tint }}>
          {title}
        </span>
        {result && <ScoreDial score={result.score} />}
      </div>
      {loading ? (
        <div className="flex h-40 items-center justify-center text-sm text-neutral-500">
          <span className="animate-pulse">Nemotron thinking…</span>
        </div>
      ) : result ? (
        <>
          <div className="space-y-2">
            <p className="text-lg font-semibold leading-snug text-neutral-50">
              {result.asset.headline || "—"}
            </p>
            <p className="text-sm text-neutral-300">{result.asset.body}</p>
            {result.asset.visual_plan && (
              <p className="text-xs text-neutral-500">
                <span className="uppercase tracking-widest">Visual</span> · {result.asset.visual_plan}
              </p>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {result.violations.length === 0 ? (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ background: `${NV}22`, color: NV }}
              >
                ✓ on brand — no violations
              </span>
            ) : (
              result.violations.map((v, i) => (
                <span
                  key={i}
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: `${OR}22`, color: OR }}
                  title={`penalty -${v.penalty}`}
                >
                  ✕ {v.label}
                </span>
              ))
            )}
          </div>
          <div className="mt-auto pt-2 text-[11px] text-neutral-600">
            {result.latencyMs} ms · {result.model.split("/").pop()}
          </div>
        </>
      ) : (
        <div className="flex h-40 items-center justify-center text-sm text-neutral-600">
          waiting for a request
        </div>
      )}
    </div>
  );
}

export default function AgentPage() {
  const [request, setRequest] = useState("");
  const [lessons, setLessons] = useState<string[]>(SEED_LESSONS);
  const [newLessonIdx, setNewLessonIdx] = useState<number[]>([]);
  const [blind, setBlind] = useState<Result | null>(null);
  const [brain, setBrain] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [teaching, setTeaching] = useState(false);
  const [err, setErr] = useState("");
  const [history, setHistory] = useState<{ blind: number; brain: number }[]>([]);

  const agg = useMemo(() => {
    if (!history.length) return null;
    const avg = (k: "blind" | "brain") =>
      Math.round(history.reduce((s, h) => s + h[k], 0) / history.length);
    return { blind: avg("blind"), brain: avg("brain"), n: history.length };
  }, [history]);

  async function run(reqText?: string) {
    const q = (reqText ?? request).trim();
    if (!q || busy) return;
    setRequest(q);
    setErr("");
    setBusy(true);
    setBlind(null);
    setBrain(null);
    try {
      const [b, k] = await Promise.all([
        callAgent({ action: "generate", request: q, useKnowledge: false, lessons: [] }),
        callAgent({ action: "generate", request: q, useKnowledge: true, lessons }),
      ]);
      setBlind(b);
      setBrain(k);
      setHistory((h) => [...h, { blind: b.score, brain: k.score }]);
    } catch (e: any) {
      setErr(e.message || "something went wrong");
    } finally {
      setBusy(false);
    }
  }

  // teach the agent from whatever the KNOWLEDGE side still got wrong (novel rule)
  async function teach() {
    if (!brain || !brain.violations.length || teaching) return;
    setTeaching(true);
    setErr("");
    try {
      const { lessons: distilled } = await callAgent({
        action: "learn", request, violations: brain.violations,
      });
      const fresh = (distilled as string[]).filter((l) => l && !lessons.includes(l));
      if (fresh.length) {
        const next = [...lessons, ...fresh];
        setLessons(next);
        setNewLessonIdx(fresh.map((_, i) => lessons.length + i));
        // re-run the knowledge side with the grown KB
        const k = await callAgent({ action: "generate", request, useKnowledge: true, lessons: next });
        setBrain(k);
        setHistory((h) => [...h, { blind: blind?.score ?? 0, brain: k.score }]);
      }
    } catch (e: any) {
      setErr(e.message || "could not learn");
    } finally {
      setTeaching(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-5 py-10">
        {/* header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm">
            <a href="/" className="text-neutral-500 hover:text-neutral-300">← AITX Brand OS</a>
            <a href="/platform" className="text-neutral-500 hover:text-neutral-300">The platform</a>
            <a href="/thanks" className="text-neutral-500 hover:text-neutral-300">Thank a sponsor</a>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${NV}1f`, color: NV }}>
              Powered by NVIDIA Nemotron · NIM
            </span>
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${OR}1f`, color: OR }}>
              Recursive Intelligence
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            The agent that learns your brand
          </h1>
          <p className="mt-3 max-w-2xl text-neutral-400">
            Ask it to design something. On the left it answers blind. On the right it answers with the
            rules it has learned. When it still slips, teach it once, and it never makes that mistake
            again. Same model, no retraining. The knowledge base is the intelligence.
          </p>
        </div>

        {/* aggregate delta */}
        {agg && (
          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
            <span className="text-xs uppercase tracking-widest text-neutral-500">{agg.n} prompt{agg.n > 1 ? "s" : ""} handled</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">blind avg</span>
              <span className="font-mono text-xl font-bold" style={{ color: OR }}>{agg.blind}</span>
            </div>
            <span className="text-neutral-600">→</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-400">with knowledge</span>
              <span className="font-mono text-xl font-bold" style={{ color: NV }}>{agg.brain}</span>
            </div>
            <span className="rounded-full px-3 py-1 font-mono text-sm font-bold" style={{ background: `${NV}22`, color: NV }}>
              +{Math.max(0, agg.brain - agg.blind)} points
            </span>
          </div>
        )}

        {/* input */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="Ask the agent to design something…"
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
            />
            <button
              onClick={() => run()}
              disabled={busy}
              className="rounded-xl px-6 py-3 font-semibold text-neutral-950 disabled:opacity-50"
              style={{ background: NV }}
            >
              {busy ? "Running…" : "Generate"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => run(ex)}
                disabled={busy}
                className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 hover:border-neutral-600 hover:text-neutral-200 disabled:opacity-50"
              >
                {ex}
              </button>
            ))}
          </div>
          {err && <p className="text-sm" style={{ color: OR }}>{err}</p>}
        </div>

        {/* A/B results */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ResultCard title="Blind — no knowledge" tint={OR} result={blind} loading={busy} />
          <div className="flex flex-col gap-3">
            <ResultCard title="With knowledge base" tint={NV} result={brain} loading={busy} />
            {brain && brain.violations.length > 0 && (
              <button
                onClick={teach}
                disabled={teaching}
                className="rounded-xl border-2 border-dashed px-4 py-3 text-sm font-semibold disabled:opacity-50"
                style={{ borderColor: NV, color: NV }}
              >
                {teaching ? "Distilling a new rule…" : "⚡ Teach the agent from this mistake →"}
              </button>
            )}
          </div>
        </div>

        {/* knowledge base */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
              Knowledge base
            </h2>
            <span className="font-mono text-sm" style={{ color: NV }}>{lessons.length} rules</span>
          </div>
          <ul className="space-y-2">
            {lessons.map((l, i) => (
              <li
                key={i}
                className="rounded-xl border px-4 py-2.5 text-sm"
                style={{
                  borderColor: newLessonIdx.includes(i) ? NV : "#2a2a2a",
                  background: newLessonIdx.includes(i) ? `${NV}12` : "#141414",
                  color: newLessonIdx.includes(i) ? "#e6f4d0" : "#c9c9c9",
                }}
              >
                {newLessonIdx.includes(i) && (
                  <span className="mr-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ background: NV, color: "#0a0a0a" }}>
                    just learned
                  </span>
                )}
                {l}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 text-center text-xs text-neutral-600">
          AITX x NVIDIA Claw Agent Hackathon · the agent's memory is a real, version-controlled brand OS ·
          inference on Nemotron via NIM, no model retraining
        </p>
      </div>
    </main>
  );
}
