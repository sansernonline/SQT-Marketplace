<!-- merged from skill `promptpay-qr` on 2026-11-27 · description was: Use when a Thai business needs a PromptPay QR -->
# PromptPay QR (Thai QR Payment) — a correct payload string for a QR, placed on a quotation or invoice

> **One rule:** if even 1 field is wrong, banking apps reject the QR as "QR ไม่ถูกต้อง". Never type fields, lengths or CRC by hand; generate the payload with `promptpay.mjs`.

## Use when
- A Thai business needs a PromptPay QR for a person, shop or company (mobile number · 13-digit national/tax ID · 15-digit e-Wallet ID · biller ID).
- Putting a QR on a quotation or invoice, or debugging a QR a bank app rejects.
- Checking that a customer's payment really arrived before shipping.

Not for: quotation template → `thai-business-docs` · tax invoice fields → `thai-tax` · VAT and withholding → `thai-tax` · sending the QR in LINE → `line-oa` · web checkout with automatic confirmation → the bank's or payment gateway's API, not a home-made QR.

## Steps
1. **Choose the tag.** Tag 29 (credit transfer, `A000000677010111`) needs only a PromptPay ID; reconcile by amount and time. Tag 30 (bill payment, `A000000677010112`, Biller ID 15 digits + Ref1 up to 20 chars + optional Ref2) needs a bill-payment agreement with a bank, but the bank reports Ref1 for automatic reconciliation. Static (`01`=`11`) has no amount; dynamic (`01`=`12`) has a fixed amount in tag 54. Field tables, CRC and byte-by-byte examples: [`field-tables.md`](field-tables.md), code: [`payload.md`](payload.md).
2. **Run the script** for every real payload. It builds tag 29 (mobile, 13-digit ID, or 15-digit e-Wallet ID) or tag 30 (biller ID with Ref1/Ref2) and appends the CRC16 (CRC-16/CCITT-FALSE, poly `0x1021`, init `0xFFFF`, computed over the payload including the literal `6304`). A 13-digit ID must pass the check digit (mod 11) or the script stops: the number is probably mistyped. Leave `amount` out for a static QR.
   ```
   node promptpay.mjs <file.json> [--json]     # example file: scripts/example.json
   node promptpay.mjs --self-test
   ```
   Input: `{ "id": "081-234-5678", "amount": 1500 }` · tag 30: `{ "billerId": "<15 digits>", "ref1": "IV26100001", "ref2": "", "name": "SHOP", "amount": 1500 }`. Dashes and spaces in `id` are ignored. A bad field stops the script with a message naming it (wrong length, non-ASCII text in `name` or a reference, amount with more than 2 decimals, Ref1 missing). A Ref1 outside A–Z 0–9 only warns, because banks differ. The self-test checks the CRC of `123456789` (`29B1`) and both worked examples. The script does not draw the QR: render the payload with a QR library (error correction M is common).
   **Script path:** installed: `ls -d ~/.claude/plugins/cache/*/e-commerce/*/skills/shop-books/scripts/promptpay.mjs | sort -V | tail -1` · in the SQT-Marketplace repo: `plugins/e-commerce/skills/shop-books/scripts/promptpay.mjs` · Node only, no dependencies.
3. **Put it on a quotation or invoice.**
   - Use a dynamic QR with the exact amount due, after withholding tax if the customer withholds (for example 21,400 − 600 = 20,800; see `thai-tax`).
   - Place it near the total, at least 2.5 × 2.5 cm printed, with a quiet zone of 4 modules; label "สแกนชำระผ่าน PromptPay" and the account name the payer will see.
   - Print the invoice number next to it and ask payers to send the slip (tag 29 carries no reference).
   - On a quotation the amount may change: use a static QR, or regenerate on the invoice.
   - Re-scan the printed PDF with 2 different bank apps before sending and read out the account name each shows; it must match the business name on the invoice. A QR that scans but shows another name goes to someone else: stop and recheck the ID.
4. **If a bank app rejects the QR,** the usual causes are a wrong CRC (computed without `6304`, or lowercase hex), mobile left as `081…` instead of `0066 81…`, or point of initiation `11` with tag 54 present. Table in [`payload.md`](payload.md).
5. **Before shipping, check the money arrived, not the slip** (a slip is a picture that can be edited or reused). Open the shop's bank app or statement and find the transfer: amount, time and payer name match the order. One transfer pays one order; the same slip on two orders means the second has not paid. Never ship on a slip alone, even for a regular customer, and do not accept "the bank is slow, I'll send proof later". Suggest turning on the bank's incoming-transfer notification. For many orders a day, use a payment gateway or the bank's API with a payment callback instead of reading slips.

## Check before done
- [ ] The payload came from `promptpay.mjs` (or matches the reference implementations in `sources.md` byte for byte), and `--self-test` passes.
- [ ] Amount format: dot decimal, no comma, max 13 chars; mobile converted to `0066…`, national ID stays 13 digits.
- [ ] The QR image was regenerated from the payload, never altered by hand.
- [ ] The printed PDF was scanned with 2 bank apps and the account name matches the invoice.

## References
- [`field-tables.md`](field-tables.md) — open to read or check a payload by hand (tags, sub-fields, CRC, worked examples)
- [`payload.md`](payload.md) — open for generator code, byte-by-byte breakdown, reject debugging
- [`sources.md`](promptpay-qr/sources.md) — open to compare against reference implementations and re-check standard sources (checked 2026-10-06 to 2026-10-23)
