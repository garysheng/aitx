// Direct batch (no agent): clean, premium AITX merch — the orange open-arms mark
// only, NO slogans or messages. One mark, ours, per the brand rule. Renders all
// items in PARALLEL through the generator spine, each with a provenance recipe,
// into explorations/ (candidates, not goldens).

import { existsSync, mkdirSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import path from "node:path";
import { generateImageAsset, type RenderFn } from "../../generator/generate-image.ts";

const execFileP = promisify(execFile);
const REPO = path.resolve(process.cwd(), "../..");
const MARK = path.join(REPO, "universe/reference/aitx-mark/aitx-logo.png");
const OUTDIR = path.join(REPO, "explorations/merch-clean");
mkdirSync(OUTDIR, { recursive: true });

const renderAsync: RenderFn = async ({ prompt, outPath, size, quality, references }) => {
  const script = path.join(os.homedir(), ".agents/skills/chatgpt-images/scripts/generate_image.py");
  const args = ["run", "--quiet", script, "--prompt", prompt, "--filename", outPath,
    "--size", size ?? "1024x1024", "--quality", quality ?? "high"];
  for (const r of references) args.push("--input-image", r);
  await execFileP("uv", args, { maxBuffer: 64 * 1024 * 1024 });
};

const BRAND = "The only logo is the orange AITX open-arms mark (a friendly figure with open arms, AITX orange #ff4201), shown from the passed reference image. No text, no words, no slogan anywhere. Premium, clean, real, tasteful. Studio lighting, soft natural shadow.";

type Item = { slug: string; size: string; prompt: string };
const ITEMS: Item[] = [
  { slug: "hoodie-black", size: "1024x1536",
    prompt: `Real on-model portrait photograph, natural window light, mirrorless camera, shallow depth of field. A person wearing a premium heavyweight black pullover hoodie. A small orange AITX open-arms mark embroidered on the left chest, tasteful and understated. Relaxed streetwear styling, neutral warm studio backdrop. ${BRAND}` },
  { slug: "tee-natural", size: "1024x1536",
    prompt: `Real on-model portrait photograph, soft daylight. A person wearing a premium heavyweight boxy tee in natural undyed cotton. A single medium orange AITX open-arms mark centered on the chest. Clean garment, minimal, high-end blank-brand look. Neutral warm backdrop. ${BRAND}` },
  { slug: "dad-hat-black", size: "1024x1024",
    prompt: `Studio product shot of a premium unstructured black cotton dad hat / 6-panel cap on a neutral warm gray seamless background. The orange AITX open-arms mark embroidered on the front panel, crisp stitching, soft shadow. Slightly angled hero product view. ${BRAND}` },
  { slug: "enamel-mug", size: "1024x1024",
    prompt: `Studio product shot of a premium white enamel camp mug with a thin orange rim on a neutral warm gray seamless background. A single orange AITX open-arms mark centered on the body. Clean, glossy enamel, soft reflection and shadow. ${BRAND}` },
  { slug: "power-bank-allinone", size: "1024x1024",
    prompt: `Studio product shot of a premium matte black all-in-one portable power bank on a neutral warm gray seamless background. It has a BUILT-IN Lightning cable and a BUILT-IN USB-C cable that tuck into the body, plus fold-out wall-plug prongs on the back, shown partly extended so all three are visible. A small orange AITX open-arms mark on the front face. Sleek premium consumer-electronics look, soft shadow. ${BRAND}` },
  { slug: "tumbler-black", size: "1024x1024",
    prompt: `Studio product shot of a premium matte black insulated stainless-steel tumbler water bottle with a subtle screw lid on a neutral warm gray seamless background. A single orange AITX open-arms mark on the body. Clean, premium, soft reflection and shadow. ${BRAND}` },
  { slug: "tote-canvas", size: "1024x1024",
    prompt: `Studio product shot of a natural heavy canvas tote bag hanging flat against a neutral warm background. A single orange AITX open-arms mark centered on the front, screen-printed look. Clean premium merch, soft shadow. ${BRAND}` },
  { slug: "beanie-black", size: "1024x1024",
    prompt: `Studio product shot of a premium cuffed black knit beanie on a neutral warm gray seamless background. A small orange AITX open-arms mark on a woven patch on the cuff. Cozy premium knit texture, soft shadow, hero product view. ${BRAND}` },
];

async function pool<T, R>(items: T[], limit: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i]); }
  }));
  return out;
}

console.log(`Rendering ${ITEMS.length} clean mark-only merch items in parallel (cap 4)...`);
const made = await pool(ITEMS, 4, async (it) => {
  const outPath = path.join(OUTDIR, `${it.slug}.png`);
  try {
    const res = await generateImageAsset({
      outPath, model: "openai:gpt-image-2", prompt: it.prompt,
      params: { size: it.size, quality: "high" },
      references: [MARK], roles: { [MARK]: "logo" },
      createdAt: new Date().toISOString(),
    }, { render: renderAsync });
    console.log(`  ✓ ${it.slug}.png`);
    return { slug: it.slug, ok: existsSync(res.assetPath) };
  } catch (e: any) {
    console.log(`  ✗ ${it.slug}: ${e?.message ?? e}`);
    return { slug: it.slug, ok: false };
  }
});

console.log("\n" + JSON.stringify({ rendered: made.filter((m) => m.ok).length, total: made.length,
  files: made.map((m) => m.slug + ".png") }, null, 2));
