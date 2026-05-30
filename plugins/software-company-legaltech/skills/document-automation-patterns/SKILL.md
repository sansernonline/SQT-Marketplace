---
name: document-automation-patterns
description: Use when building document automation — template languages, variable systems, conditional logic, intake forms, multi-format output (DOCX, PDF, HTML).
---

# Document Automation Patterns

## When to use this skill

- Building template system
- Designing intake form
- Multi-language documents
- Document generation API

## Template Language Choice

| Language | Use case | Pros / Cons |
|----------|----------|-------------|
| **Jinja2** (Python) | Flexible, Python ecosystem | Powerful + dangerous if exposed |
| **Liquid** (Ruby) | Shopify-style, safer | Less powerful |
| **Handlebars** | JS, simple | Logic-less philosophy |
| **DocxTemplater** | DOCX-specific | Lawyer-editable Word files |
| **HotDocs** | Legal industry | Expensive, proprietary |
| **Docassemble** | Legal-specific, Python | Powerful, learning curve |

## Pattern: Markdown + Variables

```jinja2
# {{ document_title }}

**Agreement Date:** {{ effective_date | format_date }}

**Parties:**
- {{ party_a.legal_name }}, a {{ party_a.entity_type }} ("{{ party_a.short_name }}")
- {{ party_b.legal_name }}, a {{ party_b.entity_type }} ("{{ party_b.short_name }}")

## 1. Services

{{ party_b.short_name }} shall provide the following services:

{% for service in services %}
{{ loop.index }}. {{ service.description }}
   {% if service.deliverables %}
   Deliverables: {{ service.deliverables | join(', ') }}
   {% endif %}
   Fee: {{ service.fee | format_money(currency) }}
{% endfor %}

{% if has_nda %}
## 2. Confidentiality

{% include 'clauses/nda.md' %}
{% endif %}

## 3. Term

This Agreement shall commence on {{ effective_date | format_date }} and continue for {{ term_months }} months unless terminated earlier.

{% if includes_renewal %}
Upon expiration, this Agreement shall {{ renewal_type | default('automatically renew') }} for successive {{ renewal_period_months }}-month terms.
{% endif %}
```

## Variable System Design

```typescript
interface VariableSchema {
  name: string;
  label: string;            // user-facing
  type: VarType;
  required: boolean;
  default?: any;
  helpText?: string;
  group?: string;           // form grouping
  order?: number;           // display order
  conditional?: string;     // show only if
  validation?: ValidationRule;
}

type VarType =
  | 'string'
  | 'multiline_string'
  | 'number'
  | 'currency'
  | 'date'
  | 'date_range'
  | 'boolean'
  | 'enum'
  | 'multi_select'
  | 'party'             // structured
  | 'address'           // structured
  | 'list'              // array of items
  | 'reference';        // link to another doc/entity

interface ValidationRule {
  min?: number;
  max?: number;
  pattern?: string;     // regex
  options?: any[];      // for enum
  custom?: string;      // expression
}
```

## Structured Variables: Party Example

```yaml
variables:
  - name: party_a
    type: party
    label: "Party A"
    structure:
      - name: legal_name
        type: string
        required: true
      - name: short_name
        type: string
        required: true
        default: "{{ legal_name }}"
      - name: entity_type
        type: enum
        options:
          - LLC
          - Corporation
          - Limited Partnership
          - Sole Proprietor
        required: true
      - name: jurisdiction
        type: enum
        options: us_states + international
        required: true
        conditional: "entity_type != 'Sole Proprietor'"
      - name: address
        type: address
        required: true
      - name: signatory
        type: string
        required: true
      - name: signatory_title
        type: string
        required: true
```

## Conditional Logic

### Simple
```jinja2
{% if has_confidential_info %}
[NDA clause]
{% endif %}
```

### Multi-branch
```jinja2
{% if jurisdiction == 'CA' %}
[California-specific clause]
{% elif jurisdiction == 'NY' %}
[New York-specific clause]
{% else %}
[Default clause]
{% endif %}
```

### Complex
```jinja2
{% if deal_size > 1000000 and involves_real_estate %}
[High-value real estate clause]
{% endif %}

{% if days_until_close < 30 and not pre_approved %}
[Expedited closing clause]
{% endif %}
```

## Intake Form Generation

