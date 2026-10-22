"""ใส่หัวกล่องเป็นภาษาอังกฤษตัวใหญ่ + ภาษาไทยตัวเล็กข้างใต้ ให้รูป SuperUser ทุกรูป

python bilingual.py <html...>   (เขียนทับไฟล์เดิม · รันซ้ำได้ ไม่ใส่ซ้ำ)
คำแปลอยู่ใน EN · หัวที่ไม่มีคำแปลจะถูกพิมพ์ออกมาให้เติม
"""
import re, sys

EN = {
 # หัวรูป
 "แกนหัวหน้าทีม": "Team Lead Core", "งานออกแบบ": "Graphic Design", "สิทธิผู้บริโภค": "Consumer Rights",
 "การเรียนรู้เทคโนโลยี": "Tech Learning", "การจัดการเรื่องสุขภาพ": "Health & Wellness",
 "งานบ้านและครอบครัว": "Home & Family", "ร้านค้าออนไลน์": "Online Seller",
 "การจัดการชีวิตส่วนตัว": "Personal Life", "งานอาชีพและการหางาน": "Career & Job Search",
 "งานหลังบ้านบริษัทไทย": "Thai Workplace Admin", "การเงินและการลงทุน": "Trading & Finance",
 "วิธีทำงานของทีม agent": "How the Agent Team Works",
 # ขั้นหลัก
 "รับงาน": "Intake", "เข้าใจงาน · เลือกวิธีทำ": "Understand · Choose the Approach",
 "ลงมือทีละขั้น": "Work Step by Step", "ก่อนตัดสินใจ": "Before Deciding", "ส่งผล": "Deliver", "เรียนรู้": "Learn",
 # กล่อง
 "งานข้ามสาขา · รับงานเข้า": "Cross-Domain Intake", "หัวหน้าทีม (SuperUser)": "Team Lead", "คำสั่งผู้ใช้": "User Prompt", 
 "ของที่จะเรียน": "Learning Material", "ของที่ผู้ใช้ส่ง": "User Files", "ข้อมูลที่ผู้ใช้ส่ง": "User Data",
 "หลักฐานที่ผู้ใช้ส่ง": "User Evidence", "ไฟล์ที่ผู้ใช้ส่ง": "User Files", "ไฟล์ใน prompt/": "Prompt Files",
 "ตรวจ · งานยาว · เรียนรู้": "Review · Long Runs · Learning",
 "สร้างและแก้": "Build & Change", "ตรวจและส่ง": "Review & Ship", "งานชุด · งานยาว": "Batch · Long Runs", "ดูแลระบบ": "Maintain",
 "คัดขั้นตอนของ playbook ลง todo ตรงตัว ไม่สรุปย่อ": "Copy Playbook Steps into Todo, Word for Word",
 "เข้าใจ": "Understand", "วางแผน": "Plan", "ออกแบบ": "Design", "ลงมือ": "Do", "พิสูจน์": "Prove", "รายงาน": "Report",
 "หัวหน้าทีม แจกงาน": "Lead Delegates", "ระดับโมเดล — หัวหน้าเลือกตามงาน": "Model Tier — Lead Picks per Task",
 "ใหญ่": "Large", "กลาง": "Medium", "เล็ก": "Small",
 "ลูกทีม (subagent)": "Subagent", "ระดับโมเดล + effort — งบขยับทั้งตาราง": "Model Tier + Effort — Budget Shifts All",
 "3 บรรทัดก่อนแตะงาน": "Three Lines First", "จัดขนาด": "Size the Job", "เลือกงบ": "Pick a Budget", "คาดไว้ก่อน": "Estimate First",
 "ใบสั่งงาน 5 ข้อ": "5-Point Brief", "ประเมินลูกทีม": "Score Each Piece", "ตรวจซ้ำจนผ่าน": "Re-check Until It Passes",
 "งานทั่วไป": "General Work", "ของแกน · ใช้ได้ทุกสาขา": "Core · Every Domain",
 "งานข้ามสาขา → ส่งต่อ /&lt;plugin&gt;:superuser ของ plugin นั้น": "Cross-Domain Handoff",
 "งานชีวิตประจำวัน → ส่งต่อ agent ของ plugin อื่นที่ติดตั้งไว้": "Everyday-Task Handoff",
 "เครื่องคุณ = คนสั่ง": "Your Machine Gives Orders", "Docker sandbox · 1 โปรเจกต์ = 1 ห้อง": "Docker Sandbox",
 "skill ที่ลูกทีมใช้": "Skills the Team Uses",
 "ย้อนกลับได้ → ทำเลย": "Reversible → Do It", "ไม่รู้ → ค้นเอง": "Unknown → Research",
 "ย้อนไม่ได้ → รออนุมัติ": "Irreversible → Await Approval",
 "คำตอบตอนจบ": "Final Answer", "ตารางสถานะ": "Status Table", "PR ขึ้น branch หลัก": "PR to Main Branch",
 "ใบสั่งซื้อขาย": "Trade Orders", "ลงขาย · ตอบลูกค้า": "List · Reply to Buyers", "จ่ายเงิน · ส่งข้อความ": "Pay · Send Messages",
 "ส่งอีเมล · ยกเลิกบริการ": "Email · Cancel Services", "โพสต์ · ยิงแอด": "Post · Run Ads",
 "ส่งร้องเรียน · ขอเงินคืน": "Complain · Claim Refund", "สมัครสอบ · push": "Register Exam · Push",
 "ส่ง · โพสต์ · ลบ": "Send · Post · Delete", "นัดหมาย · ส่งข้อมูล": "Book · Share Data",
 "ส่งใบสมัคร · ตอบ HR": "Apply · Reply to HR", "ยื่นแบบ · ชำระ": "File · Pay",
 "ระหว่างงาน": "During Work", "หัวหน้าเทียบคาดกับจริง": "Lead Checks Estimate vs Actual", 'ผู้ใช้สั่ง "รวมบทเรียน"': "User Merges Lessons",
 "เกณฑ์และหลักที่ใช้ทุกขั้น": "Criteria & Principles", "principle เป็นฐานทุกขั้น": "Principles Under Every Step",
 "รูปแบบการทำงาน": "Working Patterns", "โมดูล 9 ตัว": "9 Modules", "อภิธานศัพท์": "Glossary",
 "คำทั่วไป": "General", "การทำงานและการอนุมัติ": "Work & Approval", "ไฟล์ในโฟลเดอร์งาน": "Work Folder Files",
 "ศัพท์ของงานนี้": "Domain Terms", "git และการส่งงาน": "Git & Shipping", "sandbox และความปลอดภัย": "Sandbox & Safety",
 "ไฟล์และ skill ในระบบ": "System Files & Skills",
}
# หัวที่เป็นอังกฤษอยู่แล้ว → เติมไทยข้างใต้
TH = {"CONTEXT.md": "ไฟล์กลางของงาน", "learning-reviewer": "ตัวสรุปบทเรียน", "docs/BUILD-PLAN.md": "แผนงานและบันทึกการตัดสินใจ",
      "CLAUDE.global.md": "กฎประจำเครื่อง", "inbox/": "กล่องข้อความเข้า"}
