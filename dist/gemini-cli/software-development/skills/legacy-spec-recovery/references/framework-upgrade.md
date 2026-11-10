# อัปเกรด framework ของระบบเก่า — playbook ต่อ stack

ใช้หลังมี as-is spec อย่างน้อยระดับ system map (Step 2) และ characterization test ของโมดูลที่แตะ (Step 3) — ไม่มี 2 อย่างนี้ การอัปเกรดคือการเดาว่าอะไรพัง

## ขั้นตอนเดียวกันทุก stack

1. **Inventory** — รุ่นปัจจุบันของ runtime · framework · ทุก dependency พร้อมรุ่น (ไฟล์ lock หรือ `packages.config` · `package.json` · `requirements.txt`) · ของที่ compile เอง (native · COM · plugin) · OS และเซิร์ฟเวอร์ที่รันอยู่ · ลงตารางเดียว
2. **Compatibility matrix** — แถวละ dependency: รุ่นเดิม · รุ่นที่รองรับเป้าหมาย · มีหรือไม่มี · ตัวแทนถ้าไม่มี · ป้าย `code` / `doc` / `ask` เหมือนกติกาของ skill นี้ · dependency ที่ไม่มีทางไป คือความเสี่ยงที่ต้องบอกเจ้าของก่อนเริ่ม
3. **Spike บน worktree** — แยก worktree ตาม `worktree-and-branch` แล้วลอง build บนเป้าหมายจนจบ 1 รอบโดยยังไม่แก้ logic · จด error ทุกตัวเป็นรายการ ไม่แก้ทีละตัวในรอบนี้ · ประเมินวันจากรายการนั้น ไม่ใช่จากความรู้สึก
4. **ย้ายให้ครบแล้วลบของเก่า** — `principle-replace-then-delete`: ไม่มี wrapper ชื่อเก่า ไม่มี flag สลับรุ่น · ย้ายทีละ project หรือ package เป็นขั้นที่ build ผ่าน (`principle-small-verifiable-steps`) · คนนอกเรียก API เดิม → deprecate ตาม `api-conventions`
5. **หลักฐาน regression** — characterization test ผ่านทั้งก่อนและหลัง · golden file ของรายงานและ stored procedure เทียบแล้วเท่ากัน · รันบนข้อมูลสำเนา ไม่ใช่ production · รายงานด้วย `status-report` พร้อมสิ่งที่ยังไม่ได้ทดสอบ

## ต่อ stack (คู่มือทางการ · ตรวจว่าเปิดได้ 2026-10-23)

| stack | ทางที่ใช้ | กับดักที่เจอบ่อย | คู่มือ |
|---|---|---|---|
| .NET Framework → .NET 8 (หรือ LTS ล่าสุด) | ย้ายทีละ project จากใบล่างของ dependency graph ขึ้นบน · `packages.config` → PackageReference ก่อน · เช็ค API ที่ไม่มีใน .NET (WCF server · Web Forms · AppDomain · Remoting) | Web Forms ไม่มีทางไปตรง ต้องเขียนหน้าใหม่ · `System.Drawing` บน Linux · `ConfigurationManager` → `appsettings.json` · Upgrade Assistant ถูก deprecate แล้ว Microsoft ชี้ไปที่ GitHub Copilot app modernization — ถ้าไม่มีสิทธิ์ใช้ ให้ทำมือตามคู่มือ | learn.microsoft.com/dotnet/core/porting (อัปเดต 2026-08-04) |
| Angular major | `ng update @angular/core@<N> @angular/cli@<N>` **ทีละ major** ตามที่ Angular ระบุ · ใช้ Update Guide สร้างรายการขั้นตอนจากรุ่นต้นถึงรุ่นปลาย | AngularJS (1.x) ไม่ใช่ Angular — ต้องเขียนใหม่หรือ ngUpgrade · library ภายนอกที่หยุดดูแล · Angular รองรับแต่ละ major 24 เดือน (active 12 + LTS 12) | angular.dev/update-guide · angular.dev/reference/releases |
| Python 2 → 3 แล้ว Django LTS | ทำ coverage ก่อน → `futurize` หรือ `modernize` → `pylint --py3k` กันถอยหลัง → ขึ้น 3 แล้วค่อยไล่ Django ทีละรุ่น (2.2 → 3.2 → 4.2 → LTS ปัจจุบัน) รัน `python -Wa manage.py test` ล้าง deprecation ก่อนข้ามแต่ละรุ่น | bytes กับ str · การหารจำนวนเต็ม · `2to3` ถูกถอดจาก Python 3.13 (ยังไม่ได้ตรวจ) · คู่มือ porting ของ Python ถูกเลิกตั้งแต่ 3.11 ต้องอ่านฉบับ 3.10 | docs.python.org/3.10/howto/pyporting.html · docs.djangoproject.com/en/stable/howto/upgrade-version |
| Node LTS | ขึ้นทีละสาย LTS (เลขคู่) · รัน test บนรุ่นใหม่ด้วย `nvm` หรือ container ก่อนเปลี่ยน `engines` · `npm outdated` แล้วไล่ major ของ dependency ที่ผูกกับ Node ABI (native addon) ก่อน | native addon ที่ไม่มี build ให้รุ่นใหม่ · `node-sass` → `sass` · OpenSSL 3 ทำให้ hash หรือ cipher เก่า error · ดูวันหมดอายุของแต่ละสายจากหน้า releases | nodejs.org/en/about/previous-releases |

ทุกแถว: อ่าน breaking changes ของ**ทุกรุ่นที่ข้าม** ไม่ใช่เฉพาะรุ่นปลายทาง

## ห้าม

- อัปเกรดกับแก้ฟีเจอร์ในชุดเดียวกัน — ถ้าพัง ไม่รู้ว่าเพราะอะไร
- เปลี่ยน ORM · UI framework · โครงโฟลเดอร์ "ถือโอกาส" ระหว่างอัปเกรด → เป็นงานถัดไปหลัง regression ผ่าน
- บอกว่าเสร็จเพราะ build ผ่าน — ต้องมีข้อ 5
