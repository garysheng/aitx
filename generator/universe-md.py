#!/usr/bin/env python3
"""
Generate UNIVERSE.md — a human-legible "brand at a glance" rendered straight from
the typed canon. The canon (universe.json + entities + rules + goldens) is the
source of truth; this file is a projection of it. Edit the canon, not UNIVERSE.md.

Run from the repo root:  python3 generator/universe-md.py
Writes: universe/UNIVERSE.md
"""
import json, glob, os, re, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
U = os.path.join(ROOT, "universe")

def load(p):
    with open(p) as f:
        return json.load(f)

def humanize(s):
    if not s:
        return s
    # already a proper display name (has a capital or a space)
    if s != s.lower() or " " in s:
        return s
    words = [("AITX" if w == "aitx" else w.capitalize()) for w in re.split(r"[-_]", s)]
    return " ".join(words)

def descriptor(d):
    st = d.get("structured", {}) or {}
    w = st.get("wardrobe", {})
    if isinstance(w, dict) and w.get("default"):
        return w["default"]
    prose = d.get("prose")
    if isinstance(prose, dict) and prose.get("lore"):
        return prose["lore"]
    if isinstance(prose, str) and prose:
        return prose
    for k in ("summary", "note", "description"):
        if d.get(k):
            return d[k]
    if st.get("promptCraft"):
        return st["promptCraft"]
    return ""

def sheet(d):
    st = d.get("structured", {}) or {}
    sh = st.get("sheets", {})
    if isinstance(sh, dict):
        return sh.get("sheet") or next(iter(sh.values()), None)
    return None

def first_meaningful_line(path):
    if not os.path.exists(path):
        return None
    with open(path) as f:
        for line in f:
            t = line.strip().lstrip("#").strip()
            if t and not t.startswith("<!--"):
                return t
    return None

def trunc(s, n=160):
    s = " ".join(s.split())
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"

def main():
    uni = load(os.path.join(U, "universe.json"))
    ident = uni.get("identity", {})
    spec = uni.get("spec", {})

    ents = [load(p) for p in sorted(glob.glob(os.path.join(U, "canon/entities/*.json")))]
    by_kind = {}
    for e in ents:
        by_kind.setdefault(e.get("kind", "other"), []).append(e)

    goldens = glob.glob(os.path.join(ROOT, "goldens/*/*.recipe.json"))
    rules_dir = os.path.join(U, "brand-os")

    KIND_ORDER = [
        ("group", "The community"),
        ("character", "Cast · recurring characters"),
        ("setting", "Settings"),
        ("motif", "Motifs"),
        ("prop", "Props"),
    ]
    STATUS = {"locked": "🔒 locked", "unlocked": "○ unlocked", "stub": "· stub", "": ""}

    out = []
    out.append("# The AITX Universe, at a glance\n")
    out.append("> Generated from the canon. This is a projection of the version-controlled "
               "brand universe (the cartridge): its identity, cast, settings, motifs, rules, "
               "and blessed goldens. **Edit the canon, not this file** — re-run "
               "`python3 generator/universe-md.py` to regenerate.\n")

    # Identity
    reg = ident.get("register", {})
    out.append("## Identity\n")
    out.append(f"- **Mark line:** {ident.get('mark','—')}")
    out.append("- **Palette:** `#ff4201` (orange) · `#010101` (ink) · `#ffffff` (paper)")
    if reg:
        rej = ", ".join(reg.get("rejectedPoles", []))
        out.append(f"- **Register:** {reg.get('name','—')}" + (f" (never: {rej})" if rej else ""))
    if spec:
        out.append(f"- **Conforms to:** {spec.get('framework','—')} spec "
                   f"{spec.get('version','?')} · {spec.get('wiki','')}")
    out.append(f"- **Real living people:** {ident.get('subjectApproval',{}).get('realLivingPerson','—')}")
    out.append("")

    # Entities by kind
    for kind, heading in KIND_ORDER:
        group = by_kind.get(kind)
        if not group:
            continue
        out.append(f"## {heading}\n")
        for e in sorted(group, key=lambda x: (x.get("kind"), x.get("name", x.get("id")))):
            name = humanize(e.get("name") or e.get("fullName") or e.get("id"))
            st = STATUS.get(e.get("status", ""), e.get("status", ""))
            head = f"### {name}" + (f"  <sub>{st}</sub>" if st else "")
            out.append(head)
            desc = descriptor(e)
            if desc:
                out.append(trunc(desc, 220))
            sh = sheet(e)
            if sh:
                out.append(f"\n`{sh}`")
            out.append("")

    # Rules
    out.append("## Rules the brand knows about itself\n")
    for fn, label in [("BRAND-RULES.md", "Brand rules"),
                      ("VOICE.md", "Voice"),
                      ("LEARNED-RULES.md", "Learned rules (agent, human-merged)")]:
        p = os.path.join(rules_dir, fn)
        if os.path.exists(p):
            line = first_meaningful_line(p) or ""
            out.append(f"- **[{label}](brand-os/{fn})** — {trunc(line, 120)}")
    out.append("")

    # Goldens
    cats = {}
    for g in goldens:
        cat = os.path.basename(os.path.dirname(g))
        cats[cat] = cats.get(cat, 0) + 1
    out.append("## Goldens · the taste you keep\n")
    out.append(f"**{len(goldens)} blessed goldens**, each carrying a provenance recipe "
               "(model, exact prompt, references pinned by hash). "
               "See [`goldens/README.md`](../goldens/README.md).\n")
    if cats:
        out.append("| Category | Count |")
        out.append("|---|---|")
        for c in sorted(cats):
            out.append(f"| {c} | {cats[c]} |")
        out.append("")

    counts = ", ".join(f"{len(v)} {k}" for k, v in sorted(by_kind.items()))
    out.append("---\n")
    out.append(f"*{len(ents)} canon entities ({counts}) · {len(goldens)} goldens · "
               "generated by `generator/universe-md.py` from the typed canon.*\n")

    with open(os.path.join(U, "UNIVERSE.md"), "w") as f:
        f.write("\n".join(out))
    print(f"wrote universe/UNIVERSE.md — {len(ents)} entities, {len(goldens)} goldens")

if __name__ == "__main__":
    main()
