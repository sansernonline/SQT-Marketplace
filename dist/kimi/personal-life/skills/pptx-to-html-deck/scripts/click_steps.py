"""click_steps.py — ใส่ animation แบบ On Click (Fade) ให้ shape ในสไลด์ ที่สร้างด้วย python-pptx

    from click_steps import add_click_steps
    add_click_steps(slide, [[box1, label1], [box2], [arrow, box3]])   # 3 ขั้น · ขั้นละกี่ชิ้นก็ได้

PowerPoint เล่นเป็นคลิกทีละขั้น และ pptx_to_html.py แปลงเป็นขั้นในหน้า (→ เปิดทีละขั้น)
เรียกซ้ำกับสไลด์เดิม = เขียนทับลำดับเดิม
"""
from __future__ import annotations

from lxml import etree

P = "http://schemas.openxmlformats.org/presentationml/2006/main"


def _el(tag: str, parent=None, **attrs):
    e = etree.SubElement(parent, f"{{{P}}}{tag}") if parent is not None else etree.Element(f"{{{P}}}{tag}")
    for k, v in attrs.items():
        e.set(k, str(v))
    return e


def add_click_steps(slide, steps: list[list]) -> None:
    """steps = รายการขั้น · แต่ละขั้นคือรายการ shape ที่โผล่พร้อมกันเมื่อคลิก"""
    sld = slide._element
    old = sld.find(f"{{{P}}}timing")
    if old is not None:
        sld.remove(old)
    ids = iter(range(1, 10_000))
    timing = _el("timing")
    root = _el("cTn", _el("par", _el("tnLst", timing)), id=next(ids), dur="indefinite", restart="never", nodeType="tmRoot")
    seq = _el("seq", _el("childTnLst", root), concurrent=1, nextAc="seek")
    main = _el("childTnLst", _el("cTn", seq, id=next(ids), dur="indefinite", nodeType="mainSeq"))
    for shapes in steps:
        click = _el("cTn", _el("par", main), id=next(ids), fill="hold")
        _el("cond", _el("stCondLst", click), delay="indefinite")
        inner = _el("cTn", _el("par", _el("childTnLst", click)), id=next(ids), fill="hold")
        _el("cond", _el("stCondLst", inner), delay=0)
        group = _el("childTnLst", inner)
        for n, shape in enumerate(shapes):
            spid = str(shape.shape_id)
            eff = _el("cTn", _el("par", group), id=next(ids), presetID=10, presetClass="entr", presetSubtype=0,
                      fill="hold", nodeType="clickEffect" if n == 0 else "withEffect")
            _el("cond", _el("stCondLst", eff), delay=0)
            kids = _el("childTnLst", eff)
            beh = _el("cBhvr", _el("set", kids))
            _el("cond", _el("stCondLst", _el("cTn", beh, id=next(ids), dur=1, fill="hold")), delay=0)
            _el("spTgt", _el("tgtEl", beh), spid=spid)
            _el("attrName", _el("attrNameLst", beh)).text = "style.visibility"
            _el("strVal", _el("to", beh.getparent()), val="visible")
            fade = _el("cBhvr", _el("animEffect", kids, transition="in", filter="fade"))
            _el("cTn", fade, id=next(ids), dur=500)
            _el("spTgt", _el("tgtEl", fade), spid=spid)
    for evt, tag in (("onPrev", "prevCondLst"), ("onNext", "nextCondLst")):
        _el("sldTgt", _el("tgtEl", _el("cond", _el(tag, seq), evt=evt, delay=0)))
    # ลำดับใน p:sld: cSld · clrMapOvr · transition (อาจห่อใน mc:AlternateContent) · timing · extLst
    ext = sld.find(f"{{{P}}}extLst")
    if ext is not None:
        ext.addprevious(timing)
    else:
        sld.append(timing)
