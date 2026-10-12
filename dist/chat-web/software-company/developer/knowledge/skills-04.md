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

Use when writing or reviewing SQL queries, procedures or data-change scripts (SQL Server, PostgreSQL).

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

# skill: e2e-testing-patterns

Use when designing end-to-end tests with Playwright or Cypress, fixing flaky tests or running in CI.

> **ใน SuperUser:** ถ้าอยากให้ agent รันแอปและพิสูจน์ผลเอง ให้ใช้ [`app-verifier-setup`](../app-verifier-setup/SKILL.md) ส่วน skill นี้คือหลักออกแบบชุดทดสอบ E2E (end-to-end) ที่ verifier นั้นเรียกใช้

# End-to-End Testing Patterns

## When to use this skill

- Setting up E2E testing in a new project
- Choosing between Playwright, Cypress, Selenium
- Structuring a growing E2E test suite
- Fighting flaky tests
- Designing test data strategy
- Adding E2E to a CI/CD pipeline
- Migrating from one framework to another

## When NOT to use

| Task | Use instead |
|---|---|
| Writing manual test cases (steps, expected result) | `test-case-template` |
| Unit or integration tests, test ratio and scope | `testing-standards` |

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/page-object-model.md](references/page-object-model.md) | ถ้าจะตั้งโครงชุดทดสอบใหม่ หรือเจอเทสต์ที่ลอกขั้นตอนล็อกอินซ้ำกัน ให้เปิดดูโค้ดเทียบแบบไม่ดีกับแบบ Page Object |
| [references/test-data-strategies.md](references/test-data-strategies.md) | ตอนเลือกวิธีเตรียมข้อมูลทดสอบ และอยากเห็นข้อดีข้อเสียของทั้ง 4 แบบพร้อมโค้ดตัวอย่าง |
| [references/flaky-tests.md](references/flaky-tests.md) | ถ้าเทสต์ผ่านบ้างไม่ผ่านบ้าง ให้เปิดดูโค้ดเทียบการรอแบบ sleep กับการรอตามเหตุการณ์ |
| [references/auth-in-e2e.md](references/auth-in-e2e.md) | ตอนวางวิธีล็อกอินในชุดทดสอบ และต้องการโค้ด `storageState` หรือการฉีด cookie ผ่าน API |
| [references/ci-and-parallel.md](references/ci-and-parallel.md) | ตอนตั้งการรันขนานหรือแบ่งรอบการรัน E2E ใน CI และต้องรู้ว่าต้องเก็บไฟล์อะไรเมื่อเทสต์ล้ม |
| [references/coverage-and-libraries.md](references/coverage-and-libraries.md) | ตอนทำตารางความครอบคลุมของเส้นทางผู้ใช้ หรือย้ายคำสั่งระหว่าง Playwright กับ Cypress |

## The Testing Pyramid (Get This Right First)

```
        ▲
       ╱E╲       E2E: ~5% of tests (same pyramid as testing-standards)
      ╱ 2 ╲
     ╱  E  ╲     - Slow, expensive, flaky
    ╱───────╲    - Test critical user journeys ONLY
   ╱  Integ  ╲   Integration: ~20%
  ╱           ╲  - API contracts, DB interactions
 ╱─────────────╲ Unit: ~75%
╱      Unit     ╲ - Fast, deterministic, many
─────────────────
```

> 🚨 **Anti-pattern: Ice cream cone** (many E2E tests, few unit tests)
> Result: slow CI, flaky tests, slow debugging

## Framework Selection (2026)

| Framework | Best for | Avoid for |
|-----------|----------|-----------|
| **Playwright** ⭐ | Modern apps, cross-browser, parallel | Legacy apps with weird patterns |
| **Cypress** | Developer experience, easy to learn, single-app | Multi-tab, cross-origin tests |
| **Selenium** | Legacy, language flexibility | Greenfield projects |
| **Puppeteer** | Chrome-only, scraping | Cross-browser needs |
| **WebDriverIO** | Mobile + web, BDD style | Simple use cases |

> 💡 **Default recommendation: Playwright** — best developer experience, fast, cross-browser, made by Microsoft

## Test Structure: Page Object Model (POM)

ถ้าทุกเทสต์เขียน `page.fill` และ `page.click` ของหน้าเดียวกันซ้ำ ๆ ให้ย้ายขั้นตอนเหล่านั้นไปไว้ในคลาสของหน้านั้น แล้วให้เทสต์เรียกเมธอดแทน โค้ดเทียบอยู่ใน [references/page-object-model.md](references/page-object-model.md)

> 💡 **One Page Object per page or major component.**

## Selectors: Hierarchy of Goodness

```
Most resilient ─────────────────────────► Most brittle

✅ Role + accessible name      page.getByRole('button', { name: 'Submit' })
✅ Test IDs                     page.getByTestId('submit-btn')
🟡 Visible text                 page.getByText('Submit')
🟡 Label                        page.getByLabel('Email')
🔴 CSS classes                  page.locator('.btn-primary')
🔴 Tag + index                  page.locator('button:nth-child(3)')
❌ XPath                        page.locator('//div[2]/button')
```

**Rule:** Prefer queries that survive refactoring.

## Test Data Strategy

มี 4 แบบ คือ shared test DB · per-test setup · API setup กับ UI verification · database snapshot กับ rollback
แบบที่แนะนำคือ **Option 3: API setup, UI verification (best)** — เตรียมข้อมูลผ่าน API ให้เร็วและแน่นอน แล้วค่อยทดสอบ UI จริง ส่วน shared test DB ทำให้เทสต์พึ่งลำดับกัน รันขนานยาก และข้อมูลปนกัน ส่วนข้อดีข้อเสียครบทุกแบบอยู่ใน [references/test-data-strategies.md](references/test-data-strategies.md)

## What to Test E2E (Not Everything!)

### ✅ DO test E2E
- Critical user journeys (login → checkout → confirmation)
- Multi-step workflows that span multiple pages
- Integration with external services (payment, email)
- "Smoke tests" that verify deployment works
- Cross-browser specific behavior

### ❌ DON'T test E2E
- Every form validation (use unit tests)
- Edge cases of business logic (use unit/integration)
- Every error message (use unit tests)
- Performance (use dedicated tools)
- Visual design (use visual regression tools)

> 💡 **Rule of thumb:** If a unit/integration test can verify it, don't add E2E.

ให้ทำตารางความครอบคลุมของเส้นทางผู้ใช้ (Critical Path Coverage Matrix) ที่บอกว่าแต่ละเส้นทางครอบคลุมแล้วหรือยัง และสำคัญระดับ P0 P1 หรือ P2 ตัวอย่างอยู่ใน [references/coverage-and-libraries.md](references/coverage-and-libraries.md)

## Fighting Flaky Tests

