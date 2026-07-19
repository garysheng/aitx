import type { Metadata } from "next";
import SlideNav from "./SlideNav";

export const metadata: Metadata = {
  title: "The Agentic Brand Universe — a gift to AITX",
  description:
    "Why an agentic brand universe should be the new standard for a company in 2026. Built from real AITX assets, with full provenance. From Gary, with gratitude.",
  openGraph: {
    title: "The Agentic Brand Universe",
    description: "Why every company in 2026 should have a version-controlled, agentic brand universe.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const OR = "#ff4201";

/* full-viewport scroll-snap slide */
function Slide({
  children, n, bg = "#fbf5ec",
}: { children: React.ReactNode; n?: number; bg?: string }) {
  return (
    <section
      id={n != null ? `s${n}` : undefined}
      className="relative flex min-h-screen snap-start flex-col justify-center px-6 py-20 sm:px-12"
      style={{ background: bg }}
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
      {n != null && (
        <div className="pointer-events-none absolute bottom-6 right-8 font-body text-xs tracking-widest text-[color:var(--muted)]">
          {String(n).padStart(2, "0")} / 15
        </div>
      )}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 font-body text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--orange-deep)]">
      {children}
    </div>
  );
}

function H({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-display font-bold leading-[1.02] tracking-tight text-[color:var(--ink)] ${className}`}
      style={{ textWrap: "balance" as React.CSSProperties["textWrap"] }}>
      {children}
    </h2>
  );
}

export default function Keynote() {
  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-scroll font-body text-[color:var(--ink)]">
      <SlideNav count={15} />


      {/* 1 — GRATITUDE / TITLE */}
      <Slide n={1}>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo/aitx-mark-transparent.png" alt="AITX" className="h-10 w-auto" />
          <span className="font-display text-2xl font-semibold">aitx</span>
        </div>
        <Eyebrow>AITX × NVIDIA · Claw Agent Hackathon</Eyebrow>
        <H className="text-5xl sm:text-7xl">
          Thank you for<br />having us.
        </H>
        <p className="mt-7 max-w-2xl text-xl text-[color:var(--muted)]">
          It has been a joy to build alongside this community. What follows is a small gift back: the
          one idea I most want every founder in this room to take home.
        </p>
      </Slide>

      {/* 2 — WHO */}
      <Slide n={2}>
        <Eyebrow>Who's talking</Eyebrow>
        <H className="text-4xl sm:text-6xl">
          I'm Gary. I help companies get the <span style={{ color: OR }}>most</span> out of generative AI.
        </H>
        <p className="mt-7 max-w-2xl text-xl text-[color:var(--muted)]">
          An applied AI engineer. I've done this for businesses and for churches. The tools are the
          same. The question is always the same too: are you actually maximizing them?
        </p>
      </Slide>

      {/* 3 — THE PATTERN */}
      <Slide n={3}>
        <Eyebrow>The pattern I keep seeing</Eyebrow>
        <H className="text-4xl sm:text-6xl">
          Everyone sees the opportunity in generative AI.<br />
          <span style={{ color: OR }}>Almost no one is maximizing it.</span>
        </H>
        <p className="mt-7 max-w-2xl text-xl text-[color:var(--muted)]">
          Most teams use it like a slightly faster intern. One-off prompts. Generic output. The brand
          drifts a little more with every asset. It's additive at best. It should be multiplicative.
        </p>
      </Slide>

      {/* 4 — THE VILLAIN (before) */}
      <Slide n={4} bg="#f2ead9">
        <Eyebrow>Exhibit A · generative AI with no system</Eyebrow>
        <div className="grid items-center gap-8 sm:grid-cols-2">
          <div>
            <H className="text-4xl sm:text-5xl">This is what "not maximizing" looks like.</H>
            <p className="mt-6 text-lg text-[color:var(--muted)]">
              A real hackathon graphic. The mark is fine. Everything else is a stranger: garbled text,
              stock circuit clip-art, a random "512." You can't tell what brand it belongs to. Worse,
              you can't tell how it was made, or make another one like it.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[color:var(--muted)]/20 bg-white shadow-sm">
            {/* Drop the real HACK FAIR image at public/assets/keynote/hack-fair-before.jpg */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/hack-fair-before.jpg" alt="An off-brand hackathon graphic"
              className="h-full w-full object-cover" />
          </div>
        </div>
      </Slide>

      {/* 5 — THE HERO (after) */}
      <Slide n={5}>
        <Eyebrow>Exhibit B · the same brand, with a universe</Eyebrow>
        <div className="grid items-center gap-8 sm:grid-cols-2">
          <div className="order-2 sm:order-1 grid grid-cols-2 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/book-cover.jpg" alt="AITX origin book" className="col-span-2 w-full rounded-xl object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/merch-hoodie.jpg" alt="AITX hoodie" className="w-full rounded-xl object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/merch-mug.jpg" alt="AITX mug" className="w-full rounded-xl object-cover" />
          </div>
          <div className="order-1 sm:order-2">
            <H className="text-4xl sm:text-5xl">This is the same tools, with a <span style={{ color: OR }}>brand universe</span> behind them.</H>
            <p className="mt-6 text-lg text-[color:var(--muted)]">
              A narrated origin story. A full merch line. Memes in the community's own voice. Every one
              unmistakably AITX, every one made in minutes, every one reproducible. Same models. Different
              system.
            </p>
          </div>
        </div>
      </Slide>

      {/* 6 — THE INSIGHT */}
      <Slide n={6} bg="#f2ead9">
        <Eyebrow>The thing nobody tells you</Eyebrow>
        <H className="text-4xl sm:text-6xl">
          You don't know your brand<br />until you <span style={{ color: OR }}>try things</span>.
        </H>
        <p className="mt-7 max-w-2xl text-xl text-[color:var(--muted)]">
          Taste is discovered, not declared. You generate something you were sure would look great, and
          it doesn't. You see one that lands, and now you know why. Your rules, your patterns, your best
          examples emerge over time. A brand is not a PDF you write on day one. It is a living system.
        </p>
      </Slide>

      {/* 7 — THE UNIVERSE */}
      <Slide n={7}>
        <Eyebrow>The new standard</Eyebrow>
        <H className="text-4xl sm:text-6xl">
          The <span style={{ color: OR }}>agentic brand universe</span>.
        </H>
        <p className="mt-7 max-w-3xl text-xl text-[color:var(--muted)]">
          A version-controlled home for your brand: its canon, its characters, its rules, and the best
          assets you've ever made. Plus an agent that can generate anything you need from it, on brand,
          on demand.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["Canon", "The truth of your brand: who, what, the look, the voice."],
            ["Goldens", "The A+ assets you've blessed. The taste you keep."],
            ["The agent", "Talks plain language. Makes anything, from the canon and goldens."],
          ].map(([h, b]) => (
            <div key={h} className="rounded-2xl border border-[color:var(--muted)]/20 bg-white/60 p-6">
              <div className="font-display text-xl font-bold" style={{ color: OR }}>{h}</div>
              <p className="mt-2 text-[color:var(--muted)]">{b}</p>
            </div>
          ))}
        </div>
      </Slide>

      {/* 8 — GOLDENS */}
      <Slide n={8} bg="#f2ead9">
        <Eyebrow>Golden means human-approved</Eyebrow>
        <H className="text-4xl sm:text-5xl">A golden is an asset you <span style={{ color: OR }}>blessed</span>.</H>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--muted)]">
          The agent proposes. A human with taste says "this one enters the canon." From then on, it rides
          as a reference on everything you make next, so the whole brand pulls toward your best work
          instead of drifting toward the average.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {["hoodie", "tee", "mug", "tote", "powerbank", "beanie"].map((m) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={m} src={`/assets/keynote/merch-${m}.jpg`} alt={`AITX ${m}`}
              className="aspect-square w-full rounded-lg object-cover" />
          ))}
        </div>
      </Slide>

      {/* 9 — GOLDEN PROCESS */}
      <Slide n={9}>
        <Eyebrow>The compounding move</Eyebrow>
        <H className="text-4xl sm:text-6xl">
          A golden isn't a one-off.<br />It's a <span style={{ color: OR }}>process</span>.
        </H>
        <p className="mt-7 max-w-3xl text-xl text-[color:var(--muted)]">
          Get one hackathon graphic truly right, and you don't just have a golden image. You have a
          golden recipe for hackathon graphics. AITX runs many hackathons. Next one, you change the
          variables (the date, the sponsors, the theme) and the on-brand asset falls out. Every new
          golden adds a repeatable capability to the brand. That is how it compounds.
        </p>
      </Slide>

      {/* 10 — PROVENANCE */}
      <Slide n={10} bg="#141210">
        <div className="mb-6 font-body text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: OR }}>
          No guessing · full provenance
        </div>
        <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-[#f4ede0] sm:text-5xl">
          Every asset remembers <span style={{ color: OR }}>exactly</span> how it was made.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-[#a99a83]">
          Down to the atom: the model, the prompt, and the precise goldens it referenced, each pinned by
          hash. Any asset can be rebuilt. Its lineage back to your brand DNA is never a mystery.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-[13px] leading-relaxed text-[#c9c9c9]">
          <div><span className="text-[#6b5d4a]">asset</span>   goldens/memes/notion-faq.png</div>
          <div><span className="text-[#6b5d4a]">model</span>   <span style={{ color: OR }}>openai:gpt-image-2</span></div>
          <div><span className="text-[#6b5d4a]">prompt</span>  "A friendly single-panel community meme, Michael…"</div>
          <div className="mt-2 text-[#6b5d4a]">references</div>
          <div>  gabr-michael.png       role: character:michael  sha: a85f8be4…</div>
          <div>  gabr-michael-face.png  role: face:michael       sha: fce92d93…</div>
          <div>  aitx-logo.png          role: logo               sha: b9a9e4ce…</div>
        </div>
      </Slide>

      {/* 11 — THE BRAND AGENT (Michael & Jake) */}
      <Slide n={11}>
        <Eyebrow>Who does the work now</Eyebrow>
        <div className="grid items-center gap-8 sm:grid-cols-[1.1fr_1fr]">
          <div>
            <H className="text-4xl sm:text-5xl">Michael and Jake don't call me anymore. They talk to their <span style={{ color: OR }}>agent</span>.</H>
            <p className="mt-6 text-lg text-[color:var(--muted)]">
              Yesterday we built the AITX brand DNA together. Now, when they need something, they don't
              need a designer or a favor. "Write NVIDIA a thank-you." "Make the meetup flyer." Done, on
              brand, in their voice. The steward stays in charge of taste. The agent does the making.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/keynote/founders.jpg" alt="Michael and Jake, AITX founders"
            className="w-full rounded-2xl object-cover shadow-sm" />
        </div>
      </Slide>

      {/* 12 — A SPONSOR THANK-YOU (soul) */}
      <Slide n={12} bg="#f2ead9">
        <Eyebrow>On-brand deliverables, with soul</Eyebrow>
        <div className="grid items-center gap-8 sm:grid-cols-2">
          <div>
            <H className="text-4xl sm:text-5xl">A thank-you for NVIDIA. And for every sponsor.</H>
            <p className="mt-6 text-lg text-[color:var(--muted)]">
              The agent writes it warm and human, never corporate. Michael records it in his own voice
              and it goes out as an intimate card. One click each for Red Hat, HiddenLayer, Featherless,
              Antler, and Supabase. Gratitude at the speed of software, without losing the soul.
            </p>
          </div>
          {/* on-brand card, real generated copy */}
          <div className="rounded-2xl bg-[#fbf5ec] p-8 shadow-md" style={{ boxShadow: "0 20px 50px rgba(14,12,11,.12)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo/aitx-mark-transparent.png" alt="AITX" className="h-8 w-auto" />
            <div className="mt-5 font-body text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: OR }}>To NVIDIA</div>
            <div className="mt-2 font-display text-2xl font-bold leading-tight">Thanks for powering our creations</div>
            <p className="mt-3 text-[color:var(--ink)]">
              NVIDIA, thank you for putting real tools in our builders' hands with those Nemotron models
              and GPUs. Seeing our community bring projects to life with them was pure magic. Your support
              means the world to us. Come build the future with us.
            </p>
            <div className="mt-5 font-display font-bold">— The AITX Community</div>
            <div className="text-sm text-[color:var(--muted)]">it has open arms</div>
          </div>
        </div>
      </Slide>

      {/* 13 — THE LIVING STORY */}
      <Slide n={13}>
        <Eyebrow>The story keeps moving</Eyebrow>
        <div className="grid items-center gap-8 sm:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/book-1.jpg" alt="Origin story spread" className="col-span-2 w-full rounded-xl object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/book-2.jpg" alt="Origin story spread" className="w-full rounded-xl object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/book-3.jpg" alt="Origin story spread" className="w-full rounded-xl object-cover" />
          </div>
          <div>
            <H className="text-4xl sm:text-5xl">Your brand story is <span style={{ color: OR }}>alive</span>, and you edit it by talking.</H>
            <p className="mt-6 text-lg text-[color:var(--muted)]">
              "Change Michael's shirt in every panel." Done, consistently, everywhere. "Something big
              happened, add two spreads." The story advances. Because the whole book is generated from the
              canon, an edit to the DNA ripples through every asset at once, and every version is tracked.
            </p>
            <a href="https://aitx-origin.vercel.app" target="_blank" rel="noreferrer"
              className="mt-6 inline-block font-body text-sm font-semibold" style={{ color: OR }}>
              Read the living origin story →
            </a>
          </div>
        </div>
      </Slide>

      {/* 14 — CRISPR / VERSION CONTROL + recursive */}
      <Slide n={14} bg="#f2ead9">
        <Eyebrow>Version-control your brand</Eyebrow>
        <H className="text-4xl sm:text-6xl">
          CRISPR for your brand <span style={{ color: OR }}>DNA</span>.
        </H>
        <p className="mt-7 max-w-3xl text-xl text-[color:var(--muted)]">
          Edit the DNA and every future asset inherits the change. The system even learns your rules from
          its own mistakes, so it gets sharper the more you use it. Your brand stops drifting and starts
          compounding, every generation reflecting the latest, best version of you.
        </p>
        <a href="/agent" className="mt-8 inline-block rounded-xl px-6 py-3 font-body font-semibold text-white"
          style={{ background: OR }}>
          See the agent learn, live →
        </a>
      </Slide>

      {/* 15 — THESIS + OFFER */}
      <Slide n={15}>
        <Eyebrow>The takeaway</Eyebrow>
        <H className="text-4xl sm:text-6xl">
          In 2026, every serious company should have an <span style={{ color: OR }}>agentic brand universe</span>.
        </H>
        <p className="mt-7 max-w-2xl text-xl text-[color:var(--muted)]">
          High-quality, soulful, on-brand assets should take minutes, not weeks, and they should get
          better every time. That is the standard now.
        </p>
        <div className="mt-10 rounded-3xl border border-[color:var(--muted)]/20 bg-white/60 p-8">
          <div className="font-display text-2xl font-bold">AITX, I'd love to build yours. Pro bono.</div>
          <p className="mt-2 text-[color:var(--muted)]">
            You'd be the first. Everything in this deck was made from your universe. Thank you for having
            us. It has open arms.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 font-body text-sm font-semibold" style={{ color: OR }}>
            <a href="/agent">The living agent →</a>
            <a href="/platform">The platform →</a>
            <a href="https://aitx-origin.vercel.app" target="_blank" rel="noreferrer">The origin story →</a>
          </div>
        </div>
      </Slide>
    </main>
  );
}
