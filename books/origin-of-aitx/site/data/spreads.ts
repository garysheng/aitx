// The Origin of the AITX Community — spread text, verbatim from the blessed
// MANUSCRIPT.md (12 spreads). Each landscape spread is sliced into /pages/NN-l
// and /pages/NN-r; the caption is OVERLAID on the right half. The art itself is
// textless except diegetic in-scene text (the aitx logo, a Luma page, an NVIDIA
// monitor). Cover is /art/cover-painted.webp; closing plate is /art/back-cover.webp.

export type Spread = {
  n: number;
  lines: string[];
  pos?: "bottom" | "top" | "center";
};

export const BOOK_TITLE = "The Origin of the AITX Community";
export const REFRAIN = "You get a better sense of a person in person.";

export const CLOSING_VERSE =
  "If you want to be in that room in Texas, there is a default answer, and it has open arms.";
export const CLOSING_VERSE_REF = "";

export const SPREADS: Spread[] = [
  {
    n: 1,
    pos: "bottom",
    lines: [
      "SXSW, Austin, 2023. Two people were building with AI, and both had the same problem:",
      "nobody to actually talk to about it.",
    ],
  },
  {
    n: 2,
    pos: "bottom",
    lines: [
      "Then they bumped into each other and had the conversation they had both been missing.",
      "So they made one decision: build the room they wished existed.",
    ],
  },
  {
    n: 3,
    pos: "top",
    lines: [
      "April 2023, the first event. About ten people, off a Luma link, in a borrowed room.",
      "No venue of their own, no budget. Just two guys and whatever space they could get, in Austin.",
    ],
  },
  {
    n: 4,
    pos: "top",
    lines: [
      "Ten became twenty-five, then a hundred. Borrowed rooms all over Austin, all filling up.",
      "Eventually Antler opened its doors and AITX had a home: a hub for engineers, operators, and really talented founders.",
    ],
  },
  {
    n: 5,
    pos: "top",
    lines: [
      "It was never a room of sales pitches. It was builders showing real things.",
      "Ninety seconds each, live demos: here is a real problem, and here is what I made.",
    ],
  },
  {
    n: 6,
    pos: "top",
    lines: [
      "Then they stopped just talking and started building together. Hackathons. Moltathon. Web AI.",
      "The one with NVIDIA, where a team won on brand new hardware. Weekends that taught the tools, put ideas in front of people, and got some of them jobs.",
    ],
  },
  {
    n: 7,
    pos: "top",
    lines: [
      "Reputation spreads, and it does not spread through sales.",
      "The sponsors came because these two did favors nobody asked for and showed up when it did not pay. NVIDIA. Meta. Google Cloud.",
      "Each good thing made the next one easier.",
    ],
  },
  {
    n: 8,
    pos: "bottom",
    lines: [
      "Austin was never the whole point. They took it to Houston, then to Dallas,",
      "so the best Texas talent would have a reason to stay in Texas. A backstop of opportunity for local builders.",
    ],
  },
  {
    n: 9,
    pos: "bottom",
    lines: [
      "Michael does not even own a car. He walks Austin, and when a new city needs him, he rents one and drives up to host the event himself.",
      "He shows up. That is the entire strategy.",
    ],
  },
  {
    n: 10,
    pos: "bottom",
    lines: [
      "Ask him to pitch AITX and he will not pitch AITX.",
      "He will tell you Texas is awesome, and that AITX is just the signpost pointing at it.",
      "That is why people trust it.",
    ],
  },
  {
    n: 11,
    pos: "top",
    lines: [
      "Ask him why any of it works, and he points at the same thing every time. You get a better sense of a person in person.",
      "Loyalty. Patience. Kindness. Doing what you say. Keeping good company.",
      "Every honest interaction is one more piece of evidence, and evidence compounds into trust.",
    ],
  },
  {
    n: 12,
    pos: "bottom",
    lines: [
      "That is how ten people in a borrowed room became the largest AI builder community in Texas.",
      "Not with a campaign. With three years of showing up.",
    ],
  },
  {
    n: 13,
    pos: "bottom",
    lines: [
      "And where is this going?",
      "AITX is becoming the room where Texas builders and the great tech companies meet.",
      "It is where people come to launch the future of their careers, and their lives.",
    ],
  },
];
