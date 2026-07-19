import { z } from "zod";

// Typed, validated inputs for an AITX flyer (the validation the AAS repo lacks).
export const flyerSchema = z.object({
  kind: z.enum(["hackathon", "meetup"]).default("meetup"),
  eventTitle: z.string(),
  subhead: z.string().default(""),
  dateLine: z.string(),
  venueLine: z.string().default("Antler, Austin, TX"),
  registerLine: z.string().default("Register on Luma"),
  sponsors: z.array(z.string()).default([]),
});

export type FlyerProps = z.infer<typeof flyerSchema>;
