# thai-doc-total.mjs input · doc-quotation

Open when writing the input file for `scripts/thai-doc-total.mjs`.

Input file: `{ "items": [ { "name": "...", "qty": 1, "price": 50000, "discount": 0 } ], "vatMode": "exclusive", "vatRate": 7, "whtRate": 3, "sellerTaxId": "...", "buyerTaxId": "..." }` · `vatMode` is `exclusive` (prices exclude VAT, the default) · `inclusive` (prices already include VAT) · `none` (seller not VAT-registered). `discount` is baht off that line. `vatRate` defaults to `vat_pct` in `scripts/rates.json` (7%, checked 2026-10-25, reduced rate ends 30 Sep 2570); the script warns when that file is older than 90 days or the end date has passed — then check rd.go.th and update `rates.json` or pass `vatRate`. A document total above 9,999,999,999.99 baht stops the script; split it into several documents. `whtRate` defaults to 0. A tax ID that fails the check digit gives a warning, not a stop. A bad field stops the script with a message naming it.
