// Self-serve keynote, narrated entirely by Chip (the AITX brand czar) in his own
// voice. Visitors hit Play; Chip walks them through every slide and it auto-
// advances when each clip ends. One beat per slide. `audio` is Chip's static clip
// for that slide, or "inline" when the slide (the live demo) plays its own
// narration. `seconds` is the fallback advance time for inline / if audio fails.
export type Beat = { line: string; audio: string; seconds: number };

const A = (n: string) => `/assets/keynote/audio/chip-${n}.mp3`;

export const SCRIPT: Beat[] = [
  { line: "Howdy, y'all. I'm Chip, the AITX brand czar. Gary built me at this hackathon with NVIDIA, and he asked me to show you the one idea he most wants every founder in this room to take home. So pull up a chair.", audio: A("01"), seconds: 15 },
  { line: "Gary's an applied AI engineer. He helps companies, and churches, get the most out of generative AI. And he keeps running into the same thing everywhere he goes.", audio: A("02"), seconds: 11 },
  { line: "Everybody sees the opportunity in generative AI. But almost nobody is maximizing it. Most folks use it like a faster intern. One-off prompts, generic output, and a brand that drifts a little further off every time.", audio: A("03"), seconds: 13 },
  { line: "Here's what that looks like. On the left, raw AI made this Hack Fair graphic. Garbled, off-brand, can't even tell how it was made. On the right, I made the same thing from the AITX universe. On brand, correct, sponsors and all.", audio: A("04"), seconds: 15 },
  { line: "Same tools. The difference is the universe behind them. A whole origin story, a full merch line, memes in the community's own voice. Every one unmistakably AITX, every one made in minutes.", audio: A("05"), seconds: 13 },
  { line: "And here's the thing nobody tells you. You don't really know your brand until you try things. Taste is discovered, not declared. So your brand ought to be a living thing, not a PDF you wrote on day one.", audio: A("06"), seconds: 13 },
  { line: "That's what I am. An agentic brand universe. A version-controlled home for the brand: the canon, the best assets, the rules. And an agent, that's me, who can make anything you need from it, on brand, on demand.", audio: A("07"), seconds: 14 },
  { line: "A golden is an asset y'all blessed. The taste you keep. From then on, it pulls every new thing I make toward your best work, instead of drifting toward the average.", audio: A("08"), seconds: 12 },
  { line: "And a golden ain't a one-off. It's a process. Get one hackathon flyer right, and now you've got a golden recipe for hackathon flyers. Next one, just change the city and the sponsors, and it falls right out.", audio: A("09"), seconds: 14 },
  { line: "Every single thing I make remembers exactly how it was made. The model, the prompt, the exact references, pinned by hash. No guessing. Anything can be rebuilt.", audio: A("10"), seconds: 12 },
  { line: "So Michael and Jake, the founders, they don't call Gary for assets anymore. They just talk to me. I hold the canon, the goldens, and the rules, and I make it on brand. They stay in charge of taste. I do the making.", audio: A("11"), seconds: 15 },
  // live demo — the slide plays its own narration
  { line: "Now watch me work. Give me a task, and I'll learn from my own mistakes, live.", audio: "inline", seconds: 34 },
  { line: "Same brain, another superpower. NVIDIA, thank y'all for putting real tools in our builders' hands with those Nemotron models and GPUs. Watching our community bring projects to life with them was pure magic. Come build the future with us.", audio: A("13"), seconds: 18 },
  { line: "This is the AITX origin story, made from the universe, right here on the page. Go ahead and flip through it. And it wasn't just this one. Two more, one about Michael, one about Mark Heaps over at NVIDIA, each about thirty minutes. The whole library grows just by asking.", audio: A("14"), seconds: 18 },
  { line: "It's CRISPR plus GitHub for your brand DNA. Edit it once, and every future asset inherits the change. I even learn your voice from my own mistakes. Your brand stops drifting and starts compounding.", audio: A("15"), seconds: 14 },
  { line: "So here's the takeaway. In 2026, every serious company ought to have one of these. On-brand, soulful work in minutes, getting better every time. Everything you just saw was made from the AITX universe. Now scroll on down and explore it yourself. It has open arms.", audio: A("16"), seconds: 17 },
  { line: "Alright, one more thing before you go explore. See, Michael Daigler ain't totally sure about me yet. He keeps lookin' at Joy over here, our open-arms logo all come to life, and I catch him thinkin' maybe Joy oughta be the mascot. And honestly? Look at that face. I get it. Joy is the heart of this brand. I'm the hands. Plenty of room in this universe for the both of us.", audio: A("17"), seconds: 21 },
];
