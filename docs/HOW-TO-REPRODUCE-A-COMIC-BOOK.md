# How to reproduce a comic book from a brand universe

This is the exact, self-contained process we used to generate the AITX origin
story and the two founder biographies (Michael's *Show Up*, Mark Heaps' *Do All
The Things*). Each one took a few minutes of human input and about **20-30
minutes of agent time** once the command fired. Nothing here is a black box: the
whole point of an agentic brand universe is that any asset is **reproducible**.

## The mental model

A comic book is not a one-off. It is a **projection of a version-controlled
universe**. You do not "draw a book." You:

1. build (or fork) a brand universe once, then
2. describe the story, then
3. let the agent render every page from the universe's locked references.

Because the characters, style, and rules are locked references passed on every
image call, page 1 and page 20 look like the same world, and you can regenerate
any page and get the same character back.

## The pieces (what a universe holds)

```
universe/
  canon/entities/          typed records: characters, settings, motifs, props
  reference/<entity>/       the LOCKED art for each entity (the GABRs)
  stories/<story>.json      the story spec: spine, beats, per-beat provenance
```

- **GABR (Golden Atomic Brand Reference):** one locked image per character /
  style / motif. This is the load-bearing idea. A character's canonical look
  lives as an *image*, and that image is passed to the image model on every
  render, so the face never drifts. (See `universe/reference/` in this repo, and
  the write-up at appliedai.wiki/concepts/golden-atomic-brand-references.)
- **Register anchor:** one style reference that sets the illustration look
  (line weight, palette, paper). Passed first on every render.
- **Story spec:** the medium-neutral composition. Its `spine` (e.g. `testimony`,
  `thesis`) and its ordered `beats` are what get turned into spreads.

## The reproducible pipeline

### 1. Stand up (or fork) the universe
Fork an existing universe (`universe/` here) or start one. The canon must
validate green and must refuse to render until real references exist (the
load-bearing gate). Characters that recur (Michael, Jake, Chip, Mark) each get a
locked GABR master in `universe/reference/<id>/`.

### 2. Write the story spec
Words before art. Write the manuscript / beats first and lock the text. Each
beat names the entities in frame. Example beat: *"Michael opens the door to a
warm room of builders"* → entities `[michael-daigler, antler-venue]`.

### 3. Resolve canon for every page
For each spread, resolve every named entity to its locked references. This is
what guarantees consistency: the render prompt for spread N carries the register
anchor + each in-frame character's GABR, not a text description of them.

### 4. Render each spread (the ~20-30 min of agent time)
For each spread, call the image model (`gpt-image-2`) with:
- the **register anchor** first (the style),
- each in-frame **character GABR** (the likeness),
- the **AITX mark** where it appears,
- a short prompt describing only what changes on this page (the scene + any
  baked caption).

Every render writes a **provenance recipe** beside the image: the model, the
exact prompt, and every reference pinned by SHA-256. That recipe is what makes
the page reproducible byte-for-recipe later (see `generator/recipe.ts`).

### 5. Narrate + assemble
Generate narration audio per spread (ElevenLabs), then assemble the manifest +
assets into the shared picture-book reader. Deploy. The books in this submission
run on that shared reader, so a new book is a manifest + a folder of art +
audio, not a new codebase.

## Reproduce it yourself (the commands)

The universe canon lives in `universe/`. The provenance spine is in
`generator/`. To regenerate a single asset from its recipe (verifying every
reference still hashes the same):

```bash
cd generator
npx tsx cli.ts regenerate <path/to/asset.recipe.json>
```

To render a fresh image with the same golden discipline (register + character
refs passed every time), see the worked example in
`experiments/agent-sdk-lab/09-real-generate.ts` and the batch renderers
(`merch-clean.ts`, `17-nvidia-collab.ts`).

The full creative pipeline (manuscript gate, GABRs, subject approval, spread
batches) is documented in the `create-brand-os-picture-book` and `agenticstory`
skills. The key invariant, everywhere: **references carry identity; the prompt
carries only what changes; every output records exactly how it was made.**

## Why this matters

A human could draw a comic book. What they cannot do is draw fifty of them, each
on brand, each in minutes, each reproducible, each editable by talking ("change
Michael's shirt in every panel"). That is the difference between using AI as a
faster intern and running a real agentic brand universe.
