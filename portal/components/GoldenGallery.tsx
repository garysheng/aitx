"use client";

import { useState } from "react";
import { GOLDENS, GOLDEN_CATEGORIES, type Golden } from "@/lib/goldens";

const OR = "#ff4201";

function Card({ g, onInspect }: { g: Golden; onInspect: (g: Golden) => void }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm" style={{ borderColor: "#e0d6c2" }}>
      <div className="flex h-56 items-center justify-center p-4" style={{ background: "var(--paper)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={g.file} alt={g.name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t p-4" style={{ borderColor: "#eee4d2" }}>
        <div>
          <div className="font-display text-base font-bold leading-tight">{g.name}</div>
          <div className="text-xs uppercase tracking-widest text-[color:var(--muted)]">{g.categoryLabel}</div>
        </div>
        <button onClick={() => onInspect(g)} className="mt-auto text-left text-xs font-semibold uppercase tracking-widest" style={{ color: "#c2340a" }}>
          How it was made →
        </button>
        <a href={g.file} download className="mt-1 inline-block rounded-md px-3 py-1.5 text-center text-sm font-semibold text-white" style={{ background: OR }}>
          Download
        </a>
      </div>
    </div>
  );
}

function Drawer({ g, onClose }: { g: Golden | null; onClose: () => void }) {
  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-300"
        style={{ opacity: g ? 1 : 0, pointerEvents: g ? "auto" : "none" }}
      />
      {/* panel */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[color:var(--paper)] shadow-2xl transition-transform duration-300"
        style={{ transform: g ? "translateX(0)" : "translateX(100%)" }}
        aria-hidden={!g}
      >
        {g && (
          <>
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "#e0d6c2" }}>
              <div>
                <div className="font-display text-lg font-bold">{g.name}</div>
                <div className="text-xs uppercase tracking-widest text-[color:var(--muted)]">{g.categoryLabel} · provenance</div>
              </div>
              <button onClick={onClose} className="rounded-full px-3 py-1 text-xl text-[color:var(--muted)] hover:text-[color:var(--ink)]" aria-label="Close">×</button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="mb-5 flex items-center justify-center rounded-xl border bg-white p-4" style={{ borderColor: "#e0d6c2" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.file} alt={g.name} className="max-h-56 max-w-full object-contain" />
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">Model</div>
                  <div className="mt-1 font-mono text-[color:var(--ink)]">{g.model}{g.params?.size ? ` · ${String((g.params as Record<string, unknown>).size)}` : ""}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">References (pinned by hash)</div>
                  <ul className="mt-1 list-disc pl-5 font-mono text-[13px] text-[color:var(--ink)]">
                    {g.references.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--muted)]">Exact prompt</div>
                  <p className="mt-1 whitespace-pre-wrap rounded-lg border bg-white p-3 font-mono text-[12px] leading-relaxed text-[color:var(--ink)]" style={{ borderColor: "#e0d6c2" }}>
                    {g.prompt}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t px-5 py-4" style={{ borderColor: "#e0d6c2" }}>
              <a href={g.file} download className="block rounded-md px-4 py-2.5 text-center text-sm font-semibold text-white" style={{ background: OR }}>
                Download this golden
              </a>
              <p className="mt-2 text-center text-[11px] text-[color:var(--muted)]">Reproducible: same recipe rebuilds this asset.</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default function GoldenGallery() {
  const [active, setActive] = useState<Golden | null>(null);
  return (
    <>
      <div className="flex flex-col gap-12">
        {GOLDEN_CATEGORIES.map((cat) => {
          const items = GOLDENS.filter((g) => g.category === cat.key);
          if (!items.length) return null;
          return (
            <section key={cat.key} id={cat.key}>
              <h2 className="mb-4 font-display text-2xl font-bold">{cat.label}</h2>
              <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((g) => <Card key={g.id} g={g} onInspect={setActive} />)}
              </div>
            </section>
          );
        })}
      </div>
      <Drawer g={active} onClose={() => setActive(null)} />
    </>
  );
}
