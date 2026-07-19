"use client";

import { useState } from "react";
import { CHARACTERS, TEMPLATES, type CharId } from "@/lib/memes/templates";

const OR = "#ff4201";

export default function MemeStudio() {
  const [code, setCode] = useState("aitx-open-arms");
  const [cast, setCast] = useState<CharId[]>(["michael"]);
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [caption, setCaption] = useState(TEMPLATES[0].defaultCaption);
  const [img, setImg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const template = TEMPLATES.find((t) => t.id === templateId)!;

  const toggle = (id: CharId) =>
    setCast((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const pickTemplate = (id: string) => {
    setTemplateId(id);
    setCaption(TEMPLATES.find((t) => t.id === id)!.defaultCaption);
  };

  async function generate() {
    if (busy) return;
    if (cast.length === 0) { setErr("Pick at least one character."); return; }
    setErr(""); setBusy(true); setImg(null);
    try {
      const res = await fetch("/api/meme", {
        method: "POST",
        headers: { "content-type": "application/json", "x-aitx-code": code },
        body: JSON.stringify({ templateId, cast, caption }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "failed");
      setImg(`data:image/png;base64,${data.imageBase64}`);
    } catch (e: any) { setErr(e.message || "something went wrong"); }
    finally { setBusy(false); }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* controls */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">1 · Cast</div>
          <div className="flex flex-wrap gap-2">
            {CHARACTERS.map((c) => {
              const on = cast.includes(c.id);
              return (
                <button key={c.id} onClick={() => toggle(c.id)}
                  className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition"
                  style={{ borderColor: on ? OR : "#e0d6c2", background: on ? `${OR}14` : "#fffdf9", color: on ? "#c2340a" : "var(--ink)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.asset} alt={c.name} className="h-6 w-6 rounded-full object-cover object-top" />
                  {c.name}{on ? " ✓" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">2 · Template</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TEMPLATES.map((t) => {
              const on = t.id === templateId;
              return (
                <button key={t.id} onClick={() => pickTemplate(t.id)}
                  className="rounded-xl border p-3 text-left transition"
                  style={{ borderColor: on ? OR : "#e0d6c2", background: on ? `${OR}0d` : "#fffdf9" }}>
                  <div className="text-lg">{t.emoji}</div>
                  <div className="text-sm font-semibold">{t.title}</div>
                  <div className="text-[11px] text-[color:var(--muted)]">{t.blurb}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">3 · {template.captionLabel}</div>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={120}
            className="w-full rounded-xl border px-4 py-3 outline-none" style={{ borderColor: "#e0d6c2", background: "#fffdf9" }} />
        </div>

        <div className="flex items-center gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="access code"
            className="w-40 rounded-xl border px-3 py-2 text-sm outline-none" style={{ borderColor: "#e0d6c2", background: "#fffdf9" }} />
          <button onClick={generate} disabled={busy}
            className="flex-1 rounded-xl px-6 py-3 font-semibold text-white disabled:opacity-50" style={{ background: OR }}>
            {busy ? "Cooking the meme…" : "Generate meme"}
          </button>
        </div>
        {err && <p className="text-sm" style={{ color: "#c2340a" }}>{err}</p>}
      </div>

      {/* output */}
      <div className="flex flex-col items-center justify-center rounded-2xl border p-5" style={{ borderColor: "#e0d6c2", background: "#f2ead9", minHeight: 360 }}>
        {busy ? (
          <p className="animate-pulse text-[color:var(--muted)]">gpt-image-2 is drawing…</p>
        ) : img ? (
          <div className="flex w-full flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="Your AITX meme" className="w-full max-w-[420px] rounded-xl shadow-md" />
            <a href={img} download="aitx-meme.png" className="rounded-xl border px-4 py-2 text-sm font-semibold hover:border-neutral-500" style={{ borderColor: "#c9bda3" }}>
              ↓ Download
            </a>
          </div>
        ) : (
          <p className="text-center text-[color:var(--muted)]">Pick your cast, a template, and a caption. Your meme shows up here.</p>
        )}
      </div>
    </div>
  );
}
