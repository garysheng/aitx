// EXPERIMENT 14 — model override. Run the same trivial task on a cheaper model
// (Haiku) to confirm the `model` option works and to see the cost/turn delta.

import { run } from "./_run.ts";

const r = await run("In exactly five words, welcome someone to AITX.", {
  model: "claude-haiku-4-5-20251001",
  settingSources: [],
  allowedTools: [],
});

console.log(JSON.stringify({
  model: "claude-haiku-4-5-20251001",
  finalText: r.finalText,
  numTurns: r.numTurns,
  costUsd: r.costUsd,
}, null, 2));
