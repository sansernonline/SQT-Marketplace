# skill: background-jobs

Use when work runs outside the request in queues or schedules

# งานเบื้องหลัง

> **กฎข้อเดียว:** งานเบื้องหลังทุกตัวต้อง**รันซ้ำได้โดยไม่เกิดผลซ้ำ**
> เพราะมันจะถูกรันซ้ำแน่นอน: เครื่องดับกลางทาง · คนกดใหม่ · ระบบ retry ให้เอง

## เมื่อไหร่ใช้ skill นี้

- งานที่ผู้ใช้ไม่ควรต้องนั่งรอ: ส่งอีเมล สร้างรายงาน นำเข้าไฟล์
- งานตามเวลา: สรุปรายวัน ปิดยอดสิ้นเดือน ลบข้อมูลที่หมดอายุ
- เรียกระบบภายนอกที่ช้าหรือล่มบ่อย
- คิวตันหรือมีงานหายแล้วไม่มีใครรู้

## เมื่อไหร่ใช้ตัวอื่นแทน หรือใช้คู่กัน

| งาน | skill | |
|---|---|---|
| timeout และการ retry ของคำขอปกติ | `error-handling-patterns` | แทน |
| event ข้ามหลาย service ผ่าน Kafka (หลาย consumer อ่าน event เดียวกัน · เก็บย้อนหลัง) | `kafka-streaming` | แทน |
| คิวงานผ่าน RabbitMQ (หลาย worker · retry · dead letter · ต้องมี broker จริง) | `rabbitmq-messaging` | แทน |
| ตัวชี้วัดและการแจ้งเตือน | `observability-basics` | แทน |
| เลือกสถาปัตยกรรมภาพรวม | `architecture-patterns` | แทน |
| นำเข้าไฟล์ Excel/CSV เป็นเนื้องาน | `data-import-export` | แทน |
| ส่งอีเมล/SMS เป็นเนื้องาน | `notifications` | แทน |
| ตารางงานและ index | `database-design` | คู่ |
| log ของ worker และ correlation id | `logging-standards` | คู่ |
| งานลบข้อมูลที่หมดอายุ | `pdpa-compliance` | คู่ |
| ตัวย่อในงานที่คนอ่าน | `spell-out-abbreviations` | คู่ |
| ออกแบบระบบ agent (Loop · Graph · Dynamic · เลือก framework) | `llm-engineering` → [`agent-systems.md`](../llm-engineering/references/agent-systems.md) | คู่ |

---

## 1 · อะไรควรไปอยู่เบื้องหลัง

| เอาไปเบื้องหลัง | ทำในคำขอเลย |
|---|---|
| ใช้เวลาเกิน 1–2 วินาที | เร็วและผู้ใช้ต้องเห็นผลทันที |
| เรียกระบบภายนอกที่ล้มได้ | ตรวจสิทธิ์ · ตรวจข้อมูล |
| ผู้ใช้ไม่ต้องรอผล (อีเมล แจ้งเตือน) | ผลลัพธ์คือสิ่งที่เขากดมาดู |
| งานหลายรายการเป็นชุด | |

> **อย่าเอาไปเบื้องหลังเพียงเพราะมันช้า** ถ้าผู้ใช้ต้องเห็นผลก่อนไปต่อ
> การย้ายไปเบื้องหลังจะต้องเพิ่มหน้าจอรอ การแจ้งเตือน และที่เก็บผลลัพธ์
> บางครั้งแก้ให้เร็วขึ้นถูกกว่ามาก (ดู `lazy-coding`)

---

## 2 · เลือกกลไก

| กลไก | เหมาะกับ | ระวัง |
|---|---|---|
| **ตารางงานในฐานข้อมูล** | ระบบเล็ก–กลาง · งานไม่เกินหลักพันต่อวัน | ต้องเขียนตัวหยิบงานเอง · ระวัง worker แย่งงานกัน |
| **คิวจริง** (Redis · RabbitMQ · Amazon Simple Queue Service (SQS)) | งานเยอะ · ต้องการ retry และ dead letter ในตัว | เพิ่มของที่ต้องดูแล |
| ตัวตั้งเวลาในแอป (cron ในโค้ด) | งานตามเวลาที่มี instance เดียว | **หลาย instance จะรันพร้อมกัน** · ดูข้อ 5 |
| ตัวตั้งเวลาของแพลตฟอร์ม | งานตามเวลาบนคลาวด์ | |

**ถ้าระบบยังเล็ก ให้เริ่มจากตารางในฐานข้อมูลก่อนเสมอ** เพราะ `SELECT ... FOR UPDATE SKIP LOCKED`
ของ PostgreSQL ให้หลาย worker หยิบงานพร้อมกันได้อย่างปลอดภัย โดยไม่ต้องเพิ่มระบบใหม่

**ทุกงานต้องมีอย่างน้อย:** `id` · `type` · `payload` · `status` · `attempts` ·
`run_after` · `locked_by` · `locked_at` · `last_error` · `created_at`

---

## 3 · รันซ้ำแล้วต้องไม่เกิดผลซ้ำ

ระบบคิวเกือบทั้งหมดรับประกันแค่ว่า "ส่งถึงอย่างน้อย 1 ครั้ง" **ไม่ใช่ 1 ครั้งพอดี**

| วิธี | ใช้ยังไง |
|---|---|
| **กุญแจกันซ้ำ** | unique constraint บน `(job_type, business_key)` ทำให้งานซ้ำ insert ไม่ผ่าน |
| **ตรวจสถานะก่อนทำ** | "ถ้าใบสั่งซื้อนี้ส่งอีเมลไปแล้ว ให้จบเลย" |
| **ส่งต่อ idempotency key** | เวลาเรียก API ภายนอก (ดู `api-conventions`) |
| **ตั้งค่าให้เป็นค่าใหม่ ไม่บวกเพิ่มจากค่าเดิม** | `set status = 'paid'` ปลอดภัยกว่า `balance = balance + 100` |

