# /// script
# requires-python = ">=3.10"
# dependencies = ["openai>=1.40"]
# ///
"""THE JUDGED ARTIFACT: measurable recursive-intelligence delta.

  1. Baseline  — run the held-out eval suite BLIND (cold KB): the agent knows
     nothing of AITX's rules and makes brand mistakes.
  2. Learn     — run a training queue; after each run the agent distills its
     critic's findings into LESSONS.md (its own knowledge base grows).
  3. Re-eval   — run the SAME held-out suite again, now reading only the lessons
     it taught ITSELF (learned KB). No model retraining, no human answer key.

Prints the before/after delta and writes RESULTS.md.

Run:  NIM_API_KEY=nvapi-... uv run demo.py           (real Nemotron)
      uv run demo.py --mock                          (prove the pipeline)
"""
import json
import os
import sys

import agent
import brand_context as kb

MOCK = "--mock" in sys.argv
HERE = os.path.dirname(os.path.abspath(__file__))


def load(name):
    with open(os.path.join(HERE, name)) as f:
        return [json.loads(l) for l in f if l.strip()]


def suite(tasks, mode):
    runs = [agent.run_once(t["request"], mode, mock=MOCK) for t in tasks]
    avg = sum(r["score"] for r in runs) / len(runs)
    viol = sum(len(r["violations"]) for r in runs)
    clean = sum(1 for r in runs if not r["violations"])
    return runs, avg, viol, clean


def main():
    # fresh knowledge base — the agent starts knowing nothing it learned
    open(kb.LESSONS_MD, "w").close()

    eval_tasks = load("eval_tasks.jsonl")
    train_tasks = load("train_tasks.jsonl")
    engine = "MOCK" if MOCK else f"Nemotron ({agent.MODEL}) via NIM"
    print(f"\n=== AITX Brand Agent — recursive-intelligence delta [{engine}] ===\n")

    # 1. BLIND baseline
    _, base_avg, base_viol, base_clean = suite(eval_tasks, "cold")
    print(f"1. BASELINE (blind, cold KB): avg score {base_avg:.0f}/100, "
          f"{base_viol} violations, {base_clean}/{len(eval_tasks)} clean")

    # 2. LEARN from a training queue (the heartbeat's work)
    print("\n2. LEARNING from experience (each mistake -> a lesson):")
    trend = []
    for i, t in enumerate(train_tasks, 1):
        run = agent.run_once(t["request"], "learned", mock=MOCK)
        added = agent.learn_from(run, mock=MOCK)
        trend.append(run["score"])
        tag = f"+{len(added)} lesson(s)" if added else "no new lesson"
        print(f"   tick {i:>2}: score {run['score']:>3}/100  ({tag})")
    lessons = kb.read_lessons()
    print(f"   knowledge base grew: 0 -> {len(lessons)} lessons")

    # 3. RE-EVAL the same held-out suite, using only self-learned lessons
    _, learn_avg, learn_viol, learn_clean = suite(eval_tasks, "learned")
    print(f"\n3. AFTER LEARNING (same suite, learned KB): avg score {learn_avg:.0f}/100, "
          f"{learn_viol} violations, {learn_clean}/{len(eval_tasks)} clean")

    d_score = learn_avg - base_avg
    d_viol = base_viol - learn_viol
    print(f"\n=== DELTA: score {base_avg:.0f} -> {learn_avg:.0f} (+{d_score:.0f}), "
          f"violations {base_viol} -> {learn_viol} (-{d_viol}), "
          f"clean {base_clean} -> {learn_clean} of {len(eval_tasks)} ===\n")

    with open(os.path.join(HERE, "RESULTS.md"), "w") as f:
        f.write("# AITX Brand Agent — recursive-intelligence results\n\n")
        f.write(f"Inference engine: {engine}\n\n")
        f.write("| Phase | Avg score /100 | Violations | Clean outputs |\n")
        f.write("|---|---|---|---|\n")
        f.write(f"| Baseline (blind) | {base_avg:.0f} | {base_viol} | {base_clean}/{len(eval_tasks)} |\n")
        f.write(f"| After self-learning | {learn_avg:.0f} | {learn_viol} | {learn_clean}/{len(eval_tasks)} |\n")
        f.write(f"| **Delta** | **+{d_score:.0f}** | **-{d_viol}** | **+{learn_clean - base_clean}** |\n\n")
        f.write(f"Knowledge base grew from 0 to {len(lessons)} self-distilled lessons, "
                f"with no model retraining.\n\n")
        f.write("## Lessons the agent taught itself\n\n")
        for l in lessons:
            f.write(f"- {l}\n")
    print(f"wrote {os.path.join(HERE, 'RESULTS.md')}")


if __name__ == "__main__":
    main()
