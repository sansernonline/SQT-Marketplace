# อัปเกรด framework ของระบบเก่า — playbook ต่อ stack

ใช้หลังมี as-is spec อย่างน้อยระดับ system map (Step 2) และ characterization test ของโมดูลที่แตะ (Step 3) — ไม่มี 2 อย่างนี้ การอัปเกรดคือการเดาว่าอะไรพัง

## ขั้นตอนเดียวกันทุก stack

1. **Inventory** — รุ่นปัจจุบันของ runtime · framework · ทุก dependency พร้อมรุ่น (ไฟล์ lock หรือ `packages.config` · `package.json` · `requirements.txt`) · ของที่ compile เอง (native · COM · plugin) · OS และเซิร์ฟเวอร์ที่รันอยู่ · ลงตารางเดียว
2. **Compatibility matrix** — แถวละ dependency: รุ่นเดิม · รุ่นที่รองรับเป้าหมาย · มีหรือไม่มี · ตัวแทนถ้าไม่มี · ป้าย `code` / `doc` / `ask` เหมือนกติกาของ skill นี้ · dependency ที่ไม่มีทางไป คือความเสี่ยงที่ต้องบอกเจ้าของก่อนเริ่ม
2.5. **Delta catalog** — แถวละ 1 ความต่างของรุ่น ที่โค้ดของเราชนจริง (ไม่ใช่ทุกข้อใน release notes) · คอลัมน์: รหัส (D-001) · หมวด (**API หาย** · **ผลเปลี่ยนเงียบ** · **ระบบ build** · **dependency**) · `ไฟล์:บรรทัด` ที่ชน · วิธีแก้ (กลไก = เครื่องมือแก้ได้ · ตัดสินใจ = ต้องถามคน) · test ที่ต้องเขียน **ก่อน** แตะ (บังคับสำหรับ "ผลเปลี่ยนเงียบ" เพราะ build ผ่านแต่ผลเปลี่ยน ไม่มี error บอก) · หมวดผลเปลี่ยนเงียบคือที่ที่ regression ซ่อน จึงไล่ให้ครบก่อนหมวดอื่น · เครื่องมือย้ายอัตโนมัติ (`ng update` · OpenRewrite · `pyupgrade` ฯลฯ) รันบนสำเนาเท่านั้น และในรายงานจดสถานะ 3 อย่างแยกกัน: **ติดตั้งแล้ว · รันได้ในเครื่องนี้ · รันจริงแล้ว** · ผลของเครื่องมือที่ไม่ได้รันห้ามใส่ในรายงาน (เรียบเรียงจาก version-delta-analyst ของ code-modernization · claude-plugins-official · Apache-2.0 · ดู 2026-11-10)
3. **Spike บน worktree** — แยก worktree ตาม `worktree-and-branch` แล้วลอง build บนเป้าหมายจนจบ 1 รอบโดยยังไม่แก้ logic · จด error ทุกตัวเป็นรายการ ไม่แก้ทีละตัวในรอบนี้ · ประเมินวันจากรายการนั้น ไม่ใช่จากความรู้สึก
4. **ย้ายให้ครบแล้วลบของเก่า** — `principle-replace-then-delete`: ไม่มี wrapper ชื่อเก่า ไม่มี flag สลับรุ่น · ย้ายทีละ project หรือ package เป็นขั้นที่ build ผ่าน (`principle-small-verifiable-steps`) · คนนอกเรียก API เดิม → deprecate ตาม `api-conventions`
5. **หลักฐาน regression** — characterization test ผ่านทั้งก่อนและหลัง · golden file ของรายงานและ stored procedure เทียบแล้วเท่ากัน (รัน `scripts/compare_outputs.py` แล้วแนบ `EQUIVALENCE.json` · คำสั่งและตัวอย่างอยู่ในหัวสคริปต์) · รันบนข้อมูลสำเนา ไม่ใช่ production · รายงานด้วย `status-report` พร้อมสิ่งที่ยังไม่ได้ทดสอบ · เพิ่ม 3 ข้อ:
   - **Canary ต่อโมดูล** — ในสำเนาโมดูล แก้ 1 บรรทัดที่สำคัญ (โหมดปัดเศษ · เกณฑ์ขยับ 1 หน่วย · เครื่องหมายเทียบ) แล้วรัน test ที่ครอบคลุม ต้องมี test ล้มจริง · ไม่ล้ม = test ชุดนั้นยังไม่ได้ป้องกันอะไร ไม่นับเป็นหลักฐาน
   - **อินพุตสด ≥ 10 ตัว** — คิดอินพุตใหม่ที่ตอนพัฒนาไม่เคยใช้ รวมขอบ: ศูนย์ · เกินเกณฑ์ 1 หน่วย · ค่ามากสุด · รันทั้งรุ่นเก่าและใหม่แล้วเทียบ
   - **baseline ต้องวัดจริง** — ตัวเลขของรุ่นเก่าต้องมีไฟล์ผลต่อ test เก็บไว้ (JUnit XML หรือ log ที่มีบรรทัดสรุป) ไม่ใช่ตารางที่จดมือ · ไม่ได้รัน = ไม่ผ่าน ไม่ใช่ข้าม (เรียบเรียงจาก modernize-verify · Apache-2.0 · ดู 2026-11-10)

