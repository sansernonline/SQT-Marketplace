# skill: stack-python

Use when writing, reviewing or testing Python (scripts, CLIs, FastAPI, Django, pandas, AI code).

# stack-python — Python ที่อ่านง่าย ถูกชนิด รันซ้ำได้

ใช้เครื่องมือเดียวกับที่ repo ใช้อยู่ และทุก diff ต้องผ่าน ruff · type check · pytest ก่อนส่ง ไฟล์นี้เก็บเฉพาะเรื่องของ Python
เรื่องทั่วไปอยู่ที่อื่น: เขียนให้น้อยดู `lazy-coding` · ตั้งชื่อดู `readable-code` · log ดู `logging-standards` · จับ error ดู `error-handling-patterns`

## 1 · เริ่มงาน: ดูว่า repo ใช้อะไร แล้วใช้ตัวนั้น

| เจอไฟล์ | ติดตั้ง | รันคำสั่ง |
|---|---|---|
| `uv.lock` | `uv sync` | `uv run <cmd>` |
| `poetry.lock` | `poetry install` | `poetry run <cmd>` |
| `pdm.lock` | `pdm install` | `pdm run <cmd>` |
| `requirements*.txt` อย่างเดียว | `python -m venv .venv` แล้ว `pip install -r requirements.txt` | เปิด `.venv` ก่อน |
| ไม่มีอะไรเลย (โปรเจกต์ใหม่) | `uv init` แล้ว `uv add` | `uv run <cmd>` |

- ใช้ virtual environment เสมอ ห้าม `pip install` ลง Python ของระบบ
- ห้ามผสมเครื่องมือ เช่น ถ้า repo ใช้ poetry ก็ไม่สร้าง `uv.lock` เพิ่ม
- อ่าน `requires-python` ใน `pyproject.toml` แล้วห้ามใช้ syntax ที่ใหม่กว่านั้น
- เวอร์ชัน ณ 2026-10: 3.10 หมดอายุเดือนนี้ ส่วน 3.15 กำหนดออก 2026-10-09 โปรเจกต์ใหม่ให้เริ่มที่ 3.13 หรือ 3.14

คำสั่งประจำ (ใส่ `uv run` หรือ `poetry run` นำหน้าตามเครื่องมือของ repo):

```bash
ruff check .                      # lint
ruff format --check .             # รูปแบบโค้ด · แก้ด้วย ruff format .
pyright                           # หรือ mypy . · ดูว่า repo ตั้งตัวไหนใน pyproject.toml
pytest -q                         # ทั้งชุด
pytest -q tests/test_order.py::test_refund_over_limit   # test เดียวด้วย node id
pytest -q -k "refund and not slow"                      # เลือกตามชื่อ
```

- type checker: ถ้า repo มี `[tool.pyright]` หรือ `pyrightconfig.json` ให้ใช้ pyright ถ้ามี `[tool.mypy]` หรือ `mypy.ini` ให้ใช้ mypy ถ้าไม่มีทั้งคู่ให้ถามครั้งเดียว ส่วน ty ของ Astral ใช้เมื่อ repo ตั้งไว้แล้วเท่านั้น
- ถ้า repo ยังใช้ black · isort · flake8 ให้ใช้ตามนั้น ไม่ย้ายไป ruff ในงานเดียวกัน

## 2 · แบบแผนประจำ

| เรื่อง | ทำแบบนี้ | ไม่ทำ |
|---|---|---|
| type hint | ใส่ทุกฟังก์ชันและ method ที่เรียกจากนอกไฟล์ ใช้ `list[str]` · `X \| None` | `List` · `Optional` จาก `typing` ในโค้ดใหม่ |
| รูปร่างข้อมูล | ข้างในใช้ `@dataclass(frozen=True)` ส่วนที่ขอบระบบใช้ pydantic | `dict` ลอย ๆ ส่งข้ามโมดูล |
| path | `pathlib.Path` | ต่อ string ด้วย `+ "/"` |
| ข้อความ | f-string | `%` หรือ `.format()` ในโค้ดใหม่ |
| log | `log.info("ส่งแล้ว order_id=%s", oid)` ให้ logger แทนค่าเอง | f-string ใน log (สร้าง string ทุกครั้งแม้ level ปิด) |
| ไฟล์ · lock · connection | `with ...:` | เปิดแล้วรอ `close()` เอง |
| ค่า default | `None` แล้วสร้างใหม่ในตัวฟังก์ชัน | `def f(items=[])` (list เดียวใช้ร่วมทุกครั้งที่เรียก) |
| ไฟล์ข้อความภาษาไทย | `open(p, encoding="utf-8")` · `p.read_text(encoding="utf-8")` | ไม่ระบุ (Windows อ่านเป็น cp874 หรือ cp1252) |
| สคริปต์ | logic อยู่ในฟังก์ชัน แล้วให้ `if __name__ == "__main__":` เรียก `main()` | โค้ดทำงานตอน import |
| Command Line Interface (CLI) | ใช้ตัวที่ repo ใช้ ถ้าไม่มีให้เริ่มที่ `argparse` ก่อน typer | parse `sys.argv` เอง |

```python
@dataclass(frozen=True)
class Refund:
    order_id: int
    amount_satang: int

def main() -> int:
    args = parse_args()
    return run(args.input_path)

if __name__ == "__main__":
    raise SystemExit(main())
```

## 3 · Web: FastAPI และ Django

- ข้อมูลเข้าและออกผ่าน pydantic model ที่ขอบ ส่วนข้างในใช้ type ของโดเมน ไม่ส่ง `request.json()` ดิบเข้า service
- FastAPI: ของที่ต้องเปลี่ยนตอน test (DB session · client ภายนอก · นาฬิกา) รับผ่าน `Depends` แล้วสลับด้วย `app.dependency_overrides`
- `async def` เฉพาะเมื่อทั้งสายเรียกเป็น async (httpx `AsyncClient` · driver DB แบบ async) ถ้าใช้ไลบรารีที่บล็อก (`requests` · `time.sleep` · driver sync) ให้ใช้ `def` ธรรมดาให้ FastAPI รันใน threadpool หรือห่อด้วย `asyncio.to_thread`
- DB session 1 ตัวต่อ 1 request ผ่าน dependency ที่ `yield` ห้ามเก็บ session ไว้ระดับโมดูล
- Django Object-Relational Mapping (ORM): ถ้าวนลูปแล้วแตะ FK ให้ใช้ `select_related` ถ้าแตะ many-to-many หรือ reverse FK ให้ใช้ `prefetch_related` แล้วตรวจจำนวน query ใน test ด้วย `assertNumQueries` หรือ `django_assert_num_queries`
- migration: อ่านไฟล์ที่ `makemigrations` สร้างทุกครั้งก่อน commit ถ้าลบคอลัมน์หรือเปลี่ยนชนิดบนตารางใหญ่ ให้แยกเป็นหลายขั้นตาม `database-design`
- endpoint สุขภาพ · timeout · รูป error ที่ส่งออก ดู `web-service-essentials` และ `api-conventions`

```python
def get_db() -> Iterator[Session]:
    with SessionLocal() as session:
        yield session

@app.post("/refunds", status_code=201)
def create_refund(body: RefundIn, db: Session = Depends(get_db)) -> RefundOut:
    return refund_service.create(db, body.to_domain())
```

## 4 · Data และ AI

| เรื่อง | ทำแบบนี้ |
|---|---|
| แก้ค่าใน DataFrame | ใช้ `df.loc[mask, "col"] = x` เพราะ pandas 3.x เปิด Copy-on-Write เป็นค่าเริ่มต้น ทำให้ `df["col"][mask] = x` ไม่แก้ `df` เลย |
| ความเร็ว | ใช้ operation ทั้งคอลัมน์ (`df["a"] * df["b"]` · `np.where`) ก่อน `apply` ส่วน `iterrows` ใช้เมื่อไม่มีทางอื่น |
| เงิน | เก็บเป็นสตางค์ชนิด `int64` หรือ `Decimal` ห้ามใช้ float และปัดเศษครั้งเดียวตอนแสดงผล |
| CSV ภาษาไทย | ลอง `utf-8-sig` ก่อน (มี BOM จาก Excel) ถ้าไม่ผ่านให้ลอง `cp874` (TIS-620) และระบุ `dtype` ของรหัสที่ขึ้นต้นด้วย 0 เป็น `str` |
| ผลซ้ำได้ | `rng = np.random.default_rng(42)` ส่งต่อเป็นพารามิเตอร์ ตั้ง seed ของ torch และ `random` ด้วย แล้วจด seed ในผลลัพธ์ |
| notebook | ใช้ลองไอเดียได้ แต่โค้ดที่จะใช้ซ้ำให้ย้ายเข้าโมดูลพร้อม test ให้ notebook เหลือแค่เรียกฟังก์ชันและวาดกราฟ |
| ไฟล์ใหญ่ | อ่านทีละส่วน (`chunksize`) หรือใช้ parquet แทน CSV เมื่อคุมรูปแบบได้ |

- เรื่องเรียก LLM · prompt · RAG · วัดผล ดู `llm-engineering`
- เรื่องนำเข้าหรือส่งออก Excel และปี พ.ศ. ดู `data-import-export`

## 5 · กับดักที่เจอบ่อย

