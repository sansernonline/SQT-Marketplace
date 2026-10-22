-- ให้รายงานรายเดือนอ่านแค่ช่วงวันที่ของปีที่ขอ ไม่ต้องไล่ทั้งตาราง
CREATE INDEX IF NOT EXISTS ix_sales_sold_at_report
    ON sales (sold_at, status, branch_code, amount_satang);

-- หาชื่อสาขาจากรหัสได้ทันที
CREATE UNIQUE INDEX IF NOT EXISTS ux_branches_code ON branches (code);
