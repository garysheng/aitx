# AITX Asset Generator (provenance spine)

Every generated image writes a sibling `.recipe.json` (exact prompt + model +
reference hashes) so it is reproducible and self-documenting.

## Use

    cd generator && npm install
    # generate an image + its recipe
    npx tsx cli.ts generate --out ../goldens/memes/test.png \
      --prompt "Michael as Uncle Sam, plain hat, black AITX tee" \
      --ref ../universe/reference/michael-daigler/gabr-michael.png \
      --ref ../universe/reference/aitx-mark/aitx-logo.png
    # replay a recipe (verifies reference bytes are unchanged)
    npx tsx cli.ts regenerate --recipe ../goldens/memes/test.recipe.json

Needs `OPENAI_API_KEY` in env (the underlying gpt-image-2 script reads it).
Deterministic templates + backfill of existing goldens are follow-on work.
