// The dumbest possible Claude Agent SDK program.
// Ask it something, print the answer. That's it.
//
// It uses your Claude Code login (your subscription) — no API key needed.
//
// Run:  npm install   then   npm run hello

import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "In one sentence, tell me what you are. Then tell me a short joke.",
})) {
  // The stream emits several message types; the final answer is "result".
  if (message.type === "result") {
    console.log(message.result);
  }
}
