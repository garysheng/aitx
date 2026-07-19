import { copyFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const REPO = path.resolve(process.cwd(), "..");        // portal/ -> repo root
const OUT = path.resolve(process.cwd(), "public/assets");

// [sourceRelativeToRepo, destRelativeToOut]
const FILES: [string, string][] = [
  ["universe/reference/aitx-mark/aitx-logo.png", "logo/aitx-mark.png"],
  ["universe/reference/founders/founders-standing.png", "founders/founders-standing.png"],
  ["universe/reference/founders/founders-candid.png", "founders/founders-candid.png"],
  ["universe/reference/michael-daigler/gabr-michael.png", "founders/michael.png"],
  ["universe/reference/jake-oshea/gabr-jake.png", "founders/jake.png"],
  ["universe/reference/antler/alcove-live-1.png", "venue/antler-alcove.png"],
  ["universe/reference/antler/signin-2.png", "venue/antler-signin.png"],
  ["universe/reference/products/skylark/opt-2-orange.png", "product/skylark-orange.png"],
  ["universe/reference/products/merch/aitx-cap.png", "product/aitx-cap.png"],
  ["universe/reference/products/merch/aitx-hoodie.png", "product/aitx-hoodie.png"],
  ["goldens/flyers/hackathon.png", "flyer/hackathon.png"],
  ["goldens/flyers/monthly-meetup.png", "flyer/monthly-meetup.png"],
  ["goldens/social/instagram-post.png", "social/instagram-post.png"],
  ["goldens/memes/uncle-sam-submit.png", "meme/uncle-sam-submit.png"],
  ["goldens/memes/pov-found-aitx.png", "meme/pov-found-aitx.png"],
  ["goldens/stickers/aitx-mark.png", "sticker/aitx-mark.png"],
  ["goldens/stickers/texas-loves-ai.png", "sticker/texas-loves-ai.png"],
  ["goldens/stickers/built-in-texas.png", "sticker/built-in-texas.png"],
  ["books/origin-of-aitx/site/public/art/cover-painted.webp", "book/origin-cover.webp"],
];

for (const [src, dest] of FILES) {
  const from = path.join(REPO, src);
  const to = path.join(OUT, dest);
  if (!existsSync(from)) { console.warn("MISSING", src); continue; }
  mkdirSync(path.dirname(to), { recursive: true });
  copyFileSync(from, to);
  console.log("copied", dest);
}
