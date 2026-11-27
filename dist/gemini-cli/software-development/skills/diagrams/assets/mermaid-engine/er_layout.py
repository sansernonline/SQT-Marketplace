# from diagram-figures/assets/mermaid-engine
"""ER layout: tables as boxes with field lists, ELK orthogonal relations, 1 / 0..1 / 0..N at each end."""
import theme as T
import svgkit as K
import elk
import graphdraw as G

W, M = T.SHEET_W, T.MARGIN
ROW, HEAD, FS = 24, 34, 12


def _cols(e):
    f = e["fields"]
    name_w = max([K.text_w(x["name"], FS, True) for x in f] + [0])
    type_w = max([K.text_w(x["type"], FS) for x in f] + [0])
    note_w = max([K.text_w(x["note"], 11) for x in f] + [0])
    return name_w, type_w, note_w


def _size(e):
    name_w, type_w, note_w = _cols(e)
    body = 12 + 30 + name_w + 14 + type_w + (14 + note_w if note_w else 0) + 12
    w = max(K.text_w(e["name"], 13, True) + 32, body, 150)
    return round(w), HEAD + (len(e["fields"]) * ROW + 8 if e["fields"] else 0)


def _graph(model):
    nodes = [{"id": e["name"], "width": _size(e)[0], "height": _size(e)[1],
              "layoutOptions": {"elk.nodeSize.constraints": "[PORTS, MINIMUM_SIZE]",
                                "elk.nodeSize.minimum": "(%d, %d)" % _size(e), "elk.spacing.portPort": "44",
                                "elk.portConstraints": "FREE"}}
             for e in model["entities"]]
    edges, ports = [], {n["id"]: [] for n in nodes}
    for i, r in enumerate(model["rels"]):
        if r["a"] == r["b"]:
            labs = [G.label(f'{r["text"]} ({r["ca"]} to {r["cb"]})', 11.5, 170)]
            edges.append({"id": f"e{i}", "sources": [r["a"]], "targets": [r["b"]], "labels": labs,
                          "dashed": r["dashed"]})
            continue
        labs = [G.label(r["text"], 11.5, 170)]
        for card, place in ((r["ca"], "TAIL"), (r["cb"], "HEAD")):
            lb = G.label(card, 11.5, 80, ink=K.ACCENT_INK)
            lb["layoutOptions"] = {"elk.edgeLabels.placement": place}
            labs.append(lb)
        ports[r["a"]].append({"id": f"e{i}_a", "width": 0, "height": 0})
        ports[r["b"]].append({"id": f"e{i}_b", "width": 0, "height": 0})
        edges.append({"id": f"e{i}", "sources": [f"e{i}_a"], "targets": [f"e{i}_b"], "labels": labs,
                      "dashed": r["dashed"], "ends": (r["a"], r["b"])})
    for n in nodes:
        n["ports"] = ports[n["id"]]
    return {"id": "root", "children": nodes, "edges": edges}


def _table(e, x, y, w, h):
    if not e["fields"]:
        return (K.rect(x, y, w, h, fill=K.ACCENT_FILL, stroke=T.ACCENT, sw=1.5, shadow=True) +
                K.text_block(x + w / 2, y + (h - K.lh(13)) / 2, [e["name"]], 13, True, fill=K.ACCENT_INK))
    o = [K.rect(x, y, w, h, shadow=True),
         K.rect(x, y, w, HEAD, fill=K.ACCENT_FILL, stroke=T.ACCENT, sw=1.5),
         K.text_block(x + w / 2, y + (HEAD - K.lh(13)) / 2, [e["name"]], 13, True, fill=K.ACCENT_INK)]
    name_w, type_w, _ = _cols(e)
    for i, f in enumerate(e["fields"]):
        ry = y + HEAD + 4 + i * ROW
        top = ry + (ROW - K.lh(FS)) / 2
        if f["key"]:
            o.append(K.text_block(x + 12, top, [f["key"].replace(" ", "")], 10.5, True,
                                  fill=T.ACCENT if "PK" in f["key"] else T.MUTED, anchor="start"))
        o.append(K.text_block(x + 42, top, [f["name"]], FS, True, anchor="start"))
        o.append(K.text_block(x + 42 + name_w + 14, top, [f["type"]], FS, fill=T.MUTED, anchor="start"))
        if f["note"]:
            o.append(K.text_block(x + 42 + name_w + 14 + type_w + 14, top + 1, [f["note"]], 11,
                                  fill=T.MUTED, anchor="start", italic=True))
    return "".join(o)


def layout(model):
    best = None
    for d in ("RIGHT", "DOWN"):
        g = elk.layout(_graph(model), d, {"elk.layered.spacing.nodeNodeBetweenLayers": "90",
                                          "elk.spacing.nodeNode": "48",
                                          "elk.spacing.portPort": "56"})
        if g["width"] <= W - 2 * M and (best is None or g["height"] < best["height"]):
            best = g
    g = best or elk.layout(_graph(model), "DOWN")
    ox, oy, bottom = G.origin(g)
    ents = {e["name"]: e for e in model["entities"]}
    body, boxes = [], []
    for n in g["children"]:
        x, y = n["x"] + ox, n["y"] + oy
        body.append(_table(ents[n["id"]], x, y, n["width"], n["height"]))
        boxes.append((x, y, x + n["width"], y + n["height"]))
    wires, labs, rects, segs = G.draw_edges(g, ox, oy, lambda e: {"dashed": e["dashed"], "head": None})
    G.verify(rects, boxes, segs)
    h = bottom + 36
    return K.sheet(W, h, wires + "".join(body) + labs), W, h
