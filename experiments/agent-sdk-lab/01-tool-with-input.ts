// EXPERIMENT 01 — a tool with a typed (zod) input.
// Tests: the agent reads "Dallas" from the question and passes it as the tool arg.

import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { run } from "./_run.ts";

let received: unknown = null;
const eventDetails = tool(
  "event_details",
  "Look up the venue and time for an AITX event in a given Texas city.",
  { city: z.string().describe("the Texas city, e.g. Austin or Dallas") },
  async (args) => {
    received = args;
    return { content: [{ type: "text", text: `In ${args.city}: Antler office, 6pm, third Thursday.` }] };
  },
);
const server = createSdkMcpServer({ name: "aitx", version: "1.0.0", tools: [eventDetails] });

const r = await run("When and where is the AITX meetup in Dallas? Use your tools.", {
  mcpServers: { aitx: server },
  allowedTools: ["mcp__aitx__event_details"],
});

console.log(JSON.stringify({
  toolArgReceived: received,
  toolCalls: r.toolCalls,
  finalText: r.finalText,
  numTurns: r.numTurns,
  costUsd: r.costUsd,
}, null, 2));