| Cause | Fix |
|-------|-----|
| Hard-coded sleeps | Use auto-waiting (Playwright/Cypress have this) |
| Animation timing | Wait for animation to complete OR disable in tests |
| Network race conditions | `page.waitForResponse(url)` before assertion |
| Test data leak | Use unique data per test (timestamp/UUID) |
| Order dependency | Each test fully isolated, parallelizable |
| Auth race condition | Pre-authenticate via API, inject session |
| Element not stable | `expect(el).toBeVisible()` before interacting |

ห้ามใช้ `page.waitForTimeout` รอแบบกำหนดเวลา ให้รอเหตุการณ์จริง เช่น response ของ API แทน โค้ดเทียบอยู่ใน [references/flaky-tests.md](references/flaky-tests.md)

### Retry strategy
- **In CI:** auto-retry failed tests 1-2 times
- **Track flakiness:** a test that fails > 5% of runs is a candidate for quarantine (pulled out of the blocking run)
- **Don't accept flaky tests:** investigate or delete them. Don't ignore them

## Authentication in E2E

อย่าล็อกอินผ่าน UI ในทุกเทสต์ เพราะช้า เปราะ และโค้ดซ้ำ ให้ล็อกอินครั้งเดียวแล้วแชร์สถานะ (`storageState`) หรือดีกว่านั้นคือล็อกอินผ่าน API แล้วฉีด cookie เข้า browser context โค้ดทั้งสามแบบอยู่ใน [references/auth-in-e2e.md](references/auth-in-e2e.md)

## Parallelization and CI

**Requirements for safe parallel:**
- ✅ Tests don't share state
- ✅ Unique test data per test
- ✅ Database/external services support concurrency

แบ่ง E2E ใน CI เป็น 3 รอบ คือ smoke ทุก PR ที่ล้มแล้วบล็อกการ merge → full ทุกคืนแบบข้าม browser → pre-prod ก่อน deploy ที่ต้องผ่าน P0 และ P1 เมื่อเทสต์ล้มต้องเก็บ screenshot · video · trace · console log · network log ไว้เสมอ ส่วนระดับการรันขนานและรายละเอียดของแต่ละรอบอยู่ใน [references/ci-and-parallel.md](references/ci-and-parallel.md)

## Anti-patterns

- ❌ **Testing implementation details** — selectors based on internal structure
- ❌ **Long monolithic tests** — one test with 50 steps is hard to debug
- ❌ **Coupled tests** — Test B depends on Test A having run
- ❌ **Hidden state** — tests behave differently depending on order or data
- ❌ **Manual cleanup** — relying on people to reset the environment
- ❌ **No quarantine** — failing tests get merged anyway because "it's flaky"
- ❌ **Mocking everything** — at this layer, use the real integrations, or it's not E2E

## Quality Targets (from qa-tester agent)

- Critical path coverage: 100%
- Test runtime: ≤ 10 min for smoke, ≤ 30 min for full
- Flakiness rate: < 2%
- Pass rate in main: > 95%
- Mean time to fix flake: < 2 days

ตารางเทียบคำสั่งที่ใช้บ่อยของ Playwright กับ Cypress (Library Quick Reference) อยู่ใน [references/coverage-and-libraries.md](references/coverage-and-libraries.md)


## reference: auth-in-e2e.md

# Authentication in E2E — ตัวอย่างการล็อกอินในเทสต์

สามวิธีล็อกอินในชุดทดสอบ เรียงจากแย่ไปดี พร้อมโค้ดตัวอย่างของ Playwright

## ❌ Bad: log in via UI every test
```
Slow, brittle, duplicate code
```

## ✅ Good: log in once, share state
```typescript
// playwright.config.ts
{
  use: { storageState: 'auth.json' },
  globalSetup: 'global-setup.ts',  // logs in once, saves cookies
}
```

## ✅ Better: API login + cookie injection
```typescript
async function login(page, user) {
  const response = await page.request.post('/api/login', { data: user });
  const cookies = await response.headers();
  await page.context().addCookies([...]);
}
```


## reference: ci-and-parallel.md

# Parallelization และ CI Integration

ระดับการรันขนาน รอบการรัน E2E ใน CI และไฟล์ที่ต้องเก็บไว้เมื่อเทสต์ล้ม

## Parallelization

| Level | Speedup | Complexity |
|-------|--------:|:----------:|
| File-level parallel | 4-8x | 🟢 Low (just enable) |
| Test-level within file | 10x+ | 🟡 Med (isolation needed) |
| Sharded across CI workers | Nx | 🟡 Med (requires sharding config) |
| Cloud grid (BrowserStack, etc.) | Massive | 🔴 High (cost) |

**Requirements for safe parallel:**
- ✅ Tests don't share state
- ✅ Unique test data per test
- ✅ Database/external services support concurrency

## CI Integration

### Run E2E tier
```yaml
# Smoke (every PR, 2 min)
- 5-10 critical tests
- Fail = block merge

# Full (nightly, 30 min)
- All E2E tests
- Cross-browser
- Failures investigated next day

# Pre-prod (before deploy, 10 min)
- P0 + P1 tests
- Must pass before prod deploy
```

### Artifacts to capture
- ✅ Screenshots on failure
- ✅ Video on failure
- ✅ Trace files (Playwright)
- ✅ Console logs
- ✅ Network logs


## reference: coverage-and-libraries.md

# Critical Path Coverage Matrix และ Library Quick Reference

ตัวอย่างตารางความครอบคลุมของเส้นทางผู้ใช้ และตารางเทียบคำสั่งที่ใช้บ่อยของ Playwright กับ Cypress

## Critical Path Coverage Matrix

```markdown
| User Journey | Coverage | Priority |
|--------------|:--------:|:--------:|
| Signup → first action | ✅ | 🔴 P0 |
| Login → main task | ✅ | 🔴 P0 |
| Add to cart → checkout → success | ✅ | 🔴 P0 |
| Search → filter → result | ✅ | 🟡 P1 |
| Settings → save | ✅ | 🟡 P1 |
| Admin panel CRUD | ✅ | 🟡 P1 |
| Password reset | ✅ | 🟢 P2 |
| Profile edit | 🟡 Sample | 🟢 P2 |
```

## Library Quick Reference

| Need | Playwright | Cypress |
|------|-----------|---------|
| Visit page | `page.goto(url)` | `cy.visit(url)` |
| Click | `page.click(sel)` | `cy.get(sel).click()` |
| Type | `page.fill(sel, text)` | `cy.get(sel).type(text)` |
| Assert text | `expect(page.getByText(...))` | `cy.contains(...)` |
| Wait for response | `page.waitForResponse(...)` | `cy.intercept(...).as(...)` |
| Screenshot | `page.screenshot()` | `cy.screenshot()` |


## reference: flaky-tests.md

# Fighting Flaky Tests — ตัวอย่างการรอที่ถูกวิธี

โค้ดเทียบการรอแบบกำหนดเวลากับการรอตามเหตุการณ์ ส่วนตารางสาเหตุและกลยุทธ์การรันซ้ำอยู่ใน `SKILL.md`

