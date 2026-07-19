import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// When Chip learns a rule, he doesn't silently commit it — he opens a PULL
// REQUEST against the brand OS repo. A human reviews and merges (the golden
// gate). That is how a learned rule becomes part of the version-controlled
// brand, honestly and with a human in the loop.
const OWNER = process.env.AITX_REPO_OWNER || "garysheng";
const REPO = process.env.AITX_REPO_NAME || "aitx";
const BASE = process.env.AITX_REPO_BRANCH || "master";
const FILE = "universe/brand-os/LEARNED-RULES.md";

async function gh(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || `GitHub ${res.status}`);
  return body;
}

export async function POST(req: Request) {
  const code = req.headers.get("x-aitx-code") ?? "";
  if (!process.env.AITX_GENERATE_CODE || code !== process.env.AITX_GENERATE_CODE) {
    return NextResponse.json({ error: "Enter the AITX access code." }, { status: 401 });
  }
  const token = process.env.GITHUB_TOKEN;
  if (!token) return NextResponse.json({ error: "Server has no GitHub token configured yet." }, { status: 503 });

  let body: { rule?: string; request?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request." }, { status: 400 }); }
  const rule = (body.rule || "").trim().replace(/\n+/g, " ").slice(0, 400);
  if (!rule) return NextResponse.json({ error: "No rule to propose." }, { status: 400 });

  try {
    const stamp = Date.now();
    const branch = `chip/learn-${stamp}`;

    // 1. base sha
    const ref = await gh(token, `/repos/${OWNER}/${REPO}/git/ref/heads/${BASE}`);
    const baseSha = ref.object.sha;

    // 2. new branch
    await gh(token, `/repos/${OWNER}/${REPO}/git/refs`, {
      method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
    });

    // 3. current file (if any)
    let existing = "# Learned rules\n\nRules Chip proposed from its own mistakes. Each arrived as a pull request; a human merged it.\n";
    let fileSha: string | undefined;
    try {
      const cur = await gh(token, `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(FILE)}?ref=${BASE}`);
      existing = Buffer.from(cur.content, "base64").toString("utf8");
      fileSha = cur.sha;
    } catch { /* file does not exist yet */ }

    const updated = existing.replace(/\s*$/, "") + `\n- ${rule}\n`;

    // 4. commit to the new branch
    await gh(token, `/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(FILE)}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `chip: learn a brand rule\n\nProposed by the AITX brand agent from a critic finding.`,
        content: Buffer.from(updated, "utf8").toString("base64"),
        branch,
        ...(fileSha ? { sha: fileSha } : {}),
      }),
    });

    // 5. open the PR
    const pr = await gh(token, `/repos/${OWNER}/${REPO}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title: "Chip learned a brand rule",
        head: branch, base: BASE,
        body: `Chip (the AITX brand agent) caught itself breaking the brand and proposes this rule:\n\n> ${rule}\n\nHandling: ${body.request ? `while working on "${body.request}"` : "from a live critic finding"}.\n\nMerge to make every future generation obey it. This is the golden gate: the agent proposes, a human blesses.`,
      }),
    });

    return NextResponse.json({ url: pr.html_url, number: pr.number });
  } catch (e: unknown) {
    console.error("learn-pr failed:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not open the PR." }, { status: 502 });
  }
}
