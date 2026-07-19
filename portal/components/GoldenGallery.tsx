import { GOLDENS, GOLDEN_CATEGORIES, type Golden } from "@/lib/goldens";

const OR = "#ff4201";

function Card({ g }: { g: Golden }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm" style={{ borderColor: "#e0d6c2" }}>
      {/* uniform image area: fixed height, contained, so every card lines up */}
      <div className="flex h-56 items-center justify-center p-4" style={{ background: "var(--paper)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={g.file} alt={g.name} className="max-h-full max-w-full object-contain" />
      </div>
      {/* caption block, pinned so all cards align even when the image is short */}
      <div className="flex flex-1 flex-col gap-2 border-t p-4" style={{ borderColor: "#eee4d2" }}>
        <div>
          <div className="font-display text-base font-bold leading-tight">{g.name}</div>
          <div className="text-xs uppercase tracking-widest text-[color:var(--muted)]">{g.categoryLabel}</div>
        </div>

        <details className="group mt-auto rounded-lg" >
          <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-widest" style={{ color: "#c2340a" }}>
            <span className="group-open:hidden">+ How it was made</span>
            <span className="hidden group-open:inline">– How it was made</span>
          </summary>
          <div className="mt-2 space-y-2 text-[11px] leading-relaxed text-[color:var(--muted)]">
            <div><span className="font-semibold text-[color:var(--ink)]">model</span> · <span className="font-mono">{g.model}</span>
              {g.params?.size ? <span className="font-mono"> · {String((g.params as Record<string, unknown>).size)}</span> : null}</div>
            <div>
              <span className="font-semibold text-[color:var(--ink)]">references</span>
              <ul className="mt-0.5 list-disc pl-4 font-mono">
                {g.references.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-[color:var(--ink)]">prompt</span>
              <p className="mt-0.5 max-h-40 overflow-auto rounded bg-[color:var(--paper)] p-2 font-mono">{g.prompt}</p>
            </div>
          </div>
        </details>

        <a href={g.file} download className="mt-2 inline-block rounded-md px-3 py-1.5 text-center text-sm font-semibold text-white" style={{ background: OR }}>
          Download
        </a>
      </div>
    </div>
  );
}

export default function GoldenGallery() {
  return (
    <div className="flex flex-col gap-12">
      {GOLDEN_CATEGORIES.map((cat) => {
        const items = GOLDENS.filter((g) => g.category === cat.key);
        if (!items.length) return null;
        return (
          <section key={cat.key} id={cat.key}>
            <h2 className="mb-4 font-display text-2xl font-bold">{cat.label}</h2>
            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((g) => <Card key={g.id} g={g} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
