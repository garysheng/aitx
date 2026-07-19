// EXPERIMENT 02 — give the agent 3 tools; it must pick the RIGHT one.
// Tests: routing. Asking about sponsors should call only sponsor_list.

import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { run } from "./_run.ts";

const eventDetails = tool("event_details", "Venue and time for an AITX event in a city.", { city: z.string() },
  async (a) => ({ content: [{ type: "text", text: `${a.city}: Antler, 6pm.` }] }));
const sponsorList = tool("sponsor_list", "The current AITX sponsors.", {},
  async () => ({ content: [{ type: "text", text: "NVIDIA, Meta, Google Cloud." }] }));
const venueCapacity = tool("venue_capacity", "Seat capacity of the Antler venue.", {},
  async () => ({ content: [{ type: "text", text: "About 120." }] }));

const server = createSdkMcpServer({ name: "aitx", version: "1.0.0", tools: [eventDetails, sponsorList, venueCapacity] });

const r = await run("Who currently sponsors AITX?", {
  mcpServers: { aitx: server },
  allowedTools: ["mcp__aitx__event_details", "mcp__aitx__sponsor_list", "mcp__aitx__venue_capacity"],
});

const mcpToolsCalled = r.toolCalls.map((c) => c.name).filter((n) => n.startsWith("mcp__aitx__"));
console.log(JSON.stringify({
  mcpToolsCalled,
  routedCorrectly: mcpToolsCalled.length === 1 && mcpToolsCalled[0] === "mcp__aitx__sponsor_list",
  finalText: r.finalText,
  numTurns: r.numTurns, costUsd: r.costUsd,
}, null, 2));