## ❌ Bad (sleep hack)
```typescript
await page.click('#submit');
await page.waitForTimeout(2000); // ← flaky
await expect(page.getByText('Success')).toBeVisible();
```

## ✅ Good (event-based wait)
```typescript
const responsePromise = page.waitForResponse('/api/submit');
await page.click('#submit');
await responsePromise; // ← deterministic
await expect(page.getByText('Success')).toBeVisible();
```


## reference: page-object-model.md

# Page Object Model (POM) — ตัวอย่างโค้ด

ตัวอย่างเทียบเทสต์ที่ไม่มี abstraction กับเทสต์ที่ใช้ Page Object ใช้ตอนตั้งโครงชุดทดสอบหรือรีวิวเทสต์ที่ลอกขั้นตอนซ้ำกัน

## ❌ Bad (no abstraction)
```typescript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});

test('user can update profile', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');  // ← duplicated
  await page.fill('[data-testid="password"]', 'pass123');
  await page.click('button[type="submit"]');
  await page.goto('/profile');
  // ...
});
```

## ✅ Good (Page Object)
```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/login'); }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
test('user can login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('user@example.com', 'pass123');
  await expect(page).toHaveURL('/dashboard');
});
```

> 💡 **One Page Object per page or major component.**


## reference: test-data-strategies.md

# Test Data Strategy — ทางเลือกทั้ง 4 แบบ

ข้อดีข้อเสียของการเตรียมข้อมูลทดสอบแต่ละแบบ พร้อมโค้ดตัวอย่างของแบบที่แนะนำ

## Option 1: Shared test DB (popular, problematic)
```
❌ All tests share same data
❌ Order-dependent
❌ Hard to parallelize
❌ Pollution between tests
```

## Option 2: Per-test setup (slow)
```
🟡 Clean slate every test
🟡 Reliable but slow
✅ Good for critical flows
```

## Option 3: API setup, UI verification (best)
```typescript
// ✅ Setup via API (fast), verify via UI (real test)
test('user sees orders', async ({ page, request }) => {
  // Setup via API — fast, reliable
  const user = await api.createUser();
  await api.createOrder(user.id, { items: [...] });

  // Test the actual UI flow
  await page.goto('/orders');
  await expect(page.getByText('Order #123')).toBeVisible();
});
```

## Option 4: Database snapshot + rollback
```
✅ Real production-like data
✅ Fast (uses snapshots)
🟡 Requires DB tooling
```


---

# skill: spec-to-code-loop

Use when building from a spec and mockups as a loop (failing test, code, check screen, record).

> **ใน SuperUser:** ลูปนี้คือแกนของ playbook [`feature`](../superuser/references/playbook-feature.md) และ [`new-project`](../superuser/references/playbook-new-project.md) ถ้าเปิด superuser อยู่ ให้ทำตาม playbook แล้วใช้ไฟล์นี้เป็นรายละเอียดของลูป

# วงรอบจากข้อกำหนดไปเป็นโค้ด

> **กฎข้อเดียว:** วงรอบต้องมีเงื่อนไขหยุดที่**รันแล้วรู้ผลทันที**
> "ทำตามข้อกำหนดให้เสร็จ" เครื่องตรวจไม่ได้ ส่วน "test ทั้ง 47 ตัวเขียว" ตรวจได้

---

## ต้องมีครบก่อนเริ่ม

| สิ่งที่ต้องมี | ถ้าไม่มี |
|---|---|
| ข้อกำหนดที่แต่ละข้อทดสอบได้ มีรหัสกำกับ เช่น `FR-AUTH-010` | หยุด ใช้ `srs-writing` ทำให้ทดสอบได้ก่อน |
| คำสั่งรัน test 1 บรรทัดที่รันได้จริง | หยุด ตั้งค่าโครง test ก่อน ใช้ `testing-standards` |
| คำสั่งรันแอปขึ้นมาดูได้ (ถ้ามีหน้าจอ) | ข้ามขั้นเทียบภาพไปก่อน แล้วบอกผู้ใช้ว่าข้าม |
| ภาพ mockup ที่ตั้งชื่อตรงกับหน้าจอ | ขอจากผู้ใช้ ไม่งั้น UI จะไม่มีวันตรง |

**ถ้าไม่ครบแล้วยังเริ่ม ก็เท่ากับเขียนโค้ดที่ไม่มีใครรู้ว่าถูกหรือผิด**

---

## 1 · รอบที่ศูนย์ — วางแผน ยังไม่เขียนโค้ด

อ่านข้อกำหนดและ mockup ให้ครบก่อน แล้วแตกเป็นงานย่อย **งานละ 1 ข้อกำหนด**
เขียนลง `docs/BUILD-PLAN.md`

```markdown
| # | รหัส | สิ่งที่ต้องได้ | ไฟล์ที่จะแตะ | test ที่จะเขียน | สถานะ | commit |
|---|---|---|---|---|---|---|
| 1 | FR-AUTH-010 | ล็อกอินด้วยอีเมลและรหัสผ่าน | auth/login.ts · auth/session.ts | login_FR-AUTH-010 | รอทำ | |
| 2 | FR-AUTH-020 | ล็อกผู้ใช้หลังผิด 5 ครั้ง | auth/lockout.ts | lockout_FR-AUTH-020 | รอทำ | |
```

**ข้อไหนกำกวมจนเขียน test ไม่ได้ ห้ามเดา** — รวมเป็นรายการคำถามไว้ท้ายไฟล์ และใส่ในหัวข้อ **"ค้างอยู่"** ครั้งเดียว แล้วทำข้ออื่นต่อ

> คำถามที่ต้องถามแทนการเดา: ค่าขอบเขตเป็นเท่าไหร่ · ผิดแล้วต้องเกิดอะไร ·
> ใครเห็นข้อมูลนี้ได้บ้าง · ถ้าของเดิมมีอยู่แล้วจะทับหรือจะเตือน

จบรอบที่ศูนย์ **ต้องหยุด** ให้ผู้ใช้อ่านแผนก่อน — อย่าไหลต่อไปเขียนโค้ดเอง

---

## 2 · วงรอบต่อหนึ่งข้อกำหนด

```
อ่าน BUILD-PLAN.md  →  หยิบข้อแรกที่ยังไม่ทำ
  1. เขียน test ก่อน  ชื่อ test มีรหัสข้อกำหนดอยู่ในชื่อ
  2. รัน test ให้เห็นว่า "แดง"        ← ข้ามขั้นนี้ไม่ได้
  3. เขียนโค้ดจน test เขียว
  4. รัน test ทั้งชุด                  ← กันของเดิมพัง
  5. หน้าจอ: ถ่ายภาพจริงเทียบ mockup   ← ข้อ 5 ข้างล่าง
  6. อัปเดตสถานะใน BUILD-PLAN.md + commit หนึ่งข้อต่อหนึ่ง commit
  →  วนข้อถัดไป
```

