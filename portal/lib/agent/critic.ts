// Deterministic brand-compliance critic (TS port of the agent's critic.py).
// Turns "on-brand" into a number the agent can optimize against. Same rules as
// the CLI so the web demo and the batch delta agree.

export type Violation = { rule: string; label: string; match: string; penalty: number };

const BANNED_FILLER = [
  "synergy", "leverage", "unlock", "cutting-edge", "cutting edge",
  "revolutionary", "game-changing", "game changing", "thought leader",
];
const HYPE_FEAR = [
  "you're already behind", "you are already behind", "the future is here",
  "don't get left behind", "dont get left behind",
];
const LOGO_MIXING = [
  "logo lockup", "logo-lockup", "lockup", "lock-up", "lock up",
  "both logos", "two logos", "dual logo", "dual-logo",
  "combine the logos", "combining the logos", "combined logo", "combined branding",
  "partner's logo", "partner logo", "co-branded logo", "co-brand the logo",
  "nvidia logo", "nvidia's logo", "nvidia eye", "logos of both",
  "logos side by side", "logos side-by-side", "side-by-side logos", "merge the logos",
  "logo alongside", "logos alongside", "alongside our logo", "alongside the aitx logo",
  "next to our logo", "next to the aitx logo", "both brands' logos", "both companies' logos",
  "logo next to the", "logos of aitx and",
];
const NON_AITX_SLOGANS = ["ai that works"];

export function scoreText(text: string): { score: number; violations: Violation[] } {
  const t = " " + text.toLowerCase() + " ";
  const violations: Violation[] = [];

  const hit = (rule: string, label: string, needles: string[], penalty: number) => {
    for (const n of needles) {
      if (t.includes(n)) { violations.push({ rule, label, match: n, penalty }); return; }
    }
  };

  if (text.includes("—")) violations.push({ rule: "em_dash", label: "em dash used", match: "—", penalty: 15 });
  hit("logo_mixing", "mixes or combines logos (cardinal rule)", LOGO_MIXING, 40);
  hit("banned_filler", "corporate filler", BANNED_FILLER, 15);
  hit("hype_fear", "sells hype or fear", HYPE_FEAR, 20);
  hit("foreign_slogan", "uses a slogan that is not ours", NON_AITX_SLOGANS, 15);
  if ((text.match(/!/g) || []).length >= 3)
    violations.push({ rule: "exclaim_spam", label: "exclamation spam", match: "!!!", penalty: 10 });

  const score = Math.max(0, 100 - violations.reduce((s, v) => s + v.penalty, 0));
  return { score, violations };
}
