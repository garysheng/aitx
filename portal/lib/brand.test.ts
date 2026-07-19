import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "fs";
import path from "path";
import { ASSETS, CATEGORIES } from "./brand.ts";

test("every asset file exists in public", () => {
  for (const a of ASSETS) {
    const p = path.join(process.cwd(), "public", a.file);
    assert.ok(existsSync(p), `missing file for ${a.id}: ${a.file}`);
  }
});

test("every asset category is declared in CATEGORIES", () => {
  const keys = new Set(CATEGORIES.map((c) => c.key));
  for (const a of ASSETS) assert.ok(keys.has(a.category), `undeclared category ${a.category}`);
});

test("composedFrom ids all resolve to real assets", () => {
  const ids = new Set(ASSETS.map((a) => a.id));
  for (const a of ASSETS) for (const c of a.composedFrom ?? []) assert.ok(ids.has(c), `${a.id} references unknown atom ${c}`);
});
