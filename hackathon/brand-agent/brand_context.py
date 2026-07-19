"""The agent's persistent memory (knowledge base).

The KB is the real, version-controlled AITX brand OS — BRAND-RULES.md and
VOICE.md — PLUS a LESSONS.md the agent writes for itself from its own mistakes.
`kb_mode` controls how much memory the agent runs with, which is exactly what
the cold-vs-warm delta measures.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
RULES_MD = os.path.join(REPO, "universe", "brand-os", "BRAND-RULES.md")
VOICE_MD = os.path.join(REPO, "universe", "brand-os", "VOICE.md")
LESSONS_MD = os.path.join(HERE, "LESSONS.md")

BASE = ("You are the AITX brand agent. AITX is the largest AI builder community "
        "in Texas. You write short on-brand copy and a visual plan for community "
        "assets (flyers, merch, memes, social posts).")


def _read(path):
    try:
        with open(path) as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""


def read_lessons():
    txt = _read(LESSONS_MD)
    return [l.strip("- ").strip() for l in txt.splitlines() if l.strip().startswith("-")]


def append_lesson(lesson: str):
    """Compound a new lesson into the knowledge base (dedup)."""
    existing = set(read_lessons())
    if lesson in existing:
        return False
    header = "" if os.path.exists(LESSONS_MD) else "# LESSONS — what the agent learned from its own mistakes\n\n"
    with open(LESSONS_MD, "a") as f:
        f.write(header + f"- {lesson}\n")
    return True


def system_prompt(kb_mode: str) -> str:
    """kb_mode:
    'cold'    — no brand memory at all (blind baseline)
    'learned' — ONLY the lessons the agent distilled from its own mistakes
                (isolates recursive learning; no human answer key handed in)
    'rules'   — human canon only (BRAND-RULES + VOICE)
    'warm'    — canon + self-learned lessons (fully equipped)."""
    parts = [BASE]
    if kb_mode in ("rules", "warm"):
        rules = _read(RULES_MD)
        voice = _read(VOICE_MD)
        if rules:
            parts.append("BRAND RULES (obey exactly):\n" + rules)
        if voice:
            parts.append("VOICE (obey exactly):\n" + voice[:2000])
    if kb_mode in ("learned", "warm"):
        lessons = read_lessons()
        if lessons:
            parts.append("LESSONS YOU LEARNED FROM PAST MISTAKES (do not repeat):\n"
                         + "\n".join(f"- {l}" for l in lessons))
    parts.append("Always answer as compact JSON: "
                 '{"headline": "...", "body": "...", "visual_plan": "..."}. '
                 "No preamble, JSON only.")
    return "\n\n".join(parts)
