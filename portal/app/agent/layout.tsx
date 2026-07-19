import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AITX Brand Agent — a Nemotron agent that learns",
  description:
    "Watch an NVIDIA Nemotron agent learn a brand's rules from its own mistakes and stop repeating them, in real time. Built for the AITX x NVIDIA Claw Agent Hackathon.",
  openGraph: {
    title: "AITX Brand Agent — a Nemotron agent that learns",
    description:
      "Watch an NVIDIA Nemotron agent learn a brand's rules from its own mistakes, live.",
    type: "website",
    images: [{ url: "/assets/og-site.png", width: 1200, height: 630, alt: "The AITX Brand OS" }],
  },
  twitter: { card: "summary_large_image", images: ["/assets/og-site.png"] },
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
