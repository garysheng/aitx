# AITX Flyer Studio (portal Stage 2a) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A client-side flyer studio in the AITX Brand OS portal: fill a form, see a live on-brand AITX event flyer, download a crisp PNG. Deterministic, instant, no server, no API key.

**Architecture:** A pure `FlyerLayout` React component (brand tokens, plain `<img>` mark) rendered at true pixel size (1080 square / 1200x630 wide). A `FlyerStudio` client component shows a form + a CSS-scaled live preview of that true-size node and captures it to PNG with `html-to-image`. zod validates inputs. Route `/studio/flyer` in the existing `portal/` Next.js app; a nav link from the home page.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, TypeScript, zod, html-to-image. Node test runner via tsx for pure logic.

**Scope note:** Stage 2a of the AITX Studio spec (`docs/superpowers/specs/2026-07-19-aitx-studio-generate.md`). Server-side AI generate (2b) and auth (2c) are follow-on plans.

## Global Constraints

- Lives in the existing `portal/` app (Next.js 16.2.10, React 19.2.4, Tailwind v4). Deploys to Vercel `aitx-brand-os` on `git push` (already git-linked, root `portal/`).
- AITX palette: orange `#ff4201`, ink `#0e0c0b`, paper `#fbf5ec`, muted `#6b5d4a`, white `#ffffff`. Display font stack `"Helvetica Neue", "Arial Narrow", Helvetica, Arial, sans-serif`; body system sans. These MATCH `generator/flyer-remotion/src/brand.ts` (keep in sync).
- The mark is `/assets/logo/aitx-mark-transparent.png` (transparent ground, already created).
- No em dashes in user-facing copy.
- Flyer output sizes: square 1080x1080, wide 1200x630. PNG export at pixelRatio 2.
- UI verified via `npm run build` + browser; pure logic (schema/filename) has a unit test.

---

### Task 1: Flyer brand tokens + zod schema + test

**Files:**
- Create: `portal/lib/flyer/brand.ts`, `portal/lib/flyer/schema.ts`, `portal/lib/flyer/schema.test.ts`

**Interfaces:**
- Produces:
  - `brand.ts`: `FLYER_COLORS` (orange/orangeDeep/ink/paper/muted/white), `FLYER_FONTS` (display/body), `FLYER_MARK` (`/assets/logo/aitx-mark-transparent.png`), `FLYER_BRAND_VERSION` (`"0.1.0"`)
  - `schema.ts`: `flyerSchema` (zod), `type FlyerValues = z.infer<typeof flyerSchema>`, `FLYER_SIZES` (`{ square: {w:1080,h:1080}, wide: {w:1200,h:630} }`), `type FlyerSizeKey = keyof typeof FLYER_SIZES`, `flyerFilename(values, sizeKey): string`, `DEFAULT_FLYER: FlyerValues`

- [ ] **Step 1: Write `portal/lib/flyer/brand.ts`**

```ts
export const FLYER_BRAND_VERSION = "0.1.0";
export const FLYER_COLORS = {
  orange: "#ff4201",
  orangeDeep: "#c2340a",
  ink: "#0e0c0b",
  paper: "#fbf5ec",
  muted: "#6b5d4a",
  white: "#ffffff",
};
export const FLYER_FONTS = {
  display: '"Helvetica Neue", "Arial Narrow", Helvetica, Arial, sans-serif',
  body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};
export const FLYER_MARK = "/assets/logo/aitx-mark-transparent.png";
```

- [ ] **Step 2: Write `portal/lib/flyer/schema.ts`**

```ts
import { z } from "zod";

export const flyerSchema = z.object({
  kind: z.enum(["hackathon", "meetup"]).default("meetup"),
  eventTitle: z.string().min(1).default("AITX Monthly Meetup"),
  subhead: z.string().default("Austin's AI builder community."),
  dateLine: z.string().default("Third Thursday, 6:00 PM"),
  venueLine: z.string().default("Antler, Austin, TX"),
  registerLine: z.string().default("Register on Luma"),
  sponsors: z.array(z.string()).default([]),
});

export type FlyerValues = z.infer<typeof flyerSchema>;

export const FLYER_SIZES = {
  square: { w: 1080, h: 1080, label: "Square 1080" },
  wide: { w: 1200, h: 630, label: "Wide 1200x630" },
} as const;
export type FlyerSizeKey = keyof typeof FLYER_SIZES;

export const DEFAULT_FLYER: FlyerValues = flyerSchema.parse({});

export function flyerFilename(values: FlyerValues, sizeKey: FlyerSizeKey): string {
  const slug = values.eventTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "aitx-flyer";
  return `aitx-${slug}-${sizeKey}.png`;
}
```

