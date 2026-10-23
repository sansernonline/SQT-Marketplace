# from diagram-figures/assets/mermaid-engine
"""Turn every Mermaid block in the drafts into an orthogonal PNG figure.

    python build.py [--only fsd-terminal-m3,...] [--svg-dir DIR]

Reads figures.json for paths and for the blocks that already have a hand-made figure."""
import json, os, re, sys
import check
import render

HERE = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(HERE, "figures.json"), encoding="utf-8"))
ROOT = os.path.normpath(os.path.join(HERE, CFG["root"]))


def _engine(kind):
    if kind == "sequenceDiagram":
        import seq_parse as P, seq_layout as L
    elif kind.startswith("stateDiagram"):
        import state_parse as P, state_layout as L
    elif kind == "erDiagram":
        import er_parse as P, er_layout as L
    elif kind == "gantt":
        import gantt_parse as P, gantt_layout as L
    else:
        raise ValueError(kind)
    return P, L


def blocks(path):
    """Yield (index, kind, heading, source) for each ```mermaid block."""
    heading, lines, i, n = "", open(path, encoding="utf-8").read().split("\n"), 0, 0
    while i < len(lines):
        if lines[i].startswith("#"):
            heading = lines[i].lstrip("#").strip()
        if lines[i].strip().startswith("```mermaid"):
            n += 1
            j = i + 1
            while not lines[j].strip().startswith("```"):
                j += 1
            src = "\n".join(lines[i + 1:j])
            kind = next(l.split()[0] for l in src.split("\n") if l.strip() and not l.strip().startswith("%%"))
            yield n, kind, heading, src
            i = j
        i += 1


CAPTION = {
    "sequenceDiagram": "Who sends what, in which order: {h}",
    "stateDiagram-v2": "Which states exist and what moves between them: {h}",
    "erDiagram": "What data is stored and how the records relate: {h}",
    "gantt": "What work is left and when each part happens: {h}",
    "flowchart": "How the parts connect: {h}",
}


def caption(kind, heading):
    h = re.sub(r"^[\d.]+\s*", "", heading)
    h = re.sub(r"^(Sequence|State):\s*", "", h)
    h = re.sub(r"\s*\((\d+ actors|more than \d+ actors)\)", "", h).strip()
    return CAPTION.get(kind, "{h}").format(h=h[0].lower() + h[1:] if h[:2] != h[:2].upper() else h)


def main():
    only = None
    if "--only" in sys.argv:
        only = set(sys.argv[sys.argv.index("--only") + 1].split(","))
    svg_dir = sys.argv[sys.argv.index("--svg-dir") + 1] if "--svg-dir" in sys.argv else None
    drafts = os.path.join(ROOT, CFG["drafts"])
    out_dir = os.path.join(ROOT, CFG["out"])
    skip = set(CFG["skip"])
    jobs, rows, problems = [], [], []
    for fn in sorted(os.listdir(drafts)):
        if not fn.endswith(".md"):
            continue
        base = fn[:-3]
        for n, kind, heading, src in blocks(os.path.join(drafts, fn)):
            key = f"{base}-m{n}"
            if key in skip or (only and key not in only):
                continue
            png = os.path.join(out_dir, f"{CFG['prefix']}-{key}.png")
            try:
                P, L = _engine(kind)
                svg, w, h = L.layout(P.parse(src))
            except Exception as ex:  # report and carry on with the other blocks
                problems.append(f"{key}: {ex}")
                continue
            problems += [f"{key}: {p}" for p in check.orthogonal(svg) + check.WARN]
            check.WARN.clear()
            if svg_dir:
                os.makedirs(svg_dir, exist_ok=True)
                open(os.path.join(svg_dir, key + ".svg"), "w", encoding="utf-8").write(svg)
            jobs.append((svg, w, h, png))
            cap = CFG.get("captions", {}).get(key) or caption(kind, heading)
            rows.append((base, n, kind, os.path.relpath(png, ROOT).replace("\\", "/"), cap))
    render.render_all(jobs)
    if not only:
        with open(os.path.join(ROOT, CFG["map"]), "w", encoding="utf-8") as f:
            f.write("# Generated figures\n\n| Draft | Block | Type | Output PNG | Caption |\n|---|---|---|---|---|\n")
            for r in rows:
                f.write("| %s | m%d | %s | `%s` | %s |\n" % r)
    print(f"rendered {len(jobs)} figures")
    for p in problems:
        print("PROBLEM", p)


if __name__ == "__main__":
    main()
