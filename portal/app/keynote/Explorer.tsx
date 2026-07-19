// The AITX Brand OS Explorer, embedded into the keynote so the whole value of a
// brand universe lives on one page: the cast, the goldens library, the rules,
// and the live tools. Everything here was generated from the universe itself.

const OR = "#ff4201";

function Band({ children, bg = "#fbf5ec", id }: { children: React.ReactNode; bg?: string; id?: string }) {
  return (
    <section id={id} className="flex min-h-screen snap-start flex-col justify-center px-6 py-20 sm:px-12" style={{ background: bg }}>
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 font-body text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--orange-deep)]">{children}</div>;
}
function H({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`font-display font-bold leading-[1.02] tracking-tight text-[color:var(--ink)] ${className}`} style={{ textWrap: "balance" as React.CSSProperties["textWrap"] }}>{children}</h2>;
}

const CAST = [
  { name: "Michael", role: "co-founder", img: "/assets/founders/michael.png" },
  { name: "Jake", role: "co-founder", img: "/assets/founders/jake.png" },
  { name: "Chip", role: "brand czar", img: "/assets/keynote/chip-joy.jpg" },
  { name: "Gary", role: "applied AI engineer", img: "/assets/keynote/gary-master.jpg" },
  { name: "Mark Heaps", role: "trusted partner · head of developer community, NVIDIA", img: "/assets/founders/mark.png" },
];

const GOLDENS = [
  "/assets/keynote/book-show-up.jpg", "/assets/keynote/merch-hoodie.jpg", "/assets/keynote/meme-notion.jpg",
  "/assets/keynote/hack-fair-after.jpg", "/assets/keynote/merch-mug.jpg", "/assets/keynote/book-do-all.jpg",
  "/assets/keynote/merch-tote.jpg", "/assets/keynote/merch-powerbank.jpg", "/assets/keynote/merch-beanie.jpg",
];

const TOOLS = [
  { href: "/agent", emoji: "🤖", title: "The learning agent", blurb: "Give Chip a task. Watch him go off-brand, then learn the rule and fix it. Live Nemotron." },
  { href: "/studio/memes", emoji: "😂", title: "Meme Studio", blurb: "Make a meme with Michael, Jake, and Chip. Pick your cast and a template." },
  { href: "/studio/events", emoji: "🎟️", title: "Event Flyer Studio", blurb: "The AITX Luma flyer as a template. Pick a city and sponsors, download on-brand." },
  { href: "/thanks", emoji: "💌", title: "Sponsor thank-yous", blurb: "Chip writes a warm, on-brand thank-you you can record in your own voice." },
];

