using System.Globalization;
using SalesReport;
using Xunit;

namespace SalesReport.Tests;

public class ReportTests
{
    [Fact]
    public void Header_shows_buddhist_year()
    {
        var saved = CultureInfo.CurrentCulture;
        CultureInfo.CurrentCulture = new CultureInfo("en-US");
        try
        {
            var header = ReportFormatter.FormatHeader(new DateTime(2026, 12, 31));

            Assert.Equal("รายงานยอดขาย ประจำวันที่ 31/12/2569", header);
        }
        finally
        {
            CultureInfo.CurrentCulture = saved;
        }
    }

    [Fact]
    public void Csv_has_header_and_one_line_per_record()
    {
        var saved = CultureInfo.CurrentCulture;
        CultureInfo.CurrentCulture = new CultureInfo("en-US");
        try
        {
            var records = new[] { new SaleRecord(new DateTime(2026, 5, 4), "Coffee", 120.5m) };

            var csv = CsvExporter.Export(records);

            Assert.Equal("date,product,amount\n2026-05-04,Coffee,120.50\n", csv);
        }
        finally
        {
            CultureInfo.CurrentCulture = saved;
        }
    }
}
