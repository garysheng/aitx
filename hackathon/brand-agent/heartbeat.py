# /// script
# requires-python = ">=3.10"
# dependencies = ["openai>=1.40"]
# ///
"""The Claw agent loop — proactively autonomous, heartbeat-driven, persistent.

Wakes on an interval, pulls the next pending design request from queue.jsonl,
generates on-brand copy with Nemotron using what it has learned, scores itself,
distills any mistake into a durable lesson, and logs the run. Its memory
(LESSONS.md + runs.jsonl) persists across ticks and restarts, so it gets sharper
the longer it runs. Not prompt-driven: the trigger is time + queue state.

Run:  NIM_API_KEY=nvapi-... uv run heartbeat.py --interval 5
      uv run heartbeat.py --mock --interval 0        (fast, no key)
"""
import argparse
import json
import os
import time

import agent
import brand_context as kb

HERE = os.path.dirname(os.path.abspath(__file__))
QUEUE = os.path.join(HERE, "queue.jsonl")
RUNS = os.path.join(HERE, "runs.jsonl")


def pop_next():
    if not os.path.exists(QUEUE):
        return None
    lines = [l for l in open(QUEUE) if l.strip()]
    if not lines:
        return None
    task = json.loads(lines[0])
    open(QUEUE, "w").writelines(lines[1:])  # consume head; queue persists
    return task


def seed_queue_if_empty():
    if os.path.exists(QUEUE) and any(l.strip() for l in open(QUEUE)):
        return
    with open(os.path.join(HERE, "train_tasks.jsonl")) as f, open(QUEUE, "w") as q:
        q.write(f.read())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--interval", type=float, default=5.0, help="seconds between beats")
    ap.add_argument("--mock", action="store_true")
    ap.add_argument("--max-ticks", type=int, default=0, help="0 = run until queue drains")
    args = ap.parse_args()

    seed_queue_if_empty()
    engine = "MOCK" if args.mock else f"Nemotron ({agent.MODEL})"
    print(f"[heartbeat] AITX brand agent online — inference: {engine}")
    print(f"[heartbeat] memory: {len(kb.read_lessons())} lessons, "
          f"beat every {args.interval}s\n")

    tick = 0
    while True:
        task = pop_next()
        if task is None:
            print("[beat] queue empty; the agent waits for the next request.")
            break
        tick += 1
        run = agent.run_once(task["request"], "learned", mock=args.mock)
        added = agent.learn_from(run, mock=args.mock)
        with open(RUNS, "a") as f:
            f.write(json.dumps({"tick": tick, **run, "learned": added}) + "\n")
        note = f"learned {len(added)} new rule(s)" if added else "no new lessons"
        print(f"[beat {tick:>2}] '{task['request'][:48]}...' "
              f"-> score {run['score']}/100, {note} "
              f"(KB now {len(kb.read_lessons())})")
        if args.max_ticks and tick >= args.max_ticks:
            break
        if args.interval:
            time.sleep(args.interval)

    print(f"\n[heartbeat] idle. persistent memory: {len(kb.read_lessons())} lessons "
          f"in LESSONS.md, run history in runs.jsonl")


if __name__ == "__main__":
    main()
