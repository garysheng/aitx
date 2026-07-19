// EXPERIMENT 03 — a task that needs TWO tools in sequence (chaining).
// The agent must call next_event_city (-> "Houston"), then feed that into
// event_details. Tests: the agent chains tool output into the next tool input.

import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { run } from "./_run.ts";

const nextEventCity = tool("next_event_city", "The Texas city hosting the NEXT AITX event.", {},
  async () => ({ content: [{ type: "text", text: "Houston" }] }));

let detailsArg: unknown = null;
const eventDetails = tool("event_details", "Venue and time for an AITX event in a given city.", { city: z.string() },
  async (a) => { detailsArg = a; return { content: [{ type: "text", text: `${a.city}: Ion District, 6:30pm.` }] }; });

const server = createSdkMcpServer({ name: "aitx", version: "1.0.0", tools: [nextEventCity, eventDetails] });

const r = await run("Where and when is the NEXT AITX event? Use your tools to find out.", {
  mcpServers: { aitx: server },
  allowedTools: ["mcp__aitx__next_event_city", "mcp__aitx__event_details"],
});

const order = r.toolCalls.map((c) => c.name).filter((n) => n.startsWith("mcp__aitx__"));
console.log(JSON.stringify({
  callOrder: order,
  chainedCityIntoDetails: (detailsArg as any)?.city === "Houston",
  finalText: r.finalText,
  numTurns: r.numTurns, costUsd: r.costUsd,
}, null, 2));
