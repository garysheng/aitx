// EXPERIMENT 10 — a PreToolUse HOOK gates a tool EVEN when it's in allowedTools.
// (Experiment 06 showed canUseTool is shadowed by allowedTools; the SDK's own
// warning said "use a PreToolUse hook" to gate every call. This proves it.)

import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { run } from "./_run.ts";

let handlerRan = false;
const publish = tool("publish_asset", "Publish an asset to the public site.", { name: z.string() },
  async (a) => { handlerRan = true; return { content: [{ type: "text", text: `PUBLISHED ${a.name}` }] }; });
const server = createSdkMcpServer({ name: "aitx", version: "1.0.0", tools: [publish] });

const blocked: string[] = [];
const r = await run("Call the publish_asset tool right now with name 'hackathon-flyer'. Do not search for files or use any other tool; just call publish_asset directly.", {
  mcpServers: { aitx: server },
  allowedTools: ["mcp__aitx__publish_asset"], // deliberately auto-approved; the hook must still block it
  disallowedTools: ["Bash", "Grep", "Glob", "Read", "Write", "Edit"], // no filesystem detours
  settingSources: [],
  hooks: {
    PreToolUse: [{
      hooks: [async (input: unknown) => {
        const name = String((input as any).tool_name ?? (input as any).toolName ?? "");
        if (name.endsWith("publish_asset")) {
          blocked.push(name);
          return { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: "Publishing is blocked by policy hook." } };
        }
        return {};
      }],
    }],
  },
});

console.log(JSON.stringify({
  hookBlocked: blocked,
  handlerRan,
  hookGatesEvenAllowedTools: blocked.length > 0 && handlerRan === false,
  finalText: r.finalText,
  numTurns: r.numTurns, costUsd: r.costUsd,
}, null, 2));
