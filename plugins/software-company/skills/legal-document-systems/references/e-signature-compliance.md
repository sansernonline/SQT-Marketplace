> เดิมชื่อ e-signature-compliance (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-legaltech` — รวมเข้า `legal-document-systems` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Signature Levels](#signature-levels)
- [Legal Equivalence](#legal-equivalence)
- [Carve-Outs (Often Require Wet Signature)](#carve-outs-often-require-wet-signature)
- [Thailand: Electronic Transactions Act B.E. 2544](#thailand-electronic-transactions-act-be-2544)
- [ESIGN Act (US) Requirements](#esign-act-us-requirements)
- [eIDAS Requirements (EU)](#eidas-requirements-eu)
- [Authentication Methods by Level](#authentication-methods-by-level)
- [Implementation Pattern](#implementation-pattern)
- [Certificate of Completion](#certificate-of-completion)
- [Cross-Border Validity](#cross-border-validity)
- [Vendor vs Custom](#vendor-vs-custom)
- [Audit Trail Must-Haves](#audit-trail-must-haves)
- [Pre-Sign Disclosures](#pre-sign-disclosures)
- [Document Storage Requirements](#document-storage-requirements)
- [Things You Don't Do](#things-you-dont-do)
- [Reference](#reference)

# E-Signature Compliance Patterns

## When to use this skill

- Building or integrating e-signature
- Cross-border signing
- High-value contracts
- Regulated industry signing

## Signature Levels

```
Simple Electronic Signature (SES)     — typed name, click "I agree"
Advanced Electronic Signature (AES)   — uniquely identifies + tamper-evident, signer-held key
Qualified Electronic Signature (QES)  — AES + qualified certificate
```

## Legal Equivalence

| Region | SES valid? | AES required? | QES = handwritten |
|--------|:----------:|:-------------:|:-----------------:|
| **EU (eIDAS)** | ✅ | When risk justifies | ✅ |
| **US (ESIGN/UETA)** | ✅ usually | Specific cases | N/A |
| **UK (Post-Brexit)** | ✅ | Similar to eIDAS | ✅ |
| **Thailand (Electronic Transactions Act, ETA)** | ✅ (s.9) | Reliable signature (s.26) when the risk justifies it | N/A — see [Thailand](#thailand-electronic-transactions-act-be-2544) |
| **Singapore (ETA)** | ✅ | Specific | N/A |
| **India (IT Act)** | ✅ | Required for many | ✅ |

## Carve-Outs (Often Require Wet Signature)

```
Even in e-sign friendly jurisdictions:
- Wills, codicils, trust documents
- Real estate transfers (some jurisdictions)
- Court orders + notices
- Marriage/divorce documents
- Adoption papers
- Some POA documents
- Healthcare directives (varies)
```

> 💡 **Check jurisdiction-specific rules before automating any of above.**

## Thailand: Electronic Transactions Act B.E. 2544

พระราชบัญญัติว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544 (amended B.E. 2551 and later). Checked 2026-10-22.

- **Section 9 (มาตรา 9)** — where a law needs a signature, an electronic signature counts when the method identifies the signer, shows intent, and is reliable enough for the purpose of the transaction (source: opsmoac.go.th summary of the Act)
- **Section 26 (มาตรา 26)** — a "reliable" electronic signature: the signing data links only to the signer, was under the signer's sole control, and any later change to the signature or the document can be detected. Use this level (usually a certificate-based signature) for high-value or disputed contracts (รอยืนยัน: section text not opened this round)
- **Excluded — no e-signature:** family-law and succession matters (marriage, divorce, adoption, wills and inheritance), by a Royal Decree under the Act (Adobe Thailand e-signature page, updated 2026-08-13; decree year B.E. 2549 รอยืนยัน)
- **Wet ink in practice:** power of attorney, sale of land and buildings, land office registration and survey, house registration and ID card matters, name changes, some business licences (same Adobe page)
- **Pending:** a new Electronic Transactions Act draft (63 sections, reviewed by the Council of State, matter 1654/2567) would replace the B.E. 2544 Act and let the Electronic Transactions Development Agency (ETDA) set reliable methods; it starts 180 days after publication in the Royal Gazette (Thansettakij, 2026-10-01). Check etda.or.th for its status before relying on the current sections (รอยืนยัน)

## ESIGN Act (US) Requirements

```
1. Intent to sign
   - Signer must affirmatively intend to sign

2. Consent to electronic signatures
   - Pre-signing disclosure
   - Reasonable demonstration of ability to receive

3. Association with record
   - Signature linked to the specific document

4. Retention
   - Records reproducible by all parties later
```

## eIDAS Requirements (EU)

### For AES
- Uniquely linked to signer
- Capable of identifying signer
- Created with signing data that only the signer controls
- Linked to the signed data so any later change can be detected

### For QES
- All AES requirements
- + Created by qualified signature creation device
- + Based on qualified certificate from qualified trust service provider

### eIDAS 2.0
Regulation (EU) 2024/1183 amends eIDAS (in force May 2024). Each member state must offer a European Digital Identity (EUDI) Wallet that can make qualified signatures, due around the end of 2026 (รอยืนยัน exact date) — plan to accept wallet signatures in EU signing flows.

## Authentication Methods by Level

```
SES (email or SMS proves access to an inbox or phone, not sole control of a signing key):
- Click "I Agree"
- Type name
- Drawn signature
- Email verification link
- SMS one-time code

AES (eIDAS Art. 26: signing data under the signer's sole control):
- Signer-held certificate or key (smart card, device key, remote signing with the signer's own credentials)
- Plus identity proofing (ID document check, video identification) when the certificate is issued

QES:
- Government-issued chip card + reader
- Mobile QES via TSP (Trust Service Provider)
- Cloud-based QES
```

## Implementation Pattern

```typescript
async function sign(documentId, signer, requestedLevel) {
  // 1. Determine actual required level (jurisdiction + use case)
  const requiredLevel = await determineRequiredLevel(documentId, signer);

  if (requiredLevel > requestedLevel) {
    throw new InsufficientSignatureLevelError({
      required: requiredLevel,
      requested: requestedLevel,
    });
  }

  // 2. Authenticate signer per level
  await authenticateForLevel(signer, requiredLevel);

  // 3. Show document + obtain explicit consent
  await displayDocumentToSigner(documentId, signer);
  const consent = await obtainConsent(signer, CONSENT_TEXT);

  // 4. Capture signature with all required attributes
  const signature = {
    document_id: documentId,
    document_hash: await hashDocument(documentId),
    signer_id: signer.id,
    signer_email: signer.email,
    signature_level: requiredLevel,
    signed_at: new Date(),
    authentication_method: signer.authMethod,
    authentication_evidence: signer.authEvidence,
    ip_address: req.ip,
    user_agent: req.userAgent,
    geolocation: await geolocate(req.ip),
    consent_text: CONSENT_TEXT,
    consent_obtained_at: consent.timestamp,
    legal_basis: legalBasisFor(documentId),
  };

  await db.signatures.create(signature);

  // 5. Embed signature visualization in document
  await embedSignatureInDocument(documentId, signature);

  // 6. Generate Certificate of Completion
  await generateCertificate(documentId);

  return signature;
}
```

## Certificate of Completion

```typescript
// Court-admissible record of signing event
interface CertificateOfCompletion {
  document_id: string;
  document_hash: string;
  document_name: string;

  parties: SignerInfo[];
  events: AuditEvent[];

  envelope_creator: string;
  envelope_created_at: Date;
  completed_at: Date;

  verification_url: string;  // verify document hash later

  trust_service_provider?: string;  // for QES
  certificate_authority?: string;
}

// Embed as last page of signed PDF
```

## Cross-Border Validity

```
Signing in country A, enforced in country B:

EU → EU:    Generally recognized (eIDAS)
EU → US:    Generally recognized (with care)
US → EU:    May need additional steps for QES-required cases
Asia → EU:  Depends on equivalence + agreement
```

> 💡 **Document signed across several jurisdictions: use the highest level any of them requires.**

## Vendor vs Custom

### Use vendor (most cases)
- DocuSign, Adobe Acrobat Sign (was Adobe Sign), Dropbox Sign (was HelloSign), etc.
- Pre-built compliance
- Audit trails
- TSP relationships

### Build custom (rare)
- Special workflows
- Tight integration needs
- Lower cost at very large volume

> 💡 **DON'T roll own cryptography. Use established vendors or libraries.**

## Audit Trail Must-Haves

```
For each event:
- WHO (authenticated identity)
- WHAT (specific action)
- WHEN (timestamp, trusted source)
- WHERE (IP, geolocation)
- HOW (authentication method used)
- WHY (link to specific document version)
```

## Pre-Sign Disclosures

```typescript
// Required before electronic signing
const consentDisclosure = `
Before signing electronically, you must consent to:
1. Conducting this transaction electronically
2. Receiving notices and records electronically
3. The ability to access this document on your device

You have the right to:
- Receive paper copies (request via [link])
- Withdraw consent at any time
- Update your contact info

By clicking "I Consent", you agree to these terms.
`;
```

## Document Storage Requirements

```
Maintain for retention period (jurisdiction-specific):
- Original document (immutable)
- Audit trail (immutable)
- Certificate of Completion (immutable)
- Hashes for tamper detection
- Authentication records
- Consent records

Common retention: 6-7 years (statute of limitations)
But: some need longer (court records, real estate)
```

## Things You Don't Do

- ❌ Skip identity verification for high-value contracts
- ❌ Allow document edit after first signature
- ❌ Use only IP address for "identification"
- ❌ Forget to disclose carve-outs to users
- ❌ Roll own cryptographic signatures
- ❌ Provide legal opinion on enforceability

## Reference

- [eIDAS Regulation](https://digital-strategy.ec.europa.eu/en/policies/electronic-identification)
- [ESIGN Act (15 USC §7001)](https://www.fdic.gov/regulations/compliance/manual/10/x-3.pdf)
- [Thailand Electronic Transactions Act](https://www.etda.or.th/)
- [DocuSign Legal Reference](https://www.docusign.com/legality-guide)
- [Adobe Acrobat Sign Legality Guide](https://acrobat.adobe.com/us/en/sign/capabilities/legal/electronic-signature-laws.html)
