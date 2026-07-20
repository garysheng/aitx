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
2026-07-19T18:33:16Z · ccf22dd · session 4: 2 studios + self-serve Chip-narrated keynote + provenance gallery/sidebar + Chip files real PRs (verified) + README refresh. Resume: /meta-coherence-check, /thanks logo, story sub-agent link.

---

## 2026-07-19 (session 5) — the ontology clicks + three original works born

Delta since c8fd6ef. This stretch reframed the whole thing and spun up three new artifacts (via sub-agents), plus a keynote tie-in.

**The ontology, locked** (now in VISION.md, to propagate to the agenticstory SPEC):
- **Agentic Brand Universe** = the CARTRIDGE (data): a portable, version-controlled brand (canon + goldens + rules). What the standard/spec defines.
- **Agentic Brand OS** = the CONSOLE/runtime (software): loads a universe, generates any on-brand deliverable with provenance. The "AITX Brand OS" IS this. (Gary was right to name it that.)
- **Projection/deliverable** = the OUTPUT (book, flyer, merch, meme, thank-you). Agentic storytelling is ONE projection; agentic brand management is the rest.
- Cartridge + console → anything. Chip = the agent persona of an OS instance.

**Chip files real pull requests — verified live.** Opened + closed test PR #1 against garysheng/aitx. GITHUB_TOKEN set on Vercel (encrypted) + portal/.env.local (gitignored). The honest persistence path: agent proposes rule → PR → human merges (golden gate) → `universe/brand-os/LEARNED-RULES.md`.

**Keynote closing "open standard" band** (`7f06faf`): AITX framed as one Agentic Brand Universe (cartridge) + Agentic Brand OS (console), with the universe→OS→deliverables diagram, linking agenticbranduniverse.com.

**Three original works born this session (all grounded, none faked):**
1. **"Every Brand, Alive"** — LIVE at books.garysheng.com/every-brand-alive. A warm fable (Rosa the lantern-maker) rendering the anti-slop thesis; 12 spreads, narrated, 193/193 tests green. (garysheng-books repo, by sub-agent.)
2. **soulsoftech.com** — LIVE at soulsoftech.vercel.app. Landing site for the Souls of Tech micro-bios (Mark Heaps + Michael), "demo of agentic brand universe power" framing. (souls-of-tech repo.) DNS: A `@`→76.76.21.21, CNAME `www`→cname.vercel-dns.com.
3. **Loom-feedback comic** (aitx/explorations/comics) for Gary's LinkedIn.

**README refreshed** (last save) + VISION.md ontology (this save). Loom comic saved.

**Tribal knowledge → global AGENTS.md:** parallelize image jobs but NOT sub-agents editing the same repo (git collisions — use one sequential agent or worktree isolation); use SendMessage to refine a running sub-agent's brief; don't rename/move a repo while a sub-agent is pushing/Vercel-linking it.

**Resume-here (open threads):**
1. **RENAME the agenticstory repo → `agentic-brand-universe`** — QUEUED, blocked on the running sub-agent (which is pushing + Vercel-linking garysheng/agenticstory). Do it the moment that agent reports done: `gh repo rename`, fix the local remote, re-point the Vercel git connection.
2. Two sub-agents still running: **agenticbranduniverse.com** (build + push + make public + git-link Vercel) and **Jordan Hill + Will Preble** Souls of Tech books. Surface their URLs + DNS when they land.
3. Propagate the ontology (cartridge/console/projection) into the agenticstory `SPEC.md` framing once that repo is free of the sub-agent.
4. Still un-built: `/thanks` sponsor-logo option; Gary's pro voice clone (`yffqtNJ84E8Jjz7BeGaF`) once fine-tuning completes; `/meta-coherence-check` (requested twice).
5. Gary to add DNS at Namecheap for soulsoftech.com (+ agenticbranduniverse.com when it lands).
2026-07-19T18:55:49Z · d12f360 · session 5: ontology locked (universe=cartridge/OS=console/projection) + Chip PRs verified + keynote standard band + 3 works (Every Brand Alive, soulsoftech.com, Loom comic). Resume: rename agenticstory repo after sub-agent, propagate ontology to SPEC.

---

## Session 6 — 2026-07-19 (marathon, cont. from d12f360)

All aitx work through **414282a** (+ cross-repo). A second Claude session edited aitx/portal concurrently all session; pushes were serialized via explicit-path commits + rebase.

**AITX keynote & Brand OS:**
- Keynote: loop/kiosk toggle; hero (slide 1) rewritten as an informative distillment, not gratitude (NVIDIA×AITX logo lockup dropped per never-mix-logos); blunt slop→brand-damage copy (slides 3–4); slide-14 book cards → horizontal rows; slide-7 concept cards (Canon/Goldens/The agent) got on-model square illustrations; **new slide 17** — Chip introduces **Joy** + the mascot question, narrated in Chip's voice (chip-17.mp3); OG share card (og.png) + full share tags.
- **Joy** = the AITX open-arms mark as an *animated logo* (NOT yet crowned mascot). Blessed g4-hero-joy-longlegs-c. Locked entity + multi-angle reference matrix (front/3q-left/3q-right/turn) so the split holds in scenes. Chip-jealous-of-Joy scene on slide 17 (rendered passing 3 Joy angles + the mark). Lesson: dynamic walking/jumping poses collapse Joy's split legs into anatomical legs — avoid.
- Coherence fixes: honest mock(+58)-vs-live(+7) results labeling; reconciled spec version; seeded LEARNED-RULES.md.
- Origin book: anime edition re-rendered provenance-correct (all 15 from scene prompts) + reader Comic/Anime toggle + "show the prompt" panel (aitx-origin.vercel.app).
- Fixed Explorer provenance chain: Michael's "real photos" were the Antler venue; swapped in real Michael photos. Gary label → "applied AI engineer + AITX fan".

