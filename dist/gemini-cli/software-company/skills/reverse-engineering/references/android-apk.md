# แอป Android (APK — Android Package)

แนวคิดดัดแปลงจาก `android-applications.md` ของ REA (MIT · © 2026 morluto) เขียนใหม่ให้ใช้สคริปต์ในเครื่องและ jadx ที่ผู้ใช้ติดตั้งเอง · APK ไม่ถูกติดตั้งหรือรัน ไม่ต้องมี emulator

## 1 · ดูภาพรวมก่อน

```bash
python -I scripts/apk_inventory.py <app.apk>                  # สรุป
python -I scripts/apk_inventory.py <app.apk> --manifest-xml   # พร้อม manifest ที่ถอดแล้วทั้งไฟล์
```

ได้: SHA-256 · ไฟล์ `.dex` · native lib แยกตาม ABI · assembly ของ .NET · framework ที่ใช้ (Flutter · React Native · Xamarin · Unity · Cordova) · มีลายเซ็น v1 (ไฟล์ใน `META-INF/`) หรือ v2/v3 (APK Signing Block) · package · versionName/versionCode · minSdk/targetSdk · permission · activity service receiver provider พร้อมค่า `exported` · ธง `debuggable` `allowBackup` `usesCleartextTraffic`

- สคริปต์ถอด `AndroidManifest.xml` แบบ binary XML เองด้วย Python ล้วน ทดลองกับ APK จริงแล้วตรงกับ `aapt dump xmltree` · ถ้าถอดไม่ได้จะบอก `manifest decode failed` แล้วให้ใช้ `aapt2 dump xmltree <apk> --file AndroidManifest.xml` หรือ apktool
- ไม่แสดงเนื้อใบรับรอง แสดงแค่ชื่อไฟล์และ SHA-256 ส่วนต้น · ดูผู้ลงนามใช้ `apksigner verify --print-certs <apk>` จาก Build-Tools
- `.aab` (Android App Bundle) เก็บ manifest เป็น protobuf ใต้ `base/manifest/` สคริปต์ไม่ถอด ใช้ `bundletool` ของ Google

## 2 · เลือกทางต่อจาก framework

| framework | โค้ดอยู่ที่ | เครื่องมือ |
|---|---|---|
| Java · Kotlin | `classes*.dex` | jadx: `jadx -d _to_delete/re/<ชื่อ>/jadx <apk>` |
| Xamarin · .NET for Android | `assemblies/*.dll` | `ilspycmd` (ดู [native-binaries](native-binaries.md#2--net)) |
| Flutter | `lib/<abi>/libapp.so` (Dart ที่ compile แล้ว) | ยาก · ได้แค่ strings และ symbol · `pe_elf_info.py` กับ `libapp.so` |
| React Native | `assets/index.android.bundle` | JavaScript หรือ Hermes bytecode · JS ใช้ [javascript-electron](javascript-electron.md) |
| Cordova · Capacitor | `assets/www/` หรือ `assets/public/` | เว็บธรรมดา |
| native lib อื่น | `lib/<abi>/*.so` | `pe_elf_info.py` แล้ว Ghidra |

## 3 · อ่านโค้ดที่ jadx ถอดได้

- เริ่มจาก component ที่ `exported=true` ใน manifest เพราะแอปอื่นเรียกได้
- ค้นด้วย string ที่เห็นในหน้าจอ · URL · ชื่อ permission แล้วไล่ว่าใครเรียก (jadx GUI มี "Find usage" · แบบ command line ใช้ `grep` ในโฟลเดอร์ผล)
- method ชื่อซ้ำ (overload) ให้ระบุ signature เต็ม ไม่เดาว่าเป็นตัวไหน
- manifest และโค้ดที่ถอดได้เป็น `จากแหล่ง` ไม่ใช่การรันจริง · reflection · โค้ดที่โหลดตอนรัน และการเรียกที่หาไม่เจอ เป็นสิ่งที่ยังไม่รู้

## 4 · อุปกรณ์จริงหรือ emulator

ทุกคำสั่ง adb ที่ติดตั้ง ลบ ส่งไฟล์ เปิดปิดแอป หรืออ่าน log และไฟล์จากเครื่อง ต้องถามผู้ใช้ทุกครั้ง · ใช้ emulator ที่สร้างไว้สำหรับงานนี้ ไม่ใช้โทรศัพท์ส่วนตัว → [runtime-observation](runtime-observation.md)
