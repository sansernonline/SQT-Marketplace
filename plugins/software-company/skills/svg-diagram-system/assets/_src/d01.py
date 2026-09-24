"""รูปที่ 1 · ภาพรวมสถาปัตยกรรม — มีแต่การจัดวาง ภาษาภาพอยู่ใน ref.py"""
import ref as R

H = 860

# ── กริด: ทุกกล่องอยู่บนจุดตัด ────────────────────────────────────
CA, CB, CC, CD, CE, CF = 178, 452, 678, 896, 1080, 1312
R1, R2, R3 = 288, 458, 624
RM = (R1+R2)//2              # จุดกึ่งกลางของสองแถวที่ Nginx รับเข้ามา
J1, J2 = CB-74, CB+86        # จุดรวมก่อนเข้า · จุดแยกหลังออก
TB = 238                     # ช่องเดินสายด้านบน
MB = R3-48                   # ช่องเดินสายกลาง

b = [R.header("Dr Screening — ภาพรวมสถาปัตยกรรม",
              "ติดตั้งในโรงพยาบาล เครื่องเดียว ไม่ต่อออกอินเทอร์เน็ต",
              "Dr Screening", "Square Tech Solutions · เวอร์ชัน 1.0", "รูปที่ 1 · Architecture")]

# ── โซน ───────────────────────────────────────────────────────────
# ขอบล่างของโซนต้องต่ำกว่าคำอธิบายแถวล่างสุดอย่างน้อย 24 (R3 + 58 + 24)
ZB = R3 + 82
b += [R.zone(80, 120, 236, ZB-120, "พื้นที่คลินิก", "outside"),
      R.zone(360, 120, 856, ZB-120, "ห้อง Server ของโรงพยาบาล", "physical"),
      R.zone(392, 168, 788, ZB-168, "Application Server · Docker Compose · Ubuntu 24.04", "logical")]

# ── หน่วย ─────────────────────────────────────────────────────────
b += [R.unit(CA, R1, "เบราว์เซอร์", "HTTPS · TCP 443"),
      R.unit(CA, R2, "ผู้ใช้ 4 บทบาท", "แพทย์ · คัดกรอง · ML · แอดมิน"),
      R.unit(CA, R3, "กล้องถ่ายภาพจอตา", "DICOM C-STORE · TCP 11112"),
      R.unit(CB, RM, "Nginx", "ประตูเดียวที่เข้าระบบได้", slug="nginx"),
      R.unit(CC, R1, "CVAT", "กำกับภาพ · /cvat/"),
      R.unit(CC, R2, "OHIF Viewer", "อ่านผล · /viewer/"),
      R.unit(CD, R1, "PostgreSQL", "ฐานข้อมูล CVAT", slug="postgresql"),
      R.unit(CD, R2, "FastAPI + PyTorch", "Assessment API · /api/", slug="fastapi"),
      R.unit(CD, R3, "Orthanc", "คลังภาพ DICOM · GPLv3"),
      R.unit(CE, R1, "Redis", "คิวงานของ CVAT", slug="redis"),
      R.unit(CE, R3, "NVMe · RAID 1", "/data · /archive"),
      R.unit(CF, R2, "Backup NAS", "rsync ทุกคืน · เก็บ 30 วัน")]

# ── เส้น: เข้าเป็นจุดเดียว ออกเป็นจุดเดียว ─────────────────────────
b += [R.flow([(CA+34, R1), (J1, R1), (J1, RM), (CB-30, RM)]),
      R.flow([(CA+34, R2), (J1, R2), (J1, RM), (CB-30, RM)]),
      R.flow([(CB+30, RM), (J2, RM), (J2, R1), (CC-30, R1)]),
      R.flow([(CB+30, RM), (J2, RM), (J2, R2), (CC-30, R2)]),
      R.flow([(CC+30, R1), (CD-30, R1)]),
      R.flow([(CC+30, R2), (CD-30, R2)]),
      R.flow([(CD+30, R3), (CE-30, R3)]),
      R.flow([(CA+34, R3), (CD-30, R3)]),                                  # กล้องเข้าตรง
      R.flow([(CC, R2+58), (CC, MB), (CD, MB), (CD, R3-30)]),              # viewer → Orthanc
      R.flow([(CD, R1-30), (CD, TB), (CE, TB), (CE, R1-30)], arrow=True),  # ช่องบน
      R.flow([(CE+34, R3), (CF-64, R3), (CF-64, R2), (CF-34, R2)])]

# ── ป้าย: เขียวคือทางปกติ · ส้มมีได้ป้ายเดียว ───────────────────────
b += [R.pill((CA+34+J1)/2+10, R1-16, "HTTPS 443"),
      R.pill((CB+30+CC-30)/2, R1-16, "/cvat/"),
      R.pill((CB+30+CC-30)/2, R2-16, "/viewer/"),
      R.pill((CC+CD)/2, R1-16, "SQL"),
      R.pill((CC+CD)/2, R2-16, "/api/"),
      R.pill((CD+CE)/2, TB, "คิวงาน"),
      R.pill((CC+CD)/2, MB, "DICOMweb"),
      R.pill((CA+34+CD-30)/2, R3-16, "DICOM 11112 · ไม่ผ่าน Nginx", kind="except")]

b += [R.legend(H-96,
      [("outside","พื้นที่คลินิก"), ("physical","ห้อง Server"), ("logical","Docker Compose"),
       ("flow","สิ่งที่ไหลผ่านเส้น"), ("except","ทางเข้าที่ไม่ผ่านประตูหน้า")],
      ["ทุกเส้นเป็นแนวตั้งหรือแนวนอนเท่านั้น · Nginx วางที่กึ่งกลางของสองทางที่รับเข้าและสองทางที่ส่งต่อ",
       "โลโก้เป็นเครื่องหมายการค้าของเจ้าของ ใช้เพื่ออ้างถึงผลิตภัณฑ์ · CVAT · OHIF · Orthanc ใช้สัญลักษณ์แทนเพราะไม่มีไฟล์โลโก้ในชุด",
       "รายละเอียดระดับเครื่องและพอร์ต ดูรูปที่ 7 · รายละเอียดระดับ container ดูรูปที่ 3"])]

open("d01.svg","w",encoding="utf-8").write(R.svg(H, "".join(b)))
print("เขียน d01.svg แล้ว")
