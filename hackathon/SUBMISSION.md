# AITX × NVIDIA Claw Agent Hackathon — Submission

Copy-paste each field into the submission form. Fields marked **[YOU]** need your input.

---

## Project Name

Agentic Brand Universe

## Submission Description

Agentic Brand Universe: a version-controlled home for a brand, with an agent that learns its voice and never breaks it. Most teams use generative AI as a faster intern — one-off prompts, generic output, a brand that drifts a little more with every asset. An Agentic Brand Universe is different: the brand is a version-controlled system of canon, blessed "golden" assets, and rules, plus an agent (we call ours Chip, the brand czar) that generates anything on-brand and gets sharper the more it runs. Powered by NVIDIA Nemotron (via NIM), the agent generates a piece, critiques its own output against the brand's rules, and when it slips it writes itself a new rule and remembers it — measurably fewer violations run over run, no model retraining. We built a real, working universe for the AITX community: a narrated origin book, a full merch line, memes, sponsor thank-yous in the agent's own voice, and two more books spun up in about 30 minutes each. Every asset carries full provenance (model + prompt + the exact references, hash-pinned) so nothing is a mystery and everything is reproducible. Live at aitx-brand-os.vercel.app.

---

## Demo Video Link (Loom, max 5 min)

**[YOU]** Paste your Loom URL. (The co-presented keynote at /keynote — hit Present, teleprompter on your other screen.)

---

## Which track are you submitting for?

**Recursive Intelligence Track**

(Chip measurably improves at staying on-brand across successive runs. The learning mechanism is a self-written, version-controlled rulebook: retrieval-from-self-context, no retraining.)

---

## Are you applying for any Bounty(s)?

- Best Use of Nemotron
- Most Commercializable Hack (Antler)

> ⚠️ NOTE: Do NOT select "Best Use of NemoClaw + Open Shell." That bounty requires
> building on NVIDIA's NemoClaw stack and authoring a real OpenShell YAML sandbox
> policy — we did not use those. Select only the two above.

---

## Please describe how your submission applies to the bounty(s)

**Best Use of Nemotron:** Nemotron (via NIM) is the core of the agent, not a chatbot layer. It does three inference jobs on every task — it generates the on-brand asset as structured output, critiques its own output against the brand's rules, and distills each mistake into a durable, reusable rule it reads next time. We maximize it with strict JSON output, retrieval-grounded generation from a self-written rulebook, and a deterministic critic that turns "on-brand" into a score the agent optimizes against. The result: measurably fewer brand violations run over run, with no model retraining. Code: portal/app/api/agent/route.ts and hackathon/brand-agent/.

**Most Commercializable Hack:** Every brand, agency, creator, and church needs endless on-brand content and can't keep it consistent at scale. The Agentic Brand Universe is GitHub for brands: build one once, then fork it, rent it, and generate unlimited on-brand assets forever. Creators earn on every fork and rental (Shopify / GitHub economics). Live pitch: aitx-brand-os.vercel.app/platform.

---

## Describe what Nemotron is doing in your application, why it was the right choice, and how it contributes to your project's value, AI quality, impact, and differentiation

What Nemotron does: Nemotron (served via NVIDIA NIM) is the reasoning core of the Agentic Brand Universe. On every task it does three distinct inference jobs: (1) generate — turn a plain-language request into a structured, on-brand asset (headline, body, visual plan as strict JSON); (2) self-critique — read its own output back against the brand's rules and a deterministic critic; and (3) learn — when it slips, distill that specific mistake into a short, general, reusable rule and write it to a version-controlled rulebook it reads on every future task. It also writes warm, on-voice sponsor thank-yous and long-form narrative for the picture books.

Why it was the right choice: This is an always-on, inference-heavy loop — repeated generation plus self-critique, run after run. That is exactly the agentic workload Nemotron is built for: an open model, fast and NIM-deployable, so the whole system runs on open infrastructure instead of being locked to a hosted frontier API. Its strong instruction-following is what makes the rule-enforcement reliable — it obeys the brand rulebook precisely, which is the entire mechanism.

AI quality: We don't leave quality to chance. Output is grounded (retrieval of the self-written rulebook), constrained (strict JSON), and measured — a deterministic brand-rule critic turns "on-brand" into a score the agent optimizes against. The measurable result: brand violations drop and clean-on-first-pass output rises run over run, with no model retraining. The floor gets higher the more it runs.

Value and impact: Every brand, agency, creator, and church needs endless on-brand content and can't keep it consistent at scale. Nemotron makes on-brand generation reliable and cheap enough to be a real product — a brand guardrail that gets stricter and sharper over time, on open infrastructure. We proved it end to end: a narrated origin book, a full merch line, memes, voiced sponsor thank-yous, and two more books spun up in about 30 minutes each.

Differentiation: Most demos use a big model once and call it done. Ours is a small-footprint open model plus strong scaffolding — a recursive-intelligence loop where the intelligence lives in a compounding, version-controlled knowledge base, not the weights. Every asset also carries full provenance (model + prompt + hash-pinned references), so nothing is a mystery and everything is reproducible.

---

## List Team Members

Gary Sheng - **[YOU: LinkedIn URL]** - gary@hyperagentlabs.com

(Solo team.)

---

## Github Repo

https://github.com/garysheng/aitx

---

## X/Twitter post link

**[YOU]** Paste your post link. Suggested post below (tag @AITXCommunity and @NVIDIAAI).

---

## Any other final thoughts to share about the Hackathon?

Everything in the demo was generated from the AITX brand universe itself — including the keynote you're watching, my character, and Chip the brand czar. Thank you for an incredible weekend.

---

# Suggested X/Twitter post

I built an Agentic Brand Universe for @AITXCommunity — a version-controlled brand with an agent (Chip, the brand czar) that learns its voice and won't break it.

Powered by @NVIDIAAI Nemotron: it makes on-brand assets, critiques its own work against the rules, and gets sharper every run. No retraining.

Everything (this keynote, my character, Chip) was made from the universe itself.

🎤 aitx-brand-os.vercel.app/keynote

---

# Quick links (for reference)

- Keynote: https://aitx-brand-os.vercel.app/keynote
- Live agent: https://aitx-brand-os.vercel.app/agent
- Platform pitch: https://aitx-brand-os.vercel.app/platform
- Thank-yous: https://aitx-brand-os.vercel.app/thanks
- Repo: https://github.com/garysheng/aitx
- Books: https://show-up-book.vercel.app · https://do-all-the-things-book.vercel.app · https://aitx-origin.vercel.app
