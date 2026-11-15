# PromptPay payload — code and breakdown

## Generator (Node.js, no dependencies)

```js
const field = (id, v) => id + String(v.length).padStart(2, '0') + v;

function crc16(s) {                       // CRC-16/CCITT-FALSE
  let c = 0xFFFF;
  for (const b of Buffer.from(s, 'ascii')) {
    c ^= b << 8;
    for (let i = 0; i < 8; i++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
  }
  return c.toString(16).toUpperCase().padStart(4, '0');
}

function promptpay(id, amount) {          // id: mobile (10 digits) or national/tax ID (13)
  const sub = id.length === 13 ? field('02', id) : field('01', '0066' + id.replace(/^0/, ''));
  const acct = field('00', 'A000000677010111') + sub;
  const body = field('00', '01') + field('01', amount ? '12' : '11') + field('29', acct)
    + field('58', 'TH') + field('53', '764') + (amount ? field('54', amount.toFixed(2)) : '') + '6304';
  return body + crc16(body);
}

console.log(promptpay('0812345678'));        // ...63045D82
console.log(promptpay('0812345678', 1500));  // ...63046960
console.log(crc16('123456789'));             // 29B1  (self-test)
```

Render the string with any QR library (error correction M is common). Python equivalent: `crcmod` predefined `crc-ccitt-false`, or port the loop.

## Byte-by-byte (dynamic, 1,500.00 to 081-234-5678)

| Segment | ID | Len | Value |
|---|---|---|---|
| `000201` | 00 | 02 | `01` |
| `010212` | 01 | 02 | `12` dynamic |
| `2937…` | 29 | 37 | sub-fields ↓ |
| `0016A000000677010111` | 29.00 | 16 | AID credit transfer |
| `01130066812345678` | 29.01 | 13 | mobile in 0066 form |
| `5802TH` | 58 | 02 | `TH` |
| `5303764` | 53 | 03 | `764` |
| `54071500.00` | 54 | 07 | `1500.00` |
| `6304` | 63 | 04 | CRC follows |
| `6960` | | | CRC-16 of everything before, including `6304` |

## Bill payment (tag 30) shape

```
000201 010212
30 LL [0016A000000677010112] [0115{BillerID15}] [02LL{Ref1}] [03LL{Ref2}]
5303764 54LL{amount} 5802TH 5913{MERCHANT NAME} 6304{CRC}
```

Biller ID and allowed reference formats come from the company's bank — ask for the bill-payment spec sheet.

## Debugging rejects

| Symptom | Likely cause |
|---|---|
| "QR ไม่ถูกต้อง" in every app | CRC wrong — computed without `6304`, or lowercase hex |
| Wrong recipient / not found | Mobile left as `081…` instead of `0066 81…` |
| Amount ignored | Point of initiation left `11` while tag 54 present (use `12`) |
| Works in one bank only | Length byte miscounted on a nested sub-field (tag 29/30 length must equal the total of its sub-fields) |
