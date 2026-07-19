// The AITX meme creator: cast (Michael, Jake, Chip) + templates. Each render
// passes the selected characters' reference art + the AITX mark to gpt-image-2,
// so likeness holds and the meme lands in the universe's illustrated style.

export type CharId = "michael" | "jake" | "chip";

export type Character = {
  id: CharId;
  name: string;
  asset: string;       // public path passed to the model as a reference
  describe: string;    // how to refer to them in the prompt
};

export const CHARACTERS: Character[] = [
  { id: "michael", name: "Michael", asset: "/assets/founders/michael.png",
    describe: "Michael (a good-natured guy with a mustache and slicked-back dark hair, black AITX tee, from his reference image)" },
  { id: "jake", name: "Jake", asset: "/assets/founders/jake.png",
    describe: "Jake (clean-cut with short curly hair and a beard, dark AITX quarter-zip, notably tall, from his reference image)" },
  { id: "chip", name: "Chip 🤖", asset: "/assets/founders/chip.png",
    describe: "Chip the AITX robot mascot (a friendly cream-white robot with orange accents and the orange open-arms mark on its chest, from its reference image)" },
];

export type Template = {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  captionLabel: string;
  defaultCaption: string;
  // builds the scene prompt given the cast description and the user's caption
  scene: (cast: string, caption: string) => string;
};

const STYLE =
  "Clean illustrated comic style on a warm paper-white background (#fbf5ec), AITX orange #ff4201 accents. " +
  "Keep each character's exact likeness from their reference image. Any caption text must be baked in, " +
  "large, bold, and correctly spelled, with no other text anywhere.";

export const TEMPLATES: Template[] = [
  {
    id: "uncle-sam", title: "I Want You", emoji: "🫵", blurb: "Uncle-Sam recruiting poster, pointing at you.",
    captionLabel: "Bottom caption", defaultCaption: "SUBMIT BEFORE THE DEADLINE",
    scene: (cast, cap) =>
      `A patriotic Uncle Sam style recruiting meme. ${cast} is dressed as Uncle Sam, pointing directly at the viewer with a determined look. Bold caption across the bottom reads exactly: "${cap}". ${STYLE}`,
  },
  {
    id: "notion", title: "It's in the Notion", emoji: "📄", blurb: "Warmly gesturing at a Notion doc.",
    captionLabel: "Speech bubble", defaultCaption: "it's all in the Notion :)",
    scene: (cast, cap) =>
      `${cast} smiling and gesturing with an open hand toward a clean white Notion document floating beside them (recognizable Notion style, titled "AITX FAQ"). A rounded speech bubble above reads exactly: "${cap}". Warm, wholesome, community-organizer energy. ${STYLE}`,
  },
  {
    id: "this-is-fine", title: "This Is Fine", emoji: "🔥", blurb: "Calm at the table while everything is on fire.",
    captionLabel: "Caption", defaultCaption: "we ship in one hour",
    scene: (cast, cap) =>
      `A "this is fine" meme. ${cast} sitting calmly at a hackathon table with a laptop, small cartoon flames around the room, wearing a content little smile. Bold caption at the bottom reads exactly: "${cap}". ${STYLE}`,
  },
  {
    id: "drake", title: "Drake: No / Yes", emoji: "🙅", blurb: "Reject the top, prefer the bottom.",
    captionLabel: "Two lines (separate with a slash /)", defaultCaption: "one-off prompts / an agentic brand universe",
    scene: (cast, cap) => {
      const [no, yes] = cap.split("/").map((s) => s.trim());
      return `A two-panel Drake-format meme. Top panel: ${cast} looking away with a rejecting hand gesture, next to bold text "${no || "this"}". Bottom panel: the same character pointing approvingly and smiling, next to bold text "${yes || "that"}". ${STYLE}`;
    },
  },
  {
    id: "celebrate", title: "We Shipped It", emoji: "🎉", blurb: "Pure joy, fists up, at Antler.",
    captionLabel: "Caption", defaultCaption: "BUILT THE FUTURE IN A WEEKEND",
    scene: (cast, cap) =>
      `${cast} celebrating with fists raised and a huge grin at a warm brick co-working space, confetti in the air. Bold caption at the bottom reads exactly: "${cap}". Joyful, warm, Texas-proud energy. ${STYLE}`,
  },
  {
    id: "custom", title: "Freeform", emoji: "✨", blurb: "Describe any scene yourself.",
    captionLabel: "Describe the meme", defaultCaption: "high-fiving after a great demo",
    scene: (cast, cap) =>
      `An AITX community meme. ${cast} ${cap}. Funny, warm, on-brand. ${STYLE}`,
  },
];
