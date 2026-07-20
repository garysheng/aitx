// Self-serve keynote, co-presented by Gary (the human host, in his own ElevenLabs
// voice clone) and Chip (the AITX brand czar, in his own Texan voice). Visitors
// hit Play; the two hand the mic back and forth and it auto-advances when each
// clip ends. One beat per slide. `speaker` is who's talking on that slide (drives
// the presenter bubble + caption label). `audio` is the static clip for that
// slide, or "inline" when the slide (the live demo) plays its own narration.
// `seconds` is the fallback advance time for inline / if audio fails.
//
// Split (locked 2026-07-20): Gary hosts the human framing (open, who I am, the
// pattern, the insight, the thesis); Chip demos the product (everything else).
// Chip's lines are verbatim to his existing chip-*.mp3 clips — do not edit them
// without re-recording, or the caption drifts from the audio.
export type Beat = { line: string; audio: string; seconds: number; speaker: "gary" | "chip" };

const A = (n: string) => `/assets/keynote/audio/chip-${n}.mp3`;
const G = (n: string) => `/assets/keynote/audio/gary-${n}.mp3`;

export const SCRIPT: Beat[] = [
  // 1 — Gary opens, introduces Chip, sets up the problem
  { speaker: "gary", line: "Hey, I'm Gary. I'm an applied AI engineer, and I built this at the hackathon with NVIDIA. I want to show you the one idea I most want every founder in this room to take home. And I didn't come alone. Say hello to Chip, the AITX brand czar. He's living proof of the idea, and you'll hear plenty from him. But first, let me tell you what I keep running into.", audio: G("01"), seconds: 27 },
  // 2 — Gary: who I am
  { speaker: "gary", line: "I help businesses get the most out of generative AI. Companies and churches alike. The tools are the same everywhere I go, and so is the question I always end up asking: are you actually maximizing them?", audio: G("02"), seconds: 14 },
  // 3 — Gary: the pattern, then hands the mic to Chip
  { speaker: "gary", line: "Here's the pattern I keep seeing. Everyone sees the opportunity in generative AI. Almost no one is maximizing it. Most teams use it like a slightly faster intern. One-off prompts, generic output, a logo that's almost right. That's slop, and slop is not free. Every off-brand asset chips away at the brand you spent years building. Chip, show them what the other way looks like.", audio: G("03"), seconds: 29 },
  // 4 — Chip (verbatim to chip-04.mp3)
  { speaker: "chip", line: "Here's what that looks like. On the left, raw AI made this Hack Fair graphic. Garbled, off-brand, can't even tell how it was made. On the right, I made the same thing from the AITX universe. On brand, correct, sponsors and all.", audio: A("04"), seconds: 15 },
  // 5 — Chip
  { speaker: "chip", line: "Same tools. The difference is the universe behind them. A whole origin story, a full merch line, memes in the community's own voice. Every one unmistakably AITX, every one made in minutes.", audio: A("05"), seconds: 13 },
  // 6 — Gary jumps back in for the insight, then hands back to Chip
  { speaker: "gary", line: "Let me jump back in here, because this is the part nobody tells you. You don't really know your brand until you try things. Taste gets discovered by making stuff. You don't declare it on day one. So your brand should be a living thing, not a PDF you wrote once and filed away. Okay Chip, keep going.", audio: G("06"), seconds: 20 },
  // 7 — Chip: the definition
  { speaker: "chip", line: "That's what I am. An agentic brand universe. A version-controlled home for your brand, and an agent, that's me, who makes anything you need from it, on brand, on demand.", audio: A("07"), seconds: 13 },
  // 8 — Chip: the three parts
  { speaker: "chip", line: "It comes down to three things. The canon, the truth of your brand. The goldens, the assets you've blessed. And me, the agent, who makes anything from them.", audio: A("07b"), seconds: 12 },
  // 9 — Chip
  { speaker: "chip", line: "A golden is an asset y'all blessed. The taste you keep. From then on, it pulls every new thing I make toward your best work, instead of drifting toward the average.", audio: A("08"), seconds: 12 },
  // 10 — Chip
  { speaker: "chip", line: "And a golden ain't a one-off. It's a process. Get one hackathon flyer right, and now you've got a golden recipe for hackathon flyers. Next one, just change the city and the sponsors, and it falls right out.", audio: A("09"), seconds: 14 },
  // 11 — Chip
  { speaker: "chip", line: "Every single thing I make remembers exactly how it was made. The model, the prompt, the exact references, pinned by hash. No guessing. Anything can be rebuilt.", audio: A("10"), seconds: 12 },
  // 12 — Chip
  { speaker: "chip", line: "So Michael and Jake, the founders, they don't call Gary for assets anymore. They just talk to me. I hold the canon, the goldens, and the rules, and I make it on brand. They stay in charge of taste. I do the making.", audio: A("11"), seconds: 15 },
  // 13 — live demo (Chip narrates himself, inline)
  { speaker: "chip", line: "Now watch me work. Give me a task, and I'll learn from my own mistakes, live.", audio: "inline", seconds: 34 },
  // 14 — Chip
  { speaker: "chip", line: "Same brain, another superpower. NVIDIA, thank y'all for putting real tools in our builders' hands with those Nemotron models and GPUs. Watching our community bring projects to life with them was pure magic. Come build the future with us.", audio: A("13"), seconds: 18 },
  // 15 — Chip: the embedded origin book
  { speaker: "chip", line: "This is the AITX origin story, made from the universe, right here on the page. Go ahead and flip through it.", audio: A("14"), seconds: 9 },
  // 16 — Chip: and the whole library grows
  { speaker: "chip", line: "And it wasn't the only one. Two more, one about Michael, one about Mark Heaps over at NVIDIA, each about thirty minutes of agent time. The whole library grows just by asking.", audio: A("14b"), seconds: 13 },
  // 17 — Chip
  { speaker: "chip", line: "It's CRISPR plus GitHub for your brand DNA. Edit it once, and every future asset inherits the change. I even learn your voice from my own mistakes. Your brand stops drifting and starts compounding.", audio: A("15"), seconds: 14 },
  // 18 — Gary lands the thesis
  { speaker: "gary", line: "So here's my takeaway. In 2026, every serious company should have one of these. High-quality, soulful, on-brand work in minutes, and it gets better every single time. That's the standard now. Everything you just saw was made from the AITX universe. So scroll on down and explore it yourself. It has open arms.", audio: G("16"), seconds: 24 },
  // 19 — Chip gets the fun last word
  { speaker: "chip", line: "Alright, one more thing before you go explore. See, Michael Daigler ain't totally sure about me yet. He keeps lookin' at Joy over here, our open-arms logo all come to life, and I catch him thinkin' maybe Joy oughta be the mascot. And honestly? Look at that face. I get it. Joy is the heart of this brand. I'm the hands. Plenty of room in this universe for the both of us.", audio: A("17"), seconds: 21 },
  // 20 — Explorer intro (Chip): now touch the actual thing
  { speaker: "chip", line: "And now, go on and touch the actual thing. Everything below was made from the universe. The cast, the goldens, the rules, and live tools you can use right this second.", audio: A("20"), seconds: 13 },
  // 21 — Explorer: the cast (Chip)
  { speaker: "chip", line: "Meet the cast. Version-controlled characters that always look like themselves. Michael, Jake, me, Gary, and Mark over at NVIDIA.", audio: A("21"), seconds: 11 },
  // 22 — Explorer: provenance (Chip)
  { speaker: "chip", line: "Every character starts from real reference photos. The look gets locked as image data, not a description, so the face never drifts.", audio: A("22"), seconds: 11 },
  // 23 — Explorer: the goldens (Chip)
  { speaker: "chip", line: "The goldens. Blessed assets, and every new thing I make rides on them. Merch, memes, books, flyers, each one carrying its full provenance recipe.", audio: A("23"), seconds: 12 },
  // 24 — Explorer: the rules (Chip)
  { speaker: "chip", line: "The brand knows its own rules, and so do I. Plain language, version-controlled. The brand rules, and the voice.", audio: A("24"), seconds: 10 },
  // 25 — Explorer: live tools (Chip)
  { speaker: "chip", line: "And these are live. Everything I can do, you can do right now. Make a meme, build a flyer, write a sponsor a thank-you, or watch me learn.", audio: A("25"), seconds: 12 },
  // 26 — Explorer: the open standard (Gary closes)
  { speaker: "gary", line: "One last thing. AITX is just one agentic brand universe. The same pattern works for any brand: a personal brand, a church, a company. The brand universe is a real standard today. Go build yours.", audio: G("26"), seconds: 17 },
];
