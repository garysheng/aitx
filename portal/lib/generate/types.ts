export type GenKind = "sticker" | "meme" | "product" | "social";

export const IMAGE_SIZE = "1024x1024";

// atoms are paths under the app's public/ (fetched from own origin at request time)
export const GEN_KINDS: { key: GenKind; label: string; hint: string; atoms: string[] }[] = [
  { key: "sticker", label: "Sticker", hint: "A die-cut vinyl sticker.", atoms: ["/assets/logo/aitx-mark.png"] },
  { key: "meme", label: "Meme", hint: "A shareable AITX meme.", atoms: ["/assets/logo/aitx-mark.png", "/assets/founders/michael.png"] },
  { key: "product", label: "Product", hint: "A branded product mockup.", atoms: ["/assets/logo/aitx-mark.png"] },
  { key: "social", label: "Social", hint: "A square social post.", atoms: ["/assets/logo/aitx-mark.png", "/assets/founders/founders-standing.png"] },
];
