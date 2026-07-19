import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGenPrompt } from "./prompt.ts";

test("prompt includes the brief and the brand style", () => {
  const p = buildGenPrompt("sticker", "the mark in a Texas outline");
  assert.match(p, /the mark in a Texas outline/);
  assert.match(p, /#ff4201/);
  assert.match(p, /STICKER/);
});

test("prompt is a distinct template per kind", () => {
  assert.match(buildGenPrompt("meme", "x"), /MEME/);
  assert.match(buildGenPrompt("product", "x"), /PRODUCT SHOT/);
  assert.match(buildGenPrompt("social", "x"), /SOCIAL POST/);
});

test("empty brief falls back, and long briefs are clamped", () => {
  assert.match(buildGenPrompt("sticker", "   "), /an on-brand AITX asset/);
  const long = "a".repeat(1000);
  assert.ok(buildGenPrompt("sticker", long).length < 900);
});
