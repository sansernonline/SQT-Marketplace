---
name: stack-python
description: Use when writing, reviewing or testing Python (scripts, CLIs, FastAPI, Django, pandas, AI code). Repo tooling (uv, ruff, pyright, pytest), common traps.
---

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
