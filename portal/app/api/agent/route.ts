import { NextResponse } from "next/server";
import OpenAI from "openai";
import { scoreText, type Violation } from "@/lib/agent/critic";
import { systemPrompt, flatten, OUTPUT_INSTRUCTION } from "@/lib/agent/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BASE_URL = process.env.NIM_BASE_URL || "https://integrate.api.nvidia.com/v1";
const MODEL = process.env.NEMOTRON_MODEL || "nvidia/nvidia-nemotron-nano-9b-v2";

function client() {
  const apiKey = process.env.NIM_API_KEY || process.env.NVIDIA_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ baseURL: BASE_URL, apiKey });
}

async function nemotron(c: OpenAI, messages: { role: "system" | "user"; content: string }[]) {
  // Nemotron reasoning models honor a thinking directive; off => clean JSON.
  const msgs = MODEL.toLowerCase().includes("nemotron")
    ? [{ role: "system" as const, content: "detailed thinking off" }, ...messages]
    : messages;
  const resp = await c.chat.completions.create({
    model: MODEL, messages: msgs, temperature: 0, max_tokens: 700,
  });
  let text = resp.choices[0]?.message?.content || "";
  if (text.includes("</think>")) text = text.split("</think>").pop() || text;
  return text.trim();
}

function extractJSON(text: string): { headline?: string; body?: string; visual_plan?: string } {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return { body: text.slice(0, 240) };
  try { return JSON.parse(m[0]); } catch { return { body: text.slice(0, 240) }; }
}

export async function POST(req: Request) {
  const c = client();
  if (!c) return NextResponse.json({ error: "Server missing NIM_API_KEY." }, { status: 500 });

  let body: {
    action?: string; request?: string; useKnowledge?: boolean;
    lessons?: string[]; violations?: Violation[];
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }

  try {
    // --- distill general lessons from violations (the learning step) ---
    if (body.action === "learn") {
      const vios = body.violations || [];
      const lessons: string[] = [];
      for (const v of vios) {
        const out = await nemotron(c, [
          { role: "system", content: "You distill a brand mistake into ONE short, GENERAL imperative rule the agent reads before every future task. Do NOT mention the specific company, event, or wording from this incident. It must apply to ALL future requests. One sentence, no preamble." },
          { role: "user", content: `Mistake type: ${v.label} (a phrase like "${v.match}" appeared). Write the general rule.` },
        ]);
        lessons.push(out.replace(/^["']|["']$/g, "").slice(0, 240));
      }
      return NextResponse.json({ lessons });
    }

    // --- generate on-brand copy + score it ---
    const request = (body.request || "").trim();
    if (!request) return NextResponse.json({ error: "Describe what to design." }, { status: 400 });
    const t0 = Date.now();
    const raw = await nemotron(c, [
      { role: "system", content: systemPrompt(!!body.useKnowledge, body.lessons || []) },
      { role: "user", content: `Design request: ${request}\n${OUTPUT_INSTRUCTION}` },
    ]);
    const latencyMs = Date.now() - t0;
    const asset = extractJSON(raw);
    const { score, violations } = scoreText(flatten(asset));
    return NextResponse.json({ asset, score, violations, latencyMs, model: MODEL });
  } catch (e) {
    console.error("agent route failed:", e);
    return NextResponse.json({ error: "Nemotron call failed. Try again." }, { status: 502 });
  }
}
