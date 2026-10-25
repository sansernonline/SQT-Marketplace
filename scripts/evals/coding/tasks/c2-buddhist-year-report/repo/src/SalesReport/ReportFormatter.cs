namespace SalesReport;

public static class ReportFormatter
{
    // หัวรายงานแสดงวันที่เป็นปีพุทธศักราช (พ.ศ. = ค.ศ. + 543)
    public static string FormatHeader(DateTime reportDate)
    {
        var buddhistDate = reportDate.AddYears(543);
        return "รายงานยอดขาย ประจำวันที่ " + buddhistDate.ToString("dd/MM/yyyy");
    }
}
