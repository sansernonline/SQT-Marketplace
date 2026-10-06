# skill: e-tax-invoice

Use when a Thai VAT-registered business issues or checks tax invoices — full ใบกำกับภาษี fields under ม.86/4, abbreviated invoices, e-Tax Invoice and e-Receipt vs by Email, claimable input VAT.

# Thai Tax Invoice and e-Tax Invoice

A tax invoice missing one required field means the buyer cannot claim the input VAT. General information, not tax advice — the Revenue Department (etax.rd.go.th) and the company accountant are the authority.

## 1. Who must issue what

| Who | Document |
|---|---|
| VAT-registered seller, every sale of goods or service | **ใบกำกับภาษี (full tax invoice)** — issued at the tax point (delivery of goods / receipt of payment for services) |
| VAT-registered retailer selling to consumers, with RD approval | may issue **ใบกำกับภาษีอย่างย่อ (abbreviated)** instead |
| Not VAT-registered | **cannot** issue a tax invoice; issue an ordinary receipt/invoice (see `doc-quotation`) |

## 2. Full tax invoice — fields required by ม.86/4

| # | Field | Common mistake |
|---|---|---|
| 1 | The words **"ใบกำกับภาษี"** shown prominently | Titled only "ใบเสร็จรับเงิน" |
| 2 | Seller's **name, address and 13-digit tax ID** | Old address after moving office |
| 3 | Buyer's **name and address**; and, per อธิบดี notice ฉบับที่ 199, the buyer's tax ID and **branch** ("สำนักงานใหญ่" or "สาขาที่ 00001") when the buyer is VAT-registered | Branch missing |
| 4 | **Serial number** of the invoice (and book number, if any) | Duplicated numbers across branches |
| 5 | Name, type, kind, quantity and value of goods/services | "ค่าบริการ" with no description |
| 6 | **VAT amount shown separately** from the price | VAT folded into the total |
| 7 | **Date** of issue | |
| 8 | Seller's branch ("สำนักงานใหญ่" / "สาขาที่ ...") and any other item set by อธิบดี | |

- Language Thai, currency baht; foreign language/currency allowed only with RD approval or under the RD notice that allows English with baht figures (รอยืนยัน the current notice before relying on it).
- Combined documents are fine — "ใบแจ้งหนี้/ใบกำกับภาษี", "ใบเสร็จรับเงิน/ใบกำกับภาษี" — as long as every field is present.
- Corrections: never alter an issued invoice; issue **ใบลดหนี้** (credit note, ม.86/10) or **ใบเพิ่มหนี้** (debit note, ม.86/9), or cancel and re-issue.

## 3. Abbreviated tax invoice (ม.86/6)

Retail to consumers only, with permission. Must show: "ใบกำกับภาษีอย่างย่อ", seller name or abbreviated name and tax ID, serial number, POS/machine number if from a cash register, description and price, price **including VAT** (state "VAT included" / ราคารวมภาษีมูลค่าเพิ่มแล้ว), date. The buyer **cannot** claim input VAT from it — a business buyer must ask for a full tax invoice.

## 4. Electronic schemes

| | **e-Tax Invoice & e-Receipt** | **e-Tax Invoice by Email** |
|---|---|---|
| Who | Any VAT-registered business (no revenue limit) | VAT-registered with revenue **not over 30 M baht/year** |
| Format | XML to the ETDA standard (ขมธอ.3-2560), digitally signed with a CA certificate | PDF/A-3 attached to an email |
| Signing | Own certificate, or via a registered Service Provider | Time-stamped by the central mailbox |
| Sending | Upload to RD within the 15th of the following month (or real-time via a Service Provider) | Send to the buyer and **cc csemail@etax.teda.th** |
| Registration | Apply on etax.rd.go.th (ใบคำขอ ก.อ.01) | Register at rd.go.th/27659.html |
| Typical user | Medium/large business, ERP, high volume | SME issuing by hand from accounting software |

- Only certain email providers registered with RD may send (รอยืนยัน — sources say Gmail/Google Workspace).
- e-Receipt is also how a buyer gets an "e-Receipt" for tax incentives (e.g. Easy e-Receipt for individuals) — paper invoices do not qualify for those.
- Keep electronic records for at least 5 years (longer if RD orders it during an audit), in the original format.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.rd.go.th/27659.html · https://etda.or.th/en/Our-Service/Digital-Trusted-services-Infrastructure/TEDA/ETAX.aspx · https://www.ktc.co.th/article/knowledge/what-is-etax-invoice

## Workflow

1. Confirm VAT registration (ภ.พ.20) and annual revenue → pick the scheme from section 4.
2. Build the template with every field in section 2; number by branch.
3. For by Email: register, generate PDF/A-3, send to buyer with cc to the central mailbox — the time-stamped reply is the proof.
4. For incoming invoices: check all 8 fields before booking input VAT on the ภ.พ.30 purchase report (รายงานภาษีซื้อ); missing ones — ask the supplier for a re-issue.
5. Add a PromptPay QR on the invoice for faster payment (`promptpay-qr`).

## Worked example (header block)

```
ใบแจ้งหนี้/ใบกำกับภาษี  (ต้นฉบับ)                 เลขที่ INV-HQ-2569-0153
บริษัท ตัวอย่าง จำกัด (สำนักงานใหญ่)  เลขประจำตัวผู้เสียภาษี 0105xxxxxxxxx
ที่อยู่ ...                                       วันที่ 6 ตุลาคม 2569
ลูกค้า: บริษัท ลูกค้า จำกัด สาขาที่ 00002  เลขประจำตัวผู้เสียภาษี 0105yyyyyyyyy  ที่อยู่ ...
1 ออกแบบโลโก้ ตามใบเสนอราคา QT-2569-077   1 งาน   20,000.00
                            รวมเป็นเงิน 20,000.00
                    ภาษีมูลค่าเพิ่ม 7%   1,400.00
                         จำนวนเงินรวมทั้งสิ้น 21,400.00 (สองหมื่นหนึ่งพันสี่ร้อยบาทถ้วน)
```

## Related

`doc-quotation` · `tax-vat-th` (ภ.พ.30, WHT on the payment) · `promptpay-qr` · `dbd-annual-filing`.
