# ADR-003: Translation and Internationalization Standards for Angular Applications

## Decision summary

All Angular applications at Backbase must implement internationalization (i18n) and localization (l10n) using Angular's official `@angular/localize` package with standardized naming conventions, structured translation IDs, and configuration-based extensibility patterns. This decision establishes mandatory guidelines for marking translatable content, managing translation IDs, handling dynamic translations, and ensuring code quality through automated checks and comprehensive code reviews.

## Context and problem statement

### Business context
- **Global Reach:** Banking applications serve multi-national markets requiring support for multiple languages and locales
- **Regulatory Compliance:** Financial services must provide information in local languages per regional regulations
- **User Experience:** Users expect banking interfaces in their preferred language with culturally appropriate formatting (dates, numbers, currency)
- **Market Expansion:** New market entry requires efficient localization without code changes
- **Maintenance Cost:** Inconsistent i18n practices lead to translation errors, duplicated strings, and costly remediation
- **Success Criteria:**
  - Support for multiple locales without code changes
  - Consistent translation management across all journeys
  - Efficient translation workflow for localization teams
  - Zero ambiguous or missing translations in production

### Technical context
- **Existing Landscape:** Angular monorepo with multiple applications and shared journey libraries
- **Affected Systems:** 
  - All Angular applications (business-universal, retail-universal)
  - 50+ journey bundles with shared components
  - Configuration services across journeys
  - Shared component library (ui-ang)
- **Technical Gaps:**
  - Inconsistent translation ID naming conventions
  - Mixed usage of template i18n and $localize
  - No standardized approach for backend enumeration translations
  - Lack of validation for translation ID uniqueness
  - Missing guidelines for dynamic/runtime translations
  - No automated checks for i18n compliance

### Constraints and assumptions

**Technical Constraints:**
- Must use Angular's native `@angular/localize` package (Angular 10.1+)
- All translations must be extractable at build time
- Cannot use runtime translation libraries (e.g., ngx-translate) for consistency
- Must support both Ahead-of-Time (AOT) and Just-in-Time (JIT) compilation
- Must work with Nx monorepo build system
- RTL (Right-to-Left) language support required for Arabic, Hebrew

**Business Constraints:**
- Implementation must not break existing translations
- Migration path required for legacy journeys
- Translation workflow must integrate with existing localization vendors
- No additional licensing costs for translation management tools
- Must support both product-wide and journey-specific translations

**Environmental Constraints:**
- Build process must extract translations to XLF/XLIFF format
- Must support multiple locale builds in CI/CD pipeline
- Translation files must be version-controlled
- Must work with existing Angular CLI and Nx workspace configuration

**Assumptions Made:**
- Translators have access to context (meaning/description) for each string
- Design system components (ui-ang) provide localized labels through configuration
- Backend APIs return locale-agnostic identifiers (not localized strings)
- Translation IDs remain stable across versions for translation memory
- Localization teams prefer XLIFF format for translation tools

### Affected architecture description elements

**Components:**
- All Angular journey components and templates
- Configuration services providing default journey configurations
- Pipes for runtime value transformations
- Shared utility functions for translation helpers
- Backend API response mapping layers

**Views:**
- **Development View:** Translation extraction pipeline, build configuration, i18n tooling
- **Logical View:** Translation ID structure, configuration service patterns, pipe architecture
- **Process View:** Build-time extraction, translation workflow, quality gates
- **Deployment View:** Multi-locale build artifacts, locale-specific deployments

**Stakeholders:**
- **Development Teams:** Implement i18n standards in components and configurations
- **Localization Teams:** Translate extracted strings using translation memory tools
- **Product Owners:** Ensure feature parity across all supported locales
- **End Users:** Experience application in their preferred language
- **DevOps:** Manage multi-locale build and deployment processes

## Decision

### What we decided

**We will adopt Angular's native `@angular/localize` package as the exclusive internationalization solution** with the following mandatory requirements:

1. **Standard Translation ID Format**
   - All custom translation IDs must follow: `<library>.<component>.<element>[-attribute].name`
   - IDs must be unique across the entire application
   - IDs must include meaningful descriptions and context (meaning)

