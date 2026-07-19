export type AssetCategory =
  | "logo" | "founders" | "venue" | "product"
  | "flyer" | "social" | "sticker" | "meme" | "book";

export type BrandAsset = {
  id: string;
  name: string;
  category: AssetCategory;
  file: string;         // path under /assets
  downloadName: string; // filename offered on download
  blurb: string;
  composedFrom?: string[]; // atom ids this molecule was built from
};

export const CATEGORIES: { key: AssetCategory; label: string }[] = [
  { key: "logo", label: "The Mark" },
  { key: "founders", label: "Founders" },
  { key: "venue", label: "The Venue" },
  { key: "product", label: "Products" },
  { key: "flyer", label: "Flyers" },
  { key: "social", label: "Social" },
  { key: "sticker", label: "Stickers" },
  { key: "meme", label: "Memes" },
  { key: "book", label: "The Book" },
];

export const ASSETS: BrandAsset[] = [
  { id: "mark", name: "AITX open-arms mark", category: "logo", file: "/assets/logo/aitx-mark.png", downloadName: "aitx-mark.png", blurb: "The sacred logo. Always the real mark, never typed letters." },
  { id: "founders-standing", name: "Founders (standing)", category: "founders", file: "/assets/founders/founders-standing.png", downloadName: "aitx-founders-standing.png", blurb: "Michael and Jake, the locked two-shot." },
  { id: "founders-candid", name: "Founders (candid)", category: "founders", file: "/assets/founders/founders-candid.png", downloadName: "aitx-founders-candid.png", blurb: "Mid-conversation, warm." },
  { id: "michael", name: "Michael Daigler", category: "founders", file: "/assets/founders/michael.png", downloadName: "michael-daigler.png", blurb: "Founder." },
  { id: "jake", name: "Jake O'Shea", category: "founders", file: "/assets/founders/jake.png", downloadName: "jake-oshea.png", blurb: "Cofounder." },
  { id: "antler-alcove", name: "Antler speaking alcove", category: "venue", file: "/assets/venue/antler-alcove.png", downloadName: "antler-alcove.png", blurb: "AITX's home at Antler." },
  { id: "antler-signin", name: "Antler sign-in", category: "venue", file: "/assets/venue/antler-signin.png", downloadName: "antler-signin.png", blurb: "The front desk." },
  { id: "skylark", name: "AITX Skylark", category: "product", file: "/assets/product/skylark-orange.png", downloadName: "aitx-skylark.png", blurb: "The custom AITX shoe." },
  { id: "cap", name: "AITX cap", category: "product", file: "/assets/product/aitx-cap.png", downloadName: "aitx-cap.png", blurb: "Merch." },
  { id: "hoodie", name: "AITX hoodie", category: "product", file: "/assets/product/aitx-hoodie.png", downloadName: "aitx-hoodie.png", blurb: "Merch." },
  { id: "flyer-hackathon", name: "Hackathon flyer", category: "flyer", file: "/assets/flyer/hackathon.png", downloadName: "aitx-hackathon-flyer.png", blurb: "Event poster.", composedFrom: ["mark", "antler-alcove"] },
  { id: "flyer-meetup", name: "Monthly meetup flyer", category: "flyer", file: "/assets/flyer/monthly-meetup.png", downloadName: "aitx-meetup-flyer.png", blurb: "Event poster.", composedFrom: ["mark", "antler-alcove"] },
  { id: "ig-post", name: "Instagram post", category: "social", file: "/assets/social/instagram-post.png", downloadName: "aitx-ig-post.png", blurb: "Social card.", composedFrom: ["founders-standing", "mark"] },
  { id: "meme-uncle-sam", name: "Uncle Sam: submit before the deadline", category: "meme", file: "/assets/meme/uncle-sam-submit.png", downloadName: "aitx-uncle-sam.png", blurb: "Hackathon meme.", composedFrom: ["michael", "mark"] },
  { id: "meme-pov", name: "POV: you found AITX", category: "meme", file: "/assets/meme/pov-found-aitx.png", downloadName: "aitx-pov-meme.png", blurb: "Wholesome meme.", composedFrom: ["michael", "mark"] },
  { id: "sticker-mark", name: "Mark sticker", category: "sticker", file: "/assets/sticker/aitx-mark.png", downloadName: "aitx-sticker-mark.png", blurb: "Die-cut vinyl.", composedFrom: ["mark"] },
  { id: "sticker-texas", name: "Texas Loves AI sticker", category: "sticker", file: "/assets/sticker/texas-loves-ai.png", downloadName: "aitx-sticker-texas.png", blurb: "Die-cut vinyl.", composedFrom: ["mark"] },
  { id: "sticker-built", name: "Built in Texas sticker", category: "sticker", file: "/assets/sticker/built-in-texas.png", downloadName: "aitx-sticker-built.png", blurb: "Die-cut vinyl.", composedFrom: ["mark"] },
  { id: "book-origin", name: "The Origin of the AITX Community", category: "book", file: "/assets/book/origin-cover.webp", downloadName: "aitx-origin-cover.webp", blurb: "The narrated book. Read it at aitx-origin.vercel.app." },
];
