// EXPERIMENT 17 — the embedded agent as CREATIVE DIRECTOR for a co-branded drop.
// From one sentence, the agent designs a whole AITX x NVIDIA community collab
// line (memes, stickers, merch, fashion): titles, on-voice copy, and a detailed
// gpt-image-2 prompt per piece — returned as structured JSON. Then WE fan the
// renders out in PARALLEL (Gary's standing rule) through the real generator
// spine, so every asset lands with a provenance recipe. This is the vision:
// natural language -> a batch of rule-encoded generate calls -> reproducible art.
//
// BRAND RULE (learned the hard way): mixing logos is almost never OK. Only the
// AITX open-arms mark ever appears as a mark. NVIDIA is named in WORDS (AITX's
// own type) with green as a small accent color — never its logo, never a
// combined "AITX x NVIDIA" lockup. See universe/brand-os/BRAND-RULES.md.
//
// Output goes to explorations/ — these are CANDIDATES, not goldens. A golden is
// human-approved; the agent never writes into goldens/.

import { query } from "@anthropic-ai/claude-agent-sdk";
import { mkdirSync, existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import path from "node:path";
import { generateImageAsset, type RenderFn } from "../../generator/generate-image.ts";

const execFileP = promisify(execFile);

// Async twin of the shared renderOpenAI adapter (which is execFileSync and would
// block the event loop, quietly serializing our pool). Same uv + gpt-image-2
// call, just non-blocking so the fan-out is truly parallel.
const renderOpenAIAsync: RenderFn = async ({ prompt, outPath, size, quality, references }) => {
  const script = path.join(os.homedir(), ".agents/skills/chatgpt-images/scripts/generate_image.py");
  const args = ["run", "--quiet", script, "--prompt", prompt, "--filename", outPath,
    "--size", size ?? "1024x1024", "--quality", quality ?? "high"];
  for (const r of references) args.push("--input-image", r);
  await execFileP("uv", args, { maxBuffer: 64 * 1024 * 1024 });
};

const REPO = path.resolve(process.cwd(), "../..");
const MARK = path.join(REPO, "universe/reference/aitx-mark/aitx-logo.png");
const OUTDIR = path.join(REPO, "explorations/collabs/nvidia-aitx");
mkdirSync(OUTDIR, { recursive: true });

const SIZES = ["1024x1024", "1024x1536", "1536x1024"] as const;

const schema = {
  type: "object",
  properties: {
    drop: {
      type: "object",
      properties: { name: { type: "string" }, tagline: { type: "string" } },
      required: ["name", "tagline"],
      additionalProperties: false,
    },
    items: {
      type: "array",
      minItems: 8,
      maxItems: 8,
      items: {
        type: "object",
        properties: {
          category: { type: "string", enum: ["meme", "sticker", "merch", "fashion"] },
          slug: { type: "string", description: "short kebab-case filename, unique" },
          title: { type: "string" },
          copy: { type: "string", description: "the on-voice AITX line, if any text appears" },
          imagePrompt: { type: "string", description: "a detailed, standalone gpt-image-2 prompt" },
          size: { type: "string", enum: ["1024x1024", "1024x1536", "1536x1024"] },
        },
        required: ["category", "slug", "title", "copy", "imagePrompt", "size"],
        additionalProperties: false,
      },
    },
  },
  required: ["drop", "items"],
  additionalProperties: false,
};

const BRIEF = `You are the creative director for AITX — the largest AI builder community in Texas,
built the slow way on loyalty, reputation, and good vibes. Design a limited "AITX x NVIDIA"
community collab drop: the kind a meetup makes to celebrate the room where Texas builders and
the great tech companies meet. NVIDIA is the guest of honor, not the boss.

AITX VOICE (obey it in every line of copy):
- Warm, human, plain-spoken, Texas-proud, a little fun. Confident, never boastful.
- Signature energy: "you get a better sense of a person in person", "it has open arms",
  "come build the future with us".
- DO NOT use em dashes. No hype, no fear, no corporate filler (synergy, leverage, unlock,
  cutting-edge, revolutionary, game-changing, ecosystem, thought leader). Short true sentences.

BRAND / VISUAL RULES for every imagePrompt (each prompt must stand alone for an image model):
- AITX palette: orange #ff4201, black, warm paper white. NVIDIA green #76b900 is allowed ONLY as
  a small accent color (a heart, a thin underline, a word). Orange always leads; green never
  co-leads.
- LOGOS — THE CARDINAL RULE. Mixing logos is almost never OK. The ONLY logo/mark that may appear
  on any piece is the orange AITX open-arms mark (passed to the model as a reference image; refer
  to it as "the orange AITX open-arms mark" and place it tastefully). You must NOT:
  * render the NVIDIA logo, the NVIDIA eye/GPU icon, or the NVIDIA wordmark/official typeface;
  * put any second logo next to the AITX mark;
  * create any "AITX x NVIDIA" logo lockup, badge, or combined emblem.
- Express the collaboration in WORDS ONLY. The word "NVIDIA" may appear inside a headline or
  sentence set in a plain clean sans (AITX's own type), e.g. "with NVIDIA" or "NVIDIA in the
  room". It must read as typed words in a sentence, never as a standalone logo/badge and never
  locked to the AITX mark. Do not stylize it as a brand wordmark.
- Premium, clean, real. Studio product shots for merch (neutral background, soft shadow). Real
  on-model portrait shots for fashion. For memes and stickers, bake any caption text into the
  prompt exactly, in the AITX voice.

Design EXACTLY 8 pieces: 2 memes, 2 stickers, 2 merch products, 2 fashion looks. Give each a
unique kebab slug. Pick a sensible size per piece (square 1024x1024 for stickers/most memes,
portrait 1024x1536 for fashion on-model shots and tall memes, landscape 1536x1024 only if it
truly helps). Make it something Texas builders would actually want to wear and post.

Return ONLY the JSON.`;

console.log("Designing the AITX x NVIDIA drop (agent, natural language)...");
let result: any = null;
for await (const m of query({
  prompt: BRIEF,
  options: { outputFormat: { type: "json_schema", schema }, allowedTools: [], settingSources: [] },
})) {
  if ((m as any).type === "result") result = m;
}

let plan: any;
try { plan = JSON.parse(result?.result); }
catch { console.error("Agent did not return JSON:\n", result?.result?.slice?.(0, 500)); process.exit(1); }

console.log(`\nDrop: "${plan.drop?.name}" — ${plan.drop?.tagline}`);
console.log(`Design cost: $${result?.total_cost_usd?.toFixed?.(4) ?? "?"} / ${result?.num_turns} turns\n`);
for (const it of plan.items) console.log(`  [${it.category}] ${it.slug} (${it.size}) — ${it.title}`);

// ---- parallel fan-out through the real generator spine (concurrency-capped) ----
async function pool<T, R>(items: T[], limit: number, fn: (x: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

console.log("\nRendering all 8 in parallel (cap 4)...");
const made = await pool(plan.items, 4, async (it: any) => {
  const size = (SIZES as readonly string[]).includes(it.size) ? it.size : "1024x1024";
  const outPath = path.join(OUTDIR, `${it.category}-${it.slug}.png`);
  try {
    const res = await generateImageAsset({
      outPath, model: "openai:gpt-image-2", prompt: it.imagePrompt,
      params: { size, quality: "high" },
      references: [MARK], roles: { [MARK]: "logo" },
      createdAt: new Date().toISOString(),
    }, { render: renderOpenAIAsync });
    console.log(`  ✓ ${path.basename(res.assetPath)}`);
    return { slug: it.slug, asset: res.assetPath, ok: existsSync(res.assetPath) };
  } catch (e: any) {
    console.log(`  ✗ ${it.category}-${it.slug}: ${e?.message ?? e}`);
    return { slug: it.slug, asset: outPath, ok: false };
  }
});

console.log("\n" + JSON.stringify({
  drop: plan.drop,
  rendered: made.filter((m) => m.ok).length,
  total: made.length,
  files: made.map((m) => path.basename(m.asset)),
}, null, 2));
