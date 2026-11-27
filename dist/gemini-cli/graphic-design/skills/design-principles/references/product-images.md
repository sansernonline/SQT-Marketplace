# หลักคิด · Product images
> รูปสินค้าต้องตอบคำถามผู้ซื้อให้ได้ก่อนเขาถาม: นี่คืออะไร ขนาดเท่าไร หน้าตาจริงเป็นอย่างไร และจะได้รับของแบบนี้จริงหรือไม่

## งานดีคืออะไร
1. **รูปปกเห็นตัวสินค้าชัดอย่างเดียว บนพื้นเรียบ (ขาวดีที่สุด) และสินค้าเต็มเฟรม** — คนดูรูปก่อนอ่านชื่อ และรูปที่ไม่มีอะไรรกให้สัญญาณชัดที่สุด; สินค้าต้องกินพื้นที่ส่วนใหญ่ของเฟรม (สัดส่วนที่แต่ละแพลตฟอร์มกำหนดอยู่ใน skill `marketplace-product-images`) · ตรวจด้วยตา: ย่อรูปให้เล็กเท่าภาพหน้ารายการ ยังบอกได้ทันทีว่าขายอะไร
2. **รูปปกไม่มีข้อความ โลโก้ ลายน้ำ กรอบ หรือสติกเกอร์โปรโมชัน** — กฎของแพลตฟอร์มห้ามไว้ และอาจถูกปฏิเสธรูปหรือตกคะแนนคุณภาพ · ตรวจด้วยตา: มองรูปปก ไม่มีอะไรทับตัวสินค้าหรืออยู่ในกรอบนอกจากสินค้า (ข้อความและกราฟิกไปอยู่รูปที่ 2 เป็นต้นไป)
3. **ภาพคมและใหญ่พอให้ซูมดูรายละเอียด** — ผู้ซื้อซูมเป็นปกติ ภาพแตกทำให้เสียความเชื่อถือทั้งร้าน และภาพขยายคือสิ่งที่ผู้ซื้อต้องการ · ตรวจด้วยตา: ซูมเต็มจอบนมือถือ ขอบ ตะเข็บ และตัวอักษรบนสินค้ายังอ่านออก ไม่เป็นเม็ด
4. **มีหลายมุมและหลายระยะ ไม่ใช่มุมเดียวซ้ำ** — ภาพเดียวตอบคำถามผู้ซื้อไม่พอ ผู้ซื้อดูภาพใกล้เพื่อตัดสินคุณภาพก่อนอ่านข้อความ · ตรวจด้วยตา: เรียงทุกรูปแล้วถามว่า "รูปนี้ให้ข้อมูลใหม่อะไร" ถ้าตอบไม่ได้ให้เปลี่ยน
5. **ให้เห็นขนาดและการใช้งานจริง (มือ คน ของที่คุ้นตา ฉากใช้งาน)** — ภาพตัดพื้นหลังทำให้ของดูใหญ่หรือเล็กเกินจริง ผู้ซื้อประเมินขนาดผิดแล้วทิ้งสินค้า · ตรวจด้วยตา: ปิดคำบรรยายขนาด ยังเดาขนาดจากรูปได้ใกล้เคียง
6. **รูปตรงกับของที่ผู้ซื้อจะได้รับจริง** — แพลตฟอร์มกำหนดให้เป็นสินค้าจริงและไม่ทำให้เข้าใจผิด; เกินจริงคือรีวิวแย่และคืนของ · ตรวจด้วยตา: วางรูปข้างของจริง สี ทรง ชิ้นส่วน และของแถมต้องตรงกัน ไม่มีของที่ไม่ได้ส่งให้ติดในรูปปก
7. **ทุกตัวเลือก (สี ลาย ขนาด) มีรูปของมันเอง** — ผู้ซื้อเลือกสีแล้วต้องเห็นสีนั้น ไม่ใช่เดาจากข้อความ · ตรวจด้วยตา: กดไล่ทุกตัวเลือก รูปเปลี่ยนตรงตามชื่อตัวเลือกทุกอัน