2. **Template vs. TypeScript Guidelines**
   - Use `i18n` attribute for static template content
   - Use `i18n-<attribute>` for translatable HTML attributes
   - Use `$localize` for TypeScript variables, configuration objects, and computed strings
   - Never create variables solely for translating static template text

3. **Backend Enumeration Pattern**
   - Backend enumerated values require configuration-based translation mappings
   - Use object literals with $localize for known enumeration values
   - Provide extensibility through journey configuration for custom values
   - Implement translation pipes for consistent template usage

4. **Dynamic Translation Pattern**
   - Provide configuration-based extensibility for runtime value mapping
   - Use pipes that delegate to configuration services
   - Include default translations for known/standard values
   - Allow customer override through configuration injection

5. **Mandatory Code Review Checklist**
   - All translation IDs follow naming convention
   - Meaningful descriptions provided for translator context
   - No hardcoded user-facing strings
   - Backend enumerations use translation mapping pattern
   - Configuration provides extensibility where needed

### Rationale

**Angular Native Approach:**
- Build-time extraction ensures all translations are present before deployment
- No runtime performance overhead from translation library
- Leverages Angular CLI tooling and compiler optimizations
- Industry standard for Angular applications
- Better tree-shaking and smaller bundle sizes

**Structured ID Convention:**
- Prevents duplicate translation IDs across large codebases
- Enables developers to locate source code from translation files
- Provides meaningful context for translators
- Supports translation memory tools effectively
- Facilitates automated validation and linting

**Configuration-Based Extensibility:**
- Allows customers to extend translations for custom backend values
- Maintains build-time extraction for default translations
- Separates concerns between journey logic and translation mappings
- Enables journey reusability across different backend implementations

## Implementation details

### Technical approach

#### 1. Translation ID Naming Convention

**Format:** `<library>.<component>.<element>[-attribute].name`

**Components:**
- `<library>`: Journey or library name (e.g., `transactions-list`, `accounts-journey`)
- `<component>`: Component file name without `.component.ts` suffix
- `<element>`: HTML element type or semantic identifier (e.g., `input`, `button`, `heading`, `message`)
- `[-attribute]`: Optional attribute name when translating HTML attributes (e.g., `-placeholder`, `-title`, `-aria-label`)
- `name`: Semantic identifier for the specific translation (e.g., `submit`, `cancel`, `error-message`)

**Separators:**
- Use `.` (dot) between major components
- Use `-` (hyphen) within multi-word elements and for attribute prefix
- Use `-` (hyphen) for multi-word names

**Examples:**

```typescript
// Template translation with description and custom ID
<h1 i18n="Account list heading|Main heading for account list page@@accounts-journey.accounts-list.heading.title">
  My Accounts
</h1>

// Attribute translation
<input 
  type="text"
  placeholder="Search accounts"
  i18n-placeholder="Account search placeholder|Placeholder text for account search input@@accounts-journey.accounts-list.input-placeholder.search"
/>

// TypeScript translation
export class AccountsListComponent {
  readonly title = $localize`:Account list heading|Main heading for account list page@@accounts-journey.accounts-list.heading.title:My Accounts`;
  
  readonly searchPlaceholder = $localize`:Account search placeholder|Placeholder text for account search input@@accounts-journey.accounts-list.message.search-placeholder:Search accounts`;
}
```

#### 2. Template i18n Patterns

**Basic template translation:**

```html
<!-- Good: Includes meaning, description, and custom ID -->
<span i18n="Welcome message|Greeting shown to logged-in users@@dashboard.header.message.welcome">
  Welcome back
</span>

<!-- Bad: No context or ID -->
<span i18n>Welcome back</span>
```

**Attribute translation:**

```html
<!-- Good: Translate accessibility attributes -->
<button 
  aria-label="Close dialog"
  i18n-aria-label="Close button label|ARIA label for dialog close button@@payment-dialog.button-aria-label.close"
>
  <i class="icon-close"></i>
</button>

<!-- Good: Translate placeholder, title, alt attributes -->
<input 
  type="email"
  placeholder="Enter your email"
  title="Email address for notifications"
  i18n-placeholder="Email input placeholder|Placeholder for email notification input@@profile.input-placeholder.email"
  i18n-title="Email input title|Tooltip for email notification input@@profile.input-title.email"
/>
```

