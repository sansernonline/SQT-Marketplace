"""รูปชุด "SuperUser — วิธีทำงานของทีม agent" แนววงกลมบนลายจุด · 1 plugin = 6 รูป สูงไม่เกิน ~1400 px

python scripts/diagrams/flow/build_flow.py <รากของ repo> <โฟลเดอร์ html>
ได้ superuser-<plugin>-flow-<k>-<slug>.html (plugin core = superuser เอง) แล้ว:
python scripts/diagrams/render.py <โฟลเดอร์ png> <โฟลเดอร์ html>/superuser-*-flow-*.html

เนื้อหา: playbook · เกณฑ์ · agent · งานข้ามสาขา อ่านจากไฟล์จริงของ plugin · คำสั้นอยู่ใน figdata.py ·
ข้อความของแกน (จัดขนาด งบ ใบสั่งงาน ฯลฯ) ตรงกับ plugins/superuser/skills/superuser/SKILL.md หัวข้อ 2 · 5 · 6 · 7
"""
import json, os, re, sys, html

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "kit"))
from figdata import P  # noqa: E402
import kit  # noqa: E402
from kit import e, node, tag, wires, head, legend, page, dot  # noqa: E402
from palette import PLUGINS, badge  # noqa: E402

ROOT, OUT = sys.argv[1:3]

# ---------- ข้อมูลที่ไม่อยู่ใน figdata (software-company อยู่ในแม่แบบเดิม) ----------
SC = dict(
    title="งานซอฟต์แวร์", src_note="โค้ด · test · เอกสารโปรเจกต์",
    inputs=[("ไฟล์ใน prompt/", "ชุดเอกสารโปรเจกต์")],
    loop=["", "", "agent ตามบท + agent สาขา<br>แบ่งงานขนาน<br>สคริปต์แทนมือ", "verify skill · รีวิว ห้ามข้าม<br>security-gate", ""],
    big="ดีไซน์ข้ามระบบ · root cause ยาก · รีวิวหาจุดผิด", mid="โค้ดและเอกสารทั่วไป · feature · bug fix", small="งานกลไก · ค้นไฟล์ · แก้ชื่อหลายจุด",
    d1="แก้ไฟล์ · สร้าง branch · รัน test<br>ร่างเอกสาร · ทุกอย่างใน sandbox",
    d2="ไม่ครบ = ทางที่ย้อนง่ายสุด + <code>(รอยืนยัน)</code>",
    appr=["deploy", "ลบของผู้ใช้", "commit", "push", "merge", "ส่งออกนอก", "ค่าลับจริง", "จ่ายเงิน", "ติดตั้งทั้งเครื่อง"],
    o4=("PR ขึ้น branch หลัก", "playbook ship<br>merge เมื่อคนอนุมัติ<br>(รออนุมัติ)"),
    gloss=[], gate=[("เรียบง่าย", "lazy-coding"), ("โครงแบบวิศวกร", "readable-code"), ("ปลอดภัยตั้งแต่ต้น", "secure-by-default")],
)
CORE_GATE = [("จริง", "มีแหล่ง หรือใส่ (รอยืนยัน)"), ("ตรงเป้า", "ตรงกับ เสร็จเมื่อ"), ("พร้อมใช้", "ใช้ต่อได้ทันที")]
CORE_GLOSS = [("ADAPT.md", "คู่มือต่อยอดแกนเป็น plugin สาขา"), ("plugin สาขา", "มีเฉพาะ playbook · agent · เกณฑ์ · รออนุมัติ แล้วเปิดแกนก่อน"),
              ("hook", "สคริปต์ที่ Claude Code รันเอง: จด log · ส่งกฎประจำตัว · ด่านรีวิว")]
MODULES = [("context", "file-text", "CONTEXT.md · ความคืบหน้า"), ("log", "list-checks", "token ราย agent"),
           ("improvements", "sparkles", "ของใหม่ที่ใช้ซ้ำได้"), ("learning", "repeat", "learning-reviewer ตอนจบ"),
           ("inbox", "message-square", "ข้อความจากคนหรือ bot อื่น"), ("handoff", "package", "ใบสั่งงานข้าม session"),
           ("patterns_advanced", "git-branch", "MoA · Reranker"), ("review_gate", "shield-check", "ไม่มีผู้ตรวจ → ไม่ให้จบ"),
           ("split_gate", "flag", "ชิ้นใหญ่ → ให้แตกงาน")]


