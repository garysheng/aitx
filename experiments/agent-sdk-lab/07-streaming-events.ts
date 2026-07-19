// EXPERIMENT 07 — observe the agent LOOP live via the message stream.
// Logs each step (assistant text, tool_use, tool_result) in order, so you can
// see the reason -> call tool -> get result -> reason -> answer cycle.

import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { run } from "./_run.ts";

const rollDie = tool("roll_die", "Roll a fair six-sided die.", {},
  async () => ({ content: [{ type: "text", text: String(1 + Math.floor(Math.random() * 6)) }] }));
const server = createSdkMcpServer({ name: "aitx", version: "1.0.0", tools: [rollDie] });

const trace: string[] = [];
const r = await run(
  "Roll the die twice using the tool, then tell me the sum.",
  { mcpServers: { aitx: server }, allowedTools: ["mcp__aitx__roll_die"] },
  (m: unknown) => {
    const msg = m as any;
    if (msg.type === "assistant") {
      for (const b of msg.message.content) {
        if (b.type === "text" && b.text.trim()) trace.push(`assistant.text: ${b.text.slice(0, 50)}`);
        if (b.type === "tool_use") trace.push(`tool_use: ${b.name}`);
      }
    } else if (msg.type === "user" && Array.isArray(msg.message?.content)) {
      for (const b of msg.message.content) if (b.type === "tool_result") trace.push("tool_result");
    } else {
      trace.push(`(${msg.type})`);
    }
  },
);

console.log(JSON.stringify({ loopTrace: trace, finalText: r.finalText, numTurns: r.numTurns, costUsd: r.costUsd }, null, 2));
