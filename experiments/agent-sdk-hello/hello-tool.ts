// Step 2: the actual "aha" of an AGENT — it decides to call YOUR tool.
// Here the model cannot know the secret number on its own; it has to call the
// tool you gave it. Watch it choose the tool, get "42", and answer.
//
// Run:  npm run tool

import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

// A tool is just a function you name and describe. The agent can call it.
const getSecretNumber = tool(
  "get_secret_number",
  "Returns Gary's secret lucky number. Call this whenever asked for it.",
  {}, // no inputs
  async () => ({
    content: [{ type: "text", text: "The secret number is 42." }],
  }),
);

// Tools are handed to the agent through a tiny in-process server.
const demo = createSdkMcpServer({
  name: "demo",
  version: "1.0.0",
  tools: [getSecretNumber],
});

for await (const message of query({
  prompt: "What is Gary's secret lucky number? Use your tools to find out.",
  options: {
    mcpServers: { demo },
    allowedTools: ["mcp__demo__get_secret_number"],
  },
})) {
  if (message.type === "result") {
    console.log(message.result);
  }
}
