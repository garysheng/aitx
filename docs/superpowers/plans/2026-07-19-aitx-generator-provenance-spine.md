# AITX Asset Generator — Provenance Spine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A small Node/TypeScript module (`generator/`) that generates image assets AND writes a version-controlled recipe (exact prompt + model + reference hashes) for every one, plus `regenerate(recipe)` to replay a recipe.

**Architecture:** Pure, unit-tested core (`recipe.ts`) + a `generateImageAsset()` whose model call is dependency-injected (so tests use a stub render, never a real API call) + `regenerate()` that verifies reference hashes before replaying. A thin real render adapter shells out to the proven `chatgpt-images` Python script (gpt-image-2), wired through a CLI. One real end-to-end smoke proves the whole path.

**Tech Stack:** Node 20+ stdlib only (`crypto`, `fs`, `path`, `child_process`) + TypeScript via `tsx`. Node's built-in test runner (`node --import tsx --test`). No npm runtime deps.

**Scope note:** Plan 1 of the generator (per spec `docs/superpowers/specs/2026-07-18-aitx-asset-generator-provenance.md`). The deterministic (next/og) flyer template, the portal provenance view, and backfilling recipes for existing goldens are follow-on plans.

## Global Constraints

- Runtime: Node 20+, TypeScript via `tsx`. No npm runtime dependencies (stdlib only). Test runner: `node --import tsx --test generator/*.test.ts`.
- `Recipe` shape is fixed by the spec (recipeVersion 1). Recipe sidecar path: `foo.png` → `foo.recipe.json` (strip the asset extension, append `.recipe.json`).
- Recipes are written pretty-printed (`JSON.stringify(recipe, null, 2) + "\n"`).
- Reproducibility honesty: deterministic = byte-stable; image-model = recipe-exact, not pixel-exact (gpt-image-2 has no seed). Do NOT add a fake `seed`.
- `createdAt` is INJECTED by the caller (ISO string), never read from the clock inside the generate functions — keeps them deterministic and testable.
- The model call is INJECTED (`deps.render`) — the core functions never import the API/subprocess directly; only the CLI wires the real adapter.
- Real image render adapter shells to: `uv run --quiet ~/.agents/skills/chatgpt-images/scripts/generate_image.py --prompt <p> --filename <out> --size <size> --quality <q> [--input-image <ref> ...]`. It needs `OPENAI_API_KEY` in env (the script reads it).
- `generator.tool` string: `"aitx-generator@0.1.0"`.
- Generator id for models: `"openai:gpt-image-2"` (only backend wired in v1).

---

### Task 1: Recipe types + helpers

**Files:**
- Create: `generator/package.json`, `generator/tsconfig.json`, `generator/recipe.ts`, `generator/recipe.test.ts`

**Interfaces:**
- Produces:
  - `type Recipe` (recipeVersion 1; fields per spec)
  - `type Reference = { path: string; sha256: string; role?: string }`
  - `sha256File(filePath: string): string`
  - `recipePathFor(assetPath: string): string`
  - `buildReferences(paths: string[], roles?: Record<string,string>): Reference[]`
  - `writeRecipe(recipe: Recipe): string` (returns the recipe path written)
  - `readRecipe(recipePath: string): Recipe`

- [ ] **Step 1: Write `generator/package.json`**

```json
{
  "name": "aitx-generator",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --import tsx --test *.test.ts"
  },
  "devDependencies": {
    "tsx": "latest",
    "@types/node": "^20",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Write `generator/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["*.ts"]
}
```

- [ ] **Step 3: Write the failing test `generator/recipe.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { sha256File, recipePathFor, buildReferences, writeRecipe, readRecipe, type Recipe } from "./recipe.ts";

test("sha256File hashes file bytes", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "aitx-rec-"));
  const f = path.join(dir, "a.txt");
  writeFileSync(f, "hello");
  // sha256("hello") is a known constant
  assert.equal(sha256File(f), "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
});

test("recipePathFor swaps the asset extension for .recipe.json", () => {
  assert.equal(recipePathFor("goldens/memes/x.png"), "goldens/memes/x.recipe.json");
  assert.equal(recipePathFor("a/b/cover.webp"), "a/b/cover.recipe.json");
});