# หัวอังกฤษที่ต้องเปลี่ยนคำและใส่ไทยเอง
PAIR = {"slash command": ("Slash Command", "คำสั่งลัด")}
DYN = [(r"ลูกทีมของ plugin นี้ · (\d+) agent", lambda m: f"Team Agents · {m[1]}"),
       (r"skill ที่ลูกทีมใช้ · (\d+) ตัว", lambda m: f"Skills the Team Uses · {m[1]}"),
       (r"skill กลาง · (\d+) ตัว", lambda m: f"Shared Skills · {m[1]}"),
       (r"playbook ทั้ง (\d+) ตัว", lambda m: f"{m[1]} Playbooks")]

CSS = """<style>
.bi{display:inline-flex;flex-direction:column;line-height:1.2}
.bi .th{display:block;font-family:"Anuphan",sans-serif;font-size:13px;font-weight:400;color:var(--ink3);margin-top:4px;letter-spacing:0;line-height:1.5}
.lead .bi .th,.lead .th{color:#D6D8E0}
.sh .bi .th{font-size:13px;margin-top:0}
.gh .bi .th{font-size:13px;margin-top:0}
.lc .bi,.dc .bi,.plan .bi,.mg .bi,.oc .bi,.gc .bi,.mc .bi,.tier .bi,.grp .bi,.lead .bi{align-items:center}
.inp .bi{display:block}.inp .bi .th{font-size:13px;margin-top:0}
.hd h1 .h1th{display:block;font-family:"Anuphan",sans-serif;font-size:20px;font-weight:400;letter-spacing:0;margin-top:8px;color:#fff;white-space:normal}
</style>
"""
missing = set()

