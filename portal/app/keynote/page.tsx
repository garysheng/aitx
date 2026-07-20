import type { Metadata } from "next";
import SlideNav from "./SlideNav";
import Presenter from "./Presenter";
import AutoDemo from "./AutoDemo";
import ChipBubble from "./ChipBubble";
import ChipSubtitles from "./ChipSubtitles";
import Explorer from "./Explorer";
import { SCRIPT } from "./script";
import { MaximizeMeter, AdditiveVsMultiplicative, TryAndBless, RecipeToMany, BrandDNA, FoundersToChip } from "./Diagrams";

// Total slides = total narration beats (1 beat per slide). Deriving it here keeps
// the "N / TOTAL" counter, the nav dots, and the auto-tour in lockstep whenever a
// slide is added or split — no hardcoded count to forget.
const TOTAL = SCRIPT.length;

const OG_IMAGE = "https://aitx-brand-os.vercel.app/assets/keynote/og.png";
export const metadata: Metadata = {
  title: "The Agentic Brand Universe · the AITX Brand OS",
  description:
    "The whole AITX brand as a version-controlled universe its agent generates from. A self-serve tour co-presented by Gary and Chip. Runs on NVIDIA Nemotron, with full provenance on every asset.",
  openGraph: {
    title: "The Agentic Brand Universe · the AITX Brand OS",
    description: "The whole AITX brand as a version-controlled universe its agent generates from. A self-serve tour, co-presented by Gary and Chip.",
    url: "https://aitx-brand-os.vercel.app/keynote",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "The Agentic Brand Universe · the AITX Brand OS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Agentic Brand Universe · the AITX Brand OS",
    description: "The whole AITX brand as a version-controlled universe its agent generates from.",
    images: [OG_IMAGE],
  },
};

const OR = "#ff4201";

