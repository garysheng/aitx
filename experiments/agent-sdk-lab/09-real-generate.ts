// EXPERIMENT 09 — CROWN JEWEL: the Agent SDK driving the REAL generator spine.
// The tool wraps the actual generateImageAsset + renderOpenAI (gpt-image-2),
// always passing the real AITX mark as a reference. The agent, from one
// sentence, produces a REAL image + a REAL provenance recipe. This ties the two
// threads together: natural-language experiment runner -> rule-encoded generate
// call -> reproducible asset. (Costs one real gpt-image-2 call.)

import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { run } from "./_run.ts";
import { generateImageAsset } from "../../generator/generate-image.ts";
import { renderOpenAI } from "../../generator/render-openai.ts";
import { existsSync } from "node:fs";
import path from "node:path";

const REPO = path.resolve(process.cwd(), "../..");
const MARK = path.join(REPO, "universe/reference/aitx-mark/aitx-logo.png");
const OUT = "/tmp/aitx-agent-generated.png";
const RECIPE = OUT.replace(/\.png$/, ".recipe.json");

let toolRecipePath = "";
const genTool = tool(
  "generate_aitx_asset",
  "Generate one real on-brand AITX image asset. The AITX mark is always passed as a reference so the logo renders as the real mark. Call once.",
  { prompt: z.string().describe("what to render, on-brand and specific") },
  async (args) => {
    const res = await generateImageAsset({
      outPath: OUT,
      model: "openai:gpt-image-2",
      prompt: args.prompt,
      params: { size: "1024x1024", quality: "high" },
      references: [MARK],
      roles: { [MARK]: "logo" },
      createdAt: new Date().toISOString(),
    }, { render: renderOpenAI });
    toolRecipePath = res.recipePath;
    return { content: [{ type: "text", text: `Generated ${res.assetPath} + recipe ${res.recipePath}` }] };
  },
);
const server = createSdkMcpServer({ name: "aitx", version: "1.0.0", tools: [genTool] });

const r = await run(
  "Generate a simple round AITX sticker: the orange open-arms mark centered on a clean white circle, glossy die-cut look. Use the generate tool once.",
  { mcpServers: { aitx: server }, allowedTools: ["mcp__aitx__generate_aitx_asset"], settingSources: [] },
);

console.log(JSON.stringify({
  imageWritten: existsSync(OUT),
  recipeWritten: existsSync(RECIPE),
  toolRecipePath,
  finalText: r.finalText,
  numTurns: r.numTurns, costUsd: r.costUsd,
}, null, 2));