| กับดัก | อาการ | แก้ |
|---|---|---|
| datetime ไม่มี timezone | เวลาเพี้ยน 7 ชั่วโมง หรือเทียบกันแล้วได้ `TypeError` | สร้างด้วย `datetime.now(timezone.utc)` (3.11+ ใช้ `datetime.UTC` ได้) เก็บเป็น UTC แสดงด้วย `ZoneInfo("Asia/Bangkok")` และห้ามใช้ `utcnow()` |
| เงินเป็น float | `0.1 + 0.2 != 0.3` และยอดรวมขาด 1 สตางค์ | ใช้ `int` สตางค์ หรือ `Decimal("0.10")` จาก string |
| closure ในลูป | callback ทุกตัวได้ค่าสุดท้ายของลูป | ผูกค่าตอนสร้าง `lambda i=i: ...` หรือ `functools.partial` |
| `except Exception:` กว้าง | error จริงถูกกลืน | จับเฉพาะชนิดที่รู้จัก ตามหลัก `error-handling-patterns` |
| import วนกัน | `ImportError` แบบ partially initialized | ย้ายของที่ใช้ร่วมไปโมดูลที่ 3 ส่วน import ที่ใช้แค่ใน type ให้ใส่ใต้ `if TYPE_CHECKING:` |
| งานหนัก CPU ใน thread | ใช้ thread หลายตัวแล้วไม่เร็วขึ้น เพราะ Global Interpreter Lock (GIL) | ใช้ `ProcessPoolExecutor` ส่วน thread ใช้กับงานรอ I/O |
| `subprocess(..., shell=True)` | input ผู้ใช้กลายเป็นคำสั่ง shell | ส่งเป็น list `["git", "log", ref]` ใส่ `check=True` และตั้ง `timeout` |
| `pickle.load` ข้อมูลภายนอก | รันโค้ดของคนอื่นได้ทันทีที่โหลด | ใช้ JSON หรือ parquet ถ้าเป็นโมเดลใช้ `safetensors` ถ้าเป็น torch ใส่ `weights_only=True` |
| `yaml.load` | สร้าง object อะไรก็ได้จากไฟล์ | `yaml.safe_load` |
| blocking ใน `async def` | ทั้ง server ค้างตาม request ที่ช้าที่สุด | ดูข้อ 3 |

## 6 · test

หลักทั่วไปอยู่ที่ `testing-standards` ส่วนนี้เป็นเรื่องเฉพาะของ pytest

| ต้องการ | ใช้ |
|---|---|
| เตรียมของ · เก็บกวาด | fixture ที่ `yield` ส่วนของที่ใช้หลายไฟล์ให้ไว้ใน `conftest.py` |
| หลายเคส logic เดียว | `@pytest.mark.parametrize` พร้อม `ids=` ที่อ่านรู้เรื่อง |
| ไฟล์ชั่วคราว | `tmp_path` ห้ามเขียนลงโฟลเดอร์ของ repo |
| เวลา | ส่งนาฬิกาเข้าฟังก์ชันเป็นพารามิเตอร์ก่อน ถ้าแก้ไม่ได้ให้ใช้ `time-machine` (พัฒนาต่อเนื่อง เร็วกว่า) แต่ถ้า repo ใช้ `freezegun` อยู่ก็ใช้ต่อ |
| HTTP ภายนอก | httpx ใช้ `respx` ส่วน requests ใช้ `responses` และห้ามยิงเน็ตจริงใน unit test |
| ฐานข้อมูลจริง | `testcontainers` (PostgreSQL · MySQL ตัวเดียวกับ production) ไม่ใช้ SQLite แทน Postgres |
| ค่า environment | `monkeypatch.setenv` |

```python
@pytest.mark.parametrize(
    ("amount_satang", "allowed"),
    [(0, False), (1, True), (500_000, True), (500_001, False)],
    ids=["zero", "min", "at-limit", "over-limit"],
)
def test_refund_limit(amount_satang: int, allowed: bool) -> None:
    assert is_refund_allowed(amount_satang) is allowed
```

- logic ใหม่และบั๊กให้เขียน test ที่แดงก่อน แล้วค่อยแก้จนเขียว
- coverage ดูเฉพาะบรรทัดที่เปลี่ยน: `pytest --cov --cov-report=term-missing` แล้วไล่บรรทัดใน diff ที่ยังไม่ถูกรัน

## 7 · ความปลอดภัยเฉพาะ Python

หลัก 10 ข้ออยู่ที่ `principle-secure-by-default` ส่วนนี้คือวิธีทำใน Python

- lock dependency เสมอ (`uv.lock` · `poetry.lock` · `pip-compile --generate-hashes`) แล้ว commit lock file
- สแกนช่องโหว่: `pip-audit` (ใช้ได้กับทุกเครื่องมือ) ส่วน uv ตั้งแต่ 0.11.25 มี `uv audit` แต่ยังเป็น preview จึงใช้ได้ แต่ Continuous Integration (CI) ยังพึ่ง `pip-audit`
- ก่อน `uv add` หรือ `pip install` แพ็กเกจใหม่ ให้สะกดชื่อตรงกับหน้า PyPI ดูคนดูแลและวันปล่อยล่าสุด และระวังชื่อคล้าย (`reqeusts` · `python-dateutil` กับ `dateutil`)
- SQL ส่งค่าผ่าน parameter: `cur.execute("... WHERE id = %s", (oid,))` ส่วน SQLAlchemy ใช้ `text(...)` กับ `:name` และห้ามใช้ f-string
- ชื่อไฟล์จากผู้ใช้: `(base / name).resolve()` แล้วเช็ก `.is_relative_to(base.resolve())` ส่วนเรื่องอัปโหลดดู `file-upload-and-storage`
- ค่าลับอ่านจาก environment (`os.environ["KEY"]` หรือ pydantic-settings) แล้วตรวจตอนเริ่ม ให้ `.env` อยู่ใน `.gitignore` (ดู `config-and-secrets`)
- Django production: `DEBUG = False` · `ALLOWED_HOSTS` ระบุชื่อจริง · `SECRET_KEY` จาก environment · รัน `python manage.py check --deploy` ก่อนปล่อย

## 8 · รายการตรวจก่อนส่ง

- [ ] `ruff check` ไม่มีข้อผิดพลาด
- [ ] `ruff format --check` ผ่าน (หรือ formatter ที่ repo ใช้)
- [ ] type checker ของ repo ได้ 0 error ในไฟล์ที่แก้
- [ ] `pytest -q` เขียวทั้งชุด ไม่ใช่แค่ไฟล์ที่แก้
- [ ] พฤติกรรมใหม่ทุกอย่างมี test ที่เคยแดงก่อนแก้
- [ ] ไม่มี `requests` · `time.sleep` · driver sync หรือ I/O ที่บล็อกอยู่ใน `async def`
- [ ] เปิดไฟล์ข้อความทุกจุดระบุ `encoding="utf-8"` และ datetime ที่เก็บมี timezone
- [ ] dependency ที่เพิ่มอยู่ใน lock file และผ่าน `pip-audit`

## 9 · เชื่อมกับ skill อื่น

| งาน | เปิด |
|---|---|
| เขียนให้น้อย ไม่เพิ่มของเกิน | `lazy-coding` |
| ชื่อ · รูปฟังก์ชัน · ที่อยู่ไฟล์ | `readable-code` |
| เลือก framework test · สัดส่วน · ชื่อ test | `testing-standards` |
| รูปแบบ log · correlation id · logger Python สำเร็จรูป | `logging-standards` |
| จับ error · retry · timeout | `error-handling-patterns` |
| กฎปลอดภัยทุก diff | `principle-secure-by-default` และก่อนส่งใช้ `security-gate` |
| เรียก LLM · RAG · วัดผล | `llm-engineering` |
| schema · migration | `database-design` |
| งานเบื้องหลัง (Celery · RQ · cron) | `background-jobs` |
| ยืนยันว่าทำงานจริงก่อนบอกว่าเสร็จ | `principle-prove-it-works` |


---

# skill: stack-sql

Use when writing or reviewing SQL queries, stored procedures or data-change scripts for SQL Server or PostgreSQL.

# stack · SQL — เขียน query ให้ถูก เร็ว และเปลี่ยนข้อมูลได้ปลอดภัย

> **กฎข้อเดียว:** query ที่ยังไม่เคยรันกับข้อมูลจำนวนเท่าของจริง ถือว่ายังไม่เสร็จ

ออกแบบตาราง ตั้งชื่อ ชนิดข้อมูล และ migration แบบ expand-and-contract → `database-design`

## 1 · เริ่มงาน: รู้จักฐานข้อมูลก่อนเขียนบรรทัดแรก

- engine และรุ่น: `SELECT @@VERSION` (SQL Server) · `SELECT version()` (PostgreSQL) · `SELECT VERSION()` (MySQL) · SQL Server ดู `SERVERPROPERTY('Edition')` ด้วย เพราะหลายความสามารถมีเฉพาะ Enterprise
- repo รัน migration ด้วยอะไร: `Migrations/` (EF Core) · `db/migration/V1__*.sql` (Flyway) · Liquibase `changelog` · `alembic/` · `prisma/migrations/` · สคริปต์ดิบใน `sql/`
- collation และ time zone ของ server: `SERVERPROPERTY('Collation')` · `SHOW timezone`

