#!/usr/bin/env python3
"""จับท่าที่ AI ชอบใช้ในภาษาไทย (ตามรหัสกฎใน references/thai-grammar.md) — เตือนอย่างเดียว ไม่ตัดสินว่าอ่านลื่น

จับได้: t-block (คำต้องเลี่ยง) · t-budget (ซึ่ง/โดย/ดังนั้น เกิน 1 ต่อย่อหน้า · ทั้งนี้ เปิดย่อหน้า)
        · t-padding (ทำการ มีการ ได้มีการ มีความ) · f3 (จุดกลางย่อหน้า) · g-yamok (ๆ ไม่เว้นวรรค)
        · t-dash (— และ ;) · t-thuk (ถูก เกิน 2 ต่อย่อหน้า) · t-reassure (ไม่ต้องกังวล)
ไม่จับ: โครงประโยค f1 f2 f4–f7 · ระดับภาษา · ความลื่น — ยังต้องอ่านเอง

ใช้:
  python thai_tells.py รายงาน.md บท2.md     แสดงจุดที่เจอ (ไฟล์:บรรทัด รหัส ข้อความ) และสรุป · exit 0 เสมอ
  python thai_tells.py รายงาน.md --strict   เจอแล้ว exit 1 (ใช้เป็น check ใน CI หรือ hook)
  python thai_tells.py --self-test          พิสูจน์ว่ายังจับได้จริง

ข้ามข้อความใน `backtick` · บล็อกโค้ด ``` · และในเครื่องหมายคำพูด "…" (ยกมาพูดถึง) · ต้องมีแค่ Python 3.9+ ไม่ติดตั้งอะไรเพิ่ม
"""
import re, sys
from pathlib import Path

TH = "[ก-๛]"
BLOCK = [
    "ในยุคปัจจุบัน", "ในโลกปัจจุบัน", "ในโลกที่", "เป็นที่ทราบกันดีว่า", "เป็นที่รู้กันว่า", "ปฏิเสธไม่ได้ว่า",
    "เป็นสิ่งสำคัญที่ต้องตระหนัก", "มีความสำคัญ", "การที่", "ในเรื่องของ", "ในส่วนของ", "อย่างมหาศาล",
    "อย่างน่าทึ่ง", "อย่างไม่น่าเชื่อ", "ทุกสิ่งที่คุณต้องรู้", "โดยสรุปแล้ว", "กล่าวโดยสรุป", "นั่นเอง!", "ไม่ต้องกังวล",
]
# "การที่" จับเฉพาะรูป "การที่…นั้น" กับขึ้นต้นประโยค ไม่งั้นเจอ "เหตุการณ์ที่" ด้วย
# ภาษาไทยไม่เว้นวรรคระหว่างคำ จึงไม่ใช้ขอบคำ (\b) จับ — ใช้คำยกเว้นแทน
BLOCK_RE = [(w, re.compile(re.escape(w))) for w in BLOCK if w != "การที่"]
BLOCK_RE.append(("การที่…นั้น", re.compile(r"(?:^|\s)การที่[ก-๛\s]{2,40}?นั้น")))
PADDING = re.compile(r"(ได้มีการ|ได้ทำการ|ทำการ|มีการ|มีความ(?=[ก-๛]))")
PADDING_OK = re.compile(r"(วันทำการ|เวลาทำการ|ทำการค้า|ทำการบ้าน|ทำการเกษตร|ทำการตลาด|มีความสุข|มีความหมาย|มีความเห็น|มีความรู้|มีความผิด|มีความจำเป็น|มีความเสี่ยง)")
BUDGET = {"ซึ่ง": re.compile(r"ซึ่ง"), "โดย": re.compile(r"โดย(?!ตรง|เฉพาะ|รวม|สาร|ทั่วไป|ปกติ|ประมาณ|เร็ว|ไม่|ย่อ|ส่วนใหญ่|ที่ไม่|ดี)"), "ดังนั้น": re.compile(r"ดังนั้น")}
ABBR_OK = ("ดร", "นพ", "พญ", "ผศ", "รศ", "ศ", "บจก", "บมจ", "จก", "น", "ศ", "พ", "ค", "อ", "ต", "จ", "ฯลฯ", "กม", "ตร", "ม", "ชม")
PERIOD = re.compile(r"([ก-๛]{2,})\.\s+(?=[ก-๛])")  # คำไทย ≥2 ตัว ตามด้วยจุด แล้วคำไทย = จบประโยคด้วยจุด
YAMOK = re.compile(r"[ก-๛]ๆ|ๆ[ก-๛]")
DASH = re.compile(r"\s[—–]\s|;")
EMPTY_CELL = re.compile(r"\|\s*[—–]\s*(?=\|)")  # ขีดเดี่ยวในช่องตาราง = "ไม่มี" ไม่ใช่ขีดยาวในประโยค
THUK = re.compile(r"ถูก(?!ต้อง|ใจ|กฎ|ลง|กว่า|ที่สุด|สุขลักษณะ|หวย|คอ|ชะตา|อก|ปาก|โฉลก|แพง)(?=[ก-๛])")
STRIP = [re.compile(r"```.*?```", re.S), re.compile(r"`[^`\n]*`"), re.compile(r"\"[^\"\n]{1,200}\""), re.compile(r"“[^”\n]{1,200}”")]


