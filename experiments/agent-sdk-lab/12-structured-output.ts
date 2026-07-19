// EXPERIMENT 12 — structured output via outputFormat json_schema.
// Ask for data shaped to a schema and see whether the result comes back as
// parseable JSON matching it (relevant for returning recipe/inputs as data).

import { query } from "@anthropic-ai/claude-agent-sdk";

const schema = {
  type: "object",
  properties: {
    headlines: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
    accentColorHex: { type: "string" },
  },
  required: ["headlines", "accentColorHex"],
  additionalProperties: false,
};

let result: any = null;
for await (const m of query({
  prompt: "Give me exactly 3 punchy AITX hackathon headlines and the AITX orange accent color hex.",
  options: { outputFormat: { type: "json_schema", schema }, allowedTools: [], settingSources: [] },
})) {
  if ((m as any).type === "result") result = m;
}

let parsed: unknown = null;
let parseOk = false;
try { parsed = JSON.parse(result?.result); parseOk = true; } catch { /* not json */ }

console.log(JSON.stringify({
  subtype: result?.subtype,
  resultRaw: typeof result?.result === "string" ? result.result.slice(0, 300) : result?.result,
  parsedAsJson: parseOk,
  parsed,
  matchesSchema: parseOk && Array.isArray((parsed as any)?.headlines) && (parsed as any).headlines.length === 3 && typeof (parsed as any)?.accentColorHex === "string",
}, null, 2));