test("buildReferences hashes each path and keeps roles", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "aitx-rec-"));
  const f = path.join(dir, "logo.png");
  writeFileSync(f, "PNGBYTES");
  const refs = buildReferences([f], { [f]: "logo" });
  assert.equal(refs.length, 1);
  assert.equal(refs[0].path, f);
  assert.equal(refs[0].role, "logo");
  assert.match(refs[0].sha256, /^[0-9a-f]{64}$/);
});

test("writeRecipe + readRecipe round-trip to the sidecar path", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "aitx-rec-"));
  const asset = path.join(dir, "out.png");
  const recipe: Recipe = {
    recipeVersion: 1,
    asset,
    createdAt: "2026-07-19T00:00:00Z",
    generator: { kind: "image-model", tool: "aitx-generator@0.1.0" },
    model: "openai:gpt-image-2",
    prompt: "a test",
    references: [],
  };
  const rp = writeRecipe(recipe);
  assert.equal(rp, recipePathFor(asset));
  assert.deepEqual(readRecipe(rp), recipe);
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `cd generator && npm install && npm test`
Expected: FAIL (cannot find module `./recipe.ts` / exports undefined).

- [ ] **Step 5: Write `generator/recipe.ts`**

```ts
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type Reference = { path: string; sha256: string; role?: string };

export type Recipe = {
  recipeVersion: 1;
  asset: string;
  createdAt: string;
  generator: { kind: "image-model" | "deterministic"; tool: string };
  model?: string;
  prompt?: string;
  params?: { size?: string; quality?: string; background?: string };
  references?: Reference[];
  template?: { id: string; version: string };
  inputs?: Record<string, unknown>;
  fonts?: { family: string; weight: string; file: string; sha256: string }[];
  ruleSet?: { id: string; version: string };
  notes?: string;
};

export function sha256File(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

export function recipePathFor(assetPath: string): string {
  const ext = path.extname(assetPath);
  return assetPath.slice(0, assetPath.length - ext.length) + ".recipe.json";
}

export function buildReferences(paths: string[], roles: Record<string, string> = {}): Reference[] {
  return paths.map((p) => {
    const ref: Reference = { path: p, sha256: sha256File(p) };
    if (roles[p]) ref.role = roles[p];
    return ref;
  });
}

export function writeRecipe(recipe: Recipe): string {
  const rp = recipePathFor(recipe.asset);
  writeFileSync(rp, JSON.stringify(recipe, null, 2) + "\n");
  return rp;
}

export function readRecipe(recipePath: string): Recipe {
  return JSON.parse(readFileSync(recipePath, "utf8")) as Recipe;
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `cd generator && npm test`
Expected: PASS (4 tests). Output pristine.

- [ ] **Step 7: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add generator/package.json generator/tsconfig.json generator/recipe.ts generator/recipe.test.ts generator/package-lock.json
git commit -m "generator: recipe types + helpers (sha256, sidecar path, read/write)"
```

---

### Task 2: generateImageAsset (injected render)

**Files:**
- Create: `generator/generate-image.ts`, `generator/generate-image.test.ts`

**Interfaces:**
- Consumes: `Recipe`, `buildReferences`, `writeRecipe`, `recipePathFor` from `./recipe.ts`.
- Produces:
  - `type RenderArgs = { prompt: string; outPath: string; size?: string; quality?: string; background?: string; references: string[] }`
  - `type RenderFn = (args: RenderArgs) => Promise<void>` (renders an image to `outPath`)
  - `type GenerateResult = { assetPath: string; recipePath: string; recipe: Recipe }`
  - `type ImageSpec = { outPath: string; model: "openai:gpt-image-2"; prompt: string; params?: { size?: string; quality?: string; background?: string }; references: string[]; roles?: Record<string,string>; createdAt: string }`
  - `generateImageAsset(spec: ImageSpec, deps: { render: RenderFn }): Promise<GenerateResult>`