def clean(text: str) -> str:
    for rx in STRIP:
        # แทนด้วยช่องว่างแต่เก็บขึ้นบรรทัดไว้ · บล็อกโค้ดหลายบรรทัดจะได้ไม่ทำให้เลขบรรทัดหลังบล็อกเลื่อน
        text = rx.sub(lambda m: re.sub(r"[^\n]", " ", m.group(0)), text)
    return text


def scan(text: str):
    """คืน list ของ (บรรทัด, รหัส, ข้อความที่เจอ) — ย่อหน้า = บรรทัดที่คั่นด้วยบรรทัดว่าง"""
    hits, lines = [], clean(text).split("\n")
    for i, line in enumerate(lines, 1):
        if not re.search(TH, line):
            continue
        for name, rx in BLOCK_RE:
            if rx.search(line):
                hits.append((i, "t-block", name))
        for m in PADDING.finditer(line):
            ctx = line[max(0, m.start() - 6): m.end() + 8]
            if not PADDING_OK.search(ctx):
                hits.append((i, "t-padding", m.group(0)))
        for m in PERIOD.finditer(line):
            if m.group(1) not in ABBR_OK and not m.group(1).endswith(ABBR_OK):
                hits.append((i, "f3", m.group(0).strip() + " …"))
        for m in YAMOK.finditer(line):
            hits.append((i, "g-yamok", m.group(0)))
        for m in DASH.finditer(EMPTY_CELL.sub("| x ", line)):
            hits.append((i, "t-dash", m.group(0).strip() or ";"))
        if line.lstrip().startswith("ทั้งนี้"):
            hits.append((i, "t-budget", "ทั้งนี้ เปิดย่อหน้า"))
    # งบต่อย่อหน้า
    start, para = 1, []
    for i, line in enumerate(lines + [""], 1):
        if line.strip():
            if not para:
                start = i
            para.append(line)
            continue
        if para:
            joined = " ".join(para)
            for word, rx in BUDGET.items():
                n = len(rx.findall(joined))
                if n > 1:
                    hits.append((start, "t-budget", f"{word} {n} ครั้งในย่อหน้า (งบ 1)"))
            n = len(THUK.findall(joined))
            if n > 2:
                hits.append((start, "t-thuk", f"ถูก {n} ครั้งในย่อหน้า"))
            para = []
    return sorted(hits)


def report(path: str, hits) -> None:
    for line, code, found in hits:
        print(f"{path}:{line}\t{code}\t{found}")


def self_test() -> int:
    bad = ("ในยุคปัจจุบัน ระบบได้ทำการตรวจสอบ ซึ่งพบว่า… ซึ่งต้องแก้ โดยเร็ว โดยทีม โดยการ\n"
           "เร็วขึ้น. ใช้น้อยลง. ต่างๆ — ทั้งหมด; ถูกลบ ถูกย้าย ถูกเขียน\n\nทั้งนี้ ไม่ต้องกังวล\n")
    good = ("ระบบตรวจแล้วพบ 3 จุด `ทำการ` \"ในยุคปัจจุบัน\" วันทำการถัดไป ดร. สมชาย พ.ศ. 2569 09.00 น. เริ่มงาน\n"
            "ต่าง ๆ โดยตรง ซึ่งตรงกับที่คาด\n"
            "| สื่อ | หัวข้อ |\n| diagram | — |\n")
    codes = {c for _, c, _ in scan(bad)}
    want = {"t-block", "t-padding", "t-budget", "f3", "g-yamok", "t-dash", "t-thuk"}
    missed = want - codes
    false = scan(good)
    # เลขบรรทัดหลังบล็อกโค้ดหลายบรรทัดต้องไม่เลื่อน: คำต้องเลี่ยงอยู่บรรทัด 5
    after_code = [ln for ln, c, _ in scan("ก่อนโค้ด\n```\nx = 1\n```\nในยุคปัจจุบัน ทุกอย่างเปลี่ยน\n") if c == "t-block"]
    print("ของเสียจับได้:", sorted(codes), "| พลาด:", sorted(missed) or "-")
    print("ของดีเตือนผิด:", false or "-")
    print("เลขบรรทัดหลังบล็อกโค้ด:", after_code, "(ต้องเป็น [5])")
    ok = not missed and not false and after_code == [5]
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main(argv) -> int:
    if "--self-test" in argv:
        return self_test()
    strict = "--strict" in argv
    files = [a for a in argv if not a.startswith("--")]
    if not files:
        print(__doc__)
        return 0
    total = 0
    for f in files:
        hits = scan(Path(f).read_text(encoding="utf-8"))
        report(f, hits)
        total += len(hits)
    print(f"\nเจอ {total} จุด ใน {len(files)} ไฟล์ · เตือนอย่างเดียว ตัดสินด้วยการอ่านออกเสียง" if total else "ไม่เจอท่าที่สคริปต์รู้จัก · ยังต้องอ่านเองตาม thai-grammar หัวข้อ 1 และ 4")
    return 1 if strict and total else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
