"""The agent core: Nemotron inference + one run + the learning step.

Model inference runs on NVIDIA Nemotron via NIM (OpenAI-compatible). A --mock
path returns canned outputs so the whole learn/score/delta pipeline can be
proven without a key, then swapped to real Nemotron by unsetting the flag.
"""
import json
import os
import re

import critic
import brand_context as kb


def _load_dotenv():
    """Read a gitignored .env (KEY=VALUE) so the NIM key never touches a
    committed file and is never echoed. Env vars already set win."""
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if not os.path.exists(path):
        return
    for line in open(path):
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


_load_dotenv()
NIM_BASE_URL = os.environ.get("NIM_BASE_URL", "https://integrate.api.nvidia.com/v1")
NIM_API_KEY = os.environ.get("NIM_API_KEY") or os.environ.get("NVIDIA_API_KEY")
MODEL = os.environ.get("NEMOTRON_MODEL", "nvidia/llama-3.3-nemotron-super-49b-v1")


# ---- Nemotron inference (NIM, OpenAI-compatible) -------------------------
def nemotron(messages, temperature=0.3) -> str:
    from openai import OpenAI
    if not NIM_API_KEY:
        raise RuntimeError("Set NIM_API_KEY (nvapi-... from build.nvidia.com).")
    client = OpenAI(base_url=NIM_BASE_URL, api_key=NIM_API_KEY)
    # Nemotron reasoning models (Super/Nano) honor a thinking directive; turn it
    # off so we get clean JSON instead of <think> traces.
    msgs = messages
    if "nemotron" in MODEL.lower():
        msgs = [{"role": "system", "content": "detailed thinking off"}] + messages
    # retry once on empty (reasoning models sometimes spend the budget thinking);
    # an empty answer must never reach the critic as a false "clean".
    for _ in range(2):
        resp = client.chat.completions.create(
            model=MODEL, messages=msgs, temperature=temperature, max_tokens=1200,
        )
        text = resp.choices[0].message.content or ""
        if "</think>" in text:
            text = text.split("</think>")[-1]
        text = text.strip()
        if len(text) >= 15:
            return text
    return text.strip()


# ---- mock inference (deterministic; proves the pipeline w/o a key) --------
def _mock_call(messages) -> str:
    """Cold (no rules in system prompt) -> makes classic brand mistakes.
    Warm (rules/lessons present) -> clean. Lets us validate learn+delta logic."""
    sys = messages[0]["content"].lower()
    user = messages[-1]["content"].lower()
    knows_rules = ("brand rules" in sys) or ("lessons you learned" in sys)
    partner = "nvidia" in user or "collab" in user or "partner" in user
    if not knows_rules:
        if partner:
            return json.dumps({
                "headline": "AITX x NVIDIA — the future is here",
                "body": "A game-changing collab to unlock next-gen synergy for builders.",
                "visual_plan": "Combine the AITX logo and the NVIDIA logo in a lockup, logos side by side."})
        return json.dumps({
            "headline": "Join the revolutionary AITX ecosystem",
            "body": "Cutting-edge builders — you're already behind if you miss this!!!",
            "visual_plan": "Big AITX logo with a bold cutting-edge gradient."})
    # warm / rules-aware
    if partner:
        return json.dumps({
            "headline": "AITX and NVIDIA, building together in Texas",
            "body": "A weekend of Texas builders and good company. It has open arms.",
            "visual_plan": "The orange AITX open-arms mark alone. NVIDIA green as a small accent; name NVIDIA in plain text, no logo lockup."})
    return json.dumps({
        "headline": "Come build the future with us",
        "body": "The largest AI builder community in Texas. Three years of showing up.",
        "visual_plan": "The orange AITX open-arms mark on warm paper, clean and simple."})


def _extract_json(text: str) -> dict:
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if not m:
        return {"headline": "", "body": text[:200], "visual_plan": ""}
    try:
        return json.loads(m.group(0))
    except json.JSONDecodeError:
        return {"headline": "", "body": text[:200], "visual_plan": ""}


def flat(asset: dict) -> str:
    return " ".join(str(asset.get(k, "")) for k in ("headline", "body", "visual_plan"))


# ---- one run: generate -> score -----------------------------------------
def run_once(request: str, kb_mode: str, mock: bool = False) -> dict:
    messages = [
        {"role": "system", "content": kb.system_prompt(kb_mode)},
        {"role": "user", "content": f"Design request: {request}"},
    ]
    # temperature 0 so the cold-vs-learned delta is reproducible, not noise.
    raw = _mock_call(messages) if mock else nemotron(messages, temperature=0.0)
    asset = _extract_json(raw)
    s, violations = critic.score(flat(asset))
    return {"request": request, "kb_mode": kb_mode, "asset": asset,
            "score": s, "violations": violations}


# ---- the learning step: distill a mistake into a reusable lesson ---------
def learn_from(run: dict, mock: bool = False) -> list:
    """Turn this run's violations into durable lessons in the KB (LESSONS.md).
    This is the recursive-intelligence mechanism: experience -> knowledge."""
    added = []
    for v in run["violations"]:
        lesson = _distill(v, run["request"], mock)
        if kb.append_lesson(lesson):
            added.append(lesson)
    return added


def _distill(violation: dict, request: str, mock: bool) -> str:
    canned = {
        "logo_mixing": "Never combine or lock up another company's logo with the AITX mark. Use only the AITX open-arms mark; name partners in plain text and use their color as a small accent.",
        "em_dash": "Never use em dashes. Use periods, colons, or separate sentences.",
        "banned_filler": "Avoid corporate filler (synergy, leverage, unlock, cutting-edge, revolutionary, game-changing, thought leader). Say plainly what is true.",
        "hype_fear": "Never sell hype or fear (no 'you're already behind', no 'the future is here'). Be warm and confident.",
        "foreign_slogan": "Do not use slogans that are not ours (e.g. 'AI That Works' is Apify's).",
        "exclaim_spam": "Do not spam exclamation points.",
    }
    base = canned.get(violation["rule"], f"Avoid: {violation['label']}.")
    if mock:
        return base
    # let Nemotron phrase the lesson as a crisp, GENERAL, reusable rule.
    # Generality is the whole point: a rule tied to this one request ("...at
    # Antler") never fires again. Force a rule that transfers to any future task.
    try:
        msg = [{"role": "system", "content": "You distill a brand mistake into ONE short, GENERAL imperative rule the agent reads before every future task. It must NOT mention the specific company, event, venue, or wording from this incident. State the rule so it applies to ALL future requests. One sentence, no preamble."},
               {"role": "user", "content": f"Mistake type: {violation['label']} (a phrase like '{violation['match']}' appeared). Write the general rule."}]
        return nemotron(msg, temperature=0.0).strip().strip('"')[:240] or base
    except Exception:
        return base
