"""term_sample.py — ฟังคำอ่านศัพท์ทุกคำก่อนสร้างเสียงทั้งตอน: อ่านทีละคำแบบ "1, คอนโทรเล่อ" ได้ไฟล์เสียงชาย 1 ไฟล์ หญิง 1 ไฟล์ และรายการเลข

ผู้ฟังจดเลขคำที่เพี้ยน แล้วเปิด term-sample-list.md ดูว่าคำนั้นส่งคำอ่านอะไรให้เสียง · แก้ใน --respell แล้วรันซ้ำ สร้างใหม่เฉพาะคำที่เปลี่ยน

ใช้ (ต้อง pip install edge-tts และมี ffmpeg):
  python term_sample.py --lexicon words.tsv -o terms                                  # ทุกคำในไฟล์คำอ่าน
  python term_sample.py --lexicon words.tsv --respell respell.tsv --script ep01.txt -o terms   # เฉพาะคำที่มีในสคริปต์

ได้: terms/term-sample-male.mp3 · terms/term-sample-female.mp3 · terms/term-sample-list.md · terms/cache/ (เสียงทีละคำ)
"""
import argparse
import asyncio
import hashlib
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tts_cues import load_lexicon, spoken_of  # noqa: E402

# ความเร็วที่ผู้ใช้ฟังแล้วเลือก (2026-11-09 · 338 คำ): +10%/+8% เร็วไป · +0%/-2% ฟังศัพท์ทันทุกคำ
VOICES = {"male": ("th-TH-NiwatNeural", "+0%"), "female": ("th-TH-PremwadeeNeural", "-2%")}
GAP = 0.7  # วินาทีระหว่างคำ พอให้จดเลข


def pick_terms(lexicon, respell, script_text=None):
    """คืน [(คำเขียน, คำที่ส่งให้เสียงอ่าน)] · มีสคริปต์ → เฉพาะคำที่ปรากฏ"""
    base = None if script_text is None else spoken_of(script_text, [])  # spoken_of เปลี่ยนขึ้นบรรทัดเป็นเว้นวรรค เทียบหลังแปลงเท่านั้น
    terms = []
    for word, reading in lexicon:
        if base is None or spoken_of(base, [(word, "\0")]) != base:
            terms.append((word, spoken_of(reading, respell)))
    return terms


async def say(text, voice, rate, path, sem):
    import edge_tts
    if path.exists():
        return True
    part = path.with_suffix(".part")  # เขียนเสร็จและไม่ว่างค่อยเปลี่ยนชื่อ ไฟล์ว่างจากรอบที่ล้มจะไม่ถูกนับว่าเสร็จ
    async with sem:
        for k in range(6):  # บริการตอบ "No audio was received" เป็นพัก ๆ (เจอ 3 จาก 676 คำ 2026-11-09) ลองใหม่แล้วผ่าน
            try:
                await edge_tts.Communicate(text, voice, rate=rate).save(str(part))
                if part.stat().st_size:
                    part.replace(path)
                    return True
            except Exception:  # noqa: BLE001  ลองใหม่ทุกความผิดพลาดของเครือข่ายและบริการ
                pass
            await asyncio.sleep(3 * (k + 1))
    print("สร้างไม่ได้:", text)
    return False


