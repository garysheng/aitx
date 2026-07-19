// AITX brand tokens for the deterministic flyer templates. Rules live in code,
// imported everywhere, never hardcoded per-flyer (the AAS pattern). Bump
// BRAND_VERSION when these change so recipes record which brand made a flyer.

export const BRAND_VERSION = "0.1.0";

export const COLORS = {
  orange: "#ff4201",
  orangeDeep: "#c2340a",
  ink: "#0e0c0b",
  paper: "#fbf5ec",
  white: "#ffffff",
  muted: "#6b5d4a",
};

export const FONTS = {
  // System stack for v1: bold grotesque display + clean body. Reproducible with
  // no network. (A bundled display face is a follow-up.)
  display: '"Helvetica Neue", "Arial Narrow", Helvetica, Arial, sans-serif',
  body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

// The mark lives in public/ and is referenced via staticFile(MARK).
export const MARK = "aitx-mark.png";
