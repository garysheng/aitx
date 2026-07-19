# Agentic Brand Universe

### AITX × NVIDIA Claw Agent Hackathon submission

> **A version-controlled home for a brand, with an agent (Chip, the brand czar) that learns its voice and never breaks it.** Powered by **NVIDIA Nemotron via NIM**, Chip generates anything on-brand *and gets sharper the more it runs*: it critiques its own output against the brand's rules, and when it slips it distills a new rule and **opens a pull request** to add it to the version-controlled brand. A human merges it (the golden gate). No model retraining, no silent commits. Every asset carries full provenance, so nothing is a mystery and everything is reproducible.

**Track:** Recursive Intelligence · **Bounties:** Best Use of Nemotron · Most Commercializable (Antler)

## For judges

- **Try the working system (2 min):** [aitx-brand-os.vercel.app/agent](https://aitx-brand-os.vercel.app/agent) — click an example, watch Nemotron's first try go off-brand, teach it once, watch it fix itself. Then hit **"Make it permanent"** and Chip **opens a real pull request** with the rule it learned. Live Nemotron, real PRs, not a mockup.
- **Take the self-serve tour:** the [keynote](https://aitx-brand-os.vercel.app/keynote) is narrated end-to-end by Chip in his own voice (hit "Play the tour with Chip"). It flows into an embedded **Brand OS Explorer**: the cast, the goldens, the rules, and every live tool, on one page.
- **Browse the provenance:** the [home gallery](https://aitx-brand-os.vercel.app) shows all 26 goldens; click "How it was made" on any of them for a slide-out sidebar with the exact model, prompt, and hash-pinned references.
- **The engineering** is the [recursive-intelligence loop](#how-it-works-the-recursive-intelligence-loop) below: Nemotron generates, a deterministic critic scores, the agent distills each mistake into a rule, and opens a PR to persist it. Code map at the bottom.

### Honest note on persistence
In the live `/agent` demo, the in-browser knowledge base sharpens as you use it and resets on refresh — it shows the *mechanism* live. The **real** persistence path is the pull request: Chip proposes the rule, a human reviews and merges, and it becomes a committed file in the version-controlled brand OS (`universe/brand-os/LEARNED-RULES.md`). Every rule the agent ever learned is a git diff. No overclaiming.

## ▶ Start here: [aitx-brand-os.vercel.app/keynote](https://aitx-brand-os.vercel.app/keynote)

A ~5-minute keynote, co-presented by me and Chip (in his own voice), built entirely from the AITX brand universe.

![Gary at the AITX x NVIDIA hackathon, rendered into the AITX universe](portal/public/assets/keynote/gary-hackathon.jpg)

---

### The whole idea, in one picture

Same event graphic. On the left: raw AI, no system — garbled text, stock clip-art, un-branded, unrepeatable. On the right: the same thing made by Chip from the AITX universe — on brand, correct, reproducible, sponsors and all.

| Without a brand universe | With the Agentic Brand Universe |
|:---:|:---:|
| ![off-brand raw AI graphic](portal/public/assets/keynote/hack-fair-before.jpg) | ![on-brand golden flyer](portal/public/assets/keynote/hack-fair-after.jpg) |

---

### Meet Chip, the brand czar

<img src="portal/public/assets/keynote/chip-joy.jpg" width="360" alt="Chip, the AITX brand czar" />

Chip holds the canon, the blessed "goldens," and the rules. Michael and Jake don't call me for assets anymore — they talk to Chip. He does the making; they stay in charge of taste.

---

### See it live

- 🏠 **[The Brand OS home](https://aitx-brand-os.vercel.app)** — all 26 goldens, each with a provenance sidebar (model + exact prompt + hash-pinned refs).
- 🎤 **[The keynote](https://aitx-brand-os.vercel.app/keynote)** — the self-serve tour, narrated by Chip, ending in the embedded Brand OS Explorer.
- 🤖 **[The learning agent](https://aitx-brand-os.vercel.app/agent)** — teach it a rule; it opens a real pull request. Live Nemotron.
- 🎟️ **[Event Flyer Studio](https://aitx-brand-os.vercel.app/studio/events)** — the AITX Luma flyer as a version-controlled template: pick event, city (per-city skylines), and sponsors, download deterministically.
- 😂 **[Meme Studio](https://aitx-brand-os.vercel.app/studio/memes)** — make a meme with Michael, Jake, and Chip (gpt-image-2, provenance recipe).
- 💌 **[Sponsor thank-yous](https://aitx-brand-os.vercel.app/thanks)** — Chip writes them; you record them in your voice.
- 💼 **[The platform / business](https://aitx-brand-os.vercel.app/platform)** — GitHub for brand universes.
- 📖 **Proof — books made in ~30 min each:** [Show Up (Michael)](https://show-up-book.vercel.app) · [Do All The Things (Mark Heaps of NVIDIA)](https://do-all-the-things-book.vercel.app) · [AITX origin story](https://aitx-origin.vercel.app) · reproduce one yourself: [`docs/HOW-TO-REPRODUCE-A-COMIC-BOOK.md`](docs/HOW-TO-REPRODUCE-A-COMIC-BOOK.md)

### How it works (the recursive-intelligence loop)

Not a wrapper. Every task runs a closed loop where Nemotron both makes the work *and* judges it, and the brand's knowledge compounds:

```mermaid
flowchart LR
    R["Plain-language<br/>request"] --> G["Nemotron<br/>generates asset<br/>(strict JSON)"]
    G --> C["Deterministic<br/>brand-rule critic<br/>(turns 'on-brand'<br/>into a score)"]
    C -->|clean| OUT["On-brand asset<br/>+ provenance recipe<br/>(model, prompt,<br/>hash-pinned refs)"]
    C -->|violation| D["Nemotron distills<br/>the mistake into a<br/>general, reusable rule"]
    D --> PR["Opens a PULL REQUEST<br/>to the brand OS repo"]
    PR -->|human merges<br/>(the golden gate)| KB[("Version-controlled<br/>knowledge base<br/>LEARNED-RULES.md")]
    KB -->|grounds every<br/>future request| G
```

- **Nemotron does two jobs:** generate the asset, and (when the critic flags it) distill the specific mistake into a durable, general rule.
- **The critic is deterministic** — it turns "on-brand" into a number the agent optimizes against, so improvement is *measured*, not claimed.
- **The knowledge base is the intelligence, and it persists honestly.** The agent does not silently commit — it opens a pull request; a human merges it. From then on it's a version-controlled file, and every rule it ever learned is a git diff. No model retraining.
- **Every asset is reproducible** — its recipe pins the model, exact prompt, and the references by hash.

### Where the Nemotron code lives

| Path | What |
|---|---|
| `portal/app/api/agent/route.ts` | Nemotron (NIM) generation + self-critique + the learning step |
| `portal/app/api/learn-pr/route.ts` | Chip opens a real GitHub pull request with a learned rule (the golden gate) |
| `portal/lib/agent/` | the deterministic brand-rule critic (the metric) + the knowledge base |
| `portal/app/studio/events` + `lib/events` | the deterministic event-flyer template (Luma golden fork) |
| `portal/app/studio/memes` + `app/api/meme` | the founder + Chip meme generator (gpt-image-2 + provenance) |
| `portal/lib/goldens.ts` + `components/GoldenGallery.tsx` | the provenance gallery, generated from the real recipes |
| `hackathon/brand-agent/` | the CLI + the measured recursive-intelligence delta (`demo.py`) + full writeup |
| `generator/` | the provenance spine — every asset ↔ its exact recipe |
| `docs/HOW-TO-REPRODUCE-A-COMIC-BOOK.md` | the reproducible comic-book pipeline |
| `hackathon/SUBMISSION.md` | the hackathon submission answers |

### Run the demo yourself

```bash
# the measured recursive-intelligence delta, on real Nemotron
cd hackathon/brand-agent
echo "NIM_API_KEY=nvapi-..." > .env      # free key at build.nvidia.com
uv run demo.py                            # or: uv run demo.py --mock  (no key)

# the web app (keynote + live agent)
cd portal && npm install && npm run dev   # http://localhost:3000/keynote
```

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
- **`aitx-agent`** aka **Chip** (character) — the AITX brand mascot personified: a warm cream-white helper robot with an open-arms welcome. Carries the brand's **audio atom**: ElevenLabs `voiceId OjnJBCejJlol0Ps2wkAK`. Chip's voice is the brand's real voice DNA — see `brand-voice.json`.
- **`brand-voice.json`** (audio atom) — the portable voice-DNA sidecar (`mascot_name`, persona, `elevenlabs_voice_id`) that lets external tools generate on-brand audio in Chip's voice, e.g. PeonPing sound packs via the `brand-to-peon-packs` generator.
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
