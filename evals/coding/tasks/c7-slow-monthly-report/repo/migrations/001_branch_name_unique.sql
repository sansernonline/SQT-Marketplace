-- ชื่อสาขาห้ามซ้ำ
CREATE UNIQUE INDEX IF NOT EXISTS ux_branches_name ON branches (name);