- [ ] **Step 3: Write the failing test `portal/lib/flyer/schema.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { flyerSchema, DEFAULT_FLYER, flyerFilename } from "./schema.ts";

test("schema fills sensible defaults", () => {
  const v = flyerSchema.parse({});
  assert.equal(v.kind, "meetup");
  assert.equal(v.eventTitle, "AITX Monthly Meetup");
  assert.deepEqual(v.sponsors, []);
});

test("schema keeps provided values", () => {
  const v = flyerSchema.parse({ kind: "hackathon", eventTitle: "AITX Hackathon", sponsors: ["NVIDIA"] });
  assert.equal(v.kind, "hackathon");
  assert.equal(v.eventTitle, "AITX Hackathon");
  assert.deepEqual(v.sponsors, ["NVIDIA"]);
});

test("flyerFilename slugifies the title and includes the size", () => {
  assert.equal(flyerFilename({ ...DEFAULT_FLYER, eventTitle: "AITX Hackathon!" }, "wide"), "aitx-aitx-hackathon-wide.png");
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `cd portal && npm test`
Expected: FAIL (cannot find `./schema.ts` until Step 2 exists; if Step 2 already written, this test passes — that is fine, the RED here is the missing-module state before Step 2).

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd portal && npm test`
Expected: PASS (existing brand.test.ts + these 3). Output pristine.

- [ ] **Step 6: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/lib/flyer/brand.ts portal/lib/flyer/schema.ts portal/lib/flyer/schema.test.ts
git commit -m "portal/flyer: brand tokens + zod schema + filename helper"
```

---

### Task 2: FlyerLayout (pure, renderer-agnostic)

**Files:**
- Create: `portal/components/flyer/FlyerLayout.tsx`

**Interfaces:**
- Consumes: `FLYER_COLORS`, `FLYER_FONTS`, `FLYER_MARK` from `@/lib/flyer/brand`; `FlyerValues` from `@/lib/flyer/schema`.
- Produces: `FlyerLayout({ width, height, values }: { width: number; height: number; values: FlyerValues })` — renders the flyer at EXACT `width`x`height` pixels.

- [ ] **Step 1: Write `portal/components/flyer/FlyerLayout.tsx`**

```tsx
import type { CSSProperties } from "react";
import { FLYER_COLORS as C, FLYER_FONTS as F, FLYER_MARK } from "@/lib/flyer/brand";
import type { FlyerValues } from "@/lib/flyer/schema";

