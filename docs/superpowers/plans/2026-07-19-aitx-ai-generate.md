# AITX Studio — AI Generate (portal Stage 2b) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An AI generate page in the AITX Brand OS portal: pick an asset type (sticker / meme / product / social), describe it, and a server route composes an on-brand prompt, passes the AITX atoms to gpt-image-2, and returns the image plus a provenance recipe. Gated behind a shared access code so the paid endpoint is not open to the internet.

**Architecture:** A Next.js Node API route (`/api/generate`) checks an access code, builds a prompt from a typed template, fetches the atom reference images from the app's own origin, calls the `openai` SDK `images.edit` (gpt-image-2), and returns `{ imageBase64, recipe }`. A client component (`/studio/create`) collects the request, shows a ~40s pending state, and renders the result with download + a "how it was made" recipe view. No git writes (download-only). Auth (Firebase) is Stage 2c; this stage uses a shared code.

**Tech Stack:** Next.js 16 (Node runtime route, `maxDuration`), React 19, Tailwind v4, TypeScript, `openai` SDK. Deploys to Vercel `aitx-brand-os`.

**Scope note:** Stage 2b of the AITX Studio spec (`docs/superpowers/specs/2026-07-19-aitx-studio-generate.md`). Firebase auth + roles is Stage 2c and replaces the access-code gate.

## Global Constraints

- Lives in `portal/` (Next 16.2.10, React 19.2.4, Tailwind v4). Deploys to Vercel `aitx-brand-os` on push.
- SECRETS: never write `OPENAI_API_KEY` or the access code as a literal in any committed file or echoed command. The route reads `process.env.OPENAI_API_KEY` and `process.env.AITX_GENERATE_CODE`. Vercel envs are set by piping from the local shell env (`printf '%s' "$OPENAI_API_KEY" | npx vercel env add ...`), never by typing the value.
- Image model id: `gpt-image-2`. AITX mark reference always passed. Palette orange #ff4201.
- The route is `runtime = "nodejs"`, `maxDuration = 300`, `dynamic = "force-dynamic"`.
- Atom images are fetched from the app's OWN origin (`/assets/...`) at request time — do NOT rely on arbitrary filesystem reads in the serverless function.
- Recipe uses the same shape as `generator/recipe.ts` (model `openai:gpt-image-2`, exact prompt, references with sha256). Returned to the client, not committed.
- No em dashes in user-facing copy.
- Pure logic (prompt builder) has a unit test; the route + UI verify via build + a live smoke.

---

### Task 1: Asset types + prompt builder + test

**Files:**
- Create: `portal/lib/generate/types.ts`, `portal/lib/generate/prompt.ts`, `portal/lib/generate/prompt.test.ts`

**Interfaces:**
- Produces:
  - `types.ts`: `type GenKind = "sticker" | "meme" | "product" | "social"`; `const GEN_KINDS: { key: GenKind; label: string; hint: string; atoms: string[] }[]` where `atoms` are origin-relative asset paths (e.g. `/assets/logo/aitx-mark.png`); `const IMAGE_SIZE = "1024x1024"`.
  - `prompt.ts`: `buildGenPrompt(kind: GenKind, brief: string): string` — composes a full, on-brand gpt-image-2 prompt from a per-kind template + the user's brief. Pure and deterministic.

- [ ] **Step 1: Write `portal/lib/generate/types.ts`**

```ts
export type GenKind = "sticker" | "meme" | "product" | "social";

export const IMAGE_SIZE = "1024x1024";

// atoms are paths under the app's public/ (fetched from own origin at request time)
export const GEN_KINDS: { key: GenKind; label: string; hint: string; atoms: string[] }[] = [
  { key: "sticker", label: "Sticker", hint: "A die-cut vinyl sticker.", atoms: ["/assets/logo/aitx-mark.png"] },
  { key: "meme", label: "Meme", hint: "A shareable AITX meme.", atoms: ["/assets/logo/aitx-mark.png", "/assets/founders/michael.png"] },
  { key: "product", label: "Product", hint: "A branded product mockup.", atoms: ["/assets/logo/aitx-mark.png"] },
  { key: "social", label: "Social", hint: "A square social post.", atoms: ["/assets/logo/aitx-mark.png", "/assets/founders/founders-standing.png"] },
];
```

- [ ] **Step 2: Write `portal/lib/generate/prompt.ts`**

```ts
import type { GenKind } from "./types";

const STYLE =
  "AITX brand style: clean confident design, AITX orange #ff4201 with black and white. The AITX open-arms mark is the real mark from the reference image, never typed letters.";

const TEMPLATES: Record<GenKind, (brief: string) => string> = {
  sticker: (b) => `A single die-cut vinyl STICKER, product shot, centered on a plain light neutral background, glossy finish with a clean white die-cut border and soft drop shadow. ${STYLE} The sticker: ${b}. One sticker only, no sheet. Crisp, correctly spelled.`,
  meme: (b) => `A shareable AITX MEME, square, in the AITX comic brand style. ${STYLE} ${b}. Bold, legible, correctly-spelled caption text in the classic meme style. Wholesome and on-brand.`,
  product: (b) => `A premium studio PRODUCT SHOT of AITX-branded merch, three-quarter hero angle, clean neutral background with a soft shadow. ${STYLE} The product: ${b}. Looks like real premium merch.`,
  social: (b) => `A square Instagram-ready SOCIAL POST in the AITX brand style. ${STYLE} ${b}. Bold, punchy, correctly-spelled headline. Instagram-ready composition.`,
};

export function buildGenPrompt(kind: GenKind, brief: string): string {
  const clean = brief.trim().replace(/\s+/g, " ").slice(0, 600) || "an on-brand AITX asset";
  return TEMPLATES[kind](clean);
}
```