## พลาดบ่อย
- ใส่ข้อความโปรโมชันหรือโลโก้บนรูปปก → รูปถูกปฏิเสธหรือรายการตกระดับคุณภาพ
- สินค้าเล็กลอยกลางภาพ ขอบขาวเยอะ → ในหน้ารายการดูเล็กกว่าร้านอื่นและถูกข้าม
- ใช้รูปความละเอียดต่ำหรือขยายจากรูปเล็ก → ซูมแล้วแตก ผู้ซื้อสงสัยทั้งสินค้าและร้าน
- รูปเดียวกันหลายมุมซ้ำ หรือทำภาพรวมหลายรูปในช่องเดียว (collage) → ผู้ซื้อไม่ได้ข้อมูลเพิ่ม และบางแพลตฟอร์มไม่รับ
- แต่งสี ฟิลเตอร์ หรือทำเอฟเฟกต์จนไม่เหมือนของจริง → ของไม่ตรงปก ถูกคืนและรีวิวต่ำ
- ไม่มีอะไรให้เทียบขนาด → ผู้ซื้อเดาขนาดผิดและถามแชตซ้ำ ๆ

## ใช้คู่กับ
skills: `marketplace-product-images` · `image-generation` · `copy-claims-check` · playbook: `image-series` · general method: superuser `design-gate/parts/design-method/guide.md`

## Sources (checked 2026-11-27)
ตัวเลขขนาดภาพและกฎแยกตามแพลตฟอร์มอยู่ใน skill `marketplace-product-images` ไฟล์นี้ใช้เฉพาะหลักที่ตรงกันอย่างน้อย 3 แหล่ง
- Product detail page: Image guidelines & requirements, Walmart Marketplace Learn — https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content%2C%20imagery%2C%20and%20media/Product-detail-page:-Image-guidelines-&-requirements — หลัก 1, 2, 3, 6, 7
- Product Titles, Descriptions, Images & Videos, TikTok Shop Seller University (TH) — https://seller-th.tiktok.com/university/essay?knowledge_id=7066060516738833&lang=en — หลัก 1, 3, 4, 6
- Product Detail Pages & Listing Quality Guidelines, TikTok Shop Seller University (US) — https://seller-us.tiktok.com/university/essay?knowledge_id=481891871868714&lang=en — หลัก 1, 2, 3, 4, 6
- Tips foto produk berkelas, Shopee Indonesia — https://shopee.co.id/inspirasi-shopee/shopee-sellers-tips-foto-produk-berkelas/ — หลัก 1, 2, 3, 4, 5, 7
- Inappropriate and Misleading Content Policy, Lazada Philippines Community — https://community.lazada.com.ph/article/inappropriate-and-misleading-content-policy-970200-hc — หลัก 2, 6
- Amazon Image Requirements 2026 (สรุปกฎ Amazon โดย SellerLabs, ไม่ได้อ้างหน้า Amazon โดยตรง) — https://www.sellerlabs.com/blog/amazon-product-image-requirements-2026/ — หลัก 1, 2, 3
- Ensure Sufficient Image Resolution and Zoom, Baymard Institute — https://baymard.com/blog/ensure-sufficient-image-resolution-and-zoom — หลัก 3
- In Scale Product Images, Baymard Institute — https://baymard.com/blog/in-scale-product-images — หลัก 5
- Product Image Categories, Baymard Institute — https://baymard.com/blog/ux-product-image-categories — หลัก 1, 4, 5
- Human Model images, Baymard Institute — https://baymard.com/blog/human-model — หลัก 5
- UX Guidelines for Ecommerce Product Pages, Nielsen Norman Group — https://www.nngroup.com/articles/ecommerce-product-pages/ — หลัก 3, 4, 5, 6
- Product Photos on Listing Pages: 6 Tips, Nielsen Norman Group — https://www.nngroup.com/articles/product-photos-listing-pages/ — หลัก 3, 5, 7
