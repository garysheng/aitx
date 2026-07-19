// EXPERIMENT 04 — the built-in filesystem tools (Read/Write) in a sandbox.
// This is the "agent touches the real files" capability (the Admin/brand-OS
// editing story). Give it a voice.md, ask it to read it and write a tagline
// that follows the voice. Verify the file appears with real content.

import { run } from "./_run.ts";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const dir = mkdtempSync(path.join(tmpdir(), "aitx-fs-"));
writeFileSync(
  path.join(dir, "voice.md"),
  "# AITX Voice\nWarm, plain-spoken, no hype, no corporate filler. Refrain: 'You get a better sense of a person in person.' Palette: orange #ff4201.\n",
);

const r = await run(
  "Read voice.md in the current directory. Then write a NEW file called tagline.txt containing exactly one short on-brand AITX tagline that follows that voice. Use your Read and Write tools.",
  { cwd: dir, allowedTools: ["Read", "Write"], permissionMode: "bypassPermissions" },
);

const outPath = path.join(dir, "tagline.txt");
console.log(JSON.stringify({
  toolsUsed: [...new Set(r.toolCalls.map((c) => c.name))],
  taglineFileWritten: existsSync(outPath),
  tagline: existsSync(outPath) ? readFileSync(outPath, "utf8").trim() : null,
  numTurns: r.numTurns, costUsd: r.costUsd,
}, null, 2));
