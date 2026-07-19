# Claude Agent SDK — Hello World

The smallest possible thing, to learn the SDK with zero portal complexity.
Runs locally, uses your **Claude Code login (your subscription)** — no API key.

## Prereqs

- You're logged into Claude Code (you are). The SDK spawns the `claude` binary
  and reuses that auth.
- **Do not** set `ANTHROPIC_API_KEY` — if it's set, the SDK bills the API
  instead of using your subscription. (`unset ANTHROPIC_API_KEY` if unsure.)

## Run

```bash
cd experiments/agent-sdk-hello
npm install
npm run hello   # dumbest: ask -> print answer
npm run tool    # the "aha": the agent calls YOUR custom tool
```

If it ever asks you to authenticate, run `claude` once, log in, then re-run.

## What each teaches

- **hello.ts** — `query({ prompt })` returns a stream of messages; the final
  answer is the `result` message. That's the whole loop.
- **hello-tool.ts** — you define a `tool()`, hand it to the agent, and it
  *decides* to call it. This is the difference between "a chatbot" and "an
  agent": it uses tools you give it. Everything the portal needs
  (`generate_asset`, `read_canon`, `commit`) is just more tools like this one.
