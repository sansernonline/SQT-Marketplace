# from diagram-figures/assets/mermaid-engine
"""Mermaid stateDiagram-v2 -> states + transitions. [*] becomes a start or an end dot."""
import re

LINE = re.compile(r"^(\S+)\s*-->\s*([^:]+?)\s*(?::\s*(.*))?$")


def parse(src):
    states, edges = [], []

    def add(s):
        if s not in states:
            states.append(s)

    for raw in src.splitlines():
        s = raw.strip()
        if not s or s.startswith("%%") or s.startswith("stateDiagram") or s.startswith("direction"):
            continue
        m = LINE.match(s)
        if not m:
            raise ValueError(f"unknown state line: {s}")
        a, b, label = m.group(1), m.group(2), (m.group(3) or "").strip()
        a = "__start" if a == "[*]" else a
        b = "__end" if b == "[*]" else b
        add(a); add(b)
        edges.append((a, b, label))
    return {"states": states, "edges": edges}