**ขั้นที่ 2 คนข้ามบ่อยที่สุด และพลาดแล้วแพงที่สุด** — test ที่ไม่เคยเห็นแดง
อาจผ่านตลอดไม่ว่าโค้ดจะถูกหรือผิด

---

## 3 · กฎเหล็ก

1. **ห้ามแก้หรือลบ test เพื่อให้ผ่าน** — test แดงแปลว่าโค้ดผิด ไม่ใช่ test ผิด
   จะแก้ test ได้ต่อเมื่อพิสูจน์ได้ว่า test เขียนผิดจากข้อกำหนด และต้องบอกผู้ใช้ทุกครั้ง
2. **1 ข้อต่อ 1 รอบ** — ห้ามรวบหลายข้อเพราะ "มันคล้ายกัน"
3. **ข้อเดียวลองได้ไม่เกิน 3 รอบ** — พัง 2 รอบ → แตกเป็นขั้นย่อย ไม่ลองแบบเดิมซ้ำ · ครบ 3 รอบ → **หยุด ลงเป็น `ติด` แล้วรายงาน**
   ว่าติดอะไร ลองอะไรไปแล้ว และคิดว่าปัญหาอยู่ที่ไหน อย่าลองต่อไปเรื่อย ๆ
4. **ห้าม mock สิ่งที่กำลังทดสอบ** — mock ของข้างนอกได้ mock ตัวเองไม่ได้
5. **ห้ามข้ามไปทำข้อที่ง่ายกว่า** เพราะข้อปัจจุบันติด — ลำดับในแผนคือลำดับจริง

---

## 4 · ไฟล์สถานะ — context หมดแน่นอน

วงรอบยาวเกินกว่าที่ 1 รอบสนทนาจะจำได้เสมอ **สถานะต้องอยู่ในไฟล์ ไม่ใช่ในหัว**

- `docs/BUILD-PLAN.md` — แผนและสถานะ **อ่านไฟล์นี้ก่อนเริ่มทุกรอบ**
  นี่คือไฟล์เดียวที่วงรอบนี้เพิ่มเข้าไปในโฟลเดอร์เอกสารหลัก
- สถานะมี 4 ค่าเท่านั้น: `รอทำ` · `กำลังทำ` · `เสร็จ` · `ติด`
- `ติด` ต้องมีเหตุผลต่อท้าย 1 บรรทัด
- ทุกข้อที่ `เสร็จ` ต้องมีเลข commit — ไม่มีเลข แปลว่ายังไม่เสร็จจริง
- จบแต่ละรอบให้อัปเดตหัวข้อ `## สถานะล่าสุด` และ `## ประวัติสถานะ` บนสุดของไฟล์ตาม `status-report` — ตารางงานกับตารางสถานะอยู่ไฟล์เดียวกันแต่คนละหัวข้อ

**เริ่มรอบใหม่โดยไม่อ่านไฟล์นี้ก่อน คือสาเหตุอันดับ 1 ที่งานต้องทำซ้ำ**

### ไฟล์ที่วงรอบสร้างขึ้นระหว่างทาง — ไปที่ `_to_delete/` ทั้งหมด

เอกสารข้อกำหนดมักเป็น `.docx` หรือ `.pdf` ต้องแปลงเป็นข้อความก่อนจึงอ่านซ้ำได้ถูก
**ไฟล์ที่แปลงออกมาไม่ใช่เอกสาร** เป็นของใช้ชั่วคราวของวงรอบ

```
_to_delete/
  extracted/       ← .docx .pdf ที่แปลงเป็น .md แล้ว
  check/           ← ภาพหน้าจอที่ถ่ายไว้เทียบ mockup
  logs/            ← ผลรัน test ที่เก็บไว้ดูย้อนหลัง
```

| ไฟล์ | ไปไหน |
|---|---|
| เอกสารที่แปลงรูปแบบมาให้อ่านง่าย | `_to_delete/extracted/` |
| ภาพหน้าจอที่ถ่ายไว้ตรวจ | `_to_delete/check/` |
| ผลรัน test · log | `_to_delete/logs/` |
| แผนและสถานะ `BUILD-PLAN.md` | `docs/` — เป็นเอกสารจริง |
| โค้ดและ test | โฟลเดอร์โปรเจกต์ |

**ห้ามเขียนไฟล์แปลงลง `docs/` ปนกับเอกสารต้นฉบับ** — อีก 3 เดือนไม่มีใครรู้ว่า
ไฟล์ไหนคือของจริงที่ลูกค้าเซ็นรับ และไฟล์ไหนคือของที่เครื่องแปลงมา

รายละเอียดเต็มอยู่ใน `temp-file-discipline`

---

## 5 · เทียบ mockup ด้วยภาพจริง

อ่านโค้ดแล้วบอกว่า "ตรงแล้ว" ใช้ไม่ได้ ต้องเปิดจริงแล้วดู

```python
page.set_viewport_size({"width": 1280, "height": 900})   # ให้เท่ากับความกว้าง mockup
page.goto(url); page.wait_for_timeout(500)
page.screenshot(path="_to_delete/check/login.png")
```

แล้วเปิดทั้ง 2 ภาพดูเทียบกันตาม 5 ข้อนี้:

- [ ] ลำดับและการจัดกลุ่มขององค์ประกอบตรงกันไหม
- [ ] ระยะห่างและขนาดตัวอักษรใกล้เคียงไหม (ไม่ต้องเป๊ะพิกเซล)
- [ ] สถานะที่ mockup แสดงไว้ มีครบไหม — ว่าง · กำลังโหลด · ผิดพลาด
- [ ] ข้อความตรงกับ mockup ไหม หรือไปแต่งเอง
- [ ] ภาษาไทยตกบรรทัดหรือสระหายไหม

ต่างตรงไหน**บอกเป็นรายการ** อย่าเงียบแล้วเคลมว่าเสร็จ
ภาพที่ถ่ายไว้ตรวจเป็นไฟล์ชั่วคราว — ไปที่ `_to_delete/` ตาม `temp-file-discipline`

---

## 6 · การสืบย้อน

ชื่อ test ต้องมีรหัสข้อกำหนดอยู่ในชื่อ เช่น `test_lockout_after_5_failures_FR_AUTH_020`
จะได้ค้นด้วยคำสั่งเดียวว่าข้อไหนยังไม่มี test ครอบ

ปิดงานด้วยตารางสืบย้อน: ข้อกำหนดทุกข้อ → test ที่ครอบ → ผลล่าสุด

> **ข้อไหนไม่มี test ครอบ ให้บอกตรง ๆ ว่าไม่มี** — ห้ามเขียน test ตื้น ๆ มาเติมให้ตารางเต็ม
> ตารางที่เต็มเพราะเติมเอง อันตรายกว่าตารางที่มีช่องว่าง

---

## 7 · เมื่อไหร่แตกหลาย agent

**เกณฑ์เดียว: ไฟล์ที่จะแตะต้องไม่ทับกันเลย** — ดูคอลัมน์ "ไฟล์ที่จะแตะ" ในแผน

