---
name: checkout-optimization
description: Use when designing or optimizing e-commerce checkout flows. Covers form design, guest vs login, payment methods, mobile patterns, trust signals, and friction reduction based on Baymard research and industry benchmarks.
---

# Checkout Optimization

## When to use this skill

- Designing new checkout flow
- Reducing checkout abandonment
- A/B testing checkout changes
- Adding new payment methods
- Improving mobile checkout
- Adding Express checkout (Apple Pay, etc.)

## The Numbers (Why It Matters)

- **70% average checkout abandonment** (Baymard 2024)
- **35% of abandonment** = forced account creation
- **22% of abandonment** = unexpected costs revealed late
- **Mobile checkout** converts ~70% as well as desktop

## The 7 Critical Improvements

### 1. ✅ Guest Checkout (or "purchase as guest")

❌ Bad: "Sign up to checkout"
✅ Good: "Continue as guest" → option to create account on confirmation

### 2. ✅ Transparent Pricing

Show ALL costs (tax, shipping, fees) BEFORE checkout, or in cart.
"Unexpected costs at checkout" = 22% of abandonment.

### 3. ✅ Multiple Payment Methods

| Method | Why |
|--------|-----|
| Card (Visa, MC, Amex) | Universal |
| Apple Pay / Google Pay | 1-tap, mobile critical |
| PayPal | Trust + saved info |
| BNPL (Klarna, Afterpay) | Younger demographics |
| Local methods | THB: PromptPay, SCB EASY, K PLUS |
| Bank transfer | Mature TH market |

### 4. ✅ Address Autocomplete

Use Google Places or similar.
Reduces fields, errors, time-to-complete.

### 5. ✅ Inline Validation

```typescript
// ❌ Bad: validation only on submit
form.onSubmit(() => {
  if (!emailValid) showError('Invalid email');
});

// ✅ Good: validate on blur, show errors next to field
emailField.onBlur(() => {
  if (!isValidEmail(emailField.value)) {
    showInlineError(emailField, 'Please enter a valid email');
  }
});
```

### 6. ✅ Progress Indicator (Multi-Step)

```
[1. Cart] → [2. Shipping] → [3. Payment] → [4. Review]
              ▲ you are here
```

User knows: "how much more?"

### 7. ✅ Visible Trust Signals

- 🔒 SSL padlock + security badges
- 💳 Accepted payment logos
- 🛡️ Money-back guarantee
- ⭐ Recent reviews
- 📞 Customer service availability

## Form Field Best Practices

### Reduce field count

```
❌ Over-collection:
- First name
- Last name
- Company
- Phone
- Email
- Birthdate
- ...

✅ Minimum viable:
- Email (for receipt + account creation later)
- Name (full, single field)
- Phone (for delivery)
- Shipping address
- Payment

That's it.
```

### Field design

| Pattern | Why |
|---------|-----|
| Full name in 1 field | Fewer fields, handles non-Western names |
| Email = login | One identifier |
| Address autocomplete | Less typing, more accurate |
| Optional vs required clear | Asterisk or "(optional)" |
| Input format matches data | Phone: tel keyboard on mobile |
| Right keyboard on mobile | `inputmode="email"`, `numeric`, etc. |
| Forgiving validation | Accept "555-1234" or "5551234" |

## Mobile-Specific Optimizations

### Layout
- Single column (always)
- Large tap targets (48×48 px min)
- Fixed bottom CTA (always visible)
- Auto-advance after picker selection

### Input
- Right keyboard type per field
- Input masks (credit card spacing)
- Auto-format as user types (where helpful)
- Native pickers for date, country

### Payment
- Apple Pay / Google Pay prominent
- Card fields with detected card type
- Auto-fill from saved cards
- One-tap for returning customers

## Express Checkout (Critical for Mobile)

### Apple Pay flow

```
1. Show "Buy with Apple Pay" button
2. Tap → Face ID/Touch ID
3. Done. 3 seconds total.

vs traditional: 2+ minutes
```

### Implementation