**Pluralization and ICU expressions:**

```html
<!-- Pluralization -->
<span i18n="Transaction count|Number of transactions found@@transactions.message.count">
  {count, plural, 
    =0 {No transactions found}
    =1 {One transaction found}
    other {{{count}} transactions found}
  }
</span>

<!-- Select expression -->
<span i18n="Account status|Current status of account@@accounts.message.status">
  {status, select,
    active {Your account is active}
    pending {Your account is pending approval}
    suspended {Your account is temporarily suspended}
    other {Unknown account status}
  }
</span>
```

#### 3. TypeScript $localize Patterns

**Component properties:**

```typescript
@Component({
  selector: 'bb-payment-review',
  templateUrl: './payment-review.component.html'
})
export class PaymentReviewComponent {
  // Good: Translation with full context
  readonly confirmLabel = $localize`:Confirm button|Label for payment confirmation button@@payment-review.button.confirm:Confirm Payment`;
  
  readonly cancelLabel = $localize`:Cancel button|Label for payment cancellation button@@payment-review.button.cancel:Cancel`;
  
  // Good: Error messages
  readonly errorInsufficientFunds = $localize`:Error message|Shown when account has insufficient funds@@payment-review.error.insufficient-funds:Insufficient funds in your account`;
}
```

**Configuration objects:**

```typescript
// Good: Translatable configuration with extensibility
export interface PaymentJourneyConfig {
  statusLabels: { [key: string]: string };
}

export const DEFAULT_PAYMENT_CONFIG: PaymentJourneyConfig = {
  statusLabels: {
    'PENDING': $localize`:Payment status|Payment awaiting approval@@payment-journey.status.pending:Pending Approval`,
    'APPROVED': $localize`:Payment status|Payment has been approved@@payment-journey.status.approved:Approved`,
    'REJECTED': $localize`:Payment status|Payment has been rejected@@payment-journey.status.rejected:Rejected`,
    'PROCESSING': $localize`:Payment status|Payment is being processed@@payment-journey.status.processing:Processing`,
  }
};
```

**Static messages and constants:**

```typescript
// Good: Translatable constants
export const VALIDATION_MESSAGES = {
  required: $localize`:Validation error|Field is required@@validation.error.required:This field is required`,
  email: $localize`:Validation error|Invalid email format@@validation.error.email:Please enter a valid email address`,
  minLength: $localize`:Validation error|Input too short@@validation.error.min-length:Please enter at least {minLength} characters`,
};
```

#### 4. Backend Enumeration Translation Pattern

**Problem:** Backend returns enumerated values (e.g., transaction types, account statuses) that need localization, but values may be extensible or project-specific.

**Solution:** Configuration-based translation mapping with pipes

```typescript
// 1. Define configuration interface
export interface TransactionsJourneyConfig {
  transactionTypeLabels: { [key: string]: string };
}

// 2. Provide default translations for known values
export const DEFAULT_TRANSACTIONS_CONFIG: TransactionsJourneyConfig = {
  transactionTypeLabels: {
    'CARD_PAYMENT': $localize`:Transaction type|Credit or debit card payment@@transactions-journey.transaction-type.card-payment:Card Payment`,
    'WIRE_TRANSFER': $localize`:Transaction type|Wire transfer between accounts@@transactions-journey.transaction-type.wire-transfer:Wire Transfer`,
    'DIRECT_DEBIT': $localize`:Transaction type|Direct debit transaction@@transactions-journey.transaction-type.direct-debit:Direct Debit`,
    'ATM_WITHDRAWAL': $localize`:Transaction type|ATM cash withdrawal@@transactions-journey.transaction-type.atm-withdrawal:ATM Withdrawal`,
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
    // Return translated label if configured, otherwise return the code itself
    return this.config.transactionTypeLabels[typeCode] || typeCode;
  }
}

// 5. Usage in template
@Component({
  template: `
    <div class="transaction-type">
      {{ transaction.type | transactionType }}
    </div>
  `
})
export class TransactionItemComponent {
  @Input() transaction!: Transaction;
}
```

**Customer Extension Example:**

