# from diagram-figures/assets/mermaid-engine
"""State layout: ELK layered with orthogonal routing; start and end are filled dots."""
import re
import theme as T
import svgkit as K
import elk
import graphdraw as G

W, M = T.SHEET_W, T.MARGIN
DOT = 20
KIND = [  # name pattern -> status colour
    (re.compile(r"^(error|failed|loadfailed|blocked)$", re.I), "error"),
    (re.compile(r"^(done|written|connected|unlocked)$", re.I), "ok"),
    (re.compile(r"^(paused|reconnecting|awaiting_confirm|limited|unavailable|offeredaftercrash|notinstalled)$", re.I), "warn"),
]


def _kind(name):
    return next((k for rx, k in KIND if rx.match(name)), None)


def _pretty(name):
    """NoSnapshot -> No snapshot, awaiting_confirm -> awaiting confirm."""
    s = name.replace("_", " ")
    s = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", s)
    return s[0] + s[1:].lower() if " " in s else s


def _graph(model, direction):
    port_side = {"DOWN": ("SOUTH", "NORTH"), "RIGHT": ("EAST", "WEST")}[direction]
    nodes = []
    for s in model["states"]:
        if s in ("__start", "__end"):
            side = port_side[0] if s == "__start" else port_side[1]
            px, py = {"SOUTH": (DOT / 2, DOT), "NORTH": (DOT / 2, 0), "EAST": (DOT, DOT / 2), "WEST": (0, DOT / 2)}[side]
            nodes.append({"id": s, "width": DOT, "height": DOT,
                          "layoutOptions": {"elk.portConstraints": "FIXED_POS"},
                          "ports": [{"id": s + "_p", "x": px, "y": py, "width": 0, "height": 0,
                                     "layoutOptions": {"elk.port.side": side}}]})
        else:
            lines = K.wrap(_pretty(s), 200, T.FS, True)
            w, h = K.block_size(lines, T.FS, True)
            nodes.append({"id": s, "width": round(max(w + 40, 112)), "height": round(h + 22), "lines": lines})
    edges = []
    for i, (a, b, text) in enumerate(model["edges"]):
        e = {"id": f"e{i}", "sources": [a + "_p" if a == "__start" else a],
             "targets": [b + "_p" if b == "__end" else b]}
        if text:
            e["labels"] = [G.label(text)]
        edges.append(e)
    return {"id": "root", "children": nodes, "edges": edges}


def layout(model):
    best = None
    for d in ("RIGHT", "DOWN"):
        g = elk.layout(_graph(model, d), d)
        if g["width"] <= W - 2 * M and (best is None or g["height"] < best["height"]):
            best = g
    if best is None:
        best = elk.layout(_graph(model, "DOWN"), "DOWN")
    g = best
    ox, oy, bottom = G.origin(g)
    body, boxes = [], []
    for n in g["children"]:
        x, y = n["x"] + ox, n["y"] + oy
        if n["id"] == "__start":
            body.append(f'<circle cx="{x + DOT / 2:.1f}" cy="{y + DOT / 2:.1f}" r="{DOT / 2 - 1}" fill="{T.ACCENT}"/>')
            continue
        if n["id"] == "__end":
            body.append(f'<circle cx="{x + DOT / 2:.1f}" cy="{y + DOT / 2:.1f}" r="{DOT / 2 - 1}" fill="{T.PAPER}" '
                        f'stroke="{T.ACCENT}" stroke-width="2"/><circle cx="{x + DOT / 2:.1f}" cy="{y + DOT / 2:.1f}" '
                        f'r="{DOT / 2 - 5}" fill="{T.ACCENT}"/>')
            continue
        kind = _kind(n["id"])
        ink, fill, stroke, sw = T.INK, T.PAPER, T.BORDER, 1
        if kind:
            ink, fill = T.STATUS[kind]
            stroke, sw = K.tint(ink, .55), 1.4
        body.append(K.rect(x, y, n["width"], n["height"], fill=fill, stroke=stroke, sw=sw, shadow=True))
        body.append(K.text_block(x + n["width"] / 2, y + 11, n["lines"], T.FS, True, fill=ink))
        boxes.append((x, y, x + n["width"], y + n["height"]))
    wires, labs, rects, segs = G.draw_edges(g, ox, oy)
    G.verify(rects, boxes, segs)
    h = bottom + 36
    return K.sheet(W, h, wires + "".join(body) + labs), W, h
