using System.Globalization;
using SalesReport;
using Xunit;

namespace SalesReport.Tests.Hidden;

public class BuddhistYearHiddenTests
{
    // ตั้ง CurrentCulture และ CurrentUICulture ชั่วคราว แล้วคืนค่าเดิมตอน Dispose
    private sealed class CultureScope : IDisposable
    {
        private readonly CultureInfo _culture;
        private readonly CultureInfo _uiCulture;

        public CultureScope(CultureInfo culture)
        {
            _culture = CultureInfo.CurrentCulture;
            _uiCulture = CultureInfo.CurrentUICulture;
            CultureInfo.CurrentCulture = culture;
            CultureInfo.CurrentUICulture = culture;
        }

        public void Dispose()
        {
            CultureInfo.CurrentCulture = _culture;
            CultureInfo.CurrentUICulture = _uiCulture;
        }
    }

    private static CultureScope UseThai()
    {
        var scope = new CultureScope(new CultureInfo("th-TH"));
        try
        {
            // ถ้าเครื่องตรวจไม่มีปฏิทินพุทธ (เช่นโหมด invariant globalization) test นี้ไม่มีความหมาย ให้ล้มให้เห็น
            Assert.IsType<ThaiBuddhistCalendar>(CultureInfo.CurrentCulture.Calendar);
            return scope;
        }
        catch
        {
            scope.Dispose();
            throw;
        }
    }

    private static readonly SaleRecord[] Records =
    {
        new SaleRecord(new DateTime(2026, 12, 31), "Coffee", 120.5m),
        new SaleRecord(new DateTime(2026, 1, 5), "Tea", 45m)
    };

    private const string ExpectedCsv = "date,product,amount\n2026-12-31,Coffee,120.50\n2026-01-05,Tea,45.00\n";

    [Fact]
    public void Header_under_th_TH_shows_2569_not_3112()
    {
        using var scope = UseThai();

        var header = ReportFormatter.FormatHeader(new DateTime(2026, 12, 31));

        Assert.Equal("รายงานยอดขาย ประจำวันที่ 31/12/2569", header);
    }

    [Fact]
    public void Header_under_th_TH_keeps_day_and_month()
    {
        using var scope = UseThai();

        var header = ReportFormatter.FormatHeader(new DateTime(2026, 1, 5));

        Assert.Equal("รายงานยอดขาย ประจำวันที่ 05/01/2569", header);
    }

    [Fact]
    public void Header_under_en_US_shows_2569()
    {
        using var scope = new CultureScope(new CultureInfo("en-US"));

        var header = ReportFormatter.FormatHeader(new DateTime(2026, 12, 31));

        Assert.Equal("รายงานยอดขาย ประจำวันที่ 31/12/2569", header);
    }

    [Fact]
    public void Header_under_invariant_culture_shows_2569()
    {
        using var scope = new CultureScope(CultureInfo.InvariantCulture);

        var header = ReportFormatter.FormatHeader(new DateTime(2026, 12, 31));

        Assert.Equal("รายงานยอดขาย ประจำวันที่ 31/12/2569", header);
    }

    [Fact]
    public void Header_keeps_leap_day()
    {
        using var scope = new CultureScope(new CultureInfo("en-US"));

        var header = ReportFormatter.FormatHeader(new DateTime(2024, 2, 29));

        Assert.Equal("รายงานยอดขาย ประจำวันที่ 29/02/2567", header);
    }

    [Fact]
    public void Csv_under_th_TH_stays_gregorian_iso()
    {
        using var scope = UseThai();

        var csv = CsvExporter.Export(Records);

        Assert.Equal(ExpectedCsv, csv);
    }

    [Fact]
    public void Csv_under_en_US_stays_gregorian_iso()
    {
        using var scope = new CultureScope(new CultureInfo("en-US"));

        var csv = CsvExporter.Export(Records);

        Assert.Equal(ExpectedCsv, csv);
    }
}
