# bench · plugin e-commerce (35 skill รวมคำสั่ง complain)

ตรวจเมื่อ 2026-11-08 · รัน self-test ของสคริปต์ทั้ง 8 ตัวแล้วผ่านหมด (ไม่เกิน 30 วินาที ไม่เรียก claude) · ย่อ `S/` = `plugins/e-commerce/skills/` · `evals/` = `plugins/e-commerce/evals/`

## ภาพรวมสคริปต์คิดเลข

| สคริปต์ | self-test | ผลที่รันวันนี้ | เคสอ้างอิงคิดจากไหน | rates.json อ้างแหล่งทางการไหม |
|---|---|---|---|---|
| S/doc-quotation/scripts/thai-doc-total.mjs | มี (บรรทัด 144) | 45/45 | ตัวอย่างใน SKILL.md ที่ผู้เขียนคิดมือ ไม่ได้เทียบเครื่องคิดกรมสรรพากร | มี: พ.ร.ฎ. 807 และ rd.go.th/1603.html (rates.json บรรทัด 3) |
| S/e-tax-invoice/scripts/thai-id.mjs | มี (บรรทัด 47) | 15/15 | คิดมือตามสูตรหลักตรวจเลข 13 หลัก (คอมเมนต์ในไฟล์) ไม่ได้เทียบเลขจริงจากทะเบียน | ไม่มี rates (สูตรคงที่) |
| S/import-landed-cost/scripts/landed-cost.mjs | มี (บรรทัด 98) | 19/19 | ตัวอย่าง SKILL.md หัวข้อ 5 (CIF 28,150 · VAT 2,364.60 · รวม 37,444.60) ผู้เขียนคิดเอง | มี: พ.ร.ฎ. 807 และ rd.go.th/5205.html (ม.79/2) · อัตราอากรเป็น input ของผู้ใช้ |
| S/marketplace-fees-pricing/scripts/price-calc.mjs | มี (บรรทัด 113) | 29/29 | ตัวอย่าง SKILL.md (Shopee 205.89 ปัด 209 กำไร 43.86) ผู้เขียนคิดเอง | ค่าธรรมเนียมแพลตฟอร์มเป็น input ไม่ใช่แหล่งทางการ (ยังไม่ได้ตรวจแหล่งในเอกสาร) |
| S/multi-shop-stock/scripts/stock-calc.mjs | มี (บรรทัด 86) | 20/20 | เคสที่ผู้เขียนกำหนดเอง เป็นกฎภายใน ไม่ใช่กฎหมาย | ไม่มี rates |
| S/payroll-th/scripts/payroll.mjs | มี (บรรทัด 112) | 38/38 | ตัวอย่าง SKILL.md (50,000 ภาษี 20,450 หัก 1,704.17) ผู้เขียนคิดมือ ไม่ได้เทียบโปรแกรมเงินเดือนหรือเครื่องคิดสรรพากร | ภาษีอ้าง rd.go.th ม.48 · เพดานประกันสังคมอ้างข่าว infoquest.co.th ไม่ใช่ สปส. (rates.json บรรทัด 3) |
| S/promptpay-qr/scripts/promptpay.mjs | มี (บรรทัด 97) | 23/23 | CRC16 มาตรฐาน 123456789 = 29B1 + payload ตัวอย่างใน SKILL.md · ไม่ได้ลองสแกนกับแอปธนาคารจริง | ไม่มี rates |
| S/seller-tax-basics/scripts/tax-compare.mjs | มี (บรรทัด 142) | 29/29 | ตัวอย่าง SKILL.md (ขาย 1.2 ล้าน: หักเหมา 19,500 vs หักจริง 6,000) ผู้เขียนคิดเอง | อ้าง rd.go.th หลายหน้า แต่หักเหมา 60% จดเองว่า "ยังไม่ได้เทียบประกาศฉบับปัจจุบัน" (rates.json บรรทัด 3) |

