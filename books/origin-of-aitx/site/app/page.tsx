import BookReader from "@/components/BookReader";
import { BOOK_TITLE, REFRAIN } from "@/data/spreads";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-2 py-8 sm:px-4">
      <p className="rotate-hint font-display" aria-hidden>
        <span className="rotate-hint__icon">⟳</span> Tilt your phone sideways
        for the best reading experience
      </p>
      <BookReader />
      <footer className="mt-10 flex flex-col items-center gap-2 pb-4 text-center">
        <div className="wisp-dot" aria-hidden />
        <p
          className="font-display text-xs tracking-[0.26em] opacity-60"
          style={{ color: "var(--gold-deep)" }}
        >
          {BOOK_TITLE.toUpperCase()} · AITX
        </p>
        <p
          className="font-body text-xs italic opacity-40"
          style={{ color: "var(--gold-deep)" }}
        >
          {REFRAIN}
        </p>
      </footer>
    </main>
  );
}
