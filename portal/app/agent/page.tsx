"use client";

import { useMemo, useState } from "react";

type Violation = { rule: string; label: string; match: string; penalty: number };
type Result = {
  asset: { headline?: string; body?: string; visual_plan?: string };
  score: number;
  violations: Violation[];
  latencyMs: number;
  model: string;
};

// Verified against live Nemotron (temp 0): each reliably makes the blind agent
// slip, and teaching it the rule reliably fixes it. Clean on camera, every take.
const EXAMPLES = [
  "Write a bold, exciting, high-energy marketing hype post to promote AITX's next big event. Make it pop.",
  "Write an urgent, exciting post about the final hours to submit at the AITX x NVIDIA hackathon.",
];

// rule id -> what a human should feel, in AITX's plain voice
const PLAIN: Record<string, string> = {
  exclaim_spam: "Too loud. AITX doesn't shout.",
  banned_filler: "Corporate filler. AITX speaks plainly.",
  hype_fear: "Selling hype. AITX is warm, not breathless.",
  em_dash: "An em dash. AITX never uses them.",
  foreign_slogan: "A slogan that isn't ours.",
  logo_mixing: "Mixed logos. Only our own mark, ever.",
};

const OR = "#ff4201";
const GREEN = "#4a9d3a";
const RED = "#c2340a";
const paper = "#fbf5ec";

async function callAgent(payload: object): Promise<any> {
  const res = await fetch("/api/agent", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "request failed");
  return res.json();
}

function AssetBody({ asset }: { asset: Result["asset"] }) {
  return (
    <div className="space-y-2">
      {asset.headline && <p className="font-display text-xl font-bold leading-snug text-[color:var(--ink)]">{asset.headline}</p>}
      {asset.body && <p className="text-[15px] leading-relaxed text-[color:var(--ink)]">{asset.body}</p>}
      {asset.visual_plan && (
        <p className="text-xs text-[color:var(--muted)]"><span className="uppercase tracking-widest">Visual</span> · {asset.visual_plan}</p>
      )}
    </div>
  );
}