> **งานที่บวกค่าหรือส่งของออกไปข้างนอก ถ้ารันซ้ำจะเสียเงินจริง**
> อีเมล 2 ฉบับแค่น่ารำคาญ แต่โอนเงิน 2 ครั้งเป็นเรื่องใหญ่

---

## 4 · retry และงานที่ตายแล้ว

ตัวเลขนี้สำหรับงานในคิว · ลองใหม่นอกคิวใช้ของ [`error-handling-patterns`](../error-handling-patterns/SKILL.md) §4: service เรียก service ใช้ 3 ครั้ง 1/2/4 วินาที · มีคนรอหน้าจอ → retry ไม่เกิน 1 ครั้งแล้วให้กดเอง

```
ล้ม → รอ 1 นาที → ล้ม → รอ 4 นาที → ล้ม → รอ 16 นาที → ล้มครั้งที่ 4 → dead letter
```

| กฎ | รายละเอียด |
|---|---|
| **มีเพดานเสมอ** | 3–5 ครั้ง ถ้า retry ไม่จำกัด งานเดียวก็ทำให้คิวตัน |
| เว้นเวลาเพิ่มขึ้นทุกรอบ (เท่าตัวคงที่ เช่น ×4) + สุ่มเล็กน้อย | เหมือน `error-handling-patterns` |
| ข้อมูลผิดไม่ต้อง retry | payload ผิดรูปแบบ ลองอีกกี่ครั้งก็เหมือนเดิม |
| **งานที่หมดสิทธิ์ต้องไปที่เดียว** | dead letter (ที่เก็บงานที่ล้มจนหมดสิทธิ์) โดยเก็บ payload เต็มและ error ล่าสุด |
| ต้องมีคนดู dead letter | **แจ้งเตือนเมื่อมีงานเข้าไปใหม่** ไม่ใช่รอให้ลูกค้าทัก |
| เอากลับมารันใหม่ได้ | แก้ต้นเหตุแล้วสั่งรันใหม่จาก dead letter ได้ โดยไม่ต้องเขียนสคริปต์ |

**งานที่ค้างเพราะ worker ตาย** ต้องมีตัวปลดล็อก
งานที่ `locked_at` เก่ากว่า N นาที ให้ถือว่าไม่มีใครทำอยู่แล้ว แล้วปลดล็อกให้ worker อื่นหยิบไปทำต่อ

**สถานะของงานเป็นเครื่องสถานะ ไม่ใช่ boolean** (แนวคิดจาก wshobson python-background-jobs) — ทุกกลไกในข้อ 2 ต้องตอบได้ว่างานอยู่สถานะไหนใน `queued → running → succeeded` หรือ `running → failed (attempts < เพดาน) → queued` หรือ `failed → dead` · เก็บ `attempts` · `locked_at` · `last_error` · `finished_at` ไว้กับงาน · เดินได้เฉพาะลูกศรข้างบน (งาน `succeeded` กลับไป `running` ไม่ได้ ต้องสร้างงานใหม่) · หน้าจอแอดมินและ dead letter อ่านจากสถานะนี้ที่เดียว

---

## 5 · งานตามเวลา

> **ถ้ามีหลาย instance งานตามเวลาจะรันหลายรอบพร้อมกัน**
> รายงานสรุปยอดถูกส่ง 3 ฉบับ หรือหักเงิน 3 ครั้ง ก็เพราะข้อนี้

| วิธี | ใช้เมื่อ |
|---|---|
| ล็อกที่ฐานข้อมูล (advisory lock) | ทำได้ทันที ไม่ต้องเพิ่มของ |
| ตัวตั้งเวลาของแพลตฟอร์มยิงเข้ามาที่ endpoint | บนคลาวด์ · Kubernetes CronJob |
| ตัวตั้งเวลาที่รองรับหลาย instance โดยตรง | Quartz · Hangfire |

**กฎของงานตามเวลา:**

- **รับช่วงเวลาเป็นพารามิเตอร์** จะได้รันย้อนหลังวันที่พลาดได้โดยไม่ต้องแก้โค้ด
- ถ้าตกไป 1 รอบ ต้องตามเก็บได้ ไม่ข้ามไปเลย
- ระบุเขตเวลาให้ชัดว่า "ทุกเที่ยงคืน" ของเขตเวลาไหน (ดู `i18n-and-locale`)
- **บันทึกว่ารันรอบไหนสำเร็จแล้ว** ไม่ใช่ดูจาก log

---

## 6 · งานยาวที่ผู้ใช้รออยู่

| ต้องมี | รายละเอียด |
|---|---|
| id ของงาน | คืนให้ทันทีที่รับงาน ผู้ใช้เอาไว้ถามความคืบหน้า |
| สถานะ | `queued` · `running` · `succeeded` · `failed` · `cancelled` |
| ความคืบหน้า | "ทำแล้ว 340 จาก 1,200 รายการ" ไม่ใช่หมุนเปล่า ๆ |
| ยกเลิกได้ | งานต้องเช็คสัญญาณยกเลิกเป็นระยะ |
| ผลลัพธ์ | เก็บไว้ให้ดาวน์โหลดได้ พร้อมวันหมดอายุ |
| แจ้งเมื่อเสร็จ | อีเมลหรือแจ้งเตือนในระบบ (ดู `notifications`) |

**แบ่งงานใหญ่เป็นชิ้นเล็ก** เช่น นำเข้า 50,000 แถว ให้แบ่งเป็นงานย่อยละ 500 แถว
เพราะงานเดียวที่ใช้เวลา 40 นาที ถ้าล้มที่นาทีที่ 39 ต้องเริ่มใหม่ทั้งหมด

---

## 7 · วัดอะไร

