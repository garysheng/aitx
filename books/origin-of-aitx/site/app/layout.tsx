import type { Metadata } from "next";
import { Fraunces, Alegreya } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const TITLE = "The Origin of the AITX Community";
const DESCRIPTION =
  "How two builders turned ten people in a room into the largest AI builder community in Texas. An illustrated origin story of AITX.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aitx-origin.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "AITX",
    type: "book",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${alegreya.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