- ใช้เครื่องมือ migration ที่ repo ใช้อยู่ ห้ามเพิ่มตัวที่ 2 และห้ามแก้ schema ด้วยมือนอกเครื่องมือ
- ห้ามรันอะไรกับ production ให้เตรียมคำสั่งให้คนอนุมัติแทน (ดู `principle-proceed-on-reversible-work`)
- ใช้ฐานข้อมูล local หรือ sandbox ที่จำนวนแถวใกล้ของจริง (ตาราง 100 แถวซ่อนปัญหาความเร็วทุกอย่าง) ไม่มีก็สร้างข้อมูลจำลองด้วยสคริปต์ให้จำนวนและการกระจายค่าใกล้จริง

## 2 · เขียน query ให้ถูก

| เรื่อง | ทำแบบนี้ | กับดัก |
|---|---|---|
| ค่าจากผู้ใช้ | ส่งเป็น parameter เสมอ | ต่อ string → SQL injection |
| คอลัมน์ | เขียนชื่อคอลัมน์ครบ | `SELECT *` → ดึงเกิน · คอลัมน์ใหม่ทำโค้ดพัง · ใช้ covering index ไม่ได้ |
| NULL | `IS NULL` · `NOT EXISTS` | `= NULL` ไม่เคยจริง · `NOT IN (subquery)` ที่มี NULL 1 ตัว → ได้ 0 แถว |
| JOIN | นับแถวก่อนและหลัง join | join ฝั่ง 1-ต่อ-หลาย แล้ว `SUM` → ยอดเบิ้ล แก้โดยรวมยอดก่อน join |
| GROUP BY | ทุกคอลัมน์ที่ไม่ใช่ aggregate ต้องอยู่ใน `GROUP BY` | MySQL ที่ปิด `ONLY_FULL_GROUP_BY` → สุ่มค่าให้เงียบ ๆ |
| หาร | `CAST(a AS decimal(18,4)) / b` และกันหาร 0 ด้วย `NULLIF(b, 0)` | SQL Server และ PostgreSQL ได้ `5/2 = 2` ส่วน MySQL ได้ `5/2 = 2.5000` |
| ชนิดข้อมูลไม่ตรง | parameter ชนิดเดียวกับคอลัมน์ | SQL Server ส่ง `nvarchar` ไปเทียบคอลัมน์ `varchar` → `CONVERT_IMPLICIT` → scan ทั้งตาราง |
| ช่วงวันที่ | `>= start AND < end` (ครึ่งเปิด) | `BETWEEN '2026-01-01' AND '2026-01-31'` → หลุดทั้งวันที่ 31 หลังเที่ยงคืน |
| time zone | เก็บ UTC แล้วแปลงเป็น Asia/Bangkok ตอนแสดง | เก็บเวลาไทยไม่มี offset → รวมข้อมูลข้ามระบบแล้วเพี้ยน 7 ชั่วโมง |
| ปี พ.ศ. | เก็บ ค.ศ. เสมอ แล้วแปลงตอนแสดง | เก็บ 2569 → คำนวณอายุ เรียง และ export พังหมด |
| เงิน | `decimal(19,4)` · `numeric(19,4)` | `float` · `real` → 0.1 + 0.2 ไม่เท่ากับ 0.3 |
| เรียงชื่อไทย | SQL Server `Thai_100_CI_AS` · PostgreSQL `COLLATE "th-TH-x-icu"` | collation ทั่วไป → สระหน้า (เ แ โ ใ ไ) เรียงผิดโดยไม่มี error |

แปลง UTC เป็นเวลาไทยตอนแสดง: SQL Server `AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'` · PostgreSQL `AT TIME ZONE 'Asia/Bangkok'` (คอลัมน์ `timestamptz`)

- collation ไทยไม่มีทุก server ตรวจก่อนเลือก (คำสั่งใน [`references/snippets.md`](references/snippets.md)) · แสดงวันที่ไทยและรับปี พ.ศ. จากฟอร์ม → `i18n-and-locale`

## 3 · ให้เร็ว: อ่าน plan จริง ไม่เดา