```typescript
// Customer provides additional translations for custom transaction types
const customConfig: Partial<TransactionsJourneyConfig> = {
  transactionTypeLabels: {
    'CUSTOM_CRYPTO_TRANSFER': $localize`:Transaction type|Cryptocurrency transfer@@custom.transaction-type.crypto:Crypto Transfer`,
    'CUSTOM_STOCK_PURCHASE': $localize`:Transaction type|Stock purchase transaction@@custom.transaction-type.stock:Stock Purchase`,
  }
};

// These merge with defaults, extending the available translations
```

#### 5. Dynamic/Runtime Translation Pattern

**Problem:** Need to display different localized strings based on data that isn't fully known at build time.

**Key Principle:** All possible translation strings must be defined at build time. Runtime logic selects which string to use.

**Pattern:**

```typescript
// 1. Define all possible translations in configuration
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

// 2. Create typed pipes for each mapping
@Pipe({ name: 'cardType' })
export class CardTypePipe implements PipeTransform {
  constructor(private readonly config: CardManagementConfigService) {}
  
  transform(card: Card | string): string {
    const typeCode = typeof card === 'string' ? card : card.type;
    return this.config.cardTypeLabels[typeCode] || typeCode;
  }
}

@Pipe({ name: 'cardStatus' })
export class CardStatusPipe implements PipeTransform {
  constructor(private readonly config: CardManagementConfigService) {}
  
  transform(card: Card | string): string {
    const statusCode = typeof card === 'string' ? card : card.status;
    return this.config.cardStatusLabels[statusCode] || statusCode;
  }
}

// 3. Use in templates
@Component({
  template: `
    <div class="card-info">
      <span class="card-type">{{ card | cardType }}</span>
      <span class="card-status" [class.blocked]="card.status === 'BLOCKED'">
        {{ card | cardStatus }}
      </span>
    </div>
  `
})
export class CardDetailsComponent {
  @Input() card!: Card;
}
```

**Anti-pattern - DO NOT DO THIS:**

```typescript
// BAD: Trying to compose translation keys dynamically
// This will NOT work - translations must be known at build time
getLabel(type: string): string {
  return $localize`:@@cards.type.${type}:${type}`; // ❌ DOES NOT WORK
}

// BAD: Trying to select translations at runtime from dynamic keys
// This will NOT work - $localize needs literal template strings
const key = `cards.type.${dynamicValue}`;
return $localize`:@@${key}:Label`; // ❌ DOES NOT WORK
```

#### 6. When to Use i18n vs $localize

**Decision Tree:**

```
Is this a static string in a template?
├─ YES: Is it element content?
│   └─ YES → Use i18n attribute
│       Example: <h1 i18n="...">Title</h1>
│
├─ YES: Is it an HTML attribute?
│   └─ YES → Use i18n-attribute
│       Example: <input i18n-placeholder="..." placeholder="..." />
│
├─ NO: Is it in TypeScript?
│   ├─ Is it only needed for a template binding?
│   │   └─ YES: Consider using i18n in template instead
│   │       (Don't create variables just for translation)
│   │
│   └─ NO: Does it need to be in TypeScript?
│       └─ YES → Use $localize
│           Examples:
│           - Configuration objects
│           - Validation messages
│           - Dynamic logic requiring translated strings
│           - Service layer messages
```

**Examples:**

```typescript
// ❌ BAD: Creating variable just to translate template text
@Component({
  template: `<h1>{{ pageTitle }}</h1>`
})
export class BadComponent {
  pageTitle = $localize`:@@page.title:My Page Title`; // Unnecessary
}

// ✅ GOOD: Use i18n directly in template
@Component({
  template: `<h1 i18n="Page title@@page.title">My Page Title</h1>`
})
export class GoodComponent {
  // No unnecessary variable
}

// ✅ GOOD: Use $localize when TypeScript logic needs it
@Component({
  template: `<div>{{ statusMessage }}</div>`
})
export class GoodComponent {
  get statusMessage(): string {
    // Logic requires TypeScript - appropriate use of $localize
    return this.isValid 
      ? $localize`:@@status.valid:All checks passed`
      : $localize`:@@status.error:Validation failed`;
  }
}
```

### Standards compliance

