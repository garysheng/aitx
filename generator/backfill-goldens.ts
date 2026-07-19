// Backfill provenance recipes for the goldens generated before the recipe
// system existed. Prompts/refs are reconstructed from the build session; each
// recipe is marked so a reader knows it was recorded after the fact, not
// captured live. Run: cd generator && npx tsx backfill-goldens.ts

import { statSync, existsSync } from "node:fs";
import path from "node:path";
import { toRepoRelative, buildRepoRelativeReferences, writeRecipe, recipePathFor, type Recipe } from "./recipe.ts";

const REPO = path.resolve(process.cwd(), "..");
const ref = (p: string) => path.join(REPO, p);
const LOGO = "universe/reference/aitx-mark/aitx-logo.png";
const ALCOVE = "universe/reference/antler/alcove-live-1.png";
const TWO = "universe/reference/founders/founders-standing.png";
const MF = "universe/reference/michael-daigler/gabr-michael-face.png";
const JF = "universe/reference/jake-oshea/gabr-jake-face.png";
const MM = "universe/reference/michael-daigler/gabr-michael.png";

type Item = { asset: string; size: string; prompt: string; refs: [string, string][] };

const ITEMS: Item[] = [
  { asset: "goldens/flyers/hackathon.png", size: "1024x1536",
    refs: [[LOGO, "logo"], [ALCOVE, "venue:antler"]],
    prompt: "Bold event POSTER / flyer, portrait, in the AITX brand style: energetic modern poster design, AITX orange #ff4201 + black + white, clean strong hierarchy, comic-illustration meets graphic poster. HEADLINE (baked, big, legible): 'AITX HACKATHON'. Subhead: 'Build the future in a weekend'. A lively hackathon scene at the Antler office (use the venue reference) with builders at laptops and orange energy behind the type. The AITX open-arms mark (from the logo reference) rendered as the real mark, prominent. Details block at the bottom: 'ANTLER, AUSTIN, TX' / 'REGISTER ON LUMA' and a small sponsor strip feel. Make all text crisp and correctly spelled." },
  { asset: "goldens/flyers/monthly-meetup.png", size: "1024x1536",
    refs: [[LOGO, "logo"], [ALCOVE, "venue:antler"]],
    prompt: "Event POSTER / flyer, portrait, AITX brand style: warm inviting poster design, AITX orange #ff4201 + black + white, clean hierarchy. HEADLINE (baked, big, legible): 'AITX MONTHLY MEETUP'. Subhead: 'Austin's AI builder community'. A warm community scene at the Antler office (use the venue reference), builders mingling and demoing, the AITX open-arms mark (from the logo reference) rendered as the real mark, prominent. Details block at the bottom: 'ANTLER, AUSTIN, TX' / 'THIRD THURSDAY, 6PM' / 'FREE, REGISTER ON LUMA'. All text crisp and correctly spelled." },
  { asset: "goldens/social/instagram-post.png", size: "1024x1024",
    refs: [[TWO, "founders-two-shot"], [MF, "face:michael"], [JF, "face:jake"], [LOGO, "logo"]],
    prompt: "Square Instagram post, AITX brand style: bold, punchy, AITX orange #ff4201 + black + white, comic-illustration + clean type. The two AITX founders (use the FIRST reference two-shot for correct heights/faces/wardrobe: Michael shorter with mustache + low bun + black AITX tee; Jake taller with short beard + charcoal quarter-zip + tan chinos) standing confident, the orange AITX open-arms mark (from the logo reference) above/beside them as the real mark. Bold baked headline: 'THE LARGEST AI BUILDER COMMUNITY IN TEXAS'. Small handle '@aitx' in a corner. Crisp correctly-spelled text, Instagram-ready composition." },
  { asset: "goldens/memes/uncle-sam-submit.png", size: "1024x1024",
    refs: [[MM, "character:michael"], [MF, "face:michael"], [LOGO, "logo"]],
    prompt: "SQUARE meme poster, classic 'Uncle Sam, I Want YOU' recruitment-poster composition, AITX comic brand style, orange #ff4201 + black + white, orange sunburst background. LAYOUT: the headline 'I WANT YOU' is a CLEAN bold horizontal band across the VERY TOP, with clear space beneath it; BELOW it, with a clear gap, Michael Daigler as Uncle Sam (mustache + low man-bun; match the face reference) points his index finger DIRECTLY at the viewer. He wears a PLAIN orange-and-white striped top hat with NO logo and a black AITX tee (the ONLY logo in the image is the aitx mark + wordmark on the tee). Bottom band: 'TO SUBMIT BEFORE THE DEADLINE'. No other text, no footer. Correctly spelled." },
  { asset: "goldens/memes/pov-found-aitx.png", size: "1024x1024",
    refs: [[MM, "character:michael"], [MF, "face:michael"], [LOGO, "logo"]],
    prompt: "Square wholesome, funny internet MEME in the AITX comic brand style, AITX orange + black + white. Image: Michael Daigler (stocky, mustache + low man-bun, black AITX tee; match the face reference) with warm open arms welcoming, a small orange AITX open-arms mark (from the logo reference) in the scene. Meme text baked in the classic top/bottom bold white caption style with black outline: TOP: 'POV: YOU JUST FOUND THE LARGEST'. BOTTOM: 'AI BUILDER COMMUNITY IN TEXAS'. Light, wholesome, shareable. Text crisp and correctly spelled." },
  { asset: "goldens/stickers/aitx-mark.png", size: "1024x1024",
    refs: [[LOGO, "logo"]],
    prompt: "A single die-cut VINYL STICKER, product shot, centered on a plain light neutral background, with the classic glossy sticker look and a clean white die-cut border and soft drop shadow. The sticker art is the AITX open-arms mark (from the logo reference, rendered as the exact orange #ff4201 mark) with the word 'aitx' in clean lowercase beside it. ONE sticker only, no sheet, no other stickers. Crisp." },
  { asset: "goldens/stickers/texas-loves-ai.png", size: "1024x1024",
    refs: [[LOGO, "logo"]],
    prompt: "A single die-cut VINYL STICKER, product shot, centered on a plain light neutral background, glossy sticker look with a clean white die-cut border and soft drop shadow. The sticker art: a bold orange silhouette of the STATE OF TEXAS with 'TEXAS LOVES AI' lettering integrated, plus a small AITX open-arms mark (from the logo reference, exact orange mark). ONE sticker only, no sheet. Crisp, correctly spelled." },
  { asset: "goldens/stickers/built-in-texas.png", size: "1024x1024",
    refs: [[LOGO, "logo"]],
    prompt: "A single die-cut VINYL STICKER, product shot, centered on a plain light neutral background, glossy sticker look with a clean white die-cut border and soft drop shadow. The sticker art: a round badge with the AITX open-arms mark (from the logo reference, exact orange #ff4201 mark) at the center and the text 'BUILT IN TEXAS' curving around the badge. ONE sticker only, no sheet. Crisp, correctly spelled." },
];

let written = 0;
for (const item of ITEMS) {
  const abs = path.join(REPO, item.asset);
  if (!existsSync(abs)) { console.warn("MISSING asset, skipping:", item.asset); continue; }
  const roles: Record<string, string> = {};
  for (const [p, role] of item.refs) roles[ref(p)] = role;
  const recipe: Recipe = {
    recipeVersion: 1,
    asset: toRepoRelative(abs),
    createdAt: statSync(abs).mtime.toISOString(),
    generator: { kind: "image-model", tool: "aitx-generator@0.1.0" },
    model: "openai:gpt-image-2",
    prompt: item.prompt,
    params: { size: item.size, quality: "high" },
    references: buildRepoRelativeReferences(item.refs.map(([p]) => ref(p)), roles),
    notes: "Recipe reconstructed from the build session (pre-provenance); prompt is faithful to what was used, createdAt is the file mtime.",
  };
  writeRecipe(recipe, recipePathFor(abs));
  written++;
  console.log("wrote recipe for", item.asset);
}
console.log(`\nbackfilled ${written}/${ITEMS.length} golden recipes`);