- ดู plan จริงบนข้อมูลจำนวนใกล้ของจริง: SQL Server `SET STATISTICS IO, TIME ON` + Actual Execution Plan · PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` (รันคำสั่งจริง UPDATE/DELETE ห่อ `BEGIN ... ROLLBACK`) · MySQL 8.0.18+ `EXPLAIN ANALYZE`
- ใน plan ดู: scan ทั้งตารางใหญ่ · แถวที่คาด vs ได้จริงต่างมาก (statistics เก่า) · key lookup ซ้ำหลายพันครั้ง · sort/hash ล้นลง disk
- **sargable** — ห้ามครอบคอลัมน์ที่มี index ด้วย function (`YEAR(created_at) = 2026` → ช่วงวันที่ครึ่งเปิด) · `LIKE '%คำ'` ใช้ index ไม่ได้ ใช้ full-text
- ทุก index ต้องตอบได้ว่ารับ query ไหน (ทำให้เขียนช้าลงทุกตัว) · covering index ใช้ `INCLUDE (...)`
- แบ่งหน้าลึกใช้ keyset ไม่ใช่ `OFFSET` · N+1 จาก Object-Relational Mapper (ORM) นับ query จาก log แล้วแก้ด้วย eager load
- parameter sniffing (SQL Server) แก้จากเบาไปหนัก ห้ามล้าง plan cache ทั้ง server · หลังโหลดข้อมูลก้อนใหญ่ update statistics
- UPDATE/DELETE ก้อนใหญ่ทำทีละชุด (เช่น 5,000 แถว) ไม่งั้น lock ทั้งตาราง log โต rollback นาน

ตัวอย่างโค้ด keyset · ลบทีละชุด · ทางแก้ parameter sniffing ทีละขั้น → [`references/performance.md`](references/performance.md)

## 4 · เปลี่ยนข้อมูลอย่างปลอดภัย

ตาราง isolation · upsert · สร้าง index ไม่ล็อกตาราง แยกตาม engine พร้อมตัวอย่างตรวจจำนวนแถว → [`references/safe-changes.md`](references/safe-changes.md)

- สคริปต์ทุกตัวต้องรันซ้ำได้ (`principle-safe-to-rerun`): `IF NOT EXISTS` · `CREATE INDEX IF NOT EXISTS` (PostgreSQL) · `CREATE OR ALTER` (SQL Server)
- ก่อนลบหรือแก้ข้อมูลจำนวนมาก: backup ตารางที่โดน หรือยืนยันว่า backup ล่าสุด restore ได้จริง แล้วเขียนวิธีย้อนกลับไว้ก่อนรัน
- นับแถวที่คาดไว้ก่อน แล้วตรวจ `@@ROWCOUNT` (SQL Server) หรือ `GET DIAGNOSTICS` (PostgreSQL) ก่อน `COMMIT` ไม่ตรงให้ ROLLBACK
- upsert ใช้แบบของ engine (`ON CONFLICT` · `ON DUPLICATE KEY` · SQL Server `UPDATE` + `INSERT ... WHERE NOT EXISTS` ด้วย `UPDLOCK, HOLDLOCK`)
- deadlock: ทุกโค้ดแตะตารางเรียงลำดับเดียวกัน transaction สั้นที่สุด ไม่รอ API ภายนอกขณะถือ transaction
- `ALTER TABLE` ตารางใหญ่: PostgreSQL ตั้ง `SET lock_timeout = '5s'` แล้ว retry · เปลี่ยนชนิดคอลัมน์เขียนตารางใหม่ทั้งก้อน · SQL Server เพิ่ม `NOT NULL` + default ทันทีเฉพาะ Enterprise · เปลี่ยนชนิดหรือย้ายข้อมูลใช้ expand-and-contract ตาม `database-design`

## 5 · กับดักที่เจอบ่อย

- `MERGE` (SQL Server) มี bug หลายตัว และไม่ใส่ `HOLDLOCK` แล้ว 2 session insert ซ้ำ → `UPDATE` + `INSERT` แยก หรือ `MERGE ... WITH (HOLDLOCK)` พร้อม test
- trigger ซ่อนกฎธุรกิจและพังเมื่อ insert หลายแถว → กฎอยู่ในโค้ดแอป trigger ใช้กับ audit เท่านั้น · cursor/loop ทีละแถว → คำสั่งแบบ set-based
- `WITH (NOLOCK)` อ่านของที่ยังไม่ commit แถวหายหรือซ้ำ → เปิด Read Committed Snapshot Isolation (RCSI) แทน · ต่อ string เป็น SQL → parameter (ข้อ 7)
- collation ไม่ตรงตอน join → ตั้งให้ตรงที่คอลัมน์ (ใส่ `COLLATE` ใน query ทำให้ไม่ใช้ index)
- id ไม่เรียงต่อเนื่องเสมอ (identity กระโดด · sequence ไม่ย้อนเมื่อ rollback) → เลขเอกสารที่ห้ามขาดออกเองในตารางนับเลข
- timestamp ไม่มี time zone → PostgreSQL `timestamptz` · SQL Server `datetime2` ที่ตกลงว่าเป็น UTC หรือ `datetimeoffset`

## 6 · test

- test query กับฐานข้อมูลจริงชนิดเดียวกับ production ห้ามใช้ SQLite หรือ in-memory แทน SQL Server/PostgreSQL เพราะพฤติกรรม NULL collation และ lock ต่างกัน
- เปิดฐานข้อมูลใหม่ทุกรอบด้วย Testcontainers แล้วใส่ข้อมูลตั้งต้นด้วยสคริปต์ · logic ใน stored procedure ใช้ tSQLt (SQL Server) หรือ pgTAP (PostgreSQL)
- ตรวจทั้งจำนวนแถวและค่า: กรณีมี NULL · ช่วงวันที่ตรงขอบเที่ยงคืน · ชื่อไทย · ยอดเงินมีเศษ
- migration ใหม่ให้รันขึ้นบนสำเนา schema ที่เหมือน production พร้อมข้อมูลจำนวนใกล้จริง แล้วจับเวลาและดู lock
- แก้ bug ให้เขียน test ที่ fail ก่อน แล้วค่อยแก้ (`principle-fix-root-cause`) ส่วนกรอบ test ทั่วไปดู `testing-standards`

## 7 · ความปลอดภัยเฉพาะฐานข้อมูล

- 1 แอป 1 user ฐานข้อมูล ให้สิทธิ์เท่าที่ใช้ แอปห้ามใช้ `sa` · `postgres` · `root` และ user ที่รัน migration ต้องแยกจาก user ที่แอปใช้ตอนทำงาน
- dynamic SQL ที่มีค่าจากผู้ใช้ให้ส่งค่าเป็น parameter ส่วนชื่อตารางหรือคอลัมน์ให้เลือกจาก allowlist แล้ว quote

ตัวอย่าง `sp_executesql` · `QUOTENAME` · plpgsql `format('%I')` → [`references/snippets.md`](references/snippets.md)

- ถ้ามีข้อมูลหลายบริษัทในตารางเดียว ให้พิจารณา row-level security: SQL Server `CREATE SECURITY POLICY` · PostgreSQL `CREATE POLICY` (เจ้าของตารางข้าม policy ได้ ถ้าไม่ `FORCE ROW LEVEL SECURITY`)
- คอลัมน์ข้อมูลส่วนบุคคล (เลขบัตรประชาชน · เบอร์โทร · ที่อยู่) ไม่ดึงถ้าไม่ใช้ ส่วน Dynamic Data Masking ของ SQL Server ช่วยซ่อนตอนแสดง แต่ไม่ใช่การกันสิทธิ์ รายละเอียดดู `pdpa-compliance`
- การแก้ข้อมูลสำคัญต้องมีร่องรอยว่าใครทำ (`audit-trail`)

## 8 · รายการตรวจก่อนส่ง

- [ ] ทุกค่าจากภายนอกเป็น parameter · ไม่มี `SELECT *`
- [ ] ตรวจ NULL · ช่วงวันที่แบบครึ่งเปิด · หาร · ชนิด parameter ตรงกับคอลัมน์
- [ ] ดู plan จริงบนข้อมูลใกล้ของจริง จด logical reads หรือเวลาก่อน/หลัง · index ใหม่ทุกตัวบอกได้ว่ารับ query ไหน
- [ ] สคริปต์รันซ้ำได้ และข้อมูลก้อนใหญ่ทำทีละชุด
- [ ] transaction + ตรวจจำนวนแถวก่อน `COMMIT` · เขียนวิธีย้อนกลับและยืนยัน backup แล้ว
- [ ] มี test ที่รันกับฐานข้อมูลชนิดเดียวกับ production

## 9 · เชื่อมกับ skill อื่น

ออกแบบตารางและ migration แบบ expand-and-contract → `database-design` · สคริปต์รันซ้ำได้ → `principle-safe-to-rerun` · Excel/CSV → `data-import-export` · ใครแก้อะไร → `audit-trail` · injection และสิทธิ์ → `principle-secure-by-default` · วันที่ไทย พ.ศ. การเรียงไทย → `i18n-and-locale` · connection string → `config-and-secrets` · migration ใน pipeline → `cicd-and-release`


## reference: performance.md

# ให้เร็ว — อ่าน plan · index · แบ่งหน้า · งานก้อนใหญ่ (ฉบับเต็ม)

อ่านเมื่อ query ช้าหรือกำลังเพิ่ม index · กฎย่ออยู่ใน `SKILL.md` ข้อ 3

| engine | คำสั่งดู plan จริง |
|---|---|
| SQL Server | `SET STATISTICS IO, TIME ON;` + เปิด Actual Execution Plan (SQL Server Management Studio (SSMS) กด `Ctrl+M`) แล้วดู logical reads |
| PostgreSQL | `EXPLAIN (ANALYZE, BUFFERS) SELECT ...` ระวังว่า `ANALYZE` รันคำสั่งจริง ถ้าเป็น UPDATE/DELETE ให้ห่อด้วย `BEGIN ... ROLLBACK` |
| MySQL 8.0.18+ | `EXPLAIN ANALYZE SELECT ...` |

สิ่งที่ต้องดูใน plan: scan ทั้งตารางที่ใหญ่ · จำนวนแถวที่คาด vs ได้จริงต่างกันมาก (statistics เก่า) · key lookup ซ้ำหลายพันครั้ง · sort หรือ hash ที่ล้นลง disk

- **sargable** คือเงื่อนไขที่ใช้ index ได้ ห้ามครอบคอลัมน์ที่มี index ด้วย function
  - ❌ `WHERE YEAR(created_at) = 2026` → ✅ `WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'`
  - ❌ `WHERE LOWER(email) = @e` → ✅ เก็บ email ตัวเล็กตั้งแต่แรก หรือทำ index บน expression (PostgreSQL) หรือ computed column + index (SQL Server)
  - ❌ `WHERE name LIKE '%สมชาย'` ใช้ index ไม่ได้ ถ้าต้องค้นกลางคำให้ใช้ full-text search
- **covering index**: ใส่คอลัมน์ที่ query อ่านไว้ใน `INCLUDE (...)` (SQL Server · PostgreSQL 11+) จะได้ไม่ต้องย้อนไปอ่านตาราง ส่วน MySQL ไม่มี `INCLUDE` ให้ต่อท้ายใน key แทน
- ทุก index ที่เพิ่มต้องตอบได้ว่ารับ query ไหน เพราะ index ทำให้ INSERT/UPDATE ช้าลงทุกตัว
- **แบ่งหน้าลึก** ใช้ keyset แทน `OFFSET` เพราะ `OFFSET 100000` ต้องอ่านทิ้ง 100,000 แถวทุกครั้ง

```sql
-- keyset: ส่งค่าแถวสุดท้ายของหน้าก่อนมาเป็น parameter
SELECT id, created_at, total_amount
FROM orders
WHERE (created_at, id) < (@last_created_at, @last_id)   -- PostgreSQL · MySQL
ORDER BY created_at DESC, id DESC
LIMIT 50;
-- SQL Server: WHERE created_at < @c OR (created_at = @c AND id < @id) · ใช้ TOP (50)
```

- **N+1 จาก Object-Relational Mapper (ORM)**: loop แล้วโหลดลูกทีละแถว → 1 หน้าจอยิง 201 query ให้เปิด log SQL ของ ORM แล้วนับ แล้วแก้ด้วย `Include` (EF Core) · `selectinload` (SQLAlchemy) · `include` (Prisma)
- **parameter sniffing (SQL Server)**: plan ถูกสร้างจากค่าแรกที่ส่งมา แล้วใช้ซ้ำกับค่าที่กระจายต่างกันมาก → บางลูกค้าเร็ว บางลูกค้าช้า 100 เท่า
  - ทางแก้เรียงจากเบาไปหนัก: SQL Server 2022+ compatibility level 160 มี Parameter Sensitive Plan optimization · `OPTION (RECOMPILE)` กับ query ที่รันไม่บ่อย · `OPTIMIZE FOR` · บังคับ plan ผ่าน Query Store
  - ห้ามแก้ด้วยการลบ plan cache ทั้ง server
- **statistics**: หลังโหลดข้อมูลก้อนใหญ่ให้รัน `UPDATE STATISTICS dbo.orders` หรือ PostgreSQL `ANALYZE orders`
- **UPDATE/DELETE ก้อนใหญ่** ทำทีละชุด เช่น 5,000 แถว เพราะถ้าทำชุดเดียวล้านแถวจะ lock ทั้งตาราง log โต และ rollback นานเท่ากัน

```sql
-- SQL Server: ลบทีละ 5,000 แถวจนหมด
WHILE 1 = 1
BEGIN
    DELETE TOP (5000) FROM dbo.audit_logs WHERE created_at < @cutoff;
    IF @@ROWCOUNT < 5000 BREAK;
END
-- PostgreSQL: DELETE FROM audit_logs WHERE id IN (SELECT id FROM audit_logs WHERE created_at < $1 LIMIT 5000); วนจากแอปหรือ procedure
```


## reference: safe-changes.md

# เปลี่ยนข้อมูลอย่างปลอดภัย — ตารางเทียบ engine และตัวอย่าง (ฉบับเต็ม)

อ่านเมื่อเขียนสคริปต์แก้ข้อมูล upsert หรือ ALTER TABLE · กฎย่ออยู่ใน `SKILL.md` ข้อ 4

