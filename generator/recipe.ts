import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type Reference = { path: string; sha256: string; role?: string };

export type Recipe = {
  recipeVersion: 1;
  asset: string;
  createdAt: string;
  generator: { kind: "image-model" | "deterministic"; tool: string };
  model?: string;
  prompt?: string;
  params?: { size?: string; quality?: string; background?: string };
  references?: Reference[];
  template?: { id: string; version: string };
  inputs?: Record<string, unknown>;
  fonts?: { family: string; weight: string; file: string; sha256: string }[];
  ruleSet?: { id: string; version: string };
  notes?: string;
};

export function sha256File(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

export function recipePathFor(assetPath: string): string {
  const ext = path.extname(assetPath);
  return assetPath.slice(0, assetPath.length - ext.length) + ".recipe.json";
}

export function buildReferences(paths: string[], roles: Record<string, string> = {}): Reference[] {
  return paths.map((p) => {
    const ref: Reference = { path: p, sha256: sha256File(p) };
    if (roles[p]) ref.role = roles[p];
    return ref;
  });
}

export function writeRecipe(recipe: Recipe): string {
  const rp = recipePathFor(recipe.asset);
  writeFileSync(rp, JSON.stringify(recipe, null, 2) + "\n");
  return rp;
}

export function readRecipe(recipePath: string): Recipe {
  return JSON.parse(readFileSync(recipePath, "utf8")) as Recipe;
}
