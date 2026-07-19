import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Universes — the platform behind the AITX agent",
  description:
    "GitHub for brand universes. Create a living, self-enforcing brand once, then fork it, rent it, and generate unlimited on-brand content forever. Powered by NVIDIA Nemotron.",
  openGraph: {
    title: "Brand Universes — a marketplace for living brands",
    description: "Create a brand universe once. Fork it, rent it, generate unlimited on-brand content.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const NV = "#76b900";
const OR = "#ff4201";

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-4xl px-5 ${className}`}>{children}</section>;
}

export default function PlatformPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* hero */}
      <Section className="pt-16 pb-10">
        <a href="/agent" className="text-sm text-neutral-500 hover:text-neutral-300">← Back to the live agent</a>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: `${OR}1f`, color: OR }}>
            Most Commercializable · the business behind the build
          </span>
        </div>
        <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          GitHub for <span style={{ color: OR }}>brand universes</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-neutral-300">
          Build a living brand <span className="text-neutral-50 font-semibold">once</span>: its canon,
          its characters, its look, its rules. Then fork it, rent it, and generate unlimited on-brand
          content from it forever, because the universe enforces itself. The agent we built this
          weekend is the engine. This is the company around it.
        </p>
      </Section>

      {/* problem */}
      <Section className="py-12">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: NV }}>The problem</h2>
        <p className="mt-3 text-2xl font-semibold leading-snug">
          Every brand needs endless on-brand content. Nobody below enterprise can keep it consistent.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Agencies", "Expensive, slow, and they don't scale. A flyer takes a week and a check."],
            ["DIY templates", "Canva and stock templates are static and generic. They don't know your brand, and everyone's looks the same."],
            ["Raw AI", "Powerful, but it drifts off-brand, forgets your rules, and has no memory of what 'on-brand' even means for you."],
          ].map(([h, b]) => (
            <div key={h} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
              <div className="font-semibold text-neutral-100">{h}</div>
              <p className="mt-2 text-sm text-neutral-400">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* what we proved */}
      <Section className="py-12">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: NV }}>What we proved this weekend</h2>
        <p className="mt-3 text-2xl font-semibold leading-snug">
          A brand can be a version-controlled system that enforces itself.
        </p>
        <p className="mt-4 max-w-2xl text-neutral-300">
          Canon, golden assets, and rules, plus a Nemotron agent that <span className="text-neutral-50">learns the
          rules from its own mistakes</span> and generates on-brand assets with full provenance. It is
          live and working right now.
        </p>
        <a href="/agent" className="mt-5 inline-block rounded-xl px-5 py-3 font-semibold text-neutral-950" style={{ background: NV }}>
          See the agent learn, live →
        </a>
      </Section>

      {/* the platform */}
      <Section className="py-12">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: NV }}>The platform</h2>
        <p className="mt-3 text-2xl font-semibold leading-snug">Create → Fork → Rent → Earn.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["Create", "Stand up a brand universe: canon, characters, style, and the rules that keep it coherent. It is a real repo, versioned and legible.", OR],
            ["Fork", "Start from someone else's universe instead of a blank page. Stand on the hard work others already did building a beautiful, coherent world.", NV],
            ["Rent", "License a universe to generate your own on-brand assets: flyers, merch, comics, socials, memes. Forever on-brand, because the universe enforces it.", OR],
            ["Earn", "Creators monetize their universe every time someone forks or rents it. The best worlds compound value as their golden library grows.", NV],
          ].map(([h, b, c]) => (
            <div key={h} className="rounded-2xl border p-5" style={{ borderColor: `${c}55`, background: "#111" }}>
              <div className="text-lg font-bold" style={{ color: c as string }}>{h}</div>
              <p className="mt-2 text-sm text-neutral-300">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* superpowers */}
      <Section className="py-12">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: NV }}>Superpowers</h2>
        <p className="mt-3 text-2xl font-semibold leading-snug">
          One universe, on-brand deliverables in every medium.
        </p>
        <p className="mt-3 max-w-2xl text-neutral-400">
          Not just flyers. A living brand should show up everywhere its people are: written, visual,
          spoken, and sonic. Every one of these runs through the same rules and the same golden library,
          so it is always unmistakably you.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Events & merch", "Flyers, posters, stickers, apparel, product mockups. On-brand, in seconds.", true],
            ["Comics & stories", "A whole illustrated universe: characters, worlds, and picture books that stay coherent across hundreds of frames.", true],
            ["Memes & social", "Shareable, on-voice, on-mark. The community's own material, generated.", true],
            ["Soulful thank-yous", "The agent writes an on-brand thank-you and sends it as an intimate voice e-card (via BlessOut). Thank your sponsors like you mean it.", false],
            ["Branded sound packs", "Custom sound effects (via ElevenLabs) your community runs as their coding notification sounds. Every finished build plays your brand. Pure developer goodwill.", false],
            ["Anything the brand needs", "Decks, one-pagers, email, onboarding kits. If it should be on-brand, the universe makes it on-brand.", false],
          ].map(([h, b, live]) => (
            <div key={h as string} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-100">{h}</span>
                {live && (
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ background: `${NV}22`, color: NV }}>live</span>
                )}
              </div>
              <p className="mt-2 text-sm text-neutral-400">{b}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-neutral-500">
          The thread through all of them: a brand that is delightful and soulful, at a scale a human
          team could never sustain, because the universe carries the taste.
        </p>
      </Section>

      {/* the wedge */}
      <Section className="py-12">
        <div className="rounded-3xl border p-8" style={{ borderColor: `${OR}55`, background: `linear-gradient(160deg, ${OR}12, transparent 60%)` }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: OR }}>The wedge</h2>
          <p className="mt-3 text-3xl font-bold leading-tight">
            A beautiful comic-book universe that tells the truth of Christianity.
          </p>
          <p className="mt-4 max-w-2xl text-lg text-neutral-200">
            What church wouldn't pay to fork or rent it? Kids' comics, sermon-series art, event
            flyers, socials, merch: all coherent, all beautiful, all theologically true, all on-brand,
            with no design team and no agency. One creator builds the world. Thousands of churches
            generate from it.
          </p>
          <p className="mt-4 text-sm text-neutral-400">
            There are 380,000+ churches in the US alone. Then the same pattern repeats for sports teams,
            franchises, creators and IP holders, nonprofits, schools, and every community that has a
            story and needs to show it.
          </p>
        </div>
      </Section>

      {/* superiority */}
      <Section className="py-12">
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: NV }}>Why us</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-400">
                <th className="border-b border-neutral-800 py-3 pr-4 font-medium"></th>
                <th className="border-b border-neutral-800 py-3 pr-4 font-medium">On-brand at scale</th>
                <th className="border-b border-neutral-800 py-3 pr-4 font-medium">Forkable / shareable</th>
                <th className="border-b border-neutral-800 py-3 font-medium">Gets better over time</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Agencies", "yes, slowly", "no", "no"],
                ["Canva / templates", "no", "templates only", "no"],
                ["Raw AI (ChatGPT, etc.)", "no, it drifts", "no", "no"],
                ["Brand Universes", "yes, enforced", "yes, marketplace", "yes, compounds"],
              ].map((row, i) => (
                <tr key={i} className={i === 3 ? "font-semibold" : ""} style={i === 3 ? { color: NV } : {}}>
                  <td className="border-b border-neutral-800 py-3 pr-4">{row[0]}</td>
                  <td className="border-b border-neutral-800 py-3 pr-4">{row[1]}</td>
                  <td className="border-b border-neutral-800 py-3 pr-4">{row[2]}</td>
                  <td className="border-b border-neutral-800 py-3">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 max-w-2xl text-neutral-300">
          The moat is the universes themselves. Every fork and every generation makes a universe richer,
          and more creators means more worlds to rent, means more reasons to create. Network effects on
          top of compounding brand libraries.
        </p>
      </Section>

      {/* model + why now */}
      <Section className="py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: NV }}>Business model</h2>
            <ul className="mt-3 space-y-2 text-neutral-300">
              <li>· Subscription to create and host a universe.</li>
              <li>· Marketplace take-rate on every fork and rental.</li>
              <li>· Usage-based generation on top.</li>
              <li>· Creators earn; the platform takes a cut. Shopify and GitHub economics.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: NV }}>Why now</h2>
            <p className="mt-3 text-neutral-300">
              Open models like NVIDIA Nemotron are finally good enough to generate real brand work. The
              missing piece was never the model. It was the system that keeps output on-brand and lets a
              brand compound and be shared. That is exactly what we built this weekend.
            </p>
          </div>
        </div>
      </Section>

      {/* close */}
      <Section className="py-16">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-8 text-center">
          <p className="text-2xl font-bold sm:text-3xl">
            This weekend we built the engine. The company is the marketplace around it.
          </p>
          <p className="mt-3 text-neutral-400">
            AITX is universe #1. The Christian comic universe is #2. Every brand on earth is the market.
          </p>
          <a href="/agent" className="mt-6 inline-block rounded-xl px-6 py-3 font-semibold text-neutral-950" style={{ background: NV }}>
            See the live agent →
          </a>
        </div>
        <p className="mt-8 text-center text-xs text-neutral-600">
          AITX x NVIDIA Claw Agent Hackathon · powered by NVIDIA Nemotron via NIM
        </p>
      </Section>
    </main>
  );
}
