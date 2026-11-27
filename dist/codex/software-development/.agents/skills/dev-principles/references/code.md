# หลักคิด · การเขียนโค้ด
> โค้ดต้องง่ายต่อการอ่าน แก้ และไว้ใจได้ โดยคนที่มาดูทีหลังเข้าใจได้โดยไม่ต้องถามผู้เขียน

หลักที่มี skill เป็นเจ้าของอยู่แล้ว ไม่ซ้ำที่นี่: รูปข้อมูลก่อน `code-craft` · แทนที่ก่อนลบ `code-craft` · รันซ้ำได้ปลอดภัย `code-craft` · ปลอดภัยเป็นค่าเริ่มต้น `security-gate` · เขียนเท่าที่จำเป็น `code-craft` · อ่านง่าย `code-craft`. ไฟล์นี้เพิ่มเฉพาะส่วนที่ skill เหล่านั้นไม่ครอบคลุม

## งานดีคืออะไร
1. **หนึ่งการเปลี่ยนแปลง หนึ่งเป้าหมาย และแยกการจัดโครงสร้างใหม่ออกจากการเพิ่มพฤติกรรม** — ชุดเล็กถูกตรวจเร็วและละเอียดกว่า มีบั๊กน้อยกว่า และย้อนกลับง่ายกว่า · ตรวจด้วยตา: สรุปการเปลี่ยนแปลงได้ในประโยคเดียว และ diff ไม่ปนการย้ายหรือเปลี่ยนชื่อกับการแก้ตรรกะ (S1, S2, S3)
2. **ทุกการเปลี่ยนแปลงมีคนอื่นอ่านก่อนเข้าสายหลัก และตัดสินจากว่าโค้ดดีขึ้นหรือไม่ ไม่รอให้สมบูรณ์แบบ** — การตรวจได้ทั้งจับข้อบกพร่องและถ่ายทอดความรู้ และคนคนเดียวเขียนแล้วดันขึ้นระบบจริงเองเป็นความเสี่ยง · ตรวจด้วยตา: ประวัติการ merge ทุกรายการมีผู้ตรวจที่ไม่ใช่ผู้เขียน (S4, S5, S6)
3. **ให้เครื่องมือบังคับสไตล์ ไม่ใช่คนเถียงกันในรีวิว** — คู่มือสไตล์ที่ระบุไว้เป็นข้อสรุป ส่วนที่ไม่ได้ระบุเป็นความชอบส่วนตัว ตัวจัดรูปแบบอัตโนมัติตัดการเถียงออก · ตรวจด้วยตา: ไม่มีความเห็นรีวิวเรื่องเว้นวรรค ย่อหน้า หรือลำดับ import เพราะเครื่องจัดให้แล้ว (S4, S7, S8, S9)
4. **เจอข้อผิดพลาดที่จุดเกิด จัดการเฉพาะที่แก้ได้ ที่เหลือปล่อยให้ล้มอย่างชัดเจน** — ระบบที่ล้มชัดวินิจฉัยง่ายกว่าระบบที่ทำงานต่อด้วยสถานะไม่แน่นอน · ตรวจด้วยตา: ไม่มี catch ว่างหรือ catch กว้างที่กลืนข้อผิดพลาด ข้อความ error บอกว่าอะไรผิดโดยไม่เปิดรายละเอียดภายในให้ผู้ใช้ (S10, S11, S12)
5. **เงิน เวลา และข้อความใช้ชนิดข้อมูลและรูปแบบมาตรฐาน** — ทศนิยมแบบไบนารีแทนเศษทศนิยมบางค่าไม่ได้ ยอดจึงเพี้ยนสะสม และเวลาที่ไม่มีโซนเวลาเทียบหรือเรียงไม่ได้ · ตรวจด้วยตา: จำนวนเงินใช้ชนิดทศนิยมแบบฐานสิบหรือจำนวนเต็มหน่วยย่อย เวลาเก็บเป็น Coordinated Universal Time (UTC) ตามรูปแบบ Request for Comments (RFC) 3339 และเหตุการณ์ในอนาคตเก็บรหัสโซนเวลาไว้ด้วย · **เฉพาะไทย**: RFC 3339 กำหนดปีคริสต์ศักราช จึงเก็บแบบนั้น แล้วแปลงเป็น พ.ศ. ตอนแสดงผล ซึ่งมาตรฐาน Unicode ตั้งปฏิทินพุทธเป็นค่าแสดงผลเริ่มต้นของไทย (S13, S14, S15, S16)
6. **เพิ่ม dependency เมื่อคุ้มกว่าเขียนเอง และตรวจก่อนเสมอ** — ทุกไลบรารีคือความเสี่ยงที่รับมาทั้งชุด รวมของที่มันดึงตามมา · ตรวจด้วยตา: ทุก dependency ใหม่มีเหตุผลใน change นั้น ดูแลอยู่ มี license ชัด ไม่มีช่องโหว่ค้างนาน และใช้เฉพาะส่วนที่จำเป็น (S6, S17, S18)
7. **เขียนให้ทดสอบได้ ด้วยการแยกสิ่งที่ไม่แน่นอนออกจากตรรกะ** — นาฬิกา เครือข่าย และสุ่ม ทำให้ผลต่างกันทุกรอบ เมื่อแยกเป็นช่องสลับได้ การทดสอบจึงนิ่ง · ตรวจด้วยตา: ตรรกะธุรกิจรับเวลาและ dependency เข้ามาจากข้างนอก ไม่เรียกนาฬิการะบบหรือบริการภายนอกตรงๆ ในตรรกะ (S19, S20, S21)

