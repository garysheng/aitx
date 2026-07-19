import { buildRepoRelativeReferences, recipePathFor, toRepoRelative, writeRecipe, type Recipe } from "./recipe.ts";

export type RenderArgs = {
  prompt: string;
  outPath: string;
  size?: string;
  quality?: string;
  background?: string;
  references: string[];
};
export type RenderFn = (args: RenderArgs) => Promise<void>;

export type GenerateResult = { assetPath: string; recipePath: string; recipe: Recipe };

export type ImageSpec = {
  outPath: string;
  model: "openai:gpt-image-2";
  prompt: string;
  params?: { size?: string; quality?: string; background?: string };
  references: string[];
  roles?: Record<string, string>;
  createdAt: string;
};

export async function generateImageAsset(spec: ImageSpec, deps: { render: RenderFn }): Promise<GenerateResult> {
  await deps.render({
    prompt: spec.prompt,
    outPath: spec.outPath,
    size: spec.params?.size,
    quality: spec.params?.quality,
    background: spec.params?.background,
    references: spec.references,
  });
  const recipe: Recipe = {
    recipeVersion: 1,
    // Stored repo-root-relative so the recipe is resolvable regardless of the
    // cwd the caller ran from (e.g. `--out ../goldens/x.png` from `generator/`).
    asset: toRepoRelative(spec.outPath),
    createdAt: spec.createdAt,
    generator: { kind: "image-model", tool: "aitx-generator@0.1.0" },
    model: spec.model,
    prompt: spec.prompt,
    ...(spec.params ? { params: spec.params } : {}),
    references: buildRepoRelativeReferences(spec.references, spec.roles),
  };
  // The recipe file is still written as the sidecar of the ACTUAL rendered
  // file (spec.outPath, resolved against cwd) — independent of the
  // repo-relative path stored inside the recipe's `asset` field.
  const recipePath = writeRecipe(recipe, recipePathFor(spec.outPath));
  return { assetPath: spec.outPath, recipePath, recipe };
}
