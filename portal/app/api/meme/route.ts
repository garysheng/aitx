import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import OpenAI, { toFile } from "openai";
import { CHARACTERS, TEMPLATES, type CharId } from "@/lib/memes/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MARK = "/assets/logo/aitx-mark-transparent.png";

export async function POST(req: Request) {
  const code = req.headers.get("x-aitx-code") ?? "";
  const expected = process.env.AITX_GENERATE_CODE;
  if (!expected || code !== expected) {
    return NextResponse.json({ error: "Enter the AITX access code to generate." }, { status: 401 });
  }

  let body: { templateId?: string; cast?: string[]; caption?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }

  const template = TEMPLATES.find((t) => t.id === body.templateId);
  if (!template) return NextResponse.json({ error: "Pick a template." }, { status: 400 });
  const cast = CHARACTERS.filter((c) => (body.cast ?? []).includes(c.id));
  if (cast.length === 0) return NextResponse.json({ error: "Pick at least one character." }, { status: 400 });

  const caption = (body.caption ?? template.defaultCaption).slice(0, 120);
  const castDesc =
    cast.length === 1 ? cast[0].describe
    : cast.map((c) => c.describe).slice(0, -1).join(", ") + " and " + cast[cast.length - 1].describe;
  const prompt = template.scene(castDesc, caption);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Server is not configured for generation." }, { status: 500 });
  const client = new OpenAI({ apiKey });

  // pass the selected characters' art + the AITX mark as references
  const origin = new URL(req.url).origin;
  const refPaths = [...cast.map((c) => c.asset), MARK];
  const refs: { path: string; sha256: string }[] = [];
  const files = [] as Awaited<ReturnType<typeof toFile>>[];
  for (const p of refPaths) {
    const res = await fetch(new URL(p, origin));
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    refs.push({ path: p, sha256: createHash("sha256").update(buf).digest("hex") });
    files.push(await toFile(buf, p.split("/").pop() ?? "ref.png", { type: "image/png" }));
  }

  try {
    const result = await client.images.edit({ model: "gpt-image-2", image: files, prompt, size: "1024x1024" });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) return NextResponse.json({ error: "The model returned no image. Try again." }, { status: 500 });
    const recipe = {
      recipeVersion: 1,
      createdAt: new Date().toISOString(),
      generator: { kind: "image-model", tool: "aitx-meme-studio@0.1.0" },
      model: "openai:gpt-image-2",
      template: template.id,
      cast: cast.map((c) => c.id),
      prompt,
      params: { size: "1024x1024" },
      references: refs,
    };
    return NextResponse.json({ imageBase64: b64, recipe });
  } catch (e) {
    console.error("meme gen failed:", e);
    return NextResponse.json({ error: "Generation failed. Try again in a moment." }, { status: 500 });
  }
}
