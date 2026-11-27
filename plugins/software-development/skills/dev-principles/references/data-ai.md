# หลักคิด · ข้อมูล ระบบ AI และเครื่องมือเชื่อมต่อ
> งานข้อมูลและ Artificial Intelligence (AI) ต้องให้ผลที่ตรวจย้อนได้ และเมื่อผิดพลาดต้องล้มอย่างเห็นชัด ไม่ใช่ตอบมั่นใจแต่ผิดเงียบๆ

## งานดีคืออะไร
1. **นำเข้าและส่งออกด้วยรูปแบบ schema และรหัสอักขระที่ระบุชัด แถวที่ไม่ผ่านถูกปฏิเสธพร้อมเหตุผล และเก็บไฟล์ดิบไว้ไม่แก้** — ข้อมูลเสียที่ไหลเข้าไปแล้วย้อนแก้ยาก และไฟล์ที่ไม่ประกาศรหัสอักขระทำให้ภาษาไทยเพี้ยน · ตรวจด้วยตา: มีรายงานแถวที่ถูกปฏิเสธพร้อมเลขแถวและสาเหตุ ไฟล์ดิบอ่านอย่างเดียว และไฟล์ส่งออกเปิดภาษาไทยได้ถูก (S1, S2, S3)
2. **ผลวิเคราะห์ทุกตัวสร้างซ้ำได้จากข้อมูลดิบ ด้วยขั้นตอนที่บันทึกไว้ ไม่มีการแก้มือที่ไม่มีร่องรอย** — ตัวเลขที่ทำซ้ำไม่ได้ตรวจและไว้ใจไม่ได้ · ตรวจด้วยตา: ทุกตัวเลขในรายงานชี้กลับไปถึงสคริปต์และข้อมูลต้นทางได้ มีสมมติฐานเขียนไว้ (S4, S5, S6)
3. **เปลี่ยน prompt ได้ต่อเมื่อวัดกับชุดทดสอบจากงานจริงแล้วดีขึ้น และตรึงรุ่นโมเดลไว้** — prompt ที่แก้ตามความรู้สึกทำให้เรื่องหนึ่งดีขึ้นอีกเรื่องแย่ลงโดยไม่รู้ตัว · ตรวจด้วยตา: มีเกณฑ์สำเร็จเขียนไว้ มีชุดทดสอบรวมกรณีขอบ และบันทึกผลก่อนและหลังทุกครั้งที่แก้ (S7, S8, S9, S10)
4. **ระบบดึงข้อมูลมาเสริมคำตอบ (Retrieval-Augmented Generation, RAG) ตอบจากเอกสารที่ดึงมาเท่านั้น อ้างที่มาได้ และวัดการดึงแยกจากการเขียนคำตอบ** — ต้องรู้ว่าพลาดเพราะหาไม่เจอหรือเพราะเขียนผิด จึงจะแก้ถูกจุด · ตรวจด้วยตา: คำตอบมีที่มาให้เปิดดู ถ้าเอกสารไม่มีคำตอบระบบบอกว่าไม่ทราบ และมีคะแนนการดึงแยกต่างหาก (S11, S12, S13)
5. **ถือว่าผลลัพธ์ของโมเดลและเนื้อหาที่ดึงมาเป็นข้อมูลไม่น่าไว้ใจ และจำกัดสิทธิ์ของระบบให้น้อยที่สุด** — ข้อความที่ผู้โจมตีฝังไว้สั่งโมเดลได้ ถ้าระบบเห็นข้อมูลลับ รับเนื้อหาภายนอก และส่งข้อมูลออกได้พร้อมกัน ข้อมูลรั่วได้ · ตรวจด้วยตา: เอาต์พุตถูกตรวจก่อนไปทำงานจริง ไม่มีเอเจนต์ที่ครบทั้งสามอย่างนั้น และการกระทำที่ย้อนไม่ได้ต้องมีคนอนุมัติ (S14, S15, S16)
6. **เอเจนต์เสียงยืนยันรายละเอียดที่เสียหายหนักถ้าผิด (ชื่อ ที่อยู่ ยอดเงิน) ด้วยการให้ผู้ใช้ตอบรับชัดเจน ส่วนที่เหลือยืนยันแบบแฝง** — ยืนยันทุกอย่างทำให้ช้าและน่ารำคาญ ไม่ยืนยันเลยทำให้ธุรกรรมผิด · ตรวจด้วยตา: ก่อนจ่ายเงินหรือลบข้อมูลมีขั้นอ่านทวนและรอคำว่าใช่ (S17, S18, S19)
7. **เอเจนต์เสียงบอกว่าเป็น AI ยอมรับขีดจำกัดตรงๆ และส่งต่อให้คนเมื่อฟังไม่เข้าใจซ้ำ** — ผู้ใช้ต้องรู้ว่าคุยกับอะไร และไม่ควรติดวนอยู่กับระบบที่แก้ไม่ได้ · ตรวจด้วยตา: ประโยคเปิดบอกว่าเป็น AI และหลังฟังไม่เข้าใจครบจำนวนครั้งที่กำหนดมีทางไปหาคนจริง (S18, S19, S20)
8. **เครื่องมือของเซิร์ฟเวอร์ Model Context Protocol (MCP) มีคำอธิบายและ schema ชัด ตรวจอินพุตทุกครั้ง ขอสิทธิ์น้อยที่สุด และไม่ส่งต่อโทเคนที่ไม่ได้ออกให้ตัวเอง** — โมเดลเลือกเครื่องมือจากคำอธิบาย และเซิร์ฟเวอร์คือด่านสุดท้ายก่อนระบบจริง · ตรวจด้วยตา: เครื่องมือน้อยและมีเป้าหมายชัด ขอบเขตสิทธิ์เริ่มจากอ่านอย่างเดียว ปฏิบัติการอันตรายต้องยืนยัน และมี log การเรียก (S22, S23, S24)

