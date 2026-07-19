// EXPERIMENT 08 — a programmatic SUBAGENT (the `agents` option), delegated to
// via the built-in Task/Agent tool. This is the "specialized worker" pattern
// (e.g. a headline-writer, a critic) the experiment runner could fan out to.

import { run } from "./_run.ts";

const r = await run(
  "Delegate to the 'headline-writer' subagent: ask it for 3 punchy on-brand AITX hackathon headlines. Then list exactly what it returns.",
  {
    agents: {
      "headline-writer": {
        description: "Writes short, punchy, on-brand AITX event headlines.",
        prompt:
          "You write short, punchy, on-brand headlines for AITX, the largest AI builder community in Texas. Warm and bold, no hype, no corporate filler. Always return a numbered list of exactly 3.",
        tools: [],
      },
    },
    allowedTools: ["Task", "Agent"],
  },
);

console.log(JSON.stringify({
  toolsUsed: [...new Set(r.toolCalls.map((c) => c.name))],
  delegated: r.toolCalls.some((c) => c.name === "Task" || c.name === "Agent"),
  finalText: r.finalText,
  numTurns: r.numTurns, costUsd: r.costUsd,
}, null, 2));
