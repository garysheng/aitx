/**
 * Generate listen-along narration MP3s for The Golden Path via ElevenLabs.
 *
 * Usage: npx tsx scripts/generate-narration.ts [--only <n|cover|end>]
 *
 * Reads ELEVENLABS_API_KEY from mypersonalwebsite/.env.local (never committed).
 * Writes public/audio/{cover,spread-NN,end}.mp3 — committed, served statically.
 *
 * Voices: narrator is the same voice as the /bio story on garysheng.com.
 * Character quotes are voiced by their cast member; attribution tags
 * ("said Bobby", "the Helper whispered") stay with the narrator.
 * A SEGMENTS entry must reproduce its spread's full text exactly
 * (validated below), so text edits in spreads.ts fail loudly here.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { execFileSync } from "child_process";
import path from "path";
import os from "os";
import { SPREADS, BOOK_TITLE, CLOSING_VERSE, CLOSING_VERSE_REF } from "../data/spreads";

const VOICES = {
  NARR: "r1KmysJdVYZjJCm4mL3b", // same narrator as the /bio story
  BOBBY: "pDxcmDdBPmpAPjBko2mF",
  PASTOR: "NOpBlnGInO9m6vDvFkFC",
  JERRY: "bIHbv24MWmeRgasZH58o",
  SELAH: "cvFuzQ0vxTsh7w2dXwwo", // no dialogue in v8 text; reserved
  HG: "W4xuemPfRE8habJ3YWg9",
} as const;
type Voice = keyof typeof VOICES;

const MODEL_ID = "eleven_multilingual_v2";
const OUT_DIR = path.resolve(process.cwd(), "public/audio");
const GAP_SECONDS = 0.3;

type Seg = { v: Voice; t: string; ttsText?: string };

// Spreads with character dialogue, segmented in text order.
// Every other spread is read whole by the narrator.
// Single-narrator book: no per-character segments. Every spread falls back to
// the NARR voice reading its joined lines (see job building below).
const SEGMENTS: Record<number, Seg[]> = {};

function loadApiKey(): string {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  const envPath = path.resolve(
    os.homedir(),
    "Documents/github-repos/mypersonalwebsite/.env.local"
  );
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^ELEVENLABS_API_KEY=(.+)$/);
      if (m) return m[1].trim();
    }
  }
  throw new Error("ELEVENLABS_API_KEY not found");
}

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

function validateSegments(): void {
  for (const [nStr, segs] of Object.entries(SEGMENTS)) {
    const n = Number(nStr);
    const spread = SPREADS.find((s) => s.n === n);
    if (!spread) throw new Error(`SEGMENTS: no spread ${n}`);
    const joined = norm(spread.lines.join(" "));
    const rebuilt = norm(segs.map((x) => x.t).join(" "));
    if (joined !== rebuilt) {
      throw new Error(
        `SEGMENTS drift on spread ${n}:\n  data: ${joined}\n  segs: ${rebuilt}`
      );
    }
  }
}

async function tts(text: string, voice: Voice, apiKey: string): Promise<Buffer> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICES[voice]}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.75,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      }
    );
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    const body = await res.text();
    if (res.status === 429 && attempt < 6) {
      const wait = 2000 * (attempt + 1);
      console.warn(`  429 for ${voice}, retrying in ${wait / 1000}s`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    throw new Error(`${voice} ${res.status} ${body}`);
  }
}

function concatWithGaps(files: string[], outPath: string): void {
  const inputs: string[] = [];
  const filters: string[] = [];
  const chain: string[] = [];
  files.forEach((f, i) => {
    inputs.push("-i", f);
    filters.push(
      `[${i}:a]aformat=sample_rates=44100:channel_layouts=mono[a${i}]`
    );
    if (i > 0) {
      filters.push(`anullsrc=r=44100:cl=mono:d=${GAP_SECONDS}[g${i}]`);
      chain.push(`[g${i}]`);
    }
    chain.push(`[a${i}]`);
  });
  filters.push(`${chain.join("")}concat=n=${chain.length}:v=0:a=1[out]`);
  execFileSync(
    "ffmpeg",
    ["-y", ...inputs, "-filter_complex", filters.join(";"), "-map", "[out]", "-b:a", "128k", outPath],
    { stdio: "pipe" }
  );
}

async function renderSegments(
  segs: Seg[],
  outName: string,
  apiKey: string
): Promise<void> {
  const outPath = path.join(OUT_DIR, `${outName}.mp3`);
  if (segs.length === 1) {
    writeFileSync(outPath, await tts(segs[0].ttsText ?? segs[0].t, segs[0].v, apiKey));
  } else {
    const tmp = path.join(os.tmpdir(), `gp-narr-${outName}-${process.pid}`);
    mkdirSync(tmp, { recursive: true });
    const files: string[] = [];
    for (let i = 0; i < segs.length; i++) {
      const f = path.join(tmp, `seg${i}.mp3`);
      writeFileSync(f, await tts(segs[i].ttsText ?? segs[i].t, segs[i].v, apiKey));
      files.push(f);
    }
    concatWithGaps(files, outPath);
  }
  const kb = readFileSync(outPath).length / 1024;
  console.log(`✓ ${outName} (${kb.toFixed(0)} KB, ${segs.length} segment${segs.length > 1 ? "s" : ""})`);
}

async function main() {
  validateSegments();
  const apiKey = loadApiKey();
  mkdirSync(OUT_DIR, { recursive: true });

  const onlyIdx = process.argv.indexOf("--only");
  const only = onlyIdx > -1 ? process.argv[onlyIdx + 1] : null;

  const jobs: { name: string; segs: Seg[] }[] = [];
  jobs.push({ name: "cover", segs: [{ v: "NARR", t: `${BOOK_TITLE}. The story of AITX, the largest AI builder community in Texas.` }] });
  for (const s of SPREADS) {
    jobs.push({
      name: `spread-${String(s.n).padStart(2, "0")}`,
      segs: SEGMENTS[s.n] ?? [{ v: "NARR", t: s.lines.join(" ") }],
    });
  }
  jobs.push({ name: "end", segs: [{ v: "NARR", t: `${CLOSING_VERSE} ${CLOSING_VERSE_REF}.` }] });

  const queue = jobs.filter(
    (j) => !only || j.name === only || j.name === `spread-${String(only).padStart(2, "0")}`
  ).filter((j) => only || !existsSync(path.join(OUT_DIR, `${j.name}.mp3`)));
  const CONCURRENCY = 2;
  let idx = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (idx < queue.length) {
        const job = queue[idx++];
        await renderSegments(job.segs, job.name, apiKey);
      }
    })
  );
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