/* full-viewport scroll-snap slide */
function Slide({
  children, n, bg = "#fbf5ec",
}: { children: React.ReactNode; n?: number; bg?: string }) {
  return (
    <section
      id={n != null ? `s${n}` : undefined}
      className="relative flex min-h-screen snap-start flex-col justify-center px-5 pb-20 pt-14 sm:px-12 sm:justify-start sm:pb-28 sm:pt-20"
      style={{ background: bg }}
    >
      <div className="mx-auto w-full max-w-5xl">{children}</div>
      {n != null && (
        <div className="pointer-events-none absolute bottom-5 right-5 font-body text-[11px] tracking-widest text-[color:var(--muted)] sm:bottom-6 sm:right-8 sm:text-xs">
          {String(n).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </div>
      )}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 font-body text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--orange-deep)] sm:mb-6">
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
      <SlideNav count={TOTAL} />
      <Presenter />
      <ChipBubble />
      <ChipSubtitles />


      {/* 1 — WHAT THIS IS (Gary opens) */}
      <Slide n={1}>
        <div className="grid items-center gap-8 sm:grid-cols-[1.35fr_1fr] sm:gap-10">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo/aitx-wordmark.png" alt="aitx" className="h-7 w-auto sm:h-8" style={{ mixBlendMode: "multiply" }} />
            <div className="mt-6 sm:mt-10">
              <Eyebrow>AITX Brand OS · built at the NVIDIA Claw Agent Hackathon</Eyebrow>
            </div>
            <H className="text-4xl sm:text-7xl">
              The whole AITX brand, as a <span style={{ color: OR }}>universe its agent generates from</span>.
            </H>
            <p className="mt-5 max-w-xl text-lg text-[color:var(--muted)] sm:mt-7 sm:text-xl">
              Its canon, characters, voice, rules, and best assets, version-controlled in one place.
              Plus Chip, an agent that makes anything on brand from it in minutes, every asset
              reproducible. Everything on this page was made from that universe.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 font-body text-sm font-semibold sm:mt-8">
              <a href="#s2" className="rounded-lg px-5 py-2.5 text-white" style={{ background: OR }}>See how it works ↓</a>
              <a href="/agent" className="rounded-lg border px-5 py-2.5" style={{ borderColor: "var(--muted)", color: "var(--ink)" }}>Watch the agent learn, live →</a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/gary-hackathon.jpg" alt="A real photo rendered into the AITX universe"
              className="max-h-[34vh] w-full rounded-2xl object-cover shadow-md sm:max-h-none" />
            <span className="text-center font-body text-xs uppercase tracking-widest text-[color:var(--muted)]">
              a real photo, rendered by the same system that made everything here
            </span>
          </div>
        </div>
      </Slide>

      {/* 2 — WHO (Gary) */}
      <Slide n={2}>
        <div className="grid items-center gap-8 sm:grid-cols-[1.25fr_1fr] sm:gap-10">
          <div>
            <Eyebrow>Who's talking</Eyebrow>
            <H className="text-4xl sm:text-6xl">
              I'm Gary. I help businesses get the <span style={{ color: OR }}>most</span> out of generative AI.
            </H>
            <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)] sm:mt-7 sm:text-xl">
              An applied AI engineer. I've done this for businesses and for churches. The tools are the
              same. The question is always the same too: are you actually maximizing them?
            </p>
          </div>
          <MaximizeMeter />
        </div>
      </Slide>

      {/* 3 — THE PATTERN (Gary) */}
      <Slide n={3}>
        <div className="grid items-center gap-8 sm:grid-cols-[1.1fr_1fr] sm:gap-10">
          <div>
            <Eyebrow>The pattern I keep seeing</Eyebrow>
            <H className="text-3xl sm:text-6xl">
              Everyone sees the opportunity in generative AI.<br />
              <span style={{ color: OR }}>Almost no one is maximizing it.</span>
            </H>
            <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)] sm:mt-7 sm:text-xl">
              Most teams use it like a slightly faster intern. One-off prompts, generic output, a logo
              that is almost right. That is slop, and slop is not free: every off-brand asset chips away
              at the brand you spent years building. It should be multiplicative, not additive.
            </p>
          </div>
          <AdditiveVsMultiplicative />
        </div>
      </Slide>

      {/* 4 — THE VILLAIN → HERO (Chip) */}
      <Slide n={4} bg="#f2ead9">
        <Eyebrow>Same event graphic · without a system, then with one</Eyebrow>
        <H className="mb-6 text-2xl sm:mb-8 sm:text-5xl">This is the difference a <span style={{ color: OR }}>brand universe</span> makes.</H>
        <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/hack-fair-before.jpg" alt="An off-brand hackathon graphic"
              className="max-h-[28vh] w-full rounded-2xl border border-[color:var(--muted)]/20 object-cover shadow-sm sm:max-h-none" />
            <p className="mt-2 text-sm text-[color:var(--muted)] sm:mt-3">Raw AI, no system. Garbled text, stock clip-art, a random "512." This is slop.</p>
          </div>
          <div className="hidden text-3xl text-[color:var(--muted)] sm:block">→</div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/hack-fair-after.jpg" alt="The on-brand AITX HACK FAIR flyer"
              className="max-h-[28vh] w-full rounded-2xl object-cover shadow-md sm:max-h-none" />
            <p className="mt-2 text-sm font-medium sm:mt-3" style={{ color: OR }}>Chip, from the AITX universe. On brand, correct, reproducible, sponsors and all.</p>
          </div>
        </div>
      </Slide>

      {/* 5 — THE HERO / after (Chip) */}
      <Slide n={5}>
        <Eyebrow>Exhibit B · the same brand, with a universe</Eyebrow>
        <div className="grid items-center gap-6 sm:grid-cols-2 sm:gap-8">
          <div className="order-2 grid grid-cols-2 gap-3 sm:order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/book-cover.jpg" alt="AITX origin book" className="col-span-2 max-h-[22vh] w-full rounded-xl object-cover sm:max-h-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/merch-hoodie.jpg" alt="AITX hoodie" className="w-full rounded-xl object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/keynote/merch-mug.jpg" alt="AITX mug" className="w-full rounded-xl object-cover" />
          </div>
          <div className="order-1 sm:order-2">
            <H className="text-3xl sm:text-5xl">This is the same tools, with a <span style={{ color: OR }}>brand universe</span> behind them.</H>
            <p className="mt-4 text-base text-[color:var(--muted)] sm:mt-6 sm:text-lg">
              A narrated origin story. A full merch line. Memes in the community's own voice. Every one
              unmistakably AITX, every one made in minutes, every one reproducible. Same models. Different
              system.
            </p>
          </div>
        </div>
      </Slide>

      {/* 6 — THE INSIGHT (Gary) */}
      <Slide n={6} bg="#f2ead9">
        <div className="grid items-center gap-8 sm:grid-cols-[1.2fr_1fr] sm:gap-10">
          <div>
            <Eyebrow>The thing nobody tells you</Eyebrow>
            <H className="text-3xl sm:text-6xl">
              You don't know your brand<br />until you <span style={{ color: OR }}>try things</span>.
            </H>
            <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)] sm:mt-7 sm:text-xl">
              Taste is discovered, not declared. You generate something you were sure would look great, and
              it doesn't. You see one that lands, and now you know why. A brand is not a PDF you write on
              day one. It is a living system.
            </p>
          </div>
          <TryAndBless />
        </div>
      </Slide>

      {/* 7 — THE UNIVERSE, defined (Chip) */}
      <Slide n={7}>
        <div className="grid items-center gap-6 sm:grid-cols-[1.4fr_1fr] sm:gap-8">
          <div>
            <Eyebrow>The new standard</Eyebrow>
            <H className="text-4xl sm:text-6xl">
              The <span style={{ color: OR }}>agentic brand universe</span>.
            </H>
            <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)] sm:mt-7 sm:text-xl">
              A version-controlled home for your brand: its canon, its characters, its rules, and the
              best assets you've ever made. Plus an agent that generates anything you need from it, on
              brand, on demand.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/keynote/chip-joy.jpg" alt="Chip, the AITX brand czar" className="mx-auto max-h-[30vh] w-full max-w-[220px] object-contain sm:max-h-none" />
        </div>
      </Slide>

      {/* 8 — THE UNIVERSE, three parts (Chip) */}
      <Slide n={8}>
        <Eyebrow>Three parts</Eyebrow>
        <H className="mb-6 text-3xl sm:mb-8 sm:text-5xl">What's inside a <span style={{ color: OR }}>universe</span>.</H>
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
          {[
            ["Canon", "The truth of your brand: who, what, the look, the voice.", "/assets/keynote/card-canon.png"],
            ["Goldens", "The A+ assets you've blessed. The taste you keep.", "/assets/keynote/card-goldens.png"],
            ["The agent", "Talks plain language. Makes anything, from the canon and goldens.", "/assets/keynote/card-agent.png"],
          ].map(([h, b, img]) => (
            <div key={h} className="w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[color:var(--muted)]/20 bg-white/60 sm:w-auto sm:shrink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={h} className="aspect-square w-full object-cover" />
              <div className="p-5 sm:p-6">
                <div className="font-display text-lg font-bold sm:text-xl" style={{ color: OR }}>{h}</div>
                <p className="mt-1.5 text-sm text-[color:var(--muted)] sm:mt-2 sm:text-base">{b}</p>
              </div>
            </div>
          ))}
        </div>
      </Slide>

      {/* 9 — GOLDENS (Chip) */}
      <Slide n={9} bg="#f2ead9">
        <Eyebrow>Golden means human-approved</Eyebrow>
        <H className="text-3xl sm:text-5xl">A golden is an asset you <span style={{ color: OR }}>blessed</span>.</H>
        <p className="mt-4 max-w-2xl text-base text-[color:var(--muted)] sm:mt-6 sm:text-lg">
          The agent proposes. A human with taste says "this one enters the canon." From then on, it rides
          as a reference on everything you make next, so the whole brand pulls toward your best work
          instead of drifting toward the average.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2.5 sm:mt-8 sm:grid-cols-6 sm:gap-3">
          {["hoodie", "tee", "mug", "tote", "powerbank", "beanie"].map((m) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={m} src={`/assets/keynote/merch-${m}.jpg`} alt={`AITX ${m}`}
              className="aspect-square w-full rounded-lg object-cover" />
          ))}
        </div>
      </Slide>

      {/* 10 — GOLDEN PROCESS (Chip) */}
      <Slide n={10}>
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr] sm:gap-10">
          <div>
            <Eyebrow>The compounding move</Eyebrow>
            <H className="text-3xl sm:text-6xl">
              A golden isn't a one-off.<br />It's a <span style={{ color: OR }}>process</span>.
            </H>
            <p className="mt-5 max-w-3xl text-lg text-[color:var(--muted)] sm:mt-7 sm:text-xl">
              Get one hackathon graphic truly right, and you don't just have a golden image. You have a
              golden recipe. Next hackathon, change the variables (date, sponsors, theme) and the on-brand
              asset falls out. Every new golden adds a repeatable capability. That is how it compounds.
            </p>
          </div>
          <RecipeToMany />
        </div>
      </Slide>

      {/* 11 — PROVENANCE (Chip) */}
      <Slide n={11} bg="#141210">
        <div className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.22em] sm:mb-6" style={{ color: OR }}>
          No guessing · full provenance
        </div>
        <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-[#f4ede0] sm:text-5xl">
          Every asset remembers <span style={{ color: OR }}>exactly</span> how it was made.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-[#a99a83] sm:mt-6 sm:text-lg">
          Down to the atom: the model, the prompt, and the precise goldens it referenced, each pinned by
          hash. Any asset can be rebuilt. Its lineage back to your brand DNA is never a mystery.
        </p>
        <div className="mt-6 max-h-[38vh] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-[#c9c9c9] sm:mt-8 sm:p-5 sm:text-[12px]">
          <div><span className="text-[#6b5d4a]">asset</span>   goldens/memes/notion-faq.png</div>
          <div><span className="text-[#6b5d4a]">model</span>   <span style={{ color: OR }}>openai:gpt-image-2</span></div>
          <div><span className="text-[#6b5d4a]">params</span>  size: 1024x1024 · quality: high</div>
          <div className="mt-1 whitespace-pre-wrap"><span className="text-[#6b5d4a]">prompt</span>  A friendly single-panel community meme in a clean illustrated comic style on a warm paper-white background (#fbf5ec). Michael (use the references: a good-natured guy with a mustache and slicked-back dark hair, wearing a black AITX tee with the orange open-arms mark on the chest, warm and welcoming) is smiling and gesturing with one open hand toward a Notion document floating beside him. The Notion page is a clean white doc in the recognizable Notion style, titled &apos;AITX Hackathon FAQ&apos; with a few light gray bullet lines. Above Michael is a rounded speech bubble reading exactly: thanks for the question :) it&apos;s all in the Notion. Warm, wholesome, gently funny community-organizer energy. AITX orange #ff4201 accents.</div>
          <div className="mt-2 text-[#6b5d4a]">references</div>
          <div>  gabr-michael.png       role: character:michael  sha: a85f8be4…</div>
          <div>  gabr-michael-face.png  role: face:michael       sha: fce92d93…</div>
          <div>  aitx-logo.png          role: logo               sha: b9a9e4ce…</div>
        </div>
      </Slide>

      {/* 12 — THE BRAND AGENT / Michael & Jake (Chip) */}
      <Slide n={12}>
        <Eyebrow>Meet the brand czar</Eyebrow>
        <div className="grid items-center gap-6 sm:grid-cols-[1.1fr_1fr] sm:gap-8">
          <div>
            <H className="text-3xl sm:text-5xl">Michael and Jake don't call me anymore. They talk to <span style={{ color: OR }}>Chip</span>.</H>
            <p className="mt-4 text-base text-[color:var(--muted)] sm:mt-6 sm:text-lg">
              Chip is the AITX brand czar: he holds the canon, the goldens, and the rules, and makes
              anything on brand. "Write NVIDIA a thank-you." "Make the meetup flyer." Done, in the AITX
              voice. Michael and Jake stay in charge of taste. Chip does the making.
            </p>
          </div>
          <FoundersToChip />
        </div>
      </Slide>

      {/* 13 — LIVE DEMO: Chip learns, on stage (Chip) */}
      <Slide n={13}>
        <Eyebrow>Live · watch it learn</Eyebrow>
        <H className="mb-5 text-3xl sm:mb-6 sm:text-5xl">
          And it gets sharper every time. <span style={{ color: OR }}>Watch.</span>
        </H>
        <AutoDemo />
      </Slide>

      {/* 14 — A SPONSOR THANK-YOU / soul (Chip) */}
      <Slide n={14} bg="#f2ead9">
        <Eyebrow>On-brand deliverables, with soul</Eyebrow>
        <div className="grid items-center gap-6 sm:grid-cols-2 sm:gap-8">
          <div>
            <H className="text-3xl sm:text-5xl">A thank-you for NVIDIA. And for every sponsor.</H>
            <p className="mt-4 text-base text-[color:var(--muted)] sm:mt-6 sm:text-lg">
              The agent writes it warm and human, never corporate. Michael records it in his own voice
              and it goes out as an intimate card. One click each for Red Hat, HiddenLayer, Featherless,
              Antler, and Supabase. Gratitude at the speed of software, without losing the soul.
            </p>
          </div>
          {/* on-brand card, real generated copy */}
          <div className="rounded-2xl bg-[#fbf5ec] p-6 shadow-md sm:p-8" style={{ boxShadow: "0 20px 50px rgba(14,12,11,.12)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo/aitx-mark-transparent.png" alt="AITX" className="h-7 w-auto sm:h-8" />
            <div className="mt-4 font-body text-xs font-semibold uppercase tracking-[0.2em] sm:mt-5" style={{ color: OR }}>To NVIDIA</div>
            <div className="mt-2 font-display text-xl font-bold leading-tight sm:text-2xl">Thanks for powering our creations</div>
            <p className="mt-3 text-sm text-[color:var(--ink)] sm:text-base">
              NVIDIA, thank you for putting real tools in our builders' hands with those Nemotron models
              and GPUs. Seeing our community bring projects to life with them was pure magic. Come build
              the future with us.
            </p>
            <div className="mt-4 font-display font-bold sm:mt-5">The AITX Community</div>
            <div className="text-sm text-[color:var(--muted)]">it has open arms</div>
          </div>
        </div>
      </Slide>

      {/* 15 — THE LIVING STORY, embedded book (Chip) */}
      <Slide n={15}>
        <Eyebrow>Made from the universe · right here on the page</Eyebrow>
        <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_1fr] sm:gap-8">
          <div className="mx-auto w-full max-w-[42vh] overflow-hidden rounded-2xl border shadow-md lg:max-w-none" style={{ borderColor: "#e0d6c2", aspectRatio: "1 / 1", background: "#000" }}>
            <iframe src="https://aitx-origin.vercel.app" title="The AITX origin story" loading="lazy"
              className="h-full w-full" style={{ border: 0 }} />
          </div>
          <div>
            <H className="text-3xl sm:text-5xl">The AITX origin story. <span style={{ color: OR }}>Flip through it.</span></H>
            <p className="mt-4 text-base text-[color:var(--muted)] sm:mt-5 sm:text-lg">
              A whole narrated picture book, generated from the universe, embedded right here on the page.
            </p>
          </div>
        </div>
      </Slide>

      {/* 16 — THE LIVING STORY, the whole library (Chip) */}
      <Slide n={16} bg="#f2ead9">
        <Eyebrow>And it wasn't the only one</Eyebrow>
        <H className="text-3xl sm:text-5xl">The library grows <span style={{ color: OR }}>just by asking</span>.</H>
        <p className="mt-4 max-w-2xl text-base text-[color:var(--muted)] sm:mt-5 sm:text-lg">
          Two more books, each about thirty minutes of agent time once the command fired.
        </p>
        <div className="mt-6 grid gap-3 sm:mt-8 sm:max-w-xl">
          {[
            { href: "https://show-up-book.vercel.app/", img: "/assets/keynote/book-show-up.jpg", title: "Show Up", meta: "Michael · ~30 min" },
            { href: "https://do-all-the-things-book.vercel.app/", img: "/assets/keynote/book-do-all.jpg", title: "Do All The Things", meta: "Mark Heaps, NVIDIA · ~30 min" },
          ].map((b) => (
            <a key={b.href} href={b.href} target="_blank" rel="noreferrer"
              className="group flex items-center gap-4 rounded-xl border bg-[#fffdf9] p-2.5 shadow-sm transition hover:-translate-y-0.5" style={{ borderColor: "#e0d6c2" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.img} alt={b.title} className="h-16 w-28 flex-none rounded-md object-cover" />
              <div className="min-w-0">
                <div className="font-display font-bold leading-tight">{b.title}</div>
                <div className="text-xs text-[color:var(--muted)]">{b.meta}</div>
              </div>
              <span className="ml-auto pr-1 text-lg transition group-hover:translate-x-0.5" style={{ color: OR }}>→</span>
            </a>
          ))}
        </div>
      </Slide>

      {/* 17 — CRISPR / VERSION CONTROL (Chip) */}
      <Slide n={17} bg="#f2ead9">
        <div className="grid items-center gap-8 sm:grid-cols-[1.15fr_1fr] sm:gap-10">
          <div>
            <Eyebrow>Version-control your brand</Eyebrow>
            <H className="text-3xl sm:text-6xl">
              CRISPR + GitHub for your brand <span style={{ color: OR }}>DNA</span>.
            </H>
            <p className="mt-5 max-w-3xl text-lg text-[color:var(--muted)] sm:mt-7 sm:text-xl">
              Edit the DNA and every future asset inherits the change. The system even learns your rules from
              its own mistakes, so it gets sharper the more you use it. Your brand stops drifting and starts
              compounding.
            </p>
            <a href="/agent" className="mt-6 inline-block rounded-xl px-6 py-3 font-body font-semibold text-white sm:mt-8"
              style={{ background: OR }}>
              See the agent learn, live →
            </a>
          </div>
          <BrandDNA />
        </div>
      </Slide>

      {/* 18 — THESIS + OFFER (Gary) */}
      <Slide n={18}>
        <Eyebrow>The takeaway</Eyebrow>
        <H className="text-3xl sm:text-6xl">
          In 2026, every serious company should have an <span style={{ color: OR }}>agentic brand universe</span>.
        </H>
        <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)] sm:mt-7 sm:text-xl">
          High-quality, soulful, on-brand assets should take minutes, not weeks, and they should get
          better every time. That is the standard now.
        </p>
        <div className="mt-8 rounded-3xl border border-[color:var(--muted)]/20 bg-white/60 p-6 sm:mt-10 sm:p-8">
          <div className="font-display text-xl font-bold sm:text-2xl">Everything in this deck was made from your universe.</div>
          <p className="mt-2 text-[color:var(--muted)]">
            This is just the beginning. Thank you, AITX. It has open arms.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 font-body text-sm font-semibold" style={{ color: OR }}>
            <a href="#s20">Explore the Brand OS ↓</a>
            <a href="/platform">The platform →</a>
            <a href="https://aitx-origin.vercel.app" target="_blank" rel="noreferrer">The origin story →</a>
          </div>
        </div>
      </Slide>

      {/* 19 — CHIP vs JOY, the fun kicker (Chip) */}
      <Slide n={19} bg="#f2ead9">
        <Eyebrow>One more thing</Eyebrow>
        <H className="mb-5 max-w-4xl text-3xl sm:mb-6 sm:text-6xl">
          Michael&apos;s not sure he likes me. He kinda thinks <span style={{ color: OR }}>Joy</span> should be the mascot.
        </H>
        <div className="overflow-hidden rounded-2xl border shadow-md" style={{ borderColor: "#e0d6c2" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/keynote/chip-jealous-joy.png" alt="Chip throwing a jealous side-eye at Michael hanging out with Joy" className="max-h-[38vh] w-full object-cover sm:max-h-none" />
        </div>
        <p className="mt-4 max-w-3xl text-base text-[color:var(--muted)] sm:mt-5 sm:text-lg">
          Meet Joy: the AITX open-arms mark, come to life. An animated logo, born right here in the
          universe. I&apos;m Chip, and I do the making. Joy is the heart. Honestly? Look at that face. I get
          it. There&apos;s plenty of room in this universe for the both of us.
        </p>
      </Slide>

      {/* The Brand OS Explorer — the whole value, on one page */}
      <Explorer />
    </main>
  );
}
