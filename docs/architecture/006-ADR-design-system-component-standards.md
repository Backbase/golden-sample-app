# ADR-006: Design System and Component Library Standards

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> Backbase maintains a unified design system (`@backbase/ui-ang`) for shared components, with each capability team publishing their own capability-specific component library. All components must follow strict quality gates including 80%+ test coverage, accessibility compliance, and mandatory code review by component owners. Third-party dependencies must be approved by Frontend Guild and exposed as peer dependencies.

### Rules

**MUST DO ✅**

1. Use `@backbase/ui-ang` components as building blocks for capability-specific components
2. Maintain 80%+ unit test coverage for all components
3. Get component owner approval before merging PRs to component libraries
4. Expose third-party dependencies as peer dependencies (not bundled)
5. Use `OnPush` change detection strategy for presentational components
6. Document all public `@Input()` and `@Output()` properties with JSDoc
7. Include accessibility tests (axe-core) for all component variations

**MUST NOT ❌**

1. Create direct DBS service connections in presentational/dumb components
2. Depend on other capability UI libraries (no cross-capability dependencies)
3. Bundle or hide third-party vendor libraries
4. Add third-party dependencies without Frontend Guild approval
5. Introduce breaking changes without major version bump
6. Skip visual regression tests for UI changes
7. Use `any` type in component public APIs

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

