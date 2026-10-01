"""ตัวอย่างสไลด์ที่ใช้ทุกชนิดของ brandkit_pptx — รัน: python example_deck.py"""
from brandkit_pptx import BrandDeck

d = BrandDeck()
d.title_slide("Apps Track", "Project Control & Monitor",
              "รายงานความคืบหน้า · 19 กรกฎาคม 2026")
d.section("1 · ภาพรวมระบบ", kicker="ส่วนที่ 1")
d.bullets_slide("ขอบเขตงาน",
                ["โครงการและ Work items ตามขั้นตอน SDLC",
                 "Sprint / Kanban board และปฏิทินทีม",
                 "Timesheet, Workload และรายงานสรุปผู้บริหาร"],
                subtitle="สรุปจากเอกสารข้อกำหนดเวอร์ชัน 3.5")
d.kpi_slide("ตัวเลขสำคัญ", [("19", "โครงการ"), ("115", "Work items"),
                            ("103", "Open tasks"), ("14", "ผู้ใช้")])
d.table_slide("สถานะ Milestone", ["รหัส", "รายการ", "ผู้รับผิดชอบ", "สถานะ"],
              [["M-01", "ออกแบบฐานข้อมูลและ Domain model", "SA", "เสร็จ"],
               ["M-02", "ระบบยืนยันตัวตนและ RBAC", "Dev", "กำลังทำ"],
               ["M-03", "Kanban / Sprint board", "Dev", "กำลังทำ"],
               ["M-04", "เชื่อมต่อ Git / CI", "DevOps", "ค้าง"]],
              col_widths=[1, 4, 2, 2], status_col=3,
              palette={"เสร็จ": "green", "กำลังทำ": "amber", "ค้าง": "red"})
d.quote_slide("เอกสารที่อ่านง่าย คือเอกสารที่ถูกอ่านจริง", "ทีม Apps Track")
d.save("example_deck.pptx")
print("wrote example_deck.pptx")