- [ ] **Step 1: Write the failing test `generator/generate-image.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { generateImageAsset, type RenderFn } from "./generate-image.ts";
import { readRecipe, recipePathFor } from "./recipe.ts";

test("generateImageAsset renders then writes a correct recipe", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "aitx-gen-"));
  const logo = path.join(dir, "logo.png");
  writeFileSync(logo, "LOGOBYTES");
  const out = path.join(dir, "meme.png");

  const calls: any[] = [];
  const render: RenderFn = async (args) => { calls.push(args); writeFileSync(args.outPath, "IMG"); };

  const res = await generateImageAsset({
    outPath: out,
    model: "openai:gpt-image-2",
    prompt: "michael as uncle sam",
    params: { size: "1024x1024", quality: "high" },
    references: [logo],
    roles: { [logo]: "logo" },
    createdAt: "2026-07-19T00:00:00Z",
  }, { render });

  // render was called with the prompt + refs
  assert.equal(calls.length, 1);
  assert.equal(calls[0].prompt, "michael as uncle sam");
  assert.deepEqual(calls[0].references, [logo]);
  // asset + recipe written
  assert.ok(existsSync(out));
  assert.equal(res.recipePath, recipePathFor(out));
  const recipe = readRecipe(res.recipePath);
  assert.equal(recipe.model, "openai:gpt-image-2");
  assert.equal(recipe.prompt, "michael as uncle sam");
  assert.equal(recipe.generator.kind, "image-model");
  assert.equal(recipe.references?.[0].path, logo);
  assert.equal(recipe.references?.[0].role, "logo");
  assert.match(recipe.references?.[0].sha256 ?? "", /^[0-9a-f]{64}$/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd generator && npm test`
Expected: FAIL (module `./generate-image.ts` not found).

- [ ] **Step 3: Write `generator/generate-image.ts`**

```ts
import { buildReferences, writeRecipe, type Recipe } from "./recipe.ts";

export type RenderArgs = {
  prompt: string;
  outPath: string;
  size?: string;
  quality?: string;
  background?: string;
  references: string[];
};
export type RenderFn = (args: RenderArgs) => Promise<void>;

export type GenerateResult = { assetPath: string; recipePath: string; recipe: Recipe };

export type ImageSpec = {
  outPath: string;
  model: "openai:gpt-image-2";
  prompt: string;
  params?: { size?: string; quality?: string; background?: string };
  references: string[];
  roles?: Record<string, string>;
  createdAt: string;
};

export async function generateImageAsset(spec: ImageSpec, deps: { render: RenderFn }): Promise<GenerateResult> {
  await deps.render({
    prompt: spec.prompt,
    outPath: spec.outPath,
    size: spec.params?.size,
    quality: spec.params?.quality,
    background: spec.params?.background,
    references: spec.references,
  });
  const recipe: Recipe = {
    recipeVersion: 1,
    asset: spec.outPath,
    createdAt: spec.createdAt,
    generator: { kind: "image-model", tool: "aitx-generator@0.1.0" },
    model: spec.model,
    prompt: spec.prompt,
    ...(spec.params ? { params: spec.params } : {}),
    references: buildReferences(spec.references, spec.roles),
  };
  const recipePath = writeRecipe(recipe);
  return { assetPath: spec.outPath, recipePath, recipe };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd generator && npm test`
Expected: PASS (all tests from Task 1 + this one). Output pristine.

- [ ] **Step 5: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add generator/generate-image.ts generator/generate-image.test.ts
git commit -m "generator: generateImageAsset (injected render) writes asset + recipe"
```

---

### Task 3: regenerate (verify hashes, replay)

**Files:**
- Create: `generator/regenerate.ts`, `generator/regenerate.test.ts`

**Interfaces:**
- Consumes: `readRecipe`, `sha256File` from `./recipe.ts`; `generateImageAsset`, `RenderFn`, `GenerateResult` from `./generate-image.ts`.
- Produces: `regenerate(recipePath: string, deps: { render: RenderFn; createdAt: string }): Promise<GenerateResult>`

- [ ] **Step 1: Write the failing test `generator/regenerate.test.ts`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { generateImageAsset, type RenderFn } from "./generate-image.ts";
import { regenerate } from "./regenerate.ts";

function setup() {
  const dir = mkdtempSync(path.join(tmpdir(), "aitx-regen-"));
  const logo = path.join(dir, "logo.png");
  writeFileSync(logo, "LOGOBYTES");
  const out = path.join(dir, "asset.png");
  const render: RenderFn = async (args) => { writeFileSync(args.outPath, "IMG"); };
  return { dir, logo, out, render };
}

test("regenerate replays a recipe with matching reference hashes", async () => {
  const { logo, out, render } = setup();
  const first = await generateImageAsset({
    outPath: out, model: "openai:gpt-image-2", prompt: "p", references: [logo], createdAt: "2026-07-19T00:00:00Z",
  }, { render });

  let replayedPrompt = "";
  const render2: RenderFn = async (args) => { replayedPrompt = args.prompt; writeFileSync(args.outPath, "IMG2"); };
  const res = await regenerate(first.recipePath, { render: render2, createdAt: "2026-07-19T01:00:00Z" });
  assert.equal(replayedPrompt, "p");
  assert.ok(existsSync(res.assetPath));
  assert.equal(res.recipe.createdAt, "2026-07-19T01:00:00Z");
});

test("regenerate throws when a reference changed since the recipe", async () => {
  const { logo, out, render } = setup();
  const first = await generateImageAsset({
    outPath: out, model: "openai:gpt-image-2", prompt: "p", references: [logo], createdAt: "2026-07-19T00:00:00Z",
  }, { render });
  writeFileSync(logo, "TAMPERED"); // atom changed
  await assert.rejects(
    () => regenerate(first.recipePath, { render, createdAt: "2026-07-19T02:00:00Z" }),
    /reference changed/,
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd generator && npm test`
Expected: FAIL (module `./regenerate.ts` not found).