| เรื่อง | SQL Server | PostgreSQL | MySQL (InnoDB) |
|---|---|---|---|
| isolation เริ่มต้น | READ COMMITTED แบบ lock ส่วน Azure SQL Database เปิด Read Committed Snapshot Isolation (RCSI) ให้แล้ว | READ COMMITTED (อ่านจาก snapshot ไม่บล็อกคนเขียน) | REPEATABLE READ |
| upsert ที่รันซ้ำได้ | `UPDATE` แล้ว `INSERT ... WHERE NOT EXISTS` ใน transaction พร้อม `UPDLOCK, HOLDLOCK` | `INSERT ... ON CONFLICT (...) DO UPDATE` | `INSERT ... ON DUPLICATE KEY UPDATE` |
| สร้าง index ไม่ล็อกตาราง | `WITH (ONLINE = ON)` ใช้ได้เฉพาะ Enterprise (รวม 2025) | `CREATE INDEX CONCURRENTLY` แต่รันใน transaction ไม่ได้ | `ALGORITHM=INPLACE, LOCK=NONE` |

- ถ้า SQL Server มีคนอ่านบล็อกคนเขียนบ่อย ให้พิจารณาเปิด `READ_COMMITTED_SNAPSHOT ON` แต่จะเพิ่มภาระ tempdb จึงต้องทดสอบก่อน
- ป้องกัน deadlock: ทุกโค้ดแตะตารางเรียงลำดับเดียวกัน ทำ transaction ให้สั้นที่สุด และไม่รอ API ภายนอกขณะถือ transaction
- สคริปต์ทุกตัวต้องรันซ้ำได้ (`principle-safe-to-rerun`): `IF NOT EXISTS` · `CREATE INDEX IF NOT EXISTS` (PostgreSQL) · `CREATE OR ALTER` (SQL Server)
- ก่อนคำสั่งที่ลบหรือแก้ข้อมูลจำนวนมาก: backup ตารางที่โดน หรือยืนยันว่า backup ล่าสุด restore ได้จริง แล้วเขียนวิธีย้อนกลับไว้ก่อนรัน
- นับแถวที่คาดไว้ก่อน แล้วตรวจก่อน `COMMIT`:

```sql
BEGIN TRAN;
UPDATE dbo.orders SET status = 'cancelled'
WHERE status = 'pending' AND created_at < @cutoff;
IF @@ROWCOUNT <> @expected
BEGIN ROLLBACK; THROW 50001, 'จำนวนแถวไม่ตรงกับที่นับไว้', 1; END
COMMIT;
-- PostgreSQL: ใน DO block ใช้ GET DIAGNOSTICS n = ROW_COUNT; ไม่ตรง → RAISE EXCEPTION
```

- `ALTER TABLE` บนตารางใหญ่:
  - PostgreSQL ขอ lock `ACCESS EXCLUSIVE` แล้วรอ query ยาวที่ค้างอยู่ ระหว่างรอ query ใหม่ทุกตัวก็ต่อคิวด้วย จึงต้องตั้ง `SET lock_timeout = '5s'` แล้ว retry
  - PostgreSQL 11+ เพิ่มคอลัมน์ที่มี default คงที่ได้ทันที แต่การเปลี่ยนชนิดคอลัมน์จะเขียนตารางใหม่ทั้งก้อน
  - SQL Server เพิ่มคอลัมน์ `NOT NULL` พร้อม default ทำได้ทันทีเฉพาะ Enterprise ส่วน edition อื่นต้องเขียนทุกแถว
  - ถ้าเปลี่ยนชนิดหรือย้ายข้อมูล ให้ทำแบบ expand-and-contract ตาม `database-design`


## reference: snippets.md

# ตัวอย่างโค้ดสั้น — เวลาไทย · dynamic SQL

กฎอยู่ใน `SKILL.md` ข้อ 2 และ 7

## แปลงเวลา UTC เป็นเวลาไทยตอนแสดง (ข้อ 2)

```sql
-- แปลงเวลา UTC เป็นเวลาไทยตอนแสดง
SELECT created_at AT TIME ZONE 'UTC' AT TIME ZONE 'SE Asia Standard Time'  -- SQL Server (ชื่อโซนแบบ Windows)
FROM dbo.orders;
SELECT created_at AT TIME ZONE 'Asia/Bangkok' FROM orders;                  -- PostgreSQL (คอลัมน์ timestamptz)
```

## dynamic SQL ที่ส่งค่าเป็น parameter (ข้อ 7)

```sql
-- SQL Server
EXEC sp_executesql N'SELECT id, name FROM dbo.customers WHERE email = @email',
                   N'@email nvarchar(320)', @email = @input;
-- ชื่อคอลัมน์: QUOTENAME(@column) หลังตรวจกับ allowlist
-- PostgreSQL ใน plpgsql
EXECUTE format('SELECT id, name FROM %I WHERE email = $1', tbl) USING p_email;
```

## ตรวจว่ามี collation ไทยหรือไม่ (ข้อ 2)

- PostgreSQL มี `th-TH-x-icu` เมื่อ server build ด้วย International Components for Unicode (ICU) ตรวจได้ด้วย `SELECT collname FROM pg_collation WHERE collname LIKE 'th%'`
- MySQL ตรวจ collation ไทยที่มีด้วย `SHOW COLLATION LIKE '%thai%'` ก่อนเลือก


---

# skill: api-conventions

Use when starting an API, adding endpoints or checking API consistency (URLs, versioning, pagination, dates, money, ids, idempotency).

# ข้อตกลงของ API

> **กฎข้อเดียว:** ตัดสินใจครั้งเดียว ใช้ทุก endpoint
> API ที่ทุก endpoint ทำเหมือนกัน แม้ "ไม่ค่อยถูกตามทฤษฎี" ใช้ง่ายกว่า
> API ที่แต่ละ endpoint ถูกต้องคนละแบบ เพราะแบบหลังฝั่งเรียกต้องเดาใหม่ทุกครั้ง

## เมื่อไหร่ใช้ skill นี้

- เริ่มออกแบบ API ตัวแรกของโปรเจกต์
- จะเพิ่ม endpoint ใน API เดิม และอยากให้เข้ากับของเดิม
- รีวิว API แล้วรู้สึกว่าแต่ละส่วนไม่เหมือนกัน
- ต้องตอบว่า "เปลี่ยนแบบนี้แล้ว client พังไหม"

## เมื่อไหร่ **ไม่** ใช้

| โจทย์ | ไปที่ |
|---|---|
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง ๆ ให้ครบ | command `/api-design` |
| health check, error envelope, graceful shutdown | `web-service-essentials` |
| ตาราง คอลัมน์ ความสัมพันธ์ | `database-design` |
| token, scope, สิทธิ์ | `auth-implementation-patterns` |

---

## 1 · เอกสารข้อตกลงต้องมีจริง

วางไฟล์ `API-CONVENTIONS.md` ที่รากโปรเจกต์ (แม่แบบอยู่ที่ `assets/API-CONVENTIONS.md`)
ทุกข้อในหน้านี้ที่ตัดสินใจแล้ว ให้เขียนลงไฟล์นั้น พร้อมวันที่และเหตุผลสั้น ๆ

> ข้อตกลงที่อยู่ในหัวคนใดคนหนึ่ง ไม่ใช่ข้อตกลง — คนที่เข้าทีมเดือนหน้าจะทำอีกแบบ

---

## 2 · ตั้งชื่อ URL

```
GET    /v1/orders                 รายการ
POST   /v1/orders                 สร้าง
GET    /v1/orders/{id}            รายตัว
PATCH  /v1/orders/{id}            แก้บางส่วน
PUT    /v1/orders/{id}            แทนที่ทั้งตัว
DELETE /v1/orders/{id}            ลบ
GET    /v1/orders/{id}/items      ทรัพยากรลูก
POST   /v1/orders/{id}/cancel     การกระทำที่ไม่ใช่ CRUD
```

| กฎ | ✅ | ❌ |
|---|---|---|
| คำนาม พหูพจน์ | `/orders` | `/getOrders`, `/order` |
| ตัวพิมพ์เล็ก ขีดกลาง | `/purchase-orders` | `/purchaseOrders`, `/purchase_orders` |
| ความลึกไม่เกิน 2 ชั้น | `/orders/{id}/items` | `/customers/{a}/orders/{b}/items/{c}/logs` |
| กริยาใช้เมื่อไม่ใช่ CRUD จริง ๆ | `POST /orders/{id}/cancel` | `POST /orders/cancelOrder` |

**การกระทำที่ไม่ใช่ CRUD** (อนุมัติ ยกเลิก ส่งซ้ำ) — ใช้ `POST /{resource}/{id}/{action}`
อย่าดัดให้เป็น `PATCH` ที่แก้ `status` เพราะการเปลี่ยนสถานะมักมีผลข้างเคียงมากกว่าการแก้ฟิลด์ทั่วไป

**วิธี `PATCH`:** เลือกแบบเดียวทั้งระบบ โดยแนะนำให้ส่งเฉพาะฟิลด์ที่แก้ (`merge patch`)
และต้องกำหนดให้ชัดว่า `null` แปลว่า "ล้างค่า" หรือ "ไม่แตะ" (ดูข้อ 6)

---

## 3 · versioning

