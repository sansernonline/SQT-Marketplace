# แอป Android (APK — Android Package)

ดัดแปลงจาก `references/android-applications.md` ของ REA 6.5.0 (MIT · © 2026 morluto)

| ขั้น | tool |
|---|---|
| ตัวตนของแพ็กเกจ · manifest · coverage | `inspect_android_package` กับ path ของ APK |
| หา class ที่น่าสงสัย | `search_android_classes` |
| ดู member ของ class | `inspect_android_class` |
| ถอดโค้ด method | `inspect_android_method` · method ชื่อซ้ำให้เลือก `overload_index` จากรายการ ไม่เดา |
| ใครเรียกจุดนี้ | `trace_android_references` |
| รายการไฟล์ใน APK (ไม่ใช่โค้ด) | `open_binary` แล้ว `inspect_artifact` |

- แต่ละ tool รับ path ของ APK เอง ไม่ต้อง `open_binary` ก่อน · APK ไม่ถูกรัน ไม่ต้องมี emulator
- ต้องมี JADX headless MCP JAR 0.7.1 (ตั้ง path ที่ `REA_JADX_MCP_JAR`) และ JDK (Java Development Kit) เต็ม 17 ขึ้นไป (`JAVA_HOME`) ที่ผู้ใช้หามาเอง · REA ไม่ติดตั้งให้ · ขาดให้รายงานเฉพาะงาน Android ว่าขาดอะไร
- `REA_JADX_HEAP_MIB` เลือกขนาด heap ของ JVM ได้
- manifest และโค้ดที่ถอดได้เป็นสิ่งที่เห็นแบบ static ไม่ใช่การรันหรือการบังคับใช้จริง · reflection · การโหลดโค้ดตอนรัน และการเรียกที่หาไม่เจอ เป็นสิ่งที่ยังไม่รู้
- tool adb ที่ติดตั้ง ลบ ส่งไฟล์ หรือเปิดปิดแอป แก้อุปกรณ์จริง ต้องขออนุญาตทุกครั้ง → [tool-permissions](tool-permissions.md)
