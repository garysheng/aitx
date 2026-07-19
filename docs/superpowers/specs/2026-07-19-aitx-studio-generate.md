# AITX Studio — the generate experience

Date: 2026-07-19
Status: for build (Gary delegated judgment; build autonomously with review gates)

## Goal

Add a **generate** experience to the AITX Brand OS portal (`aitx-brand-os`): a
place where an organizer, chapter leader, or partner describes what they need
and gets an on-brand asset, with provenance. Genuinely usable by the community,
deployed, and honest about which engine renders what.

Builds on: the live partner portal (Stage 1), the generator provenance spine
(`generator/`), the deterministic Remotion flyer template
(`generator/flyer-remotion`), and the extensively-tested Agent SDK lab
(`experiments/agent-sdk-lab`).

## The core architectural call (why this shape)

Two generation engines, each deployed where it actually works:

1. **Deterministic assets render CLIENT-SIDE.** A flyer is just React + CSS + the
   mark. So the same brand-token layout renders live in the browser from a form,
   and downloads as a PNG (DOM-to-image). Instant, free, no server, no API key,
   byte-reproducible from the inputs. The inputs *are* the recipe.
2. **Illustrated assets render SERVER-SIDE via the image model.** Stickers,
   memes, product mockups, social art go through a Vercel API route that calls
   gpt-image-2 directly (Node) with the AITX atoms passed as references. ~40s.
   Returns the image and stores a provenance recipe.

What deliberately stays a **local power-tool** (does NOT fit Vercel serverless,
proven tonight): the **Claude Agent SDK experiment-runner** ("generate 10
options in English", editing/committing the brand OS) and **full Remotion
server rendering / video**. These live in `experiments/agent-sdk-lab` and
`generator/flyer-remotion` and run locally where they belong. The deployed page
uses only the browser-render and direct-API paths that deploy cleanly. This is
the honest architecture: deploy what deploys; keep the heavy/agentic tools local.

## Shared, DRY layout

The flyer design lives once as a renderer-agnostic layout so the Remotion still
and the browser studio can never drift:
- `generator/flyer-remotion/src/brand.ts` — the brand tokens (already exists).
- A pure `FlyerLayout({ width, height, props, Img })` component that takes an
  image component (Remotion `<Img>` or a plain `<img>`) — used by both the
  Remotion `<Still>` and the portal's browser studio.

## The three stages (each ships)

### Stage 2a — Flyer Studio (client-side, flagship)
- Route `/studio/flyer` in the portal. A form (event title, kind, date, venue,
  register line, sponsors) + a live preview of `FlyerLayout` at the chosen size
  (square 1080 / wide 1200x630), and a **Download PNG** that captures the preview
  at full resolution. zod-validated inputs. No auth, no API, no cost.
- This is the flagship: an organizer makes a real on-brand event flyer in seconds.

### Stage 2b — AI Generate (server-side image model)
- Route `/studio/create`. Pick a type (sticker / meme / product / social),
  describe it, `/api/generate` composes the prompt + passes the atoms to
  gpt-image-2 (`OPENAI_API_KEY`), returns the image + writes a recipe. ~40s with
  a proper pending state. Download + "how it was made" (the recipe).
- Gated behind sign-in (cost + attribution).

### Stage 2c — Auth + roles
- Firebase Google sign-in. Roles: signed-out = viewer (browse Stage 1 + use the
  free client-side flyer studio); signed-in = creator (can use AI generate);
  allowlisted = admin. Enforced server-side on `/api/generate`.

## Provenance everywhere

- Flyer: the form inputs + template version are the recipe (shown as "made with").
- AI generate: `/api/generate` writes a recipe (exact prompt + model + reference
  hashes) alongside the returned image, using the generator's recipe format.

## Non-goals (v1)

- No Agent SDK in the deployed page (local power-tool only).
- No Remotion server render in the deployed page (client-side for flyers).
- No saving generated assets back into the git repo from the web (download-only;
  committing stays a local/admin action).

## Build order

Stage 2a (flyer studio) → 2b (AI generate) → 2c (auth). Each is its own plan and
deploys to `aitx-brand-os` on merge.
