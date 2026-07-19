import { fromRepoRelative, readRecipe, sha256File } from "./recipe.ts";
import { generateImageAsset, type RenderFn, type GenerateResult } from "./generate-image.ts";

export async function regenerate(recipePath: string, deps: { render: RenderFn; createdAt: string }): Promise<GenerateResult> {
  const recipe = readRecipe(recipePath);
  if (recipe.generator.kind !== "image-model") {
    throw new Error(`regenerate: only image-model recipes are supported in v1 (got ${recipe.generator.kind})`);
  }
  if (!recipe.prompt || !recipe.model) {
    throw new Error("regenerate: recipe is missing prompt or model");
  }
  if (recipe.model !== "openai:gpt-image-2") {
    throw new Error(`regenerate: unsupported model ${recipe.model} (only openai:gpt-image-2 in v1)`);
  }
  for (const ref of recipe.references ?? []) {
    const resolved = fromRepoRelative(ref.path);
    let now: string;
    try {
      now = sha256File(resolved);
    } catch (err) {
      if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
        throw new Error(`reference missing since recipe: ${ref.path}`);
      }
      throw err;
    }
    if (now !== ref.sha256) {
      throw new Error(`reference changed since recipe: ${ref.path} (recorded ${ref.sha256.slice(0, 8)}, now ${now.slice(0, 8)})`);
    }
  }
  const roles: Record<string, string> = {};
  for (const ref of recipe.references ?? []) if (ref.role) roles[fromRepoRelative(ref.path)] = ref.role;
  return generateImageAsset({
    outPath: fromRepoRelative(recipe.asset),
    model: recipe.model as "openai:gpt-image-2",
    prompt: recipe.prompt,
    ...(recipe.params ? { params: recipe.params } : {}),
    references: (recipe.references ?? []).map((r) => fromRepoRelative(r.path)),
    roles,
    createdAt: deps.createdAt,
  }, { render: deps.render });
}
