// Render each sample flyer to a PNG still and write a deterministic provenance
// recipe next to it (template id + version + the exact inputs). Byte-reproducible:
// same brand version + inputs -> same pixels.
// Run: cd generator/flyer-remotion && npx tsx render-samples.ts

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { toRepoRelative, writeRecipe, recipePathFor, type Recipe } from "../recipe.ts";
import { BRAND_VERSION } from "./src/brand.ts";
import { flyerSchema } from "./src/props.ts";
import { SAMPLES } from "./src/samples.ts";

const OUTDIR = path.resolve(process.cwd(), "../../goldens/flyers-remotion");
mkdirSync(OUTDIR, { recursive: true });

for (const s of SAMPLES) {
  const props = flyerSchema.parse(s.props); // validate the inputs
  const out = path.join(OUTDIR, `${s.id}.png`);
  execFileSync(
    "npx",
    ["remotion", "still", s.id, `--props=${JSON.stringify(props)}`, `--output=${out}`, "--log=error"],
    { stdio: "inherit", cwd: process.cwd() },
  );
  const recipe: Recipe = {
    recipeVersion: 1,
    asset: toRepoRelative(out),
    createdAt: new Date().toISOString(),
    generator: { kind: "deterministic", tool: "aitx-flyer-remotion@0.1.0" },
    template: { id: `aitx-event-flyer:${s.id}`, version: BRAND_VERSION },
    inputs: { ...props, width: s.width, height: s.height },
    notes: "Deterministic Remotion still. Byte-reproducible from template version + inputs (system fonts, no external assets beyond the bundled mark).",
  };
  writeRecipe(recipe, recipePathFor(out));
  console.log("rendered + recipe:", s.id);
}
console.log(`\ndone: ${SAMPLES.length} flyers -> goldens/flyers-remotion/`);
