import GenerateStudio from "@/components/generate/GenerateStudio";

export const metadata = {
  title: "AITX Studio: Generate",
  description: "Describe an AITX asset and generate it on brand, with a provenance recipe.",
};

export default function CreatePage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-8 flex flex-col gap-2">
        <a href="/" className="text-sm text-[color:var(--orange-deep)] hover:underline">← Brand OS</a>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Generate</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Describe a sticker, meme, product mockup, or social post. It generates on brand, from the AITX atoms, and shows you exactly how it was made.</p>
      </header>
      <GenerateStudio />
    </main>
  );
}