- [ ] **Step 3: Write the failing test `portal/lib/generate/prompt.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGenPrompt } from "./prompt.ts";

test("prompt includes the brief and the brand style", () => {
  const p = buildGenPrompt("sticker", "the mark in a Texas outline");
  assert.match(p, /the mark in a Texas outline/);
  assert.match(p, /#ff4201/);
  assert.match(p, /STICKER/);
});

test("prompt is a distinct template per kind", () => {
  assert.match(buildGenPrompt("meme", "x"), /MEME/);
  assert.match(buildGenPrompt("product", "x"), /PRODUCT SHOT/);
  assert.match(buildGenPrompt("social", "x"), /SOCIAL POST/);
});

test("empty brief falls back, and long briefs are clamped", () => {
  assert.match(buildGenPrompt("sticker", "   "), /an on-brand AITX asset/);
  const long = "a".repeat(1000);
  assert.ok(buildGenPrompt("sticker", long).length < 900);
});
```

- [ ] **Step 4: Run to verify fail, then implement is already written; run to verify pass**

Run: `cd portal && npm test`
Expected: PASS (existing tests + these 3). Output pristine.

- [ ] **Step 5: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/lib/generate/types.ts portal/lib/generate/prompt.ts portal/lib/generate/prompt.test.ts
git commit -m "portal/generate: asset types + prompt builder + test"
```

---

### Task 2: The generate API route

**Files:**
- Modify: `portal/package.json` (add `openai`)
- Create: `portal/app/api/generate/route.ts`

**Interfaces:**
- Produces: `POST /api/generate` accepting JSON `{ kind: GenKind, brief: string }` with header `x-aitx-code`. Returns `{ imageBase64: string, recipe: object }` on success, or `{ error }` with 401 (bad code) / 400 (bad input) / 500 (gen failure).

- [ ] **Step 1: Add openai**

```bash
cd portal && npm install openai@^4.104.0
```

- [ ] **Step 2: Write `portal/app/api/generate/route.ts`**

```ts
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import OpenAI, { toFile } from "openai";
import { buildGenPrompt } from "@/lib/generate/prompt";
import { GEN_KINDS, IMAGE_SIZE, type GenKind } from "@/lib/generate/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  const code = req.headers.get("x-aitx-code") ?? "";
  const expected = process.env.AITX_GENERATE_CODE;
  if (!expected || code !== expected) {
    return NextResponse.json({ error: "Enter the AITX access code to generate." }, { status: 401 });
  }

  let body: { kind?: string; brief?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const spec = GEN_KINDS.find((k) => k.key === body.kind);
  if (!spec || typeof body.brief !== "string") {
    return NextResponse.json({ error: "Pick a type and describe what you want." }, { status: 400 });
  }
  const kind = spec.key as GenKind;
  const prompt = buildGenPrompt(kind, body.brief);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Server is not configured for generation." }, { status: 500 });
  const client = new OpenAI({ apiKey });

  // fetch the atom reference images from our own origin
  const origin = new URL(req.url).origin;
  const refs: { path: string; sha256: string }[] = [];
  const files = [] as Awaited<ReturnType<typeof toFile>>[];
  for (const p of spec.atoms) {
    const res = await fetch(new URL(p, origin));
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    refs.push({ path: p, sha256: createHash("sha256").update(buf).digest("hex") });
    files.push(await toFile(buf, p.split("/").pop() ?? "ref.png", { type: "image/png" }));
  }

  try {
    const result = await client.images.edit({ model: "gpt-image-2", image: files, prompt, size: IMAGE_SIZE as "1024x1024" });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) return NextResponse.json({ error: "The model returned no image. Try again." }, { status: 500 });
    const recipe = {
      recipeVersion: 1,
      createdAt: new Date().toISOString(),
      generator: { kind: "image-model", tool: "aitx-studio-web@0.1.0" },
      model: "openai:gpt-image-2",
      prompt,
      params: { size: IMAGE_SIZE },
      references: refs,
    };
    return NextResponse.json({ imageBase64: b64, recipe });
  } catch (e) {
    return NextResponse.json({ error: "Generation failed. Try again in a moment." }, { status: 500 });
  }
}
```

- [ ] **Step 3: Build to verify it type-checks**

```bash
cd portal && npm run build
```
Expected: build succeeds (the route compiles; it will 500/401 at runtime without envs, which is fine for build).

- [ ] **Step 4: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/package.json portal/package-lock.json portal/app/api/generate/route.ts
git commit -m "portal/generate: /api/generate route (gated, gpt-image-2, provenance recipe)"
```

