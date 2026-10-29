"""รูปตารางเทียบ (เช่น pstack กับ SuperUser) แนวเดียวกับรูปชุด docs/plugins: การ์ดขาว · หัวตารางเส้นสี plugin · วงเลขหัวข้อ

python scripts/diagrams/compare/build_compare.py <โฟลเดอร์ html>
ได้ <ชื่อ>.html ต่อ 1 ไฟล์ .json ข้างสคริปต์นี้ · ในข้อความ `x` = ป้ายชื่อ skill หรือไฟล์ · **x** = ตัวหนา
"""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "kit"))
from kit import e, dot, head, page  # noqa: E402

CSS = """
.core{display:flex;gap:20px;align-items:baseline;margin-bottom:8px}
.core .pill{flex:none}
.core p{font-size:17px;line-height:1.6;color:var(--ink2)}
.sec{display:flex;gap:16px;align-items:center;margin:48px 0 16px}
.sec h2{font-family:var(--display);font-weight:600;font-size:24px;line-height:1.3}
.tbl{padding:0;overflow:hidden}
.tr{display:grid;column-gap:24px;padding:12px 20px;border-top:1px solid var(--rule);font-size:15px;line-height:1.6;color:var(--ink2)}
.tr:first-child{border-top:0}
.tr.th+.tr{border-top:0}
.tr.th{border-top:0;border-bottom:2px solid var(--pc);color:var(--ink3);font-weight:600;font-size:15px}
.tr .k{font-weight:600;color:var(--ink)}
.tr b{color:var(--ink);font-weight:600}
.chip{display:inline-block;padding:0 8px;border-radius:6px;background:color-mix(in srgb,var(--pc) 10%,#fff);color:color-mix(in srgb,var(--pc) 80%,#000);white-space:nowrap}
"""
COLS = {2: "260px 1fr", 3: "220px 1fr 1fr"}


def md(s):
    s = e(s)
    return re.sub(r"`([^`]+)`", r'<span class="chip">\1</span>', re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s))


def table(sec):
    cols = f'style="grid-template-columns:{COLS[len(sec["cols"])]}"'
    th = f'<div class="tr th" {cols}>' + "".join(f"<div>{e(c)}</div>" for c in sec["cols"]) + "</div>"
    rows = "".join(f'<div class="tr" {cols}><div class="k">{md(r[0])}</div>' + "".join(f"<div>{md(c)}</div>" for c in r[1:]) + "</div>"
                   for r in sec["rows"])
    return f'<div class="card tbl">{th}{rows}</div>'


def build(d):
    body = head(d["title"], d["sub"], "superuser", d["src"])
    body += f'<div class="card core"><span class="pill">หลักคิดเดียวกัน</span><p>{md(d["core"])}</p></div>'
    for n, sec in enumerate(d["sections"], 1):
        body += f'<div class="sec">{dot("pc", num=n)}<h2>{e(sec["title"])}</h2></div>{table(sec)}'
    return page(d["title"], body, "superuser").replace("</style>", CSS + "</style>", 1)


if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for f in glob.glob(os.path.join(HERE, "*.json")):
        name = os.path.basename(f)[:-5]
        open(os.path.join(out, f"{name}.html"), "w", encoding="utf-8").write(build(json.load(open(f, encoding="utf-8"))))
        print(name)
