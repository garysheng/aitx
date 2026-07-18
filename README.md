# AITX — a story universe

Michael Daigler's AITX universe, built on the [Agentic Story](../agenticstory) framework (spec v0.2). The **universe is the first-class object**: a typed, git-versioned canon (`universe/`) where every reference is load-bearing. Books, flyers, speaker cards, and any other projection are queries over this canon that write back into it.

## Canon so far (v0, incremental)

- **`aitx`** (group) — the community: largest in-person AI community in Texas, warm/human/bold, exact palette `#ff4201 / #010101 / #ffffff`.
- **`michael-daigler`** (character · realPerson) — founder. Correctly **gated**: no property featuring him renders until his photo stack + blessing + GABR art exist.
- **`aitx-mark`** (motif) — the sacred logo; the real file resolves load-bearing (`reference/aitx-mark/aitx-logo.png`).
- **`origin-of-aitx`** (story · stub) — the first property, spine `testimony`. Provisional; Michael shapes the premise, beats, and register.

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
