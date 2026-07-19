import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import type { RenderFn } from "./generate-image.ts";

// Shells out to the proven chatgpt-images gpt-image-2 script.
// Needs OPENAI_API_KEY in env (the script reads it). Uses `uv run` because the
// script is a PEP 723 inline-deps file.
export const renderOpenAI: RenderFn = async ({ prompt, outPath, size, quality, background, references }) => {
  const script = path.join(os.homedir(), ".agents/skills/chatgpt-images/scripts/generate_image.py");
  const args = ["run", "--quiet", script, "--prompt", prompt, "--filename", outPath, "--size", size ?? "1024x1024", "--quality", quality ?? "high"];
  if (background) args.push("--background", background);
  for (const r of references) { args.push("--input-image", r); }
  execFileSync("uv", args, { stdio: "inherit" });
};
