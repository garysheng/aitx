# AITX Brand OS — Partner Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deployed, public AITX Brand OS "Partner" portal: brand-at-a-glance plus a downloadable library of every brand atom and golden.

**Architecture:** A Next.js 16 app in `portal/` (reusing the book site's proven config), Tailwind v4 with AITX theme tokens. A typed asset manifest (`lib/brand.ts`) drives a categorized gallery of cards with real downloads. Assets are copied from the repo canon into `public/assets` by a script. Deployed as Vercel project `aitx-brand-os`, git-linked with root dir `portal/`.

**Tech Stack:** Next.js 16 (Turbopack), React 19, Tailwind CSS v4, TypeScript. Node's built-in test runner via `tsx` for pure-logic tests.

**Scope note:** This is Plan 1 of the portal (the shippable foundation). Auth, Generate (image gen), and Admin (Agent SDK) are follow-on plans per the spec `docs/superpowers/specs/2026-07-18-aitx-brand-os-portal-design.md`.

## Global Constraints

- Next.js `16.2.10`, React `19.2.4`, Tailwind v4 (`@tailwindcss/postcss`), matching `books/origin-of-aitx/site`.
- AITX palette: orange `#ff4201`, black `#010101`, white `#ffffff`. The mark is always the real logo image, never typed letters.
- No em dashes in user-facing copy (per `universe/brand-os/VOICE.md`).
- Voice per `universe/brand-os/VOICE.md`: warm, plain-spoken, no hype, no corporate filler.
- Every route has OG meta + favicon (AITX mark).
- UI tasks verify via `npm run build` (must SSG clean) + browser check; pure logic (the manifest) has a unit test.
- Deploy: Vercel project name `aitx-brand-os` (never "site"); git-linked; root directory `portal/`.

---

### Task 1: Scaffold the portal app + AITX theme

**Files:**
- Create: `portal/package.json`, `portal/next.config.ts`, `portal/postcss.config.mjs`, `portal/tsconfig.json`, `portal/next-env.d.ts`, `portal/.gitignore`
- Create: `portal/app/layout.tsx`, `portal/app/page.tsx`, `portal/app/globals.css`

**Interfaces:**
- Produces: a buildable Next.js app at `portal/` with AITX theme CSS variables on `:root` (`--orange`, `--ink`, `--paper`, etc.) available to all pages.

- [ ] **Step 1: Copy proven config from the book site**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
mkdir -p portal/app portal/lib portal/components portal/public/assets portal/scripts
BOOK=books/origin-of-aitx/site
cp "$BOOK/next.config.ts" "$BOOK/postcss.config.mjs" "$BOOK/tsconfig.json" portal/
cp "$BOOK/.gitignore" portal/.gitignore
cp "$BOOK/next-env.d.ts" portal/next-env.d.ts 2>/dev/null || true
```

- [ ] **Step 2: Write `portal/package.json`**

```json
{
  "name": "aitx-brand-os",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "node --import tsx --test lib/*.test.ts"
  },
  "dependencies": {
    "next": "16.2.10",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "tsx": "latest",
    "typescript": "^5"
  }
}
```

- [ ] **Step 3: Write `portal/app/globals.css` with the AITX theme**

```css
@import "tailwindcss";

:root {
  --orange: #ff4201;
  --orange-deep: #c2340a;
  --ink: #17130f;
  --paper: #fbf5ec;
  --muted: #6b5d4a;
}

html, body { height: 100%; }
body {
  background: var(--paper);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
.font-display { font-family: var(--font-fraunces), Georgia, serif; }
.font-body { font-family: var(--font-inter), system-ui, sans-serif; }
```

- [ ] **Step 4: Write `portal/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });

const TITLE = "AITX Brand OS";
const DESCRIPTION = "The AITX brand, in one place. Browse and download on-brand assets, and see how they are made.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aitx-brand-os.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/", siteName: "AITX", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-body`}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Write a placeholder `portal/app/page.tsx`**

```tsx
export default function Home() {
  return <main className="p-10"><h1 className="font-display text-4xl">AITX Brand OS</h1></main>;
}
```

- [ ] **Step 6: Install + build**

```bash
cd portal && npm install && npm run build
```
Expected: build completes, `Generating static pages` includes `/`.

- [ ] **Step 7: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/package.json portal/next.config.ts portal/postcss.config.mjs portal/tsconfig.json portal/.gitignore portal/next-env.d.ts portal/app
git commit -m "portal: scaffold AITX Brand OS Next.js app + theme"
```

