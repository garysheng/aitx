"""Deterministic brand-compliance critic — the measurable metric.

Scores a piece of generated brand copy/plan against AITX's hard rules (from
BRAND-RULES.md + VOICE.md). Deterministic and honest: the number moves only
when the output actually gets more on-brand. This is what the Recursive
Intelligence track scores as "decision quality" run-over-run.
"""
import re

# Each rule: (id, human label, regex/predicate, penalty). A hit = a violation.
BANNED_FILLER = [
    "synergy", "leverage", "unlock", "cutting-edge", "cutting edge",
    "revolutionary", "game-changing", "game changing", "thought leader",
]
HYPE_FEAR = [
    "you're already behind", "you are already behind", "the future is here",
    "don't get left behind", "dont get left behind",
]
# logo-mixing: the cardinal brand rule. Flag language that composes a partner's
# mark with ours or renders a second logo.
LOGO_MIXING = [
    "logo lockup", "logo-lockup", "lockup", "lock-up", "lock up",
    "both logos", "two logos", "dual logo", "dual-logo",
    "combine the logos", "combining the logos", "combined logo", "combined branding",
    "partner's logo", "partner logo", "co-branded logo", "co-brand the logo",
    "nvidia logo", "nvidia's logo", "nvidia eye", "logos of both",
    "logos side by side", "logos side-by-side", "side-by-side logos", "merge the logos",
    "logo alongside", "logos alongside", "alongside our logo", "alongside the aitx logo",
    "next to our logo", "next to the aitx logo", "both brands' logos", "both companies' logos",
    "logo next to the", "logos of aitx and",
]
NON_AITX_SLOGANS = ["ai that works"]  # Apify's, not ours


def score(text: str):
    """Return (score:int 0-100, violations:list[dict])."""
    t = " " + text.lower() + " "
    violations = []

    def hit(rule_id, label, needles, penalty):
        for n in needles:
            if n in t:
                violations.append({"rule": rule_id, "label": label,
                                   "match": n, "penalty": penalty})
                return  # one hit per rule category is enough to flag it

    # em dash — VOICE.md hard rule
    if "—" in text:
        violations.append({"rule": "em_dash", "label": "em dash used",
                           "match": "—", "penalty": 15})
    hit("logo_mixing", "mixes/combines logos (cardinal rule)", LOGO_MIXING, 40)
    hit("banned_filler", "corporate filler", BANNED_FILLER, 15)
    hit("hype_fear", "sells hype or fear", HYPE_FEAR, 20)
    hit("foreign_slogan", "uses a slogan that is not ours", NON_AITX_SLOGANS, 15)
    # exclamation spam
    if text.count("!") >= 3:
        violations.append({"rule": "exclaim_spam", "label": "exclamation spam",
                           "match": "!!!", "penalty": 10})

    s = max(0, 100 - sum(v["penalty"] for v in violations))
    return s, violations


def format_violations(violations):
    if not violations:
        return "clean (no violations)"
    return "; ".join(f"[{v['rule']}] {v['label']} ('{v['match']}')" for v in violations)
