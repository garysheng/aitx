import { test } from "node:test";
import assert from "node:assert/strict";
import { flyerSchema, DEFAULT_FLYER, flyerFilename } from "./schema.ts";

test("schema fills sensible defaults", () => {
  const v = flyerSchema.parse({});
  assert.equal(v.kind, "meetup");
  assert.equal(v.eventTitle, "AITX Monthly Meetup");
  assert.deepEqual(v.sponsors, []);
});

test("schema keeps provided values", () => {
  const v = flyerSchema.parse({ kind: "hackathon", eventTitle: "AITX Hackathon", sponsors: ["NVIDIA"] });
  assert.equal(v.kind, "hackathon");
  assert.equal(v.eventTitle, "AITX Hackathon");
  assert.deepEqual(v.sponsors, ["NVIDIA"]);
});

test("flyerFilename slugifies the title and includes the size", () => {
  assert.equal(flyerFilename({ ...DEFAULT_FLYER, eventTitle: "AITX Hackathon!" }, "wide"), "aitx-aitx-hackathon-wide.png");
});
