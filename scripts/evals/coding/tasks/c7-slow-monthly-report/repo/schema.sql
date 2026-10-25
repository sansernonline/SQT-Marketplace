-- โครงฐานข้อมูลยอดขาย (SQLite)

CREATE TABLE IF NOT EXISTS branches (
    id   INTEGER PRIMARY KEY,
    code TEXT NOT NULL,  -- รหัสสาขา เช่น 'BR001'
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
    id            INTEGER PRIMARY KEY,
    branch_code   TEXT    NOT NULL,  -- branches.code
    sold_at       TEXT    NOT NULL,  -- 'YYYY-MM-DD HH:MM:SS' เวลาไทย
    amount_satang INTEGER NOT NULL,  -- ยอดขายเป็นสตางค์
    status        TEXT    NOT NULL,  -- 'paid' หรือ 'void'
    note          TEXT               -- หมายเหตุจากเครื่องขายหน้าร้าน
);