| แตกได้ | แตกไม่ได้ |
|---|---|
| คนละโมดูล คนละหน้าจอ ไฟล์ไม่ทับกัน | แตะไฟล์เดียวกันแม้แต่ไฟล์เดียว — งานจะทับกัน |
| agent ตรวจงานแบบ**อ่านอย่างเดียว** วิ่งคู่กับ agent ที่เขียนโค้ด | งานที่ต้องรอผลจากอีกงานอยู่แล้ว |
| แปลงข้อกำหนดเป็น test หลายโมดูลพร้อมกัน | ตอนยังไม่มีแผน — ต้องมีแผนก่อนถึงจะรู้ว่าแตกตรงไหนได้ |

ทุก agent ที่แตกออกไปต้องได้รับ: รหัสข้อที่รับผิดชอบ · รายการไฟล์ที่แตะได้ ·
คำสั่งรัน test · และกฎข้อ 3 ทั้งหมด

**ห้ามให้ agent ที่แตกออกไปแก้ `BUILD-PLAN.md` เอง** — ให้รายงานกลับ แล้วตัวหลักเขียนไฟล์เดียว
ไม่งั้นไฟล์สถานะจะพังก่อนโค้ด

---

## 8 · สัญญาณว่าวงรอบกำลังพัง

| อาการ | ความหมายจริง |
|---|---|
| test เขียวหมดตั้งแต่รอบแรกโดยไม่เคยแดง | test ไม่ได้ทดสอบอะไร |
| จำนวน test เพิ่มเร็วกว่าจำนวนข้อกำหนดที่ปิด | กำลังเขียน test ให้ตัวเองผ่าน |
| commit เดียวแตะ 15 ไฟล์ | รวบหลายข้อ ย้อนกลับไม่ได้แล้วเมื่อพัง |
| ข้อเดิมวนเกิน 3 รอบ | ข้อกำหนดกำกวม ไม่ใช่โค้ดยาก ให้กลับไปถาม |
| ไม่มีใครอัปเดต `BUILD-PLAN.md` มา 2 รอบ | สถานะอยู่ในหัว รอบหน้าจะทำซ้ำ |

---

## 9 · Anti-patterns

- ❌ **โยนข้อกำหนดทั้งฉบับให้รอบเดียว** — สาเหตุอันดับ 1 ที่ได้โค้ดมั่ว
- ❌ **เขียนโค้ดก่อนแล้วค่อยเขียน test ตาม** — ได้ test ที่ยืนยันสิ่งที่เพิ่งเขียน ไม่ใช่สิ่งที่ต้องการ
- ❌ **เดาเมื่อข้อกำหนดกำกวม** — ผิดตั้งแต่ต้น แต่มารู้ตอนส่งมอบ
- ❌ **แก้ test ให้ผ่าน** แล้วรายงานว่าเสร็จ
- ❌ **แตก agent ขนานบนไฟล์เดียวกัน**
- ❌ **เคลมว่า UI ตรง mockup โดยไม่เคยเปิดดู**
- ❌ **ปิดงานโดยไม่มีตารางสืบย้อน** — ไม่มีใครรู้ว่าอะไรยังไม่ได้ทำ

---

## 10 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| ทำข้อกำหนดให้ทดสอบได้ก่อน | `srs-writing` |
| แปลงข้อกำหนดเป็น test case | `test-case-template` |
| โครง test กรอบทดสอบ ชื่อ ความครอบคลุม | `testing-standards` |
| test ระดับเปิดเบราว์เซอร์จริง | `e2e-testing-patterns` |
| เขียนโค้ดให้เรียบง่ายที่สุดที่ใช้ได้ | `lazy-coding` |
| แก้เมื่อ test แดงหรือผลไม่ตรง | `targeted-fix` |
| รูปแบบข้อความ commit | `commit-message-format` |
| ไฟล์ภาพที่ถ่ายไว้ตรวจ | `temp-file-discipline` |
| บันทึกสถานะข้ามรอบสนทนา | `work-session-context` |
| ตารางสรุปสถานะเมื่อจบรอบ | `status-report` |

---

## ตัวย่อ

- **test** — ชุดทดสอบอัตโนมัติ
- **mockup** — ภาพต้นแบบหน้าจอ
- **commit** — การบันทึกการเปลี่ยนแปลงลงระบบควบคุมเวอร์ชัน
- **UI** — User Interface (ส่วนติดต่อผู้ใช้)


---

# skill: app-verifier-setup

Use when a project has no scripted way for an agent to run the app and see results, or before feature one.

# app-verifier-setup — ให้ agent มีมือและตา

> ถ้า agent มองไม่เห็นผลงานตัวเอง ก็ปรับงานต่อเองไม่ได้ และคนต้องคอยส่งต่อสิ่งที่เห็นบนจอให้ agent
> skill นี้สร้างเครื่องมือครั้งเดียว ให้ agent ทุกตัวหลังจากนี้ใช้ซ้ำ

**ผลลัพธ์:** 2 ชิ้น คือสคริปต์ที่อยู่กับ test ของโปรเจกต์ และ skill ที่เป็นแค่คู่มือสั้น ๆ ให้ agent

```
<โปรเจกต์>/
├─ <project-name>/test/e2e/verify.*         สคริปต์ขับแอปจริง เปิดและปิดแอปเอง (อยู่ในโฟลเดอร์โค้ด ดู project-bootstrap)
│                                           รายการฟีเจอร์และ check อยู่ในไฟล์นี้ที่เดียว (แผนที่ฟีเจอร์)
├─ .claude/skills/verify-<โปรเจกต์>/SKILL.md   รันอย่างไร · อ่านผลอย่างไร · ข้อห้าม (ที่ราก — ที่ Claude Code เปิด)
└─ _to_delete/verify-runs/                  หลักฐานแต่ละรอบ — สคริปต์หา path จากที่อยู่ของตัวเอง ไม่ขึ้นกับโฟลเดอร์ที่รัน
```

(Codex · Gemini ใช้ `.agents/skills/` · `skills/` แทน `.claude/skills/`) ตัวอย่างที่ทำจริงแล้ว: โปรเจกต์ `calculator-demo` (เว็บ) · แอป Flutter Android `Lumio - Light Meter` → `lumio-light-meter/test/e2e/verify.mjs` (Node ขับ `adb` สรุปไว้ใน [`references/android-native.md`](references/android-native.md))

**ทำไมไม่เขียนขั้นตอนแยกเป็นไฟล์ข้อความ** เพราะลองแล้วในโปรเจกต์ตัวอย่าง ขั้นตอนในไฟล์ `.md` กับใน script ไม่ตรงกันตั้งแต่รอบแรก จึงเก็บข้อมูลไว้ในสคริปต์ที่เดียว แล้วให้ skill ชี้ไปหา

---

## ขั้นตอน

