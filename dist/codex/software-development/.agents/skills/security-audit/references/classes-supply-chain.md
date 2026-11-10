# สาย supply chain · build · CI/CD · การปล่อยรุ่น

เปิดเมื่อ repo มี lockfile · Dockerfile · workflow ของ GitHub Actions หรือ Azure DevOps · สคริปต์ build ที่ดึงของจากเน็ต · ระบบ plugin หรือ extension · ระบบอัปเดตตัวเอง · วางหัวข้อที่เลือกลง brief ลูกทีมทั้งก้อน

ผล `npm audit` · `pip-audit` · `osv-scanner` · `trivy` จาก `security-gate` เป็น candidate ของสายนี้ · ไฟล์นี้เน้นของที่สแกนเนอร์ไม่เห็น

## กติกาประจำสาย

- dependency ที่มี CVE เป็น finding ได้ต่อเมื่อโค้ดเรียกส่วนที่มีช่องโหว่ด้วย input ที่ผู้โจมตีคุมได้ · ไม่มีทางเรียก → `rejected` แล้วใส่ "อัปเดต" ในหัวข้อ hardening (ทำตาม `security-gate/references/dependency-updates.md`)
- ผู้โจมตีของสายนี้คือคนที่เปิด PR · คนที่ตั้งชื่อแพ็กเกจ · เจ้าของ registry หรือ action ที่ถูกเจาะ · ต้องบอกว่าเขาได้อะไร (ค่าลับของ CI · โค้ดใน release · สิทธิ์ push)
- การตั้งค่าที่อยู่ใน GitHub หรือ cloud (branch protection · environment secret · สิทธิ์ของ token) ไม่อยู่ใน repo → `needs_validation`
- ห้ามพิสูจน์ด้วยการ push หรือเปิด PR จริง · ใช้ `act` หรืออ่าน workflow แล้วไล่ว่าข้อมูลจาก PR ไปถึงคำสั่งไหน

## dependency และของที่ใช้ตอน build

| ประเภท (`class`) | ล่าอะไร | สัญญาณในโค้ด | พิสูจน์อย่างไร | มักแจ้งผิดเมื่อ |
|---|---|---|---|---|
| `dependency-confusion` | แพ็กเกจภายในที่ชื่อไม่มี scope ดึงจาก registry สาธารณะได้ | `.npmrc` ไม่ผูก scope กับ registry ภายใน · `--extra-index-url` ใน pip | ดูลำดับ registry ใน config · ตรวจว่าชื่อนั้นว่างใน registry สาธารณะ (อ่านอย่างเดียว) | ใช้ scope ที่จดไว้และผูก registry แล้ว |
| `unpinned-input` | build ดึงของรุ่นลอย (`latest` · branch · URL ที่ไม่มี hash) | `FROM node:latest` · ผล `curl` ส่งเข้า `sh` ตรง ๆ · ไม่มี lockfile · action ใช้ `@main` | ไล่ทุกบรรทัดที่ดึงของจากเน็ตใน Dockerfile และ workflow | รุ่นลอยแต่ build ไม่เข้า release (เป็น hardening) |
| `vulnerable-dep-reachable` | CVE ในแพ็กเกจที่โค้ดเรียกจริงด้วย input ภายนอก | ฟังก์ชันที่ประกาศใน advisory ถูก import และเรียก | ไล่ call path จาก route ถึงฟังก์ชันนั้น · ทำซ้ำด้วยตัวอย่างใน advisory ในห้อง | เรียกแค่ส่วนที่ไม่เกี่ยวกับช่องโหว่ |
| `build-context-leak` | ไฟล์ลับหรือ `.git` ติดเข้า image หรือ artifact | `COPY . .` โดยไม่มี `.dockerignore` · artifact รวมทั้งโฟลเดอร์ | build ในห้องแล้วดูไฟล์ใน image (`docker run --rm <img> ls -la`) | ไฟล์ที่ติดไปไม่มีของลับ |

## CI และงานอัตโนมัติ

