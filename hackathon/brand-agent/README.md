# AITX Brand Agent — an agent that gets sharper the more it runs

**Tracks/bounties:** Recursive Intelligence · Best Use of Nemotron

A Claw agent that learns a brand's rules from its own mistakes and measurably
stops repeating them. Its memory is a real, version-controlled brand OS (the
AITX brand OS: `BRAND-RULES.md`, `VOICE.md`, a curated golden library) plus a
`LESSONS.md` it writes for itself. Inference runs on **NVIDIA Nemotron via NIM**.

## The measured result (no model retraining)

Same held-out suite of design requests, scored by a deterministic brand-rule
critic, before and after the agent learns from a training queue. Two runs, both
honest and clearly labeled — the live one is the real number.

**Live on Nemotron** (`nvidia/llama-3.3-nemotron-super-49b-v1` via NIM) — this
is the real result, and what `RESULTS.md` records:

| Phase | Avg score /100 | Brand violations | Clean outputs |
|---|---|---|---|
| Baseline (blind) | 84 | 6 | 2/6 |
| After self-learning | 91 | 2 | 4/6 |
| **Delta** | **+7** | **−4** | **+2** |

Nemotron is already fairly on-brand cold, so the live headroom is smaller — the
point is that it *measurably* improves from its own distilled lessons, with no
retraining.

**Mock harness** (`demo.py --mock`, no API key) — a deliberately cold baseline
that isolates the mechanism end to end and proves the pipeline:

| Phase | Avg score /100 | Brand violations | Clean outputs |
|---|---|---|---|
| Baseline (blind) | 35 | 24 | 0/6 |
| After self-learning | 93 | 1 | 5/6 |
| **Delta** | **+58** | **−23** | **+5** |

The larger mock delta comes from a worst-case cold start, not a better model; it
exists to show the full loop working without a key. In both runs the model never
changed weights — it got better because its persistent context got better. Run
`demo.py` (live) or `demo.py --mock` to reproduce either table.

## What Nemotron is doing (and why it's the right model)

Nemotron is the reasoning core, doing three inference jobs on every heartbeat:

1. **Generation** — turn a design request into structured on-brand copy + a
   visual plan (`{headline, body, visual_plan}` JSON).
2. **Self-distillation** — turn a critic finding ("you mixed two logos") into a
   crisp, reusable rule written into `LESSONS.md`. This is the learning step.
3. **Grounded regeneration** — read the lessons it taught itself and produce
   cleaner output next time.

Why Nemotron specifically: this is an **always-on, inference-heavy loop** —
repeated generation plus self-critique on a heartbeat, run after run. That is
exactly the agentic workload Nemotron (open, fast, NIM-deployable) is built for,
and it lets the whole system run on open infrastructure instead of a hosted
frontier API. We maximize it with (a) strict JSON output, (b) a feedback loop
that grounds each run in self-learned rules (retrieval of `LESSONS.md`), and
(c) a deterministic critic that turns "quality" into a number the agent can
optimize against — the small-model-plus-good-scaffolding punch.

## Why it's a Claw agent

- **Proactively autonomous** — `heartbeat.py` initiates work off a queue, no
  human message required.
- **Heartbeat-driven** — it wakes on an interval, checks queue state, acts, then
  waits. Trigger is time + state, not a prompt.
- **Persistent with context** — `LESSONS.md` (learned rules) and `runs.jsonl`
  (history) survive across ticks and restarts; the agent is sharper every time
  it comes back online.

## The recursive-intelligence mechanism

```
request → Nemotron generates → critic scores → on a miss, Nemotron distills
a durable lesson → LESSONS.md grows → next run reads the lessons → fewer misses
```

Experience compounds into a knowledge base; decision quality rises over
successive runs. The classic arc: blind on run one, sharp by the end, no
retraining.

## Run it

```bash
# real Nemotron (get a free nvapi-... key at build.nvidia.com)
export NIM_API_KEY=nvapi-xxxxxxxx
export NEMOTRON_MODEL=nvidia/llama-3.3-nemotron-super-49b-v1   # or another Nemotron

uv run demo.py           # the before/after delta → writes RESULTS.md
uv run heartbeat.py --interval 5   # the always-on Claw loop

# prove the pipeline with no key:
uv run demo.py --mock
```

## Files

| File | Role |
|---|---|
| `agent.py` | Nemotron (NIM) inference + one run + the learning step |
| `critic.py` | deterministic brand-rule scorer (the metric) |
| `brand_context.py` | the knowledge base + KB modes (cold / learned / rules / warm) |
| `heartbeat.py` | the autonomous, heartbeat-driven Claw loop |
| `demo.py` | the before/after recursive-intelligence delta harness |
| `LESSONS.md` | rules the agent taught itself (grows at runtime) |
| `{train,eval}_tasks.jsonl` | training queue + held-out eval suite |

## Value beyond the hackathon

Every brand, agency, and creator team fights output drift as generation scales.
This is a drop-in **brand guardrail that learns**: it keeps AI output on-brand
and gets stricter and cheaper to run over time, on open infrastructure. The
memory is a plain-language, version-controlled brand OS a human can read and
edit — so the loop stays legible and correctable.