**The standard (agenticstory → agentic-brand-universe):** authored **BRAND-OS-SPEC.md v0.1** (engine spec, framed as early draft); site thesis → "Every brand SHOULD be a version-controlled universe its agent can render on demand."

**Other surfaces:** PeonPing Agentic Brand Universe (github.com/PeonPing/brand-universe, validates green, tavern intentionally unlocked); Souls of Tech books Jordan + Will LIVE (uncommitted, subject blessing pending); appliedai.wiki brand-OS concept + perspective pages; "Every Brand, Alive" in garysheng-books.

**Tribal knowledge → global AGENTS.md (this session):** provenance is mandatory (recipe alongside every asset); restyle sets re-render FROM source prompts (never image-to-image); **use the universe prompt-factory skills** (canon-resolve → render → render-readback / generate-a-brand-os) and NEVER render a mark/logo or canon character without passing its real reference.

**Resume-here (open threads):**
1. **Coherence sweep** was running at save time (5 parallel report-only agents: aitx, standard, souls-of-tech, appliedai-wiki, peonping+books). Read findings and act on judge-visible items.
2. **Souls of Tech** books on disk are LIVE but UNCOMMITTED; real subjects (Jordan, Will) haven't personally blessed words/likeness — get blessing before promoting; commit when Gary says.
3. **Joy mascot decision** is intentionally open (keynote poses the question).
4. **Spec-version split**: prose/site say v0.5, aitx universe.json conformsTo v0.4 — decide whether AITX re-conforms to v0.5 (only if actually re-validated).
5. DNS to add: soulsoftech.com, agenticbranduniverse.com. Swap Gary's pro voice clone (yffqtNJ84E8Jjz7BeGaF) into Chip once fine-tuned.

2026-07-19T21:40:41Z · 414282a · session 6: Joy the animated logo + slide 17, OS spec v0.1, anime edition + reader toggle, keynote polish (hero/slop/cards/OG), Michael provenance fix, prompt-factory rule. Coherence sweep running; SoT books uncommitted + blessing pending.

### Session 6 cont. — coherence sweep, shareability, licenses, Souls of Tech live

Since 414282a, all pushed:
- **Coherence sweep** (5 parallel report-only audits) → clean fixes: aitx reconciled to **v0.4 + agenticbranduniverse.com** (validator confirms aitx is a v0.4 universe; the current engine rejects it under v0.5's changed `approval` schema, so v0.4 is the honest claim; standard itself is v0.5); `BRAND-OS-SPEC.md` dead ref removed + site now links the OS spec; appliedai.wiki `agentic-brand-os` def-line aligned to the console/runtime ontology (was still calling the OS "the machine-consumable package" = the cartridge) + em dash.
- **universe.md generator** (`generator/universe-md.py` → `universe/UNIVERSE.md`), wired in README, reads `prose.lore` so every entity renders a description.
- **Site-wide OG shareability**: every aitx page now serves `og-site.png` (6 pages were blank; Next.js replaces-not-merges openGraph, so each page defining its own needed the image added). Verified live.
- **README honesty**: softened the "hash-pinned references" sidebar claim (sidebar shows names; recipes pin by hash).
- **MIT LICENSE** on the standard repo + aitx (PeonPing already had one).
- **Souls of Tech honesty pass** (Jordan + Will personally blessed, relayed by Gary): their story `subjectApproval` → "approved (relayed by Gary)"; landing banner now discloses these are AI-rendered tributes to real people shared with each subject's blessing; committed 8615b87 + **deployed live to soulsoftech.com** (repo has NO git remote — deployed Vercel-direct).
- **reallife.wiki** "Build from first principles" page shipped (on-style illustrations via the locked render-page.sh pipeline). NOTE: the whole wiki is behind Vercel deployment protection (401 to all) — deployed but not public.
- **Mobile keynote polish** (nav rail / Chip bubble / Explorer rows fixed on phones).
- **Validation**: aitx submission fully live, all assets resolve, live Nemotron generation+critic loop works.

**Resume-here (updated):**
1. **souls-of-tech has no git remote** — deployed Vercel-direct; give it a GitHub remote + git-connect so changes deploy on push. Decide public vs private (holds real-people dossiers).
2. **reallife.wiki is behind Vercel deploy protection** (not public) — flip when ready.
3. Deferred: strengthen the critic to catch off-brand palette (a behavioral change to the judged demo — hold until post-judging or on Gary's go).
4. Open: Joy mascot decision; keynote mobile body 20→18px (Gary's taste).

2026-07-20T00:19:43Z · 4a19678 · session 6 cont.: coherence fixes, OG shareability, universe.md, MIT licenses, Souls of Tech honesty live, reallife page, mobile keynote. Submission validated live + Nemotron working.
