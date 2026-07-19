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
  },
  twitter: { card: "summary_large_image" },
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
