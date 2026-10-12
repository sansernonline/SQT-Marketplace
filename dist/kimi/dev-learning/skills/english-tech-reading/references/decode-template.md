# Decode template

Fill this in for each error message, RFC clause or documentation passage. Keep the original English terms in brackets so the user can still search for them.

```markdown
## Source
<paste the original, exactly> — from <file / RFC number + section / doc URL>, <date read>

## Keywords
| Term | Meaning here (Thai) | Keep in English when searching? |
|---|---|---|
| | | yes |

## Structure
- Requirement level: MUST / MUST NOT / SHOULD / SHOULD NOT / MAY (RFC 2119 + RFC 8174: only in CAPITALS)
- Conditions: if <A> and/or <B> → <C>; otherwise → <D>
- Exceptions: <list>

## Thai explanation (2–4 sentences)

## What to do in our code
- <action 1>
- <action 2>

## Search string
"<exact error text in quotes>" <framework> <version>
```

## RFC 2119 / RFC 8174 keyword table

| Keyword | Thai | Strength |
|---|---|---|
| MUST, REQUIRED, SHALL | ต้อง (ไม่มีข้อยกเว้น) | Absolute |
| MUST NOT, SHALL NOT | ห้ามเด็ดขาด | Absolute |
| SHOULD, RECOMMENDED | ควร (เว้นแต่มีเหตุผลและเข้าใจผลที่ตามมา) | Strong default |
| SHOULD NOT, NOT RECOMMENDED | ไม่ควร (เว้นแต่มีเหตุผล) | Strong default |
| MAY, OPTIONAL | ทำได้ ไม่บังคับ | Truly optional |

RFC 8174 clarifies that these words carry this meaning only in UPPERCASE.
