import FlyerStudio from "@/components/flyer/FlyerStudio";

export const metadata = {
  title: "AITX Flyer Studio",
  description: "Make an on-brand AITX event flyer in seconds. Fill the form, download the PNG.",
};

export default function FlyerStudioPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-8 flex flex-col gap-2">
        <a href="/" className="text-sm text-[color:var(--orange-deep)] hover:underline">← Brand OS</a>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Flyer Studio</h1>
        <p className="max-w-2xl text-[color:var(--muted)]">Fill in your event and download a crisp, on-brand AITX flyer. It renders from code, so it is always on brand and reproducible.</p>
      </header>
      <FlyerStudio />
    </main>
  );
}