def plain(s):
    return re.sub(r"<[^>]+>", "", s.replace("<br>", " · "))


def lines(s):
    return [x for x in s.split("<br>") if x]


def md(s):
    s = html.escape(s, quote=False)
    return re.sub(r"`([^`]+)`", r"<code>\1</code>", re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s))


def read_plugin(name):
    base = os.path.join(ROOT, "plugins", name)
    sk = open(os.path.join(base, "skills/superuser/SKILL.md"), encoding="utf-8").read().replace("\r\n", "\n")
    sec = lambda n: sk[sk.index(f"## {n} ·"): sk.index(f"## {n+1} ·")]
    pbs = re.findall(r"^\| \[`([a-z0-9-]+)`\]\([^)]*\) \|", sec(2), re.M)
    s5 = sec(5)
    cross = [p for p in re.findall(r"`([a-z-]+)[`:]", s5[s5.find("งานข้ามสาขา"):]) if p in PLUGINS and p not in ("superuser", name)] if "งานข้ามสาขา" in s5 else []
    alls = os.listdir(os.path.join(base, "skills"))
    is_cmd = lambda d: "disable-model-invocation: true" in open(os.path.join(base, "skills", d, "SKILL.md"), encoding="utf-8").read().split("\n---", 1)[0]
    gate = [(g, re.sub(r"[`*]", "", w).split(" · ")[0]) for g, w, *_ in re.findall(r"^\| \*\*(.+?)\*\* \| (.+?) \|", sec(4), re.M)]
    return dict(pbs=pbs, cross=list(dict.fromkeys(cross)), gate=gate,
                agents=sorted(f[:-3] for f in os.listdir(os.path.join(base, "agents"))),
                cmds=sorted(d for d in alls if is_cmd(d)))


CORE_PB = [x["name"] for x in json.load(open(os.path.join(ROOT, "scripts/diagrams/data/superuser.json"), encoding="utf-8"))["playbooks"]]


# ---------- ชิ้นส่วนของหน้านี้ (CSS ต่อท้าย kit.css) ----------
EXTRA = """
.brow{display:flex;align-items:center;gap:16px;position:relative;z-index:1}
.brow.rev{flex-direction:row-reverse;text-align:right}
.brow .lb{font-weight:600;font-size:17px;line-height:1.4}
.brow .sb{font-size:15px;line-height:1.5;color:var(--ink3)}
.brow .sb code,.det code{font-size:15px;white-space:nowrap}
.grid{display:grid;position:relative;margin:0 -40px;padding:0 40px}   /* กว้างเกินกรอบ 40px ให้เส้นอ้อมแถวใหม่ไม่ชนตัวหนังสือ */
.g4{grid-template-columns:repeat(4,1fr);column-gap:16px}
.g3{grid-template-columns:repeat(3,1fr);column-gap:16px;row-gap:64px}
.c{display:flex;flex-direction:column;align-items:center;min-width:0}
.c .node .sb,.tn .sb{max-width:216px}
.det{margin-top:16px;text-align:left;font-size:15px;line-height:1.55;color:var(--ink2);width:100%;max-width:204px}
.det p{margin-bottom:8px}.det b{color:var(--ink);font-weight:600}
.det.ctr{text-align:center}
.brow .tags{justify-content:flex-start}
.band .grid{margin-top:32px}
.brow .sb p,.brow p{margin-top:8px}
.band{margin-top:48px;padding-top:24px;border-top:1px solid var(--rule)}
.band .tags{justify-content:flex-start;margin-top:16px}
.band .hd2{display:flex;gap:16px;align-items:center}
.band p.note{font-size:15px;color:var(--ink3);margin-top:12px}
.tag.mute{color:var(--ink3)}
.three{display:grid;grid-template-columns:repeat(3,1fr);column-gap:16px;margin-top:24px}
.three .c{align-items:flex-start;text-align:left}
.three .tier{display:flex;gap:12px;align-items:flex-start}
.three .tier .lb{font-weight:600;font-size:17px}.three .tier .sb{font-size:15px;color:var(--ink3);line-height:1.5}
.g4 .node .dot:not(.lg),.g4 .tn .dot:not(.lg){margin:12px 0}   /* วงโฟกัสใหญ่ 80px · วงอื่นเว้น 12px ให้จุดกึ่งกลางอยู่แนวเดียวกัน เส้นจึงตรง */
.tn{display:flex;flex-direction:column;align-items:center;gap:8px;position:relative;z-index:1}
.tn .tx{min-height:104px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;text-align:center;gap:4px}
.tn .lb{font-weight:600;font-size:17px;line-height:1.4}.tn .sb{font-size:15px;line-height:1.5;color:var(--ink3)}
/* kit ห่อคำไทยด้วย span · ป้ายกับ legend เป็น inline-flex ที่มี gap จึงเว้นทุกคำ → ใช้ inline-block แทน */
.tag{display:inline-block;white-space:normal}.tag i{display:inline-block;margin-right:6px;vertical-align:middle}

.det.lo{margin-top:76px}
.bk{margin-top:40px;font-size:15px;line-height:1.5;color:var(--ink2);text-align:center;white-space:nowrap}
.cols2{display:grid;grid-template-columns:1fr 1fr;column-gap:48px;row-gap:16px;margin-top:16px}
.cols2 p{font-size:15px;line-height:1.55;color:var(--ink2)}.cols2 b{color:var(--ink);font-size:17px;display:block}
"""


