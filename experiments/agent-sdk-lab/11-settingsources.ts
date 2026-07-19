// EXPERIMENT 11 — isolation. Default runs inherit ~/.claude/CLAUDE.md +
// ~/.agents/AGENTS.md (earlier runs even tried to Read AGENTS.md). With
// settingSources: [] the agent should load NONE of that. Run both and compare
// how many tool-use attempts each makes on a trivial no-tools question.

import { run } from "./_run.ts";

async function countToolAttempts(settingSources?: ("user" | "project" | "local")[]) {
  const attempts: string[] = [];
  await run("In one short sentence, what is 2 plus 2?", { ...(settingSources ? { settingSources } : {}), allowedTools: [] }, (m: unknown) => {
    const msg = m as any;
    if (msg.type === "assistant") for (const b of msg.message.content) if (b.type === "tool_use") attempts.push(b.name);
  });
  return attempts;
}

const isolated = await countToolAttempts([]);       // load no settings
const inherited = await countToolAttempts(undefined); // default (loads user settings)

console.log(JSON.stringify({
  isolated_toolAttempts: isolated,
  default_toolAttempts: inherited,
  isolationReducesSideEffects: isolated.length <= inherited.length,
}, null, 2));