```typescript
// Show Apple Pay button if available
if (window.ApplePaySession?.canMakePayments()) {
  showApplePayButton();
}

// On tap
async function startApplePay() {
  const session = new ApplePaySession(3, {
    countryCode: 'TH',
    currencyCode: 'THB',
    merchantCapabilities: ['supports3DS'],
    supportedNetworks: ['visa', 'masterCard'],
    total: { label: 'Your Store', amount: cart.total.toString() },
    requiredShippingContactFields: ['name', 'postalAddress'],
    requiredBillingContactFields: ['postalAddress'],
  });

  session.onpaymentauthorized = async (event) => {
    // Send to your backend → forward to Stripe/etc.
    const result = await processPayment(event.payment.token);

    session.completePayment(result.success
      ? ApplePaySession.STATUS_SUCCESS
      : ApplePaySession.STATUS_FAILURE
    );
  };

  session.begin();
}
```

## Error Handling

### Pattern: Recoverable errors don't break flow

```typescript
// ❌ Bad: error wipes form
catch (paymentError) {
  setForm({});
  setError(paymentError.message);
}

// ✅ Good: preserve state, fix what's wrong
catch (paymentError) {
  if (paymentError.code === 'invalid_card') {
    setCardError('Card declined. Try another card.');
    focusCardField();  // help user fix
  } else if (paymentError.code === 'network') {
    setNetworkError('Connection issue. Tap Retry.');
    showRetryButton();
  }
  // Preserve all other form state
}
```

## Cart-to-Checkout Optimizations

### Persistent cart
- Survive page refresh
- Survive device switch (for logged in)
- 30+ days expiry

### Abandoned cart recovery
```
0 min: cart abandoned
30 min: email "Did you forget something?" with cart preview
24 hr: second email with incentive (free shipping?)
3 days: SMS reminder (if opted in)
```

### Save-for-later
- Reduce "remove from cart" by offering wishlist
- Often recovers 10-15% of would-be removes

## Speed Matters

### Page load targets
- LCP (Largest Contentful Paint) < 2.5s
- INP (Interaction to Next Paint) < 200ms
- CLS (Cumulative Layout Shift) < 0.1

### Each second of delay = 7% drop in conversions (Google study)

## Checkout Flow Patterns

### Pattern 1: One Page

```
[Cart summary] [Shipping form] [Payment form] [Review] [Place Order]
        ▲              ▲              ▲           ▲
       all visible, scrollable, one CTA
```

Pros: simple, fast
Cons: long page, error scrolling

### Pattern 2: Multi-Step (Accordion)

```
1. Shipping        [edit] ✓
2. Delivery        [active]
3. Payment         (locked)
4. Review          (locked)
```

Pros: focused, progressive disclosure
Cons: more clicks

### Pattern 3: Single Page (Accordion when expanded)

Mix of both. Default checkout pattern in 2026.

## Trust Signals Where They Matter

| Location | Signal |
|----------|--------|
| Cart | Customer service + return policy |
| Shipping form | "We don't sell your data" |
| Payment | Security badges, "Secure encryption" |
| Submit button | "Place Secure Order" not just "Buy" |
| Confirmation | Order number prominent, what's next |

## Tracking & Analytics

```typescript
// Track each step
events.fire('checkout_started', { cart_value: total, items: items.length });
events.fire('checkout_step', { step: 'shipping', completed: true });
events.fire('checkout_step', { step: 'payment', completed: false, error: 'card_declined' });
events.fire('purchase', { order_id, value: total });
```

Funnel by:
- Device type
- New vs returning
- Cart value
- Time of day
- Traffic source

## Common Pitfalls

- ❌ **Hidden fees revealed late** — main abandonment cause
- ❌ **Forced login** — 35% leave
- ❌ **No express checkout on mobile** — slow conversion
- ❌ **Long forms** — drop-off increases per field
- ❌ **Wrong keyboard** — typing pain
- ❌ **No address autocomplete** — errors + slow
- ❌ **No inline validation** — frustrating
- ❌ **Cart wiped on logout** — hostile UX

## Reference

- [Baymard Institute Checkout Research](https://baymard.com/checkout-usability)
- [Apple Pay Web Documentation](https://developer.apple.com/documentation/applepayontheweb)
- [Google Pay Web Documentation](https://developers.google.com/pay/api/web/overview)
- [Stripe Checkout Best Practices](https://stripe.com/docs/payments/checkout)
