# playbook · image-series — ชุดภาพจาก AI ที่ดูเป็นชุดเดียวกัน

ใช้เมื่อ: ภาพสินค้าหลายชิ้น · โพสต์ทั้งสัปดาห์ · storyboard · ตัวละครที่ใช้ซ้ำ · ต้องแก้ภาพที่มีอยู่
skill หลัก: `brief-to-image` · `style-consistency` · `image-editing-brief` · agent `art-director`

## ขั้นตอน (คัดลง todo ตรงตัว)

1. เขียน style lock sheet (แผ่นล็อกสไตล์) ตาม `style-consistency` — สี แสง องค์ประกอบ เลนส์ สิ่งต้องห้าม · ใคร: `art-director` ตัวใหม่
2. เขียน brief และ prompt ทีละภาพตาม `brief-to-image` โดยทุกภาพอ้าง lock sheet เดียวกัน · ใคร: `art-director` ตัวใหม่
3. สร้างภาพผ่านเครื่องมือที่ผู้ใช้ติดตั้ง ถ้าไม่มีเครื่องมือให้ส่ง brief ที่พร้อมวางใช้ · ใคร: `art-director` ตัวใหม่
4. เทียบทุกภาพกับ lock sheet — ภาพที่หลุดสไตล์ให้เขียน `image-editing-brief` (อะไรคงไว้ · อะไรเปลี่ยน) แทนการสร้างใหม่ทั้งภาพ · ใคร: `design-critic` ตัวใหม่เทียบกับ lock sheet · `art-director` ตัวใหม่เขียน brief แก้
5. รัน `design-review` กับชุดภาพทั้งชุด · ใคร: `design-critic` ตัวใหม่ (อ่านอย่างเดียว · ไม่แก้ไฟล์)

## จบเมื่อ

ทุกภาพผ่าน lock sheet และ `design-review` และเก็บ brief ไว้ให้สร้างซ้ำได้
