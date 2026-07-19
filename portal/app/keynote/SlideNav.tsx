"use client";

import { useEffect, useState } from "react";

// Sticky, clickable up/down + dot navigation for the scroll-snap deck.
export default function SlideNav({ count }: { count: number }) {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const secs = Array.from({ length: count }, (_, i) => document.getElementById(`s${i + 1}`))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.id.slice(1)));
        });
      },
      { threshold: 0.5 },
    );
    secs.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [count]);

  const go = (n: number) => {
    const t = Math.min(Math.max(n, 1), count);
    document.getElementById(`s${t}`)?.scrollIntoView({ behavior: "smooth" });
  };

  const arrow =
    "flex h-9 w-9 items-center justify-center rounded-full border border-neutral-400/60 bg-white/80 text-neutral-700 shadow-sm backdrop-blur transition hover:border-[#ff4201] hover:text-[#ff4201] disabled:opacity-30";

  return (
    <nav className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-3 sm:right-6 sm:flex">
      <button onClick={() => go(active - 1)} disabled={active === 1} aria-label="Previous slide" className={arrow}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
      </button>

      <div className="flex flex-col gap-2 rounded-full bg-white/40 px-1.5 py-2 backdrop-blur">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            onClick={() => go(i + 1)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={active === i + 1}
            className={`h-2.5 w-2.5 rounded-full transition ${
              active === i + 1 ? "scale-125 bg-[#ff4201]" : "bg-neutral-400/70 hover:bg-neutral-600"
            }`}
          />
        ))}
      </div>

      <button onClick={() => go(active + 1)} disabled={active === count} aria-label="Next slide" className={arrow}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
    </nav>
  );
}
