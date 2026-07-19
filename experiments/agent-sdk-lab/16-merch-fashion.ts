// EXPERIMENT 16 — the agent designs a real AITX MERCH + FASHION line from one
// sentence. The design tool wraps the real generator (gpt-image-2), always
// passing the AITX mark. The agent writes the product-shot prompts itself and
// renders a portable charger, a water bottle, and a varsity jacket. Real images
// + provenance recipes, output into the repo so recipe paths stay clean.

import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { run } from "./_run.ts";
import { generateImageAsset } from "../../generator/generate-image.ts";
import { renderOpenAI } from "../../generator/render-openai.ts";

const REPO = path.resolve(process.cwd(), "../..");
const MARK = path.join(REPO, "universe/reference/aitx-mark/aitx-logo.png");
const OUTDIR = path.join(REPO, "goldens/merch-lab");
mkdirSync(OUTDIR, { recursive: true });

const made: { slug: string; asset: string }[] = [];
const design = tool(
  "design_aitx_product",
  "Design and render ONE on-brand AITX physical product as a clean studio product shot. The AITX open-arms mark is always passed as a reference so branding is the real mark. AITX palette: orange #ff4201, black, white. Call once per product.",
  {
    slug: z.string().describe("short kebab filename, e.g. portable-charger"),
    prompt: z.string().describe("a detailed, on-brand studio product-shot prompt"),
  },
  async (args) => {
    const outPath = path.join(OUTDIR, `${args.slug}.png`);
    const res = await generateImageAsset({
      outPath, model: "openai:gpt-image-2", prompt: args.prompt,
      params: { size: "1024x1024", quality: "high" },
      references: [MARK], roles: { [MARK]: "logo" },
      createdAt: new Date().toISOString(),
    }, { render: renderOpenAI });
    made.push({ slug: args.slug, asset: res.assetPath });
    return { content: [{ type: "text", text: `Rendered ${args.slug} -> ${res.assetPath} (+ recipe)` }] };
  },
);
const server = createSdkMcpServer({ name: "aitx", version: "1.0.0", tools: [design] });

const r = await run(
  "Design a small AITX merch line: (1) a portable phone charger / power bank, (2) an insulated water bottle, and (3) a varsity jacket. For EACH, call design_aitx_product once with a great on-brand studio product-shot prompt: premium matte black hardware or apparel, the orange AITX open-arms mark tastefully placed, clean neutral studio background, soft shadow. Make them look like real premium merch someone would want.",
  { mcpServers: { aitx: server }, allowedTools: ["mcp__aitx__design_aitx_product"], settingSources: [] },
);

console.log(JSON.stringify({
  itemsMade: made.map((m) => m.slug),
  count: made.length,
  allFilesExist: made.every((m) => existsSync(m.asset)),
  numTurns: r.numTurns, costUsd: r.costUsd,
  finalText: r.finalText.slice(0, 300),
}, null, 2));
