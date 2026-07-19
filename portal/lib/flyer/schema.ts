import { z } from "zod";

export const flyerSchema = z.object({
  kind: z.enum(["hackathon", "meetup"]).default("meetup"),
  eventTitle: z.string().min(1).default("AITX Monthly Meetup"),
  subhead: z.string().default("Austin's AI builder community."),
  dateLine: z.string().default("Third Thursday, 6:00 PM"),
  venueLine: z.string().default("Antler, Austin, TX"),
  registerLine: z.string().default("Register on Luma"),
  sponsors: z.array(z.string()).default([]),
});

export type FlyerValues = z.infer<typeof flyerSchema>;

export const FLYER_SIZES = {
  square: { w: 1080, h: 1080, label: "Square 1080" },
  wide: { w: 1200, h: 630, label: "Wide 1200x630" },
} as const;
export type FlyerSizeKey = keyof typeof FLYER_SIZES;

export const DEFAULT_FLYER: FlyerValues = flyerSchema.parse({});

export function flyerFilename(values: FlyerValues, sizeKey: FlyerSizeKey): string {
  const slug = values.eventTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "aitx-flyer";
  return `aitx-${slug}-${sizeKey}.png`;
}
