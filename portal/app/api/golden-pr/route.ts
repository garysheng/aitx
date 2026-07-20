import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// When a human LIKES a generated asset, it does not silently drop into a folder.
// It opens a PULL REQUEST that adds the image plus its full provenance recipe to
// the version-controlled brand universe (goldens/<category>/). A human merges.
// That merge is the moment an asset becomes a GOLDEN: blessed, and from then on a
// reference every future render is pulled toward. This is the golden gate.
const OWNER = process.env.AITX_REPO_OWNER || "garysheng";
const REPO = process.env.AITX_REPO_NAME || "aitx";
const BASE = process.env.AITX_REPO_BRANCH || "master";

const CATEGORIES = new Set(["memes", "flyers", "flyers-remotion", "stickers", "social", "merch", "merch-lab", "silver"]);

async function gh(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || `GitHub ${res.status}`);
  return body;
}

function slugify(s: string, fallback: string) {
  const out = (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40);
  return out || fallback;
}

export async function POST(req: Request) {
  const code = req.headers.get("x-aitx-code") ?? "";
  if (!process.env.AITX_GENERATE_CODE || code !== process.env.AITX_GENERATE_CODE) {
    return NextResponse.json({ error: "Enter the AITX access code." }, { status: 401 });
  }
  const token = process.env.GITHUB_TOKEN;
  if (!token) return NextResponse.json({ error: "Server has no GitHub token configured yet." }, { status: 503 });

  let body: { imageBase64?: string; recipe?: Record<string, unknown>; category?: string; name?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }

  const imageBase64 = (body.imageBase64 || "").replace(/^data:image\/\w+;base64,/, "");
  if (!imageBase64) return NextResponse.json({ error: "No image to bless." }, { status: 400 });
  const recipe = body.recipe && typeof body.recipe === "object" ? body.recipe : {};
  const category = CATEGORIES.has(body.category || "") ? (body.category as string) : "memes";
  const slug = slugify(body.name || String((recipe as Record<string, unknown>).template || category), category);
  const stamp = Date.now();
  const id = `${slug}-${stamp.toString(36)}`;
  const assetPath = `goldens/${category}/${id}.png`;
  const recipePath = `goldens/${category}/${id}.recipe.json`;
  const fullRecipe = { ...recipe, asset: assetPath, blessedVia: "studio-like", blessedAt: new Date().toISOString() };

  try {
    const branch = `chip/golden-${category}-${stamp}`;

    // base sha -> new branch
    const ref = await gh(token, `/repos/${OWNER}/${REPO}/git/ref/heads/${BASE}`);
    const baseSha = ref.object.sha;
    await gh(token, `/repos/${OWNER}/${REPO}/git/refs`, {
      method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
    });

    // commit the image (binary content is the raw base64)
    await gh(token, `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(assetPath)}`, {
      method: "PUT",
      body: JSON.stringify({ message: `golden: add ${category}/${id} (image)`, content: imageBase64, branch }),
    });
    // commit the provenance recipe
    await gh(token, `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(recipePath)}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `golden: add ${category}/${id} (recipe)`,
        content: Buffer.from(JSON.stringify(fullRecipe, null, 2) + "\n", "utf8").toString("base64"),
        branch,
      }),
    });

    // open the PR
    const pr = await gh(token, `/repos/${OWNER}/${REPO}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title: `Add golden: ${category}/${id}`,
        head: branch, base: BASE,
        body: `A human liked this asset in the AITX studio and proposed it as a **golden**.\n\nThis PR adds two files to the version-controlled brand universe:\n\n- \`${assetPath}\` — the image\n- \`${recipePath}\` — its full provenance recipe (model, prompt, hash-pinned references)\n\nMerge to bless it. From then on it is part of the canon and every future render can be pulled toward it. This is the golden gate: the agent (or a maker) proposes, a human blesses.`,
      }),
    });

    return NextResponse.json({ url: pr.html_url, number: pr.number });
  } catch (e: unknown) {
    console.error("golden-pr failed:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not open the PR." }, { status: 502 });
  }
}
