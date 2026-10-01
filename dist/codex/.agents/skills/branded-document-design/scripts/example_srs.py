"""ตัวอย่างเอกสารสั้น ๆ ที่ใช้ทุกองค์ประกอบของ brandkit — ใช้เป็นแบบฝึกหัด/ตรวจสไตล์
รัน:  python example_srs.py  →  ได้ example_srs.docx
"""
from brandkit import BrandDoc

doc = BrandDoc()

doc.cover(
    "เอกสารข้อกำหนดซอฟต์แวร์ (Software Specification)",
    subtitle="ระบบ Apps Track — Project Control & Monitor",
    meta="เวอร์ชันเอกสาร 3.5  •  ปรับปรุง 19 กรกฎาคม 2026",
    note="v3.5: เพิ่มไอคอน Apps Track บนหน้าปกและระบุไฟล์แนบ",
)

doc.h1("1. ภาพรวมระบบ")
doc.para("eitprojects เป็นระบบบริหารและติดตามโครงการ (Project Management & Tracking) "
         "แบบ Web Application ที่พัฒนาใช้งานในองค์กร ครอบคลุมการทำงานตั้งแต่จัดการ "
         "โครงการ งาน (Work Items) ตามขั้นตอน SDLC, Sprint/Agile Board, ปฏิทิน, "
         "การประชุม, Wiki, Timesheet และการเชื่อมต่อ Git Repository/CI")

doc.kpi_row([("19", "โครงการทั้งหมด"), ("115", "Work items"),
             ("103", "Open tasks"), ("14", "ผู้ใช้ (มี AI Agent 1)")])

doc.table(
    ["หัวข้อ", "รายละเอียด"],
    [["URL ระบบ", "https://project.eitaccount.cloud (ชื่อผลิตภัณฑ์: eitprojects)"],
     ["ประเภทระบบ", "Web Application (SPA) + รองรับติดตั้งเป็น PWA พร้อม Push Notification"],
     ["การยืนยันตัวตน", "Username / Password (หน้า Sign in ของระบบเอง)"],
     ["ระบบภายนอกที่เชื่อมต่อ", "Git hosting: Gitea (ภายในองค์กร) และ GitHub"]],
    widths=[2600, 6760],
)

doc.h2("1.1 ผู้ใช้งานและสิทธิ์")
doc.bullets([
    "PM / หัวหน้าโครงการ — วางแผน มอบหมายงาน และติดตามความคืบหน้า",
    "ผู้บริหาร — ดูภาพรวมพอร์ตโครงการและรายงานสรุป",
    "AI Agent — ผู้ใช้ประเภท AI ที่เข้าถึงระบบผ่าน MCP tools",
])

doc.callout("tip", "ข้อแนะนำ",
            "กำหนดสิทธิ์ด้วย RBAC ตั้งแต่ต้นโครงการ จะย้อนมาแก้ทีหลังยากกว่ามาก")
doc.callout("warning", "ข้อควรระวัง",
            "Token ที่ใช้เชื่อม Git host ต้องไม่ถูกแสดงกลับมาใน UI หลังบันทึกแล้ว")

doc.h1("2. สถานะงานตาม Milestone")
doc.pill_table(
    ["รหัส", "รายการ", "ผู้รับผิดชอบ", "สถานะ"],
    [["M-01", "ออกแบบฐานข้อมูลและ Domain model", "SA", "เสร็จ"],
     ["M-02", "ระบบยืนยันตัวตนและ RBAC", "Dev", "กำลังทำ"],
     ["M-03", "Kanban / Sprint board", "Dev", "กำลังทำ"],
     ["M-04", "Timesheet และรายงาน", "Dev", "ยังไม่เริ่ม"],
     ["M-05", "เชื่อมต่อ Git / CI", "DevOps", "ค้าง"]],
    status_col=3,
    palette={"เสร็จ": "green", "กำลังทำ": "amber", "ค้าง": "red", "ยังไม่เริ่ม": "grey"},
    widths=[1100, 4200, 1900, 2160],
)

doc.h2("2.1 ตัวอย่างการเรียก API")
doc.code("""GET /api/v1/projects?status=active&page=1
Authorization: Bearer <token>

200 OK
{ "total": 19, "items": [ { "key": "PROJ-1", "name": "Apps Track" } ] }""")

doc.signoff([("Product Owner", "—"), ("Tech Lead", "—"), ("QA Lead", "—")])

doc.save("example_srs.docx")
print("wrote example_srs.docx")
