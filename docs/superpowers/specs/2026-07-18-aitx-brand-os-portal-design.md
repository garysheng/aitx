# AITX Brand OS Portal — Design Spec

Date: 2026-07-18
Status: for review

## Goal

A live, genuinely usable one-stop-shop for the AITX brand: browse and download
on-brand assets, generate new on-brand assets from a plain-language brief, and
edit the brand OS itself in plain language with every change version-controlled
in git. Built so the whole AITX community and its partners can actually use it,
and so it demonstrates a Claude-Agent-SDK agent running the brand.

The brand's single source of truth is the `garysheng/aitx` repo: typed canon
(`universe/`), the voice guide (`universe/brand-os/VOICE.md`), and the asset
library (`universe/reference/*` atoms, `goldens/*` molecules).

## The core idea: one agent, role-scoped toolbelt

The portal is a surface over **one brand agent** whose available tools widen
with the user's role. Three faces, one source of truth.

| Face | Who | Tools unlocked |
|---|---|---|
| Partner | signed out (viewer) | `list_assets`, `get_asset`, `read_canon` |
| Generate | any signed-in Google user (creator) | + `generate_asset` |
| Admin | allowlisted email (admin) | + `propose_canon_edit`, `commit` |

## Architecture

Two processes, split by the SDK's runtime constraints (the Claude Agent SDK runs
Claude Code as a subprocess and needs a real filesystem/process; it does NOT run
in Vercel serverless — see the SDK research, 2026-07-18).

```
Vercel: aitx-brand-os (Next.js 16, git-linked, root dir = portal/)
  /                      Partner gallery (SSG) + brand-at-a-glance + downloads
  /generate              Generate UI (creator)
  /admin                 Admin UI (admin) -> talks to the LOCAL agent service
  /api/generate          Tool Runner (Messages API tool-use) -> gpt-image-2
  /api/canon             read canon/goldens for the gallery + agent context
  auth                   Firebase Google sign-in; roles derived (see below)

Local (developer machine, for now): aitx-agent-svc (Node, real Claude Agent SDK)
  POST /edit             { instruction } -> agent clones/reads a working copy of
                         the aitx repo, Edit's canon files, shows a diff, and on
                         approval `git commit && git push`. Returns diff + result.
```

- **Generate** uses the Messages API tool-use loop (Tool Runner), not the full
  Agent SDK — the task is linear (compose an on-brand prompt from atoms, call
  gpt-image-2). Stateless, fits Vercel. The real GABR atoms are passed as
  reference images so the mark and likenesses stay correct.
- **Admin** uses the **real Claude Agent SDK** in a local Node service. It is a
  coding agent editing the actual repo: reads `VOICE.md` / canon JSON, applies
  the requested change, produces a diff, and commits to `github.com/garysheng/aitx`.
  For the demo the service runs on `localhost`; the deployed Admin page (opened
  in the browser on the same machine) calls `http://localhost:PORT` directly, so
  no tunnel is needed. Productionize later by moving the service to a container
  (Modal/Fly) or Managed Agents.
- **Browse/ask** is direct/Tool Runner on Vercel (read-only).

## Auth & roles

- Firebase Auth, Google provider.
- Roles derived, no database:
  - signed out -> **viewer** (browse + download; public).
  - any signed-in Google user -> **creator** (can generate).
  - email in `ADMIN_EMAILS` allowlist -> **admin** (can edit the brand OS).
- Enforced server-side: API routes verify the Firebase ID token and check role
  before running `generate_asset` (creator+) or hitting the agent service (admin).

## Data / the brand OS

Read (and, for admin, written) from the repo:
- `universe/brand-os/VOICE.md` — the voice guide (agent-readable + human-copyable).
- `universe/canon/entities/*.json` — characters, mark, venue, products, group.
- `universe/reference/*` — the **atoms** (mark, founders two-shot + faces, venue
  plates, products), passed as references on generation.
- `goldens/*` — the **molecules** (flyers, IG, memes, stickers) shown in the
  gallery and used as few-shot templates for generation.

The portal reads these at build time (gallery) and at request time (agent
context). A small `lib/brand.ts` manifest maps files -> display metadata +
which atoms compose each golden (to show the atoms->molecules story).

## Generate flow

1. Creator submits `{ type?, brief }` (e.g. "monthly meetup flyer, Dallas, Nov 8").
2. `/api/generate` runs a Tool-Runner loop: Claude selects the template + the
   atoms to pass, and calls the `render` tool.
3. `render` calls gpt-image-2 (`OPENAI_API_KEY`) with the composed prompt + atom
   input images; returns the image.
4. UI shows the result with a download button. (v1: ephemeral, download-only.)

Latency ~30-60s. Set `maxDuration` on the route; use a job/poll pattern only if
we hit timeouts. Guarded behind sign-in to bound cost.

## Admin flow

1. Admin types an edit ("Jake's default is a quarter-zip; keep the tee as an
   alternate; add a no-em-dashes rule to VOICE.md").
2. Admin page calls the local agent service `/edit`.
3. The Agent SDK agent reads the relevant canon/VOICE files, applies the change,
   returns a **diff** for approval.
4. On approve, it commits (and pushes) to the repo. The gallery/canon reflect the
   change on next deploy; the diff is the changelog.

## Build order (MVP-first; each stage ships)

1. **Partner portal** — Next.js scaffold (reuse book config), AITX theme, brand
   -at-a-glance, asset gallery (atoms + goldens + book) with real downloads.
   Deploy `aitx-brand-os`, git-linked. *Shippable, real, immediately useful.*
2. **Auth** — Firebase Google sign-in + role derivation; gate nav.
3. **Generate** — `/api/generate` Tool Runner + gpt-image-2; `/generate` UI.
4. **Admin** — local `aitx-agent-svc` (real Agent SDK) + `/admin` UI + diff/commit.

## Non-goals (v1, YAGNI)

- No saving generated assets back to the repo (download-only).
- No per-user galleries / history.
- No fine-grained per-file permission grants (just viewer/creator/admin).
- No productionized agent host (local service for now).
- No custom domain (use `aitx-brand-os.vercel.app`).

## Risks

- gpt-image-2 latency vs Vercel function limits -> `maxDuration`, tune quality,
  fall back to job/poll if needed.
- Agent SDK commit safety -> the agent works on a clean working copy, shows a
  diff, and only commits on explicit approval; scoped GitHub auth.
- Local-only Admin means the Admin face works only while the local service runs
  (acceptable for the demo; documented).
