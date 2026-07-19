// EXPERIMENT 13 — multi-turn memory via session resume.
// Turn 1 tells the agent something and captures the session id. Turn 2 resumes
// that session and asks it to recall. Tests conversational continuity (a
// stateful brand agent across messages).

import { query } from "@anthropic-ai/claude-agent-sdk";

let sessionId = "";
for await (const m of query({
  prompt: "Remember this fact for later: my favorite AITX sticker is 'Texas Loves AI'. Just acknowledge in one line.",
  options: { settingSources: [], allowedTools: [] },
})) {
  const msg = m as any;
  if (msg.session_id) sessionId = msg.session_id;
}

let recalled = "";
for await (const m of query({
  prompt: "Which AITX sticker did I just say was my favorite?",
  options: { resume: sessionId, settingSources: [], allowedTools: [] },
})) {
  const msg = m as any;
  if (msg.type === "result") recalled = msg.result ?? "";
}

console.log(JSON.stringify({
  sessionId: sessionId.slice(0, 8),
  recalled,
  rememberedAcrossTurns: /texas loves ai/i.test(recalled),
}, null, 2));
