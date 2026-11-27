# หลักคิด · แอปมือถือและเกม
> แอปและเกมต้องใช้ได้จริงบนเครื่องที่สัญญาณหลุด แบตจำกัด และผู้ใช้หลากหลาย โดยผ่านร้านค้าได้และไม่เอาเปรียบผู้เล่น

## งานดีคืออะไร
1. **แอปทำงานหลักได้เมื่อไม่มีเน็ต โดยเก็บข้อมูลในเครื่องเป็นต้นฉบับแล้วซิงก์ทีหลัง** — มือถือเจอสัญญาณหลุดเป็นเรื่องปกติ แอปที่พึ่งเครือข่ายตลอดจึงพังบ่อย · ตรวจด้วยตา: ปิดเน็ตแล้วเปิดแอปยังเห็นข้อมูลล่าสุดและบันทึกงานได้ พอเน็ตกลับมาซิงก์เอง และรู้ว่าจัดการข้อมูลชนกันอย่างไร (S1, S2, S3)
2. **ทำงานเบื้องหลังเท่าที่จำเป็น เลื่อนและรวบงานให้ระบบจัดเวลา แทนที่จะวนถามเซิร์ฟเวอร์** — การปลุกเครื่องและการใช้เครือข่ายบ่อยกินแบตมากที่สุด · ตรวจด้วยตา: ไม่มี polling ถี่ งานเบื้องหลังใช้ตัวจัดตารางของระบบ และอัตราแครชกับแอปค้าง (Application Not Responding, ANR) ไม่เกินเกณฑ์คุณภาพที่ร้านแอปเผยแพร่ ซึ่งมีผลต่อการมองเห็นของแอป ตรวจเกณฑ์ล่าสุดในคอนโซลของร้านแอป (S4, S5, S6)
3. **ทำตามกฎร้านค้าตั้งแต่ต้น ไม่ใช่แก้ตอนถูกปฏิเสธ** — แอปที่ผ่านด่านร้านช้าหรือถูกถอดทำให้ปล่อยแก้บั๊กไม่ได้ · ตรวจด้วยตา: แอปที่สร้างบัญชีได้มีปุ่มลบบัญชีในแอป และข้อมูลที่ประกาศในหน้าร้านตรงกับที่แอปและ SDK เก็บจริง (S7, S8, S9)
4. **ขอสิทธิ์เฉพาะที่ฟีเจอร์ต้องใช้ ขอตอนผู้ใช้กำลังใช้ฟีเจอร์นั้น และแอปยังใช้ได้ถ้าถูกปฏิเสธ** — ขอเยอะหรือขอเร็วทำให้ถูกปฏิเสธถาวร และเก็บเกินจำเป็นเสี่ยงผิดกฎหมาย · ตรวจด้วยตา: ไม่มีกล่องขอสิทธิ์ตอนเปิดแอปครั้งแรก มีคำอธิบายก่อนขอ · **เฉพาะไทย**: พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล มาตรา 22 จำกัดการเก็บให้เท่าที่จำเป็นตามวัตถุประสงค์ (S10, S11, S12)
5. **ผู้ใช้ทุกแบบใช้ได้ ทั้งผู้ใช้โปรแกรมอ่านหน้าจอ ตัวอักษรขยาย และนิ้วใหญ่** — ผู้ใช้จำนวนมากพึ่งฟีเจอร์เหล่านี้ และมาตรฐานสากลกำหนดเกณฑ์ไว้แล้ว · ตรวจด้วยตา: ทุกปุ่มมีป้ายที่โปรแกรมอ่านหน้าจออ่านได้ ตัวอักษรขยายแล้วไม่ล้น ความต่างสีข้อความอย่างน้อย 4.5:1 พื้นที่แตะอย่างน้อย 24 x 24 พิกเซล CSS ตามมาตรฐาน WCAG 2.2 และไม่ใช้สีอย่างเดียวบอกความหมาย (S13, S14, S15)
6. **เกมตอบสนองทันทีและมีผลตอบกลับทุกการกระทำ** — ผลต้องตอบกลับเร็วจนรู้สึกว่าเกิดพร้อมการกระทำ และเฟรมที่ใช้เวลาเกินงบต่อเฟรมทำให้ภาพกระตุก (ดูตัวเลขใน skill `game-development`) · ตรวจด้วยตา: กดแล้วเห็นหรือได้ยินผลทันที ภาพลื่นบนเครื่องรุ่นต่ำที่สุดที่รองรับ (S16, S17, S18)
7. **สอนด้วยการเล่น ทีละแนวคิด ข้ามได้ และให้ผู้เล่นพิสูจน์ว่าทำได้ก่อนไปต่อ** — คำอธิบายยาวก่อนเล่นถูกข้าม ส่วนการลงมือทำทันทีทำให้จำได้ดีกว่าและไม่ท่วมผู้เล่นใหม่ · ตรวจด้วยตา: เข้าถึงการเล่นจริงเร็ว ไม่มีป๊อปอัปขอคะแนนหรือแจ้งเตือนก่อนเล่น และเปิดดูวิธีเล่นซ้ำได้ (S19, S20, S21)
8. **เก็บเงินอย่างตรงไปตรงมา: ราคาชัด กดซื้อโดยไม่ตั้งใจไม่ได้ และเปิดเผยอัตราสุ่มก่อนจ่าย** — ผู้เล่น โดยเฉพาะเด็ก ถูกหลอกให้จ่ายแล้วเกิดทั้งความเสียหายและบทลงโทษ · ตรวจด้วยตา: กล่องสุ่มแสดงโอกาสได้ของแต่ละชนิดก่อนซื้อ การซื้อต้องยืนยันชัด และยกเลิกง่ายเท่าสมัคร (S7, S22, S23, S24)

