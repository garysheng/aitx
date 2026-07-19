# Loom script — AITX Brand Agent (AITX x NVIDIA Claw Hackathon)

**Format:** film loose (~10-15 min, as many takes as you want), cut to a tight
**~2 min, high energy, green chair, your thing.** Latency doesn't matter — trim
every "Nemotron thinking…" wait in the edit.

**The one-liner (say it your way):** *"An agent that learns your brand's rules
from its own mistakes and never makes them again. Powered by NVIDIA Nemotron. No
retraining."*

**What we're optimizing for (the judges' rubric):**
- Sponsor tech (30): Nemotron is the brain, and you can say *why* (small open
  model, agentic, NIM-served).
- Technical execution (30): a real, live, working system at a URL.
- Value/impact (20): a brand guardrail any team could use tomorrow.
- Frontier (20): it *learns* live, and it's a 9B model punching up.

---

## Pre-roll setup (before you hit record)

- Open the live app full-screen: **https://aitx-brand-os.vercel.app/agent**
  (dark dashboard). Do a warm-up run first so the model is hot.
- Zoom the browser to ~110-125% so text is legible on video.
- Have these two prompts ready to paste (verified deterministic — same result
  every take):
  - **HERO PROMPT (mixes logos blind):** `[[HERO_PROMPT]]`
  - **SECOND PROMPT (voice slip):** `[[SECOND_PROMPT]]`
- Optional: a second tab on the repo `hackathon/brand-agent/` for the "it's all
  real code" beat.

---

## Capture list (film these raw, in any order)

1. **You, to camera** — the hook + the problem + the close (talking-head bits).
2. **Screen: the blind-vs-brain run** — paste HERO PROMPT, hit Generate, let
   both sides land. Left goes red (mixed logos), right stays green.
3. **Screen: teach-it** — on a prompt that slips, click *"Teach the agent from
   this mistake"*, watch a new rule drop into the Knowledge Base, watch it
   re-run clean.
4. **Screen: the aggregate bar** — after a few prompts, the "blind avg → with
   knowledge" delta at the top.
5. **Screen (optional b-roll):** slow scroll of the Knowledge Base list; the
   repo; the `LESSONS.md` the agent wrote itself.

---

## The 2-minute edit (beat sheet)

### 0:00-0:12 — COLD OPEN / HOOK  *(talking head, max energy)*
> "This is an AI agent that just taught *itself* my brand's rules. Watch it
> learn in real time."

Cut straight to a 1-second flash of the red→green fix. Hook first, context
second.

### 0:12-0:30 — THE PROBLEM  *(talking head)*
> "Every team is generating content with AI now. It drifts off-brand fast.
> Yesterday my *own* agent designed a collab and mixed our logo with a partner's
> — a real branding no-no. The fix isn't a better prompt. It's an agent that
> *learns*."

### 0:30-1:05 — DEMO 1: BLIND vs KNOWLEDGE  *(screen)*
- Paste HERO PROMPT, hit Generate. **[edit out the wait]**
- Point at the left: *"Blind — no knowledge — it locks up both logos. Red. The
  critic caught it."*
- Point at the right: *"Same model, but reading the rules it's learned. Clean.
  Green. It named the partner in text instead."*
> "Same Nemotron model. The only difference is what it knows."

### 1:05-1:40 — DEMO 2: THE MAGIC (it learns)  *(screen)*
- On a slip, click **"Teach the agent from this mistake."** **[edit out wait]**
- A rule animates into the Knowledge Base ("just learned").
> "It just distilled its *own* mistake into a general rule, wrote it to its
> memory, and re-ran — clean. No retraining. It will never make that mistake
> again."
- Tap the aggregate bar: *"Across prompts: blind average vs with-knowledge —
  it's measurably smarter."*

### 1:40-1:55 — WHY NEMOTRON  *(talking head or voiceover over screen)*
> "The brain is NVIDIA Nemotron — a small 9-billion-parameter open model, served
> on NIM. Small model, big scaffolding: it matches way bigger models on this
> task because the intelligence lives in the knowledge base, not the weights.
> That's the whole idea."

### 1:55-2:05 — CLOSE  *(talking head, warm + confident)*
> "A brand guardrail that gets smarter every time you use it. It's live right
> now. AITX x NVIDIA. Come build the future with us."

Optional end card: the URL + "Powered by NVIDIA Nemotron."

---

## Energy + delivery notes
- Lead with the wow, explain second. Judges watch a lot of demos; earn the next
  10 seconds in the first 3.
- Say **"Nemotron"** out loud at least twice — sponsor-tech points reward the
  clear "why."
- Warm and confident, not hype. No "you're already behind." (On brand.)
- Keep cuts tight; every dead second is a cut. The 15-min raw becomes 2 min of
  only the good stuff.

## Do-not-forget checklist
- [ ] Say the app is **live at a URL** (real working system).
- [ ] Show a real **red → green** fix on screen.
- [ ] Show the agent **writing its own rule** (the learning).
- [ ] Name **Nemotron + NIM** and the **9B small-model** angle.
- [ ] End with the URL.
