import { NextResponse } from "next/server";
import OpenAI from "openai";
import { scoreText } from "@/lib/agent/critic";
import { SEED_LESSONS } from "@/lib/agent/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BASE_URL = process.env.NIM_BASE_URL || "https://integrate.api.nvidia.com/v1";
const MODEL = process.env.NEMOTRON_MODEL || "nvidia/nvidia-nemotron-nano-9b-v2";

// A brand-OS superpower: an on-brand, soulful thank-you the founder can send to a
// sponsor as a voice e-card (via BlessOut). Nemotron writes it; the brand rules
// keep it warm and human, never corporate.
const SYSTEM =
  "You are the AITX brand agent writing a heartfelt thank-you from AITX (the largest AI builder " +
  "community in Texas, built on loyalty, reputation, and good vibes) to a sponsor. Warm, human, " +
  "plain-spoken, Texas-proud, specific, and genuine. Short. Signature warmth like 'it has open arms' " +
  "and 'come build the future with us' where it fits.\n\n" +
  "BRAND RULES (obey every one):\n" + SEED_LESSONS.map((l) => `- ${l}`).join("\n") +
  '\n\nReturn compact JSON only: {"title": "a short warm title", "message": "2-4 sentence thank-you"}';

export async function POST(req: Request) {
  const apiKey = process.env.NIM_API_KEY || process.env.NVIDIA_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Server missing NIM_API_KEY." }, { status: 500 });

  let body: { sponsor?: string; gift?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const sponsor = (body.sponsor || "").trim();
  if (!sponsor) return NextResponse.json({ error: "Who are we thanking?" }, { status: 400 });
  const gift = (body.gift || "").trim();

  const c = new OpenAI({ baseURL: BASE_URL, apiKey });
  const user = `Write the thank-you to ${sponsor}${gift ? ` for ${gift}` : ""}. Keep it warm and specific.`;
  const msgs = [
    { role: "system" as const, content: "detailed thinking off" },
    { role: "system" as const, content: SYSTEM },
    { role: "user" as const, content: user },
  ];

  try {
    let text = "";
    for (let i = 0; i < 2; i++) {
      const resp = await c.chat.completions.create({ model: MODEL, messages: msgs, temperature: 0.3, max_tokens: 1200 });
      text = resp.choices[0]?.message?.content || "";
      if (text.includes("</think>")) text = text.split("</think>").pop() || text;
      text = text.trim();
      if (text.length >= 15) break;
    }
    const m = text.match(/\{[\s\S]*\}/);
    let card = { title: "Thank you", message: text.slice(0, 300) };
    if (m) { try { card = JSON.parse(m[0]); } catch { /* keep fallback */ } }
    const { score, violations } = scoreText(`${card.title} ${card.message}`);
    return NextResponse.json({ ...card, sponsor, score, violations, model: MODEL });
  } catch (e) {
    console.error("thanks route failed:", e);
    return NextResponse.json({ error: "Nemotron call failed. Try again." }, { status: 502 });
  }
}
