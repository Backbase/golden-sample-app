# ADR-009: View Extension Standards

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> View extensions provide a controlled, type-safe mechanism for adding custom components to predefined extension slots within journey views. Extension slots are empty by default and serve exclusively for adding content—never for modifying or removing existing journey components. Product Owner approval via RFF process is required for each new extension slot.

### Rules

**MUST DO ✅**

1. Define extension context types using `Pick<>` to limit exposed data to necessary fields only
2. Export both `Component` and `Context` types in journey's public API (`src/index.ts`)
3. Get Product Owner approval via RFF process before creating new extension slots
4. Use `*ngIf="extensionComponent"` to prevent rendering when extension not provided
5. Handle undefined context with optional chaining (`context?.field`) in templates
6. Create one directive per extension slot extending `ViewExtensionDirective<Context>`
7. Document extension slots in journey README with context properties and usage examples

**MUST NOT ❌**

1. Export `InjectionToken` or extensions config interface in public API (internal only)
2. Add default content to extension slots—slots must be empty by default
3. Modify or remove existing journey components via extensions (only add content)
4. Use `any` types—maintain strict TypeScript type safety throughout
5. Access journey internals beyond the provided context object
6. Use `innerHTML` with untrusted `additions` data (XSS risk)
7. Create extension slots without PO approval via RFF process

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| extension type, context, component, definition | [Pattern 1: Extension Type Definition](#pattern-1-extension-type-definition) |
| render, template, directive, slot | [Pattern 2: Extension Slot Rendering](#pattern-2-extension-slot-rendering) |
| implement, app-side, configure, consume | [Pattern 3: App-Side Implementation](#pattern-3-app-side-implementation) |
| multiple, conditional, advanced | [Pattern 4: Advanced Extension Patterns](#pattern-4-advanced-extension-patterns) |

---

### Pattern 1: Extension Type Definition

**Use when:** Creating a new extension slot in a journey library

**Don't use when:** You need to modify existing journey content (use full view replacement instead)

✅ **Good**

```typescript
// CONTEXT: Defining extension types in journey library
// RULE: Use Pick<> to expose only necessary fields, export types in public API

// File: <journey>/src/lib/extensions/transaction-details-extension.ts
import { ViewExtensionComponent } from '@backbase/ui-ang/view-extensions';
import { TransactionItem } from '../models';

// Context exposes only necessary subset of data
export type TransactionDetailsExtensionContext = Pick<TransactionItem, 
  'additions' | 'amount' | 'description'
>;

// Component type for type-safe implementation
export type TransactionDetailsExtensionComponent = ViewExtensionComponent<TransactionDetailsExtensionContext>;

// File: <journey>/src/lib/extensions/config.ts (internal, NOT exported)
import { InjectionToken, Type } from '@angular/core';

export interface JourneyExtensionsConfig {
  transactionDetails?: Type<TransactionDetailsExtensionComponent>;
}

export const JOURNEY_EXTENSIONS_CONFIG = new InjectionToken<JourneyExtensionsConfig>(
  'JOURNEY_EXTENSIONS_CONFIG'
);

// File: <journey>/src/index.ts (public API)
export {
  TransactionDetailsExtensionComponent,
  TransactionDetailsExtensionContext,
} from './lib/extensions';
// Do NOT export InjectionToken or config interface
```

❌ **Bad**

```typescript
// PROBLEM: Exporting internal InjectionToken and exposing all data model fields

// File: <journey>/src/index.ts
export {
  TransactionDetailsExtensionComponent,
  TransactionDetailsExtensionContext,
  JOURNEY_EXTENSIONS_CONFIG,  // ❌ Internal token exposed
  JourneyExtensionsConfig,    // ❌ Internal config exposed
} from './lib/extensions';

// File: <journey>/src/lib/extensions/transaction-details-extension.ts
// ❌ Exposing entire data model instead of necessary subset
export type TransactionDetailsExtensionContext = TransactionItem;
```

**Why it's wrong:** Exporting the `InjectionToken` bypasses the type-safe `forRoot()` configuration. Exposing the entire data model creates tight coupling—any internal field change becomes a breaking change.

**Verify:**
- [ ] Context type uses `Pick<>` or explicit interface limiting fields
- [ ] Only `Component` and `Context` types exported in `src/index.ts`
- [ ] `InjectionToken` and config interface remain internal

---

### Pattern 2: Extension Slot Rendering

**Use when:** Rendering an extension slot in a journey view template

**Don't use when:** Adding default content to extension slot (slots must be empty by default)

✅ **Good**

```typescript
// CONTEXT: Parent component rendering extension slot in journey
// RULE: Use ngIf guard, type-safe directive, and async pipe with fallback

// File: <journey>/src/lib/components/transaction-details/transaction-details.component.ts
import { Component, Inject, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  TransactionDetailsExtensionComponent, 
  TransactionDetailsExtensionContext,
  JourneyExtensionsConfig,
  JOURNEY_EXTENSIONS_CONFIG 
} from '../../extensions';

@Component({
  selector: 'bb-transaction-details',
  templateUrl: './transaction-details.component.html',
})
export class TransactionDetailsComponent {
  public extensionComponent?: Type<TransactionDetailsExtensionComponent>;
  
  public extensionContext$: Observable<TransactionDetailsExtensionContext> = this.data$.pipe(
    map(data => ({
      additions: data.additions,
      amount: data.amount,
      description: data.description,
    }))
  );
  
  constructor(
    @Inject(JOURNEY_EXTENSIONS_CONFIG) extensionsConfig: JourneyExtensionsConfig,
  ) {
    this.extensionComponent = extensionsConfig.transactionDetails;
  }
}

// Directive: one per extension slot
@Directive({ selector: '[bbTransactionDetailsExtension]' })
export class TransactionDetailsExtensionDirective 
  extends ViewExtensionDirective<TransactionDetailsExtensionContext> {}
```

```html
<!-- File: transaction-details.component.html -->
<!-- RULE: Extension slot with ngIf guard and proper async handling -->

<div class="transaction-details">
  <!-- Existing journey content -->
  <h2>{{ transaction.description }}</h2>
  
  <!-- Extension slot: empty by default, renders only if extension provided -->
  <ng-container
    *ngIf="extensionComponent"
    bbTransactionDetailsExtension
    [componentType]="extensionComponent"
    [context]="(extensionContext$ | async) || undefined">
  </ng-container>
  
  <!-- More existing content -->
</div>
```

❌ **Bad**

```html
<!-- PROBLEM: Missing ngIf guard, wrong async handling, default content -->

<div class="transaction-details">
  <!-- ❌ No ngIf guard - will error when extension not provided -->
  <ng-container
    bbTransactionDetailsExtension
    [componentType]="extensionComponent"
    [context]="extensionContext$ | async">
  </ng-container>
  
  <!-- ❌ Default content in extension slot -->
  <div *ngIf="!extensionComponent" class="default-extension">
    Default extension content here
  </div>
</div>
```

**Why it's wrong:** Without `*ngIf` guard, the directive throws when `componentType` is undefined. Extension slots must never have default content—this complicates ownership and documentation.

**Verify:**
- [ ] `*ngIf="extensionComponent"` guards the `ng-container`
- [ ] Context uses `(observable$ | async) || undefined` pattern
- [ ] No default content in extension slot
- [ ] Directive selector matches the directive definition

---

### Pattern 3: App-Side Implementation

**Use when:** Creating an extension component in your application to plug into a journey

**Don't use when:** You need access to journey internal services or data not in context

✅ **Good**

```typescript
// CONTEXT: Application implementing a journey extension
// RULE: Implement journey's exported type, use optional chaining for context

// File: apps/retail-app/src/app/transactions/print-button.component.ts
import { Component, Input } from '@angular/core';
import { 
  TransactionDetailsExtensionComponent, 
  TransactionDetailsExtensionContext 
} from '@backbase/transactions-journey';

@Component({
  selector: 'app-transaction-print-button',
  template: `
    <button 
      *ngIf="context?.additions?.['printEnabled']"
      (click)="onPrint()"
      class="print-button">
      Print: {{ context?.description }}
    </button>
  `,
})
export class TransactionPrintButtonComponent implements TransactionDetailsExtensionComponent {
  @Input() context: TransactionDetailsExtensionContext | undefined;
  
  onPrint(): void {
    if (this.context) {
      window.print();
    }
  }
}

// File: apps/retail-app/src/app/transactions/transactions-bundle.module.ts
@NgModule({
  declarations: [TransactionPrintButtonComponent],
  imports: [
    TransactionsJourneyModule.forRoot({
      extensionSlots: {
        transactionDetails: TransactionPrintButtonComponent,
      },
    }),
  ],
})
export class TransactionsBundleModule {}
```

❌ **Bad**

```typescript
// PROBLEM: Using any types, not implementing interface, unsafe access

// ❌ No type implementation
@Component({
  selector: 'app-transaction-print-button',
  template: `
    <!-- ❌ No null checks, will throw on undefined -->
    <button (click)="onPrint()">
      Print: {{ context.description }}
    </button>
  `,
})
export class TransactionPrintButtonComponent {
  // ❌ Using 'any' - loses all type safety
  @Input() context: any;
  
  onPrint(): void {
    // ❌ Using innerHTML with additions (XSS risk)
    document.body.innerHTML += this.context.additions['customHtml'];
  }
}

// ❌ Wrong key name - won't match journey config
JourneyModule.forRoot({
  extensionSlots: {
    wrongSlotName: TransactionPrintButtonComponent,
  },
})
```

**Why it's wrong:** Using `any` defeats type safety—context changes won't cause compile errors. Missing optional chaining causes runtime crashes. Using `innerHTML` with untrusted `additions` creates XSS vulnerabilities.

**Verify:**
- [ ] Component `implements` journey's exported component type
- [ ] Context type is `ExtensionContext | undefined`
- [ ] Template uses optional chaining: `context?.field`
- [ ] `extensionSlots` key matches journey's config interface

---

### Pattern 4: Advanced Extension Patterns

**Use when:** Implementing multiple extensions per journey or conditional rendering logic

**Don't use when:** Simple single extension scenarios where basic pattern suffices

✅ **Good**

```typescript
// CONTEXT: Multiple extensions and conditional rendering
// RULE: Configure multiple slots, use computed properties for conditions

// Multiple extensions in forRoot()
JourneyModule.forRoot({
  extensionSlots: {
    headerExtension: CustomHeaderComponent,
    footerExtension: CustomFooterComponent,
    // sidebarExtension not provided - slot remains empty
  },
})

// Conditional rendering in extension component
@Component({
  selector: 'app-conditional-extension',
  template: `
    <div *ngIf="shouldRender" class="extension-content">
      <span>{{ formattedData }}</span>
    </div>
  `,
})
export class ConditionalExtensionComponent implements ExtensionComponent {
  @Input() context: ExtensionContext | undefined;
  
  get shouldRender(): boolean {
    return !!this.context?.additions?.['featureEnabled'];
  }
  
  get formattedData(): string {
    if (!this.context?.additions) return '';
    return this.transformData(this.context.additions['rawField']);
  }
  
  private transformData(raw: unknown): string {
    // Transform logic here
    return String(raw ?? '');
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: Heavy computation in template, direct DOM manipulation

@Component({
  selector: 'app-bad-extension',
  template: `
    <!-- ❌ Heavy computation directly in template -->
    <div *ngFor="let item of context?.additions?.['items'] | complexTransformPipe">
      {{ calculateExpensiveValue(item) }}
    </div>
  `,
})
export class BadExtensionComponent implements ExtensionComponent {
  @Input() context: ExtensionContext | undefined;
  
  // ❌ Called on every change detection cycle
  calculateExpensiveValue(item: any): string {
    return expensiveOperation(item);
  }
  
  ngOnInit(): void {
    // ❌ Direct DOM manipulation
    document.querySelector('.journey-header')?.classList.add('custom-style');
  }
}
```

**Why it's wrong:** Template expressions run on every change detection—expensive computations cause performance issues. Direct DOM manipulation breaks encapsulation and may break on journey updates.

**Verify:**
- [ ] Computed values use getters or memoization, not template methods
- [ ] Component uses `OnPush` change detection when possible
- [ ] No direct DOM manipulation outside component's own template
- [ ] Unused extension slots are simply not configured (not set to `null`)

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `VEX-001` | Extension types exported in public API | 🔴 BLOCKER | `grep -L "export.*ExtensionContext" src/index.ts` |
| `VEX-002` | InjectionToken not in public API | 🔴 BLOCKER | `grep "export.*InjectionToken\|export.*EXTENSIONS_CONFIG" src/index.ts` |
| `VEX-003` | Extension slot has ngIf guard | 🔴 BLOCKER | `grep -B1 "bbExtension\|componentType.*extension" *.html \| grep -v "ngIf"` |
| `VEX-004` | Context uses optional chaining | 🟡 WARNING | `grep "context\.[^?]" *.html` (should use `context?.`) |
| `VEX-005` | No innerHTML with additions | 🔴 BLOCKER | `grep "innerHTML.*additions\|additions.*innerHTML" *.ts *.html` |
| `VEX-006` | Context type uses Pick or limited interface | 🟡 WARNING | Manual review of extension type definitions |
| `VEX-007` | Directive extends ViewExtensionDirective | 🔴 BLOCKER | `grep "extends ViewExtensionDirective" *.ts` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `VEX-R01` | Context exposes only necessary fields (not entire data model) | 🔴 BLOCKER |
| `VEX-R02` | Extension slot has PO approval via RFF process | 🔴 BLOCKER |
| `VEX-R03` | Extension slot documented in journey README | 🔴 BLOCKER |
| `VEX-R04` | No default content in extension slot | 🔴 BLOCKER |
| `VEX-R05` | Extension component handles undefined context gracefully | 🟡 WARNING |
| `VEX-R06` | Component uses OnPush change detection if applicable | 🟡 WARNING |
| `VEX-R07` | Additions data sanitized before rendering | 🔴 BLOCKER |
| `VEX-R08` | Extension does not break journey layout | 🟡 WARNING |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Parent component renders with extension provided | Unit | ✅ Yes |
| Parent component renders without extension (slot empty) | Unit | ✅ Yes |
| Extension component handles undefined context | Unit | ✅ Yes |
| Extension component handles context with/without additions | Unit | ✅ Yes |
| Extension renders correctly in journey | Integration | ✅ Yes |
| Extension directive imported in test declarations | Unit | ✅ Yes |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Customers need to add custom fields/controls without forking source code. Full view replacement is too heavyweight for minor additions, creating maintenance burden and breaking upgradability.

### Business Drivers

- Extend journeys without modifying source
- View replacement heavyweight for minor additions
- Fast custom field additions (not weeks-long projects)

### Technical Constraints

- Full TypeScript type safety required
- Cannot expose journey internals
- Journey functional without extensions provided

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Type-safe extension slots: empty by default, add-only (never modify/remove existing content). Export `Context` and `Component` types in public API. PO approval required for new slots via RFF process.

### Rationale

| Choice | Why |
|--------|-----|
| Type-safe API | Compile-time checking, breaking changes caught at build |
| Empty by default | Clear ownership, no default content ambiguity |
| Context with Pick<> | Limited coupling, journey can refactor internals |
| PO approval | Prevents template Swiss cheese, ensures valuable slots only |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Journey Extension Types | CREATE | `<journey>/src/lib/extensions/*.ts` |
| Journey Public API | MODIFY | `<journey>/src/index.ts` |
| Journey Module | MODIFY | `<journey>/src/lib/*.module.ts` |
| Journey View Components | MODIFY | `<journey>/src/lib/components/**/*.ts` |
| Journey View Templates | MODIFY | `<journey>/src/lib/components/**/*.html` |
| Extension Directives | CREATE | `<journey>/src/lib/components/**/*-extension.directive.ts` |
| App Extension Components | CREATE | `apps/<app>/src/app/**/*-extension.component.ts` |
| App Bundle Modules | MODIFY | `apps/<app>/src/app/**/*-bundle.module.ts` |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-007: Journey Configuration Standards | Related to - extensions use `forRoot()` pattern |

### Migration Notes

N/A - new standard. Extensions are additive and optional. Existing journeys and applications continue to work without changes.

---

## 7. Examples

### Complete Example

<!-- 
NOTE: For extension type definitions, slot rendering, and app-side implementation,
see Patterns 1-3 above. This example shows file organization only.
-->

**Scenario:** Print button extension for transaction details

**File Organization:**

```
libs/transactions-journey/
├── src/
│   ├── lib/extensions/
│   │   ├── transaction-details-extension.ts  # Context + Component types (Pattern 1)
│   │   └── config.ts                         # InjectionToken (internal, NOT exported)
│   ├── index.ts                              # Export ONLY types, not token
│   └── transactions.module.ts                # forRoot() with extensionSlots
│
apps/retail-app/
└── src/app/transactions/
    ├── print-button.component.ts             # implements ExtensionComponent (Pattern 3)
    └── transactions-bundle.module.ts         # forRoot({ extensionSlots: {...} })
```

**Key Integration Points:**

| Step | File | Code |
|------|------|------|
| 1. Export types | `index.ts` | `export { Context, Component }` (NOT token) |
| 2. Implement | `print-button.component.ts` | `@Input() context: Context \| undefined` |
| 3. Configure | `bundle.module.ts` | `forRoot({ extensionSlots: { slotName: Component } })` |

### Common Mistakes

**Mistake 1: Exporting InjectionToken in Public API**

```typescript
// ❌ Wrong - exposes internal implementation
// File: src/index.ts
export { EXTENSIONS_CONFIG } from './lib/extensions';

// ✅ Fix - only export types
// File: src/index.ts
export { ExtensionComponent, ExtensionContext } from './lib/extensions';
// InjectionToken stays internal in ./lib/extensions/config.ts
```

**Mistake 2: Missing ngIf Guard on Extension Slot**

```html
<!-- ❌ Wrong - throws error when extension not provided -->
<ng-container
  bbExtension
  [componentType]="extensionComponent"
  [context]="context">
</ng-container>

<!-- ✅ Fix - guard with ngIf -->
<ng-container
  *ngIf="extensionComponent"
  bbExtension
  [componentType]="extensionComponent"
  [context]="(context$ | async) || undefined">
</ng-container>
```

**Mistake 3: Using `any` Type for Context**

```typescript
// ❌ Wrong - loses type safety, won't catch breaking changes
@Input() context: any;

// ✅ Fix - use journey's exported type
@Input() context: TransactionDetailsExtensionContext | undefined;
```

---

## 8. References

- [Angular Dependency Injection](https://angular.io/guide/dependency-injection) — Core pattern for extension configuration
- [Angular Dynamic Component Loader](https://angular.io/guide/dynamic-component-loader) — Conceptual foundation for extension rendering
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) — Type-safe extension component pattern
- [@backbase/ui-ang View Extensions](https://community.backbase.com/documentation/Retail-Apps/latest/view_extensions) — `ViewExtensionComponent`, `ViewExtensionDirective` base classes
- [RFF Process (Jira)](https://backbase.atlassian.net/jira/software/c/projects/RFF/boards/1631) — Approval workflow for extension requests
- [Angular Style Guide](https://angular.io/guide/styleguide) — Component and directive naming conventions
- [Semantic Versioning 2.0.0](https://semver.org/) — Extension context types follow semver for breaking changes

---