def row(label, sub="", role="core", ico=None, id="", num=None, size="", rev=False):
    return (f'<div class="brow{" rev" if rev else ""}">{dot(role, ico, size, id, num)}'
            f'<div><div class="lb">{e(label)}</div>' + (f'<div class="sb">{sub}</div>' if sub else "") + '</div></div>')


def band(title, sub, inner, ico="layers", role="pc"):
    """หัวข้อย่อยเป็นตัวหนังสืออย่างเดียว · ico role คงไว้ให้ที่เรียกเดิมไม่ต้องแก้ (ไอคอนประดับหน้าหัวข้อ = สัญญาณ AI)"""
    return (f'<div class="band"><div class="hd2"><div><div class="sec">{e(title)}</div>'
            + (f'<div class="secsub" style="margin:0">{e(sub)}</div>' if sub else "") + f'</div></div>{inner}</div>')


def tags(xs, role="", mute=False):
    return '<div class="tags">' + "".join(tag(x, role) for x in xs) + "</div>"


def fin(title, body, plug, ctx, n, k):
    """หัวรูป + ตัวรูป · k = เลขรูปในชุด"""
    pl = P[plug if plug != "software-company" else "superuser"]
    t = SC["title"] if plug == "software-company" else P[plug]["title"]
    hd = head(title, f"ภาพที่ {k} จาก {n} · SuperUser · {t}", plug, f"plugins/{plug}/skills/superuser/SKILL.md")
    out = page(f"SuperUser {plug} · {title}", hd + body, plug)
    out = out.replace("</style></head>", EXTRA + "</style></head>")
    return out


# ---------- ชิ้นส่วนบนลงล่าง: การ์ดมีไอคอน · ขั้นในรายการ ----------
def icard(label, sub="", role="pc", ico=None, num=None, id="", extra="", cls=""):
    """การ์ดขาวมีวงไอคอนในตัว · เส้นต่อเข้าขอบการ์ด (id อยู่ที่การ์ด)"""
    at = f' id="{id}"' if id else ""
    return (f'<div class="card icard {cls}"{at}>{dot(role, ico, "", "", num)}'
            f'<div><div class="lb">{e(label)}</div>' + (f'<div class="sb">{sub}</div>' if sub else "") + extra + "</div></div>")


def vstep(label, sub, id, role="pc", ico=None, num=None, dets=(), right=""):
    """1 ขั้นในรายการบนลงล่าง: วง (id) · การ์ดชื่อขั้น คำอธิบาย รายละเอียด · ป้ายด้านขวา (ถ้ามี)"""
    d = "".join(f"<p>{x}</p>" for x in dets if x)
    card = f'<div class="card"><div class="lb">{e(label)}</div><div class="sb">{sub}</div>{d}</div>'
    return f'<div class="vrow{"" if right else " wide"}">{dot(role, ico, "", id, num)}{card}' + (f"<div>{right}</div>" if right else "") + "</div>"


def vlist(steps, pairs):
    return f'<div class="vlist">{wires(pairs)}{"".join(steps)}</div>'


