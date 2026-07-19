import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { sha256File, recipePathFor, buildReferences, writeRecipe, readRecipe, type Recipe } from "./recipe.ts";

test("sha256File hashes file bytes", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "aitx-rec-"));
  const f = path.join(dir, "a.txt");
  writeFileSync(f, "hello");
  // sha256("hello") is a known constant
  assert.equal(sha256File(f), "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
});

test("recipePathFor swaps the asset extension for .recipe.json", () => {
  assert.equal(recipePathFor("goldens/memes/x.png"), "goldens/memes/x.recipe.json");
  assert.equal(recipePathFor("a/b/cover.webp"), "a/b/cover.recipe.json");
});

test("buildReferences hashes each path and keeps roles", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "aitx-rec-"));
  const f = path.join(dir, "logo.png");
  writeFileSync(f, "PNGBYTES");
  const refs = buildReferences([f], { [f]: "logo" });
  assert.equal(refs.length, 1);
  assert.equal(refs[0].path, f);
  assert.equal(refs[0].role, "logo");
  assert.match(refs[0].sha256, /^[0-9a-f]{64}$/);
});

test("writeRecipe + readRecipe round-trip to the sidecar path", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "aitx-rec-"));
  const asset = path.join(dir, "out.png");
  const recipe: Recipe = {
    recipeVersion: 1,
    asset,
    createdAt: "2026-07-19T00:00:00Z",
    generator: { kind: "image-model", tool: "aitx-generator@0.1.0" },
    model: "openai:gpt-image-2",
    prompt: "a test",
    references: [],
  };
  const rp = writeRecipe(recipe);
  assert.equal(rp, recipePathFor(asset));
  assert.deepEqual(readRecipe(rp), recipe);
});