1. **หาวิธีรันที่มีอยู่แล้ว** จาก README · `package.json` · `Makefile` · `docker-compose` · launch config (`.vscode/launch.json`) · `pubspec.yaml` (Flutter) · `build.gradle(.kts)` / `gradlew` (Android) ถ้ามีของเดิมให้ใช้ของเดิม ไม่สร้างใหม่
2. **เลือกวิธีขับตามชนิดแอป**

   | ชนิด | ขับด้วย | อ่านผลจาก |
   |---|---|---|
   | เว็บ | Playwright (ถ้ามี Chromium ติดตั้งอยู่แล้ว ห้ามดาวน์โหลดใหม่) | ภาพหน้าจอ · DOM · console · network |
   | Electron · desktop | Playwright `_electron` หรือ Chrome DevTools Protocol (CDP) · Windows ใช้ WinAppDriver หรือ pywinauto | ภาพหน้าจอ · log |
   | command line · TUI | เรียกคำสั่งจริงพร้อม input ตายตัว | stdout · stderr · exit code · ไฟล์ที่สร้าง |
   | API · service | `curl` หรือ client ที่ repo ใช้ | status · body · log · ค่าในฐานข้อมูลทดสอบ |
   | มือถือแบบเว็บ (progressive web app (PWA) · web-wrapped) | Playwright mobile viewport | ภาพหน้าจอ · DOM |
   | มือถือ native · Flutter (Android) | สคริปต์ Node/Python เรียก `adb` + `uiautomator dump` (แบบ Lumio) · หรือ `integration_test` ของ Flutter · หรือ Maestro · Playwright ขับ APK ไม่ได้ | ภาพ `adb exec-out screencap -p` · ข้อความ/Semantics label จาก `uiautomator` · `dumpsys` · `logcat` |

   - ถ้าโปรเจกต์มี `.sandbox/` ให้ขับเบราว์เซอร์ใน container ซึ่งค่าเริ่มคือ headless (ไม่เปิดหน้าต่าง) ถ้าอยากให้คนดูได้ ให้เปิด `up -Browser` (ดู [`docker-sandbox`](../docker-sandbox/SKILL.md) ข้อ 5) ส่วน Android emulator รันใน Docker บน Windows ไม่ได้ (ต้องมี KVM) จึงให้รัน emulator บนเครื่อง host แล้วบอกในรายงาน
   - หน้าที่มี CAPTCHA ให้ใช้ค่าทดสอบของผู้ให้บริการหรือปิดใน environment ทดสอบ ห้ามเขียนสคริปต์แก้ CAPTCHA
   - แอปที่อ่าน hardware (sensor · กล้อง · GPS) ให้ป้อนค่าที่รู้ล่วงหน้า ผ่าน emulator (`adb emu sensor set light 420`, กล้องเสมือน) หรือแหล่งข้อมูลปลอมที่เปิดได้เฉพาะ debug build แล้วติดป้ายทุก check ว่า `emulator` หรือ `เครื่องจริง` เพราะความแม่นของ sensor จริงพิสูจน์บน emulator ไม่ได้ ถ้ายังไม่ได้รันบนเครื่องจริง ให้เขียนว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

3. **เขียน `test/e2e/verify.*`** ให้เปิดแอปเองบนพอร์ตที่ไม่ชน (มือถือ: ติดตั้ง APK แล้วล้างข้อมูลแอป) ใส่ข้อมูลทดสอบ (seed) และรอจนพร้อม**โดยมีเวลาจำกัด** (เว็บ: ถ้าไม่ขึ้นใน 10 วินาทีถือว่าล้ม · มือถือ: ตั้งเวลาแยกสำหรับ build · boot emulator · เปิดแอป · แต่ละ check ดู reference) ปิดแอปเมื่อจบเสมอ และรันซ้ำต้องได้ผลเดิม ([`principle-build-a-tool-not-handwork`](../principle-build-a-tool-not-handwork/SKILL.md))
4. **รายการฟีเจอร์เป็นข้อมูลในสคริปต์** ไล่จากเมนู · route · command list · SRS แล้วเขียน 1 กลุ่มต่อฟีเจอร์ 1 บรรทัดต่อ check (`ทำอะไร → ต้องเห็นอะไร`) อย่างน้อย 3 ฟีเจอร์หลัก และกรณีผิดพลาด 1 กรณีต่อฟีเจอร์ **ทุก check เริ่มจากสถานะสะอาด** รันเดี่ยวหรือสลับลำดับได้ และพิมพ์ผล `PASS/FAIL` พร้อม expected กับ actual
5. **สคริปต์ต้องไม่ผ่านลอย ๆ** (ผ่านทั้งที่ไม่ได้ตรวจอะไรจริง) ถ้าชื่อฟีเจอร์ไม่มีจริงให้ exit 1 ถ้าแอปไม่ขึ้นให้ exit 1 และถ้าไม่มี check ไหนได้รันก็ให้ exit 1 (ตรวจ 0 รายการถือว่าพัง ไม่ใช่ผ่าน)
   - **check ที่ตรวจว่า "หยุด/ปล่อยแล้ว" ต้องตรวจเงื่อนไขก่อนเสมอ** (เช่น กล้องถูกถืออยู่ก่อนกด Home) ไม่งั้นจะผ่านลอย ๆ และรอผลด้วยการวนตรวจจนหมดเวลา ไม่ใช่ `sleep` ค่าเดา
   - **ต้องแน่ใจว่าอ่านหน้าจอล่าสุด** โดยลบไฟล์ผลเก่าก่อนอ่านใหม่ และกดเมื่อตำแหน่งเป้าหมายนิ่ง 2 รอบติด ถ้าอ่านหน้าจอไม่ได้เพราะแอปวาดไม่หยุด ถือเป็นบั๊กของแอป ไม่ใช่ของสคริปต์
6. **พิสูจน์ว่าสคริปต์จับของผิดได้** โดยแก้แอปให้ผิด 1 จุดชั่วคราว รันแล้วต้อง `FAIL` แล้วค่อยคืนค่า
7. **พิสูจน์ว่า skill ใช้ได้จริง** โดยส่ง agent `qa-tester` ตัวใหม่ที่ไม่เคยเห็นโค้ด ให้ใช้แค่ skill นี้ทดสอบ 1 ฟีเจอร์ตั้งแต่เปิดแอปจนถ่ายภาพผล ติดตรงไหนให้แก้ skill ตรงนั้น
8. **เก็บหลักฐานไว้ใน `_to_delete/verify-runs/<เวลา>/`** ทั้งภาพหน้าจอและ log ของการทดสอบ ไม่ปนกับโค้ด (เป็นของชั่วคราว ลบได้เมื่อส่งงานแล้ว)

## SKILL.md ของ verify skill ต้องมี