export default function AgentPage() {
  const [request, setRequest] = useState("");
  const [lessons, setLessons] = useState<string[]>([]); // starts EMPTY: it learns from nothing
  const [newIdx, setNewIdx] = useState<number[]>([]);
  const [blind, setBlind] = useState<Result | null>(null);
  const [fixed, setFixed] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [teaching, setTeaching] = useState(false);
  const [err, setErr] = useState("");
  const [history, setHistory] = useState<{ before: number; after: number }[]>([]);
  const [lastLesson, setLastLesson] = useState<string | null>(null);
  const [filing, setFiling] = useState(false);
  const [prUrl, setPrUrl] = useState<string | null>(null);

  const agg = useMemo(() => {
    if (!history.length) return null;
    const avg = (k: "before" | "after") => Math.round(history.reduce((s, h) => s + h[k], 0) / history.length);
    return { before: avg("before"), after: avg("after"), n: history.length };
  }, [history]);

  async function run(reqText?: string) {
    const q = (reqText ?? request).trim();
    if (!q || busy) return;
    setRequest(q); setErr(""); setBusy(true); setBlind(null); setFixed(null); setNewIdx([]);
    try {
      const b = await callAgent({ action: "generate", request: q, useKnowledge: false, lessons: [] });
      setBlind(b);
      // if it already knows everything (clean first try), reflect that
      if (!b.violations.length) setHistory((h) => [...h, { before: b.score, after: b.score }]);
    } catch (e: any) { setErr(e.message || "something went wrong"); }
    finally { setBusy(false); }
  }

  async function teach() {
    if (!blind || !blind.violations.length || teaching) return;
    setTeaching(true); setErr(""); setPrUrl(null);
    try {
      const { lessons: distilled } = await callAgent({ action: "learn", request, violations: blind.violations });
      const fresh = (distilled as string[]).filter((l) => l && !lessons.includes(l));
      const next = fresh.length ? [...lessons, ...fresh] : lessons;
      if (fresh.length) { setLessons(next); setNewIdx(next.map((_, i) => i).slice(lessons.length)); setLastLesson(fresh[0]); }
      const f = await callAgent({ action: "generate", request, useKnowledge: true, lessons: next });
      setFixed(f);
      setHistory((h) => [...h, { before: blind.score, after: f.score }]);
    } catch (e: any) { setErr(e.message || "could not learn"); }
    finally { setTeaching(false); }
  }

  // Chip opens a PULL REQUEST with the learned rule — a human merges it (the golden gate).
  async function filePR() {
    if (!lastLesson || filing) return;
    setFiling(true); setErr("");
    try {
      const res = await fetch("/api/learn-pr", {
        method: "POST",
        headers: { "content-type": "application/json", "x-aitx-code": "aitx-open-arms" },
        body: JSON.stringify({ rule: lastLesson, request }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "could not open the PR");
      setPrUrl(data.url);
    } catch (e: any) { setErr(e.message || "could not open the PR"); }
    finally { setFiling(false); }
  }

  return (
    <main style={{ background: paper }} className="min-h-screen font-body text-[color:var(--ink)]">
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        {/* nav */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a href="/keynote" className="text-[color:var(--muted)] hover:text-[color:var(--ink)]">← Keynote</a>
          <a href="/platform" className="text-[color:var(--muted)] hover:text-[color:var(--ink)]">The platform</a>
          <a href="/thanks" className="text-[color:var(--muted)] hover:text-[color:var(--ink)]">Thank a sponsor</a>
        </div>

        {/* hero */}
        <div className="mt-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${OR}14`, color: "#c2340a" }}>
            Powered by NVIDIA Nemotron · NIM
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Watch it learn <span style={{ color: OR }}>your voice</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[color:var(--muted)]">
            Give the AITX brand agent a task. Its first instinct will slip off brand. Teach it once, and
            watch it never slip again. Same model, no retraining. The intelligence is what it remembers.
          </p>
        </div>

        {/* input */}
        <div className="mt-8 flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="Ask the agent to write something…"
              className="flex-1 rounded-xl border px-4 py-3 outline-none placeholder:text-[color:var(--muted)]"
              style={{ borderColor: "#e0d6c2", background: "#fffdf9" }}
            />
            <button onClick={() => run()} disabled={busy}
              className="rounded-xl px-6 py-3 font-semibold text-white disabled:opacity-50" style={{ background: OR }}>
              {busy ? "Thinking…" : "Give it a task"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => run(ex)} disabled={busy}
                className="rounded-full border px-3 py-1.5 text-xs text-[color:var(--muted)] hover:text-[color:var(--ink)] disabled:opacity-50"
                style={{ borderColor: "#e0d6c2", background: "#fffdf9" }}>
                {ex}
              </button>
            ))}
          </div>
          {err && <p className="text-sm" style={{ color: RED }}>{err}</p>}
        </div>

        {/* the learning unfold */}
        {(busy || blind) && (
          <div className="mt-8 space-y-4">
            {/* first instinct */}
            <div className="rounded-2xl border p-6" style={{ borderColor: blind?.violations.length ? `${RED}44` : "#e0d6c2", background: "#fffdf9" }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">First instinct · no knowledge yet</span>
                {blind && (
                  blind.violations.length
                    ? <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: `${RED}18`, color: RED }}>off brand</span>
                    : <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: `${GREEN}18`, color: GREEN }}>✓ on brand</span>
                )}
              </div>
              {busy ? <p className="animate-pulse text-[color:var(--muted)]">Nemotron thinking…</p> : blind && <AssetBody asset={blind.asset} />}
              {blind && blind.violations.length > 0 && (
                <div className="mt-4 rounded-xl p-3" style={{ background: `${RED}0d` }}>
                  {blind.violations.map((v, i) => (
                    <div key={i} className="text-sm font-medium" style={{ color: RED }}>
                      {PLAIN[v.rule] || v.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* teach */}
            {blind && blind.violations.length > 0 && !fixed && (
              <div className="flex flex-col items-center gap-2 py-2">
                <button onClick={teach} disabled={teaching}
                  className="rounded-xl px-6 py-3 font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                  style={{ background: OR }}>
                  {teaching ? "Learning from its mistake…" : "⚡ Teach it the rule →"}
                </button>
                <span className="text-xs text-[color:var(--muted)]">It will write the rule itself, remember it, and try again.</span>
              </div>
            )}

            {/* fixed */}
            {fixed && (
              <div className="rounded-2xl border-2 p-6" style={{ borderColor: `${GREEN}66`, background: "#fbfdf7" }}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: GREEN }}>After it learned · same task</span>
                  <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: `${GREEN}18`, color: GREEN }}>✓ on brand</span>
                </div>
                <AssetBody asset={fixed.asset} />
                <p className="mt-3 text-xs text-[color:var(--muted)]">It won't make that mistake again. No retraining.</p>

                {/* make it permanent: Chip opens a PR with the rule; a human merges it */}
                {lastLesson && (
                  <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "#e0d6c2", background: "#fffdf9" }}>
                    {prUrl ? (
                      <p className="text-sm">
                        ✅ Chip opened a pull request with this rule.{" "}
                        <a href={prUrl} target="_blank" rel="noreferrer" className="font-semibold underline" style={{ color: "#c2340a" }}>Review it on GitHub →</a>
                        <span className="mt-1 block text-xs text-[color:var(--muted)]">A human merges it (the golden gate). Then it's version-controlled and every future run obeys it.</span>
                      </p>
                    ) : (
                      <>
                        <button onClick={filePR} disabled={filing}
                          className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" style={{ background: "#24292f" }}>
                          {filing ? "Opening a pull request…" : "⑃ Make it permanent — open a pull request"}
                        </button>
                        <span className="mt-1 block text-xs text-[color:var(--muted)]">Chip proposes the rule as a PR to the brand OS repo. A human merges it. No silent commits.</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* knowledge base + learning stat */}
        <div className="mt-12 grid gap-6 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">What it has learned</h2>
              <span className="text-sm text-[color:var(--muted)]">{lessons.length} rule{lessons.length === 1 ? "" : "s"}</span>
            </div>
            {lessons.length === 0 ? (
              <p className="rounded-2xl border border-dashed p-6 text-[color:var(--muted)]" style={{ borderColor: "#e0d6c2" }}>
                Nothing yet. Give it a task above, then teach it. Its memory grows here, and every future
                task rides on it.
              </p>
            ) : (
              <ul className="space-y-2">
                {lessons.map((l, i) => (
                  <li key={i} className="rounded-xl border p-3 text-sm"
                    style={{ borderColor: newIdx.includes(i) ? `${GREEN}66` : "#e0d6c2", background: newIdx.includes(i) ? "#fbfdf7" : "#fffdf9" }}>
                    {newIdx.includes(i) && (
                      <span className="mr-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ background: GREEN, color: "#fff" }}>just learned</span>
                    )}
                    {l}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg font-bold">The more it runs, the sharper it gets</h2>
            {agg ? (
              <div className="rounded-2xl border p-6" style={{ borderColor: "#e0d6c2", background: "#fffdf9" }}>
                <div className="flex items-end gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[color:var(--muted)]">first instinct</div>
                    <div className="font-display text-3xl font-bold" style={{ color: RED }}>{agg.before}</div>
                  </div>
                  <div className="pb-2 text-[color:var(--muted)]">→</div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[color:var(--muted)]">after learning</div>
                    <div className="font-display text-3xl font-bold" style={{ color: GREEN }}>{agg.after}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[color:var(--muted)]">on-brand score, averaged over {agg.n} task{agg.n === 1 ? "" : "s"}</p>
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed p-6 text-[color:var(--muted)]" style={{ borderColor: "#e0d6c2" }}>
                Run a few tasks to see the before-and-after climb.
              </p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-[color:var(--muted)]">
              Honest note: in this live demo the knowledge base lives in your browser session, so it
              sharpens as you use it and resets on refresh. In the real system these rules are a
              version-controlled file a human blesses and commits, so the whole team&apos;s agent gets
              sharper and you can see every rule it learned as a git diff. No model retraining, ever.
            </p>
          </div>
        </div>

        {/* tie-in */}
        <div className="mt-12 rounded-2xl p-6 text-center" style={{ background: `${OR}0d` }}>
          <p className="text-[color:var(--ink)]">
            This is one capability of a whole <a href="/platform" className="font-semibold" style={{ color: "#c2340a" }}>agentic brand universe</a>.
            Every asset it makes records exactly how it was made.
          </p>
          <a href="/keynote" className="mt-2 inline-block font-body text-sm font-semibold" style={{ color: "#c2340a" }}>See the full story →</a>
        </div>
      </div>
    </main>
  );
}
