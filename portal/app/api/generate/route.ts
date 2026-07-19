import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import OpenAI, { toFile } from "openai";
import { buildGenPrompt } from "@/lib/generate/prompt";
import { GEN_KINDS, IMAGE_SIZE, type GenKind } from "@/lib/generate/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  const code = req.headers.get("x-aitx-code") ?? "";
  const expected = process.env.AITX_GENERATE_CODE;
  if (!expected || code !== expected) {
    return NextResponse.json({ error: "Enter the AITX access code to generate." }, { status: 401 });
  }

  let body: { kind?: string; brief?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const spec = GEN_KINDS.find((k) => k.key === body.kind);
  if (!spec || typeof body.brief !== "string") {
    return NextResponse.json({ error: "Pick a type and describe what you want." }, { status: 400 });
  }
  const kind = spec.key as GenKind;
  const prompt = buildGenPrompt(kind, body.brief);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Server is not configured for generation." }, { status: 500 });
  const client = new OpenAI({ apiKey });

  // fetch the atom reference images from our own origin
  const origin = new URL(req.url).origin;
  const refs: { path: string; sha256: string }[] = [];
  const files = [] as Awaited<ReturnType<typeof toFile>>[];
  for (const p of spec.atoms) {
    const res = await fetch(new URL(p, origin));
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    refs.push({ path: p, sha256: createHash("sha256").update(buf).digest("hex") });
    files.push(await toFile(buf, p.split("/").pop() ?? "ref.png", { type: "image/png" }));
  }

  try {
    const result = await client.images.edit({ model: "gpt-image-2", image: files, prompt, size: IMAGE_SIZE as "1024x1024" });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) return NextResponse.json({ error: "The model returned no image. Try again." }, { status: 500 });
    const recipe = {
      recipeVersion: 1,
      createdAt: new Date().toISOString(),
      generator: { kind: "image-model", tool: "aitx-studio-web@0.1.0" },
      model: "openai:gpt-image-2",
      prompt,
      params: { size: IMAGE_SIZE },
      references: refs,
    };
    return NextResponse.json({ imageBase64: b64, recipe });
  } catch (e) {
    console.error("generate failed:", e);
    return NextResponse.json({ error: "Generation failed. Try again in a moment." }, { status: 500 });
  }
}
