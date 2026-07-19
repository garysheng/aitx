import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
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

// Resolves the git repo root so recipe paths (`asset`, `references[].path`)
// can be stored relative to it rather than to the caller's cwd. Falls back to
// the process cwd when not inside a git repo (e.g. an isolated temp dir in tests).
export function repoRoot(): string {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
  } catch {
    return process.cwd();
  }
}

export function toRepoRelative(p: string): string {
  const abs = path.resolve(process.cwd(), p);
  return path.relative(repoRoot(), abs);
}

export function fromRepoRelative(p: string): string {
  return path.resolve(repoRoot(), p);
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

// Like buildReferences, but hashes the real file (resolved against cwd) while
// storing a repo-relative path in the recipe — so recipes are portable across
// whatever directory the CLI was invoked from.
export function buildRepoRelativeReferences(paths: string[], roles: Record<string, string> = {}): Reference[] {
  return paths.map((p) => {
    const abs = path.resolve(process.cwd(), p);
    const ref: Reference = { path: toRepoRelative(p), sha256: sha256File(abs) };
    if (roles[p]) ref.role = roles[p];
    return ref;
  });
}

// `recipePath` lets a caller pin the physical sidecar location explicitly
// (e.g. next to the actual rendered file, resolved against cwd) when
// `recipe.asset` itself has been rewritten to a repo-relative path that
// wouldn't resolve correctly against cwd. Defaults to recipePathFor(recipe.asset).
export function writeRecipe(recipe: Recipe, recipePath?: string): string {
  const rp = recipePath ?? recipePathFor(recipe.asset);
  writeFileSync(rp, JSON.stringify(recipe, null, 2) + "\n");
  return rp;
}

export function readRecipe(recipePath: string): Recipe {
  return JSON.parse(readFileSync(recipePath, "utf8")) as Recipe;
}
