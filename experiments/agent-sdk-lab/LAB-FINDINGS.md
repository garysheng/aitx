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

## Round 2 — deeper capabilities

| # | Capability | Result |
|---|---|---|
| **09** | **agent drives the REAL generator spine** | ✅ **one sentence → real gpt-image-2 render (with the AITX mark ref) → real on-brand sticker + a full provenance recipe** |
| 10 | `PreToolUse` hook gating | ✅ hook DENIES a tool even when it's in `allowedTools` (the robust gate) |
| 11 | `settingSources: []` isolation | ✅ loads no user settings (no global CLAUDE.md/AGENTS.md inheritance) |
| 12 | structured output (`outputFormat: json_schema`) | ✅ returns clean parseable JSON matching the schema |
| 13 | multi-turn via `resume` | ✅ turn 2 recalls turn 1 ("Texas Loves AI") |
| 14 | model override (`model`) | ✅ runs on Haiku; ~$0.04/task vs ~$1 on Opus (≈25x cheaper) |

### The full stack, proven (09)

From "generate a round AITX sticker" the agent called the REAL
`generateImageAsset` (the spine we built), which passed the actual AITX mark as
a reference, rendered a real on-brand sticker via gpt-image-2, and wrote a
recipe capturing the exact prompt + model + the reference as a **repo-relative
path + sha256 + role**. Natural language → rule-encoded generate call →
reproducible asset. The whole thesis, working end to end.

### More gotchas (round 2)

6. **Two ways to gate an action, use the hook for real safety.** `canUseTool`
   is shadowed by `allowedTools` (round 1). A **`PreToolUse` hook** is NOT — it
   blocks a tool even when auto-approved (experiment 10). So: gate
   publish/commit/spend with a PreToolUse hook (belt), and/or keep them out of
   `allowedTools` (suspenders).
7. **`allowedTools` controls auto-APPROVAL, not AVAILABILITY.** Built-in
   read/search tools (Read, Grep, Glob, Bash) are available even when not
   listed — in experiment 10's first run the agent went filesystem-spelunking
   for a flyer. To restrict what the agent CAN do, use `disallowedTools` (or the
   `tools` allowlist), not `allowedTools`.
8. **Structured output is reliable.** `outputFormat: { type: "json_schema",
   schema }` gives back clean JSON matching the schema — good for having the
   agent return inputs/recipes as data.
9. **Cheap models for cheap tasks.** `model: "claude-haiku-4-5-..."` cut cost
   ~25x on a trivial task. Route by task: Haiku for routing/extraction, a bigger
   model only for the hard creative calls.
10. **When generating, output INTO the repo.** Experiment 09 wrote to `/tmp`, so
    the recipe's `asset` path became an ugly `../../../../../tmp/...`. Reference
    paths were clean repo-relative; asset paths only normalize well when the
    output lives inside the repo.

## Round 3 — the real creative use cases (fashion, merch, voice)

| # | Capability | Result |
|---|---|---|
| **15** | **agent reads & applies `VOICE.md`** | ✅ read the guide and wrote copy with NO em dashes, NO banned filler, and the signature lines ("open arms", "you get a better sense of a person in person") |
| **16** | **agent designs a real merch + fashion line** | ✅ one sentence → 3 real gpt-image-2 product shots (power bank, water bottle, varsity jacket) + 3 provenance recipes, output into the repo |

### Voice (15)

The agent read `universe/brand-os/VOICE.md` and produced on-brand copy that
passed every automated check: no em dashes (a hard rule), none of the banned
corporate filler, and it reached for AITX signature language. So the brand
voice is not just for humans — the agent honors it when generating copy. This
is the copy half of the generator (taglines, event blurbs, captions) and it
works from the same version-controlled source of truth as the art.

### Merch + fashion (16)

From "design a small AITX merch line: a power bank, a water bottle, and a
varsity jacket," the agent wrote three distinct premium studio product-shot
prompts itself, called the real generator for each (AITX mark passed as a
reference so branding is the real mark), and produced `goldens/merch-lab/*.png`
plus a `.recipe.json` for each. The recipes carry clean repo-relative paths
(`asset: goldens/merch-lab/power-bank.png`, mark hashed) — the round-2 lesson
applied. This is the full loop for physical-product design: natural language →
rule-encoded generate call → real on-brand product + reproducible recipe.

### Bottom line

The Agent SDK, on top of the deterministic generator + `VOICE.md`, is a genuine
brand studio you talk to: it designs art, apparel, and merch, and writes on-brand
copy, all from the same version-controlled brand OS, and every output leaves a
recipe. Optional layer, real payoff.
