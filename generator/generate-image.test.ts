import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { generateImageAsset, type RenderFn } from "./generate-image.ts";
import { fromRepoRelative, readRecipe, recipePathFor } from "./recipe.ts";

test("generateImageAsset renders then writes a correct recipe", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "aitx-gen-"));
  const logo = path.join(dir, "logo.png");
  writeFileSync(logo, "LOGOBYTES");
  const out = path.join(dir, "meme.png");

  const calls: any[] = [];
  const render: RenderFn = async (args) => { calls.push(args); writeFileSync(args.outPath, "IMG"); };

  const res = await generateImageAsset({
    outPath: out,
    model: "openai:gpt-image-2",
    prompt: "michael as uncle sam",
    params: { size: "1024x1024", quality: "high" },
    references: [logo],
    roles: { [logo]: "logo" },
    createdAt: "2026-07-19T00:00:00Z",
  }, { render });

  // render was called with the prompt + refs
  assert.equal(calls.length, 1);
  assert.equal(calls[0].prompt, "michael as uncle sam");
  assert.deepEqual(calls[0].references, [logo]);
  // asset + recipe written
  assert.ok(existsSync(out));
  assert.equal(res.recipePath, recipePathFor(out));
  const recipe = readRecipe(res.recipePath);
  assert.equal(recipe.model, "openai:gpt-image-2");
  assert.equal(recipe.prompt, "michael as uncle sam");
  assert.equal(recipe.generator.kind, "image-model");
  // asset + reference paths are stored repo-root-relative, not verbatim —
  // resolve back through the repo root to recover the real file.
  assert.equal(fromRepoRelative(recipe.asset), out);
  assert.equal(fromRepoRelative(recipe.references?.[0].path ?? ""), logo);
  assert.equal(recipe.references?.[0].role, "logo");
  assert.match(recipe.references?.[0].sha256 ?? "", /^[0-9a-f]{64}$/);
});