| วิธี | ข้อดี | ข้อเสีย |
|---|---|---|
| **ใน path** `/v1/orders` | เห็นชัด ทดสอบง่าย แคชง่าย | URL เปลี่ยนตอนขึ้นเวอร์ชัน |
| ใน header `Accept: application/vnd.acme.v1+json` | URL คงที่ | มองไม่เห็นตอน debug ลืมส่งบ่อย |

> **เลือก path** ถ้าไม่มีเหตุผลเฉพาะ — ทุกคนเห็นเวอร์ชันได้จากบรรทัดเดียวใน log

**เปลี่ยนแบบไหนแล้วฝั่งเรียกพัง:**

| การเปลี่ยน | พังไหม |
|---|:--:|
| เพิ่ม endpoint ใหม่ | ไม่ |
| เพิ่มฟิลด์ **ที่ไม่บังคับ** ใน request | ไม่ |
| เพิ่มฟิลด์ใน response | ไม่* |
| เพิ่มค่า enum ใหม่ | **พัง** — client ที่ `switch` ครบทุกค่าจะเจอค่าที่ไม่รู้จัก |
| ลบ/เปลี่ยนชื่อฟิลด์ | **พัง** |
| เปลี่ยนชนิดข้อมูล (`"12"` → `12`) | **พัง** |
| ทำให้ฟิลด์ที่เคยไม่บังคับกลายเป็นบังคับ | **พัง** |
| เปลี่ยน HTTP status ที่คืนในกรณีเดิม | **พัง** |
| ทำให้กฎ validation เข้มขึ้น | **พัง** |

\* ต่อเมื่อบอกฝั่งเรียกไว้แต่แรกว่า "ฟิลด์ที่ไม่รู้จักให้ข้ามไป"
ข้อนี้ต้องเขียนไว้ใน `API-CONVENTIONS.md` ไม่ใช่หวังเอาเอง

**ขึ้นเวอร์ชันใหญ่เมื่อจำเป็นจริง** เพราะทุกเวอร์ชันที่ยังเปิดอยู่คือโค้ดอีกชุดที่ต้องดูแล

---

## 4 · pagination

**ทุก endpoint ที่คืนรายการต้องมี pagination ตั้งแต่วันแรก** ไม่มีข้อยกเว้น
รายการที่ "มีไม่กี่รายการหรอก" อีก 2 ปีจะมี 10,000 รายการ

| วิธี | ใช้เมื่อ | ข้อจำกัด |
|---|---|---|
| **cursor** `?limit=50&cursor=eyJ...` | ค่าเริ่มต้น · ข้อมูลเยอะ · มีข้อมูลเพิ่มระหว่างเปิดดู | กระโดดไปหน้า 7 ไม่ได้ |
| offset `?limit=50&offset=100` | ต้องมีเลขหน้าให้กด · ข้อมูลไม่เยอะ | ยิ่งหน้าลึกยิ่งช้า · ถ้ามีแถวแทรกระหว่างเปิดดู ข้อมูลจะซ้ำหรือหาย |

```jsonc
// GET /v1/orders?limit=2 → 200
{
  "data": [ { "id": "1042" }, { "id": "1041" } ],
  "page": {
    "limit": 2,
    "nextCursor": "eyJpZCI6MTA0MX0",   // null เมื่อหมดแล้ว
    "hasMore": true
  }
}
```

- ห่อรายการไว้ใน `data` เสมอ เพราะถ้าตอบเป็นอาเรย์เปล่า ๆ วันหลังจะเติมข้อมูลหน้าไม่ได้
- `limit` มีค่าเริ่มต้นและ**เพดานที่บังคับฝั่งเซิร์ฟเวอร์** (เช่น เริ่มต้น 20 สูงสุด 100)
- `totalCount` นับแพง จึงให้ขอเป็นตัวเลือก `?includeTotal=true` อย่านับทุกครั้ง
- **cursor ต้องทึบ** (ฝั่งเรียกห้ามแกะหรือประกอบเอง)

---

## 5 · filtering · sorting · ฟิลด์ที่ขอ

```
GET /v1/orders?status=confirmed&createdAt[gte]=2026-01-01&sort=-createdAt&fields=id,orderNo,total
```

| เรื่อง | ข้อตกลง |
|---|---|
| กรองค่าเท่ากับ | `?status=confirmed` |
| หลายค่า | `?status=confirmed,shipped` |
| ช่วง | `?createdAt[gte]=...&createdAt[lt]=...` |
| เรียง | `?sort=-createdAt,orderNo` — `-` คือมากไปน้อย |
| ค้นหาข้อความ | `?q=สมชาย` แยกจากการกรอง |
| เลือกฟิลด์ | `?fields=id,orderNo` |

- **รับเฉพาะฟิลด์ที่กำหนดไว้** ถ้ารับชื่อฟิลด์อะไรก็ได้ จะเกิดช่องโหว่ และ query ที่ไม่มี index
- พารามิเตอร์ที่ไม่รู้จัก ตอบ `400` ดีกว่าข้ามเงียบ ๆ ไม่งั้นฝั่งเรียกพิมพ์ผิดแล้วได้ข้อมูลผิดโดยไม่รู้ตัว

---

## 6 · รูปแบบข้อมูล

| ข้อมูล | รูปแบบ | ตัวอย่าง |
|---|---|---|
| ชื่อฟิลด์ | `camelCase` ทั้งระบบ | `createdAt` |
| เวลา | RFC 3339 · UTC · ลงท้าย `Z` | `"2026-09-25T09:42:13.482Z"` |
| วันที่ล้วน | `YYYY-MM-DD` | `"2026-09-25"` |
| เงิน | ตัวเลขเป็น**สตริง** + สกุลเงินแยก | `{ "amount": "1250.00", "currency": "THB" }` |
| identifier | **สตริงเสมอ** | `"1042"` ไม่ใช่ `1042` |
| enum | `SCREAMING_SNAKE` หรือ `lower_snake` เลือกแบบเดียว | `"CONFIRMED"` |
| ระยะเวลา | วินาทีเป็นตัวเลข ตั้งชื่อให้รู้หน่วย | `"timeoutSeconds": 30` |
| ประเทศ / สกุลเงิน / ภาษา | ISO 3166 · ISO 4217 · BCP 47 | `"TH"` · `"THB"` · `"th-TH"` |

> 🚨 **id เป็นตัวเลขใน JSON คือระเบิดเวลา** — JavaScript เก็บจำนวนเต็มได้ปลอดภัยถึง 9,007,199,254,740,991
> `bigint` ที่เกินนั้นจะถูกปัดเศษเงียบ ๆ ตอน `JSON.parse` และถ้าจะเปลี่ยนเป็นสตริงทีหลังก็เป็น breaking change
>
> 🚨 **เงินเป็น float ใน JSON** — `1250.10` ที่ผ่าน 2 ภาษาโปรแกรมอาจกลายเป็น `1250.0999999999999`

**`null` กับ "ไม่มีฟิลด์" ต้องหมายถึงคนละอย่าง:**

- ใน response ฟิลด์ที่มีแต่ไม่มีค่าให้ส่ง `null` ไม่ตัดทิ้ง ฝั่งเรียกจะได้ไม่ต้องเช็ค 2 แบบ
- ใน `PATCH` ถ้าส่ง `{"note": null}` แปลว่าล้างค่า ถ้าไม่ส่งคีย์ `note` เลยแปลว่าไม่แตะ

**อาเรย์ว่างคือ `[]` ไม่ใช่ `null`** ฝั่งเรียกจะวนลูปได้เลย

---

## 7 · error

รูปแบบ error (RFC 9457 · `requestId` · `errors` แบบ array `{field, code, message}`) และตัวอย่างอยู่ที่ `web-service-essentials` ข้อ 2 ที่เดียว ใช้ตามนั้น
ที่ต้องตกลงเพิ่มคือ **error ระดับฟิลด์**:

- **`code` ให้โปรแกรมอ่าน · `message` ให้คนอ่าน** อย่าให้ฝั่งเรียกต้องเอาข้อความไปเขียนเงื่อนไข
- ชี้ตำแหน่งฟิลด์ด้วยเส้นทางเต็ม รวมดัชนีของอาเรย์
- **คืน error ครบทุกฟิลด์ในครั้งเดียว** ไม่ใช่ทีละตัว ผู้ใช้จะได้ไม่ต้องกดส่ง 5 รอบ
- ถ้ารองรับหลายภาษา ให้เลือกข้อความไทยหรืออังกฤษจาก `Accept-Language`

**เลือก status ให้ตรง:** `400` รูปแบบคำขอผิด · `401` ยังไม่ได้ยืนยันตัวตน · `403` ยืนยันแล้วแต่ไม่มีสิทธิ์ ·
`404` ไม่มีหรือไม่ให้รู้ว่ามี · `409` ชนกับสถานะปัจจุบัน · `422` รูปแบบถูกแต่ข้อมูลไม่ผ่านกฎ · `429` เรียกถี่เกิน

---

## 8 · เรียกซ้ำไม่เกิดผลซ้ำ และการแก้ชนกัน

### idempotency key (รหัสกำกับคำขอ — ส่งซ้ำแล้วไม่ทำงานซ้ำ)

**บังคับกับทุก `POST` ที่มีผลทางการเงินหรือส่งของออกไปข้างนอก**