def fan(cards, n=None):
    return f'<div class="fan" style="grid-template-columns:repeat({n or len(cards)},minmax(0,1fr))">{"".join(cards)}</div>'


def short(s, n=2):
    """เอา n รายการแรกของข้อความที่คั่นด้วย · หรือ <br>"""
    parts = [x.strip() for x in re.split(r"<br>| · ", re.sub(r"<(?!br)[^>]+>", "", s)) if x.strip()]
    return " · ".join(parts[:n])


# ---------- รูปที่ 1: งานเข้ามาอย่างไร แล้วใครรับ ----------
def f1(plug, d, r, core):
    in_t, in_s = d["inputs"][0]
    cmd = (f"{len(r['cmds'])} คำสั่ง เช่น /{r['cmds'][0]}") if r["cmds"] else "ทางลัด"
    ins = [("คำสั่งผู้ใช้", 'พิมพ์ "ใช้ superuser"', "user", "user"), ("คำสั่งลัด", cmd, "terminal", "user"), (in_t, in_s, "package", "user"),
           ("CLAUDE.global.md", "กฎประจำเครื่อง", "book-open", "pc"), ("inbox/", "ข้อความจากคนหรือ bot อื่น", "message-square", "pc")]
    top = fan([icard(a, e(b), rl, i, id=f"i{n}", cls="col") for n, (a, b, i, rl) in enumerate(ins)])
    lead_x = "" if core else f'<div class="sb">เปิดแกนก่อน แล้วเรียก <code>/{plug}:superuser</code></div>'
    hub = icard("หัวหน้าทีม", "รับงานทุกทาง · แจกงาน · ประเมิน · ตรวจซ้ำ<br>อ่าน 3 ไฟล์ข้างล่างก่อนเริ่มทุกงาน", "core", "users", id="lead", extra=lead_x, cls="hub")
    reads = [("CONTEXT.md", "ความคืบหน้า · รับงานต่อ"), ("superuser-style.md", "ถ้ามี · ชนะ playbook"), ("config.json", "โมดูลไหนเปิดอยู่")]
    low = fan([icard(a, e(b), "pc", num=n + 1, id=f"r{n}") for n, (a, b) in enumerate(reads)])
    pairs = [(f"i{n}", "lead", "main") for n in range(5)] + [("lead", f"r{n}", "dash") for n in range(3)]
    lead_det = "แจกงาน · ประเมิน · ตรวจซ้ำ" + ("" if core else f" · เรียก <code>/{plug}:superuser</code>")
    chain = vlist([vstep("ผู้ใช้", "เล่างาน · ตัดสินรายการรออนุมัติ", "c1", "user", "user"),
                   vstep("หัวหน้าทีม", f"1 คนต่อโฟลเดอร์งาน · {lead_det}", "c2", "core", "users"),
                   vstep("ลูกทีม (subagent)", "ทำเฉพาะชิ้นตามใบสั่งงาน แล้วรายงานกลับหัวหน้า ไม่คุยกับผู้ใช้", "c3", "agent", "bot")],
                  [("c1", "c2", "main"), ("c2", "c3", "main")])
    xs = r["cross"] or [p for p in PLUGINS if p not in ("superuser", plug)]
    if plug == "software-company":
        xs = [p for p in PLUGINS if p not in ("superuser", plug) and plug in read_plugin(p)["cross"]]
        sub = "plugin เหล่านี้ส่งงานโค้ดมาที่นี่"
    else:
        sub = "ส่งต่อ /<plugin>:superuser ของสาขานั้น"
    cross = '<div class="tags">' + "".join(f'<span class="tag">{badge(c, 12)}{e(c)}</span>' for c in xs) + "</div>"
    body = (f'<div class="layers">{wires(pairs)}{top}{hub}{low}</div>'
            + band("ผู้ใช้ · หัวหน้า · ลูกทีม", "ใครคุยกับใคร", chain, "users", "pc")
            + band("งานข้ามสาขา", sub, cross, "git-branch"))
    return body + legend([("core", "หัวหน้าทีม", "users"), ("agent", "ลูกทีม (subagent)"), ("user", "ผู้ใช้", "user")])