- [x] Angular @angular/localize package (v10.1+) used exclusively
- [x] Translation ID naming convention enforced via code review
- [x] XLIFF format for translation file interchange
- [x] Build-time translation extraction integrated in CI/CD
- [x] Configuration-based extensibility for custom translations
- [x] RTL language support considerations documented
- [x] Pluralization and ICU expression patterns defined

### Quality attributes addressed

| Quality Attribute | Requirement | How Decision Addresses It |
|-------------------|-------------|---------------------------|
| **Maintainability** | Easy to locate and update translations | Structured ID convention maps directly to source files |
| **Scalability** | Support 20+ languages without code changes | Build-time extraction with configuration-based extensibility |
| **Performance** | Zero runtime translation overhead | Build-time compilation with tree-shaking optimization |
| **Usability** | Contextual translations for better UX | Meaning and description provide translator context |
| **Extensibility** | Customers can add custom translations | Configuration service pattern allows injection of custom mappings |
| **Quality** | Zero missing or duplicate translations | Unique IDs with build-time validation |
| **Developer Experience** | Clear guidelines reduce decision fatigue | Comprehensive patterns and decision trees |

## Success metrics

### Technical success criteria
- **100%** of new code follows translation ID naming convention
- **Zero** translation ID collisions detected in CI/CD
- **< 10%** increase in build time for multi-locale builds
- **100%** of user-facing strings have translation IDs and descriptions
- **Zero** hardcoded user-facing strings in production code
- **All** journeys provide configuration-based extensibility for dynamic translations

### Business success criteria
- **90%+** translation quality score from localization vendor
- **< 1%** user-reported translation issues per release
- **Support for 5+ locales** within 6 months
- **30%** reduction in translation rework costs
- **100%** of new markets launched with day-1 localization support

### Monitoring and measurement
- **Weekly:** i18n compliance dashboard showing percentage per journey
- **Per PR:** Automated checks for translation ID format and uniqueness
- **Monthly:** Translation quality metrics from localization vendor
- **Quarterly:** Review of translation costs and efficiency gains
- **Annually:** Standards review and update based on Angular evolution

## Code review checklist

### Translation Implementation Review

Use this checklist during code reviews to ensure i18n compliance:

#### ✅ Translation ID Format
- [ ] All custom translation IDs follow format: `<library>.<component>.<element>[-attribute].name`
- [ ] Translation IDs are unique (no duplicates)
- [ ] Multi-word elements use hyphens within segments (e.g., `input-placeholder`)
- [ ] Components use dots to separate major sections (e.g., `journey.component.element`)

#### ✅ Translation Context
- [ ] Every i18n or $localize includes meaning (first part before `|`)
- [ ] Every i18n or $localize includes description (second part after `|`)
- [ ] Descriptions provide sufficient context for translators
- [ ] Descriptions are not just duplicates of the default text

#### ✅ Template Translations
- [ ] Static template text uses `i18n` attribute (not `$localize` in TypeScript)
- [ ] HTML attributes use `i18n-<attribute>` prefix (e.g., `i18n-placeholder`, `i18n-title`, `i18n-aria-label`)
- [ ] Pluralization uses ICU plural expressions where applicable
- [ ] No hardcoded user-facing strings in templates

#### ✅ TypeScript Translations
- [ ] `$localize` is used for configuration objects, validation messages, and logic-dependent strings
- [ ] Variables are NOT created solely to translate static template text
- [ ] Validation messages use descriptive IDs (e.g., `validation.error.required`)
- [ ] All `$localize` strings include full format: `:meaning|description@@id:default text`

#### ✅ Backend Enumeration Pattern
- [ ] Backend enumerated values use configuration-based translation mapping
- [ ] Default configuration provides translations for standard/known values
- [ ] Configuration interface allows customer extension
- [ ] Configuration service merges defaults with custom config
- [ ] Translation pipe delegates to configuration service
- [ ] Pipe returns original value as fallback if no translation configured