## พลาดบ่อย
- ส่งออก CSV โดยไม่กันเซลล์ที่ขึ้นต้นด้วย = + - @ → สเปรดชีตรันสูตรที่ผู้โจมตีฝังไว้ (S25)
- แก้ข้อมูลดิบในที่เดิมเพื่อ "ทำความสะอาด" → ย้อนดูต้นฉบับและทำซ้ำไม่ได้ (S4, S5)
- ตัดสินคุณภาพ prompt จากตัวอย่างไม่กี่ข้อที่ผู้เขียนเลือกเอง → ดีต่อตัวอย่างนั้นแต่พังกับงานจริง (S7, S9)
- ให้เอเจนต์อ่านอีเมลหรือหน้าเว็บภายนอกพร้อมสิทธิ์ส่งข้อมูลออก → ข้อความฝังคำสั่งดูดข้อมูลลับได้ (S14, S16)
- ให้เอเจนต์เสียงเงียบนานระหว่างรอโมเดล → ผู้ใช้คิดว่าสายหลุด ความล่าช้าทางเดียวที่มากเกินไปกระทบการสนทนา (ดูตัวเลขใน skill `voice-agent`) (S26)
- เครื่องมือ MCP เดียวที่ทำได้ทุกอย่าง → โมเดลเลือกผิดและโทเคนหนึ่งใบเปิดทุกอย่าง (S14, S24)

## ใช้คู่กับ
skills: `data-analysis` · `data-import-export` · `llm-engineering` · `voice-agent` · `mcp-server` · `pdpa-compliance` · `audit-trail` · playbook: `feature` · `prototype` · `review`