<!-- 
Cross-references: 
- Subscription cleanup (takeUntil): See ADR-000 Pattern 1
- OnPush change detection: See ADR-000 Pattern 2
- Type safety (no 'any'): See ADR-000 Pattern 3
-->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| smart, dumb, presentational, container | [Pattern 1: Smart/Dumb Component Separation](#pattern-1-smartdumb-component-separation) |
| capability, library, design system, composition | [Pattern 2: Capability Component Composition](#pattern-2-capability-component-composition) |
| third-party, dependency, peer, external | [Pattern 3: Third-Party Dependency Management](#pattern-3-third-party-dependency-management) |
| rxjs, subscription, observable, cleanup | [Pattern 4: Observable Subscription Management](#pattern-4-observable-subscription-management) |
| input, output, api, documentation | [Pattern 5: Component API Design](#pattern-5-component-api-design) |

---

### Pattern 1: Smart/Dumb Component Separation

**Use when:** Building any component that could potentially be reused or needs clear separation between data and presentation

**Don't use when:** Building one-off page layouts or route components that only orchestrate other components

✅ **Good**

```typescript
// CONTEXT: Capability-specific transaction list component
// RULE: Presentational components don't inject services (except utility services)

@Component({
  selector: 'bb-transaction-list',
  template: `
    <bb-empty-state *ngIf="transactions.length === 0" [message]="emptyMessage"></bb-empty-state>
    <ul *ngFor="let tx of transactions; trackBy: trackById">
      <bb-transaction-item [transaction]="tx" (select)="onSelect.emit(tx)"></bb-transaction-item>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent {
  /** List of transactions to display */
  @Input() transactions: Transaction[] = [];
  
  /** Message shown when no transactions exist */
  @Input() emptyMessage = 'No transactions found';
  
  /** Emits when user selects a transaction */
  @Output() onSelect = new EventEmitter<Transaction>();

  trackById(index: number, tx: Transaction): string {
    return tx.id;
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: Presentational component directly injects and uses DBS service

@Component({
  selector: 'bb-transaction-list',
  template: `<ul *ngFor="let tx of transactions$ | async">...</ul>`
})
export class TransactionListComponent implements OnInit {
  transactions$: Observable<Transaction[]>;

  constructor(private transactionService: TransactionService) {} // ❌ Service injection

  ngOnInit() {
    this.transactions$ = this.transactionService.getTransactions(); // ❌ Direct service call
  }
}
```

**Why it's wrong:** Presentational components with service dependencies cannot be reused across different data sources, make testing harder (require service mocking), and break the smart/dumb separation pattern that enables flexible composition.

**Verify:**
- [ ] Component constructor only has utility services (Router, i18n, etc.)
- [ ] All data comes through `@Input()` properties
- [ ] All actions emit through `@Output()` events
- [ ] Uses `OnPush` change detection strategy

---

### Pattern 2: Capability Component Composition

**Use when:** Building capability-specific UI that combines design system components

**Don't use when:** The component would be useful across multiple capabilities (should go to `@backbase/ui-ang`)

✅ **Good**

```typescript
// CONTEXT: Retail-specific account summary card
// RULE: Capability components compose design system components, no cross-capability deps

import { ButtonModule, CardModule, IconModule } from '@backbase/ui-ang';

@Component({
  selector: 'retail-account-summary',
  template: `
    <bb-card>
      <bb-card-header>
        <bb-icon [name]="accountIcon"></bb-icon>
        <span>{{ account.name }}</span>
      </bb-card-header>
      <bb-card-body>
        <span class="balance">{{ account.balance | currency }}</span>
      </bb-card-body>
      <bb-card-footer>
        <bb-button (click)="viewDetails.emit()">View Details</bb-button>
      </bb-card-footer>
    </bb-card>
  `
})
export class RetailAccountSummaryComponent {
  @Input() account: RetailAccount;
  @Output() viewDetails = new EventEmitter<void>();
  
  get accountIcon(): string {
    return this.account.type === 'savings' ? 'piggy-bank' : 'wallet';
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: Capability component imports from another capability library

import { BusinessAccountCardModule } from '@business/ui-lib'; // ❌ Cross-capability import
import { CardModule } from '@backbase/ui-ang';

@Component({
  selector: 'retail-account-summary',
  template: `
    <business-account-card [account]="account"></business-account-card> <!-- ❌ -->
  `
})
export class RetailAccountSummaryComponent {
  @Input() account: RetailAccount;
}
```

**Why it's wrong:** Cross-capability dependencies create tight coupling between capability teams, prevent independent releases, and lead to version conflicts. If a component is needed by multiple capabilities, it should be promoted to `@backbase/ui-ang`.

**Verify:**
- [ ] Only imports from `@backbase/ui-ang` for design system components
- [ ] No imports from other capability libraries (`@business/*`, `@wealth/*`, etc.)
- [ ] Component is purely presentational (no DBS service calls)
- [ ] Composes design system components rather than duplicating them

---

### Pattern 3: Third-Party Dependency Management

**Use when:** Adding external libraries for specialized functionality (charts, date pickers, etc.)

**Don't use when:** Functionality can be achieved with existing design system components

✅ **Good**

```json
// CONTEXT: package.json for a component library using Chart.js
// RULE: Third-party libraries exposed as peer dependencies

{
  "name": "@backbase/charts-widget",
  "peerDependencies": {
    "chart.js": "^4.0.0",
    "@angular/core": "^15.0.0"
  },
  "devDependencies": {
    "chart.js": "^4.4.0"
  }
}
```

```typescript
// CONTEXT: Component using approved third-party library
// RULE: Frontend Guild approved, peer dependency exposed

import { Chart } from 'chart.js'; // ✅ Direct import, customer knows about it

@Component({
  selector: 'bb-analytics-chart',
  template: '<canvas #chartCanvas></canvas>'
})
export class AnalyticsChartComponent {
  @ViewChild('chartCanvas') canvas: ElementRef<HTMLCanvasElement>;
  @Input() data: ChartData;
}
```

❌ **Bad**

```json
// PROBLEM: Third-party library hidden as regular dependency

{
  "name": "@backbase/charts-widget",
  "dependencies": {
    "chart.js": "^4.0.0"  // ❌ Bundled, hidden from customer
  }
}
```

```typescript
// PROBLEM: Library wrapped/abstracted hiding the dependency

// internal/chart-wrapper.ts - ❌ Abstraction layer hiding vendor
export class ChartWrapper {
  private chart: any; // ❌ Hides Chart.js completely
  
  render(data: unknown) {
    this.chart = new (require('chart.js').Chart)(/*...*/);
  }
}
```

**Why it's wrong:** Hiding dependencies prevents customers from understanding their application's dependency tree, causes hidden version conflicts, and blocks customers from upgrading libraries independently. Customers should use third-party libraries directly in their code.

**Verify:**
- [ ] Third-party library approved by Frontend Guild before implementation
- [ ] Library added to `peerDependencies` in package.json
- [ ] No abstraction layer hiding the library from consumers
- [ ] Documentation mentions the external dependency requirement

---

### Pattern 4: Observable Subscription Management

<!-- See ADR-000 Pattern 1: Subscription Cleanup (takeUntil) for complete pattern -->

**Rule:** Smart components must clean up subscriptions. Use `takeUntil(destroy$)` or prefer `async` pipe.

**Key Points:**
- **Use when:** Smart/container components subscribe to observables
- **Don't use when:** Dumb components—prefer `@Input()` over observables
- **Prefer:** `async` pipe in templates over manual subscription
- **Avoid:** Nested `.subscribe()` calls (use RxJS operators instead)

For full code examples and the `takeUntil` pattern, see **ADR-000 Pattern 1: Subscription Cleanup**.

---

### Pattern 5: Component API Design

**Use when:** Creating any component with inputs and outputs

**Don't use when:** Internal helper classes that are not part of public API

✅ **Good**

```typescript
// CONTEXT: Reusable pagination component
// RULE: All inputs/outputs typed and documented, no 'any'

@Component({
  selector: 'bb-pagination',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  /**
   * Current page number (1-indexed)
   * @default 1
   */
  @Input() currentPage = 1;
  
  /**
   * Total number of items across all pages
   */
  @Input() totalItems: number;
  
  /**
   * Number of items displayed per page
   * @default 10
   */
  @Input() pageSize = 10;
  
  /**
   * Emits when user navigates to a different page
   * @emits PageChangeEvent with newPage and previousPage
   */
  @Output() pageChange = new EventEmitter<PageChangeEvent>();
  
  /**
   * Calculated total pages based on totalItems and pageSize
   */
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}

export interface PageChangeEvent {
  newPage: number;
  previousPage: number;
}
```

❌ **Bad**

```typescript
// PROBLEM: No types, no documentation, using 'any'

@Component({
  selector: 'bb-pagination',
  template: `...`
})
export class PaginationComponent {
  @Input() page; // ❌ No type
  @Input() total: any; // ❌ Using any
  @Input() size; // ❌ No default, no type
  @Output() change = new EventEmitter(); // ❌ No generic type, vague name
}
```

**Why it's wrong:** Untyped and undocumented APIs make components difficult to use correctly, impossible to validate at compile time, and provide poor developer experience. Customers cannot understand component capabilities without reading source code.

**Verify:**
- [ ] All `@Input()` have explicit types (no implicit `any`)
- [ ] All `@Input()` have JSDoc descriptions
- [ ] All `@Output()` use typed `EventEmitter<T>`
- [ ] Output events have descriptive names (onSelect, pageChange, not just "change")

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `DS-001` | No `any` type in component inputs/outputs | 🔴 BLOCKER | `grep -r "@Input().*: any" --include="*.ts"` |
| `DS-002` | Components use OnPush change detection | 🟡 WARNING | `grep -rL "ChangeDetectionStrategy.OnPush" --include="*.component.ts"` |
| `DS-003` | No cross-capability imports | 🔴 BLOCKER | `grep -r "from '@retail\|@business\|@wealth'" libs/*/internal` |
| `DS-004` | TrackBy function in ngFor | 🟡 WARNING | `grep -r "\*ngFor" --include="*.html" \| grep -v "trackBy"` |
| `DS-005` | Test coverage threshold | 🔴 BLOCKER | Jest coverage report < 80% |
| `DS-006` | No direct DOM manipulation | 🟡 WARNING | `grep -r "document\.\|getElementById\|querySelector" --include="*.ts"` |
| `DS-007` | Third-party in peerDependencies | 🔴 BLOCKER | Check package.json dependencies vs peerDependencies |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `DS-R01` | Component owner approved PR | 🔴 BLOCKER |
| `DS-R02` | Presentational components have no DBS service injections | 🔴 BLOCKER |
| `DS-R03` | New third-party dependencies approved by Frontend Guild | 🔴 BLOCKER |
| `DS-R04` | Breaking changes include migration guide | 🔴 BLOCKER |
| `DS-R05` | Visual changes approved by designer | 🔴 BLOCKER |
| `DS-R06` | API documentation updated for public interfaces | 🟡 WARNING |
| `DS-R07` | Changelog updated with JIRA ticket reference | 🟡 WARNING |
| `DS-R08` | Uses design system components instead of custom implementations | 🟡 WARNING |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| All component inputs/outputs combinations | Unit | ✅ Yes |
| Accessibility for all component states | Unit (axe-core) | ✅ Yes |
| Visual regression for UI components | Visual | ✅ Yes |
| Service mocking in smart components | Unit | ✅ Yes |
| Async operations with fakeAsync | Unit | ✅ Yes |
| Error states and edge cases | Unit | ✅ Yes |
| Manual cross-browser testing | Manual | ⚪ Optional |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Teams duplicate common components, leading to inconsistent UI/UX. Component ownership unclear, causing stale components. Third-party library management inconsistent (bundled vs peer dependencies).

### Business Drivers

- Consistent UI/UX across banking products
- Component reuse reduces maintenance burden
- Customers need public APIs for custom widgets

### Technical Constraints

- Angular version compatibility required
- Third-party deps must be peer dependencies
- 80% test coverage enforced

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Unified design system (`@backbase/ui-ang`) for shared components. Capability-specific libraries for domain components. Component owner approval required for PRs. Third-party deps as peer dependencies (Frontend Guild approved).

### Rationale

| Choice | Why |
|--------|-----|
| Unified design system | Prevents duplication, ensures UI consistency |
| Capability libraries | Unblocks teams, clear escalation path to design system |
| Ownership model | Eliminates orphaned components, ensures quality reviews |
| Peer dependencies | Transparent deps, no hidden version conflicts |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Design System Library | MODIFY | `libs/ui-ang/**/*` |
| Capability UI Libraries | CREATE/MODIFY | `libs/{capability}-ui/**/*` |
| Widget Implementations | MODIFY | `libs/*-widget/**/*.component.ts` |
| Journey Bundles | MODIFY | `libs/journey-bundles/**/*` |
| Package Configuration | MODIFY | `**/package.json` |
| Test Configuration | MODIFY | `**/jest.config.ts` |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-001: Accessibility Standards | Depends on: Components must follow a11y patterns |
| ADR-013: Unit/Integration Testing Standards | Depends on: Testing requirements |
| ADR-004: Responsiveness Standards | Related to: Component responsive behavior |

### Migration Notes

For existing components not following these standards:

1. **Identify ownership:** Map components to owning teams based on usage and contribution history
2. **Add missing tests:** Increase coverage to 80% minimum, add axe-core accessibility tests
3. **Fix service injections:** Refactor presentational components to use inputs/outputs only
4. **Update peer dependencies:** Move third-party libraries from dependencies to peerDependencies
5. **Add documentation:** Add JSDoc comments to all public inputs and outputs

---

## 7. Examples

### Complete Example

**Scenario:** Creating a capability-specific component that composes design system components

```typescript
// File: libs/retail-ui/src/lib/account-card/account-card.component.ts

import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CardModule, ButtonModule, IconModule, BadgeModule } from '@backbase/ui-ang';

/**
 * Displays a retail banking account with balance and quick actions.
 * 
 * @example
 * <retail-account-card 
 *   [account]="savingsAccount"
 *   (viewTransactions)="onViewTransactions($event)">
 * </retail-account-card>
 */
@Component({
  selector: 'retail-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountCardComponent {
  /**
   * The retail account to display
   */
  @Input() account: RetailAccount;
  
  /**
   * Whether to show the quick actions footer
   * @default true
   */
  @Input() showActions = true;
  
  /**
   * Emits when user clicks view transactions button
   */
  @Output() viewTransactions = new EventEmitter<RetailAccount>();
  
  /**
   * Emits when user clicks transfer button
   */
  @Output() initiateTransfer = new EventEmitter<RetailAccount>();
  
  /**
   * Returns appropriate icon based on account type
   */
  get accountIcon(): string {
    switch (this.account.type) {
      case 'savings': return 'piggy-bank';
      case 'checking': return 'wallet';
      case 'credit': return 'credit-card';
      default: return 'bank';
    }
  }
  
  /**
   * Returns badge color based on account status
   */
  get statusBadgeColor(): string {
    return this.account.status === 'active' ? 'success' : 'warning';
  }
}

export interface RetailAccount {
  id: string;
  name: string;
  type: 'savings' | 'checking' | 'credit';
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'closed';
}
```

```html
<!-- File: libs/retail-ui/src/lib/account-card/account-card.component.html -->

<bb-card class="retail-account-card">
  <bb-card-header>
    <bb-icon [name]="accountIcon" size="lg"></bb-icon>
    <div class="account-info">
      <h3 class="account-name">{{ account.name }}</h3>
      <bb-badge [color]="statusBadgeColor">{{ account.status }}</bb-badge>
    </div>
  </bb-card-header>
  
  <bb-card-body>
    <span class="balance" aria-label="Account balance">
      {{ account.balance | currency:account.currency }}
    </span>
  </bb-card-body>
  
  <bb-card-footer *ngIf="showActions">
    <bb-button 
      variant="secondary" 
      (click)="viewTransactions.emit(account)"
      aria-label="View transactions for {{ account.name }}">
      Transactions
    </bb-button>
    <bb-button 
      variant="primary" 
      (click)="initiateTransfer.emit(account)"
      aria-label="Transfer from {{ account.name }}">
      Transfer
    </bb-button>
  </bb-card-footer>
</bb-card>
```

### Common Mistakes

**Mistake 1: Service injection in presentational component**

```typescript
// ❌ Wrong
@Component({ selector: 'retail-account-card' })
export class AccountCardComponent {
  @Input() accountId: string;
  account$: Observable<Account>;
  
  constructor(private accountService: AccountService) {
    this.account$ = this.accountService.getAccount(this.accountId);
  }
}

// ✅ Fix
@Component({ selector: 'retail-account-card' })
export class AccountCardComponent {
  @Input() account: Account; // Data passed in, not fetched
}
```

**Mistake 2: Cross-capability import**

```typescript
// ❌ Wrong
import { BusinessAccountBadge } from '@business/ui-lib';

@Component({ selector: 'retail-account-card' })
export class AccountCardComponent {
  // Uses component from another capability
}

// ✅ Fix
import { BadgeModule } from '@backbase/ui-ang';

@Component({ selector: 'retail-account-card' })
export class AccountCardComponent {
  // Uses shared design system component
}
```

**Mistake 3: Hidden third-party dependency**

```json
// ❌ Wrong - package.json
{
  "dependencies": {
    "chart.js": "^4.0.0"
  }
}

// ✅ Fix - package.json
{
  "peerDependencies": {
    "chart.js": "^4.0.0"
  },
  "devDependencies": {
    "chart.js": "^4.0.0"
  }
}
```

---

## 8. References

- [Frontend Guild Decision](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/1838973010) — Component library structure
- [Contribution Rules](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/2020934329) — PR requirements
- [Ownership Model](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/2019264332) — Component ownership
- [Release Process](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/2020967202) — ui-ang releases
- [MAINT Process](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/2041774628) — Issue handling
- [Angular Style Guide](https://angular.io/guide/styleguide) — Official Angular coding standards
- [Angular Component API](https://angular.io/api/core/Component) — Component API reference
- [RxJS Best Practices](https://rxjs.dev/guide/overview) — Observable patterns
- [Semantic Versioning](https://semver.org/) — Version numbering standard
- [Conventional Commits](https://www.conventionalcommits.org/) — Commit message standard
- [NPM Peer Dependencies](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies) — Peer dependency specification
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa) — Accessibility standard
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict) — Type safety
- [Jest Testing Framework](https://jestjs.io/docs/getting-started) — Unit testing

---