export default function Explorer() {
  return (
    <>
      {/* intro */}
      <Band id="explore">
        <Eyebrow>Now explore the actual thing</Eyebrow>
        <H className="text-4xl sm:text-6xl">This is the AITX <span style={{ color: OR }}>Brand OS</span>. It is all right here.</H>
        <p className="mt-7 max-w-2xl text-xl text-[color:var(--muted)]">
          Everything below was generated from the universe: the cast, the blessed goldens, the rules,
          and the live tools. You do not have to imagine it. Scroll, and try it yourself.
        </p>
      </Band>

      {/* cast */}
      <Band bg="#f2ead9">
        <Eyebrow>The cast · version-controlled characters</Eyebrow>
        <H className="mb-8 text-3xl sm:text-5xl">Recurring characters that always look like themselves.</H>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {CAST.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-2xl border bg-white shadow-sm" style={{ borderColor: "#e0d6c2" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.name} className="aspect-[3/4] w-full object-cover object-top" />
              <div className="px-3 py-2">
                <div className="font-display font-bold">{c.name}</div>
                <div className="text-xs text-[color:var(--muted)]">{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Band>

      {/* provenance chain — real photos -> illustrated character */}
      <Band>
        <Eyebrow>Provenance · identity rides in real photos</Eyebrow>
        <H className="mb-3 text-3xl sm:text-5xl">Every character starts from real reference photos.</H>
        <p className="mb-8 max-w-2xl text-lg text-[color:var(--muted)]">
          A character&apos;s look is locked as image data, not a text description, so the face never drifts.
          Real photos in, one consistent illustrated character out, and every asset after that references it.
          Shared with permission.
        </p>
        <div className="space-y-5">
          {[
            { name: "Michael", photos: ["/assets/provenance/michael-1.jpg", "/assets/provenance/michael-2.jpg"], master: "/assets/founders/michael.png" },
            { name: "Jake", photos: ["/assets/provenance/jake-1.jpg", "/assets/provenance/jake-2.jpg"], master: "/assets/founders/jake.png" },
            { name: "Mark Heaps", photos: ["/assets/provenance/mark-1.jpg", "/assets/provenance/mark-2.jpg"], master: "/assets/founders/mark.png" },
          ].map((c) => (
            <div key={c.name} className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:gap-6" style={{ borderColor: "#e0d6c2" }}>
              <div className="flex gap-2">
                {c.photos.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={p} alt={`${c.name} real photo`} className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20" />
                ))}
              </div>
              <div className="flex flex-col items-center text-[color:var(--muted)]">
                <span className="text-2xl" style={{ color: OR }}>→</span>
                <span className="text-[10px] uppercase tracking-widest">locked</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.master} alt={`${c.name} character`} className="h-20 w-16 rounded-lg object-cover object-top sm:h-24 sm:w-20" />
              <div className="hidden sm:block">
                <div className="font-display font-bold">{c.name}</div>
                <div className="text-xs text-[color:var(--muted)]">real photos → one on-brand character</div>
              </div>
            </div>
          ))}
        </div>
      </Band>

      {/* goldens */}
      <Band>
        <Eyebrow>The goldens · the taste you keep</Eyebrow>
        <H className="mb-8 text-3xl sm:text-5xl">Blessed assets. Every new thing rides on these.</H>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GOLDENS.map((g, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={g} alt="AITX golden" className="aspect-square w-full rounded-xl object-cover shadow-sm" />
          ))}
        </div>
        <p className="mt-5 text-sm text-[color:var(--muted)]">Merch, memes, books, flyers. Each one carries a provenance recipe: the model, the prompt, the exact references.</p>
      </Band>

      {/* rules */}
      <Band bg="#141210">
        <div className="mb-6 font-body text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: OR }}>The rules · plain language, version-controlled</div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-[#f4ede0] sm:text-5xl">The brand knows its own rules. So does the agent.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest" style={{ color: OR }}>BRAND-RULES.md</div>
            <ul className="space-y-1.5 text-sm text-[#c9c9c9]">
              <li>· The orange open-arms mark is the logo. Always the real mark.</li>
              <li>· Never mix logos. One asset carries one mark, and it is ours.</li>
              <li>· A golden is human-approved. The agent proposes; a person blesses.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest" style={{ color: OR }}>VOICE.md</div>
            <ul className="space-y-1.5 text-sm text-[#c9c9c9]">
              <li>· Warm and human. Plain-spoken. Confident, not boastful.</li>
              <li>· No hype, no fear, no corporate filler. No em dashes.</li>
              <li>· &ldquo;You get a better sense of a person in person.&rdquo;</li>
            </ul>
          </div>
        </div>
      </Band>

      {/* tools */}
      <Band bg="#f2ead9">
        <Eyebrow>Try it yourself · live tools</Eyebrow>
        <H className="mb-8 text-3xl sm:text-5xl">Everything the agent can do, you can do right now.</H>
        <div className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <a key={t.href} href={t.href} className="group flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1" style={{ borderColor: "#e0d6c2" }}>
              <div className="text-3xl">{t.emoji}</div>
              <div>
                <div className="font-display text-xl font-bold">{t.title} <span style={{ color: OR }}>→</span></div>
                <p className="mt-1 text-sm text-[color:var(--muted)]">{t.blurb}</p>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-8 text-center font-display text-2xl font-bold sm:text-3xl">
          In 2026, every serious company should have one of these.
        </p>
        <p className="mt-2 text-center text-[color:var(--muted)]">Powered by NVIDIA Nemotron. Built entirely from the AITX universe. It has open arms.</p>
      </Band>
    </>
  );
}