| ตัวชี้วัด | เตือนเมื่อ |
|---|---|
| จำนวนงานค้างในคิว | โตขึ้นเรื่อย ๆ ไม่ลดลง |
| เวลารอในคิว (p95 · 95% ของงานรอไม่เกินค่านี้) | เกินที่สัญญาไว้ |
| อัตราความล้มเหลว | เกินเกณฑ์ |
| **จำนวนใน dead letter** | **เพิ่มขึ้นแม้แค่ตัวเดียว** |
| รอบของงานตามเวลาที่ไม่ได้รัน | ข้ามรอบ |
| งานที่ค้างอยู่ในสถานะ running นานผิดปกติ | เกิน N เท่าของค่าปกติ |

> **คิวที่ตันจะเงียบสนิท** API ยังตอบ 200 ทุกคำขอ health check เขียวหมด
> แต่ไม่มีอีเมลออกไป 3 ชั่วโมงแล้ว ต้องวัดถึงจะเห็น

---

## 8 · Anti-patterns

- **งานที่รันซ้ำแล้วเกิดผลซ้ำ** — คิวจะรันซ้ำแน่นอน ไม่ใช่อาจจะ
- **retry ไม่จำกัด** — งานเดียวที่พังทำให้ทั้งคิวตัน
- **ไม่มี dead letter** — งานหายเงียบ ๆ ไม่มีใครรู้
- **มี dead letter แต่ไม่มีใครดู** — เท่ากับไม่มี
- **งานตามเวลาบนหลาย instance โดยไม่มีล็อก** — รันซ้อนกัน
- **ส่งข้อมูลทั้งก้อนใน payload** — ควรส่ง id แล้วให้งานไปอ่านเอง จะได้ข้อมูลล่าสุดด้วย
- **งานยาวที่ยกเลิกไม่ได้** — ผู้ใช้กดผิดแล้วต้องรอ 40 นาที
- **หน้าจอที่หมุนเปล่าโดยไม่บอกความคืบหน้า** — ผู้ใช้จะกดซ้ำ แล้วได้งานซ้ำ
- **ไม่วัดคิว** — ตันแล้วรู้ตอนลูกค้าโทรมา

---

## 9 · durable workflow สำหรับงาน agent ที่รันยาวหรือรอคนอนุมัติ

งาน agent ที่วิ่งหลายสิบนาที เรียก LLM และ tool หลายรอบ หรือหยุดรอคนอนุมัติข้ามวัน ใช้คิวธรรมดาไม่พอ เพราะถ้าล้มที่ขั้น 8 จาก 10 ต้องเริ่มใหม่และจ่ายค่า token ซ้ำ · ให้ใช้ engine ที่บันทึกผลทุกขั้นแล้วทำต่อจากจุดเดิมได้

| เครื่องมือ | เหมาะกับ | รอคนอนุมัติด้วย | ระวัง |
|---|---|---|---|
| **Temporal** | โค้ด Python และภาษาอื่น · loop ของ agent อยู่ใน workflow ส่วนการเรียก LLM และ tool เป็น activity · มี `OpenAIAgentsPlugin` · `activity_as_tool` | (ยังไม่ได้ตรวจ หน้า signal) | integration กับ OpenAI Agents SDK ยังเป็น Public Preview |
| **AWS Step Functions** | ขั้นตอนตายตัวบน AWS · fan-out ด้วย `Map` (Inline ขนาน 40 · Distributed 10,000 งานลูก) | `.waitForTaskToken` รอได้ถึง 1 ปีจนมี `SendTaskSuccess` / `SendTaskFailure` · ตั้ง `HeartbeatSeconds` กันค้างเงียบ | งานที่ต้องให้ LLM ตัดสินทาง ต้องให้ Lambda หรือ Bedrock ตัดสินแล้วใช้ `Choice` |
| **checkpointer ของ framework agent** | ไม่อยากเพิ่ม engine · LangGraph `PostgresSaver` · Microsoft Agent Framework `CheckpointManager` · OpenAI `RunState.to_json()` | LangGraph `interrupt()` · OpenAI `needs_approval` · Microsoft Agent Framework `RequestInfoExecutor` | ตัวเก็บในหน่วยความจำหายเมื่อ process รีสตาร์ต · ใช้ตัวที่เก็บลงฐานข้อมูลใน production |

