// Co-presented script. Gary carries the argument; Chip (the AITX brand czar)
// takes the middle act in his own voice. One beat per slide.
//   speaker "gary" → Gary reads `line` off the teleprompter.
//   speaker "chip" → Chip speaks `line` aloud (his voice). `garyCue` is Gary's
//     short stage cue. `audio` is Chip's clip: a static mp3 path, or "inline"
//     when the slide component plays its own narration (the live demo).
export type Beat = {
  speaker: "gary" | "chip";
  line: string;
  seconds: number;
  garyCue?: string;
  audio?: string;
};

export const SCRIPT: Beat[] = [
  { speaker: "gary", line: "Thank you, AITX and NVIDIA. I came solo, and I want to leave you the one idea I most want every founder here to take home.", seconds: 13 },
  { speaker: "gary", line: "I'm Gary, an applied AI engineer. I help companies, and churches, get the most out of generative AI.", seconds: 9 },
  { speaker: "gary", line: "Here's the pattern I keep seeing. Everyone sees the opportunity in generative AI. Almost no one is maximizing it.", seconds: 10 },
  { speaker: "gary", line: "Watch. On the left, raw AI made this Hack Fair graphic. Garbled, off-brand, unrepeatable. On the right, Chip made the same thing from the AITX universe. On brand, correct, sponsors and all.", seconds: 14 },
  { speaker: "gary", line: "Same tools, with a brand universe behind them. A whole origin story, a full merch line, all unmistakably AITX, all in minutes.", seconds: 12 },
  { speaker: "gary", line: "Here's the thing nobody tells you. You don't know your brand until you try things. Taste is discovered, not declared.", seconds: 11 },
  { speaker: "gary", line: "So a brand isn't a PDF. It's a living universe. Your canon, your best assets, and an agent that makes anything from them.", seconds: 11 },
  { speaker: "gary", line: "A golden is an asset you blessed. The taste you keep. From then on, it pulls every new asset toward your best work.", seconds: 11 },
  { speaker: "gary", line: "And a golden isn't a one-off. It's a process. Get the hackathon graphic right once, and every future one just changes the variables.", seconds: 12 },
  { speaker: "gary", line: "Every asset remembers exactly how it was made. The model, the prompt, the exact references. No guessing. Fully reproducible.", seconds: 11 },

  // --- Chip's act ---
  { speaker: "chip", garyCue: "Say: 'They don't call me anymore. They talk to Chip.' Then let Chip introduce himself.",
    line: "Howdy, y'all. I'm Chip, the AITX brand czar. I keep everything that makes AITX feel like AITX: the canon, the goldens, the rules. Y'all need somethin' on brand? You just holler at me.", seconds: 17, audio: "/assets/keynote/audio/chip-11-intro.mp3" },
  { speaker: "chip", garyCue: "Let Chip run his live demo. Just stand back and let it play.",
    line: "[Chip narrates his live demo in his own voice.]", seconds: 34, audio: "inline" },
  { speaker: "chip", garyCue: "Let Chip thank NVIDIA in his own voice.",
    line: "NVIDIA, thank y'all for puttin' real tools in our builders' hands with those Nemotron models and GPUs. Watchin' our community bring projects to life with 'em was pure magic. Y'all's support means the world to us. Come build the future with us.", seconds: 18, audio: "/assets/keynote/audio/chip-13-thanks.mp3" },

  // --- Gary lands it ---
  { speaker: "gary", line: "Here's the proof. Two real narrated books about Michael. I spent a few minutes on each. Chip did the rest, about thirty minutes a book. And they stay alive. Change the shirt, add a spread, just by talking.", seconds: 15 },
  { speaker: "gary", line: "CRISPR plus GitHub for your brand DNA. Edit it once, and every future asset inherits the change. It even learns your voice from its own mistakes.", seconds: 12 },
  { speaker: "gary", line: "In 2026, every serious company should have one of these. Everything you just saw was made from your universe. This is just the beginning. Thank you.", seconds: 14 },
];