- [ ] **Step 3: Write `generator/regenerate.ts`**

```ts
import { readRecipe, sha256File } from "./recipe.ts";
import { generateImageAsset, type RenderFn, type GenerateResult } from "./generate-image.ts";

export async function regenerate(recipePath: string, deps: { render: RenderFn; createdAt: string }): Promise<GenerateResult> {
  const recipe = readRecipe(recipePath);
  if (recipe.generator.kind !== "image-model") {
    throw new Error(`regenerate: only image-model recipes are supported in v1 (got ${recipe.generator.kind})`);
  }
  if (!recipe.prompt || !recipe.model) {
    throw new Error("regenerate: recipe is missing prompt or model");
  }
  for (const ref of recipe.references ?? []) {
    const now = sha256File(ref.path);
    if (now !== ref.sha256) {
      throw new Error(`reference changed since recipe: ${ref.path} (recorded ${ref.sha256.slice(0, 8)}, now ${now.slice(0, 8)})`);
    }
  }
  const roles: Record<string, string> = {};
  for (const ref of recipe.references ?? []) if (ref.role) roles[ref.path] = ref.role;
  return generateImageAsset({
    outPath: recipe.asset,
    model: recipe.model as "openai:gpt-image-2",
    prompt: recipe.prompt,
    ...(recipe.params ? { params: recipe.params } : {}),
    references: (recipe.references ?? []).map((r) => r.path),
    roles,
    createdAt: deps.createdAt,
  }, { render: deps.render });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd generator && npm test`
Expected: PASS (all prior tests + 2 new). Output pristine.

- [ ] **Step 5: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add generator/regenerate.ts generator/regenerate.test.ts
git commit -m "generator: regenerate (verify reference hashes, replay recipe)"
```

---

### Task 4: Real render adapter + CLI + end-to-end smoke

**Files:**
- Create: `generator/render-openai.ts`, `generator/cli.ts`, `generator/README.md`

**Interfaces:**
- Consumes: `generateImageAsset`, `regenerate`, `RenderFn`.
- Produces:
  - `renderOpenAI: RenderFn` (shells to the chatgpt-images Python script)
  - a CLI: `npx tsx cli.ts generate --out <path> --prompt <p> [--size <s>] [--quality <q>] [--ref <path> ...]` and `npx tsx cli.ts regenerate --recipe <path>`

- [ ] **Step 1: Write `generator/render-openai.ts`**

```ts
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import type { RenderFn } from "./generate-image.ts";

// Shells out to the proven chatgpt-images gpt-image-2 script.
// Needs OPENAI_API_KEY in env (the script reads it). Uses `uv run` because the
// script is a PEP 723 inline-deps file.
export const renderOpenAI: RenderFn = async ({ prompt, outPath, size, quality, references }) => {
  const script = path.join(os.homedir(), ".agents/skills/chatgpt-images/scripts/generate_image.py");
  const args = ["run", "--quiet", script, "--prompt", prompt, "--filename", outPath, "--size", size ?? "1024x1024", "--quality", quality ?? "high"];
  for (const r of references) { args.push("--input-image", r); }
  execFileSync("uv", args, { stdio: "inherit" });
};
```

- [ ] **Step 2: Write `generator/cli.ts`**

```ts
import { generateImageAsset } from "./generate-image.ts";
import { regenerate } from "./regenerate.ts";
import { renderOpenAI } from "./render-openai.ts";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}
function args(name: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < process.argv.length; i++) if (process.argv[i] === `--${name}`) out.push(process.argv[i + 1]);
  return out;
}