```
POST /v1/payments
Idempotency-Key: 7f3c1e10-...        ← ฝั่งเรียกสร้าง เก็บไว้ใช้ตอน retry
```

- เซิร์ฟเวอร์เก็บ key คู่กับผลลัพธ์ไว้อย่างน้อย 24 ชั่วโมง
- key เดิมกับเนื้อหาเดิม ให้คืนผลเดิม ไม่ทำงานซ้ำ
- key เดิมแต่เนื้อหา**ต่าง** ให้ตอบ `422` ไม่ทำงานใหม่
- เครือข่ายขาดระหว่างรอคำตอบเป็นเรื่องปกติ ไม่ใช่กรณีพิเศษ ฝั่งเรียกจึง retry เสมอ

### แก้ชนกัน (optimistic concurrency)

```
GET   /v1/orders/1042        → 200  ETag: "v7"
PATCH /v1/orders/1042        If-Match: "v7"
                             → 200 ปกติ · 412 ถ้ามีคนแก้ไปก่อนแล้ว
```

ถ้าไม่มี คนที่กดบันทึกทีหลังจะทับงานของคนแรกโดยไม่มีใครรู้

---

## 9 · rate limit

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 997
X-RateLimit-Reset: 1758790000
Retry-After: 42                ← ต้องมีคู่กับ 429 เสมอ
```

ถ้า `429` ไม่มี `Retry-After` ฝั่งเรียกต้องเดาเอง และส่วนใหญ่เดาว่า "ลองใหม่ทันที"

---

## 10 · การเลิกใช้ endpoint

1. ประกาศล่วงหน้า พร้อมบอกว่าใช้อะไรแทน
2. ส่ง header ในทุก response ของ endpoint นั้น:
   ```
   Deprecation: true
   Sunset: Wed, 31 Dec 2026 23:59:59 GMT
   Link: <https://docs.acme.co/v2/orders>; rel="successor-version"
   ```
3. **ดูจาก log ว่ายังมีใครเรียกอยู่** แล้วติดต่อเขาตรง ๆ อย่ารอให้เงียบไปเอง
4. ปิดจริงหลังวันที่ประกาศ ไม่ใช่ก่อน

ระยะเวลาที่พอดี: API ภายในให้ 1 รอบ release ส่วน API ที่คนนอกใช้ให้อย่างน้อย 6 เดือน

---

## 11 · Anti-patterns

- ❌ **`200 OK` พร้อม `{"success": false}`** — ตัวเฝ้าระบบและ log ทั้งหมดจะมองไม่เห็นว่าพัง
- ❌ **กริยาใน URL** — `/createOrder`, `/getOrderById`
- ❌ **รายการที่ไม่มี pagination** — วันหนึ่งจะคืนข้อมูล 50,000 แถวในครั้งเดียว
- ❌ **รูปแบบวันที่คนละแบบในแต่ละ endpoint** — เช่น `"25/09/2026"` ที่ไม่มีใครรู้ว่าวันหรือเดือนขึ้นก่อน
- ❌ **ส่ง entity ของฐานข้อมูลออกไปตรง ๆ** — เพิ่มคอลัมน์ทีไร API เปลี่ยนตามโดยไม่ตั้งใจ และเสี่ยงข้อมูลภายในหลุด
- ❌ **ชื่อฟิลด์ปนกัน** `created_at` กับ `updatedAt` ใน response เดียวกัน
- ❌ **`GET` ที่เปลี่ยนข้อมูล** — ตัวโหลดหน้าเว็บล่วงหน้าจะยิงเองโดยไม่มีใครกด
- ❌ **error message เปลี่ยนไปเรื่อย ๆ** โดยไม่มี `code` คงที่
- ❌ **ไม่มีเอกสาร** — OpenAPI ที่สร้างจากโค้ดจริง ดีกว่าเอกสารที่เขียนมือแล้วไม่ตรง

---

## 12 · ตัวย่อ

- **API** — Application Programming Interface (ช่องทางให้โปรแกรมเรียกใช้กันเอง)
- **CRUD** — Create Read Update Delete (สร้าง อ่าน แก้ ลบ)
- **RFC 3339** — มาตรฐานรูปแบบวันเวลาในข้อความ
- **RFC 9457** — มาตรฐานรูปร่างข้อความ error ของ HTTP
- **ETag** — Entity Tag (รหัสระบุรุ่นของข้อมูล ใช้ตรวจว่ามีคนแก้ไปก่อนไหม)
- **ISO 4217** — มาตรฐานรหัสสกุลเงิน เช่น THB
- **OpenAPI** — รูปแบบมาตรฐานสำหรับบรรยาย API ให้เครื่องอ่านได้

## 13 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| health check · error envelope · timeout | `web-service-essentials` |
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง ๆ | command `/api-design` |
| ชนิดข้อมูลในฐานข้อมูล | `database-design` |
| token · scope · สิทธิ์ | `auth-implementation-patterns` |
| correlation id ที่โผล่ใน error | `logging-standards` |
| test สัญญาระหว่างระบบ | `testing-standards` |
| บันทึกเหตุผลที่เลือกข้อตกลงนี้ | `adr-writer` |

**แม่แบบเอกสารข้อตกลงที่คัดลอกไปใช้ได้เลย** → `assets/API-CONVENTIONS.md`


---

# skill: data-import-export

Use when a system imports or exports Excel or CSV data. Validate before write, row errors, Thai data and Buddhist years.

# นำเข้าและส่งออกข้อมูล

> **กฎข้อเดียว:** ตรวจให้จบก่อน แล้วค่อยเขียน
> ถ้าเขียนไปครึ่งทางแล้วเจอแถวผิด ข้อมูลจะค้างอยู่ครึ่ง ๆ และไม่มีใครรู้ว่าต้องแก้ตรงไหน

## เมื่อไหร่ใช้ skill นี้

- มีหน้าจอให้ผู้ใช้อัปโหลด Excel หรือ CSV เพื่อนำข้อมูลเข้าระบบ
- มีปุ่มส่งออกเป็น Excel หรือ CSV
- ย้ายข้อมูลจากระบบเก่าเข้าระบบใหม่
- ผู้ใช้อัปโหลดแล้วได้ข้อความว่า "ไฟล์ไม่ถูกต้อง" แล้วไม่รู้ว่าผิดตรงไหน

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| รับไฟล์อัปโหลดทั่วไป (รูป เอกสาร) | `file-upload-and-storage` |
| สร้างไฟล์ Excel ที่จัดรูปแบบสวยงาม | `anthropic-skills:xlsx` |
| กลไกคิวและความคืบหน้า | `background-jobs` |
| ปี พ.ศ. และการเรียงลำดับไทย | `i18n-and-locale` |

---

## 1 · ให้แม่แบบ อย่าให้เดา

**ทุกหน้าจอนำเข้าต้องมีปุ่มดาวน์โหลดแม่แบบ** ในแม่แบบมี

- หัวคอลัมน์ตรงกับที่ระบบต้องการเป๊ะ
- **แถวตัวอย่าง 1–2 แถวที่ถูกต้อง**
- แถวคำอธิบายว่าคอลัมน์ไหนบังคับ รูปแบบอะไร ค่าที่รับได้มีอะไรบ้าง
- ชีตแยกสำหรับรายการค่าที่เลือกได้ (สถานะ ประเภท หน่วย)

| ไฟล์ต่างจากแม่แบบแบบไหน | ทำ |
|---|---|
| ลำดับคอลัมน์สลับ | ✅ อ่านจากชื่อหัวคอลัมน์ ไม่ใช่ตำแหน่ง |
| หัวคอลัมน์มีเว้นวรรคเกิน ตัวพิมพ์ต่าง | ✅ ตัดช่องว่างและเทียบแบบไม่สนตัวพิมพ์ |
| มีคอลัมน์เกินที่ไม่รู้จัก | ✅ ข้ามไป แต่**บอกให้รู้ว่าข้ามอะไร** |
| ขาดคอลัมน์บังคับ | ❌ หยุดทันที บอกว่าขาดคอลัมน์ไหน |

---

## 2 · ตรวจสามชั้น ก่อนเขียนอะไรทั้งนั้น

| ชั้น | ตรวจอะไร | ตัวอย่างข้อความ |
|:--:|---|---|
| 1 · ไฟล์ | เปิดได้ · มีชีตที่ต้องการ · คอลัมน์บังคับครบ · ไม่เกินจำนวนแถวสูงสุด | "ไม่พบคอลัมน์ 'รหัสสินค้า'" |
| 2 · รายแถว | ชนิดข้อมูล · ค่าบังคับ · อยู่ในรายการที่กำหนด · ช่วงตัวเลข | "แถว 42 คอลัมน์ 'จำนวน' ต้องเป็นตัวเลขมากกว่า 0 (พบ '-5')" |
| 3 · ความสัมพันธ์ | รหัสมีอยู่จริงในระบบ · ไม่ซ้ำกันเองในไฟล์ · กฎทางธุรกิจ | "แถว 88 ไม่พบลูกค้ารหัส C-1042" |

**รายงานความผิดพลาดต้องระบุ: แถว · คอลัมน์ · ค่าที่พบ · ค่าที่ควรเป็น**

```
❌ "ไฟล์ไม่ถูกต้อง"
❌ "พบข้อผิดพลาด 37 รายการ"
✅ ตารางผลตรวจ พร้อมปุ่มดาวน์โหลดไฟล์เดิมที่มีคอลัมน์ "ข้อผิดพลาด" ต่อท้าย
```

> **รายงานข้อผิดพลาดทั้งหมดในครั้งเดียว ไม่หยุดที่แถวแรกที่ผิด**
> ผู้ใช้จะได้แก้รอบเดียวจบ ไม่ใช่อัปโหลดใหม่ 37 รอบ

---

## 3 · เขียนลงระบบ

| แบบ | ใช้เมื่อ |
|---|---|
| **ทั้งหมดหรือไม่ทำเลย** | ค่าเริ่มต้น ไฟล์ต้องถูกหมดถึงจะนำเข้า |
| ทำเท่าที่ผ่าน ข้ามแถวที่ผิด | ไฟล์ใหญ่มากและแต่ละแถวไม่เกี่ยวกัน โดย**ผู้ใช้ต้องเลือกเอง ระบบไม่ตัดสินใจแทน** |

- **ทุกครั้งต้องมีหน้าสรุปก่อนยืนยัน** เช่น "จะเพิ่ม 120 · แก้ 45 · ข้าม 3 · ผิด 0" แล้วให้กดยืนยัน
- ถ้าเจอแถวซ้ำในไฟล์ ให้หยุดและบอก ไม่ใช่ใช้แถวสุดท้ายเงียบ ๆ
- ถ้าข้อมูลมีอยู่แล้วในระบบ ให้ผู้ใช้เลือก: ข้าม · เขียนทับ · หยุด
- **นำเข้าทุกครั้งต้องบันทึกใน audit** ว่าใครนำเข้า ไฟล์อะไร กระทบกี่แถว (ดู `audit-trail`)
- **เก็บไฟล์ต้นฉบับไว้** พอมีปัญหาจะได้ย้อนดูว่าไฟล์ที่ส่งมาหน้าตาอย่างไรจริง ๆ
- ทำให้ย้อนกลับได้: บันทึก batch id (รหัสรอบนำเข้า) ไว้กับทุกแถวที่นำเข้า

**ไฟล์ใหญ่ทำเป็นงานเบื้องหลัง**: ถ้าเกินประมาณ 1,000 แถวให้เข้าคิว
แบ่งเป็นชุดละ 500 แถว แสดงความคืบหน้า และยกเลิกได้ (ดู `background-jobs`)

---

## 4 · กับดักของ Excel และ CSV

| กับดัก | ผลที่เกิด | ทางแก้ |
|---|---|---|
| **ภาษาไทยใน CSV เพี้ยน** | เปิดใน Excel แล้วตัวอักษรอ่านไม่ออก | บันทึกเป็น UTF-8 **พร้อม BOM** หรือแนะให้ใช้ .xlsx |
| **รหัสที่ขึ้นต้นด้วย 0 หาย** | `0812345678` กลายเป็น `812345678` | อ่านเป็นข้อความเสมอ ส่วนตอนส่งออกให้ตั้งรูปแบบเซลล์เป็นข้อความ |
| **เลขยาวกลายเป็นเลขยกกำลัง** | เลขบัตร 13 หลัก → `1.23457E+12` | เหมือนข้างบน |
| **วันที่ถูกตีความเอง** | `03/04/2026` เป็นมีนาคมหรือเมษายน | บังคับ `YYYY-MM-DD` ในแม่แบบ |
| **ปี พ.ศ. กับ ค.ศ. ปนกัน** | เพี้ยน 543 ปีเงียบ ๆ | **ถามในหน้าจอนำเข้าว่าไฟล์ใช้ปีแบบไหน** |
| ช่องว่างท้ายค่า | จับคู่รหัสไม่เจอ | ตัดช่องว่างหัวท้ายทุกค่า |
| เซลล์ที่เป็นสูตร | ได้สูตรแทนค่า | อ่านค่าที่คำนวณแล้ว |
| **สูตรที่ขึ้นต้นด้วย `=` `+` `-` `@` ในไฟล์ส่งออก** | ผู้ใช้เปิดแล้ว Excel รันคำสั่ง | เติม `'` นำหน้าค่าที่ขึ้นต้นด้วยอักขระเหล่านี้ |