| ประเภท (`class`) | ล่าอะไร | สัญญาณในโค้ด | พิสูจน์อย่างไร | มักแจ้งผิดเมื่อ |
|---|---|---|---|---|
| `ci-untrusted-code` | workflow ที่รันโค้ดจาก PR ของคนนอก ด้วยสิทธิ์หรือค่าลับของ repo | `pull_request_target` คู่กับ checkout `head.sha` · `workflow_run` ที่ใช้ artifact จาก PR | ไล่ว่าขั้นไหนรันโค้ดจาก PR และขั้นนั้นเห็น secret อะไร | repo เป็น private และคนเปิด PR ได้มีแต่ทีม (needs_validation จนยืนยันการตั้งค่า) |
| `ci-expression-injection` | ชื่อ branch หัว PR หรือ issue ไปลงคำสั่ง shell ตรง ๆ | `run: echo "${{ github.event.pull_request.title }}"` | ไล่ทุก `${{ github.event.* }}` ที่อยู่ใน `run:` | ค่าผ่าน `env:` แล้วอ้างเป็นตัวแปร shell ในเครื่องหมายคำพูด |
| `ci-cache-poisoning` | cache หรือ artifact ที่งานของ PR เขียนได้ ถูกงาน release อ่านต่อ | key ของ cache เหมือนกันทั้ง PR และ main | เทียบ key และ scope ของ cache ระหว่างงาน | แพลตฟอร์มแยก cache ตาม branch (ตรวจในเอกสารของแพลตฟอร์มรุ่นที่ใช้) |
| `ci-token-scope` | token ของ workflow มีสิทธิ์เขียนเกินงาน · ค่าลับพิมพ์ลง log | ไม่มีบล็อก `permissions:` · `echo $SECRET` · `set -x` | อ่าน workflow · ดูว่าค่าลับถูก mask หรือถูกแปลงจนหลุด mask | การตั้งค่าเริ่มของ org เป็นอ่านอย่างเดียว (needs_validation) |

## ปล่อยรุ่นและอัปเดต

| ประเภท (`class`) | ล่าอะไร | สัญญาณในโค้ด | พิสูจน์อย่างไร | มักแจ้งผิดเมื่อ |
|---|---|---|---|---|
| `release-substitution` | ของที่ทดสอบกับของที่ deploy เป็นคนละชิ้น · build ใหม่ตอน deploy | deploy สร้าง image ใหม่แทนใช้ digest ที่ test แล้ว | ไล่ว่า digest หรือ hash ส่งต่อระหว่างขั้นไหม | ใช้ digest เดิมตลอด |
| `update-integrity` | แอปดาวน์โหลดอัปเดตแล้วไม่ตรวจลายเซ็น · ยอมรุ่นเก่ากว่า | ดาวน์โหลดผ่าน HTTP · ตรวจแค่ checksum ที่มาจากที่เดียวกัน · ไม่เทียบเลขรุ่น | ป้อนไฟล์อัปเดตปลอมให้ตัวอัปเดตในห้อง | ใช้ระบบอัปเดตของ store หรือ OS ที่ตรวจลายเซ็นให้ |
| `plugin-trust` | plugin หรือ extension ที่โหลดได้ ได้สิทธิ์เท่าตัวแอปโดยไม่มีขอบเขต | `require(userPath)` · โหลด DLL จากโฟลเดอร์ที่ผู้ใช้เขียนได้ | วาง plugin ปลอมในห้องแล้วดูว่าเข้าถึงอะไรได้ | มีแต่แอดมินที่ติดตั้ง plugin ได้ และระบบประกาศไว้ |

## วิธีไล่ที่ใช้ได้ทั้งสาย

- วาดเส้นทางของโค้ดจาก commit → build → test → artifact → deploy · ทุกเส้นเขียนว่าใครเขียนได้ และขั้นถัดไปเชื่ออะไร
- นับทุกที่ที่ดึงของจากเน็ตตอน build และตอนรัน แล้วถามว่าถ้าปลายทางถูกเจาะ ได้อะไร
- เทียบสิทธิ์ของงานที่รันกับ PR และงานที่รันกับ main ต้องไม่มีของที่ไหลจากฝั่งแรกไปฝั่งหลังโดยไม่ตรวจ
