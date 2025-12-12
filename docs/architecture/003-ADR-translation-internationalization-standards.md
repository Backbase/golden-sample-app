# ADR-003: Translation and Internationalization Standards

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> All Angular applications must implement internationalization using Angular's `@angular/localize` package with structured translation IDs following the format `<library>.<component>.<element>[-attribute].name`. Backend enumerated values require configuration-based translation mappings with pipes for template usage, allowing customer extensibility.

### Rules

**MUST DO ✅**

1. Use `@angular/localize` package exclusively for all translations
2. Follow translation ID format: `<library>.<component>.<element>[-attribute].name`
3. Include meaning and description in every translation: `:meaning|description@@id:text`
4. Use `i18n` attribute for static template content, `$localize` for TypeScript logic
5. Use configuration-based translation mappings for backend enumerated values
6. Provide translation pipes that delegate to configuration services
7. Translate all accessibility attributes (aria-label, title, alt)

**MUST NOT ❌**

1. Do NOT use runtime translation libraries (e.g., ngx-translate)
2. Do NOT create TypeScript variables solely to translate static template text
3. Do NOT compose translation IDs dynamically at runtime (it won't work)
4. Do NOT leave user-facing strings without translation IDs
5. Do NOT omit meaning/description context for translators
6. Do NOT display raw backend enumeration codes to users without translation

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| i18n, template, static text, heading | [Pattern 1: Template Translation](#pattern-1-template-translation) |
| $localize, typescript, config, service | [Pattern 2: TypeScript Translation](#pattern-2-typescript-translation) |
| backend, enum, mapping, pipe | [Pattern 3: Backend Enumeration Translation](#pattern-3-backend-enumeration-translation) |
| plural, ICU, count, select | [Pattern 4: Pluralization and ICU Expressions](#pattern-4-pluralization-and-icu-expressions) |

---

### Pattern 1: Template Translation

**Use when:** Translating static content directly in HTML templates

**Don't use when:** String requires TypeScript logic or is part of a configuration object

✅ **Good**

```html
<!-- CONTEXT: Translating a page heading and input placeholder -->
<!-- RULE: Use i18n attribute with meaning|description@@id format -->

<h1 i18n="Account list heading|Main heading for account list page@@accounts-journey.accounts-list.heading.title">
  My Accounts
</h1>

<input 
  type="text"
  placeholder="Search accounts"
  i18n-placeholder="Account search placeholder|Placeholder text for account search input@@accounts-journey.accounts-list.input-placeholder.search"
/>

<button 
  aria-label="Close dialog"
  i18n-aria-label="Close button label|ARIA label for dialog close button@@payment-dialog.button-aria-label.close"
>
  <i class="icon-close"></i>
</button>
```

❌ **Bad**

```html
<!-- PROBLEM: Missing translation ID, meaning, and description -->

<span i18n>Welcome back</span>

<input placeholder="Search" i18n-placeholder />
```

**Why it's wrong:** Without a custom ID, Angular generates a hash-based ID that changes when the text changes, breaking translation memory. Without meaning/description, translators lack context.

**Verify:**
- [ ] Every `i18n` has format: `meaning|description@@library.component.element.name`
- [ ] All user-facing attributes (placeholder, title, aria-label) have `i18n-<attr>`
- [ ] Translation ID follows naming convention

---

### Pattern 2: TypeScript Translation

**Use when:** Translations needed in configuration objects, validation messages, or logic-dependent strings

**Don't use when:** String is static template content that could use `i18n` attribute instead

✅ **Good**

```typescript
// CONTEXT: Configuration object with translatable status labels
// RULE: Use $localize with full context format in TypeScript

export const DEFAULT_PAYMENT_CONFIG: PaymentJourneyConfig = {
  statusLabels: {
    'PENDING': $localize`:Payment status|Payment awaiting approval@@payment-journey.status.pending:Pending Approval`,
    'APPROVED': $localize`:Payment status|Payment has been approved@@payment-journey.status.approved:Approved`,
    'REJECTED': $localize`:Payment status|Payment has been rejected@@payment-journey.status.rejected:Rejected`,
  }
};

// Validation messages
export const VALIDATION_MESSAGES = {
  required: $localize`:Validation error|Field is required@@validation.error.required:This field is required`,
  email: $localize`:Validation error|Invalid email format@@validation.error.email:Please enter a valid email address`,
};
```

❌ **Bad**

```typescript
// PROBLEM: Creating variables just to translate static template text

@Component({
  template: `<h1>{{ pageTitle }}</h1>`
})
export class BadComponent {
  pageTitle = $localize`:@@page.title:My Page Title`; // Unnecessary variable
}
```

**Why it's wrong:** Static template text should use `i18n` directly in the template. Creating TypeScript variables adds unnecessary indirection and code.

**Verify:**
- [ ] `$localize` only used when TypeScript logic requires it
- [ ] All `$localize` include `:meaning|description@@id:text` format
- [ ] No variables created solely for template translation

---

### Pattern 3: Backend Enumeration Translation

**Use when:** Backend returns enumerated values (transaction types, statuses) that need localization

**Don't use when:** Values are already localized by the backend

✅ **Good**

```typescript
// CONTEXT: Translating backend transaction type codes
// RULE: Use configuration-based mapping with pipe delegation

// 1. Define configuration interface
export interface TransactionsJourneyConfig {
  transactionTypeLabels: { [key: string]: string };
}

// 2. Provide default translations
export const DEFAULT_TRANSACTIONS_CONFIG: TransactionsJourneyConfig = {
  transactionTypeLabels: {
    'CARD_PAYMENT': $localize`:Transaction type|Credit or debit card payment@@transactions-journey.transaction-type.card-payment:Card Payment`,
    'WIRE_TRANSFER': $localize`:Transaction type|Wire transfer between accounts@@transactions-journey.transaction-type.wire-transfer:Wire Transfer`,
    'DIRECT_DEBIT': $localize`:Transaction type|Direct debit transaction@@transactions-journey.transaction-type.direct-debit:Direct Debit`,
  }
};

// 3. Configuration service merges defaults with custom config
@Injectable()
export class TransactionsJourneyConfigService {
  readonly transactionTypeLabels: { [key: string]: string };
  
  constructor(@Inject(TRANSACTIONS_JOURNEY_CONFIG) customConfig: Partial<TransactionsJourneyConfig>) {
    this.transactionTypeLabels = {
      ...DEFAULT_TRANSACTIONS_CONFIG.transactionTypeLabels,
      ...(customConfig.transactionTypeLabels || {})
    };
  }
}

// 4. Create pipe for template usage
@Pipe({ name: 'transactionType' })
export class TransactionTypePipe implements PipeTransform {
  constructor(private readonly config: TransactionsJourneyConfigService) {}
  
  transform(typeCode: string): string {
    return this.config.transactionTypeLabels[typeCode] || typeCode;
  }
}

// 5. Use in template
@Component({
  template: `<div class="transaction-type">{{ transaction.type | transactionType }}</div>`
})
export class TransactionItemComponent {
  @Input() transaction!: Transaction;
}
```

❌ **Bad**

```typescript
// PROBLEM: Displaying raw backend code without translation

@Component({
  template: `<span>{{ transaction.type }}</span>`
})
export class BadComponent {
  @Input() transaction!: Transaction;
}

// PROBLEM: Trying to compose translation IDs dynamically
getLabel(type: string): string {
  return $localize`:@@cards.type.${type}:${type}`; // ❌ DOES NOT WORK
}
```

**Why it's wrong:** Raw backend codes are not user-friendly. Dynamic ID composition fails because `$localize` requires literal template strings known at build time.

**Verify:**
- [ ] Configuration provides default translations for known values
- [ ] Configuration service merges defaults with custom config
- [ ] Pipe returns original value as fallback if no translation
- [ ] Template uses pipe, not raw backend value

---

### Pattern 4: Pluralization and ICU Expressions

**Use when:** Text varies based on count or selection from a set of values

**Don't use when:** Simple static text without variation

✅ **Good**

```html
<!-- CONTEXT: Displaying transaction count with proper pluralization -->
<!-- RULE: Use ICU plural/select expressions -->

<span i18n="Transaction count|Number of transactions found@@transactions.message.count">
  {count, plural, 
    =0 {No transactions found}
    =1 {One transaction found}
    other {{{count}} transactions found}
  }
</span>

<!-- Select expression for status -->
<span i18n="Account status|Current status of account@@accounts.message.status">
  {status, select,
    active {Your account is active}
    pending {Your account is pending approval}
    suspended {Your account is temporarily suspended}
    other {Unknown account status}
  }
</span>
```

❌ **Bad**

```typescript
// PROBLEM: Using TypeScript conditionals instead of ICU expressions

@Component({
  template: `<span>{{ getCountMessage() }}</span>`
})
export class BadComponent {
  getCountMessage(): string {
    if (this.count === 0) return $localize`:@@count.zero:No items`;
    if (this.count === 1) return $localize`:@@count.one:One item`;
    return $localize`:@@count.other:${this.count} items`;
  }
}
```

**Why it's wrong:** ICU expressions are the standard way to handle pluralization in Angular i18n. They keep all variations together for translators and handle locale-specific plural rules.

**Verify:**
- [ ] Pluralization uses ICU `plural` expression
- [ ] Selection from values uses ICU `select` expression
- [ ] All branches have translation context

---

<!-- 
NOTE: For guidance on choosing between i18n and $localize, see Pattern 1 (template) 
and Pattern 2 (TypeScript) - use i18n for static template text, $localize only 
when TypeScript logic requires it.
-->

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `I18N-001` | Translation has custom ID | 🔴 BLOCKER | `grep -E 'i18n[^=]*="[^@]*"' --include="*.html"` (missing @@) |
| `I18N-002` | $localize has full format | 🔴 BLOCKER | `grep -E '\$localize\`[^:]*:' --include="*.ts"` (missing meaning\|desc) |
| `I18N-003` | No hardcoded user-facing strings | 🔴 BLOCKER | Manual review of template strings |
| `I18N-004` | Translation ID follows naming convention | 🟡 WARNING | `grep -E '@@[a-z]+-[a-z]+\.[a-z]' --include="*.html"` |
| `I18N-005` | Backend enum uses translation pipe | 🔴 BLOCKER | Review `{{ expression }}` without pipe for known enums |
| `I18N-006` | Accessibility attributes translated | 🟡 WARNING | `grep -E 'aria-label="[^"]*"' --include="*.html"` without i18n-aria-label |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `I18N-R01` | All translation IDs follow format: `<library>.<component>.<element>[-attribute].name` | 🔴 BLOCKER |
| `I18N-R02` | Every i18n/\$localize includes meaningful description for translators | 🔴 BLOCKER |
| `I18N-R03` | Backend enumerated values use configuration-based translation pattern | 🔴 BLOCKER |
| `I18N-R04` | Configuration provides extensibility for customer-specific values | 🟡 WARNING |
| `I18N-R05` | No TypeScript variables created solely for template translation | 🟡 WARNING |
| `I18N-R06` | Pluralization uses ICU expressions, not TypeScript conditionals | 🟡 WARNING |
| `I18N-R07` | ARIA labels and accessibility attributes are translated | 🔴 BLOCKER |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Translation extraction runs without errors | Build | ✅ Yes |
| Configuration service merges custom translations | Unit | ✅ Yes |
| Translation pipe returns fallback for unknown values | Unit | ✅ Yes |
| All user-facing text has translation ID | Build | ✅ Yes |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Banking applications serve multi-national markets requiring consistent translation patterns. Existing monorepo had inconsistent translation ID naming, mixed template i18n/$localize usage, and no backend enumeration translation standards.

### Business Drivers

- Multi-locale support without code changes
- Regulatory compliance for local language requirements
- Consistent translation patterns across journeys

### Technical Constraints

- Angular `@angular/localize` (build-time extraction)
- XLIFF format output, Nx monorepo compatible
- RTL language support (Arabic, Hebrew)

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Use Angular `@angular/localize` exclusively with structured translation IDs (`<library>.<component>.<element>.name`), mandatory translator context (meaning|description), and configuration-based backend enumeration translation.

### Rationale

| Choice | Why |
|--------|-----|
| @angular/localize | Build-time extraction, CLI integration, tree-shaking |
| Structured IDs | Prevents duplicates, supports translation memory |
| Config-based enums | Customer extensibility without source code changes |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Angular templates | MODIFY | `*.html` |
| Component classes | MODIFY | `*.component.ts` |
| Configuration services | MODIFY | `*-config.service.ts` |
| Translation pipes | CREATE | `*-translation.pipe.ts` |
| Journey configuration | MODIFY | `*-journey.config.ts` |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-001: Accessibility Standards | Related to - ARIA labels require translation |
| ADR-007: Journey Configuration Standards | Related to - Configuration provides translation extensibility |

### Migration Notes

- Implementation must not break existing translations
- Migration path required for legacy journeys using non-standard patterns
- Existing translation IDs should be preserved for translation memory
- New patterns apply to new code; legacy code migrated incrementally

---

## 7. Examples

### Complete Example

**Scenario:** Creating a card management component with translatable card types and statuses

```typescript
// File: libs/cards-journey/src/lib/config/cards-journey.config.ts

export interface CardManagementConfig {
  cardTypeLabels: { [key: string]: string };
  cardStatusLabels: { [key: string]: string };
}

export const DEFAULT_CARD_CONFIG: CardManagementConfig = {
  cardTypeLabels: {
    'CREDIT': $localize`:Card type|Credit card@@cards.card-type.credit:Credit Card`,
    'DEBIT': $localize`:Card type|Debit card@@cards.card-type.debit:Debit Card`,
    'PREPAID': $localize`:Card type|Prepaid card@@cards.card-type.prepaid:Prepaid Card`,
  },
  cardStatusLabels: {
    'ACTIVE': $localize`:Card status|Card is active@@cards.card-status.active:Active`,
    'BLOCKED': $localize`:Card status|Card is blocked@@cards.card-status.blocked:Blocked`,
    'EXPIRED': $localize`:Card status|Card has expired@@cards.card-status.expired:Expired`,
  }
};

// File: libs/cards-journey/src/lib/pipes/card-type.pipe.ts

@Pipe({ name: 'cardType' })
export class CardTypePipe implements PipeTransform {
  constructor(private readonly config: CardManagementConfigService) {}
  
  transform(card: Card | string): string {
    const typeCode = typeof card === 'string' ? card : card.type;
    return this.config.cardTypeLabels[typeCode] || typeCode;
  }
}

// File: libs/cards-journey/src/lib/components/card-details.component.html

<div class="card-details">
  <h2 i18n="Card details heading|Heading for card details section@@cards.card-details.heading.title">
    Card Details
  </h2>
  
  <div class="card-info">
    <span class="card-type">{{ card | cardType }}</span>
    <span class="card-status" [class.blocked]="card.status === 'BLOCKED'">
      {{ card | cardStatus }}
    </span>
  </div>
  
  <button 
    aria-label="Block this card"
    i18n-aria-label="Block card button|ARIA label for card blocking action@@cards.card-details.button-aria-label.block"
    (click)="blockCard()"
  >
    <span i18n="Block button|Button text to block card@@cards.card-details.button.block">Block Card</span>
  </button>
</div>
```

### Common Mistakes

**Mistake 1: Missing Translation ID**

```typescript
// ❌ Wrong
<span i18n>Welcome</span>

// ✅ Fix
<span i18n="Welcome message|Greeting for logged-in user@@dashboard.message.welcome">Welcome</span>
```

**Mistake 2: Creating variables just for template translation**

```typescript
// ❌ Wrong
export class Component {
  title = $localize`:@@page.title:Page Title`;
  // Template: {{ title }}
}

// ✅ Fix - use i18n directly in template
// Template: <h1 i18n="Page title@@page.title">Page Title</h1>
```

**Mistake 3: Dynamic translation ID composition**

```typescript
// ❌ Wrong - This does NOT work
const key = `cards.status.${status}`;
return $localize`:@@${key}:Status`;

// ✅ Fix - Define all translations upfront
const statusLabels = {
  'ACTIVE': $localize`:@@cards.status.active:Active`,
  'BLOCKED': $localize`:@@cards.status.blocked:Blocked`,
};
return statusLabels[status] || status;
```

**Mistake 4: Backend values without translation**

```typescript
// ❌ Wrong
<span>{{ transaction.type }}</span>

// ✅ Fix
<span>{{ transaction.type | transactionType }}</span>
```

---

## 8. References

- [Angular i18n Official Guide](https://angular.io/guide/i18n-overview) — Angular documentation
- [Angular Localize Package](https://angular.io/api/localize) — Official API documentation
- [XLIFF 2.1 Specification](http://docs.oasis-open.org/xliff/xliff-core/v2.1/xliff-core-v2.1.html) — Translation file format
- [ICU MessageFormat](https://unicode-org.github.io/icu/userguide/format_parse/messages/) — Pluralization syntax
- [RTL Language Support](https://material.angular.io/cdk/bidi/overview) — Bidirectional text support
- **WCAG 2.2** — Language of page and parts (Success Criteria 3.1.1, 3.1.2)

---
