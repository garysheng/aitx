// Conceptual graphics for the keynote's otherwise text-heavy slides. Warm AITX
// palette, inline SVG so they stay crisp and theme-consistent. Each is sized to
// sit in the right column of a two-column slide (stacks under the text on mobile).

const OR = "#ff4201";
const ORD = "#c2340a";
const INK = "#241c15";
const MUTED = "#9a8d78";
const LINE = "#e2d8c4";
const GOLD = "#e0a11a";

/* Slide 2 — "are you actually maximizing it?" a capability meter. */
export function MaximizeMeter() {
  const Row = ({ label, pct, on }: { label: string; pct: number; on?: boolean }) => (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-body text-sm font-semibold" style={{ color: on ? ORD : MUTED }}>{label}</span>
        <span className="font-body text-xs tabular-nums" style={{ color: on ? OR : MUTED }}>
          {on ? "maximized" : `~${pct}% of the value`}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: "#ece2cf" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: on ? `linear-gradient(90deg, ${OR}, ${ORD})` : "#c9bca4" }} />
      </div>
    </div>
  );
  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: LINE, background: "#fffdf8" }}>
      <div className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: MUTED }}>
        The same models, two outcomes
      </div>
      <div className="flex flex-col gap-5">
        <Row label="Prompting like a faster intern" pct={12} />
        <Row label="Running a brand universe" pct={100} on />
      </div>
    </div>
  );
}

/* Slide 3 — additive vs multiplicative, a compounding curve. */
export function AdditiveVsMultiplicative() {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: LINE, background: "#fffdf8" }}>
      <svg viewBox="0 0 340 220" className="w-full" role="img" aria-label="Chart: additive prompting stays flat while a brand universe compounds upward.">
        <line x1="38" y1="18" x2="38" y2="184" stroke={LINE} strokeWidth="1.5" />
        <line x1="38" y1="184" x2="320" y2="184" stroke={LINE} strokeWidth="1.5" />
        <text x="38" y="202" fill={MUTED} fontFamily="ui-sans-serif" fontSize="10">assets made over time →</text>
        <text x="14" y="20" fill={MUTED} fontFamily="ui-sans-serif" fontSize="10" transform="rotate(-90 14 20)" textAnchor="end">brand value →</text>
        <defs>
          <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={OR} stopOpacity="0.26" />
            <stop offset="1" stopColor={OR} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* multiplicative */}
        <path d="M38 166 C 120 158, 176 118, 216 86 S 300 34, 320 26 L320 184 L38 184 Z" fill="url(#mg)" />
        <path d="M38 166 C 120 158, 176 118, 216 86 S 300 34, 320 26" fill="none" stroke={OR} strokeWidth="3" strokeLinecap="round" />
        {/* additive */}
        <path d="M38 168 C 120 162, 220 158, 320 150" fill="none" stroke="#bcae94" strokeWidth="2.4" strokeDasharray="5 4" strokeLinecap="round" />
        <circle cx="320" cy="26" r="4" fill={OR} />
        <circle cx="320" cy="150" r="4" fill="#bcae94" />
        <text x="314" y="20" fill={ORD} fontFamily="ui-sans-serif" fontSize="10.5" fontWeight="700" textAnchor="end">multiplicative</text>
        <text x="314" y="166" fill={MUTED} fontFamily="ui-sans-serif" fontSize="10.5" textAnchor="end">additive</text>
      </svg>
      <div className="mt-1 flex flex-wrap gap-4 px-1 font-body text-xs" style={{ color: MUTED }}>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-[3px] w-4 rounded" style={{ background: OR }} /> a universe: every asset compounds</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-[3px] w-4 rounded" style={{ background: "#bcae94" }} /> one-off prompts: flat, and drifting</span>
      </div>
    </div>
  );
}

