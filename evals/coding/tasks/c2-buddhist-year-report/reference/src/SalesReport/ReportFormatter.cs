using System.Globalization;

namespace SalesReport;

public static class ReportFormatter
{
    // หัวรายงานแสดงวันที่เป็นปีพุทธศักราช (พ.ศ. = ค.ศ. + 543)
    // คำนวณปีเองครั้งเดียว แล้วจัดรูปด้วย InvariantCulture
    // เพื่อไม่ให้ปฏิทินพุทธของ culture th-TH บวก 543 ซ้ำอีกรอบ
    public static string FormatHeader(DateTime reportDate)
    {
        return string.Format(
            CultureInfo.InvariantCulture,
            "รายงานยอดขาย ประจำวันที่ {0:00}/{1:00}/{2}",
            reportDate.Day,
            reportDate.Month,
            reportDate.Year + 543);
    }
}