## Sources (checked 2026-11-27)
- S1 · Data Validation for Machine Learning (Breck et al.), MLSys 2019 · https://mlsys.org/Conferences/2019/doc/2019/167.pdf · หลัก 1 (ตรวจข้อมูลกับ schema ก่อนใช้)
- S2 · Model for Tabular Data and Metadata on the Web, W3C Recommendation · https://www.w3.org/TR/tabular-data-model/ · หลัก 1 (UTF-8 ค่าเริ่มต้น ตรวจเซลล์กับชนิดข้อมูล)
- S3 · RFC 4180 Common Format and MIME Type for CSV Files, IETF · https://www.rfc-editor.org/rfc/rfc4180 · หลัก 1 (ระบุ charset)
- S4 · Good enough practices in scientific computing, PLOS Computational Biology · https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005510 · หลัก 2 (เก็บข้อมูลดิบ บันทึกทุกขั้น)
- S5 · Ten Simple Rules for Reproducible Computational Research, PLOS Computational Biology · https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003285 · หลัก 2 (ไม่แก้มือ ติดตามทุกผล)
- S6 · Tidy Data, Hadley Wickham, Journal of Statistical Software · https://www.jstatsoft.org/article/view/v059i10 · หลัก 2
- S7 · Prompt engineering overview, Anthropic · https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/overview · หลัก 3 (เกณฑ์สำเร็จและการทดสอบก่อน)
- S8 · Prompt engineering, OpenAI · https://developers.openai.com/api/docs/guides/prompt-engineering · หลัก 3 (ตรึงรุ่น สร้างชุดประเมิน)
- S9 · Define success criteria and build evaluations, Anthropic · https://platform.claude.com/docs/en/test-and-evaluate/develop-tests · หลัก 3 (ชุดทดสอบตรงงานจริงรวมกรณีขอบ)
- S10 · Prompt design strategies, Google Gemini API · https://ai.google.dev/gemini-api/docs/prompting-strategies · หลัก 3 (ปรับซ้ำ)
- S11 · Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, Lewis et al. · https://arxiv.org/abs/2005.11401 · หลัก 4 (ที่มาของคำตอบ)
- S12 · Ragas: Automated Evaluation of RAG, Es et al. · https://arxiv.org/abs/2309.15217 · หลัก 4 (วัดส่วนดึงและส่วนสร้างแยกกัน)
- S13 · Introducing Contextual Retrieval, Anthropic · https://www.anthropic.com/news/contextual-retrieval · หลัก 4 (คุณภาพการดึงคือคอขวด)
- S14 · OWASP Top 10 for LLM Applications 2025, OWASP GenAI Security Project · https://genai.owasp.org/llm-top-10/ · หลัก 5 (Prompt Injection, Improper Output Handling, Excessive Agency)
- S15 · NIST AI 600-1 Generative AI Profile, NIST · https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf · หลัก 5 (ทดสอบก่อนใช้ มีคนกำกับ)
- S16 · The lethal trifecta for AI agents, Simon Willison · https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/ · หลัก 5
- S17 · Confirmations, Google Conversation Design · https://developers.google.cn/assistant/conversation-design/confirmations · หลัก 6 (ชัดแจ้งเฉพาะงานเสี่ยงสูง)
- S18 · Be trustworthy, Alexa Design Guide · https://developer.amazon.com/en-US/alexa/alexa-haus/design-principles/be-trustworthy · หลัก 6, 7
- S19 · Voice agent design, Google Cloud Dialogflow CX · https://docs.cloud.google.com/dialogflow/cx/docs/concept/voice-agent-design · หลัก 6, 7 (ทวนเฉพาะจุดที่ต้องยืนยัน ส่งต่อคนครั้งที่สาม)
- S20 · Article 50 Transparency obligations, EU AI Act · https://artificialintelligenceact.eu/article/50/ · หลัก 7 (ผู้ใช้ต้องรู้ว่าคุยกับ AI)
- S22 · Tools, Model Context Protocol specification 2025-06-18 · https://modelcontextprotocol.io/specification/2025-06-18/server/tools · หลัก 8 (ตรวจอินพุต คุมสิทธิ์ จำกัดอัตรา คนอนุมัติ)
- S23 · Security Best Practices, Model Context Protocol · https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices · หลัก 8 (ห้ามส่งต่อโทเคน ขอบเขตสิทธิ์น้อยสุด)
- S24 · Writing effective tools for agents, Anthropic · https://www.anthropic.com/engineering/writing-tools-for-agents · หลัก 8 (รวมเครื่องมือ ผลลัพธ์กระชับ)
- S25 · CSV Injection, OWASP · https://community.owasp.org/attacks/CSV_Injection · พลาดบ่อย
- S26 · G.114 One-way transmission time, ITU-T · https://www.cs.columbia.edu/%7Eandreaf/new/documents/other/T-REC-G.114-200305.pdf · พลาดบ่อย (ความล่าช้าทางเดียวกับการสนทนา)