สรุป: ทุกสคริปต์มี self-test และผ่าน แต่เคสอ้างอิงส่วนใหญ่คือตัวอย่างใน SKILL.md ที่ผู้เขียนคนเดียวกับโค้ดคิดเอง ยังไม่มีชุดที่คิดจากเครื่องคิดหรือตัวอย่างในประกาศทางการ จึงจับ "สูตรผิดทั้งชุด" ไม่ได้ · ชุด eval 35 เคสใน plugins/e-commerce/evals/ ยังไม่เคยรัน (evals/RESULTS.md บรรทัด 3) และใช้ตัวเลขจากสคริปต์เป็นเฉลย

## ตาราง

| plugin | skill | การตัดสินที่ skill ทำ | ตัววัด (สูตร) | คำตอบที่ถูกมาจากไหน | ต้นทุน | มีอยู่แล้ว | ระดับ |
|---|---|---|---|---|---|---|---|
| e-commerce | payroll-th | คิดภาษีหัก ณ ที่จ่ายรายเดือน ประกันสังคม PVD เงินสุทธิ (SKILL.md:3 ส่วน 2) | ผิด 0 บาท จากชุด N เคส · abs(เครื่อง - เฉลย) <= 0.01 | ตัวอย่างคิดมือใน SKILL.md · ควรเติมเคสที่คิดแยกจากตารางอัตราก้าวหน้า rd.go.th | ฟรี | S/payroll-th/scripts/payroll.mjs:112 (38 เคส) · evals/payroll-th-behaviour | วัดได้เลย |
| e-commerce | seller-tax-basics | เทียบหักเหมา 60% กับหักจริง ภาษีขั้นบันไดกับ 0.5% ของรายได้ (ตาราง Thresholds ใน SKILL.md) | ผิด 0 บาท · เลือกวิธีถูกกว่าตรงเฉลย ÷ ทั้งหมด | ตัวอย่างใน SKILL.md · ควรเติมเคสจากคู่มือ ภ.ง.ด.90 (rd.go.th/fileadmin/tax_pdf/pit/2568/Ins90_241268.pdf) | ฟรี | S/seller-tax-basics/scripts/tax-compare.mjs:142 (29 เคส) | วัดได้เลย |
| e-commerce | marketplace-fees-pricing | ราคาขายที่ได้กำไรเป้าหมายหลังหักค่าธรรมเนียม และ VAT แล้วปัดเลขราคา (SKILL.md:3) | ราคาตรงเฉลย · กำไรจริง% ไม่ต่ำกว่าเป้า% | สูตรย้อนกลับคิดมือ · อัตราค่าธรรมเนียมต้องตรวจจากหน้าผู้ขายของแพลตฟอร์มตามวัน | ฟรี (สูตร) · คนตรวจ (อัตรา) | S/marketplace-fees-pricing/scripts/price-calc.mjs:113 (29 เคส) · evals/marketplace-fees-pricing-behaviour | วัดได้เลย |
| e-commerce | import-landed-cost | ต้นทุนนำเข้าต่อชิ้น CIF อากร VAT นำเข้า (SKILL.md หัวข้อ 2, 5) | ผิด 0 บาท จากชุด N เคส | ตัวอย่างใน SKILL.md · ควรเติมเคสจากตัวอย่าง ม.79/2 ของกรมสรรพากร/ศุลกากร | ฟรี | S/import-landed-cost/scripts/landed-cost.mjs:98 (19 เคส) · evals/import-landed-cost-behaviour | วัดได้เลย |
| e-commerce | doc-quotation | ยอดรวม VAT หัก ณ ที่จ่าย และตัวอักษรไทยของยอดเงิน (SKILL.md:3) | ผิด 0 สตางค์ · ข้อความจำนวนเงินตรงเฉลย ÷ ทั้งหมด | ตัวอย่างใน SKILL.md · ชุดเลขทดสอบการอ่านจำนวนเงินไทย | ฟรี | S/doc-quotation/scripts/thai-doc-total.mjs:144 (45 เคส) · evals/doc-quotation-behaviour | วัดได้เลย |
| e-commerce | promptpay-qr | สร้าง payload EMVCo ของ PromptPay และ CRC (SKILL.md ส่วน 3) | payload ตรงเฉลยทุกตัวอักษร · CRC ผ่าน 100% | CRC มาตรฐานสากล + ตัวอย่างใน SKILL.md · สแกนกับแอปธนาคารจริงยังไม่มี (คนทำ) | ฟรี | S/promptpay-qr/scripts/promptpay.mjs:97 (23 เคส) · evals/promptpay-qr-behaviour | วัดได้เลย |
| e-commerce | multi-shop-stock | คำนวณสต็อกที่ตั้งโชว์แต่ละร้านเพื่อกันขายเกิน (SKILL.md:3) | ขายเกิน 0 ชิ้น ในชุดจำลองยอดขายสุ่ม N รอบ | กฎของ skill เอง ใช้จำลอง ไม่มีแหล่งนอก | ฟรี | S/multi-shop-stock/scripts/stock-calc.mjs:86 (20 เคส) | วัดได้เลย |
| e-commerce | buy-compare | ให้คะแนนตัวเลือกด้วยกฎบังคับและน้ำหนัก แล้วดูว่าผู้ชนะนิ่งไหม (SKILL.md:18-36) | ผู้ชนะตรงเฉลย ÷ เคส · ผลนิ่ง/ไม่นิ่งตรงเฉลย | templates/score-example.json (SKILL.md:36) ที่คิดมือ | ฟรี | plugins/superuser/skills/decision-scoring/scripts/decide.test.mjs · S/buy-compare/templates/score-example.json | วัดได้เลย |
| e-commerce | e-tax-invoice | ตรวจเลขประจำตัวผู้เสียภาษี 13 หลัก และรายการบังคับในใบกำกับ ม.86/4 (SKILL.md:3) | เลขถูก/ผิดตรงเฉลย ÷ ทั้งหมด · recall = ข้อผิดที่เจอ ÷ ที่ฝังในใบตัวอย่าง | สูตรหลักตรวจคิดมือ · รายการ ม.86/4 จากประมวลรัษฎากร ต้องมีใบตัวอย่างที่ฝังข้อผิด | ฟรี (เลข) | S/e-tax-invoice/scripts/thai-id.mjs:47 (15 เคส) · ส่วนใบกำกับไม่มีเคส | เติมเคส |
| e-commerce | tax-vat-th | ตอบว่าเดือนนี้ต้องยื่นอะไรวันไหน เกณฑ์จด VAT 1.8 ล้าน (SKILL.md:15, 21, 30-31) | วันที่ถูก ÷ ทั้งหมด · คำตอบที่มีแหล่ง ÷ ทั้งหมด | ปฏิทิน rd.go.th ระบุวันที่ตรวจ | เรียก claude | evals/tax-vat-th-behaviour · evals/tax-vat-th-trigger (ยังไม่เคยรัน, evals/RESULTS.md:3) | เติมเคส |
| e-commerce | social-security-th | เพดานค่าจ้างและเงินสมทบตามปี (17,500 / 875 ตั้งแต่ 1 ม.ค. 2569) และมาตรา 33/39/40 (SKILL.md:14-25) | ตัวเลขตรงตารางเพดาน ÷ ทั้งหมด | ประกาศ สปส. จาก sso.go.th ณ วันตรวจ | เรียก claude | ไม่มี (payroll-th ใช้ค่าเดียวกันใน rates.json แต่อ้างข่าวไม่ใช่ สปส.) | เติมเคส |
| e-commerce | labour-law-basics | ตอบอัตรา OT 1.5 เท่า วันหยุด 1+ เท่า ค่าชดเชย ช่วงทดลองงาน (SKILL.md:14-34, 52) | ตัวคูณและจำนวนวันตรงมาตรา ÷ ทั้งหมด | พ.ร.บ.คุ้มครองแรงงาน (ม.61, 62 และหมวดค่าชดเชย) | เรียก claude | ไม่มี | เติมเคส |
| e-commerce | dbd-annual-filing | คำนวณกำหนด AGM 4 เดือน บอจ.5 14 วัน งบ 1 เดือน ภ.ง.ด.50 150 วัน จากวันสิ้นปี (SKILL.md:15-26) | วันกำหนดตรงเฉลย · ผิด 0 วัน จากชุดวันสิ้นปี N วัน | ป.พ.พ. ม.1139 1197 และประมวลรัษฎากร ม.68 คิดมือได้ | ฟรีถ้าเขียนสคริปต์ปฏิทิน | ไม่มี (SKILL.md:26 เป็นตารางตัวอย่าง ไม่ใช่สคริปต์) | สร้างใหม่ |
| e-commerce | cash-flow | พยากรณ์เงินสด 13 สัปดาห์ จากรอบจ่ายแพลตฟอร์มและกำหนดภาษี (SKILL.md:36, 54-56) | MAE ของเงินสดคาดการณ์ vs จริงรายสัปดาห์ · สัปดาห์ที่ติดลบทำนายถูก ÷ ทั้งหมด | log เงินเข้าออกจริงของร้าน หรือชุดจำลองที่ทำเอง | ต้องรอ log จริง | ไม่มี | สร้างใหม่ |
| e-commerce | shipping-compare | ต้นทุนต่อออเดอร์ของแต่ละขนส่ง และคะแนนถ่วงน้ำหนัก (SKILL.md:61-68, 77) | ต้นทุนตรงเฉลย (0.6x28 + 0.4x35 + 0.3x450x2.5% = 34.18) | ตัวอย่าง SKILL.md:62 · ราคาจริงของขนส่งเป็น (รอยืนยัน) (SKILL.md:47-49) | ฟรี (สูตร) | ส่วน score ใช้ decide.test.mjs · ไม่มีสคริปต์คิดต้นทุนต่อออเดอร์ | เติมเคส |
| e-commerce | hiring-th | ให้คะแนนผู้สมัครจากเกณฑ์ 4-6 ข้อ แล้วดูความนิ่ง (SKILL.md:26-29, 101) | ผู้ชนะตรงเฉลย · คะแนนรวม = ผลรวม (น้ำหนัก x คะแนน) | templates/score-example.json (SKILL.md:144) · คุณภาพเกณฑ์และตัวคนจริงต้องคนตัดสิน | ฟรี (รวมคะแนน) · คนตัดสิน | decide.test.mjs · S/hiring-th/templates | เติมเคส |
| e-commerce | live-selling-script | เลือกชุดดีลแฟลชภายในงบ (knapsack) และเวลาแต่ละช่วง (SKILL.md:36-54) | มูลค่ารวมของชุดที่เลือก ÷ ค่าที่ดีที่สุดจริง | decide.mjs knapsack หาค่าที่ดีที่สุดจริงถึง 20 รายการ (SKILL.md:49) | ฟรี | decide.test.mjs · ไม่มีเคสเฉพาะของ skill | เติมเคส |
| e-commerce | line-broadcast | เลือก package และกลุ่มที่ส่งได้ในโควตา (knapsack) คิดค่าส่งเกินโควตา (SKILL.md:22-26, 47) | ค่าใช้จ่ายตรงที่คิดมือ (17,000 x 0.10 + 1,280 = 2,980) | ตารางใน SKILL.md:25 ผู้เขียนคิดเอง · ราคา package ต้องเทียบหน้า LINE for Business ตามวัน | ฟรี | decide.test.mjs · ไม่มีเคสเฉพาะ | เติมเคส |
| e-commerce | line-oa-setup | เลือกชนิด token ตามการใช้งาน และ package (SKILL.md:35-38, 53-56) | ข้อเท็จจริงถูก ÷ ทั้งหมด (อายุ token 30 วัน / 15 นาที / จำนวนต่อ channel) | เอกสาร LINE Developers ณ วันตรวจ | เรียก claude | ไม่มี | เติมเคส |
| e-commerce | line-chatbot | เลือก reply (ฟรี) หรือ push (นับโควตา) และจำกัด 5 ข้อความ (SKILL.md:17-18) | เลือกถูก ÷ ทั้งหมด · ต้นทุนข้อความต่อเดือนตรงเฉลย | เอกสาร LINE Developers | เรียก claude | ไม่มี | เติมเคส |
| e-commerce | warranty-tracker | ตัดสินว่าซื้อประกันเพิ่มคุ้มไหม (โอกาสเสีย x ค่าซ่อม > ราคาแผน) และเตือนก่อนหมด 30 วัน (SKILL.md:28, 67-74) | คุ้ม/ไม่คุ้มตรงเฉลย · วันเตือนตรง | ตัวอย่าง SKILL.md:74 (32,000 บาท / แผน 3,900) · โอกาสเสียจริงต้องมี log | ฟรี (สูตร) · ต้องรอ log (โอกาสเสีย) | ไม่มี | เติมเคส |
| e-commerce | pdpa-workflow | แจ้ง สคส. 72 ชม. ตอบสิทธิ 30 วัน จัดข้อมูลอ่อนไหว (SKILL.md:15-34) | กำหนดเวลาถูก ÷ ทั้งหมด · จัดประเภทข้อมูลอ่อนไหวถูก ÷ ทั้งหมด | พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล ม.19 26 30 37 39 | เรียก claude | ไม่มี | เติมเคส |
| e-commerce | thai-business-setup | เลือกรูปแบบกิจการและค่าธรรมเนียมจดทะเบียน (SKILL.md:16-23) | ค่าธรรมเนียมตรงตาราง DBD ÷ ทั้งหมด | dbd.go.th ณ วันตรวจ | เรียก claude | ไม่มี | เติมเคส |
| e-commerce | doc-contract-th | จัดชนิดสัญญา และคิดอากรแสตมป์ (SKILL.md:15-29 เช่น 1 บาทต่อ 1,000 บาท) | อากรตรงเฉลย (ผิด 0 บาท) · ชนิดสัญญาถูก ÷ ทั้งหมด | ตราสารในประมวลรัษฎากร คิดมือได้ (ยังไม่มีสคริปต์) | เรียก claude (จัดชนิด) | ไม่มี | เติมเคส |
| e-commerce | doc-leave | คิดวันลาคงเหลือ (ยกมา + สิทธิ - ใช้ - ขอ) (SKILL.md:45-49) | คงเหลือตรงเฉลย (ผิด 0 วัน) | ตัวอย่างใน SKILL.md:45-49 | ฟรี | ไม่มี | เติมเคส |
| e-commerce | refund-request | เลือกช่องทางและกรอบเวลาของสิทธิ (ขายตรง บัตรเครดิต ข้อบกพร่อง 1 ปี ม.474) (SKILL.md:16-21) | ช่องทางและกำหนดถูก ÷ ทั้งหมด | ป.พ.พ. และกฎหมายขายตรง · เฉลยคนตรวจ | เรียก claude | ไม่มี | เติมเคส |
| e-commerce | returns-and-bad-reviews | ตัดสินรับคืนหรือไม่ตามนโยบายแพลตฟอร์ม (Shopee 15 วัน TikTok 7 วัน ทั้งหมดเป็น รอยืนยัน) (SKILL.md:14-16) | ตัดสินตรงตารางเฉลย ÷ ทั้งหมด | นโยบายแพลตฟอร์มซึ่งเปลี่ยนบ่อย ต้องดึงจาก Seller Center ตามวัน (ยังไม่มีแหล่งยืนยัน) | เรียก claude | ไม่มี | เติมเคส |
| e-commerce | complaint-letter-th | เลือกขั้นบันไดร้องเรียนและกำหนดตอบ (SKILL.md:16-20) | ขั้นถูก ÷ ทั้งหมด · จดหมายมีหลักฐานครบ ตรวจด้วย regex | ลำดับหน่วยงาน (สคบ. 1166) · เฉลยคนตรวจ | ฟรี (ตรวจโครงจดหมาย) · เรียก claude (ร่าง) | ไม่มี | เติมเคส |
| e-commerce | chat-reply-templates | จับคู่คำถามลูกค้ากับแม่แบบ T1-T6 (SKILL.md:32-36) | จับคู่ตรงเฉลย ÷ ทั้งหมด | ชุดข้อความลูกค้าที่ติดป้ายแม่แบบ (ต้องเขียนเอง) | เรียก claude | evals/chat-reply-templates-existing | เติมเคส |
| e-commerce | sme-bookkeeping | เลือกชนิดบัญชีตามประเภทกิจการ และอายุเก็บเอกสาร 5 ปี สูงสุด 7 (SKILL.md:28-30, 40-42) | เลือกถูก ÷ ทั้งหมด · ปีเก็บตรงเฉลย | พ.ร.บ.การบัญชี ม.14 ประมวลรัษฎากร ม.87/3 (อ้างใน SKILL.md:46) | เรียก claude | ไม่มี | เติมเคส |
| e-commerce | thai-holidays | ตอบวันหยุดและวันชดเชย และขั้นต่ำ 13 วัน (SKILL.md:16) | วันที่ตรงเฉลย ÷ ทั้งหมด | ประกาศ ครม./ธปท. ประจำปี (ยังไม่ได้ตรวจ references/) | เรียก claude | ไม่มี | เติมเคส |
| e-commerce | superuser | เลือก playbook และ agent ตามบทบาท (SKILL.md:43-60, 119) | เลือกถูก ÷ ทั้งหมด | ชุดคำขอที่ติดป้าย playbook (ต้องเขียนเอง) | เรียก claude | ไม่มี | เติมเคส |
| e-commerce | product-listing | ตรวจชื่อสินค้าตามสูตร คำต้องห้าม รูปแรกสินค้าเต็มเฟรม 70-85% (SKILL.md:38-44, 62, 82) | ชื่อที่ผ่านกฎที่เครื่องตรงได้ (ความยาว คำต้องห้ามเช่น ถูกที่สุด / อันดับ 1) ÷ ทั้งหมด | ข้อกำหนดผู้ขายของแต่ละแพลตฟอร์ม (ความยาวชื่อจริง: ยังไม่ได้ตรวจ) | ฟรี (checker ที่ต้องเขียน) | ไม่มี | สร้างใหม่ |
| e-commerce | doc-thai-official | ใช้รูปแบบหนังสือราชการตามระเบียบงานสารบรรณ (SKILL.md:32, 70) | ส่วนที่เครื่องตรงได้: มีหัวเรื่อง คำลงท้าย สรรพนามถูก ÷ จดหมาย | ระเบียบสำนักนายกฯ ว่าด้วยงานสารบรรณ | ฟรี (checker โครง) · คนตัดสิน (สำนวน) | ไม่มี | สร้างใหม่ |
| e-commerce | complain | คำสั่งลัด เรียก agent consumer-advocate กับ complaint-letter-th ไม่ตัดสินเอง (SKILL.md:6-14) | ไม่มี | ไม่ต้องมี | ไม่มี | ไม่มี | ไม่คุ้ม (เป็นตัวส่งต่อ วัดที่ complaint-letter-th และ refund-request) |

## จำนวน skill ต่อระดับ

| ระดับ | จำนวน | skill |
|---|---|---|
| วัดได้เลย | 8 | payroll-th · seller-tax-basics · marketplace-fees-pricing · import-landed-cost · doc-quotation · promptpay-qr · multi-shop-stock · buy-compare |
| เติมเคส | 22 | e-tax-invoice · tax-vat-th · social-security-th · labour-law-basics · shipping-compare · hiring-th · live-selling-script · line-broadcast · line-oa-setup · line-chatbot · warranty-tracker · pdpa-workflow · thai-business-setup · doc-contract-th · doc-leave · refund-request · returns-and-bad-reviews · complaint-letter-th · chat-reply-templates · sme-bookkeeping · thai-holidays · superuser |
| สร้างใหม่ | 4 | dbd-annual-filing · cash-flow · product-listing · doc-thai-official |
| ไม่คุ้ม | 1 | complain |

หมายเหตุ: ตารางนับเติมเคส 22 ชื่อ (รวม doc-contract-th ที่ตั้งเป็นเติมเคส) · รวมทุกระดับ 8 + 22 + 4 + 1 = 35
