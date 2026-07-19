"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";

const OR = "#ff4201";
const NV = "#76b900";

// this hackathon's actual sponsors — the demo hook
const SPONSORS = ["NVIDIA", "Antler", "Featherless AI", "Supabase", "Apify", "Red Hat", "HiddenLayer"];

type Card = { title: string; message: string; sponsor: string; score: number };

export default function ThanksPage() {
  const [sponsor, setSponsor] = useState("");
  const [gift, setGift] = useState("");
  const [card, setCard] = useState<Card | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  async function generate(name?: string) {
    const who = (name ?? sponsor).trim();
    if (!who || busy) return;
    setSponsor(who);
    setErr("");
    setBusy(true);
    setCard(null);
    try {
      const res = await fetch("/api/thanks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sponsor: who, gift }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "failed");
      setCard(data);
    } catch (e: any) {
      setErr(e.message || "something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    if (!cardRef.current) return;
    const url = await toPng(cardRef.current, { pixelRatio: 1, cacheBust: true });
    const a = document.createElement("a");
    a.href = url;
    a.download = `aitx-thanks-${(card?.sponsor || "sponsor").toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <a href="/platform" className="text-sm text-neutral-500 hover:text-neutral-300">← The platform</a>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${OR}1f`, color: OR }}>
            Brand OS superpower
          </span>
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${NV}1f`, color: NV }}>
            on-brand deliverables, with soul
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Thank a sponsor</h1>
        <p className="mt-3 max-w-2xl text-neutral-400">
          The agent writes a warm, on-brand thank-you (Nemotron, held to the AITX voice so it never
          reads corporate), ready to send as an intimate voice e-card. Thank the people who showed up
          like you mean it.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto]">
          {/* controls */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {SPONSORS.map((s) => (
                <button
                  key={s}
                  onClick={() => generate(s)}
                  disabled={busy}
                  className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600 hover:text-neutral-100 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              value={sponsor}
              onChange={(e) => setSponsor(e.target.value)}
              placeholder="Sponsor name"
              className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
            />
            <input
              value={gift}
              onChange={(e) => setGift(e.target.value)}
              placeholder="What they gave (optional) — e.g. GPUs and the Nemotron models"
              className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
            />
            <button
              onClick={() => generate()}
              disabled={busy}
              className="rounded-xl px-6 py-3 font-semibold text-neutral-950 disabled:opacity-50"
              style={{ background: NV }}
            >
              {busy ? "Writing…" : "Write the thank-you"}
            </button>
            {err && <p className="text-sm" style={{ color: OR }}>{err}</p>}

            {card && (
              <div className="mt-2 flex flex-col gap-3">
                <div className="flex gap-2">
                  <button onClick={download} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-sm font-semibold hover:border-neutral-500">
                    ↓ Download card
                  </button>
                  <a
                    href="https://blessout.com"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-950"
                    style={{ background: OR }}
                  >
                    Send as a voice e-card (BlessOut) →
                  </a>
                </div>
                <p className="text-xs text-neutral-600">
                  score {card.score}/100 on the brand-voice critic · written by Nemotron
                </p>
              </div>
            )}
          </div>

          {/* the card (true-size 720x900, previewed scaled) */}
          <div className="flex justify-center">
            <div style={{ width: 360, height: 450 }}>
              <div style={{ transform: "scale(0.5)", transformOrigin: "top left" }}>
                <div
                  ref={cardRef}
                  style={{
                    width: 720, height: 900, position: "relative",
                    background: "#fbf5ec", color: "#17130f",
                    padding: 64, display: "flex", flexDirection: "column",
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    boxSizing: "border-box", overflow: "hidden",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 80% at 100% 0%, ${OR}18, transparent 55%)` }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/logo/aitx-mark-transparent.png" alt="AITX" style={{ width: 96, height: "auto", position: "relative" }} />
                  <div style={{ position: "relative", marginTop: 56 }}>
                    <div style={{ fontSize: 20, letterSpacing: "0.18em", textTransform: "uppercase", color: OR, fontWeight: 700 }}>
                      {card ? `To ${card.sponsor}` : "To a sponsor"}
                    </div>
                    <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.05, marginTop: 16, letterSpacing: "-0.02em" }}>
                      {card ? card.title : "Thank you for showing up."}
                    </div>
                    <p style={{ fontSize: 26, lineHeight: 1.45, marginTop: 24, color: "#3a3128" }}>
                      {card
                        ? card.message
                        : "Pick a sponsor and the agent writes a warm, on-brand note here, ready to send with your voice."}
                    </p>
                  </div>
                  <div style={{ position: "relative", marginTop: "auto", fontSize: 22, fontWeight: 700 }}>
                    — The AITX Community
                    <div style={{ fontSize: 15, fontWeight: 500, color: "#6b5d4a", marginTop: 4 }}>
                      it has open arms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-neutral-600">
          The brand OS makes it on-brand. BlessOut makes it intimate: record 20 seconds, mix in music,
          and it arrives as a voice e-card. Nemotron via NIM.
        </p>
      </div>
    </main>
  );
}
