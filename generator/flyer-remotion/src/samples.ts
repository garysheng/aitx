import type { FlyerProps } from "./props";

// The canonical sample flyers, shared by Root.tsx (registers Stills) and
// render-samples.ts (renders + writes recipes). One source of truth.

export type Sample = { id: string; width: number; height: number; props: FlyerProps };

export const SAMPLES: Sample[] = [
  {
    id: "hackathon-square", width: 1080, height: 1080,
    props: { kind: "hackathon", eventTitle: "AITX Hackathon", subhead: "Build the future in a weekend.", dateLine: "Sat & Sun, Nov 8-9", venueLine: "Antler, Austin, TX", registerLine: "Register on Luma", sponsors: ["NVIDIA", "Meta", "Google Cloud"] },
  },
  {
    id: "hackathon-wide", width: 1200, height: 630,
    props: { kind: "hackathon", eventTitle: "AITX Hackathon", subhead: "Build the future in a weekend.", dateLine: "Sat & Sun, Nov 8-9", venueLine: "Antler, Austin, TX", registerLine: "Register on Luma", sponsors: ["NVIDIA", "Meta", "Google Cloud"] },
  },
  {
    id: "meetup-square", width: 1080, height: 1080,
    props: { kind: "meetup", eventTitle: "AITX Monthly Meetup", subhead: "Austin's AI builder community. Builders showing real things.", dateLine: "Third Thursday, 6:00 PM", venueLine: "Antler, Austin, TX", registerLine: "Free, Register on Luma", sponsors: [] },
  },
];
