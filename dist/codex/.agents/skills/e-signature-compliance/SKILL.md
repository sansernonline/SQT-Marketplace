---
name: e-signature-compliance
description: Use when implementing electronic signatures with legal compliance — eIDAS, ESIGN, UETA, country-specific frameworks, signature levels (SES/AES/QES), authentication requirements.
---

# E-Signature Compliance Patterns

## When to use this skill

- Building or integrating e-signature
- Cross-border signing
- High-value contracts
- Regulated industry signing

## Signature Levels

```
SES (Simple)        — typed name, click "I agree"
AES (Advanced)      — uniquely identifies + tamper-evident
QES (Qualified)     — AES + qualified certificate
```

## Legal Equivalence

| Region | SES valid? | AES required? | QES = handwritten |
|--------|:----------:|:-------------:|:-----------------:|
| **EU (eIDAS)** | ✅ | When risk justifies | ✅ |
| **US (ESIGN/UETA)** | ✅ usually | Specific cases | N/A |
| **UK (Post-Brexit)** | ✅ | Similar to eIDAS | ✅ |
| **Thailand (ETA)** | ✅ | Specific cases | N/A |
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
- Created using data signer can use under sole control
- Linked to data such that subsequent change detectable

### For QES
- All AES requirements
- + Created by qualified signature creation device
- + Based on qualified certificate from qualified trust service provider

## Authentication Methods by Level

```
SES:
- Click "I Agree"
- Type name
- Drawn signature

AES:
- Email verification
- SMS code
- ID upload + verification
- Personal certificate

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

> 💡 **Multi-jurisdiction docs: use highest required level.**

## Vendor vs Custom

### Use vendor (most cases)
- DocuSign, Adobe Sign, HelloSign, etc.
- Pre-built compliance
- Audit trails
- TSP relationships

### Build custom (rare)
- Special workflows
- Tight integration needs
- Cost at huge scale

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

- ❌ Skip identity verification for high-value
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
- [Adobe Sign Legality Guide](https://acrobat.adobe.com/us/en/sign/capabilities/legal/electronic-signature-laws.html)
