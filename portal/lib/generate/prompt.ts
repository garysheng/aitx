import type { GenKind } from "./types";

const STYLE =
  "AITX brand style: clean confident design, AITX orange #ff4201 with black and white. The AITX open-arms mark is the real mark from the reference image, never typed letters.";

const TEMPLATES: Record<GenKind, (brief: string) => string> = {
  sticker: (b) => `A single die-cut vinyl STICKER, product shot, centered on a plain light neutral background, glossy finish with a clean white die-cut border and soft drop shadow. ${STYLE} The sticker: ${b}. One sticker only, no sheet. Crisp, correctly spelled.`,
  meme: (b) => `A shareable AITX MEME, square, in the AITX comic brand style. ${STYLE} ${b}. Bold, legible, correctly-spelled caption text in the classic meme style. Wholesome and on-brand.`,
  product: (b) => `A premium studio PRODUCT SHOT of AITX-branded merch, three-quarter hero angle, clean neutral background with a soft shadow. ${STYLE} The product: ${b}. Looks like real premium merch.`,
  social: (b) => `A square Instagram-ready SOCIAL POST in the AITX brand style. ${STYLE} ${b}. Bold, punchy, correctly-spelled headline. Instagram-ready composition.`,
};

export function buildGenPrompt(kind: GenKind, brief: string): string {
  const clean = brief.trim().replace(/\s+/g, " ").slice(0, 400) || "an on-brand AITX asset";
  return TEMPLATES[kind](clean);
}