# ---------- รูปที่ 2: เข้าใจงาน จัดขนาด งบ ----------
def f2(plug, d, r, core):
    steps = [vstep("3 บรรทัดก่อนแตะงาน", "หัวหน้าเขียนก่อนเริ่มทุกงาน ไม่เกิน 1 นาที", "s1", num=1,
                   dets=["<b>เป้า</b> ผู้ใช้จะได้อะไร · <b>เสร็จเมื่อ</b> ตรวจด้วยอะไร · <b>เสี่ยง</b> พลาดแล้วย้อนได้ไหม"]),
             vstep("จัดขนาดงาน", "ดูจากจำนวนชิ้นและความชัดของโจทย์ (Planning)", "s2", num=2,
                   dets=["<b>เล็ก</b> หัวหน้าทำเอง · <b>กลาง</b> เลือก playbook · <b>ใหญ่</b> เสนอ 2–3 ทางก่อน · <b>XL</b> team-project"]),
             vstep("เลือกงบ", "ผู้ใช้ไม่บอก ใช้สมดุล", "s3", num=3,
                   dets=["<b>เร็ว</b> ตรวจ 1 รอบ · <b>สมดุล</b> ค่าเริ่ม · <b>คุณภาพ</b> ขยับลูกทีมขึ้น 1 ระดับ"]),
             vstep("คาดไว้ก่อน", "จด 1 บรรทัดก่อนแจกงาน", "s4", num=4,
                   dets=["ลูกทีมกี่ตัว · ตรวจกี่รอบ · ระดับไหน แล้วตอนจบเทียบกับที่เกิดจริง"])]
    grid = vlist(steps, [("s1", "s2", "main"), ("s2", "s3", "main"), ("s3", "s4", "main")])
    tiers = fan([icard(a, f"<b>{e(m)}</b><br>{e(s)}", "pc", ic) for ic, a, m, s in
                 [("sparkles", "ใหญ่", "opus + high", short(d["big"])),
                  ("layers", "กลาง · ค่าเริ่ม", "sonnet + medium", short(d.get("mid", "ร่างเอกสาร · คำนวณตามสูตร"))),
                  ("terminal", "เล็ก", "haiku + low", short(d.get("small", "ค้นไฟล์ · เปลี่ยนชื่อ")))]])
    pbs_all = json.load(open(os.path.join(ROOT, "scripts/diagrams/data", f"{plug}.json"), encoding="utf-8"))["playbooks"]
    own = [x["name"] for x in pbs_all if not x.get("shared")]      # ตรงกับแผนที่: เฉพาะ plugin
    extra = [x["name"] for x in pbs_all if x.get("shared")]        # ของกลางที่ plugin นี้ใช้ร่วม
    pbs = (f'<p class="note" style="margin-top:16px">ของ plugin นี้ · {len(own)} ตัว</p>' + tags(own, "skill")
           + ("" if core or not extra else f'<p class="note">ของกลางที่ใช้ร่วม · {len(extra)} ตัว</p>' + tags(extra)))
    return grid + band("ระดับโมเดล", "พลาด → ขยับ effort ขึ้น 1 ขั้นก่อน", tiers, "sparkles") + band("เลือก playbook", "เลือก 1 ตัว · งานเล็กไม่ใช้ playbook", pbs, "list-checks")