---

### Task 2: Asset manifest + collect script + test

**Files:**
- Create: `portal/lib/brand.ts` (the typed manifest), `portal/lib/brand.test.ts`
- Create: `portal/scripts/collect-assets.ts`
- Create (generated): `portal/public/assets/**`

**Interfaces:**
- Produces:
  - `type BrandAsset = { id: string; name: string; category: AssetCategory; file: string; downloadName: string; blurb: string; composedFrom?: string[] }`
  - `type AssetCategory = "logo" | "founders" | "venue" | "product" | "flyer" | "social" | "sticker" | "meme" | "book"`
  - `const ASSETS: BrandAsset[]` and `const CATEGORIES: { key: AssetCategory; label: string }[]`
  - Each `file` is a path under `/assets/...` that exists in `portal/public`.

- [ ] **Step 1: Write `portal/scripts/collect-assets.ts`**

Copies canon atoms + goldens + book cover into `public/assets/` with stable names.

```ts
import { copyFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const REPO = path.resolve(process.cwd(), "..");        // portal/ -> repo root
const OUT = path.resolve(process.cwd(), "public/assets");

// [sourceRelativeToRepo, destRelativeToOut]
const FILES: [string, string][] = [
  ["universe/reference/aitx-mark/aitx-logo.png", "logo/aitx-mark.png"],
  ["universe/reference/founders/founders-standing.png", "founders/founders-standing.png"],
  ["universe/reference/founders/founders-candid.png", "founders/founders-candid.png"],
  ["universe/reference/michael-daigler/gabr-michael.png", "founders/michael.png"],
  ["universe/reference/jake-oshea/gabr-jake.png", "founders/jake.png"],
  ["universe/reference/antler/alcove-live-1.png", "venue/antler-alcove.png"],
  ["universe/reference/antler/signin-2.png", "venue/antler-signin.png"],
  ["universe/reference/products/skylark/opt-2-orange.png", "product/skylark-orange.png"],
  ["universe/reference/products/merch/aitx-cap.png", "product/aitx-cap.png"],
  ["universe/reference/products/merch/aitx-hoodie.png", "product/aitx-hoodie.png"],
  ["goldens/flyers/hackathon.png", "flyer/hackathon.png"],
  ["goldens/flyers/monthly-meetup.png", "flyer/monthly-meetup.png"],
  ["goldens/social/instagram-post.png", "social/instagram-post.png"],
  ["goldens/memes/uncle-sam-submit.png", "meme/uncle-sam-submit.png"],
  ["goldens/memes/pov-found-aitx.png", "meme/pov-found-aitx.png"],
  ["goldens/stickers/aitx-mark.png", "sticker/aitx-mark.png"],
  ["goldens/stickers/texas-loves-ai.png", "sticker/texas-loves-ai.png"],
  ["goldens/stickers/built-in-texas.png", "sticker/built-in-texas.png"],
  ["books/origin-of-aitx/site/public/spreads/spread-00-cover.webp", "book/origin-cover.webp"],
];

for (const [src, dest] of FILES) {
  const from = path.join(REPO, src);
  const to = path.join(OUT, dest);
  if (!existsSync(from)) { console.warn("MISSING", src); continue; }
  mkdirSync(path.dirname(to), { recursive: true });
  copyFileSync(from, to);
  console.log("copied", dest);
}
```

- [ ] **Step 2: Run collect script**

```bash
cd portal && npx tsx scripts/collect-assets.ts
```
Expected: "copied ..." lines, no "MISSING".

- [ ] **Step 3: Write `portal/lib/brand.ts`**

