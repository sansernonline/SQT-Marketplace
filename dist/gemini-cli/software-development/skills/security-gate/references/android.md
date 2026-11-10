# รายการตรวจ Android — ใช้กับ `security-gate` ข้อ 2

**รายการตรวจ Android** — ดู `AndroidManifest.xml` ที่รวมแล้ว (merged manifest) ไม่ใช่แค่ไฟล์ต้นฉบับ เพราะ plugin เติม permission ให้เอง · โฟลเดอร์เปลี่ยนตามเวอร์ชัน Android Gradle Plugin (AGP) (`merged_manifests/<variant>/` หรือ `merged_manifest/<variant>/process<Variant>MainManifest/` — ยังไม่ได้ตรวจ) ให้หาด้วย `find build -path '*merged_manifest*' -name AndroidManifest.xml` หลัง build release
- `android:exported` — ให้มีแค่ activity หลักที่เป็น `true` ส่วนตัวอื่นต้องมีเหตุผล
- `android:allowBackup` / `dataExtractionRules` — ตั้งชัดว่าข้อมูลไหนสำรองได้ ไม่ปล่อยค่าเริ่มต้น
- `android:debuggable` ต้องไม่มีใน release และ `usesCleartextTraffic` ต้องไม่เป็น `true`
- permission เท่าที่ใช้จริง — แอปออฟไลน์ต้องไม่มี `INTERNET` และต้องตรวจตัวที่ plugin เติมมาด้วย
- `key.properties` · `*.jks` · `*.keystore` ไม่อยู่ใน git (`git ls-files` แล้วค้น)
