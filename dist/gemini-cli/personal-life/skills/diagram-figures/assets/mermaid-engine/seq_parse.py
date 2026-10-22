# from diagram-figures/assets/mermaid-engine
"""Mermaid sequenceDiagram -> participants + ordered events."""
import re

ARROW = re.compile(r"^(\w+)\s*(-->>|->>|-->|->|--x|-x|--\)|-\))\s*([+-]?)(\w+)\s*:\s*(.*)$")
FRAMES = ("alt", "opt", "loop", "par", "critical", "break", "rect")


def parse(src):
    parts, events, numbered = [], [], False
    known = {}

    def ensure(pid):
        if pid not in known:
            known[pid] = {"id": pid, "label": pid, "actor": False}
            parts.append(known[pid])

    for raw in src.splitlines():
        s = raw.strip()
        if not s or s.startswith("%%") or s == "sequenceDiagram":
            continue
        if s == "autonumber":
            numbered = True
            continue
        m = re.match(r"^(participant|actor)\s+(\w+)(?:\s+as\s+(.*))?$", s)
        if m:
            ensure(m.group(2))
            known[m.group(2)].update(label=(m.group(3) or m.group(2)).strip(), actor=m.group(1) == "actor")
            continue
        m = ARROW.match(s)
        if m:
            a, op, _, b, text = m.groups()
            ensure(a); ensure(b)
            events.append({"kind": "msg", "a": a, "b": b, "text": text.strip(), "dashed": op.startswith("--"),
                           "head": "cross" if op.endswith("x") else "open" if op.endswith(")") else
                           "arrow" if op.endswith(">>") else None})
            continue
        m = re.match(r"^[Nn]ote\s+(over|left of|right of)\s+([\w\s,]+?)\s*:\s*(.*)$", s)
        if m:
            ids = [x.strip() for x in m.group(2).split(",")]
            events.append({"kind": "note", "pos": m.group(1), "ids": ids, "text": m.group(3)})
            continue
        word = s.split()[0]
        if word in FRAMES:
            events.append({"kind": "open", "type": word, "text": s[len(word):].strip()})
        elif word in ("else", "and"):
            events.append({"kind": "else", "text": s[len(word):].strip()})
        elif s == "end":
            events.append({"kind": "close"})
        elif word in ("activate", "deactivate"):
            continue
        else:
            raise ValueError(f"unknown sequence line: {s}")
    return {"parts": parts, "events": events, "numbered": numbered}