#### ✅ Dynamic Translation Pattern
- [ ] All possible translation values defined at build time (not composed at runtime)
- [ ] Configuration provides extensibility for customer-specific values
- [ ] Pipes used for consistent template transformation
- [ ] Fallback behavior defined (return code if no translation available)
- [ ] No attempt to compose translation IDs dynamically (won't work)

#### ✅ i18n vs $localize Decision
- [ ] Template static content uses `i18n`, not unnecessary TypeScript variables
- [ ] TypeScript `$localize` only used when logic requires it
- [ ] No duplication between template i18n and TypeScript $localize for same string

#### ✅ Code Quality
- [ ] No TODO comments about "add i18n later"
- [ ] No commented-out hardcoded strings
- [ ] Imports include `$localize` type declaration if used: `declare const $localize: any;` (TypeScript files only)
- [ ] Translation extraction tested (run extraction to verify all strings extracted)

#### ✅ Configuration Services
- [ ] Configuration interface documents all translatable properties
- [ ] Default configuration uses $localize for all user-facing strings
- [ ] Configuration service merges defaults with custom config correctly
- [ ] Configuration provides JSDoc comments explaining extensibility

#### ✅ Accessibility Translations
- [ ] ARIA labels, descriptions, and live regions are translated
- [ ] Error messages announced to screen readers are translated
- [ ] Dynamic status updates include translated text

#### ✅ Documentation
- [ ] Journey README documents custom configuration for translations
- [ ] Complex translation patterns include code comments explaining approach
- [ ] Any exceptions to standards are documented with rationale

### Common Anti-patterns to Reject

❌ **Missing Translation ID:**
```typescript
// BAD
<span i18n>Welcome</span>

// GOOD
<span i18n="Welcome message|Greeting for logged-in user@@dashboard.message.welcome">Welcome</span>
```

❌ **Creating variables just for template translation:**
```typescript
// BAD
export class Component {
  title = $localize`:@@page.title:Page Title`;
  // Template: {{ title }}
}

// GOOD - use i18n directly in template
// Template: <h1 i18n="Page title@@page.title">Page Title</h1>
```

❌ **Hardcoded user-facing strings:**
```typescript
// BAD
showError('An error occurred');

// GOOD
readonly errorMessage = $localize`:Error message|Generic error notification@@component.error.generic:An error occurred`;
showError(this.errorMessage);
```

❌ **Dynamic translation ID composition:**
```typescript
// BAD - This does NOT work
const key = `cards.status.${status}`;
return $localize`:@@${key}:Status`;

// GOOD - Define all translations upfront
const statusLabels = {
  'ACTIVE': $localize`:@@cards.status.active:Active`,
  'BLOCKED': $localize`:@@cards.status.blocked:Blocked`,
};
return statusLabels[status] || status;
```

❌ **Backend values without translation mapping:**
```typescript
// BAD
<span>{{ transaction.type }}</span>

// GOOD
<span>{{ transaction.type | transactionType }}</span>
// Where transactionType pipe uses configuration-based mapping
```

❌ **Poor translation IDs:**
```typescript
// BAD - Not following convention
i18n="@@msg1:Message"
i18n="@@myComponent_button_1:Label"

// GOOD
i18n="Button label|Submit button for payment form@@payment-review.button.submit:Submit Payment"
```

## References

### Authoritative sources
- [Angular i18n Official Guide](https://angular.io/guide/i18n-overview) - Angular documentation
- [Angular Localize Package](https://angular.io/api/localize) - Official API documentation
- [XLIFF 2.1 Specification](http://docs.oasis-open.org/xliff/xliff-core/v2.1/xliff-core-v2.1.html) - Translation file format
- [ICU MessageFormat](https://unicode-org.github.io/icu/userguide/format_parse/messages/) - Pluralization syntax

### Technical references
- [Maintaining Multi-language Angular Applications](https://medium.com/dailyjs/maintaining-multi-language-angular-applications-26b74df8d085) - Best practices article
- [Angular i18n: A Complete Translation Guide](https://phrase.com/blog/posts/angular-i18n-complete-translation-guide/) - Comprehensive guide
- [Internationalization with @angular/localize](https://www.digitalocean.com/community/tutorials/angular-internationalization) - Tutorial
- [RTL Language Support in Angular](https://material.angular.io/cdk/bidi/overview) - Bidirectional text support

### Standards compliance
- **ISO/IEC/IEEE 42010:2022** - Systems and software engineering — Architecture description
- **Angular Style Guide** - Internationalization best practices
- **WCAG 2.2** - Language of page and parts (Success Criteria 3.1.1, 3.1.2)
- **XLIFF Standard** - Localization file interchange format