## พลาดบ่อย
- ขอสิทธิ์ทั้งหมดตั้งแต่เปิดแอป → ผู้ใช้กดปฏิเสธถาวร ฟีเจอร์ใช้ไม่ได้ (S10)
- ใช้ SDK ภายนอกโดยไม่ทบทวนว่าเก็บอะไร → ข้อมูลที่ประกาศไม่ตรงจริง ถูกร้านตีกลับ (S9)
- ซิงก์โดยไม่มีกติกาข้อมูลชนกัน → ข้อมูลผู้ใช้ถูกเขียนทับเงียบๆ (S1)
- ยัดบทสอนทั้งหมดไว้ต้นเกม → ผู้เล่นกดข้ามแล้วไม่เข้าใจกลไกจริง (S19, S21)
- ปุ่มซื้อวางติดปุ่มที่กดบ่อย หรือกดครั้งเดียวตัดเงิน → ถูกเรียกเก็บโดยไม่ตั้งใจ (S23, S24)
- ทดสอบความลื่นเฉพาะเครื่องแรงของทีม → เครื่องรุ่นล่างกระตุกและถูกให้คะแนนต่ำ (S17, S6)

## ใช้คู่กับ
skills: `mobile-engineering` · `mobile-app-design` · `game-development` · `pdpa-compliance` · `ecommerce-patterns` · playbook: `feature` · `prototype` · `ship` · `performance`

