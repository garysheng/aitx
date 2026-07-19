// NVIDIA x AITX co-branded merch — BRAND-SAFE (no logo mixing).
// The ONLY logo is the orange AITX open-arms mark. NVIDIA green #76b900 is a
// small accent detail. The word "NVIDIA" appears only as tiny plain neutral
// text as a collaboration credit — never its eye-logo, never its wordmark
// graphic, never locked to the AITX mark. See universe/brand-os/BRAND-RULES.md.
// Output: explorations/ (candidates, not goldens).

import { existsSync, mkdirSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import os from "node:os";
import path from "node:path";
import { generateImageAsset, type RenderFn } from "../../generator/generate-image.ts";

const execFileP = promisify(execFile);
const REPO = path.resolve(process.cwd(), "../..");
const MARK = path.join(REPO, "universe/reference/aitx-mark/aitx-logo.png");
const OUTDIR = path.join(REPO, "explorations/nvidia-aitx-merch");
mkdirSync(OUTDIR, { recursive: true });

const renderAsync: RenderFn = async ({ prompt, outPath, size, quality, references }) => {
  const script = path.join(os.homedir(), ".agents/skills/chatgpt-images/scripts/generate_image.py");
  const args = ["run", "--quiet", script, "--prompt", prompt, "--filename", outPath,
    "--size", size ?? "1024x1024", "--quality", quality ?? "high"];
  for (const r of references) args.push("--input-image", r);
  await execFileP("uv", args, { maxBuffer: 64 * 1024 * 1024 });
};

// Hard guardrails repeated on every prompt.
const RULES = "IMPORTANT LOGO RULES: The ONLY logo anywhere is the orange AITX open-arms mark (a friendly figure with open arms, AITX orange #ff4201, from the passed reference image). Do NOT render the NVIDIA logo, the NVIDIA eye/GPU icon, or any NVIDIA wordmark graphic. The word 'NVIDIA' may appear ONLY as very small, plain, neutral sans-serif text as a collaboration credit, set apart from the AITX mark (like a discreet tag or hem credit), never stylized as a brand logo and never combined with the AITX mark. NVIDIA green #76b900 appears only as a small accent detail; AITX orange leads.";

type Item = { slug: string; size: string; prompt: string };
const ITEMS: Item[] = [
  { slug: "hoodie-green-accent", size: "1024x1536",
    prompt: `Real on-model portrait photograph, natural window light, mirrorless camera, shallow depth of field. A person wearing a premium heavyweight black pullover hoodie. A small orange AITX open-arms mark embroidered on the left chest. A thin NVIDIA-green #76b900 stitch accent along the cuff. On the lower sleeve, tiny plain neutral text reads "AITX in collaboration with NVIDIA". Relaxed premium streetwear, neutral warm backdrop. ${RULES}` },
  { slug: "tee-green-accent", size: "1024x1536",
    prompt: `Real on-model portrait photograph, soft daylight. A person wearing a premium heavyweight boxy tee in natural undyed cotton. A single medium orange AITX open-arms mark centered on the chest, with a short thin NVIDIA-green #76b900 underline accent beneath it. At the bottom hem, tiny plain neutral text reads "AITX x NVIDIA". Clean high-end blank-brand look, neutral warm backdrop. ${RULES}` },
  { slug: "cap-green-accent", size: "1024x1024",
    prompt: `Studio product shot of a premium unstructured black cotton dad hat (six-panel low-profile cap) on a neutral warm gray seamless background, slightly angled hero view. The orange AITX open-arms mark embroidered on the front panel. A small NVIDIA-green #76b900 stitched eyelet and a thin green accent on the back strap. Soft shadow. ${RULES}` },
  { slug: "tumbler-green-accent", size: "1024x1024",
    prompt: `Studio product shot of a premium matte black insulated stainless-steel tumbler on a neutral warm gray seamless background. A single orange AITX open-arms mark on the body, with a thin NVIDIA-green #76b900 ring accent near the lid. Below the mark, tiny plain neutral text reads "AITX x NVIDIA". Clean premium, soft reflection and shadow. ${RULES}` },
  { slug: "tote-green-accent", size: "1024x1024",
    prompt: `Studio product shot of a natural heavy canvas tote bag hanging flat against a neutral warm background. A single orange AITX open-arms mark centered on the front, screen-printed. A short NVIDIA-green #76b900 accent stripe on the strap, and tiny plain neutral text under the mark reading "AITX x NVIDIA". Clean premium merch, soft shadow. ${RULES}` },
];

async function pool<T, R>(items: T[], limit: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i]); }
  }));
  return out;
}

console.log(`Rendering ${ITEMS.length} NVIDIA x AITX co-brand merch items in parallel (cap 4)...`);
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
