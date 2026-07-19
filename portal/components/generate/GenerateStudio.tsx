"use client";

import { useState } from "react";
import { GEN_KINDS, type GenKind } from "@/lib/generate/types";

export default function GenerateStudio() {
  const [kind, setKind] = useState<GenKind>("sticker");
  const [brief, setBrief] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [img, setImg] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<unknown>(null);

  async function generate() {
    setBusy(true); setErr(null); setImg(null); setRecipe(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json", "x-aitx-code": code },
        body: JSON.stringify({ kind, brief }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Something went wrong."); return; }
      setImg(`data:image/png;base64,${data.imageBase64}`);
      setRecipe(data.recipe);
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm";
  const label = "text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {GEN_KINDS.map((k) => (
            <button key={k.key} type="button" onClick={() => setKind(k.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${kind === k.key ? "bg-[color:var(--orange)] text-white" : "border border-black/15"}`}>
              {k.label}
            </button>
          ))}
        </div>
        <div><div className={label}>Describe it</div>
          <textarea className={input + " min-h-[120px]"} value={brief} placeholder={GEN_KINDS.find((k) => k.key === kind)?.hint}
            onChange={(e) => setBrief(e.target.value)} /></div>
        <div><div className={label}>AITX access code</div>
          <input className={input + " max-w-[260px]"} value={code} onChange={(e) => setCode(e.target.value)} type="password" /></div>
        <div>
          <button type="button" onClick={generate} disabled={busy || !brief.trim() || !code}
            className="rounded-md bg-[color:var(--orange)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--orange-deep)] disabled:opacity-60">
            {busy ? "Generating (about 40 seconds)..." : "Generate"}
          </button>
          {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex aspect-square items-center justify-center rounded-lg border border-black/10 bg-[color:var(--paper)]">
          {busy ? <span className="text-sm text-[color:var(--muted)]">Composing an on-brand asset...</span>
            : img ? <img src={img} alt="Generated AITX asset" className="max-h-full max-w-full rounded-md" />
            : <span className="text-sm text-[color:var(--muted)]">Your asset will appear here.</span>}
        </div>
        {img ? (
          <div className="flex flex-col gap-2">
            <a href={img} download={`aitx-${kind}.png`} className="inline-block rounded-md bg-[color:var(--orange)] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[color:var(--orange-deep)]">Download PNG</a>
            <details className="text-sm text-[color:var(--muted)]">
              <summary className="cursor-pointer">How it was made</summary>
              <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-black/5 p-3 text-xs">{JSON.stringify(recipe, null, 2)}</pre>
            </details>
          </div>
        ) : null}
      </div>
    </div>
  );
}