```ts
export type AssetCategory =
  | "logo" | "founders" | "venue" | "product"
  | "flyer" | "social" | "sticker" | "meme" | "book";

export type BrandAsset = {
  id: string;
  name: string;
  category: AssetCategory;
  file: string;         // path under /assets
  downloadName: string; // filename offered on download
  blurb: string;
  composedFrom?: string[]; // atom ids this molecule was built from
};

export const CATEGORIES: { key: AssetCategory; label: string }[] = [
  { key: "logo", label: "The Mark" },
  { key: "founders", label: "Founders" },
  { key: "venue", label: "The Venue" },
  { key: "product", label: "Products" },
  { key: "flyer", label: "Flyers" },
  { key: "social", label: "Social" },
  { key: "sticker", label: "Stickers" },
  { key: "meme", label: "Memes" },
  { key: "book", label: "The Book" },
];

export const ASSETS: BrandAsset[] = [
  { id: "mark", name: "AITX open-arms mark", category: "logo", file: "/assets/logo/aitx-mark.png", downloadName: "aitx-mark.png", blurb: "The sacred logo. Always the real mark, never typed letters." },
  { id: "founders-standing", name: "Founders (standing)", category: "founders", file: "/assets/founders/founders-standing.png", downloadName: "aitx-founders-standing.png", blurb: "Michael and Jake, the locked two-shot." },
  { id: "founders-candid", name: "Founders (candid)", category: "founders", file: "/assets/founders/founders-candid.png", downloadName: "aitx-founders-candid.png", blurb: "Mid-conversation, warm." },
  { id: "michael", name: "Michael Daigler", category: "founders", file: "/assets/founders/michael.png", downloadName: "michael-daigler.png", blurb: "Founder." },
  { id: "jake", name: "Jake O'Shea", category: "founders", file: "/assets/founders/jake.png", downloadName: "jake-oshea.png", blurb: "Cofounder." },
  { id: "antler-alcove", name: "Antler speaking alcove", category: "venue", file: "/assets/venue/antler-alcove.png", downloadName: "antler-alcove.png", blurb: "AITX's home at Antler." },
  { id: "antler-signin", name: "Antler sign-in", category: "venue", file: "/assets/venue/antler-signin.png", downloadName: "antler-signin.png", blurb: "The front desk." },
  { id: "skylark", name: "AITX Skylark", category: "product", file: "/assets/product/skylark-orange.png", downloadName: "aitx-skylark.png", blurb: "The custom AITX shoe." },
  { id: "cap", name: "AITX cap", category: "product", file: "/assets/product/aitx-cap.png", downloadName: "aitx-cap.png", blurb: "Merch." },
  { id: "hoodie", name: "AITX hoodie", category: "product", file: "/assets/product/aitx-hoodie.png", downloadName: "aitx-hoodie.png", blurb: "Merch." },
  { id: "flyer-hackathon", name: "Hackathon flyer", category: "flyer", file: "/assets/flyer/hackathon.png", downloadName: "aitx-hackathon-flyer.png", blurb: "Event poster.", composedFrom: ["mark", "antler-alcove"] },
  { id: "flyer-meetup", name: "Monthly meetup flyer", category: "flyer", file: "/assets/flyer/monthly-meetup.png", downloadName: "aitx-meetup-flyer.png", blurb: "Event poster.", composedFrom: ["mark", "antler-alcove"] },
  { id: "ig-post", name: "Instagram post", category: "social", file: "/assets/social/instagram-post.png", downloadName: "aitx-ig-post.png", blurb: "Social card.", composedFrom: ["founders-standing", "mark"] },
  { id: "meme-uncle-sam", name: "Uncle Sam: submit before the deadline", category: "meme", file: "/assets/meme/uncle-sam-submit.png", downloadName: "aitx-uncle-sam.png", blurb: "Hackathon meme.", composedFrom: ["michael", "mark"] },
  { id: "meme-pov", name: "POV: you found AITX", category: "meme", file: "/assets/meme/pov-found-aitx.png", downloadName: "aitx-pov-meme.png", blurb: "Wholesome meme.", composedFrom: ["michael", "mark"] },
  { id: "sticker-mark", name: "Mark sticker", category: "sticker", file: "/assets/sticker/aitx-mark.png", downloadName: "aitx-sticker-mark.png", blurb: "Die-cut vinyl.", composedFrom: ["mark"] },
  { id: "sticker-texas", name: "Texas Loves AI sticker", category: "sticker", file: "/assets/sticker/texas-loves-ai.png", downloadName: "aitx-sticker-texas.png", blurb: "Die-cut vinyl.", composedFrom: ["mark"] },
  { id: "sticker-built", name: "Built in Texas sticker", category: "sticker", file: "/assets/sticker/built-in-texas.png", downloadName: "aitx-sticker-built.png", blurb: "Die-cut vinyl.", composedFrom: ["mark"] },
  { id: "book-origin", name: "The Origin of the AITX Community", category: "book", file: "/assets/book/origin-cover.webp", downloadName: "aitx-origin-cover.webp", blurb: "The narrated book. Read it at aitx-origin.vercel.app." },
];
```

