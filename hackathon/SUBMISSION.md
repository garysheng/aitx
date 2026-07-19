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
