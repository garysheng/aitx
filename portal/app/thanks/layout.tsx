import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank a sponsor — an AITX brand OS superpower",
  description:
    "The AITX brand agent writes a warm, on-brand thank-you for a sponsor and sends it as an intimate voice e-card. On-brand deliverables with soul, powered by NVIDIA Nemotron.",
  openGraph: {
    title: "Thank a sponsor — on-brand, with soul",
    description: "The brand agent writes an on-brand thank-you and sends it as a voice e-card.",
    type: "website",
    images: [{ url: "/assets/og-site.png", width: 1200, height: 630, alt: "The AITX Brand OS" }],
  },
  twitter: { card: "summary_large_image", images: ["/assets/og-site.png"] },
};

export default function ThanksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