/* Slide 6 — taste is discovered: you try many, you bless the few that land. */
export function TryAndBless() {
  // 12 tiles; three are golden.
  const golden = new Set([2, 5, 10]);
  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: LINE, background: "#fffdf8" }}>
      <div className="grid grid-cols-4 gap-2.5">
        {Array.from({ length: 12 }).map((_, i) => {
          const g = golden.has(i);
          return (
            <div key={i} className="relative aspect-square rounded-lg"
              style={{
                background: g ? "#fff4e2" : "#efe7d6",
                border: g ? `2px solid ${OR}` : `1px solid ${LINE}`,
                boxShadow: g ? `0 6px 16px -6px ${OR}66` : "none",
              }}>
              {g && <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full text-[10px]" style={{ background: OR, color: "#fff" }}>★</span>}
              {!g && <span className="absolute inset-0 grid place-items-center text-lg" style={{ color: "#cabfa6" }}>✕</span>}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between font-body text-xs" style={{ color: MUTED }}>
        <span>you try a lot</span>
        <span className="font-semibold" style={{ color: ORD }}>★ you keep the few that land</span>
      </div>
    </div>
  );
}

/* Slide 9 — one golden recipe, many on-brand assets (real AITX flyers). */
export function RecipeToMany() {
  const outs = [
    { src: "/assets/goldens/flyers-hackathon.jpg", v: "Hackathon · Austin" },
    { src: "/assets/goldens/flyers-monthly-meetup.jpg", v: "Monthly meetup" },
    { src: "/assets/goldens/flyers-remotion-meetup-square.jpg", v: "Remotion night" },
  ];
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: LINE, background: "#fffdf8" }}>
      <div className="flex items-center gap-4">
        <div className="w-[38%] shrink-0">
          <div className="relative overflow-hidden rounded-xl border" style={{ borderColor: OR }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/goldens/flyers-hackathon.jpg" alt="A golden flyer recipe" className="aspect-[3/4] w-full object-cover object-top" />
            <span className="absolute right-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: GOLD, color: "#241206" }}>★ golden recipe</span>
          </div>
          <div className="mt-2 text-center font-body text-[11px]" style={{ color: MUTED }}>get one right, keep the recipe</div>
        </div>
        <div className="grid shrink-0 place-items-center" style={{ color: MUTED }}>
          <div className="font-body text-2xl" style={{ color: OR }}>→</div>
          <div className="max-w-[4.5rem] text-center font-body text-[10px] leading-tight">change the variables</div>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2">
          {outs.map((o) => (
            <div key={o.v}>
              <div className="overflow-hidden rounded-lg border" style={{ borderColor: LINE }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.src} alt={o.v} className="aspect-[3/4] w-full object-cover object-top" />
              </div>
              <div className="mt-1 text-center font-body text-[10px] leading-tight" style={{ color: MUTED }}>{o.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 border-t pt-3 text-center font-body text-xs" style={{ borderColor: LINE, color: ORD }}>
        every new golden adds a repeatable capability to the brand
      </div>
    </div>
  );
}

/* Slide 15 — version control your brand DNA: an edit propagates forward. */
export function BrandDNA() {
  const Node = ({ label, on, sub }: { label: string; on?: boolean; sub?: string }) => (
    <div className="flex items-center gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold"
        style={{ background: on ? OR : "#efe7d6", color: on ? "#fff" : MUTED, border: on ? "none" : `1px solid ${LINE}` }}>
        {on ? "✎" : "●"}
      </span>
      <div>
        <div className="font-mono text-sm" style={{ color: on ? ORD : INK }}>{label}</div>
        {sub && <div className="font-body text-xs" style={{ color: MUTED }}>{sub}</div>}
      </div>
    </div>
  );
  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: LINE, background: "#fffdf8" }}>
      <div className="relative flex flex-col gap-4 pl-[13px]">
        <span className="absolute bottom-3 left-[13px] top-3 w-px" style={{ background: LINE }} />
        <div className="relative"><Node label="v1  brand DNA" sub="canon, goldens, rules" /></div>
        <div className="relative"><Node label="v2  edit one rule" on sub={'"warmer, plainer voice. no em dashes."'} /></div>
        <div className="relative"><Node label="v3  every future asset inherits it" sub="flyers, memes, merch, thank-yous" /></div>
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-xl px-3 py-2 font-body text-xs" style={{ background: "#fff4e2", color: ORD }}>
        <span>↺</span> it even learns rules from its own mistakes, so it sharpens the more you use it
      </div>
    </div>
  );
}