## Sources (checked 2026-11-27)
- S1 · Build an offline-first app, Android Developers · https://developer.android.com/topic/architecture/data-layer/offline-first · หลัก 1 (ข้อมูลในเครื่องเป็นต้นฉบับ ซิงก์ แก้ข้อมูลชน)
- S2 · The Offline Cookbook, web.dev · https://web.dev/articles/offline-cookbook · หลัก 1
- S3 · waitsForConnectivity, Apple Developer Documentation · https://developer.apple.com/documentation/foundation/urlsessionconfiguration/waitsforconnectivity · หลัก 1
- S4 · Choose background work, Android Developers · https://developer.android.com/develop/background-work/background-tasks · หลัก 2 (เลี่ยง polling ใช้ push และตัวจัดตาราง)
- S5 · Energy Efficiency Guide for iOS Apps, Apple · https://developer.apple.com/library/archive/documentation/Performance/Conceptual/EnergyGuide-iOS/index.html · หลัก 2 (idle เมื่อไม่ถูกใช้ รวบงานเครือข่าย)
- S6 · Android vitals, Android Developers · https://developer.android.com/topic/performance/vitals · หลัก 2 (เกณฑ์คุณภาพแครช/ANR ที่ร้านเผยแพร่ ตรวจค่าล่าสุดในคอนโซล)
- S7 · App Store Review Guidelines, Apple · https://developer.apple.com/app-store/review/guidelines/ · หลัก 3, 8 (5.1.1(v) ลบบัญชีในแอป, 3.1.1 เปิดเผยโอกาสสุ่ม)
- S8 · Understanding Google Play's app account deletion requirements, Google Play Console Help · https://support.google.com/googleplay/android-developer/answer/10144311 · หลัก 3 (ต้องมีทางลบบัญชีและข้อมูล)
- S9 · Provide information for Google Play's Data safety section, Google · https://support.google.com/googleplay/android-developer/answer/10787469 · หลัก 3
- S10 · Request runtime permissions, Android Developers · https://developer.android.com/training/permissions/requesting · หลัก 4
- S11 · Privacy, Human Interface Guidelines, Apple · https://developer.apple.com/design/human-interface-guidelines/privacy · หลัก 4
- S12 · Personal Data Protection Act B.E. 2562 (unofficial English translation) · https://pdpa.msu.ac.th/wp-content/uploads/2022/05/EN-PDPA-2019.pdf · หลัก 4 (ม.22 เท่าที่จำเป็น)
- S13 · Web Content Accessibility Guidelines (WCAG) 2.2, W3C · https://www.w3.org/TR/WCAG22/ · หลัก 5 (SC 1.4.3 สัดส่วน 4.5:1, SC 1.4.1 ไม่ใช้สีอย่างเดียว, SC 2.5.8 ขนาดเป้า 24 x 24 พิกเซล CSS)
- S14 · Accessibility principles, Android Developers · https://developer.android.com/guide/topics/ui/accessibility/principles · หลัก 5 (ป้ายสำหรับ TalkBack ไม่ใช้สีอย่างเดียว)
- S15 · Mobile Accessibility: How WCAG Applies to Mobile, W3C · https://www.w3.org/TR/mobile-accessibility-mapping/ · หลัก 5
- S16 · Response Times: The 3 Important Limits, Nielsen Norman Group · https://www.nngroup.com/articles/response-times-3-important-limits/ · หลัก 6 (เวลาตอบสนองที่รู้สึกว่าทันที)
- S17 · Slow rendering, Android Developers · https://developer.android.com/topic/performance/vitals/render · หลัก 6 (งบเวลาต่อเฟรม)
- S18 · Is your game juicy enough?, Game Developer (Jonasson and Purho, GDC) · https://www.gamedeveloper.com/design/video-is-your-game-juicy-enough- · หลัก 6
- S19 · Onboarding for Games, Apple Developer · https://developer.apple.com/app-store/onboarding-for-games/ · หลัก 7
- S20 · Onboarding techniques, Roblox Creator Docs · https://create.roblox.com/docs/production/game-design/onboarding-techniques · หลัก 7
- S21 · Teaching Game Mechanics: A Hierarchy of Learning, Game Developer · https://www.gamedeveloper.com/design/teaching-game-mechanics-a-hierarchy-of-learning · หลัก 7
- S22 · Monetization and Ads policy (randomized virtual items), Google Play Developer Policy Center · https://support.google.com/googleplay/android-developer/answer/9858738 · หลัก 8 (เปิดเผยโอกาสก่อนซื้อ)
- S23 · Fortnite video game maker Epic Games to pay more than half a billion dollars, FTC · https://www.ftc.gov/news-events/news/press-releases/2022/12/fortnite-video-game-maker-epic-games-pay-more-half-billion-dollars-over-ftc-allegations · หลัก 8 (กดครั้งเดียวตัดเงิน)
- S24 · Bringing Dark Patterns to Light, FTC staff report 2022 · https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf · หลัก 8 (ค่าธรรมเนียมซ่อน ยกเลิกยาก แอปเด็ก)