def build(terms, out, voices):
    try:
        import edge_tts  # noqa: F401
    except ImportError:
        sys.exit("ยังไม่มี edge-tts · ติดตั้งใน venv ของงานก่อน: python -m pip install edge-tts")
    cache = out / "cache"
    cache.mkdir(parents=True, exist_ok=True)
    files = {who: [cache / (hashlib.sha1(f"{v}|{r}|{n}, {sp}".encode()).hexdigest()[:12] + ".mp3")
                   for n, (_, sp) in enumerate(terms, 1)] for who, (v, r) in voices.items()}

    async def run():
        sem = asyncio.Semaphore(2)  # 2 คำพร้อมกัน · มากกว่านี้บริการปฏิเสธบ่อยขึ้น (ยังไม่ได้วัด)
        jobs = [say(f"{n}, {sp}", v, r, files[who][n - 1], sem)
                for who, (v, r) in voices.items() for n, (_, sp) in enumerate(terms, 1)]
        return await asyncio.gather(*jobs)
    if not all(asyncio.run(run())):
        sys.exit("บางคำยังไม่ได้เสียง · รันคำสั่งเดิมซ้ำ จะสร้างเฉพาะคำที่ขาด")

    gap = cache / "gap.mp3"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
                    "-t", str(GAP), "-c:a", "libmp3lame", "-b:a", "48k", str(gap)], check=True)
    for who, paths in files.items():
        listing = cache / f"{who}.txt"
        listing.write_text("".join(f"file '{p.as_posix()}'\nfile '{gap.as_posix()}'\n" for p in paths), encoding="utf-8")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(listing),
                        "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "24000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k",
                        str(out / f"term-sample-{who}.mp3")], check=True)
    (out / "term-sample-list.md").write_text(
        "| # | คำเขียน | คำที่ส่งให้เสียงอ่าน |\n|---|---|---|\n"
        + "".join(f"| {n} | {w} | {sp} |\n" for n, (w, sp) in enumerate(terms, 1)), encoding="utf-8")


def self_test():
    lexicon = [("Controller", "คอนโทรลเลอร์"), ("IoT", "ไอโอที"), ("Git", "กิต")]
    respell = [("คอนโทรลเลอร์", "คอนโทรเล่อ")]
    checks = [("สะกดใหม่หลังแปลงคำอ่าน", pick_terms(lexicon, respell)[0] == ("Controller", "คอนโทรเล่อ")),
              ("เลือกเฉพาะคำในสคริปต์ ไม่สนตัวพิมพ์", [w for w, _ in pick_terms(lexicon, [], "ต่อ iot\nกับ controller\n")]
               == ["Controller", "IoT"]),
              ("ไม่จับคำที่ซ้อนในคำอื่น", pick_terms(lexicon, [], "GitHub") == [])]
    for name, ok in checks:
        print(f"{name}:", "ผ่าน" if ok else "ไม่ผ่าน")
    ok = all(ok for _, ok in checks)
    print("self-test", "ผ่าน" if ok else "ไม่ผ่าน")
    return 0 if ok else 1


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if "--self-test" in sys.argv[1:]:
        sys.exit(self_test())
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--lexicon", required=True, help="คำ<TAB>คำอ่าน แบบเดียวกับ tts_cues.py")
    ap.add_argument("--respell", help="คำอ่าน<TAB>คำที่สะกดให้เสียงอ่านถูก (แก้หลังฟัง)")
    ap.add_argument("--script", help="สคริปต์ของตอน · ใส่แล้วเลือกเฉพาะคำที่มีในสคริปต์")
    ap.add_argument("-o", "--out", required=True)
    ap.add_argument("--male-rate", default=VOICES["male"][1])
    ap.add_argument("--female-rate", default=VOICES["female"][1])
    ap.add_argument("--self-test", action="store_true", help="ทดสอบตัวเลือกคำ ไม่ใช้เครือข่าย")
    a = ap.parse_args()
    script_text = Path(a.script).read_text(encoding="utf-8-sig") if a.script else None
    terms = pick_terms(load_lexicon(a.lexicon), load_lexicon(a.respell), script_text)
    if not terms:
        sys.exit("ไม่มีคำให้อ่าน · ตรวจไฟล์คำอ่านหรือสคริปต์")
    voices = {"male": (VOICES["male"][0], a.male_rate), "female": (VOICES["female"][0], a.female_rate)}
    out = Path(a.out)
    build(terms, out, voices)
    print(f"{len(terms)} คำ → {out / 'term-sample-male.mp3'} · {out / 'term-sample-female.mp3'} · {out / 'term-sample-list.md'}")


if __name__ == "__main__":
    main()
