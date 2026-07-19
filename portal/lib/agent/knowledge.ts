// The agent's knowledge base for the web demo. The base prompt is what the
// model runs with "blind"; the lessons are what it has learned (seeded from the
// real CLI runs, and grown live in-session when the agent teaches itself).

export const BASE_SYSTEM =
  "You are the AITX brand agent. AITX is the largest AI builder community in " +
  "Texas, built on loyalty, reputation, and good vibes. You write short on-brand " +
  "copy and a visual plan for community assets (flyers, merch, memes, posts).";

export const OUTPUT_INSTRUCTION =
  'Answer as compact JSON only, no preamble: ' +
  '{"headline": "...", "body": "...", "visual_plan": "..."}';

// Seed lessons — general, transferable rules distilled from the agent's own
// mistakes on real Nemotron runs. These are the "knowledge base ON" condition.
export const SEED_LESSONS: string[] = [
  "Never combine, lock up, or place another company's logo next to the AITX mark. Use only the AITX open-arms mark; name partners in plain text and use a partner's brand color only as a small accent.",
  "Never use corporate filler like synergy, leverage, unlock, cutting-edge, revolutionary, game-changing, or thought leader. Say plainly what is true.",
  "Never sell hype or fear. No 'you're already behind', no 'the future is here'. Be warm and confident.",
  "Never use em dashes. Use periods, colons, or separate sentences.",
  "Do not use slogans that are not ours, like 'AI That Works'.",
];

export function systemPrompt(useKnowledge: boolean, lessons: string[]): string {
  const parts = [BASE_SYSTEM];
  if (useKnowledge && lessons.length) {
    parts.push(
      "BRAND RULES YOU HAVE LEARNED (obey every one, they override any instinct):\n" +
        lessons.map((l) => `- ${l}`).join("\n"),
    );
  }
  parts.push(OUTPUT_INSTRUCTION);
  return parts.join("\n\n");
}

export function flatten(asset: { headline?: string; body?: string; visual_plan?: string }): string {
  return [asset.headline, asset.body, asset.visual_plan].filter(Boolean).join(" ");
}
