# Agentic Brand Universe — AITX × NVIDIA Claw Agent Hackathon submission

> **A version-controlled home for a brand, with an agent (Chip, the brand czar) that learns its voice and never breaks it.**
> Canon + blessed goldens + rules, plus an agent powered by
> **NVIDIA Nemotron via NIM** that generates anything on-brand *and gets sharper the more it runs* —
> it critiques its own output against the brand rules, and when it slips it writes itself a new rule
> and remembers it. No model retraining. Every asset carries full provenance (model + prompt +
> hash-pinned references), so nothing is a mystery and everything is reproducible.

**Track:** Recursive Intelligence · **Bounties:** Best Use of Nemotron, Most Commercializable (Antler)

**See it live**
- 🎤 **The keynote (start here):** https://aitx-brand-os.vercel.app/keynote — the full argument, co-presented by Gary + Chip.
- 🤖 **The learning agent, live:** https://aitx-brand-os.vercel.app/agent — give it a task, watch it slip, teach it, watch it fix itself. Real Nemotron.
- 💼 **The business:** https://aitx-brand-os.vercel.app/platform
- 💌 **On-brand sponsor thank-yous:** https://aitx-brand-os.vercel.app/thanks
- 📖 **Proof — books Chip made in ~30 min each:** https://show-up-book.vercel.app · https://do-all-the-things-book.vercel.app · https://aitx-origin.vercel.app

**Where the Nemotron code lives**
- `portal/app/api/agent/route.ts` — Nemotron (NIM) generation + self-critique + the learning step.
- `portal/lib/agent/` — the deterministic brand-rule critic (the metric) + the knowledge base.
- `hackathon/brand-agent/` — the CLI + the measured recursive-intelligence delta (`demo.py`) + writeup (`README.md`).
- `generator/` — the provenance spine (every asset ↔ its exact recipe).

---

# AITX — a story universe

> **The vision:** [`VISION.md`](VISION.md) — AITX as an agentic story OS: one version-controlled, human/machine/partner-legible brand source of truth, editable in plain language.

Michael Daigler's AITX universe, built on the [Agentic Story](../agenticstory) framework (spec v0.2). The **universe is the first-class object**: a typed, git-versioned canon (`universe/`) where every reference is load-bearing. Books, flyers, speaker cards, and any other projection are queries over this canon that write back into it.

## Canon so far (incremental)

- **`aitx`** (group) — the community: largest AI builder community in Texas, warm/human/bold, exact palette `#ff4201 / #010101 / #ffffff`.
- **`michael-daigler`** (character · realPerson) — founder. Locked: master + face macro + poses + back turnaround (tee back = Texas + "Texas loves AI"). Stays **gated** on his blessing for any property.
- **`jake-oshea`** (character · realPerson) — cofounder, a foot taller. Locked: default VC quarter-zip wardrobe (plain back) + casual tee alternate; face + poses + back.
- **`founders`** — the locked two-shot (correct one-foot height gap), the anchor for any scene with both.
- **`aitx-mark`** (motif) — the sacred logo; load-bearing on every render (`reference/aitx-mark/aitx-logo.png`).
- **`antler-venue`** (setting · LOCKED), **`aitx-skylark`** + **`aitx-merch`** (props).
- **`origin-of-aitx`** (story · full) — the first property, spine `testimony`.

## Properties (molecules)

- **`books/origin-of-aitx/`** — *The Origin of the AITX Community*, a narrated flip-book (13 spreads + cover + closing). Live: **https://aitx-origin.vercel.app** (Vercel project `aitx-origin`, git-linked; `git push` auto-deploys).
- **`goldens/`** — the blessed base-asset library (flyers, IG post, memes, stickers). See `goldens/README.md` for the atoms→molecules brand-OS vision.

## Working with it

From the engine (`../agenticstory/engine`), pointed at `universe/`:

```bash
U=../../aitx/universe
python3 -m agenticstory.cli validate     "$U"     # structural check (green)
python3 -m agenticstory.cli list         "$U"     # the canon
python3 -m agenticstory.cli assert-spread "$U" --characters michael-daigler
#   -> refuses until michael's real GABR art exists (the load-bearing gate)
```

## How it grows (the incremental loop)

1. Add a canon entity or relation (a new person, setting, motif, doctrine) as a typed record; keep `validate` green.
2. Register a property as a `stub` (title + spine), then promote to `full` (features + beats + per-beat provenance + register) when it is real.
3. Lock references (art, photos, the register anchor); the gate refuses to render until they exist.
4. A finished property **writes back** new/updated canon. Every change is a commit; the diff is the changelog.

Real-subject rule: any property featuring Michael stays gated until he blesses the words and the art.