# ---------- รูปที่ 3: ทำ → ตรวจ → แก้ ----------
def f3(plug, d, r, core):
    gate = SC["gate"] if plug == "software-company" else CORE_GATE
    steps = [vstep("ใบสั่งงาน 5 ข้อ", "หัวหน้าเขียนให้ทุกชิ้น ไม่มีใบ ไม่ส่งงาน", "w1", num=1,
                   dets=["<b>เป้า</b> · <b>ขอบเขต</b> · <b>เสร็จเมื่อ</b> · <b>กติกาเดียวกัน</b> · <b>ส่งกลับแบบไหน</b>"]),
             vstep("ลูกทีมทำชิ้นงาน", "ลูกทีมตัวใหม่ทุกงาน ตรวจเองก่อนส่ง", "w2", "agent", num=2,
                   dets=["" if core else short(d["loop"][2], 3), "รายงานบรรทัดแรก: <b>เสร็จ</b> · <b>เสร็จ มีข้อกังวล</b> · <b>ขาดบริบท</b> · <b>ติด</b>"]),
             vstep("ตรวจกับของจริง", "reviewer ตัวใหม่ทุกรอบ ไม่ได้รับความเห็นของหัวหน้า", "w3", "agent", num=3,
                   dets=["ให้คะแนน <b>ผ่าน</b> · <b>แก้</b> · <b>ทำใหม่</b>", "" if core else short(d["loop"][3], 3)]),
             vstep("ผ่านเกณฑ์ 3 ข้อไหม", " · ".join(f"<b>{e(g)}</b> {e(w)}" for g, w in gate), "w4", "pc", "git-branch",
                   dets=["ไม่ผ่าน → แก้ที่ต้นเหตุ แล้วกลับไปขั้น 2 (เส้นประทางซ้าย) · งานกลางไม่เกิน 3 รอบ งานใหญ่ไม่เกิน 5 รอบ"]),
             vstep("ส่งผล", "ผ่านแล้วเท่านั้นจึงถึงมือผู้ใช้", "w5", "pc", "check")]
    pairs = [("w1", "w2", "main"), ("w2", "w3", "main"), ("w3", "w4", "main"), ("w4", "w5", "main"), ("w4", "w2", "back dash")]
    body = f'<div style="padding-left:24px">{vlist(steps, pairs)}</div>'
    body += band(f"ลูกทีมของ plugin นี้ · {len(r['agents'])} agent", "", tags(r["agents"], "agent"), "bot", "agent")
    return body + legend([("pc", "ขั้นของหัวหน้าทีม", "layers"), ("agent", "ลูกทีม", "bot")], note="เส้นประทางซ้าย = ไม่ผ่าน กลับไปแก้")


# ---------- รูปที่ 4: ตัดสินใจ รออนุมัติ ส่งผล ----------
def f4(plug, d, r, core):
    approvals = list(dict.fromkeys(d["appr"] + ["จ่ายเงิน", "ใส่รหัสผ่าน"] if plug != "software-company" else SC["appr"]))
    stop = f'<p style="color:var(--r-gate);font-weight:600">หยุดทันที: {e(d["stop"])}</p>' if d.get("stop") else ""
    hub = icard("ต้องตัดสินใจกลางงาน", "ถามผู้ใช้ครั้งเดียวตอนเริ่ม แล้วเลือกเองตามทางข้างล่าง · จดทุกข้อใต้ ตัดสินใจเอง", "pc", "git-branch", id="q", cls="hub")
    opts = fan([
        icard("ย้อนกลับได้ → ทำเลย", short(d["d1"], 3), "pc", "check", id="b0", cls="col"),
        icard("ไม่รู้ → ค้นเอง", "≥ 3 แหล่งยืนยันตรงกัน · ไม่ครบ → ทางที่ย้อนง่ายสุด + <code>(รอยืนยัน)</code>", "pc", "search", id="b1", cls="col"),
        icard("ย้อนไม่ได้ → รออนุมัติ", "เตรียมให้พร้อมกด แล้วทำส่วนอื่นต่อ", "gate", "hand", id="b2", cls="col",
              extra=f'<div style="margin-top:10px">{tags(approvals, "gate")}</div>{stop}')])
    top = f'<div class="layers">{wires([("q", "b0", "dash"), ("q", "b1", "dash"), ("q", "b2", "main")])}{hub}{opts}</div>'
    o4a, o4b = SC["o4"] if plug == "software-company" else d["o4"]
    outs = fan([icard("คำตอบตอนจบ", "3 ระดับ · คาด → จริง", "pc", "message-square", cls="col"),
                icard("ตารางสถานะ", "เสร็จ · ทำอยู่ · ติด", "pc", "list-checks", cls="col"),
                icard("CONTEXT.md", "ความคืบหน้า · รับงานต่อ", "pc", "file-text", cls="col"),
                icard(o4a, "ผู้ใช้กดเอง", "gate", "hand", cls="col")])
    body = top + band("ส่งผล", "ออกพร้อมกัน · ตัวถัดไปอ่านไฟล์ก็ทำต่อได้", outs, "package", "pc")
    return body + legend([("gate", "รอผู้ใช้อนุมัติ", "hand")])