- description บอกว่าใช้เมื่อ "ต้องพิสูจน์ว่าฟีเจอร์ใช้ได้บนแอปจริง · ทำบั๊กให้เกิดซ้ำ · ตรวจก่อนส่ง"
- คำสั่งเริ่ม · หยุด · ข้อมูลทดสอบ (บัญชีทดสอบอยู่ไฟล์ไหน — **ห้ามใส่รหัสผ่านจริง**)
- ลิงก์ไปแผนที่ฟีเจอร์
- ข้อห้าม: ไม่แตะฐานข้อมูลจริง · ไม่เรียก API ภายนอกที่เสียเงินหรือส่งข้อความจริง

## สิ่งที่ห้ามทำ

| อย่าทำ | เพราะ |
|---|---|
| เขียนขั้นตอนทดสอบเป็นภาษาคนอย่างเดียว ไม่มีสคริปต์ | agent แต่ละตัวจะสร้างวิธีรันใหม่เองทุกครั้ง และแต่ละครั้งไม่เหมือนกัน |
| ใส่ทุกฟีเจอร์ตั้งแต่วันแรก | แผนที่ใหญ่ที่ไม่ได้ทดสอบ เสียเร็วกว่าแผนที่เล็กที่ใช้ได้จริง |
| ให้ verify skill ชี้ไปที่ระบบจริง (production) | ตรวจไปตรวจมา กลายเป็นแก้ข้อมูลลูกค้า |
| บอกว่าเสร็จโดยไม่ได้ทำข้อ 7 | ยังไม่รู้ว่า agent ตัวอื่นใช้ได้หรือไม่ |

## เชื่อมกับ skill อื่น

- [`app-verifier-upkeep`](../app-verifier-upkeep/SKILL.md) — แก้เมื่อแอปเปลี่ยนจนแผนที่ไม่ตรง
- `e2e-testing-patterns` — ถ้าจะยกขั้นตอนบางส่วนขึ้นเป็น test อัตโนมัติใน continuous integration (CI)
- [`superuser`](../superuser/SKILL.md) — playbook `bug-fix` และ `feature` เรียกใช้ skill ที่สร้างจากที่นี่


## reference: android-native.md

# ขับแอป Android native / Flutter บน emulator

> สรุปจากแอปจริง `Lumio - Light Meter` (Flutter · Android) · สคริปต์ที่รันผ่านแล้วคือ `lumio-light-meter/test/e2e/verify.mjs`
> ค่าที่เขียนว่า "วัดแล้ว" มาจาก emulator บน Windows ที่ใช้ GPU แบบซอฟต์แวร์ เครื่องอื่นอาจเร็วกว่า

## เลือกวิธีขับ

| วิธี | ดีตรงไหน | ข้อจำกัด | ใช้เมื่อ |
|---|---|---|---|
| Node/Python เรียก `adb` + `uiautomator dump` | ไม่ต้องลงอะไรเพิ่ม · ขับ sensor และกล้องเสมือนได้ · ตรวจ `dumpsys` ได้ | อ่านหน้าจอ 3–4 วินาทีต่อครั้ง (วัดแล้ว) | ค่าเริ่ม · ทดสอบทั้งเส้นทาง hardware → native → Dart → จอ |
| Flutter `integration_test` (`flutter test integration_test/`) | หา widget ด้วย `find` ได้ตรง · เร็ว | ป้อนค่า sensor จริงไม่ได้ ต้องใช้แหล่งข้อมูลปลอม · ตรวจสถานะระบบ (กล้องถูกปล่อยไหม) ไม่ได้ | ลำดับหน้าจอยาว ๆ ที่ไม่แตะ hardware |
| Maestro | เขียน flow เป็น YAML อ่านง่าย | ต้องติดตั้งเพิ่ม · ยังไม่ได้ทดสอบในชุดนี้ | ทีมมี Maestro อยู่แล้ว |

## โครงสคริปต์ (แบบ verify.mjs)

1. **ตรวจก่อนเริ่ม** ว่ามีเครื่องต่ออยู่ (`adb devices`) และมี APK (`build/app/outputs/flutter-apk/app-debug.apk`) ถ้าไม่ครบ ให้ exit 1 พร้อมบอกคำสั่งที่ต้องรัน
2. **ติดตั้ง** `adb install -r <apk>` แล้ว **เริ่มสะอาดทุกฟีเจอร์** `adb shell pm clear <package>` → `adb shell am start -n <package>/.MainActivity` → รอข้อความหน้าแรก
3. **อ่านหน้าจอ** `rm -f /sdcard/ui.xml` → `uiautomator dump /sdcard/ui.xml` → `exec-out cat` → ดึง `text` และ `content-desc` พร้อมจุดกึ่งกลางจาก `bounds`
4. **กด** `adb shell input tap x y` · **ป้อนค่า** `adb emu sensor set light <lux>` · **ถ่ายภาพ** `adb exec-out screencap -p > shot.png`
5. **ผล** `PASS/FAIL` พร้อม expected กับ actual และ exit 0 เฉพาะเมื่อมี check ได้รันอย่างน้อย 1 ข้อและผ่านทั้งหมด

## กฎที่ได้จากการรันจริง

| เรื่อง | ทำอย่างนี้ | เพราะ |
|---|---|---|
| ข้อความใน Flutter | ใส่ `Semantics(label: ...)` ให้ค่าที่ต้องตรวจ | label ขึ้นเป็น `content-desc` ใน `uiautomator dump` จึงใช้ตรวจได้ และช่วยผู้ใช้โปรแกรมอ่านจอด้วย |
| ไฟล์ dump เก่า | ลบ `/sdcard/ui.xml` ก่อน dump ทุกครั้ง | dump ล้มแล้ว**ไม่เขียนทับ**ไฟล์เดิม จะอ่านได้หน้าจอเก่าโดยไม่รู้ตัว |
| "could not get idle state" | ถือเป็นบั๊กของแอป แก้ที่แอป | แอปวาดใหม่ตลอด (Lumio วาด 5 ครั้ง/วินาทีทั้งที่ค่าไม่เปลี่ยน) ทำให้เปลืองแบต และ TalkBack พูดซ้ำ ให้แก้โดยแจ้ง UI เฉพาะเมื่อค่าที่แสดงเปลี่ยนจริง (sensor ที่ค่าแกว่ง: เปลี่ยนเกิน 1 %) ส่วนค่ารองที่ค่อย ๆ ขยับ ให้อัปเดตราว 1 วินาทีครั้ง |
| ตำแหน่งที่ขยับ | กดเมื่ออ่าน 2 ครั้งติดได้ตำแหน่งเดียวกัน | dialog เลื่อนขึ้นตอนคีย์บอร์ดเปิด ถ้ากดตำแหน่งเก่าจะโดนฉากหลังแล้ว dialog ปิด (น่าจะเป็นต้นเหตุของ flake (ผลไม่คงที่) ที่เหลือ 1 ครั้ง แต่ยังไม่ได้ตรวจซ้ำ) |
| สิทธิ์ | `adb shell pm grant <package> android.permission.CAMERA` ก่อน check ที่ไม่ได้ทดสอบหน้าขอสิทธิ์ | หน้าต่างขอสิทธิ์ของระบบไม่ใช่สิ่งที่ check นั้นตรวจ |
| check "ปล่อยแล้ว" | ตรวจเงื่อนไขก่อน (กล้องถูกถืออยู่) → กด Home → วนตรวจ `dumpsys media.camera` หา "Active Camera Clients" ทุก 1 วินาที นานสุด 20 วินาที | emulator ปล่อยกล้อง 5–8 วินาที (วัดแล้ว) ถ้าไม่ตรวจเงื่อนไขก่อน check จะผ่านทั้งที่ไม่ได้ตรวจอะไร |
| Git Bash | เรียก `adb` จาก Node/Python (`execFile`) หรือตั้ง `MSYS_NO_PATHCONV=1` | Git Bash แปลง `/sdcard/...` เป็น `C:/Program Files/Git/sdcard/...` |

