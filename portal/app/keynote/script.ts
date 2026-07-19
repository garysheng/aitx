// The spoken script + per-slide timing for the auto-advancing "Present" mode.
// One entry per keynote slide. `line` is what Gary reads off the teleprompter;
// `seconds` is how long the slide holds before auto-advancing.
export type Beat = { line: string; seconds: number };

export const SCRIPT: Beat[] = [
  { line: "Thank you, AITX and NVIDIA. I came solo, and I want to leave you the one idea I most want every founder here to take home.", seconds: 13 },
  { line: "I'm Gary, an applied AI engineer. I help companies, and churches, get the most out of generative AI.", seconds: 9 },
  { line: "Here's the pattern I keep seeing. Everyone sees the opportunity in generative AI. Almost no one is maximizing it.", seconds: 10 },
  { line: "This is what it looks like without a system. A real hackathon graphic. Garbled text, stock clip-art. You can't even tell how it was made.", seconds: 12 },
  { line: "Same tools, with a brand universe behind them. A whole origin story, a full merch line, all unmistakably AITX, all in minutes.", seconds: 12 },
  { line: "Here's the thing nobody tells you. You don't know your brand until you try things. Taste is discovered, not declared.", seconds: 11 },
  { line: "So a brand isn't a PDF. It's a living system. Your canon, your best assets, and an agent that makes anything from them.", seconds: 11 },
  { line: "A golden is an asset you blessed. The taste you keep. From then on, it pulls every new asset toward your best work.", seconds: 11 },
  { line: "And a golden isn't a one-off. It's a process. Get the hackathon graphic right once, and every future one just changes the variables.", seconds: 12 },
  { line: "Every asset remembers exactly how it was made. The model, the prompt, the exact references. No guessing. Fully reproducible.", seconds: 11 },
  { line: "Michael and Jake don't call me anymore. They talk to Chip, the AITX brand czar. Let me introduce him.", seconds: 9 },
  { line: "[Let Chip talk. He narrates this himself in his own voice. Just let it play.]", seconds: 32 },
  { line: "Same brain, another superpower. Chip writes NVIDIA a thank-you. Warm, human, never corporate. Record it in your own voice, send it as a card. Gratitude at the speed of software.", seconds: 13 },
  { line: "The story is alive. Change Michael's shirt in every panel. Add two spreads. You edit it by talking, and it's all version-controlled.", seconds: 12 },
  { line: "CRISPR for your brand DNA. Edit it once, and every future asset inherits the change. It even learns your rules from its own mistakes.", seconds: 12 },
  { line: "In 2026, every serious company should have one of these. Everything you just saw was made from your universe. This is just the beginning. Thank you.", seconds: 14 },
];
