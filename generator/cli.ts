import { generateImageAsset } from "./generate-image.ts";
import { regenerate } from "./regenerate.ts";
import { renderOpenAI } from "./render-openai.ts";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}
function args(name: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < process.argv.length; i++) if (process.argv[i] === `--${name}`) out.push(process.argv[i + 1]);
  return out;
}

const cmd = process.argv[2];
const now = new Date().toISOString();

if (cmd === "generate") {
  const out = arg("out"); const prompt = arg("prompt");
  if (!out || !prompt) { console.error("usage: cli.ts generate --out <path> --prompt <p> [--size s] [--quality q] [--ref path ...]"); process.exit(1); }
  const res = await generateImageAsset({
    outPath: out, model: "openai:gpt-image-2", prompt,
    params: { size: arg("size") ?? "1024x1024", quality: arg("quality") ?? "high" },
    references: args("ref"), createdAt: now,
  }, { render: renderOpenAI });
  console.log("wrote", res.assetPath, "+", res.recipePath);
} else if (cmd === "regenerate") {
  const recipe = arg("recipe");
  if (!recipe) { console.error("usage: cli.ts regenerate --recipe <path>"); process.exit(1); }
  const res = await regenerate(recipe, { render: renderOpenAI, createdAt: now });
  console.log("regenerated", res.assetPath, "+", res.recipePath);
} else {
  console.error("commands: generate | regenerate");
  process.exit(1);
}
