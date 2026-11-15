# สาย infrastructure · cloud · container

เปิดเมื่อ repo มี Terraform · OpenTofu · Pulumi · docker-compose · Dockerfile · Kubernetes YAML · Helm chart · ไฟล์ตั้งค่า cloud หรือเมื่อผู้ใช้สั่ง `/security-scan infra` · รายการนี้ย้ายมาจากรายการตรวจ infrastructure เดิมของคำสั่ง `/security-scan` (ก่อน 2026-11-10 อยู่ใน `security-scan/SKILL.md`)

## กติกาประจำสาย

- ตรวจจากไฟล์ใน repo เท่านั้น · ห้ามสแกนพอร์ต ห้ามเรียก cloud จริง ห้ามเปิด bucket ของจริงเพื่อพิสูจน์ เว้นแต่ผู้ใช้อนุญาตเป็นข้อความและเป็นสภาพแวดล้อมทดสอบ
- ผลจาก `trivy config` · `checkov` · `tfsec` · `hadolint` เป็น candidate ของสายนี้ ยังไม่ใช่ finding (หัวข้อ 3 ของ SKILL.md)
- สภาพจริงบน cloud อาจต่างจากไฟล์ (แก้ในคอนโซลโดยไม่ผ่าน IaC) จึงมักจบที่ `needs_validation` ถ้าไม่มีสิทธิ์อ่านสภาพจริง
- วิธีเขียนและแก้ IaC อยู่ที่ [`infra-as-code`](../../infra-as-code/SKILL.md) · [`kubernetes-helm`](../../kubernetes-helm/SKILL.md) ไฟล์นี้บอกแค่ว่าล่าอะไร

## รายการล่า

| ประเภท (`class`) | ล่าอะไร | สัญญาณในไฟล์ | พิสูจน์อย่างไร | มักแจ้งผิดเมื่อ |
|---|---|---|---|---|
| `exposed-port` | พอร์ตหรือ service ที่เปิดให้ทั้งอินเทอร์เน็ตทั้งที่ควรเป็นวงใน (ฐานข้อมูล · Redis · SSH · หน้า admin) | security group `0.0.0.0/0` · `ports:` ใน compose ที่ bind `0.0.0.0` · Kubernetes `Service` แบบ `LoadBalancer` · NodePort ของฐานข้อมูล | อ่านกฎ ingress แล้วไล่ว่าทางจากอินเทอร์เน็ตถึง service ผ่านได้จริงหรือมีไฟร์วอลล์ชั้นอื่นกั้น | พอร์ต 80 · 443 ของเว็บที่ตั้งใจเปิด · เครื่องในเครือข่ายส่วนตัวที่ไม่มี public IP |
| `weak-iam` | สิทธิ์ของ role · service account · user กว้างเกินงาน | `"Action": "*"` · `"Resource": "*"` · `AdministratorAccess` · `roles/owner` · `cluster-admin` ผูกกับแอป · สิทธิ์เขียนทั้งที่งานแค่อ่าน | เทียบสิทธิ์ที่ให้กับสิ่งที่โค้ดเรียกจริง ถ้าเกินและโค้ดถูกเจาะได้ ผลคือเข้าถึงทรัพยากรอื่น | role ของ pipeline ที่ตั้งใจให้สิทธิ์กว้างและมีเงื่อนไขกำกับ · role ของผู้ดูแลที่ไม่ผูกกับแอป |
| `public-storage` | bucket · blob container · ฐานข้อมูลที่เปิดสาธารณะหรือเข้าได้โดยไม่ต้องยืนยันตัวตน | ACL `public-read` · policy `"Principal": "*"` · ปิด block public access · ฐานข้อมูลไม่มีรหัสผ่านหรือเปิด `0.0.0.0` | อ่าน policy ว่ารายการและอ่านออบเจ็กต์ได้โดยไม่มี credential หรือไม่ และเนื้อหาเป็นข้อมูลอะไร | bucket ของเว็บไซต์สาธารณะที่เก็บเฉพาะไฟล์สาธารณะ (CSS · รูปโลโก้) |
| `unencrypted-data` | storage หรือการส่งที่ไม่เข้ารหัส | `encrypted = false` · ไม่มี `kms_key` · `ssl_enforcement` ปิด · listener `HTTP` ไม่ redirect · เชื่อมฐานข้อมูลโดยไม่ใช้ TLS | อ่านค่าของ resource ที่เก็บข้อมูลส่วนบุคคลหรือค่าลับ แล้วดูว่าชั้นอื่นเข้ารหัสแทนหรือไม่ | ข้อมูลทดสอบ · volume ชั่วคราวที่ไม่เก็บข้อมูลจริง |
| `missing-security-headers` | เว็บหรือ API ไม่ส่ง header ป้องกันพื้นฐาน | ไม่มี `Strict-Transport-Security` · `Content-Security-Policy` · `X-Content-Type-Options` · `X-Frame-Options` ในตั้งค่า reverse proxy · CDN · ตัวแอป | อ่านตั้งค่า proxy และโค้ดแอปว่ามีที่ไหนใส่ header ให้หรือไม่ | API ที่ไม่มีหน้าเว็บ (CSP ไม่เกี่ยว) · header ที่ CDN ใส่ให้นอก repo |
| `insecure-default` | ค่าตั้งต้นที่ไม่ปลอดภัยถูกใช้ต่อ | รหัสผ่านตั้งต้น · debug เปิดบน production · CORS `*` พร้อม credential · cluster เปิด anonymous auth · container รันเป็น `root` · `privileged: true` | ดูว่าค่านั้นถูกใช้ในไฟล์ของ production จริง ไม่ใช่เฉพาะไฟล์ dev | ไฟล์ compose สำหรับเครื่อง dev ที่ไม่ได้ deploy |
| `container-image-risk` | image ที่มีช่องโหว่หรือที่มาไม่น่าเชื่อถือ | `FROM xxx:latest` · base image เก่าที่ผล `trivy image` มี CVE ระดับสูง · ไม่ pin ด้วย digest · ติดตั้งเครื่องมือ build ค้างใน image สุดท้าย · ลืมตั้ง `USER` | รันหรืออ่านผล `trivy image` แล้วเช็กว่า CVE นั้นถึงโค้ดที่ image ใช้จริงหรือไม่ (เหมือน `vulnerable-dep-reachable` ใน [`classes-supply-chain`](classes-supply-chain.md)) | CVE ในแพ็กเกจที่ image ไม่ได้เรียกใช้ · stage แรกของ multi-stage build ที่ไม่ถูกส่งออก |

## เกี่ยวกับสายอื่น

- build และ CI/CD (workflow · lockfile · registry) อยู่ที่ [`classes-supply-chain`](classes-supply-chain.md)
- ค่าลับที่หลุดใน IaC ไปที่หัวข้อ 4 ของ [`attack-classes`](attack-classes.md) · SSRF ไปเมตาดาต้าของ cloud อยู่ที่หัวข้อ 9 ของไฟล์เดียวกัน
- ระดับความรุนแรงใช้ตามหัวข้อ 5 ของ SKILL.md เฉพาะข้อที่ confirmed