# ---------- รูปที่ 5: เรียนรู้ ----------
def f5(plug, d, r, core):
    steps = [vstep("ระหว่างงาน", "หัวหน้าจดทันทีที่เจอ", "l1", num=1,
                   dets=["แก้ชิ้นที่ผิดแบบเดียวกันให้หมด · ของใหม่ที่ใช้ซ้ำได้ → <code>IMPROVEMENTS.md</code>"]),
             vstep("เทียบคาดกับจริง", "ตอนจบทุกงาน", "l2", num=2,
                   dets=["ต่างเกิน 2 เท่า → <code>LEAD-PLAYBOOK.md</code> · ลูกทีมถนัดหรือพลาดอะไร → <code>TEAM.md</code>"]),
             vstep("learning-reviewer", "agent ตัวใหม่ทบทวนวิธีทำงานตอนจบงาน", "l3", "agent", "bot",
                   dets=["เสนอปรับทีมไม่เกิน 3 ข้อ · ผู้ใช้เลือก รับ · ไม่รับ · ไว้ทีหลัง"]),
             vstep('"รวมบทเรียน"', "ผู้ใช้สั่งเอง", "l4", "user", "user",
                   dets=["พลาดซ้ำ ≥ 2 ครั้ง → เป็นข้อตรวจก่อนส่ง · แก้ SKILL.md หลังผู้ใช้เห็นด้วย"])]
    grid = vlist(steps, [("l1", "l2", "main"), ("l2", "l3", "main"), ("l3", "l4", "main")])
    log = fan([icard("จดทุกการทำ", "hook จดลง <code>.claude/superuser/log/</code>", "pc", "list-checks"),
               icard("รวมตัวเลข", "<code>SUMMARY.md</code> รวม token ราย agent", "pc", "file-text")])
    body = grid + band("ทุกอย่างถูกบันทึก", "ในเครื่องผู้ใช้เท่านั้น · ตัดค่าลับ", log, "list-checks")
    return body + legend([("agent", "agent", "bot"), ("user", "ผู้ใช้ทำเอง", "user")])


# ---------- รูปที่ 6: โมดูล + ศัพท์ของ plugin ----------
def f6(plug, d, r, core):
    gloss = CORE_GLOSS if core else d["gloss"]
    top = ('<div class="c" style="margin-bottom:8px">' + node("แกนปิดไม่ได้", "pc", "ทุกงานผ่านทุกข้อ", ico="shield-check", size="lg")
           + '<div class="det ctr" style="max-width:620px"><p>จัดขนาด · งบ · ใบสั่งงาน · แจกงาน · ตรวจซ้ำ · คำตอบ 3 ระดับ</p></div></div>')
    mods = "".join(row(k, e(v), "pc", ic, size="sm") for k, ic, v in MODULES)
    mods = (f'<div class="grid g3" style="row-gap:24px;margin-top:24px;align-items:start">{mods}</div>'
            '<p class="note" style="margin-top:24px">เปิดปิดต่อโฟลเดอร์งานใน <code>config.json</code> · ไม่มีไฟล์ = เปิดทุกตัว</p>')
    gl = '<div class="cols2">' + "".join(f"<p><b>{e(a)}</b>{e(b)}</p>" for a, b in gloss) + "</div>" if gloss else ""
    body = top + band("โมดูล 9 ตัว", "ไม่มีก็ทำงานได้ แต่ดีขึ้นเมื่อมี", mods, "layers", "pc")
    if gloss:
        body += band("ศัพท์ของงานนี้", "", gl, "book-open", "pc")
    return body


SERIES = [("intake", "งานเข้ามาทางไหน แล้วใครรับ", f1), ("size", "ก่อนลงมือ หัวหน้าคิดอะไร", f2),
          ("loop", "ทำ ตรวจ แก้ วนอย่างไรจนผ่าน", f3), ("decide", "ใครตัดสินใจ และส่งอะไรให้ผู้ใช้", f4),
          ("learn", "จบงานแล้ว ทีมจำอะไรไว้", f5), ("modules", "อะไรเปิดปิดได้ อะไรปิดไม่ได้", f6)]

os.makedirs(OUT, exist_ok=True)
for plug in ["superuser", "software-company", "e-commerce", "graphic-design", "personal-life", "trading-finance"]:
    core = plug == "superuser"
    d = SC if plug == "software-company" else P[plug]
    r = read_plugin(plug)
    for k, (slug, title, fn) in enumerate(SERIES, 1):
        body = fn(plug, d, r, core)
        out = fin(title, body, plug, None, len(SERIES), k)
        path = os.path.join(OUT, f"superuser-{'core' if core else plug}-flow-{k}-{slug}.html")
        open(path, "w", encoding="utf-8").write(out)
    print(plug)
