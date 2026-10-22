"""รายงานยอดขายรายเดือนแยกสาขา"""


def monthly_sales(conn, year):
    """ยอดขายของปี year แยกตามเดือนและสาขา นับเฉพาะบิลที่ status = 'paid'

    คืน list ของ tuple (month 'YYYY-MM', branch_name, total_satang, bill_count)
    เรียงตาม month แล้วตาม branch_name · เดือนหรือสาขาที่ไม่มียอดไม่ต้องแสดง
    """
    # กรองด้วยช่วงข้อความของ sold_at ตรง ๆ เพื่อให้ใช้ index ได้ แล้วรวมยอดก่อนค่อยหาชื่อสาขา
    sql = """
        SELECT t.month, b.name, t.total_satang, t.bill_count
        FROM (
            SELECT substr(s.sold_at, 1, 7) AS month,
                   s.branch_code,
                   SUM(s.amount_satang) AS total_satang,
                   COUNT(*) AS bill_count
            FROM sales s
            WHERE s.sold_at >= ? AND s.sold_at < ?
              AND s.status = 'paid'
            GROUP BY month, s.branch_code
        ) t
        JOIN branches b ON b.code = t.branch_code
        ORDER BY t.month, b.name
    """
    start, end = "%04d-01-01" % year, "%04d-01-01" % (year + 1)
    return [tuple(row) for row in conn.execute(sql, (start, end))]
