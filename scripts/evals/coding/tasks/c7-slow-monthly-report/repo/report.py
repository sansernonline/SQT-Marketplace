"""รายงานยอดขายรายเดือนแยกสาขา"""


def monthly_sales(conn, year):
    """ยอดขายของปี year แยกตามเดือนและสาขา นับเฉพาะบิลที่ status = 'paid'

    คืน list ของ tuple (month 'YYYY-MM', branch_name, total_satang, bill_count)
    เรียงตาม month แล้วตาม branch_name · เดือนหรือสาขาที่ไม่มียอดไม่ต้องแสดง
    """
    sql = """
        SELECT strftime('%Y-%m', s.sold_at) AS month,
               (SELECT b.name FROM branches b WHERE b.code = s.branch_code) AS branch_name,
               SUM(s.amount_satang) AS total_satang,
               COUNT(*) AS bill_count
        FROM sales s
        WHERE strftime('%Y', s.sold_at) = ?
          AND s.status = 'paid'
        GROUP BY month, branch_name
        ORDER BY month, branch_name
    """
    return [tuple(row) for row in conn.execute(sql, (str(year),))]
