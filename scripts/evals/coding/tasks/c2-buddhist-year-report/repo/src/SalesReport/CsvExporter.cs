using System.Globalization;
using System.Text;

namespace SalesReport;

public static class CsvExporter
{
    // ไฟล์ CSV ส่งให้ระบบบัญชี วันที่ต้องเป็น ค.ศ. รูปแบบ yyyy-MM-dd
    public static string Export(IEnumerable<SaleRecord> records)
    {
        var csv = new StringBuilder();
        csv.Append("date,product,amount\n");
        foreach (var record in records)
        {
            csv.Append(record.Date.ToString("yyyy-MM-dd"));
            csv.Append(',');
            csv.Append(record.Product);
            csv.Append(',');
            csv.Append(record.Amount.ToString("0.00", CultureInfo.InvariantCulture));
            csv.Append('\n');
        }
        return csv.ToString();
    }
}
