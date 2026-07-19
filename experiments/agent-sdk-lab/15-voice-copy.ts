// EXPERIMENT 15 — does the agent honor VOICE.md?
// The agent reads universe/brand-os/VOICE.md, then writes on-brand copy. We
// then check it followed the guide: no em dashes, no banned filler words, and
// it reaches for AITX signature language.

import { run } from "./_run.ts";
import path from "node:path";

const REPO = path.resolve(process.cwd(), "../..");

const r = await run(
  "Read universe/brand-os/VOICE.md in this repo. Then write FOUR on-brand AITX taglines and ONE two-sentence event blurb that strictly follow that voice guide, including every rule in its do/don't list. Return them as a plain numbered list, nothing else.",
  { cwd: REPO, allowedTools: ["Read"], settingSources: [] },
);

const text = r.finalText;
const banned = ["synergy", "leverage", "unlock", "cutting-edge", "revolutionary", "game-changing", "thought leader"];
const bannedUsed = banned.filter((b) => new RegExp(b, "i").test(text));

console.log(JSON.stringify({
  readVoiceFile: r.toolCalls.some((c) => c.name === "Read"),
  hasEmDash: text.includes("—"),
  bannedWordsUsed: bannedUsed,
  usesSignatureLanguage: /you get a better sense of a person in person|open arms|largest ai builder community|showing up/i.test(text),
  copy: text,
  numTurns: r.numTurns, costUsd: r.costUsd,
}, null, 2));