```typescript
// Auto-generate form from template variables
function generateIntakeForm(template: Template) {
  const groups = groupVariables(template.variables);

  return groups.map(group => ({
    title: group.label,
    fields: group.variables
      .filter(v => evaluateConditional(v.conditional, currentValues))
      .map(v => ({
        name: v.name,
        label: v.label,
        type: mapToFormFieldType(v.type),
        required: v.required,
        validation: v.validation,
        helpText: v.helpText,
        options: v.options,
      })),
  }));
}

// Re-render form when values change (conditionals)
form.onChange((values) => {
  setCurrentValues(values);
  rerender();
});
```

## Multi-Step Intake (Wizard)

```typescript
// Don't show all 50 fields at once
// Use logical groupings

const steps = [
  { title: 'Parties', variables: ['party_a', 'party_b'] },
  { title: 'Terms', variables: ['effective_date', 'term_months'] },
  { title: 'Services', variables: ['services', 'fees'] },
  { title: 'Special Provisions', variables: ['has_nda', 'has_non_compete'] },
  { title: 'Review', variables: [] },  // show preview
];

// Allow back/forward, save draft
```

## Pre-Fill Strategies

### From existing data
```typescript
// CRM integration
const variables = {
  party_a: {
    legal_name: salesforceAccount.Name,
    address: parseSFAddress(salesforceAccount.BillingAddress),
    entity_type: salesforceAccount.EntityType__c,
  },
};
```

### Smart defaults
```typescript
// Effective date defaults to today
effective_date: today()

// Term defaults to common (1 year)
term_months: 12

// Notice period proportional to term
notice_period_days: term_months * 30 / 12  // ~1 month notice per year
```

### Cascading prefills
```typescript
// When jurisdiction selected, prefill governing law
on('jurisdiction', (val) => {
  setValue('governing_law', val);
  setValue('venue', defaultVenueFor(val));
});
```

## Multi-Language Templates

```yaml
template_id: nda_v3
languages:
  en:
    name: "Non-Disclosure Agreement"
    body: |
      This Non-Disclosure Agreement ("Agreement") is entered into...
  th:
    name: "ข้อตกลงไม่เปิดเผยข้อมูล"
    body: |
      ข้อตกลงไม่เปิดเผยข้อมูล ("ข้อตกลง") นี้ทำขึ้น...

variables:
  - name: party_a_name
    label:
      en: "Party A Name"
      th: "ชื่อฝ่าย A"
```

## Output Format Pipeline

```typescript
async function render(documentId, format) {
  // 1. Render to base markdown
  const markdown = await renderTemplate(documentId);

  // 2. Convert to target format
  switch (format) {
    case 'docx':
      return await convertToDocx(markdown);
    case 'pdf':
      const html = markdownToHtml(markdown);
      return await convertToPdf(html);
    case 'html':
      return markdownToHtml(markdown);
    case 'odt':
      return await convertToOdt(markdown);
  }
}
```

### DOCX with style preservation
- Use `docx-templates` or `pandoc`
- Lawyers can edit Word file (template authoring)
- Variables replaced on generation

### PDF with letterhead
- Generate HTML
- Use Puppeteer / Chrome headless
- Embed header/footer with letterhead

## Versioning + Audit

```typescript
interface GeneratedDocument {
  id: string;
  template_id: string;
  template_version: number;  // pin to version
  inputs: Record<string, any>;
  output_hash: string;       // tamper detection
  generated_at: Date;
  generated_by: string;
}

// Regenerate exact same doc later
async function regenerate(documentId: string) {
  const doc = await db.documents.findById(documentId);
  const template = await getTemplateVersion(doc.template_id, doc.template_version);
  const regenerated = await renderTemplate(template, doc.inputs);

  if (sha256(regenerated) !== doc.output_hash) {
    throw new Error('Cannot reproduce - template logic changed?');
  }

  return regenerated;
}
```

## Lawyer Workflow

```
Lawyer:
1. Drafts template in Word (familiar)
2. Marks variables with {{ syntax }}
3. Adds conditional logic via comments
4. Reviews generated samples
5. Approves for production
6. Trains team

System:
- Parses Word
- Validates variables
- Generates test cases
- Stores versioned template
- Routes to production
```

## Things You Don't Do

- ❌ Allow users to inject template syntax (XSS / injection)
- ❌ Generate + send without preview
- ❌ Auto-deploy template changes (require lawyer approval)
- ❌ Skip versioning (reproducibility)
- ❌ Mix languages in single template

## Reference

- [Jinja2 Docs](https://jinja.palletsprojects.com/)
- [Docassemble](https://docassemble.org/)
- [Docxtemplater](https://docxtemplater.com/)
- [Pandoc](https://pandoc.org/)
- [Documate (commercial)](https://www.documate.org/)
