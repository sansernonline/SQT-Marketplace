# Dividend tracker template

## CSV header (`dividends.csv`)

```csv
symbol,shares,dps,type,status,period,xd_date,record_date,pay_date,gross,withholding,net,received,certificate_kept,note
```

| Column | Values |
|---|---|
| type | `interim`, `annual`, `fund`, `foreign` |
| status | `declared`, `estimated`, `paid` |
| withholding | 10% for Thai listed shares and Thai funds; foreign = per country (mark unknown) |
| received | actual net amount from the statement, filled on pay date |
| certificate_kept | Y/N — the dividend payment notice doubles as the withholding certificate |

## Monthly rollup

```
Year ____         Gross     Withheld    Net      Of which estimated
Jan
...
Dec
Total
Portfolio value ______   Portfolio net yield ____%
```

## Year-end checklist

- [ ] Every `declared` row has `received` filled
- [ ] Gaps explained (sold before XD, rounding, foreign tax)
- [ ] Certificates collected for every Thai dividend (needed if claiming the tax credit)
- [ ] Hand totals to `tax-basics-th` to compare "final 10%" vs "include and claim credit"
