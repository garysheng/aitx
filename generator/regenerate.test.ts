import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { generateImageAsset, type RenderFn } from "./generate-image.ts";
import { regenerate } from "./regenerate.ts";

function setup() {
  const dir = mkdtempSync(path.join(tmpdir(), "aitx-regen-"));
  const logo = path.join(dir, "logo.png");
  writeFileSync(logo, "LOGOBYTES");
  const out = path.join(dir, "asset.png");
  const render: RenderFn = async (args) => { writeFileSync(args.outPath, "IMG"); };
  return { dir, logo, out, render };
}

test("regenerate replays a recipe with matching reference hashes", async () => {
  const { logo, out, render } = setup();
  const first = await generateImageAsset({
    outPath: out, model: "openai:gpt-image-2", prompt: "p", references: [logo], createdAt: "2026-07-19T00:00:00Z",
  }, { render });

  let replayedPrompt = "";
  const render2: RenderFn = async (args) => { replayedPrompt = args.prompt; writeFileSync(args.outPath, "IMG2"); };
  const res = await regenerate(first.recipePath, { render: render2, createdAt: "2026-07-19T01:00:00Z" });
  assert.equal(replayedPrompt, "p");
  assert.ok(existsSync(res.assetPath));
  assert.equal(res.recipe.createdAt, "2026-07-19T01:00:00Z");
});

test("regenerate throws when a reference changed since the recipe", async () => {
  const { logo, out, render } = setup();
  const first = await generateImageAsset({
    outPath: out, model: "openai:gpt-image-2", prompt: "p", references: [logo], createdAt: "2026-07-19T00:00:00Z",
  }, { render });
  writeFileSync(logo, "TAMPERED"); // atom changed
  await assert.rejects(
    () => regenerate(first.recipePath, { render, createdAt: "2026-07-19T02:00:00Z" }),
    /reference changed/,
  );
});
