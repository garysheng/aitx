// Version-controlled AITX event-flyer templates. Forks the AITX Luma golden:
// mauve gradient sky, faint AI-doodle texture, wide techy title, city name, a
// sponsor row, and the city's skyline silhouette. Every knob here is data, so a
// flyer is fully reproducible from its inputs (title + city + sponsors + kind).

export type EventKind = {
  id: string;
  label: string;
  title: string[];        // the big stacked title lines
  subtitleDefault: string;
};

export const EVENT_KINDS: EventKind[] = [
  { id: "meetup", label: "Monthly Meetup", title: ["AITX", "MONTHLY", "MEETUP"], subtitleDefault: "" },
  { id: "coworking", label: "Co-working", title: ["AITX", "AI", "CO-WORKING"], subtitleDefault: "builders, side by side" },
  { id: "hackathon", label: "Hackathon", title: ["AITX", "HACKATHON"], subtitleDefault: "build the future in a weekend" },
  { id: "hackfair", label: "Hack Fair", title: ["AITX", "HACK FAIR"], subtitleDefault: "a showcase of what we made" },
  { id: "freeform", label: "Free-form event", title: ["AITX", "EVENT"], subtitleDefault: "" },
];

export type City = { id: string; label: string; skyline: string | null };

export const CITIES: City[] = [
  { id: "austin", label: "Austin", skyline: "/assets/flyer/skylines/austin.png" },
  { id: "houston", label: "Houston", skyline: "/assets/flyer/skylines/houston.png" },
  { id: "dallas", label: "Dallas", skyline: "/assets/flyer/skylines/dallas.png" },
  { id: "none", label: "No city", skyline: null },
];

// Preset sponsor logos (already in the repo). Users can also upload their own,
// since different cities run with different sponsors.
export type Sponsor = { id: string; label: string; src: string };

// Transparent, dark-on-nothing versions so the flyer's brightness(0)+invert(1)
// renders every sponsor logo as clean white on the mauve sky (matches the golden).
export const SPONSORS: Sponsor[] = [
  { id: "nvidia", label: "NVIDIA", src: "/assets/flyer/sponsors/nvidia.png" },
  { id: "redhat", label: "Red Hat", src: "/assets/flyer/sponsors/redhat.png" },
  { id: "hiddenlayer", label: "HiddenLayer", src: "/assets/flyer/sponsors/hiddenlayer.png" },
];

export type FlyerValues = {
  kindId: string;
  cityId: string;
  subtitle: string;
  sponsors: { label: string; src: string }[];  // resolved (preset or uploaded)
};
