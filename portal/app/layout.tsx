import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500", "600"] });

const TITLE = "AITX Brand OS";
const DESCRIPTION = "The AITX brand, in one place. Browse and download on-brand assets, and see how they are made.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aitx-brand-os.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE, description: DESCRIPTION, url: "/", siteName: "AITX", type: "website",
    images: [{ url: "/assets/og-site.png", width: 1200, height: 630, alt: "The AITX Brand OS" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/assets/og-site.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-body`}>{children}</body>
    </html>
  );
}