## ต่อ stack (คู่มือทางการ · ตรวจว่าเปิดได้ 2026-10-23)

| stack | ทางที่ใช้ | กับดักที่เจอบ่อย | คู่มือ |
|---|---|---|---|
| .NET Framework → .NET 8 (หรือ LTS ล่าสุด) | ย้ายทีละ project จากใบล่างของ dependency graph ขึ้นบน · `packages.config` → PackageReference ก่อน · เช็ค API ที่ไม่มีใน .NET (WCF server · Web Forms · AppDomain · Remoting) | **ผลเปลี่ยนเงียบ:** .NET ใช้ ICU แทน NLS ในการเรียงลำดับ ทำให้ `string.Compare` และ `OrderBy` ของข้อความไทยเรียงไม่เหมือนเดิม (เกิดบน Linux · Windows รุ่นใหม่ก็ใช้ ICU ได้) · encoding เริ่มต้น (cp874 ไม่มีให้โดยไม่ลงทะเบียน provider) · ค่าเริ่มต้นของ TLS · `DateTime` กับ timezone และปีใน `ThaiBuddhistCalendar` · ต้องเขียน test ก่อนย้ายทุกจุดที่เรียงหรือเทียบข้อความไทย (ยังไม่ได้ตรวจกับ learn.microsoft.com รอบนี้) · Web Forms ไม่มีทางไปตรง ต้องเขียนหน้าใหม่ · `System.Drawing` บน Linux · `ConfigurationManager` → `appsettings.json` · Upgrade Assistant ถูก deprecate แล้ว Microsoft ชี้ไปที่ GitHub Copilot app modernization — ถ้าไม่มีสิทธิ์ใช้ ให้ทำมือตามคู่มือ | learn.microsoft.com/dotnet/core/porting (อัปเดต 2026-08-04) |
| Angular major | `ng update @angular/core@<N> @angular/cli@<N>` **ทีละ major** ตามที่ Angular ระบุ · ใช้ Update Guide สร้างรายการขั้นตอนจากรุ่นต้นถึงรุ่นปลาย | AngularJS (1.x) ไม่ใช่ Angular — ต้องเขียนใหม่หรือ ngUpgrade · library ภายนอกที่หยุดดูแล · Angular รองรับแต่ละ major 24 เดือน (active 12 + LTS 12) | angular.dev/update-guide · angular.dev/reference/releases |
| Python 2 → 3 แล้ว Django LTS | ทำ coverage ก่อน → `pyupgrade` (แก้ระดับ source) แล้วอ่านผลต่างทีละไฟล์ → `pylint --py3k` กันถอยหลัง → ขึ้น 3 แล้วค่อยไล่ Django ทีละรุ่น (2.2 → 3.2 → 4.2 → LTS ปัจจุบัน) รัน `python -Wa manage.py test` ล้าง deprecation ก่อนข้ามแต่ละรุ่น | bytes กับ str · การหารจำนวนเต็ม · `2to3` ถูกถอดจาก Python 3.13 และ `python-modernize` ไม่มีคนดูแลแล้ว ไม่ควรพึ่ง (ตามเอกสาร version-delta-analyst ดู 2026-11-10 · ยังไม่ได้ตรวจกับ docs.python.org) · คู่มือ porting ของ Python ถูกเลิกตั้งแต่ 3.11 ต้องอ่านฉบับ 3.10 | docs.python.org/3.10/howto/pyporting.html · docs.djangoproject.com/en/stable/howto/upgrade-version |
| Node LTS | ขึ้นทีละสาย LTS (เลขคู่) · รัน test บนรุ่นใหม่ด้วย `nvm` หรือ container ก่อนเปลี่ยน `engines` · `npm outdated` แล้วไล่ major ของ dependency ที่ผูกกับ Node ABI (native addon) ก่อน | native addon ที่ไม่มี build ให้รุ่นใหม่ · `node-sass` → `sass` · OpenSSL 3 ทำให้ hash หรือ cipher เก่า error · ดูวันหมดอายุของแต่ละสายจากหน้า releases | nodejs.org/en/about/previous-releases |

ทุกแถว: อ่าน breaking changes ของ**ทุกรุ่นที่ข้าม** ไม่ใช่เฉพาะรุ่นปลายทาง

## ห้าม

- อัปเกรดกับแก้ฟีเจอร์ในชุดเดียวกัน — ถ้าพัง ไม่รู้ว่าเพราะอะไร
- เปลี่ยน ORM · UI framework · โครงโฟลเดอร์ "ถือโอกาส" ระหว่างอัปเกรด → เป็นงานถัดไปหลัง regression ผ่าน
- บอกว่าเสร็จเพราะ build ผ่าน — ต้องมีข้อ 5