## พลาดบ่อย
- ผสม refactor กับฟีเจอร์ในการเปลี่ยนครั้งเดียว → ตรวจไม่ละเอียด ย้อนกลับยาก (S1)
- catch แล้วเงียบ หรือ log แล้วทำต่อ → ระบบพังโดยไม่มีใครรู้ หาสาเหตุไม่เจอ (S10, S11)
- ใช้ float คำนวณเงิน หรือเก็บเวลาท้องถิ่นเป็นข้อความไม่มีโซน → ยอดไม่ลงตัว เวลาเลื่อนข้ามฤดูหรือข้ามประเทศ (S13, S15)
- ปล่อยให้รีวิวเป็นที่เถียงเรื่องสไตล์ → งานช้า ประเด็นสำคัญถูกมองข้าม (S4, S8)
- เพิ่มไลบรารีทั้งตัวเพื่อฟังก์ชันเล็กๆ → พื้นผิวโจมตีและภาระอัปเกรดโตเกินประโยชน์ (S6, S17)
- เรียกเวลาปัจจุบันหรือเรียกเครือข่ายตรงในตรรกะ → เทสต์ผ่านบ้างล้มบ้างจนไม่มีใครเชื่อ (S19, S20)

## ใช้คู่กับ
skills: `code-craft` · `security-gate` · `git-and-review` · `errors-and-logs` · `web-service-essentials` · `test-automation` · `stack-typescript` · `stack-python` · `stack-dotnet` · `stack-sql` · `stack-mql` · `project-bootstrap` · playbook: `feature` · `bug-fix` · `refactor` · `review` · `housekeeping`

## Sources (checked 2026-11-27)
- S1 · Small CLs, Google Engineering Practices · https://google.github.io/eng-practices/review/developer/small-cls.html · หลัก 1 (ชุดเล็ก แยก refactor)
- S2 · Working in small batches, DevOps Research and Assessment (DORA) · https://dora.dev/capabilities/working-in-small-batches/ · หลัก 1
- S3 · Continuous Integration, Martin Fowler · https://martinfowler.com/articles/continuousIntegration.html · หลัก 1
- S4 · The Standard of Code Review, Google Engineering Practices · https://google.github.io/eng-practices/review/reviewer/standard.html · หลัก 2, 3
- S5 · Expectations, Outcomes, and Challenges of Modern Code Review, Microsoft Research · https://www.microsoft.com/en-us/research/publication/expectations-outcomes-and-challenges-of-modern-code-review/ · หลัก 2
- S6 · A03:2025 Software Supply Chain Failures, Open Worldwide Application Security Project (OWASP) Top 10:2025 · https://top10.owasp.org/2025/A03_2025-Software_Supply_Chain_Failures/ · หลัก 2, 6
- S7 · What to look for in a code review, Google Engineering Practices · https://google.github.io/eng-practices/review/reviewer/looking-for.html · หลัก 3
- S8 · Why Prettier, Prettier docs · https://prettier.io/docs/why-prettier · หลัก 3
- S9 · The Black code style, Black docs · https://black.readthedocs.io/en/stable/the_black_code_style/index.html · หลัก 3 (รูปแบบคงที่)
- S10 · Best practices for exceptions, Microsoft Learn · https://learn.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions · หลัก 4
- S11 · A10:2025 Mishandling of Exceptional Conditions, OWASP Top 10:2025 · https://top10.owasp.org/2025/A10_2025-Mishandling_of_Exceptional_Conditions/ · หลัก 4
- S12 · Error Handling Cheat Sheet, OWASP · https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html · หลัก 4
- S13 · decimal, Python documentation · https://docs.python.org/3/library/decimal.html · หลัก 5 (เงิน)
- S14 · RFC 3339 Date and Time on the Internet, IETF · https://www.rfc-editor.org/rfc/rfc3339.html · หลัก 5 (เวลา)
- S15 · Working with Time Zones, W3C Internationalization · https://www.w3.org/International/wiki/WorkingWithTimeZones · หลัก 5
- S16 · Unicode LDML Dates (TR35), Unicode Consortium · https://unicode.org/reports/tr35/tr35-dates.html · หลัก 5 (ไทยใช้ปฏิทินพุทธเป็นค่าแสดงผลเริ่มต้น)
- S17 · Our Software Dependency Problem, Russ Cox · https://research.swtch.com/deps · หลัก 6
- S18 · Concise Guide for Evaluating Open Source Software, OpenSSF · https://best.openssf.org/Concise-Guide-for-Evaluating-Open-Source-Software · หลัก 6
- S19 · Eradicating Non-Determinism in Tests, Martin Fowler · https://martinfowler.com/articles/nonDeterminism.html · หลัก 7
- S20 · Test Doubles, Software Engineering at Google (บทที่ 13) · https://abseil.io/resources/swe-book/html/ch13.html · หลัก 7
- S21 · The Practical Test Pyramid, Martin Fowler · https://martinfowler.com/articles/practical-test-pyramid.html · หลัก 7 (แยกบริการภายนอกด้วย stub)
