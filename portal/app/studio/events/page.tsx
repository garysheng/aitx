import type { Metadata } from "next";
import FlyerStudio from "@/components/events/FlyerStudio";

export const metadata: Metadata = {
  title: "AITX Event Flyer Studio",
  description: "Make an on-brand AITX event flyer in seconds. Monthly meetup, co-working, hackathon, hack fair, or free-form. Pick a city, add sponsors, download. Forked from the AITX Luma golden, fully reproducible.",
  openGraph: { title: "AITX Event Flyer Studio", description: "On-brand AITX event flyers in seconds.", type: "website", images: [{ url: "/assets/og-site.png", width: 1200, height: 630, alt: "The AITX Brand OS" }] },
  twitter: { card: "summary_large_image", images: ["/assets/og-site.png"] },
};

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#fbf5ec] font-body text-[color:var(--ink)]">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a href="/keynote" className="text-[color:var(--muted)] hover:text-[color:var(--ink)]">← Keynote</a>
          <a href="/studio/memes" className="text-[color:var(--muted)] hover:text-[color:var(--ink)]">Meme Studio</a>
          <a href="/agent" className="text-[color:var(--muted)] hover:text-[color:var(--ink)]">The agent</a>
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">Event Flyer Studio</h1>
        <p className="mt-3 max-w-2xl text-lg text-[color:var(--muted)]">
          The AITX Luma flyer, as a version-controlled template. Pick the event, the city, and the
          sponsors, and download an on-brand flyer in seconds. Every flyer is the same golden template
          with the variables swapped, so it is always on brand and always reproducible.
        </p>
        <div className="mt-8">
          <FlyerStudio />
        </div>
      </div>
    </main>
  );
}