> 🚨 **ช่องโหว่ที่คนไม่ค่อยรู้**: ชื่อลูกค้าที่เป็น `=cmd|'/c calc'!A1` ถ้าส่งออกดิบ ๆ
> แล้วมีคนเปิดใน Excel มันจะพยายามรันคำสั่งจริง ตอนส่งออกจึงต้อง escape เสมอ

---

## 5 · ส่งออก

| เรื่อง | กฎ |
|---|---|
| ขนาด | ถ้าเกินประมาณ 50,000 แถว ให้ทำเป็นงานเบื้องหลัง แล้วส่งลิงก์ให้ดาวน์โหลด |
| สิทธิ์ | **ส่งออกได้เฉพาะข้อมูลที่ผู้ใช้คนนั้นมีสิทธิ์เห็นอยู่แล้ว** เพราะนี่คือจุดรั่วที่พบบ่อยที่สุด |
| audit | บันทึกทุกครั้งว่าใครส่งออกข้อมูลอะไร ช่วงไหน กี่แถว |
| ข้อมูลส่วนบุคคล | ปิดบังคอลัมน์ที่ไม่จำเป็น (ดู `pdpa-compliance`) |
| ชื่อไฟล์ | `<เรื่อง>-<ช่วงวันที่>-<เวลาที่ส่งออก>.xlsx` |
| ส่วนหัวของไฟล์ | ใส่เงื่อนไขกรองที่ใช้ และเวลาที่ส่งออก ไม่งั้นอีก 3 เดือนไม่มีใครรู้ว่าไฟล์นี้คือข้อมูลอะไร |
| ลิงก์ดาวน์โหลด | ต้องหมดอายุ (ดู `file-upload-and-storage`) |
| รูปแบบ | `.xlsx` สำหรับคนอ่าน · CSV สำหรับเครื่องอ่าน |

---

## 6 · Anti-patterns

- ❌ **"ไฟล์ไม่ถูกต้อง"** ผู้ใช้ทำอะไรต่อไม่ได้
- ❌ **หยุดที่แถวแรกที่ผิด** ผู้ใช้ต้องอัปโหลดใหม่ 30 รอบ
- ❌ **เขียนไปตรวจไป** พอล้มกลางทาง ข้อมูลก็ค้างครึ่ง ๆ
- ❌ **ไม่มีหน้าสรุปก่อนยืนยัน** เขียนทับข้อมูลจริงโดยไม่มีใครทันได้ดู
- ❌ **ไม่มีแม่แบบให้ดาวน์โหลด** ผู้ใช้ต้องเดาหัวคอลัมน์
- ❌ **อ่านคอลัมน์ตามตำแหน่ง** ผู้ใช้แทรกคอลัมน์เดียวก็พังทั้งไฟล์
- ❌ **อ่านรหัสเป็นตัวเลข** เลข 0 นำหน้าหายทุกครั้ง
- ❌ **ไม่ถามว่าปีเป็น พ.ศ. หรือ ค.ศ.** ปีเพี้ยน 543 ปีโดยไม่มีใครรู้
- ❌ **ส่งออกโดยไม่ escape สูตร** เปิดไฟล์แล้วรันคำสั่ง
- ❌ **ส่งออกได้เกินสิทธิ์ที่มี** ข้อมูลรั่วผ่านปุ่มที่เราทำเอง
- ❌ **ไม่เก็บไฟล์ต้นฉบับ** มีปัญหาแล้วย้อนดูไม่ได้

---

## 7 · ตัวย่อ

- **CSV** — Comma-Separated Values (ไฟล์ข้อความที่คั่นค่าด้วยจุลภาค)
- **BOM** — Byte Order Mark (ไบต์นำหน้าไฟล์ที่บอกว่าเป็น UTF-8 ทำให้ Excel อ่านภาษาไทยถูก)
- **UTF-8** — มาตรฐานการเข้ารหัสตัวอักษรที่รองรับทุกภาษา
- **batch** — ชุดของแถวที่นำเข้าพร้อมกันในครั้งเดียว
- **CSV injection** — ช่องโหว่ที่ค่าซึ่งขึ้นต้นด้วย `=` ถูก Excel ตีความเป็นสูตรและรันคำสั่ง

## 8 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| รับไฟล์อัปโหลดอย่างปลอดภัย | `file-upload-and-storage` |
| ทำเป็นงานเบื้องหลังพร้อมความคืบหน้า | `background-jobs` |
| สร้างไฟล์ Excel ที่จัดรูปแบบแล้ว | `anthropic-skills:xlsx` |
| ปี พ.ศ. · การเรียงลำดับไทย · การเข้ารหัสตัวอักษร | `i18n-and-locale` |
| บันทึกว่าใครนำเข้าหรือส่งออกอะไร | `audit-trail` |
| ปิดบังข้อมูลส่วนบุคคลในไฟล์ส่งออก | `pdpa-compliance` |
| แจ้งผู้ใช้เมื่อนำเข้าเสร็จ | `notifications` |
| ข้อจำกัดและ constraint ของตารางปลายทาง | `database-design` |
