import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AITX Keynote — Teleprompter",
  robots: { index: false, follow: false },
};

export default function PrompterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
