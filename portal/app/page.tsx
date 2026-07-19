import GoldenGallery from "@/components/GoldenGallery";
import { GOLDENS, GOLDEN_CATEGORIES } from "@/lib/goldens";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      {/* Hero / brand at a glance */}
      <header className="mb-12 flex flex-col gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo/aitx-wordmark.png" alt="AITX" className="h-12 w-auto object-contain" />
        <h1 className="font-display text-4xl font-bold sm:text-5xl">AITX Brand OS</h1>
        <p className="max-w-2xl text-lg text-[color:var(--muted)]">
          The AITX brand, in one place. Browse and download {GOLDENS.length} on-brand goldens, and see
          the exact model, prompt, and references behind every single one. The largest AI builder
          community in Texas, with open arms.
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full px-3 py-1 text-white" style={{ background: "var(--orange)" }}>#ff4201</span>
          <span className="rounded-full bg-black px-3 py-1 text-white">#010101</span>
          <span className="rounded-full border border-black/15 px-3 py-1">#ffffff</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          <a href="/keynote" className="inline-block rounded-md bg-[color:var(--orange)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--orange-deep)]">Take the tour with Chip →</a>
          <a href="/studio/events" className="inline-block rounded-md border border-black/15 px-4 py-2 text-sm font-semibold hover:border-[color:var(--orange)]">Flyer Studio →</a>
          <a href="/studio/memes" className="inline-block rounded-md border border-black/15 px-4 py-2 text-sm font-semibold hover:border-[color:var(--orange)]">Meme Studio →</a>
          <a href="/agent" className="inline-block rounded-md border border-black/15 px-4 py-2 text-sm font-semibold hover:border-[color:var(--orange)]">The living agent →</a>
        </div>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:var(--orange-deep)]">
          {GOLDEN_CATEGORIES.map((c) => <a key={c.key} href={`#${c.key}`} className="hover:underline">{c.label}</a>)}
        </nav>
      </header>

      <GoldenGallery />

      <footer className="mt-16 border-t border-black/10 pt-6 text-sm text-[color:var(--muted)]">
        <p>
          Every golden here is version-controlled and carries a provenance recipe: the model, the exact
          prompt, and every reference pinned by hash. Nothing is a mystery. You get a better sense of a
          person in person.
        </p>
        <p className="mt-3">
          This is one Agentic Brand Universe. The pattern repeats for any brand — the open standard is at{" "}
          <a href="https://www.agenticbranduniverse.com/" target="_blank" rel="noreferrer" className="font-semibold" style={{ color: "var(--orange-deep)" }}>agenticbranduniverse.com</a>.
        </p>
      </footer>
    </main>
  );
}
