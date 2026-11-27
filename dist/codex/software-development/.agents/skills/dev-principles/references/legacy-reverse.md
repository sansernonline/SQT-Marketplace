# หลักคิด · ทำความเข้าใจระบบที่ไม่มีเอกสารหรือไม่มีซอร์ส: กู้สเปกจากระบบเก่า แกะระบบย้อนกลับ (reverse engineering) และอัปเกรดเฟรมเวิร์กอย่างปลอดภัย
> สิ่งที่สรุปได้ว่าระบบทำอะไร ต้องชี้หลักฐานได้ทุกข้อ ส่วนการแก้หรือย้ายระบบต้องทำทีละชิ้น โดยระบบเดิมยังใช้งานได้ระหว่างทาง และทำเฉพาะงานที่มีสิทธิ์ทำ

## งานดีคืออะไร
1. **จับพฤติกรรมปัจจุบันไว้ด้วยเทสต์ก่อนแก้อะไร** — เทสต์แบบบันทึกพฤติกรรม (characterization test) จดว่าโค้ดทำอะไรอยู่ ไม่ได้จดว่าควรทำอะไร พฤติกรรมเปลี่ยนเมื่อไรเทสต์จะฟ้องทันที เรื่องนี้สำคัญที่สุดตอนอัปเกรดเฟรมเวิร์กหรือ ORM ซึ่งมักเปลี่ยนพฤติกรรมแบบสังเกตยาก · ตรวจด้วยตา: ก่อน commit แรกที่ refactor หรืออัปเกรด มีเทสต์ที่ยืนยันผลจริงที่เห็นอยู่แล้ว รวมถึงผลที่ดูเหมือนบั๊ก และผลแบบนั้นมีหมายเหตุกำกับ (S1, S2, S3)
2. **กฎทุกข้อที่กู้ได้ต้องชี้กลับไปที่โค้ดหรือข้อมูล เอกสารเก่าและบทสรุปจาก AI เป็นแค่เบาะแส** — เอกสารเก่ามักล้าสมัย และคำอธิบายจาก AI ก็มักคลาดเคลื่อน จึงต้องเทียบกับโค้ดทุกครั้ง · ตรวจด้วยตา: กฎทุกข้อในสเปกระบบปัจจุบัน (as-is spec) อ้างไฟล์และบรรทัด คิวรี ตาราง หรือผลที่บันทึกไว้ ข้อที่ยังไม่มีหลักฐานติดป้าย "ยังไม่ยืนยัน" (S4, S5, S6)
3. **กู้เฉพาะสิ่งที่ผู้ใช้ยังต้องใช้ ไม่ต้องลอกทุกฟีเจอร์ของระบบเก่า** — ระบบเก่ามีฟีเจอร์ที่ไม่มีใครใช้แล้วและขั้นตอนที่ล้าสมัยติดมาด้วย ถ้าจะเก็บให้ครบทุกฟังก์ชันจะเป็นงานใหญ่มาก และมักจบที่การเปลี่ยนทั้งระบบในครั้งเดียว · ตรวจด้วยตา: รายการฟีเจอร์ของระบบเดิมบอกทุกข้อว่ายังใช้หรือยังต้องการอยู่ไหม และช่วยผลลัพธ์ทางธุรกิจข้อใด (S7, S8, S9)
4. **เปลี่ยนทีละส่วนผ่านจุดคั่น (seam หรือ facade) และเก็บระบบเดิมไว้เป็นทางสำรองจนกว่าส่วนใหม่จะผ่านการตรวจ** — การเขียนใหม่ทั้งระบบในครั้งเดียวมักล้มเหลว การเปลี่ยนทีละส่วนลดความเสี่ยง และจะย้อนกลับได้ก็ต่อเมื่อส่วนเดิมยังอยู่ · ตรวจด้วยตา: มีจุดที่ใช้สลับเส้นทางระหว่างของเก่ากับของใหม่ ทุกส่วนมีการตรวจว่าผลตรงกันก่อนสลับจริง และลบของเดิมหลังตรวจผ่านแล้วเท่านั้น (S8, S9, S10)
5. **อัปเกรดทีละรุ่นหลัก เคลียร์คำเตือน API ที่เลิกใช้ (deprecation) ให้หมด และอ่านรายการที่เปลี่ยนแบบทำให้ของเดิมพัง (breaking change) ของทุกรุ่นที่ข้าม** — API ที่ถูกประกาศเลิกใช้จะถูกลบในรุ่นหลักถัดไป ก้าวเล็ก ๆ ทำให้รับมือการเปลี่ยนของแต่ละรุ่นได้ครบก่อนไปต่อ · ตรวจด้วยตา: แผนระบุทุกรุ่นที่ต้องผ่าน (เช่นขึ้น 2.7.x ล่าสุดก่อนไป 3.0) คำเตือนเลิกใช้เหลือศูนย์ก่อนขึ้นรุ่นหลัก และทุกก้าวมีลิงก์บันทึกการเปลี่ยนแปลงของรุ่นนั้น (S3, S11, S12)
6. **แกะระบบย้อนกลับเฉพาะเมื่อได้สำเนามาอย่างถูกต้อง ทำเพื่อเป้าหมายที่ระบุไว้ (ให้ระบบทำงานร่วมกันได้ หรือวิจัยความปลอดภัยโดยสุจริต) และใช้สิ่งที่ได้เพื่อเป้าหมายนั้นเท่านั้น** — ข้อยกเว้นทางกฎหมายทั้งของสหภาพยุโรปและสหรัฐฯ แคบ ห้ามเอาข้อมูลไปใช้เป้าหมายอื่น ห้ามส่งต่อ และห้ามใช้สร้างโปรแกรมที่คล้ายกันมาก ข้อยกเว้นเพื่อวิจัยความปลอดภัยของสหรัฐฯ ก็ไม่ได้คุ้มครองจากกฎหมายอื่น · ตรวจด้วยตา: มีบันทึกว่าใครอนุญาต ได้สำเนาหรืออุปกรณ์มาอย่างไร ทำเพื่ออะไร และขอบเขตจำกัดแค่ส่วนที่จำเป็น การทดสอบทำในสภาพแวดล้อมที่ไม่ทำให้ใครเสียหาย (S13, S14, S15) · เป็นหลักทั่วไป ไม่ใช่คำปรึกษากฎหมาย

