# Solution Design: JIRA-001

**Agent:** architect  
**Mode:** CREATE  
**Status:** APPROVED

---

## 1. Context

- **Ticket:** JIRA-001 - View Transactions by Account
- **Summary:** Add account selector dropdown to transactions page that allows users to filter transactions by selecting different accounts
- **Selected ADRs:** ADR-000, ADR-001, ADR-003, ADR-004, ADR-005, ADR-006, ADR-011, ADR-013

---

## 2. Current State

### Existing Components
- `TransactionsViewComponent` - already has account filtering via `?account=` query param
- `ArrangementsService` - provides `arrangements$` observable with all accounts
- `TransactionsHttpService` - provides `transactions$` observable
- Badge showing current filter with "remove" functionality

### What's Missing
- Account selector dropdown UI for selecting accounts
- Auto-selection of first account on page load (when no account in URL)
- `EntitlementsGuard` on the route

### Reusable Patterns (from repo context)
- `bb-account-selector-ui` usage in `libs/journey-bundles/custom-payment/src/lib/components/initiator/initiator.component.ts`
- i18n pattern in `libs/ach-positive-pay-journey/internal/ui/src/lib/components/ach-positive-pay-rule-form/`

---

## 3. Approach

### 3.1 High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                    TransactionsViewComponent                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          bb-account-selector-ui                      │   │
│  │  [items]="accounts$"                                 │   │
│  │  [selectedAccount]="selectedAccount$"                │   │
│  │  (change)="onAccountSelected($event)"                │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Router.navigate([], { queryParams: { account: id }})│   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  transactions$ (filtered by accountId$)              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. On component init, load accounts from `ArrangementsService`
2. If no `?account=` in URL, navigate to first account's ID
3. Account selector displays all accounts with name + BBAN/IBAN
4. On selection, update URL with `?account={id}`
5. `transactions$` observable reacts to URL change and filters

### 3.2 Rationale

- **URL-driven state:** Maintains existing pattern, supports deep-linking, browser back/forward
- **Minimal changes:** Leverages existing filtering logic in `transactions$`
- **Design system compliance:** Uses standard `bb-account-selector-ui` component

### 3.3 ADR Compliance

| ADR | Requirement | How Addressed |
|-----|-------------|---------------|
| ADR-000 | OnPush, takeUntil, no `any` | Add OnPush, use async pipe (no manual subscriptions needed) |
| ADR-001 | Keyboard accessible, labels | `bb-account-selector-ui` provides built-in a11y, add `ariaLabelledby` |
| ADR-003 | i18n markers | Add `i18n` attribute to label, `i18n-placeholder` to selector |
| ADR-004 | Mobile-first, 360px support | Selector is responsive by default, add mobile-first SCSS if needed |
| ADR-005 | No perf issues | Client-side filtering (data already loaded), no new HTTP calls on switch |
| ADR-006 | Use design system | `bb-account-selector-ui` from `@backbase/ui-ang` |
| ADR-011 | Route protection | Add `EntitlementsGuard` with `Transactions.Transactions.view` |
| ADR-013 | 80% coverage, AAA | Unit tests for new functionality |

---

## 4. Data Model

### 4.1 API Contracts

**Arrangements API** (already in use):
```typescript
// GET /productsummary/context/arrangements
// Response: ProductSummaryItem[]
interface ProductSummaryItem {
  id: string;
  name: string;
  BBAN?: string;
  IBAN?: string;
  bankAlias?: string;
  // ... other fields
}
```

### 4.2 Interfaces

**Account selector item mapping** (transform for UI component):
```typescript
// Map ProductSummaryItem to account selector format
interface AccountSelectorItem {
  id: string;
  name: string;
  number: string;  // BBAN or IBAN fallback
}
```

### 4.3 State Management

| State | Location | Update Mechanism |
|-------|----------|------------------|
| Selected account ID | URL query param `?account=` | `Router.navigate()` |
| Accounts list | `ArrangementsService.arrangements$` | Observable (cached) |
| Filtered transactions | Component `transactions$` | Reactive (combineLatest) |

---

## 5. Component Design

| Component | Responsibility | Inputs | Outputs |
|-----------|---------------|--------|---------|
| `TransactionsViewComponent` | Smart container, orchestrates data | Route params | Account selection via Router |
| `bb-account-selector-ui` | Dumb dropdown (design system) | `items`, `selectedItem` | `(change)` event |

**New Component Properties:**

```typescript
// In TransactionsViewComponent:

/** Accounts mapped for selector UI */
accounts$: Observable<AccountSelectorItem[]>;

/** Currently selected account for selector binding */
selectedAccount$: Observable<ProductSummaryItem | undefined>;

/** Handle account selection from dropdown */
onAccountSelected(account: AccountSelectorItem): void;
```

---

## 6. Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts` | MODIFY | Add `accounts$`, `selectedAccount$`, `onAccountSelected()`, OnPush, auto-select first account |
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.html` | MODIFY | Add account selector UI with i18n labels |
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts` | MODIFY | Import `AccountSelectorModule` |
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.spec.ts` | MODIFY | Add tests for account selector functionality |
| `libs/transactions-journey/src/lib/transactions-journey-shell.module.ts` | MODIFY | Add `EntitlementsGuard` to route |

---

## 7. Edge Cases

| Scenario | Handling |
|----------|----------|
| **Loading** | Show loading indicator while accounts load (existing pattern) |
| **No accounts** | Show empty state from ui-ang (`bb-empty-state-ui`) |
| **No transactions for account** | Show empty state with "No transactions" message |
| **Invalid account ID in URL** | Default to first account |
| **Single account** | Still show selector (user may have more accounts later) |

---

## 8. Testing Strategy

### Unit Tests
- `should display account selector with all accounts`
- `should select first account by default when no account in URL`
- `should update URL when account is selected`
- `should filter transactions by selected account`
- `should show empty state when no transactions for account`
- `should handle account with BBAN`
- `should fallback to IBAN when BBAN not available`

### Integration Tests
- Account selector + ArrangementsService integration

### E2E Tests
- Gherkin scenarios in existing fixture file
- Visual regression at 360px, 768px, 1200px breakpoints

---

## 9. Out of Scope

- Server-side pagination for transactions
- Multi-account selection
- Account favorites/pinning
- Transaction search within selected account (separate feature)
- Lazy loading of transactions per account (current: all loaded upfront)

---

## Self-Check

- [x] All selected ADRs addressed
- [x] No scope creep beyond ticket
- [x] Edge cases documented
- [x] Changes list complete
- [x] Existing filtering logic preserved

