# หลักคิด · งาน LINE Official Account และแชตบอท (เก็บผู้ติดตาม ส่งข้อความ แบ่งกลุ่ม ส่งต่อให้คน)
> LINE Official Account (LINE OA) ที่ดีทำให้ลูกค้าได้ข้อความที่เขาอนุญาต เกี่ยวกับเขา ในจังหวะที่ไม่รำคาญ และถ้าบอทช่วยไม่ได้ ก็ถึงมือคนได้ทันที โดยร้านไม่ละเมิดความยินยอมของลูกค้า

## งานดีคืออะไร
1. **ขอความยินยอมทำการตลาดแยกจากการให้บริการ และไม่ติ๊กไว้ล่วงหน้า (เฉพาะไทย)** — ร่างแนวปฏิบัติ พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (Personal Data Protection Act: PDPA) ให้แยกความยินยอมการตลาดจากบริการหลัก ลูกค้าที่ปฏิเสธต้องไม่เสียสิทธิซื้อ ความยินยอมและวัตถุประสงค์ของการส่งข้อความต้องชัดเจนตาม PDPA · ตรวจด้วยตา: หน้าสมัครหรือข้อความต้อนรับบอกชัดว่าจะส่งโปรโมชันและให้เลือกเอง ไม่มีช่องที่ถูกติ๊กมาให้ (S1, S2, S3)
2. **ถอนความยินยอมและขอเลิกรับต้องทำได้ง่ายเท่าตอนเข้ามา (เฉพาะไทย)** — ผู้เป็นเจ้าของข้อมูลมีสิทธิตาม PDPA ขอให้หยุดใช้ข้อมูลเพื่อการตลาดหรือขอให้ลบข้อมูลได้ · ตรวจด้วยตา: ลูกค้าพิมพ์คำเดียวหรือกดเมนูแล้วหยุดรับโปรโมชันได้ และมีคนตรวจว่ารายชื่อถูกถอดจริง (S1, S2, S3)
3. **แยกข้อความแจ้งสถานะออเดอร์ออกจากข้อความโปรโมต** — ข้อความแจ้งสถานะควรแจ้งข้อมูลอย่างเดียว ไม่ปนการตลาด ให้ทำตามกติกาปัจจุบันของ LINE (ดู skill `line-oa-setup`) · ตรวจด้วยตา: ข้อความยืนยันออเดอร์ เลขพัสดุ ไม่มีคูปองหรือคำชวนซื้อปนอยู่ (S3, S1, S2)
4. **ความถี่ในการส่งต้องวัดจากความรำคาญของผู้รับและต้นทุนต่อข้อความ ไม่ใช่จากความอยากขายของร้าน** — ผู้ซื้อออนไลน์จำนวนมากเลิกรับเพราะข้อความถี่เกินไป และ LINE คิดต้นทุนการส่งตามจำนวนผู้รับ ดูกติกาและโควตาล่าสุดใน `line-broadcast` และ `line-oa-setup` · ตรวจด้วยตา: มีตัวเลขคนบล็อกหรือเลิกรับหลังแต่ละรอบส่ง และไม่ส่งซ้ำเนื้อหาเดิมให้คนที่ยังไม่เปิด (S4, S5, S6)
5. **แบ่งกลุ่มผู้รับตามสิ่งที่เขาทำหรือสนใจ แล้วส่งให้ตรงกลุ่ม** — ข้อมูลของ Mailchimp ระบุว่าแคมเปญที่แบ่งกลุ่มได้คลิกสูงกว่า และกลุ่มตามความสนใจเลิกรับต่ำกว่า เนื้อหาไม่ตรงเป็นเหตุเลิกรับที่พบบ่อย · ตรวจด้วยตา: ข้อความแต่ละรอบระบุได้ว่าส่งถึงกลุ่มไหน เพราะเหตุใด ไม่ใช่ส่งทุกคนเหมือนกัน (S7, S8, S5, S4)

## พลาดบ่อย
- ใส่เบอร์หรือไลน์ของลูกค้าเข้ากลุ่มโปรโมชันโดยไม่ได้ขอ หรือซื้อรายชื่อมา → ผิดหลักความยินยอมตาม PDPA เสี่ยงโทษตามกฎหมาย (S2, S1)
- ส่งโปรโมชันทุกวันให้ทุกคน → คนบล็อกและเลิกรับเพิ่ม และต้นทุนการส่งสูงขึ้น (S4, S5, S6)
- ใช้ข้อความแจ้งสถานะออเดอร์ส่งโฆษณาแฝง → เสี่ยงถูกจำกัดหรือปิดช่องทาง (S3)

## ใช้คู่กับ
skills: `line-oa-setup` · `line-chatbot` · `line-broadcast` · `chat-reply-templates` · `pdpa-workflow` · playbook: `line-oa` · `pdpa-setup`

## Sources (checked 2026-11-27)
- S1 · Thailand Releases New Draft PDPA Guidance on Lawful Bases and Marketing, Tilleke & Gibbins (7 ก.ค. 2569 ร่างเท่านั้น ยังไม่บังคับ) · https://www.tilleke.com/insights/thailand-releases-new-draft-pdpa-guidance-on-lawful-bases-and-marketing · หลัก 1, 2, 3, 5
- S2 · E-Commerce Law Part 3: Direct Sales, Consumer Protection and PDPA in Thailand, Mondaq · https://www.mondaq.com/advertising-marketing-branding/1372024/e-commerce-law-direct-sales-and-marketing-act-consumer-protection-act-and-personal-data-act-thailand-part-3-of-a-3-part-series · หลัก 1, 2, 3 (โทษปรับสูงสุด 1 ล้านบาท จำคุก 1 ปี ตาม PDPA)
- S3 · LINE Official Account compliance guidelines, Infobip · https://infobip.com/docs/line/compliance-guidelines · หลัก 1, 2, 3
- S4 · Newsletter Frequency, Baymard Institute (ธ.ค. 2565 ผู้ซื้อสหรัฐ) · https://baymard.com/research-articles/newsletter-frequency · หลัก 4, 5 (ผู้ซื้อเลิกรับเพราะถี่)
- S5 · How many marketing emails is too many, Mailjet · https://www.mailjet.com/blog/email-best-practices/how-many-marketing-emails-is-too-many/ · หลัก 4, 5 (ไม่มีตัวเลขเดียวใช้ได้ทุกกรณี)
- S6 · Messaging API pricing, LINE Developers · https://developers.line.biz/en/docs/messaging-api/pricing/ · หลัก 4
- S7 · Effects of List Segmentation on Email Marketing Stats, Mailchimp (ข้อมูลปี 2560 ผู้ใช้ราว 2,000 ราย) · https://mailchimp.com/resources/effects-of-list-segmentation-on-email-marketing-stats/ · หลัก 5
- S8 · Use audiences, LINE Developers · https://developers.line.biz/en/docs/messaging-api/using-audience/ · หลัก 5 (กลุ่มคลิกและเปิดอ่านต้องมีอย่างน้อย 50 คน)