## พลาดบ่อย
- refactor หรืออัปเกรดโดยไม่มีเทสต์จับพฤติกรรมเดิม → พฤติกรรมเปลี่ยนโดยไม่มีใครรู้ ต้องไล่ตรวจด้วยมือทุกจุด (S1, S3)
- ถือเอกสารเก่าหรือบทสรุปจาก AI เป็นสเปก → กฎที่ไม่มีอยู่จริงและตำแหน่งไฟล์ผิดหลุดเข้าไปในระบบใหม่ (S5, S6)
- สัญญาว่า "ได้เหมือนที่ใช้อยู่ทุกอย่าง" → งานเก็บข้อมูลระบบเดิมบานปลาย ต้องเปลี่ยนทั้งระบบทีเดียว และสร้างฟีเจอร์ที่ไม่มีใครใช้ขึ้นมาใหม่ (S7, S9)
- เขียนใหม่ทั้งระบบแทนการค่อย ๆ แทนที่ทีละส่วน (strangler fig) → มักล้มเหลว และผู้ใช้รอนานกว่าจะได้ประโยชน์ (S8, S10)
- กระโดดข้ามหลายรุ่นหลักในครั้งเดียว หรือข้ามคำเตือนเลิกใช้ → API ที่ถูกลบและ dependency ที่ชนกันทำให้ build พัง (S11, S3)
- ลบตารางหรือโค้ดเดิมก่อนส่วนใหม่ผ่านการตรวจ → จะย้อนกลับต้องกู้ object และเล่นข้อมูลซ้ำ ใช้แรงและเสี่ยงกว่ามาก (S10)
- แกะเกินกว่าที่จำเป็นต่อการทำงานร่วมกัน ส่งต่อสิ่งที่พบ หรือพึ่งข้อยกเว้นข้อเดียว → เสี่ยงละเมิดลิขสิทธิ์หรือผิดกฎหมายอื่น (S14, S15)

## ใช้คู่กับ
skills: `legacy-spec-recovery` · `reverse-engineering` · `code-craft` · `test-automation` · `requirements-writing` · playbook: `investigation` · `refactor` · `project-docs`

## Sources (checked 2026-11-27)
- S1 · The regression tests nobody writes: capturing how software actually behaves, Stack Overflow Blog (2026-10-22) · https://stackoverflow.blog/2026/10/22/the-regression-tests-nobody-writes-capturing-how-software-actually-behaves/ · หลัก 1
- S2 · Legacy Seam, Martin Fowler · https://martinfowler.com/bliki/LegacySeam.html · หลัก 1, 4
- S3 · Upgrading Ruby on Rails, Rails Guides · https://guides.rubyonrails.org/upgrading_ruby_on_rails.html · หลัก 1, 5
- S4 · Legacy Modernization meets GenAI, martinfowler.com (Thoughtworks) · https://martinfowler.com/articles/legacy-modernization-gen-ai.html · หลัก 2
- S5 · Onboarding to a "legacy" codebase with the help of AI, martinfowler.com · https://martinfowler.com/articles/exploring-gen-ai/09-ai-help-onboarding-codebase.html · หลัก 2
- S6 · Using GenAI to understand legacy codebases, Thoughtworks Technology Radar · https://www.thoughtworks.com/radar/techniques/using-genai-to-understand-legacy-codebases · หลัก 2
- S7 · Legacy migration feature parity (Hold), Thoughtworks Technology Radar · https://www.thoughtworks.com/radar/techniques/legacy-migration-feature-parity · หลัก 3
- S8 · Strangler Fig Application, Martin Fowler · https://martinfowler.com/bliki/StranglerFigApplication.html · หลัก 3, 4
- S9 · Patterns of Legacy Displacement, martinfowler.com · https://martinfowler.com/articles/patterns-legacy-displacement/ · หลัก 3, 4
- S10 · Strangler Fig pattern, Microsoft Learn (Azure Architecture Center) · https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig · หลัก 4
- S11 · Spring Boot 3.0 Migration Guide, spring-projects (GitHub wiki) · https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide · หลัก 5
- S12 · Upgrade .NET apps overview, Microsoft Learn · https://learn.microsoft.com/en-us/dotnet/core/porting/ · หลัก 5
- S13 · 17 U.S.C. § 1201(f) reverse engineering, Cornell LII · https://www.law.cornell.edu/uscode/text/17/1201 · หลัก 6
- S14 · Directive 2009/24/EC Article 6 (decompilation), legislation.gov.uk · https://www.legislation.gov.uk/eudr/2009/24/article/6 · หลัก 6
- S15 · 37 CFR 201.40(b)(18) good-faith security research, Cornell LII · https://www.law.cornell.edu/cfr/text/37/201.40 · หลัก 6
