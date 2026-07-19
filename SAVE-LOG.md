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

2026-07-19T04:58:27Z · 2efb1cc · session save: book+goldens+portal shipped; pivot to rules-encoded generator + provenance captured as resume note

---

## 2026-07-19 (continued) — the generator, the SDK lab, and the live Studio

Delta since 2efb1cc. Everything below is committed.

**Built the generator + provenance spine** (`generator/`): `recipe.ts` (Recipe type, sha256, sidecar path, repo-relative helpers), `generateImageAsset` (injected render), `regenerate` (verifies reference hashes + model), `render-openai.ts` + `cli.ts`. Every generated asset ships a version-controlled recipe. Backfilled recipes for all 8 pre-provenance goldens.

**Extensively tested the Claude Agent SDK** (`experiments/agent-sdk-lab/`, 16 experiments + `LAB-FINDINGS.md`): tools/routing/chaining, filesystem, permissions + hooks, structured output (json_schema), sessions (resume), model selection, the REAL generator integration (agent → gpt-image-2 → image + recipe), VOICE.md application (agent honors the voice), and merch/fashion design from one sentence. Verdict: the SDK is a capable, optional exploration layer over the deterministic generate calls.

**Silver colorway** (`goldens/silver/`) + **all-in-one charger** redesign (built-in Lightning + USB-C + fold-out wall prongs, black + silver) per Gary's product insight.

**Deterministic Remotion flyer template** (`generator/flyer-remotion/`, from Gary's AAS tip): code-defined, byte-reproducible flyers from zod-typed inputs, brand tokens, `<Still>`-per-variant + deterministic recipes.

**AITX Studio — the portal generate experience, LIVE** at `aitx-brand-os.vercel.app`:
- Stage 2a **Flyer Studio** (`/studio/flyer`): client-side, instant, free, no login — a plain-React FlyerLayout captured to PNG via html-to-image. Later made more legible (bigger mark + inline logistics) per Gary.
- Stage 2b **AI Generate** (`/studio/create`): server route → gpt-image-2 with atoms + provenance recipe, gated by an access code (`AITX_GENERATE_CODE` = `aitx-open-arms`; `OPENAI_API_KEY` set on Vercel). Verified live end to end.

Both stages built spec → plan → subagent-driven (all tasks reviewed clean). Reviewers caught two of MY plan bugs (a char-clamp inconsistency, an em dash) + a reproduced Vercel deploy-breaker (openai/zod peer → committed `portal/.npmrc`).

**Tribal knowledge → `~/.agents/AGENTS.md`:** the `.npmrc` legacy-peer-deps Vercel gotcha; the Agent SDK permissions gotcha (allowedTools shadows canUseTool; use a PreToolUse hook; allowedTools = approval not availability); the deterministic-client-side-render technique (React + html-to-image, capture the true-size node).

**Specs/plans added:** `docs/superpowers/specs/2026-07-18-aitx-asset-generator-provenance.md`, `2026-07-19-aitx-studio-generate.md`; `docs/superpowers/plans/2026-07-19-*` (generator spine, flyer studio, AI generate).

**Resume-here (open thread):** Stage 2c — replace the access-code gate with Firebase Google sign-in + roles (viewer/creator/admin). The access code is a real, safe gate today, so 2c is hardening, not a new capability. Spec: `docs/superpowers/specs/2026-07-19-aitx-studio-generate.md` (Stage 2c section). Also outstanding since earlier: wire `invitation.dawsoncarroll.com` DNS for the Dawson site.
2026-07-19T10:24:15Z · d82d7d8 · session save: generator spine + Agent SDK lab (16 exp) + silver/charger + Remotion flyer template + AITX Studio LIVE (flyer + AI generate). Resume: Stage 2c Firebase auth.