- [ ] **Step 4: Write `portal/lib/brand.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "fs";
import path from "path";
import { ASSETS, CATEGORIES } from "./brand.ts";

test("every asset file exists in public", () => {
  for (const a of ASSETS) {
    const p = path.join(process.cwd(), "public", a.file);
    assert.ok(existsSync(p), `missing file for ${a.id}: ${a.file}`);
  }
});

test("every asset category is declared in CATEGORIES", () => {
  const keys = new Set(CATEGORIES.map((c) => c.key));
  for (const a of ASSETS) assert.ok(keys.has(a.category), `undeclared category ${a.category}`);
});

test("composedFrom ids all resolve to real assets", () => {
  const ids = new Set(ASSETS.map((a) => a.id));
  for (const a of ASSETS) for (const c of a.composedFrom ?? []) assert.ok(ids.has(c), `${a.id} references unknown atom ${c}`);
});
```

- [ ] **Step 5: Run the test (expect PASS since assets were collected)**

```bash
cd portal && npm test
```
Expected: 3 tests pass. If a file is MISSING, fix `collect-assets.ts` source paths and re-run Step 2.

- [ ] **Step 6: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/lib portal/scripts portal/public/assets
git commit -m "portal: asset manifest + collect script + integrity test"
```

---

### Task 3: Gallery components

**Files:**
- Create: `portal/components/AssetCard.tsx`, `portal/components/AssetGallery.tsx`

**Interfaces:**
- Consumes: `ASSETS`, `CATEGORIES`, `BrandAsset` from `lib/brand.ts`.
- Produces: `<AssetGallery />` (default export) renders all categories with cards; `<AssetCard asset={BrandAsset} />`.

- [ ] **Step 1: Write `portal/components/AssetCard.tsx`**

```tsx
import type { BrandAsset } from "@/lib/brand";

export default function AssetCard({ asset }: { asset: BrandAsset }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className="flex items-center justify-center bg-[color:var(--paper)] p-4" style={{ aspectRatio: "1 / 1" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.file} alt={asset.name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="font-display text-lg font-semibold">{asset.name}</div>
        <p className="text-sm text-[color:var(--muted)]">{asset.blurb}</p>
        {asset.composedFrom && (
          <p className="mt-1 text-xs text-[color:var(--muted)]">Built from: {asset.composedFrom.join(", ")}</p>
        )}
        <a
          href={asset.file}
          download={asset.downloadName}
          className="mt-3 inline-block rounded-md bg-[color:var(--orange)] px-3 py-1.5 text-center text-sm font-semibold text-white hover:bg-[color:var(--orange-deep)]"
        >
          Download
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `portal/components/AssetGallery.tsx`**

```tsx
import { ASSETS, CATEGORIES } from "@/lib/brand";
import AssetCard from "./AssetCard";

export default function AssetGallery() {
  return (
    <div className="flex flex-col gap-12">
      {CATEGORIES.map((cat) => {
        const items = ASSETS.filter((a) => a.category === cat.key);
        if (items.length === 0) return null;
        return (
          <section key={cat.key} id={cat.key}>
            <h2 className="font-display mb-4 text-2xl font-bold">{cat.label}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => <AssetCard key={a.id} asset={a} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Verify build compiles with components imported**

Temporarily render `<AssetGallery />` in `app/page.tsx` (Task 4 finalizes it), then:
```bash
cd portal && npm run build
```
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/components
git commit -m "portal: asset card + gallery components"
```

---

### Task 4: Home page (brand-at-a-glance + gallery) + icons

**Files:**
- Modify: `portal/app/page.tsx`
- Create: `portal/app/icon.png`, `portal/app/apple-icon.png`, `portal/app/favicon.ico`

**Interfaces:**
- Consumes: `<AssetGallery />`, `CATEGORIES` from prior tasks.
- Produces: the finished public home route.

- [ ] **Step 1: Copy AITX icons from the book site**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
cp books/origin-of-aitx/site/app/icon.png books/origin-of-aitx/site/app/apple-icon.png books/origin-of-aitx/site/app/favicon.ico portal/app/
```

- [ ] **Step 2: Write the finished `portal/app/page.tsx`**

```tsx
import AssetGallery from "@/components/AssetGallery";
import { CATEGORIES } from "@/lib/brand";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      {/* Hero / brand at a glance */}
      <header className="mb-12 flex flex-col gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo/aitx-mark.png" alt="AITX" className="h-14 w-auto" />
        <h1 className="font-display text-4xl font-bold sm:text-5xl">AITX Brand OS</h1>
        <p className="max-w-2xl text-lg text-[color:var(--muted)]">
          The AITX brand, in one place. Browse and download on-brand assets, and see how they are made.
          The largest AI builder community in Texas, with open arms.
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full px-3 py-1 text-white" style={{ background: "var(--orange)" }}>#ff4201</span>
          <span className="rounded-full bg-black px-3 py-1 text-white">#010101</span>
          <span className="rounded-full border border-black/15 px-3 py-1">#ffffff</span>
        </div>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:var(--orange-deep)]">
          {CATEGORIES.map((c) => <a key={c.key} href={`#${c.key}`} className="hover:underline">{c.label}</a>)}
        </nav>
      </header>

      <AssetGallery />

      <footer className="mt-16 border-t border-black/10 pt-6 text-sm text-[color:var(--muted)]">
        Every asset here is version-controlled in the AITX brand OS. You get a better sense of a person in person.
      </footer>
    </main>
  );
}
```

- [ ] **Step 3: Build + local visual check**

```bash
cd portal && npm run build && (PORT=3500 npm run start &) && sleep 4 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3500/
```
Expected: `200`. Open `http://localhost:3500/` in a browser: mark + headline render, palette chips show, gallery sections render with images, a Download button saves a file. Kill the server after (`lsof -ti tcp:3500 | xargs kill -9`).

