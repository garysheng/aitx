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

---

## 2026-07-19 (session 3) — brand rules earned, clean merch line, then a hackathon pivot

Delta since 051a8b6. All committed.

**Two brand rules learned the hard way** (`9e3598f`, in `universe/brand-os/BRAND-RULES.md` + global AGENTS.md):
- **Never mix logos.** Built an AITX x NVIDIA collab drop with logo lockups + NVIDIA's eye-logo; Gary: "mixing logos is almost NEVER ok." A collab is words + accent color, only our own mark on the piece. Collab drop (`45ed73e`) scrapped.
- **Golden = human-approved.** Had committed agent output straight into `goldens/`; Gary: "GOLDEN requires HUMAN APPROVAL." New `explorations/` folder stages candidates; a human blessing promotes to `goldens/`. Both READMEs spell out the gate.

**Clean AITX merch line — LOCKED IN as goldens** (`c1b71d8`, `goldens/merch/`): 8 premium mark-only pieces (hoodie, natural tee, dad hat, enamel mug, all-in-one power bank, matte tumbler, canvas tote, beanie), no slogans, each with a provenance recipe. Gary blessed them → the golden gate working as designed.

**Michael "it's all in the Notion" hackathon FAQ meme — golden** (`44f6b95`, `goldens/memes/notion-faq.png`): warm community-organizer meme, Michael pointing to an AITX Hackathon FAQ Notion page. First-pass, clean text.

**Reusable pattern proven:** the embedded agent as CREATIVE DIRECTOR — one sentence + VOICE.md → structured JSON plan (drop name, per-piece copy + image prompt) → fan out all renders in PARALLEL through the generator spine, each with provenance. Experiments `agent-sdk-lab/17-nvidia-collab.ts`, `merch-clean.ts`, `merch-nvidia.ts`.

**Open threads (resume in a few hours):**
1. **NVIDIA x AITX co-brand merch** — 5 candidates in `explorations/nvidia-aitx-merch/` (`0322509`) awaiting Gary's **A** (green-accent-only) vs **B** (accent + tiny text credit) call. My lean: A.
2. **Dangling wiki page** — `supersuit-repos/appliedai-wiki/docs/concepts/golden.md` was written (HARD definition of "golden" + significance) but is UNCOMMITTED and unpublished: still needs its mandatory hero comic + `pnpm build` + explicit publish. Not touched by this save (public-surface = explicit ask only).
3. **NOW PIVOTED to the AITX x NVIDIA Claw Agent Hackathon** (Gary is competing; code freeze Sun 11am). Goal: win a prize by swapping the Claude Agent SDK for **Nemotron** (served via **vLLM**/NIM) and framing the compounding golden library as a Recursive Intelligence entry. Brand work resumes after.
2026-07-19T13:41:10Z · 0322509 · brand rules (never mix logos, golden=human-approved) + clean merch goldens + Notion meme; pivoting to Nemotron hackathon. Resume: co-brand A/B, wiki golden.md, then hackathon.

---

## 2026-07-19 (session 4) — the hackathon build marathon: studios, self-serve keynote, and Chip filing real PRs

Delta since 0322509. All committed. This session turned the submission from "a keynote + a demo" into a full, self-serve, working brand OS.

**The keynote is now the one self-serve page that has everything** (`portal/app/keynote/`):
- Chip narrates all 16 slides in his own ElevenLabs Texan voice; "▶ Play the tour with Chip" auto-advances when each clip ends (Presenter.tsx). 15 static clips in `public/assets/keynote/audio/`.
- Embeds the AITX origin book (iframe) on the page; the story flows into an embedded **Brand OS Explorer** (Explorer.tsx): the cast, the goldens, the rules, the provenance chain, and cards into every live tool.
- **Provenance chain**: real photos (shared with Michael/Jake/Mark's consent) → locked illustrated character. Mark Heaps added as a canon character ("trusted partner, head of developer community at NVIDIA").

**Two new generative studios (live, working systems):**
- **Meme Studio** (`/studio/memes`): pick cast (Michael/Jake/Chip) + template + caption → gpt-image-2, gated by the access code, provenance recipe.
- **Event Flyer Studio** (`/studio/events`): the AITX Luma golden as a **deterministic version-controlled template** — meetup/co-working/hackathon/hack-fair/free-form, per-city skylines (Austin/Houston/Dallas, generated + keyed), sponsor select + upload, html-to-image download.

**Provenance-first home page** (`/`, GoldenGallery.tsx + generated `lib/goldens.ts`): all 26 goldens, uniform aligned cards, each with a **slide-out provenance sidebar** (model + exact prompt + hash-pinned references, generated from the real recipes).

**Chip files real pull requests (the honesty win):** `/agent`'s "Make it permanent" button calls `app/api/learn-pr/route.ts`, which opens a real GitHub PR adding the learned rule to `universe/brand-os/LEARNED-RULES.md`. A human merges it (the golden gate). Verified end-to-end (PR #1 opened + closed). Also added an honest per-session-persistence note to `/agent` so we don't overclaim to judges.

**Assets:** the "jagged frontier" thesis golden; the Loom-feedback comic strip (`explorations/comics/`, for Gary's LinkedIn); transparent default logo (keyed white out).

**Submission doc** (`hackathon/SUBMISSION.md`): humanized single-post X copy (VOICE.md applied), Descript demo link, repo link, the full Nemotron bounty answer, and the ⚠️ don't-pick-NemoClaw note.

**Tribal knowledge worth remembering (not yet in a skill):**
- ElevenLabs: a fresh **professional** voice clone (Gary's `yffqtNJ84E8Jjz7BeGaF`) returns `voice_not_fine_tuned` until fine-tuning completes (hours); instant clones work with `eleven_multilingual_v2`, pro clones need to finish training. Chip uses `OjnJBCejJlol0Ps2wkAK` + `eleven_v3`.
- gpt-image-2 does NOT support `--background transparent` on the edit endpoint (400). To get a transparent asset, render on a solid bg and chroma-key, or render on the exact target bg color.
- Sponsor-logo whitening for dark/mauve grounds: key the white bg to transparent, keep dark content, then CSS `filter: brightness(0) invert(1)`. SVG wordmarks that render invisible usually have explicit `fill="white"` (or inherit `fill="none"` from the root) — sed those to a dark fill before rasterizing.
- The agent's "learns/compounds" claim MUST be honest for technical judges: the browser demo KB is per-session; real persistence is the PR → human-merge → committed file. Overclaiming silent GitHub auto-updates reads as a scam; a PR that a human merges IS the golden gate.

**Resume-here (open threads):**
1. Two background sub-agents may still be finishing (or were stopped): the "agentic brand universe ends slop" story book on the garysheng-books platform. Check for a completion notification / the live URL.
2. `/thanks` sponsor-logo option (add a logo/image to the thank-you card) — not yet built.
3. Wire all sponsor logos into the brand OS on-demand (Apify added; Featherless/Supabase still missing files).
4. Gary's pro voice clone: swap Chip (or add a Gary-narrated track) once `yffqtNJ84E8Jjz7BeGaF` finishes fine-tuning.
5. `/meta-coherence-check` was requested at the end of this session — run it as the next task.
