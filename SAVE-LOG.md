# AITX — Save Log

Incremental save anchors for this workspace. Newest at the bottom.

---

## 2026-07-18 — session summary

**Shipped this session:**
- **The book** — *The Origin of the AITX Community*: narrated flip-book, 13 spreads + cover + closing, one-narrator listen-along. Live at **https://aitx-origin.vercel.app** (Vercel `aitx-origin`, git-linked, root `books/origin-of-aitx/site`). Spreads 1-2 are pre-founding (no AITX merch, younger faces); all captions bottom-right.
- **Founders canon** — Jake re-styled to the default VC quarter-zip (+ small chest mark, plain back); casual tee kept as `-casual` alternate. Founders two-shot locked at a believable ~one-foot height gap. Back turnarounds added (Michael tee back = Texas + "Texas loves AI"; Jake plain). `universe/brand-os/VOICE.md` added (agent-readable + human-copyable).
- **Goldens** (`goldens/`) — hackathon + monthly-meetup flyers, IG post, 2 memes (incl. the Uncle Sam "submit before the deadline"), 3 stickers. Each a molecule composed from the atoms.
- **Repo → GitHub** — private `github.com/garysheng/aitx` (holds real people's photos).
- **Portal Stage 1** — AITX Brand OS partner portal, live at **https://aitx-brand-os.vercel.app** (Vercel `aitx-brand-os`, git-linked, root `portal/`). Brand-at-a-glance + downloadable library of every atom + golden, with atoms→molecules lineage. Built via subagent-driven dev (5 tasks, all reviewed clean; whole-branch review clean).
- **Agent SDK Hello World** — `experiments/agent-sdk-hello/` (runs on Gary's Claude subscription).

**Specs/plans:** `VISION.md`, `docs/superpowers/specs/2026-07-18-aitx-brand-os-portal-design.md`, `docs/superpowers/plans/2026-07-18-aitx-brand-os-partner-portal.md`.

**Key decisions / tribal knowledge (also in ~/.agents/AGENTS.md):**
- Claude Agent SDK: needs zod v4; runs on the Claude subscription when `ANTHROPIC_API_KEY` is unset (it spawns the `claude` CLI); does NOT run on Vercel serverless.
- Vercel subdir deploys: `vercel git connect <explicit-url>` + set `rootDirectory` via REST API.
- Every image passes the real AITX logo as a reference so the mark renders as the mark.

**THE PIVOT (open thread — most important):** Gary reframed the portal direction near the end.
- A download-shelf portal has a fuzzy consumer. The real product is a **rules-encoded asset generator** (like his encounter-site / Apostle flyer generator).
- **Rules live in code** (deterministic generate calls: palette, fonts, logo placement, layout) — reproducible by construction; LLM optional.
- **Provenance is first-class:** every generated asset ships a version-controlled recipe = exact prompt/template + inputs + **model** + every reference (path + hash). Answers "how did you make that?". The encounter generator has none of this — it's the gap to fill.
- **Agent SDK sits ON TOP, optional:** a natural-language experiment runner over the rule-encoded calls ("generate 10 options", "try it navy"), not welded to a UI.

**Next obvious step:** spec the **generate-call + recipe/provenance format** first (the reusable core both the deterministic renderer and the Agent-SDK experiment layer build on). Then decide deterministic (next/og-style, code-enforced brand) vs image-model (recipe-recorded) per asset type.

**Uncommitted at save:** none after this commit. Local portal dev server was running on :3500 for review (the two UI fixes: trimmed non-stretched logo + Download buttons pinned to card bottom). Fixes committed locally, NOT pushed (no deploy requested).

Checkpoint: see line below.