function Detail({ label, value, s }: { label: string; value: string; s: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 * s }}>
      <span style={{ fontSize: 11 * s, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.55 }}>{label}</span>
      <span style={{ fontSize: 20 * s, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default function FlyerLayout({ width, height, values }: { width: number; height: number; values: FlyerValues }) {
  const { eventTitle, subhead, dateLine, venueLine, registerLine, sponsors } = values;
  const wide = width / height > 1.4;
  const s = width / 1080;
  const pad = Math.round(width * (wide ? 0.05 : 0.075));
  const titleSize = Math.round(width * (wide ? 0.08 : 0.135));

  const root: CSSProperties = {
    width, height, position: "relative", overflow: "hidden",
    background: C.paper, color: C.ink, fontFamily: F.body,
    padding: pad, display: "flex", flexDirection: "column", justifyContent: "space-between",
    boxSizing: "border-box",
  };

  return (
    <div style={root}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(130% 90% at 100% 0%, ${C.orange}22, transparent 55%)` }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={FLYER_MARK} alt="AITX" style={{ height: Math.round(width * 0.06), width: "auto" }} />
      </div>
      <div style={{ position: "relative", maxWidth: wide ? "62%" : "100%" }}>
        <div style={{ fontFamily: F.display, fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 0.9, fontSize: titleSize, color: C.orange }}>
          {eventTitle}
        </div>
        {subhead ? <div style={{ marginTop: 18 * s, fontSize: Math.round(width * 0.03), color: C.muted, maxWidth: "24ch", lineHeight: 1.35 }}>{subhead}</div> : null}
      </div>
      <div style={{ position: "relative", background: C.ink, color: C.white, borderRadius: 16 * s, padding: `${Math.round(pad * 0.55)}px ${Math.round(pad * 0.6)}px`, display: "flex", flexDirection: wide ? "row" : "column", gap: 18 * s, alignItems: wide ? "center" : "stretch", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 34 * s, flexWrap: "wrap" }}>
          <Detail label="When" value={dateLine} s={s} />
          <Detail label="Where" value={venueLine} s={s} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: wide ? "flex-end" : "flex-start" }}>
          <span style={{ background: C.orange, color: C.white, fontWeight: 700, padding: `${12 * s}px ${22 * s}px`, borderRadius: 999, fontSize: Math.round(width * 0.024), whiteSpace: "nowrap" }}>{registerLine}</span>
        </div>
      </div>
      {sponsors.length > 0 ? (
        <div style={{ position: "relative", display: "flex", gap: 12 * s, alignItems: "center", color: C.muted, fontSize: Math.round(width * 0.017), textTransform: "uppercase", letterSpacing: "0.16em" }}>
          <span style={{ opacity: 0.6 }}>Backed by</span>
          <span style={{ fontWeight: 600, color: C.ink }}>{sponsors.join("   ·   ")}</span>
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles (temporary render + build)**

Temporarily import and render `<FlyerLayout width={1080} height={1080} values={DEFAULT_FLYER} />` in `app/page.tsx` (revert after), then:
```bash
cd portal && npm run build
```
Expected: build succeeds. Revert the temporary edit.

- [ ] **Step 3: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/components/flyer/FlyerLayout.tsx
git commit -m "portal/flyer: FlyerLayout pure component (true-size render)"
```

---

### Task 3: FlyerStudio (form + scaled preview + PNG download)

**Files:**
- Modify: `portal/package.json` (add `html-to-image`)
- Create: `portal/components/flyer/FlyerStudio.tsx`

**Interfaces:**
- Consumes: `FlyerLayout`, `flyerSchema`, `DEFAULT_FLYER`, `FLYER_SIZES`, `flyerFilename`.
- Produces: `<FlyerStudio />` (default export, `"use client"`).

- [ ] **Step 1: Add html-to-image**

```bash
cd portal && npm install html-to-image@^1.11.13
```

- [ ] **Step 2: Write `portal/components/flyer/FlyerStudio.tsx`**

```tsx
"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import FlyerLayout from "./FlyerLayout";
import { DEFAULT_FLYER, FLYER_SIZES, flyerFilename, type FlyerSizeKey, type FlyerValues } from "@/lib/flyer/schema";

const PREVIEW_W = 460;

export default function FlyerStudio() {
  const [values, setValues] = useState<FlyerValues>(DEFAULT_FLYER);
  const [sizeKey, setSizeKey] = useState<FlyerSizeKey>("square");
  const [busy, setBusy] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const size = FLYER_SIZES[sizeKey];
  const scale = PREVIEW_W / size.w;

  function set<K extends keyof FlyerValues>(key: K, v: FlyerValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function download() {
    if (!captureRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(captureRef.current, { pixelRatio: 2, width: size.w, height: size.h, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = flyerFilename(values, sizeKey);
      a.click();
    } finally {
      setBusy(false);
    }
  }

  const input = "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm";
  const label = "text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
      {/* form */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {(["meetup", "hackathon"] as const).map((k) => (
            <button key={k} type="button" onClick={() => set("kind", k)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold ${values.kind === k ? "bg-[color:var(--orange)] text-white" : "border border-black/15"}`}>
              {k === "meetup" ? "Meetup" : "Hackathon"}
            </button>
          ))}
        </div>
        <div><div className={label}>Event title</div><input className={input} value={values.eventTitle} onChange={(e) => set("eventTitle", e.target.value)} /></div>
        <div><div className={label}>Subhead</div><input className={input} value={values.subhead} onChange={(e) => set("subhead", e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><div className={label}>When</div><input className={input} value={values.dateLine} onChange={(e) => set("dateLine", e.target.value)} /></div>
          <div><div className={label}>Where</div><input className={input} value={values.venueLine} onChange={(e) => set("venueLine", e.target.value)} /></div>
        </div>
        <div><div className={label}>Register line</div><input className={input} value={values.registerLine} onChange={(e) => set("registerLine", e.target.value)} /></div>
        <div><div className={label}>Sponsors (comma-separated)</div>
          <input className={input} value={values.sponsors.join(", ")} onChange={(e) => set("sponsors", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} /></div>
        <div className="flex items-center gap-3 pt-1">
          <select className={input + " max-w-[180px]"} value={sizeKey} onChange={(e) => setSizeKey(e.target.value as FlyerSizeKey)}>
            {Object.entries(FLYER_SIZES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button type="button" onClick={download} disabled={busy}
            className="rounded-md bg-[color:var(--orange)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--orange-deep)] disabled:opacity-60">
            {busy ? "Rendering..." : "Download PNG"}
          </button>
        </div>
      </div>

      {/* live preview (CSS-scaled; the captured node is true size) */}
      <div className="lg:justify-self-end">
        <div style={{ width: PREVIEW_W, height: size.h * scale, overflow: "hidden", borderRadius: 10, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: size.w, height: size.h }}>
            <div ref={captureRef}>
              <FlyerLayout width={size.w} height={size.h} values={values} />
            </div>
          </div>
        </div>
        <p className="mt-3 max-w-[460px] text-xs text-[color:var(--muted)]">Rendered from code and your inputs. Same inputs give the same flyer, every time.</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build to verify it compiles**

```bash
cd portal && npm run build
```
Expected: build succeeds (FlyerStudio is a client component; it is not imported by a page yet, so this mainly checks types — Task 4 wires the route).

- [ ] **Step 4: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/package.json portal/package-lock.json portal/components/flyer/FlyerStudio.tsx
git commit -m "portal/flyer: FlyerStudio (form + live preview + PNG download)"
```

---

### Task 4: Route + home nav + verify in browser

**Files:**
- Create: `portal/app/studio/flyer/page.tsx`
- Modify: `portal/app/page.tsx` (add a link to the studio)

**Interfaces:** Produces the `/studio/flyer` route and a discoverable link from home.

- [ ] **Step 1: Write `portal/app/studio/flyer/page.tsx`**

```tsx
import FlyerStudio from "@/components/flyer/FlyerStudio";

export const metadata = {
  title: "AITX Flyer Studio",
  description: "Make an on-brand AITX event flyer in seconds. Fill the form, download the PNG.",
};

export default function FlyerStudioPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-8 flex flex-col gap-2">
        <a href="/" className="text-sm text-[color:var(--orange-deep)] hover:underline">← Brand OS</a>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Flyer Studio</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Fill in your event and download a crisp, on-brand AITX flyer. It renders from code, so it is always on brand and reproducible.</p>
      </header>
      <FlyerStudio />
    </main>
  );
}
```

- [ ] **Step 2: Add a link from the home hero in `portal/app/page.tsx`**

Find the `<nav>` block in the header (the category links) and add, immediately before it, a call-to-action link:

```tsx
        <div className="mt-2">
          <a href="/studio/flyer" className="inline-block rounded-md bg-[color:var(--orange)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--orange-deep)]">Open the Flyer Studio →</a>
        </div>
```

- [ ] **Step 3: Build + local browser verify**

```bash
cd portal && npm run build && (PORT=3600 npm run start &) && sleep 4 && curl -s -o /dev/null -w "home %{http_code}\n" http://localhost:3600/ && curl -s -o /dev/null -w "studio %{http_code}\n" http://localhost:3600/studio/flyer
```
Expected: both `200`. Open `http://localhost:3600/studio/flyer`: the form + live preview render, editing a field updates the preview, changing size switches square/wide, and Download PNG saves a crisp flyer. Kill the server (`lsof -ti tcp:3600 | xargs kill -9`).

- [ ] **Step 4: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/app/studio portal/app/page.tsx
git commit -m "portal/flyer: /studio/flyer route + home CTA"
```

---

### Task 5: Ship (push -> auto-deploy) + live verify

**Files:** none.

**Interfaces:** the studio is live at `https://aitx-brand-os.vercel.app/studio/flyer`.

- [ ] **Step 1: Push**

```bash
cd /Users/garysheng/Documents/github-repos/aitx && git push origin master
```

- [ ] **Step 2: Verify live (after the Vercel build finishes, ~1-2 min)**

```bash
curl -s -o /dev/null -w "studio %{http_code}\n" https://aitx-brand-os.vercel.app/studio/flyer
curl -s -o /dev/null -w "mark %{http_code}\n" https://aitx-brand-os.vercel.app/assets/logo/aitx-mark-transparent.png
```
Expected: both `200`. Then open the live URL in a browser and confirm the form, live preview, size toggle, and Download PNG all work.

---

## Self-Review

**Spec coverage (Stage 2a):**
- Client-side flyer studio, form + live preview + PNG download → Tasks 2, 3, 4 ✓
- zod-validated inputs, deterministic (inputs are the recipe) → Task 1 ✓
- Shared brand tokens matching the Remotion template → Task 1 (values copied, noted) ✓
- Route in the portal + discoverable + deployed → Tasks 4, 5 ✓
- No auth / no API / no cost (free client-side) → whole plan ✓

**Placeholder scan:** none — every step has concrete code/commands.

**Type consistency:** `FlyerValues`, `FlyerSizeKey`, `FLYER_SIZES`, `DEFAULT_FLYER`, `flyerFilename` defined in Task 1 and consumed unchanged in Tasks 2-4. `FlyerLayout({width,height,values})` signature stable across Tasks 2-3.
