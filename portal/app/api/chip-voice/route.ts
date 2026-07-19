import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Chip's voice — the AITX brand czar speaks. ElevenLabs v3, Chip's custom voice.
const VOICE_ID = "OjnJBCejJlol0Ps2wkAK";

export async function POST(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return NextResponse.json({ error: "no voice key" }, { status: 500 });
  let text = "";
  try { ({ text } = await req.json()); } catch { return NextResponse.json({ error: "bad" }, { status: 400 }); }
  if (!text?.trim()) return NextResponse.json({ error: "empty" }, { status: 400 });

  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: "eleven_v3" }),
    },
  );
  if (!r.ok) return NextResponse.json({ error: "tts failed" }, { status: 502 });
  return new NextResponse(r.body, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
}
