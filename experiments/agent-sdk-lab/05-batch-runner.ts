// EXPERIMENT 05 — THE KEY ONE: the Agent SDK as a natural-language experiment
// runner over a rule-encoded generate call.
// The `generate_asset` tool is a MOCK (records calls, no image API) so we can
// prove the ORCHESTRATION cheaply: does the agent, from one English sentence,
// fire off N generate calls with sensibly VARIED inputs?

import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { run } from "./_run.ts";

const calls: { type: string; headline: string; accentColor: string }[] = [];
const generateAsset = tool(
  "generate_asset",
  "Generate ONE on-brand AITX asset. Encodes the AITX brand rules. Call once per variation.",
  {
    type: z.enum(["flyer", "meme", "sticker", "social"]),
    headline: z.string().describe("the main headline text"),
    accentColor: z.string().describe("hex accent color; AITX orange is #ff4201"),
  },
  async (args) => {
    calls.push(args);
    return { content: [{ type: "text", text: `Rendered ${args.type} #${calls.length}: "${args.headline}" (${args.accentColor})` }] };
  },
);
const server = createSdkMcpServer({ name: "aitx", version: "1.0.0", tools: [generateAsset] });

const r = await run(
  "Generate 5 hackathon flyer options for AITX. Make each headline punchy and clearly different from the others, and keep the AITX orange accent. Call generate_asset once per option.",
  { mcpServers: { aitx: server }, allowedTools: ["mcp__aitx__generate_asset"] },
);

console.log(JSON.stringify({
  numGenerated: calls.length,
  headlines: calls.map((c) => c.headline),
  accentColors: [...new Set(calls.map((c) => c.accentColor))],
  numTurns: r.numTurns,
  costUsd: r.costUsd,
}, null, 2));