def plain(s):
    s = re.sub(r"<svg.*?</svg>", "", s, flags=re.S)
    return re.sub(r"<[^>]+>", "", s).strip()

def translate(th_plain):
    if th_plain in PAIR: return PAIR[th_plain]
    if th_plain in EN: return EN[th_plain], None
    if th_plain in TH: return None, TH[th_plain]
    for pat, f in DYN:
        m = re.fullmatch(pat, th_plain)
        if m: return f(m), None
    return None, None

def bi(inner):
    if 'class="bi"' in inner: return inner
    m = re.match(r"(\s*<svg.*?</svg>)?(.*)$", inner, re.S)
    icon, rest = m.group(1) or "", m.group(2)
    p = plain(rest)
    if not p or p == ".": return inner
    en, th = translate(p)
    if en: return f'{icon}<span class="bi"><span class="en">{en}</span><small class="th">{th or rest.strip()}</small></span>'
    if th and not en: return f'{icon}<span class="bi"><span class="en">{rest.strip()}</span><small class="th">{th}</small></span>'
    missing.add(p)
    return inner

def run(t):
    if 'class="bi"' in t: return t
    head, body = t[: t.index("<body")], t[t.index("<body"):]
    # หัวรูป
    def h1(m):
        p = plain(m[2]); en = EN.get(p)
        if not en: missing.add("H1 " + p); return m[0]
        return f'<h1>{m[1]}{en}<span class="h1th">{m[2]}</span></h1>'
    body = re.sub(r"<h1>(SuperUser <span>—</span> )(.*?)</h1>", h1, body)
    # กล่องที่มีหัว class t · sh · gh · tl
    body = re.sub(r'(<div class="(?:t|sh|gh(?: mt)?|tl)"[^>]*>)(.*?)(</div>)', lambda m: m[1] + bi(m[2]) + m[3], body, flags=re.S)
    body = re.sub(r'(<div class="tiercap">)(.*?)(</div>)', lambda m: m[1] + bi(m[2]) + m[3], body)
    body = re.sub(r'(<h4>)(.*?)(</h4>)', lambda m: m[1] + bi(m[2]) + m[3], body)
    body = re.sub(r'(<div class="tier"><b>)(.*?)(</b>)', lambda m: m[1] + bi(m[2]) + m[3], body)
    body = re.sub(r'(class="card inp"[^>]*>.*?<b>)(.*?)(</b>)', lambda m: m[1] + bi(m[2]) + m[3], body)
    # h3 ที่มี <small> คำอธิบาย: แปลเฉพาะส่วนหัว
    def h3(m):
        icon, title, small = m[2] or "", m[3], m[4] or ""
        en, _ = translate(plain(title))
        if not en: missing.add(plain(title)); return m[0]
        return f'{m[1]}{icon}<span class="bi"><span class="en">{en}</span><small class="th">{title.strip()}</small></span>{small}</h3>'
    body = re.sub(r'(<h3>)(<svg.*?</svg>)?(.*?)(<small>.*?</small>)?</h3>', h3, body, flags=re.S)
    # หัวแผง: "ไทย<small>คำอธิบาย</small>" → "English<small>ไทย · คำอธิบาย</small>"
    def h2(m):
        title, small = m[1], m[2]
        en, _ = translate(plain(title))
        if not en: missing.add(plain(title)); return m[0]
        sm = re.sub(r"</?small>", "", small)
        sm = title if sm.lower() == en.lower() else f"{title} · {sm}"
        return f"<h2>{en}<small>{sm}</small></h2>"
    body = re.sub(r"<h2>([^<]*?)(<small>.*?</small>)</h2>", h2, body)
    return head.replace("</head>", CSS + "</head>") + body

if __name__ == "__main__":
    for f in sys.argv[1:]:
        t = open(f, encoding="utf-8").read()
        open(f, "w", encoding="utf-8").write(run(t))
    if missing:
        print("ยังไม่มีคำแปล:"); [print("  ", m) for m in sorted(missing)]
