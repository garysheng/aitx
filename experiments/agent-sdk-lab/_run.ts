// Shared helper: run one agent query to completion and collect what happened —
// the tool calls it made, the assistant text, and the final result + cost/turns.
// Every experiment uses this so the message-parsing lives in one place.

import { query, type Options } from "@anthropic-ai/claude-agent-sdk";

export type ToolCall = { name: string; input: unknown };
export type RunResult = {
  finalText: string;
  toolCalls: ToolCall[];
  subtype?: string;
  numTurns?: number;
  costUsd?: number;
  messageTypes: string[];
};

export async function run(
  prompt: string,
  options: Options = {},
  onEvent?: (m: unknown) => void,
): Promise<RunResult> {
  const toolCalls: ToolCall[] = [];
  const texts: string[] = [];
  const messageTypes: string[] = [];
  let subtype: string | undefined;
  let numTurns: number | undefined;
  let costUsd: number | undefined;
  let finalText = "";

  for await (const m of query({ prompt, options })) {
    const msg = m as any;
    messageTypes.push(msg.type);
    onEvent?.(m);
    if (msg.type === "assistant") {
      for (const block of msg.message.content) {
        if (block.type === "text") texts.push(block.text);
        else if (block.type === "tool_use") toolCalls.push({ name: block.name, input: block.input });
      }
    } else if (msg.type === "result") {
      subtype = msg.subtype;
      numTurns = msg.num_turns;
      costUsd = msg.total_cost_usd;
      finalText = msg.result ?? texts.join("\n");
    }
  }
  return { finalText, toolCalls, subtype, numTurns, costUsd, messageTypes };
}
