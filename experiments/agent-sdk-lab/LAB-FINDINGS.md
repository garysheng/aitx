# Claude Agent SDK — Lab Findings

Extensive hands-on testing of `@anthropic-ai/claude-agent-sdk@0.3.215`, run on
Gary's Claude subscription (`ANTHROPIC_API_KEY` unset), focused on what matters
for AITX: **the Agent SDK as a natural-language experiment runner over
rule-encoded generate calls**, plus the capabilities the brand OS would lean on.

Run any experiment: `cd experiments/agent-sdk-lab && npm install && npx tsx 0X-*.ts`

## What was tested (all ✅ unless noted)

| # | Capability | Result |
|---|---|---|
| hello | basic `query({prompt})` | ✅ answers; final answer is the `result` message |
| hello-tool | one custom tool | ✅ agent chooses to call it |
| 01 | tool with a typed (zod) input | ✅ agent extracts "Dallas" → `{city:"Dallas"}` |
| 02 | 3 tools, must pick the right one | ✅ routes to only `sponsor_list` |
| 03 | two tools in sequence (chaining) | ✅ `next_event_city`→"Houston"→`event_details({city:"Houston"})` |
| 04 | built-in filesystem tools (Read/Write) | ✅ reads `voice.md`, writes `tagline.txt` with real content |
| **05** | **batch experiment-runner (THE vision)** | ✅ **one sentence → 5 `generate_asset` calls with 5 varied headlines, all AITX orange** |
| 06 | permission gate (`canUseTool`) | ⚠️ works ONLY if the tool is NOT in `allowedTools` (see gotcha) |
| 07 | streaming the agent loop | ✅ full trace; agent can call a tool twice in ONE turn (parallel) |
| 08 | programmatic subagent (`agents`) | ✅ delegates via the `Agent` tool to a `headline-writer` |

## The headline result (experiment 05)

From **one English sentence** — "generate 5 hackathon flyer options, vary the
headline, keep AITX orange" — the agent called the (mocked) `generate_asset`
tool 5 times with 5 genuinely different, punchy headlines, every one keeping
`#ff4201`. This is exactly the "generate 10 options" / "try it navy" experiment
runner, sitting on top of a rule-encoded generate call. **The vision works.**

## Gotchas that will bite (design-relevant)

1. **`allowedTools` auto-approves and SHADOWS `canUseTool`.** A tool listed in
   `allowedTools` runs WITHOUT consulting the permission callback (the SDK even
   warns: `CLAUDE_SDK_CAN_USE_TOOL_SHADOWED`). In experiment 06, the "publish"
   tool ran despite a deny handler — until we removed it from `allowedTools`,
   after which `canUseTool` fired and blocked it. **Rule for AITX:** the safe
   tools go in `allowedTools`; any tool that must be gated (publish, commit,
   spend) is left OUT so it falls through to `canUseTool` (or a `PreToolUse`
   hook). This is exactly how we'd enforce "who can publish / commit."

2. **The SDK inherits the user's global Claude instructions.** The spawned
   `claude` subprocess loads `~/.agents/AGENTS.md` and `~/.claude/CLAUDE.md`;
   in several runs the agent tried to `Read ~/.agents/AGENTS.md` "per your
   global instructions." For a clean, predictable brand agent, control
   `settingSources` (omit user settings) so it only follows the brand OS.

3. **MCP custom tools are discovered via a `ToolSearch` step** before first use
   (adds a turn). Harmless, just visible in the loop trace.

4. **Cost/turns are non-trivial.** Each simple task reported ~$0.90–$1.60
   notional and 3–8 turns. On the subscription this is usage, not per-token
   billing — but if ever pointed at the API, a 10-experiment batch is ~$10.
   Budget accordingly; prefer mock tools when testing orchestration.

5. **Auth:** everything ran on the subscription because `ANTHROPIC_API_KEY` was
   unset (the SDK reuses the Claude Code login). Set the key and it bills the
   API instead. `zod v4` is required (v3 fails install).

## What this means for AITX

- **Experiment runner: green-lit.** The SDK reliably fans one intent into N
  rule-encoded generate calls with varied inputs — no rigid UI needed. Wire the
  real `generateImageAsset`/`renderDeterministicAsset` as tools and it becomes
  "generate 10 options" in English.
- **Brand-OS editing: feasible.** Read/Write/Bash + subagents mean the Admin
  "edit the canon and commit" story is well within reach (it's a coding agent).
- **Permissions: use the shadow rule.** Gate publish/commit by leaving them out
  of `allowedTools`; everything else is auto-approved. Clean, enforceable.
- **Keep it optional.** None of this is required for the deterministic generate
  calls themselves — the SDK is the exploration layer ON TOP, exactly as scoped.