**กฎของโค้ดที่ต้อง replay ได้** (Temporal · Google ADK · Claude Code workflow ใช้หลักเดียวกัน · ตรวจกับ [Temporal: Workflow Definition](https://docs.temporal.io/workflow-definition) 2026-10-26)

- **ห้ามอ่านเวลาหรือสุ่มค่าในโค้ดที่คุมลำดับงาน** (`Date.now()` · `datetime.now()` · `Math.random()` · `uuid4()`) · ตอน replay ค่าจะต่างจากรอบแรก ลำดับงานเพี้ยน แล้วรีใช้ผลเดิมไม่ได้ · ต้องใช้เวลาหรือค่าสุ่ม ให้ทำใน activity หรือใช้ API ของ SDK ที่ให้มาสำหรับเรื่องนี้
- **การเรียก LLM เรียก tool และอ่านเขียนข้างนอกทั้งหมดอยู่ใน activity** ผลถูกบันทึกครั้งเดียว ตอน replay อ่านจากบันทึก ไม่เรียกซ้ำ
- **ลำดับการเรียกต้องเหมือนเดิมทุกรอบ** · แก้ลำดับขั้นในโค้ดที่ยังมีงานค้างอยู่ จะทำให้งานเก่า replay ไม่ผ่าน (Temporal เรียกว่า nondeterminism error) · ต้องเปลี่ยนให้ใช้ versioning หรือ patching ของ engine
- **ขั้นก่อนจุดหยุดรอต้องรันซ้ำได้** (ข้อ 3) · LangGraph รัน node ที่หยุดไว้ใหม่ตั้งแต่ต้นตอน resume จึงย้ายผลข้างเคียงไปไว้หลังจุดหยุด
- **state ที่บันทึกไว้ไม่มีการยืนยันตัวตน** (เอกสาร OpenAI เตือนเรื่อง `RunState`) · โหลดจากที่เก็บที่เราคุมเท่านั้น
- เพดานรอบ งบ token และการหยุดเมื่อไม่ดีขึ้นยังต้องมีเหมือนงานในคิว · รายละเอียดใน [`agent-systems.md`](../llm-engineering/references/agent-systems.md) หัวข้อ 6

ที่มา (เปิดอ่าน 2026-10-26): [Temporal · OpenAI Agents SDK](https://docs.temporal.io/ai-cookbook/openai-agents-sdk-python) · [ประกาศ Temporal](https://temporal.io/blog/announcing-openai-agents-sdk-integration) · [Step Functions integration patterns](https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html) · [Step Functions Map](https://docs.aws.amazon.com/step-functions/latest/dg/state-map.html) · [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) · [OpenAI human in the loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) · [Claude Code workflows](https://code.claude.com/docs/en/workflows)


---

# skill: observability-basics

Use when a live system needs metrics, logs or alerts

# วัดผลและเฝ้าระบบ

> **กฎข้อเดียว:** ถ้าลูกค้าเป็นคนบอกเราว่าระบบล่ม แปลว่าการเฝ้าระวังล้มเหลว
> ไม่ใช่ว่าลูกค้าใจดี

## เมื่อไหร่ใช้ skill นี้

- ระบบมีผู้ใช้จริงแล้ว
- มีคนถามว่า "ตอนนี้ระบบปกติดีไหม" แล้วต้องไปเปิด log ดูถึงจะตอบได้
- ถูกปลุกกลางดึกด้วยการแจ้งเตือนที่ไม่ต้องทำอะไร
- ระบบช้าแล้วไม่รู้ว่าช้าตรงไหน

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| รูปแบบบรรทัด log และการปิดบัง | `logging-standards` |
| ร่องรอยว่าใครทำอะไร | `audit-trail` |
| endpoint health check | `web-service-essentials` |
| ขั้นตอนตอนเกิดเหตุ | `incident-runbook-template` |
| สรุปหลังเหตุการณ์ | `postmortem-template` |

---

## 1 · สามอย่างนี้ตอบคนละคำถาม

| | ตอบคำถาม | ตัวอย่าง | ต้นทุน |
|---|---|---|---|
| **metric** (ตัวชี้วัด) | "ตอนนี้แย่ไหม แย่ขึ้นหรือลง" | error 2.3% · p95 = 840 ms | ถูกสุด เก็บได้นาน |
| **log** (บันทึก) | "คำขอนั้นเกิดอะไรขึ้น" | ข้อความ + stack trace + id | แพงปานกลาง |
| **trace** (การไล่รอย) | "ช้าที่ขั้นตอนไหน" | คำขอเดียว ผ่าน 5 service | แพงสุด สุ่มเก็บ |

**ลำดับการใช้เวลาเกิดเหตุ:** metric บอกว่า**มีปัญหา** → trace บอกว่า**ตรงไหน** → log บอกว่า**ทำไม**
ทั้ง 3 อย่างต้องเชื่อมกันด้วย correlation id ตัวเดียวกัน (ดู `logging-standards`)

---

## 2 · สี่สัญญาณที่ต้องวัด

| สัญญาณ | วัดอะไร | ตัวเลขที่ดู |
|---|---|---|
| **อัตราคำขอ** | มีงานเข้ามาเท่าไหร่ | ต่อวินาที แยกตาม endpoint |
| **อัตราความผิดพลาด** | ล้มกี่เปอร์เซ็นต์ | แยก 4xx (ผู้ใช้ผิด) กับ 5xx (เราผิด) |
| **เวลาตอบสนอง** | ช้าแค่ไหน | **p50 · p95 · p99** |
| **ทรัพยากร** | ใกล้เต็มไหม | CPU · หน่วยความจำ · พื้นที่ · connection pool |

> **ห้ามดูค่าเฉลี่ยของเวลาตอบสนอง** — เฉลี่ย 200 ms ฟังดูดี
> ทั้งที่ผู้ใช้ 5% รอ 9 วินาที ค่าเฉลี่ยกลบคนที่เจอปัญหาเสมอ **ดู p95 และ p99**

**สำหรับคิวและงานเบื้องหลัง** เพิ่มอีก 3 ตัว — งานค้างในคิว · เวลารอในคิว · งานที่ล้มถาวร
(ดู `background-jobs`)

---

## 3 · ตั้งชื่อตัวชี้วัด

```
<โดเมน>_<สิ่งที่วัด>_<หน่วย>

http_requests_total              จำนวนสะสม
http_request_duration_seconds    ระยะเวลา
orders_created_total             เหตุการณ์ทางธุรกิจ
queue_depth_jobs                 ค่า ณ ขณะนั้น
```

| กฎ | เหตุผล |
|---|---|
| ลงท้ายด้วยหน่วยเสมอ | `_seconds` ไม่ใช่ `_time` ที่ไม่มีใครรู้ว่าวินาทีหรือมิลลิวินาที |
| ค่าสะสมลงท้าย `_total` | บอกว่าเป็นค่าที่เพิ่มขึ้นเรื่อย ๆ ไม่ใช่ค่าปัจจุบัน |
| ใช้ label แทนการสร้างชื่อใหม่ | `http_requests_total{route,status}` ไม่ใช่ชื่อแยกต่อ endpoint |
| **label ห้ามมีค่าที่ไม่จำกัด** | ถ้าใส่ user id หรือ order id เป็น label ระบบเก็บ metric จะรับไม่ไหว |

### 3.1 · ถ้าใช้ Prometheus และ Grafana

- **ชนิด metric:** counter ใช้นับเหตุการณ์ (อ่านด้วย `rate()`) · gauge ใช้ค่า ณ ตอนนี้ · histogram ใช้ระยะเวลาที่ต้องหา p95 · summary ใช้เมื่อไม่ต้องรวมข้าม instance
- **หน่วย:** วินาที · byte · ratio 0 ถึง 1 (`_seconds` ไม่ใช่ `_milliseconds`)
- **ห้ามใส่ `user_id` · เบอร์โทร · `call_id` เป็น label** เพราะทุกค่าใหม่คือ series ใหม่ 1 เส้น จนระบบเก็บ metric รับไม่ไหว · id เหล่านี้ลง log และ trace
- p95: `histogram_quantile(0.95, sum by (le) (rate(<ชื่อ>_bucket[5m])))`
- alert ทุกกฎมี `for:` · `severity` · ลิงก์ runbook · เตือนจากอาการ (latency · error) ไม่เตือนจาก CPU หรือ GPU
- dashboard เก็บเป็น JSON ใน git แล้ว provision ด้วยไฟล์ · RED ต่อ service · USE ต่อทรัพยากร
- รายละเอียด PromQL · ตัวอย่างกฎ alert · provisioning · ตัวอย่างระบบ voice agent (latency STT · LLM · TTS · lag ของ Kafka · GPU): `references/prometheus-grafana.md`

---

## 4 · การแจ้งเตือน

> **แจ้งเตือนทุกครั้งต้องมีอะไรให้ทำ** — ถ้าคนรับอ่านแล้วไม่ต้องทำอะไร
> อีก 3 สัปดาห์เขาจะปิดเสียงแจ้งเตือน แล้ววันที่ของจริงเกิดก็จะไม่มีใครเห็น

**แจ้งเตือนจากสิ่งที่ผู้ใช้รู้สึก ไม่ใช่จากตัวเลขของเครื่อง**

| ✗ เตือนแบบนี้ | ✓ เตือนแบบนี้ |
|---|---|
| CPU เกิน 80% | อัตรา error เกิน 2% นาน 5 นาที |
| หน่วยความจำเกิน 70% | p95 ของหน้าชำระเงินเกิน 3 วินาที นาน 10 นาที |
| pod restart | คำสั่งซื้อสำเร็จลดลงเกิน 50% เทียบกับสัปดาห์ก่อน |
| disk 60% | **disk จะเต็มใน 4 ชั่วโมงตามอัตราปัจจุบัน** |

| ระดับ | ตัวอย่าง | ส่งไปไหน |
|---|---|---|
| **ปลุกคน** | ผู้ใช้ใช้งานไม่ได้ · ข้อมูลกำลังเสียหาย | โทร · push |
| **ดูในเวลางาน** | disk จะเต็มใน 3 วัน · error เพิ่มแต่ยังไม่มาก | แชตของทีม |
| **แค่บันทึกไว้** | ทุกอย่างที่เหลือ | แดชบอร์ด |

**ทุกการแจ้งเตือนต้องมี:** อะไรพัง · กระทบใคร · **ลิงก์ไป runbook** · ลิงก์ไปแดชบอร์ด
**ตั้งช่วงเวลา (นาน N นาที) เสมอ** ไม่ใช่เตือนทันทีที่ค่าพุ่งครั้งเดียว

### 4.1 · งบความผิดพลาด (error budget) และอัตราเผางบ (burn rate)

ระบบที่มี SLO ใช้วิธีนี้แทนการตั้งเกณฑ์ error % ตายตัว เพราะมันบอกว่า "ถ้าปล่อยไว้แบบนี้ งบทั้งเดือนจะหมดเมื่อไหร่" (แนวคิดจาก Google SRE Workbook)

- **งบ** = เวลาที่ยอมให้ล้มได้ใน 30 วัน → SLO 99.9% = 43 นาที · 99.5% = 3.6 ชั่วโมง · 99% = 7.2 ชั่วโมง
- **burn rate** = อัตรา error ตอนนี้ ÷ (1 − SLO) → burn 1 = งบหมดพอดีวันที่ 30 · burn 10 = หมดใน 3 วัน
- ตั้งแจ้งเตือน 3 ระดับตามตาราง และทุกระดับต้องเป็นจริงทั้งช่วงยาวและช่วงสั้น (ช่วงสั้น = 1/12 ของช่วงยาว) จะได้หยุดเตือนทันทีที่ระบบหาย

| ระดับ | burn rate | ช่วงยาว · ช่วงสั้น | กินงบไปแล้ว | SLO 99.9% แปลว่า error เกิน | ส่งไปไหน |
|---|---|---|---|---|---|
| ไหม้เร็ว | 14.4 | 1 ชั่วโมง · 5 นาที | 2% ของเดือน ใน 1 ชั่วโมง | 1.44% | ปลุกคน |
| ไหม้ช้า | 6 | 6 ชั่วโมง · 30 นาที | 5% ของเดือน ใน 6 ชั่วโมง | 0.6% | ปลุกคน |
| รั่วซึม | 1 | 3 วัน · 6 ชั่วโมง | 10% ของเดือน ใน 3 วัน | 0.1% | แชตของทีม |

งบเหลือเท่าไหร่ให้ขึ้นบนแดชบอร์ดภาพรวม — งบใกล้หมด = หยุดปล่อยฟีเจอร์ ไปแก้ความเสถียรก่อน เป็นกติกาที่ตกลงกับเจ้าของผลิตภัณฑ์ล่วงหน้า ไม่ใช่ตอนทะเลาะกัน

---

## 5 · แดชบอร์ด

ทำ 2 หน้าพอ

| หน้า | ตอบคำถาม | มีอะไร |
|---|---|---|
| **ภาพรวม** | "ตอนนี้ปกติไหม" | 4 สัญญาณของทั้งระบบ · สถานะ dependency · การปล่อยของล่าสุด |
| **เจาะลึกต่อ service** | "พังตรงไหน" | 4 สัญญาณแยกตาม endpoint · คิว · ฐานข้อมูล |

- **เส้นแนวตั้งบอกเวลาที่ deploy** — ปัญหาส่วนใหญ่เริ่มหลังเส้นนี้ และเห็นได้ในวินาทีเดียว
- หน้าภาพรวมต้องอ่านจบใน 10 วินาที จึงควรมีไม่เกิน 6 กราฟ
- ใส่เส้นเกณฑ์ที่ตั้งแจ้งเตือนไว้ในกราฟ จะได้รู้ว่าห่างจากเส้นแค่ไหน

---

## 6 · ตัวชี้วัดทางธุรกิจ

ตัวชี้วัดทางเทคนิคเขียวหมดแต่ธุรกิจหยุดเดิน เป็นเรื่องที่เกิดขึ้นจริงและตรวจไม่เจอถ้าไม่วัด

| ตัวอย่าง | จับอะไรได้ |
|---|---|
| คำสั่งซื้อสำเร็จต่อชั่วโมง | ปุ่มชำระเงินพังแม้ทุก endpoint คืน 200 |
| อัตราเข้าสู่ระบบสำเร็จ | ผู้ให้บริการยืนยันตัวตนภายนอกมีปัญหา |
| งานเบื้องหลังที่รอเกิน N นาที | คิวตัน แต่ API ยังตอบปกติ |
| อีเมลส่งไม่สำเร็จ | ลูกค้าไม่ได้รับใบเสร็จ โดยไม่มี error ที่ไหนเลย |

**เลือก 3–5 ตัวที่เป็นหัวใจของธุรกิจ** แล้วเตือนเมื่อมันตกผิดปกติเทียบกับช่วงเดียวกันของสัปดาห์ก่อน

---

## 7 · Anti-patterns

- **ดูค่าเฉลี่ยของเวลาตอบสนอง** — กลบคนที่เจอปัญหาทุกครั้ง
- **แจ้งเตือนที่ไม่ต้องทำอะไร** — สอนให้ทุกคนเลิกสนใจการแจ้งเตือน
- **เตือนจาก CPU และหน่วยความจำ** — ระบบที่ CPU 90% แต่ผู้ใช้ปกติ ไม่ใช่เหตุ
- **ใส่ id ที่ไม่จำกัดค่าเป็น label** — ระบบเก็บ metric ล่มเสียเอง
- **แดชบอร์ด 40 กราฟ** — ไม่มีใครรู้ว่าต้องดูอันไหน
- **วัดแต่เทคนิค ไม่วัดธุรกิจ** — ทุกอย่างเขียวแต่ไม่มีใครสั่งซื้อได้
- **เก็บ trace ทุกคำขอ** — แพงโดยไม่ได้อะไรเพิ่ม สุ่มเก็บก็พอ
- **ไม่มีเส้นบอกเวลา deploy** — เสียเวลาครึ่งชั่วโมงกว่าจะนึกได้ว่าเพิ่ง deploy ไป
- **แจ้งเตือนที่ไม่มีลิงก์ไป runbook** — คนรับต้องเริ่มค้นจากศูนย์ตอนตี 3

---

## 8 · ตัวย่อ

- **metric** — ตัวชี้วัด ตัวเลขที่เก็บตามเวลา
- **trace** — การไล่รอยคำขอหนึ่งตลอดเส้นทางที่มันวิ่งผ่าน
- **p95 / p99** — เปอร์เซ็นไทล์ที่ 95 และ 99 (ช้ากว่านี้มีแค่ 5% หรือ 1% ของคำขอ)
- **label / tag** — ป้ายกำกับที่แนบกับตัวชี้วัด ใช้แยกดูเป็นกลุ่ม
- **on-call** — เวรรับแจ้งเหตุนอกเวลาทำการ
- **SLO** — Service Level Objective (เป้าหมายระดับบริการที่ตั้งไว้เอง เช่น สำเร็จ 99.5%)
- **error budget / burn rate** — เวลาที่ยอมให้ล้มได้ต่อเดือนตาม SLO และความเร็วที่กำลังใช้มันหมด (ข้อ 4.1)

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รูปแบบ log และ correlation id | `logging-standards` |
| health check ที่ระบบเฝ้าใช้ | `web-service-essentials` |
| ตัวชี้วัดของคิวและงานเบื้องหลัง | `background-jobs` |
| อัตรา error และการตัดวงจร | `error-handling-patterns` |
| ขั้นตอนเมื่อการแจ้งเตือนดัง | `incident-runbook-template` |
| สรุปหลังเหตุการณ์ | `postmortem-template` |
| ตัวเลขเป้าหมายที่ตกลงกับลูกค้า | `srs-writing` |
| PromQL · กฎ alert · Grafana provisioning · ตัวอย่าง voice agent | `references/prometheus-grafana.md` |
| ให้ agent อ่าน Prometheus หรือ Grafana ผ่าน MCP | `mcp-server` ข้อ 1.1 |

ที่มาของข้อ 3.1: prometheus.io (metric types · naming · histograms · alerting) และ grafana.com (dashboard best practices · provisioning) ตรวจ 2026-10-27 · ลิงก์เต็มอยู่ท้าย `references/prometheus-grafana.md`


## reference: prometheus-grafana.md

# Prometheus and Grafana — using them correctly

Part of `observability-basics` · the thinking about what to measure and what to alert on is in `SKILL.md` sections 2 · 4 · 5 · this file says how to do it in Prometheus and Grafana · metric names and numbers labelled `ตัวอย่าง` (example) are hypothetical data and must be adjusted to the real system

## Contents

- [1 · The 4 metric types](#1--the-4-metric-types)
- [2 · Names and units](#2--names-and-units)
- [3 · Labels and cardinality](#3--labels-and-cardinality)
- [4 · Common PromQL](#4--common-promql)
- [5 · Alert rules](#5--alert-rules)
- [6 · Grafana](#6--grafana)
- [7 · Voice agent system example](#7--voice-agent-system-example)
- [8 · Check before sending](#8--check-before-sending)
- [9 · Sources](#9--sources)

## 1 · The 4 metric types

| Type | What it is | Use when | Example |
|---|---|---|---|
| counter | A cumulative value that only goes up and returns to 0 when the process restarts | Counting events that have happened (requests · errors · finished jobs) · read with `rate()`, never the raw value | `http_requests_total` |
| gauge | The value at that moment, can go up and down | Things that are pending or measurable right now (calls in progress · queue length · memory) | `voice_calls_active` |
| histogram | Counts measured values into ranges (buckets), with a sum and a count | Durations or sizes where you need p95 · p99 and want to aggregate across many instances | `http_request_duration_seconds` |
| summary | Computes quantiles on the app side, over a sliding time window | Use only when you do not need to aggregate across instances · the quantiles and window are chosen when writing the code and cannot be changed later | Rare; normally choose histogram |

- Never average quantiles from a summary across several instances; the result has no statistical meaning (the Prometheus docs use this wording)
- **How to choose** (prometheus.io/docs/practices/histograms/ checked 2026-10-27): if the library and Prometheus you use support it, use a native histogram first, because you can change the percentile and time window later in PromQL · if not supported but you need to aggregate across instances, use a classic histogram · use a summary only when you do not need to aggregate across instances
- The Prometheus docs recommend native histograms first, but the libraries that support them are still limited; if your library does not support them, use a classic histogram and place buckets so that an edge sits at the SLO value, otherwise the estimated p95 will be off (example in the docs: true p95 about 320 ms is estimated as 443 ms because the bucket is wide from 300 to 450 ms)

## 2 · Names and units

| Rule | Right | Wrong |
|---|---|---|
| Start with one word that names the system | `voice_stage_duration_seconds` | `stage_duration` |
| Use base units: seconds · bytes · ratio 0 to 1 | `_seconds` · `_bytes` · `_ratio` | `_milliseconds` · `_megabytes` · `_percent` |
| The unit goes at the end, in plural form | `node_memory_usage_bytes` | `node_memory_usage_byte` |
| A counter ends in `_total` (if it has a unit, the unit comes first) | `process_cpu_seconds_total` · `http_requests_total` | `http_requests_count` |
| 1 name, 1 unit, 1 meaning | All in seconds | Half in seconds, half in milliseconds |
| Do not put a label name again in the metric name | `http_requests_total{route=…}` | `http_requests_by_route_total` |

## 3 · Labels and cardinality

Every unique set of label values is 1 new time series. The Prometheus docs warn you to avoid labels whose values are unbounded, such as user id or email.

| Must not be a label | Use instead |
|---|---|
| `user_id` · `customer_id` · phone number · email | Leave it out · keep it in logs or traces · if you must count per person, use a database, not a metric |
| `call_id` · `session_id` · `request_id` · `trace_id` | Logs and traces tied to the same id (`logging-standards`) |
| A full URL that has an id or query string | A route template such as `/orders/{id}` |
| An error message with variable values | A limited set of error codes such as `reason="timeout"` |

- A label you may use must have all its possible values countable in advance (stage = 3 values · status = 5 groups) · the number of series of one metric is close to the product of the number of values in each label · a histogram multiplies by the number of buckets on top
- To find which metric makes series explode: open the TSDB status page in the Prometheus UI · the `tsdb_stats` tool of `prometheus-mcp` gives similar information (see `mcp-server` step 1.1)

## 4 · Common PromQL

| Need | Query | Note |
|---|---|---|
| Requests per second | `sum by (route) (rate(http_requests_total[5m]))` | The `[5m]` range should be several times the scrape interval (number not yet checked against the docs) |
| Error rate | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` | Count 5xx (our fault) apart from 4xx · with no traffic the quotient is NaN and the alert rule will not fire, which can hide a system receiving no requests at all; add a separate rule that alerts on no requests |
| p95 of latency (classic histogram) | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` | Keep `le` in `sum by` · to split by route, add `route` to `by` |
| p95 (native histogram) | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds[5m])))` | Use when the library and Prometheus support it |
| Average latency (for context only, never for deciding) | `rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])` | See `SKILL.md` section 2 |
| Disk will be full in 4 hours | `predict_linear(node_filesystem_avail_bytes[1h], 4*3600) < 0` | An example of saturation that warns ahead of time (not yet checked against the PromQL docs) |

## 5 · Alert rules

Principle from the Prometheus docs: alert on symptoms users feel (latency · errors) at the highest point in the stack you can · wake someone for latency at a single point of the stack · put causes (CPU · GPU · consumer lag) on the dashboard for tracing, and do not wake anyone for them · except for things a person must act on before the system goes down, such as capacity

Exception: a number users feel directly counts as a symptom even if it comes from an underlying system, such as Kafka consumer lag that makes callers wait for an answer (section 7); it may wake someone · lag that affects nobody right away, such as a report job after the call ends, is a cause; put it on the dashboard or the team chat

Every rule must have 4 things

| Item | Where | Reason |
|---|---|---|
| `for:` | In the rule | Do not alert the moment the value spikes once · if omitted, the rule fires from the first evaluation round |
| Severity level | Label `severity` (the name and values are a convention the team sets, not required by Prometheus) | Lets Alertmanager route it to the right place · use 3 levels per `SKILL.md` section 4: wake someone · look during work hours · log it |
| Runbook link | Annotation `runbook_url` (the key name is a convention; the docs say only that an annotation can hold a runbook link) | The responder starts from a procedure, not from zero at 3 a.m. |
| `summary` stating the symptom and who is affected | Annotation | Reading it on a phone tells you what to do |

Example (hypothetical thresholds; set them from the real SLO):

```yaml
groups:
  - name: voice-agent-symptoms
    rules:
      - alert: VoiceTurnLatencyHigh
        expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(voice_turn_duration_seconds_bucket[5m]))) > 1.5
        for: 10m
        labels:
          severity: page
        annotations:
          summary: "ผู้โทรรอคำตอบเกิน 1.5 วินาที (p95) นาน 10 นาที"
          runbook_url: https://runbooks.example.com/voice/turn-latency
```

`keep_firing_for` stops alerts from flapping when the value hovers around the threshold · for burn rate alerts see `SKILL.md` section 4.1

## 6 · Grafana

| Topic | How |
|---|---|
| 1 dashboard per 1 service | A service that takes requests uses RED: Rate · Errors · Duration · resources (CPU · GPU · disk · connection pool) use USE: Utilization · Saturation · Errors · the Grafana docs say RED stands for the user experience, so set alerts from RED and use USE to trace causes |
| Keep it as code | Dashboard JSON lives in git · the Grafana docs treat not keeping JSON in version control as a sign the system is not yet in order · when many dashboards look alike, generate them with grafonnet (Jsonnet) or grafanalib (Python) |
| Load automatically | A provider YAML file in `provisioning/dashboards/` points `options.path` to the JSON folder |
| Stop edits in the browser from being lost | Set `allowUiUpdates: false` · whoever wants a change edits the JSON in git and opens a PR · loading from files always overwrites the version in the database |
| Do not copy a dashboard | Use template variables (choose service · environment) on a parent dashboard · the Grafana docs warn that copying means you do not get fixes from the original |
| Temporary dashboards | Name them starting with `TEST:` and delete when done |
| uid | Set a fixed `uid` in the JSON so links from alerts do not break · `uid` and `title` must be unique within the same folder |

Example provider (checked against the Grafana docs 2026-10-27):

```yaml
apiVersion: 1
providers:
  - name: services
    type: file
    allowUiUpdates: false
    updateIntervalSeconds: 30
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
```

## 7 · Voice agent system example

All metric names in this section are set by the team (examples), except `DCGM_FI_DEV_GPU_UTIL` and `kafka_consumergroup_lag*`, which come from exporters

**Latency of each stage of a call** · 1 histogram split by stage with a `stage` label that has limited values

```
voice_stage_duration_seconds_bucket{stage="stt|llm|tts", le="…"}
voice_turn_duration_seconds_bucket{le="…"}   # จากผู้โทรพูดจบถึงเสียงตอบแรกออก
```

- Place buckets densely in the range 0.1 to 3 seconds, for example `0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 1.5, 2, 3, 5`, with an edge at the threshold you set (1.5 seconds in the example of section 5)
- p95 per stage: `histogram_quantile(0.95, sum by (le, stage) (rate(voice_stage_duration_seconds_bucket[5m])))` · put it in one chart with 3 lines and you see at once which stage eats the time
- Alert on `voice_turn_duration_seconds` (the symptom callers feel); do not alert on every stage · stages are for tracing causes
- Never put `call_id` or the caller's phone number as a label · the call id goes to logs and traces

**Kafka consumer lag** · when the pipeline sends call events through Kafka

- The lag value comes from a Kafka exporter · `kafka_exporter` (danielqsj · Apache-2.0 · not an official Apache project · checked 2026-10-27) gives `kafka_consumergroup_lag{consumergroup,topic,partition}` and `kafka_consumergroup_lag_sum{consumergroup,topic}` · if you use another exporter, the names may differ
- Wake someone when the lag of a consumer that makes callers wait (such as the real-time call summarizer) is high and does not fall for a long time · example `sum by (consumergroup, topic) (kafka_consumergroup_lag_sum) > 1000` with `for: 10m` (hypothetical threshold) · lag of a report job after the call ends is fine to send to the team chat
- The `partition` label is only for drill-down charts; do not put it in alert rules

**GPU utilization** · the exporter is NVIDIA `dcgm-exporter`

- `DCGM_FI_DEV_GPU_UTIL` is a gauge in % (checked from `etc/default-counters.csv` of the repo 2026-10-27) · this name was set by the exporter and does not follow the rules of section 2; use it as it is
- GPU is a cause (USE), not a symptom · put it on the dashboard next to the latency of the stages that use the GPU (STT · TTS) · high utilization together with a high p95 of that stage means the machine is saturated and you must add machines or reduce load
- GPU that stays high for many hours alerts at the look-during-work-hours level; it does not wake anyone

## 8 · Check before sending

- [ ] Every metric has a unit and `_total` per the rules · no label with unbounded values (user · phone · call id)
- [ ] Latency is a histogram with a bucket edge at the SLO threshold · no decisions from averages
- [ ] Every alert has `for:` · `severity` · `runbook_url` · `summary` · alerts on symptoms, not on CPU or GPU
- [ ] Dashboards are JSON in git · provisioned from files · `allowUiUpdates: false`
- [ ] There is a RED dashboard per service and USE per resource

## 9 · Sources

Checked 2026-10-27

| Topic | Source |
|---|---|
| Metric types | prometheus.io/docs/concepts/metric_types/ |
| Names, units, label cardinality | prometheus.io/docs/practices/naming/ |
| histogram · summary · `histogram_quantile` · native histogram | prometheus.io/docs/practices/histograms/ |
| Principle of alerting on symptoms | prometheus.io/docs/practices/alerting/ |
| Rule syntax `for` · `keep_firing_for` · annotations | prometheus.io/docs/prometheus/latest/configuration/alerting_rules/ |
| RED · USE · dashboard as code · sprawl | grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/ |
| Dashboard provisioning | grafana.com/docs/grafana/latest/administration/provisioning/ |
| `DCGM_FI_DEV_GPU_UTIL` | github.com/NVIDIA/dcgm-exporter → etc/default-counters.csv |
| `kafka_consumergroup_lag` | github.com/danielqsj/kafka_exporter (not official to Kafka) |
| `predict_linear` · `[5m]` range vs scrape interval · NaN behavior when dividing by 0 | General team knowledge (not yet checked against the official PromQL pages) |