- [ ] **Step 4: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add portal/app
git commit -m "portal: home page (brand-at-a-glance + gallery) + AITX icons"
```

---

### Task 5: Deploy as `aitx-brand-os`, git-linked

**Files:** none (deploy config only).

**Interfaces:** Produces a live URL `https://aitx-brand-os.vercel.app` that auto-deploys on `git push`.

- [ ] **Step 1: Push current work to GitHub**

```bash
cd /Users/garysheng/Documents/github-repos/aitx && git push origin master
```

- [ ] **Step 2: Link a Vercel project named `aitx-brand-os` from the portal dir**

```bash
cd portal && npx vercel link --yes --project aitx-brand-os
```
Expected: `Linked ... aitx-brand-os`; `.vercel/project.json` created.

- [ ] **Step 3: Deploy to production**

```bash
cd portal && npx vercel deploy --prod --yes
```
Expected: a `...ready` URL. Verify: `curl -s -o /dev/null -w "%{http_code}\n" https://aitx-brand-os.vercel.app` returns `200`.

- [ ] **Step 4: Connect GitHub + set root directory for push-to-deploy**

```bash
cd portal && npx vercel git connect https://github.com/garysheng/aitx.git
AUTH="$HOME/Library/Application Support/com.vercel.cli/auth.json"
TOKEN=$(python3 -c "import json;print(json.load(open('$AUTH'))['token'])")
PROJ=$(python3 -c "import json;print(json.load(open('.vercel/project.json'))['projectId'])")
ORG=$(python3 -c "import json;print(json.load(open('.vercel/project.json'))['orgId'])")
curl -s -X PATCH "https://api.vercel.com/v9/projects/$PROJ?teamId=$ORG" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"rootDirectory":"portal"}' | python3 -c "import sys,json;print('rootDirectory:', json.load(sys.stdin).get('rootDirectory'))"
```
Expected: `rootDirectory: portal`.

- [ ] **Step 5: Verify live + OG**

```bash
curl -s https://aitx-brand-os.vercel.app | grep -o '<title>[^<]*</title>'
curl -s -o /dev/null -w "logo %{http_code}\n" https://aitx-brand-os.vercel.app/assets/logo/aitx-mark.png
```
Expected: title = "AITX Brand OS"; logo asset 200. Confirm the live gallery renders and a download works in the browser.

---

## Self-Review

**Spec coverage (Partner face only, this plan's scope):**
- Brand-at-a-glance (what AITX is, palette, voice line) → Task 4 ✓
- Asset library of atoms + goldens + book with real downloads → Tasks 2, 3, 4 ✓
- Deploy `aitx-brand-os`, git-linked, root dir `portal/` → Task 5 ✓
- Atoms→molecules story (composedFrom shown on cards) → Tasks 2, 3 ✓
- Auth / Generate / Admin → intentionally out of scope (follow-on plans) ✓

**Placeholder scan:** none — every step has concrete code/commands.

**Type consistency:** `BrandAsset`, `AssetCategory`, `ASSETS`, `CATEGORIES` defined in Task 2 and consumed unchanged in Tasks 3-4. `composedFrom` optional string[] used consistently.