const cmd = process.argv[2];
const now = new Date().toISOString();

if (cmd === "generate") {
  const out = arg("out"); const prompt = arg("prompt");
  if (!out || !prompt) { console.error("usage: cli.ts generate --out <path> --prompt <p> [--size s] [--quality q] [--ref path ...]"); process.exit(1); }
  const res = await generateImageAsset({
    outPath: out, model: "openai:gpt-image-2", prompt,
    params: { size: arg("size") ?? "1024x1024", quality: arg("quality") ?? "high" },
    references: args("ref"), createdAt: now,
  }, { render: renderOpenAI });
  console.log("wrote", res.assetPath, "+", res.recipePath);
} else if (cmd === "regenerate") {
  const recipe = arg("recipe");
  if (!recipe) { console.error("usage: cli.ts regenerate --recipe <path>"); process.exit(1); }
  const res = await regenerate(recipe, { render: renderOpenAI, createdAt: now });
  console.log("regenerated", res.assetPath, "+", res.recipePath);
} else {
  console.error("commands: generate | regenerate");
  process.exit(1);
}
```

- [ ] **Step 3: Write `generator/README.md`**

```markdown
# AITX Asset Generator (provenance spine)

Every generated image writes a sibling `.recipe.json` (exact prompt + model +
reference hashes) so it is reproducible and self-documenting.

## Use

    cd generator && npm install
    # generate an image + its recipe
    npx tsx cli.ts generate --out ../goldens/memes/test.png \
      --prompt "Michael as Uncle Sam, plain hat, black AITX tee" \
      --ref ../universe/reference/michael-daigler/gabr-michael.png \
      --ref ../universe/reference/aitx-mark/aitx-logo.png
    # replay a recipe (verifies reference bytes are unchanged)
    npx tsx cli.ts regenerate --recipe ../goldens/memes/test.recipe.json

Needs `OPENAI_API_KEY` in env (the underlying gpt-image-2 script reads it).
Deterministic templates + backfill of existing goldens are follow-on work.
```

- [ ] **Step 4: End-to-end smoke (real API call — one small asset)**

Run:
```bash
cd /Users/garysheng/Documents/github-repos/aitx/generator
npx tsx cli.ts generate --out /tmp/aitx-smoke.png --size 1024x1024 \
  --prompt "The AITX open-arms mark as a simple orange sticker on a plain background" \
  --ref ../universe/reference/aitx-mark/aitx-logo.png
```
Expected: prints `wrote /tmp/aitx-smoke.png + /tmp/aitx-smoke.recipe.json`. Verify:
```bash
test -f /tmp/aitx-smoke.png && echo IMG_OK
python3 -c "import json;r=json.load(open('/tmp/aitx-smoke.recipe.json'));print(r['model'], r['generator']['kind'], len(r['references']), r['references'][0]['sha256'][:8])"
```
Expected: `IMG_OK` and a line like `openai:gpt-image-2 image-model 1 <hash8>`. (If `OPENAI_API_KEY` is unset, report BLOCKED with that note rather than failing silently.)

- [ ] **Step 5: Commit**

```bash
cd /Users/garysheng/Documents/github-repos/aitx
git add generator/render-openai.ts generator/cli.ts generator/README.md
git commit -m "generator: real gpt-image-2 render adapter + CLI (generate/regenerate)"
```

---

## Self-Review

**Spec coverage (spine scope):**
- Recipe format (sidecar, exact fields) → Task 1 ✓
- generateImageAsset (prompt + model + reference hashes, always writes a recipe) → Task 2 ✓
- regenerate (verify reference hashes, replay) → Task 3 ✓
- Real backend via the proven gpt-image-2 script + CLI + smoke → Task 4 ✓
- Reproducibility honesty (no fake seed; hash-verified refs) → Tasks 1-3 ✓
- Deterministic backend, portal provenance view, backfill of existing goldens → intentionally out of scope (follow-on plans) ✓

**Placeholder scan:** none — every step has concrete code/commands.

**Type consistency:** `Recipe`, `Reference`, `RenderFn`, `RenderArgs`, `GenerateResult`, `ImageSpec` defined in Tasks 1-2 and consumed unchanged in Tasks 3-4. `createdAt` injected everywhere; model call injected everywhere except the CLI (which wires `renderOpenAI`).
