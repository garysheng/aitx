import type { Metadata } from "next";
import MemeStudio from "@/components/memes/MemeStudio";

export const metadata: Metadata = {
  title: "AITX Meme Studio — make memes with Michael, Jake & Chip",
  description: "Pick your cast (Michael, Jake, Chip), a template, and a caption. Generate an on-brand AITX meme powered by gpt-image-2, from the brand universe.",
  openGraph: {
    title: "AITX Meme Studio",
    description: "Make on-brand memes with Michael, Jake, and Chip.",
    type: "website",
    images: [{ url: "/assets/og-site.png", width: 1200, height: 630, alt: "The AITX Brand OS" }],
  },
  twitter: { card: "summary_large_image", images: ["/assets/og-site.png"] },
};

export default function MemesPage() {
  return (
    <main className="min-h-screen bg-[#fbf5ec] font-body text-[color:var(--ink)]">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a href="/keynote" className="text-[color:var(--muted)] hover:text-[color:var(--ink)]">← Keynote</a>
          <a href="/agent" className="text-[color:var(--muted)] hover:text-[color:var(--ink)]">The agent</a>
          <a href="/brand" className="text-[color:var(--muted)] hover:text-[color:var(--ink)]">Brand OS</a>
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">Meme Studio</h1>
        <p className="mt-3 max-w-2xl text-lg text-[color:var(--muted)]">
          Make an on-brand AITX meme with the founders and Chip. Pick your cast, a template, and a caption.
          It generates from the brand universe, so the likenesses and the vibe stay right.
        </p>
        <div className="mt-8">
          <MemeStudio />
        </div>
        <p className="mt-8 text-xs text-[color:var(--muted)]">
          Powered by gpt-image-2, with Michael, Jake, and Chip passed as references from the AITX canon.
        </p>
      </div>
    </main>
  );
}
