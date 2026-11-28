# หลักคิด · Tech growth (โปรเจกต์ข้างเคียงสำหรับพอร์ตและการตามข่าวเทคโนโลยี)
> ให้มีผลงานเล็กที่เสร็จและเปิดให้คนอื่นลองได้จริง และตามการเปลี่ยนแปลงของเทคโนโลยีจากต้นทางด้วยเวลาที่จำกัด ไม่จมไปกับข่าวหรือโปรเจกต์ที่ไม่จบ

## งานดีคืออะไร
1. **โปรเจกต์เล็กที่จบ ดีกว่าโปรเจกต์ใหญ่ที่ค้าง** — งานที่ใช้งานได้คือหน่วยวัดความคืบหน้า การจำกัดงานที่เปิดค้างทำให้งานจบ และงานที่ค้างทิ้งความจดจ่อไว้กับงานนั้น · ตรวจด้วยตา: พอร์ตมีโปรเจกต์ที่รันได้จริงหลายชิ้น และไม่มีโปรเจกต์ค้างเปิดพร้อมกันเกินจำนวนที่ตั้งไว้ (S1, S2, S3, S4)
2. **ก่อนเริ่มเขียนนิยามคำว่า "เสร็จ" และตัดขอบเขตให้เล็กลง** — แผนที่ประเมินจากความรู้สึกมักมองโลกในแง่ดีเกิน การดูกรณีคล้ายกันจากภายนอกและเป้าที่เจาะจงช่วยลดปัญหานี้ · ตรวจด้วยตา: มีบรรทัดเดียวบอกว่าเสร็จคืออะไร สิ่งที่ตั้งใจไม่ทำ และวันที่จะหยุดไม่ว่าจะเสร็จหรือไม่ (S3, S5, S6)
3. **จำกัดเวลาทุกโปรเจกต์และทุกรอบอ่านข่าว (timebox)** — เหตุการณ์ใน Scrum มีเวลาสูงสุดกำหนดไว้ ส่งงานเป็นรอบสั้น และเส้นตายที่ตั้งเองช่วยให้งานเสร็จ (หน้าบทคัดย่อของงานวิจัยอ่านได้เฉพาะชื่อเรื่อง) · ตรวจด้วยตา: โปรเจกต์มีวันเริ่มและวันจบ รอบอ่านข่าวมีเวลาจบ และทบทวนผลเมื่อครบรอบ (S3, S6, S7)
4. **ตามการเปลี่ยนแปลงจากบันทึกการเปลี่ยนแปลง (changelog) และประกาศรุ่นของเจ้าของเทคโนโลยีเอง ไม่ใช่สรุปต่อๆ กัน** — changelog ที่ดีเขียนให้คนอ่าน เรียงรุ่นล่าสุดก่อน แยกประเภท (เพิ่ม แก้ ยกเลิก ลบ ความปลอดภัย) และเลขรุ่นตาม Semantic Versioning บอกได้ว่ารุ่นหลักที่เพิ่มขึ้นคือการเปลี่ยนที่ไม่เข้ากับของเดิม · ตรวจด้วยตา: บันทึกข่าวแต่ละเรื่องมีลิงก์ไปหน้า release notes ต้นทางและระบุเลขรุ่น (S8, S9, S10)

## พลาดบ่อย
- เริ่มโปรเจกต์ใหญ่หลายอันพร้อมกัน → ไม่มีอะไรเสร็จ ความจดจ่อกระจาย (S1, S3, S4)
- ไม่ตัดขอบเขตและไม่ตั้งวันจบ → งานขยายจนเลิกกลางทาง (S5, S6, S7)
- อ่านข่าวเทคโนโลยีจากบทความสรุปไม่เปิดต้นทาง → พลาดรายละเอียดการเปลี่ยนที่ไม่เข้ากับของเดิม (S8, S9)

## ใช้คู่กับ
skills: `learning-path` · playbook: `side-project` · `tech-radar` · `decide-and-goals`

## Sources (checked 2026-11-27)
- S1 · The Official Kanban Guide (จำกัดงานที่ค้าง), Kanban University · https://kanban.university/kanban-guide/ · หลัก 1
- S2 · Principles behind the Agile Manifesto ("Working software is the primary measure of progress"), agilemanifesto.org · https://agilemanifesto.org/principles.html · หลัก 1, 3
- S3 · The Scrum Guide (Definition of Done, Increment ต้องใช้ได้จริง, ทุกเหตุการณ์มีเวลาสูงสุด), Scrum.org และ Scrum Guides · https://www.scrumguides.org/scrum-guide.html · หลัก 1, 2, 3
- S4 · Why is it so hard to do my work? Attention residue (Leroy 2009), Organizational Behavior and Human Decision Processes · https://ideas.repec.org/a/eee/jobhdp/v109y2009i2p168-181.html · หลัก 1
- S5 · Before you make that big decision (Kahneman, Lovallo และ Sibony 2011), Harvard Business Review · https://faculty.washington.edu/pathaksd/BBUS548/Required%20Readings/Before%20You%20Make%20that%20Big%20Decision.pdf · หลัก 2
- S6 · Building a practically useful theory of goal setting and task motivation (Locke และ Latham 2002), American Psychologist · https://goal-lab.psych.umn.edu/orgpsych/2020/readings/5.%20Motivation/Locke%20&%20Latham%20(2002).pdf · หลัก 2, 3, 4
- S7 · Procrastination, deadlines, and performance (Ariely และ Wertenbroch 2002), Psychological Science · https://pubmed.ncbi.nlm.nih.gov/12009041/ · หลัก 3 (อ่านได้เฉพาะชื่อเรื่องและรายการค้นหา)
- S8 · Keep a Changelog 1.1.0 · https://keepachangelog.com/en/1.1.0/ · หลัก 4
- S9 · Semantic Versioning 2.0.0 · https://semver.org/ · หลัก 4
- S10 · Node.js release rules (Current, LTS, ใช้งานจริงเฉพาะ LTS), OpenJS Foundation · https://nodejs.org/en/about/previous-releases · หลัก 4