## ป้อนค่า hardware

| สิ่งที่ป้อน | บน emulator | หมายเหตุ |
|---|---|---|
| sensor แสง | `adb emu sensor set light <lux>` แล้วแอปได้ค่าผ่าน `Sensor.TYPE_LIGHT` (วัดแล้ว) | sensor อื่นใช้ `adb emu sensor set <ชื่อ> <ค่า>` (ยังไม่ได้ตรวจทีละตัว) |
| กล้อง | กล้องหน้าเสมือนส่งภาพพร้อม ISO และเวลาเปิดรับแสง (วัดแล้ว) | ภาพเป็นฉากสังเคราะห์ จึงตรวจได้แค่ว่า "มีค่าออกมา" ตรวจความแม่นไม่ได้ |
| อื่น ๆ หรือ emulator ทำไม่ได้ | แหล่งข้อมูลปลอมที่ compile เข้าเฉพาะ debug build | ห้ามหลุดไป release build |

ติดป้ายทุก check: `emulator` แปลว่าทางเดินข้อมูลถูก ส่วน `เครื่องจริง` แปลว่าค่าถูก ถ้า check ไหนต้องใช้เครื่องจริงแต่ยังไม่ได้รัน ให้รายงานว่า "ยังไม่ได้ตรวจบนเครื่องจริง"

## เวลาและหน่วยความจำ

| ขั้น | เวลาที่วัดได้ | ตั้ง timeout แยก |
|---|---|---|
| Gradle build ครั้งแรก (ดาวน์โหลด NDK · platform) | ~10 นาที | 20 นาที |
| Gradle build ครั้งต่อไป | 1–2 นาที | 5 นาที |
| boot emulator | หลายนาที (ยังไม่ได้จับเวลา) | วนตรวจ `adb shell getprop sys.boot_completed` = 1 |
| เปิดแอปจนเห็นหน้าแรก | ไม่กี่วินาที | 20 วินาที |
| ต่อ check (รอค่าบนจอ) | 3–4 วินาทีต่อการอ่าน | 15–20 วินาที |

- emulator กับ Gradle กินหน่วยความจำมาก จน Claude Code เคยปิด emulator ที่รันเบื้องหลังเพราะหน่วยความจำไม่พอ
- เปิด emulator ตัวเดียว และหยุด Gradle daemon หลัง build (`gradlew --stop` ใน `android/`)
- ถ้า emulator ถูกปิดกลางทาง ให้รายงานว่า "ยังไม่ได้รันซ้ำ" พร้อมรายชื่อ check ที่ไม่ได้รัน ห้ามลองใหม่เงียบ ๆ แล้วรายงานเฉพาะผลรอบหลัง
- ไม่มี Docker: emulator ใน Docker ต้องมี KVM ซึ่ง Docker Desktop บน Windows ไม่มี จึงให้รันบน host


---

# skill: principle-build-a-tool-not-handwork

Use when work has a mechanical part (same edit in many files, every screen, migration). Script it.

# principle · build a tool, not handwork — งานกลไกทำเป็นเครื่องมือ
> ใช้คู่กัน: `principle-build-a-tool-not-handwork` (เขียนสคริปต์ทำงานซ้ำ) · `principle-small-verifiable-steps` (ตัดเป็นชิ้นเล็กที่ตรวจได้) · `parallel-split-and-merge` (รันหลายชิ้นพร้อมกัน)

> งานมี 2 ส่วน: ส่วนที่ต้องใช้วิจารณญาณ กับส่วนที่เป็นกลไกล้วน ๆ
> ส่วนกลไกไม่ต้องให้ agent คิดวิธีใหม่ทุกครั้ง ให้เขียนเป็นโปรแกรมครั้งเดียว แล้วเก็บแรงคิดไว้กับส่วนที่ต้องตัดสินใจ

## เมื่อไรต้องทำเครื่องมือ

| สัญญาณ | เครื่องมือ |
|---|---|
| แก้รูปแบบเดียวกันเกิน 10 จุด | codemod · สคริปต์แก้ผ่าน syntax tree (AST) · `sed` ที่ทดสอบแล้ว |
| ตรวจทุกหน้าจอหรือทุกไฟล์ | สคริปต์วนตรวจที่พิมพ์ตารางผล |
| agent ทุกตัวต้องตั้งสภาพแวดล้อมเองก่อนตรวจ | สคริปต์ `start` ใน verify skill (`app-verifier-setup`) |
| ย้ายข้อมูล | สคริปต์ที่รันซ้ำได้ผลเดิม พร้อมโหมดลองก่อน (dry run) |
| ข้ออ้างว่า "ทุกที่ทำแบบนี้แล้ว" | คำสั่ง grep หรือสคริปต์ที่พิสูจน์ได้ |
| ทำงานเดิมเป็นครั้งที่ 3 | ทำเป็นคำสั่งหรือ skill |

## กฎของเครื่องมือ

- **รันซ้ำได้ผลเดิม** — รัน 2 ครั้งต้องไม่พัง และไม่แก้ซ้ำ ([`principle-safe-to-rerun`](../principle-safe-to-rerun/SKILL.md))
- **พิมพ์ผลที่ตรวจได้** — บอกจำนวนที่แก้ · รายการที่ข้าม · รายการที่ล้ม
- **เล็กที่สุดที่ทำงานได้** — ไม่ต้องสวย ไม่ต้องรองรับทุกกรณีในอนาคต (`lazy-coding`)
- **เก็บให้ถูกที่** — สคริปต์ที่ใช้ครั้งเดียวเก็บไว้ใน `_to_delete/` ส่วนสคริปต์ที่ใช้ซ้ำเก็บใน `scripts/` แล้วเขียนบรรทัดเดียวใน README ว่ารันเมื่อไร
- **skill เหลือแค่คำอธิบายบาง ๆ** — ขั้นตอนตายตัวอยู่ในสคริปต์ ส่วน SKILL.md บอกแค่ว่าเรียกเมื่อไรและอ่านผลอย่างไร

## ไม่ต้องทำเมื่อ

งานแก้ 2–3 จุดที่ต่างกันจริง เพราะเขียนสคริปต์จะใช้เวลามากกว่าแก้เอง
