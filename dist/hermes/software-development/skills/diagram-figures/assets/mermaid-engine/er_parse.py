# from diagram-figures/assets/mermaid-engine
"""Mermaid erDiagram -> entities with fields + relations with cardinality text."""
import re

REL = re.compile(r'^(\w+)\s*([|}][|o]|[|o][|{])(--|\.\.)([|o][|{]|[|}][|o])\s*(\w+)\s*:\s*"?(.*?)"?$')
CARD = {"||": "1", "|o": "0..1", "o|": "0..1", "}o": "0..N", "o{": "0..N", "}|": "1..N", "|{": "1..N"}
FIELD = re.compile(r'^(\w+)\s+(\w+)(?:\s+((?:PK|FK|UK)(?:\s*,\s*(?:PK|FK|UK))*))?(?:\s+"(.*)")?$')


def parse(src):
    ents, rels, cur = {}, [], None

    def ent(name):
        return ents.setdefault(name, {"name": name, "fields": []})

    for raw in src.splitlines():
        s = raw.strip()
        if not s or s.startswith("%%") or s == "erDiagram":
            continue
        if cur:
            if s == "}":
                cur = None
                continue
            m = FIELD.match(s)
            if not m:
                raise ValueError(f"unknown field line: {s}")
            cur["fields"].append({"type": m.group(1), "name": m.group(2), "key": m.group(3) or "",
                                  "note": m.group(4) or ""})
            continue
        m = re.match(r"^(\w+)\s*\{$", s)
        if m:
            cur = ent(m.group(1))
            continue
        m = REL.match(s)
        if not m:
            raise ValueError(f"unknown ER line: {s}")
        a, ca, line, cb, b, text = m.groups()
        ent(a); ent(b)
        rels.append({"a": a, "b": b, "ca": CARD[ca], "cb": CARD[cb], "text": text, "dashed": line == ".."})
    return {"entities": list(ents.values()), "rels": rels}
