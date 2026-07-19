import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank a sponsor — an AITX brand OS superpower",
  description:
    "The AITX brand agent writes a warm, on-brand thank-you for a sponsor and sends it as an intimate voice e-card. On-brand deliverables with soul, powered by NVIDIA Nemotron.",
  openGraph: {
    title: "Thank a sponsor — on-brand, with soul",
    description: "The brand agent writes an on-brand thank-you and sends it as a voice e-card.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function ThanksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
