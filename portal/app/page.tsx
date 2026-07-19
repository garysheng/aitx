import AssetGallery from "@/components/AssetGallery";
import { CATEGORIES } from "@/lib/brand";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      {/* Hero / brand at a glance */}
      <header className="mb-12 flex flex-col gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo/aitx-mark.png" alt="AITX" className="h-14 w-auto" />
        <h1 className="font-display text-4xl font-bold sm:text-5xl">AITX Brand OS</h1>
        <p className="max-w-2xl text-lg text-[color:var(--muted)]">
          The AITX brand, in one place. Browse and download on-brand assets, and see how they are made.
          The largest AI builder community in Texas, with open arms.
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full px-3 py-1 text-white" style={{ background: "var(--orange)" }}>#ff4201</span>
          <span className="rounded-full bg-black px-3 py-1 text-white">#010101</span>
          <span className="rounded-full border border-black/15 px-3 py-1">#ffffff</span>
        </div>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:var(--orange-deep)]">
          {CATEGORIES.map((c) => <a key={c.key} href={`#${c.key}`} className="hover:underline">{c.label}</a>)}
        </nav>
      </header>

      <AssetGallery />

      <footer className="mt-16 border-t border-black/10 pt-6 text-sm text-[color:var(--muted)]">
        Every asset here is version-controlled in the AITX brand OS. You get a better sense of a person in person.
      </footer>
    </main>
  );
}