---

### Task 3: GenerateStudio client + route page

**Files:**
- Create: `portal/components/generate/GenerateStudio.tsx`, `portal/app/studio/create/page.tsx`
- Modify: `portal/app/page.tsx` (add a second CTA to the AI studio)

**Interfaces:** Produces `/studio/create` with a working generate flow.

- [ ] **Step 1: Write `portal/components/generate/GenerateStudio.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `portal/app/studio/create/page.tsx`**

```tsx
import GenerateStudio from "@/components/generate/GenerateStudio";

export const metadata = {
  title: "AITX Studio — Generate",
  description: "Describe an AITX asset and generate it on brand, with a provenance recipe.",
};

export default function CreatePage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-8 flex flex-col gap-2">
        <a href="/" className="text-sm text-[color:var(--orange-deep)] hover:underline">← Brand OS</a>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Generate</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Describe a sticker, meme, product mockup, or social post. It generates on brand, from the AITX atoms, and shows you exactly how it was made.</p>
      </header>
      <GenerateStudio />
    </main>
  );
}
```

- [ ] **Step 3: Add a CTA on `portal/app/page.tsx`**

Find the existing Flyer Studio CTA div (added in Stage 2a) and add a second link beside it:

```tsx
          <a href="/studio/create" className="ml-3 inline-block rounded-md border border-black/15 px-4 py-2 text-sm font-semibold hover:border-[color:var(--orange)]">Generate an asset →</a>
```

- [ ] **Step 4: Build + verify locally (route present)**

```bash
cd portal && npm run build && (PORT=3600 npm run start &) && sleep 4 && curl -s -o /dev/null -w "create %{http_code}\n" http://localhost:3600/studio/create && (lsof -ti tcp:3600 | xargs kill -9)
```
Expected: `200`. (The generate call itself needs envs + deploy to actually run.)

- [ ] **Step 5: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/components/generate portal/app/studio/create portal/app/page.tsx
git commit -m "portal/generate: GenerateStudio UI + /studio/create route + home CTA"
```

---

### Task 4: Set Vercel envs, deploy, live smoke

**Files:** none.

**Interfaces:** the AI generate page works live at `aitx-brand-os.vercel.app/studio/create`.

- [ ] **Step 1: Set the Vercel envs (from the shell env; never type the values)**

```bash
cd /Users/garysheng/Documents/github-repos/aitx/portal
printf '%s' "$OPENAI_API_KEY" | npx vercel env add OPENAI_API_KEY production
# choose a code and set it the same way (pick a memorable community code)
printf '%s' "aitx-build" | npx vercel env add AITX_GENERATE_CODE production
```
Verify present (not values): `npx vercel env ls | grep -E "OPENAI_API_KEY|AITX_GENERATE_CODE"`.

- [ ] **Step 2: Push to deploy**

```bash
cd /Users/garysheng/Documents/github-repos/aitx && git push origin master
```

- [ ] **Step 3: Live smoke (after the build finishes)**

```bash
# route renders
curl -s -o /dev/null -w "create %{http_code}\n" https://aitx-brand-os.vercel.app/studio/create
# gate rejects a missing/blank code
curl -s -o /dev/null -w "no-code %{http_code}\n" -X POST https://aitx-brand-os.vercel.app/api/generate -H "content-type: application/json" -d '{"kind":"sticker","brief":"test"}'
# a real gen with the code (takes ~40s); confirm JSON has imageBase64
curl -s -X POST https://aitx-brand-os.vercel.app/api/generate -H "content-type: application/json" -H "x-aitx-code: aitx-build" -d '{"kind":"sticker","brief":"the AITX mark in a simple orange circle"}' | python3 -c "import sys,json;d=json.load(sys.stdin);print('has image:', bool(d.get('imageBase64')),'| model:', d.get('recipe',{}).get('model'))"
```
Expected: `create 200`; `no-code 401`; the coded call prints `has image: True | model: openai:gpt-image-2`. Then open the page in a browser, enter the code, generate, and confirm the image + "how it was made" render.

---

## Self-Review

**Spec coverage (Stage 2b):**
- Server-side image-model generate (sticker/meme/product/social) via gpt-image-2 with atoms → Tasks 1-2 ✓
- Provenance recipe returned (prompt + model + reference hashes), download-only → Task 2 ✓
- Gated (access code) so the paid endpoint is not open → Task 2 (route), Task 4 (env) ✓
- Client UI with ~40s pending + result + "how it was made" → Task 3 ✓
- Deployed to aitx-brand-os → Task 4 ✓
- Secrets handled via env only, never committed/echoed → Global Constraints, Task 4 ✓

**Placeholder scan:** none — concrete code/commands throughout.

**Type consistency:** `GenKind`, `GEN_KINDS`, `IMAGE_SIZE` defined in Task 1 and consumed unchanged in Tasks 2-3. `buildGenPrompt(kind, brief)` signature stable. The route's response shape `{ imageBase64, recipe }` matches what GenerateStudio consumes.
