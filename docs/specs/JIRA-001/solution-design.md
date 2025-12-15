# Solution Design: JIRA-001

**Agent:** Architect  
**Mode:** CREATE  
**Status:** DRAFT

---

## 1. Context

- **Ticket:** JIRA-001 - View Transactions by Account
- **Summary:** Add an account selector dropdown to the transactions page that filters transactions by the selected account. First account is selected by default.
- **Selected ADRs:** ADR-001 (A11y), ADR-003 (i18n), ADR-004 (Responsiveness), ADR-005 (Performance), ADR-006 (Design System), ADR-011 (Entitlements), ADR-013 (Testing)

## 2. Current State

### Existing Components
- `TransactionsViewComponent` — displays transaction list with search filter
- `ArrangementsService` — provides `arrangements$` observable with all accounts
- `TransactionsHttpService` — provides `transactions$` observable
- Current filtering: reads `account` query param, filters transactions by `arrangementId`
- Current UI: shows "filtered by: [account] ✕" badge when filtering

### Reusable Patterns
- `bb-account-selector-ui` usage in `initiator.component.ts` with `[items]`, `[markFirst]`, `(change)`
- i18n pattern in `ach-positive-pay-rule-form.component.html` for labels/placeholders
- Query param handling already exists in `TransactionsViewComponent`

### Technical Constraints
- Must use `@backbase/ui-ang` components (ADR-006)
- Must include i18n markers (ADR-003)
- Must support 360px-1920px viewports (ADR-004)
- Must have 80% test coverage (ADR-013)

## 3. Approach

### 3.1 High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                    TransactionsViewComponent                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │  bb-account-selector-ui                             │    │
│  │  [items]="accounts$ | async"                        │    │
│  │  (change)="onAccountSelected($event)"               │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│                            ▼ updates query param             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  bb-text-filter (existing)                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│                            ▼ filters by arrangementId        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Transaction List (existing)                        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

Data Flow:
1. Component loads → ArrangementsService.arrangements$ → accounts displayed in selector
2. First account auto-selected (markFirst=true) → triggers (change) event
3. onAccountSelected() → updates URL query param ?account=<id>
4. accountId$ observable reacts → transactions$ filtered by arrangementId
```

### 3.2 Rationale
- **URL Query Param:** Enables deep linking and matches existing pattern
- **markFirst=true:** Ensures first account is selected on load (satisfies AC-5)
- **Reactive Flow:** Uses existing `accountId$` observable, minimal changes

### 3.3 ADR Compliance

| ADR | Requirement | How Addressed |
|-----|-------------|---------------|
| ADR-001 | Keyboard operability, ARIA | `bb-account-selector-ui` provides built-in a11y; add `aria-label` via i18n |
| ADR-003 | Translation IDs | Add `i18n` for label, `i18n-placeholder` for placeholder |
| ADR-004 | Mobile-first, 360px min | Component is responsive; add margin/padding via mobile-first SCSS |
| ADR-005 | Performance | No additional API calls; reuses `ArrangementsService.arrangements$` |
| ADR-006 | Design system, OnPush | Uses `bb-account-selector-ui`; component already has default CD |
| ADR-011 | EntitlementsGuard | Add guard to route with triplet `Transactions.Transactions.view` |
| ADR-013 | 80% coverage, AAA | Tests for: selector rendering, selection changes, filtering |

## 4. Data Model

### 4.1 API Contracts

**Arrangements (existing):**
```typescript
// GET /api/arrangement-manager/client-api/v2/productsummary/context/arrangements
// Already used by ArrangementsService
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

```typescript
// No new interfaces needed - reuse existing types
// bb-account-selector-ui accepts ProductSummaryItem[] directly
// May need to map to AccountSelectorItem format if component requires specific shape
```

### 4.3 State Management

| State | Location | Update Pattern |
|-------|----------|----------------|
| Selected Account ID | URL query param `?account=<id>` | Router navigation with `queryParamsHandling: 'merge'` |
| Accounts List | `ArrangementsService.arrangements$` | Cached via `shareReplay()` (existing) |
| Filtered Transactions | `transactions$` in component | Derived from `accountId$` + `transactionsService.transactions$` |

## 5. Component Design

| Component | Responsibility | Inputs | Outputs |
|-----------|---------------|--------|---------|
| `TransactionsViewComponent` | Orchestrates account selection and transaction display | - | - |
| `bb-account-selector-ui` | Displays account dropdown | `[items]`, `[markFirst]`, `placeholder` | `(change)` |

**Component Changes:**

```typescript
// TransactionsViewComponent additions:

// New: Observable for accounts formatted for selector
public accounts$ = this.arrangementsService.arrangements$;

// New: Currently selected account (for two-way binding)
public selectedAccount$ = combineLatest({
  accountId: this.accountId$,
  accounts: this.accounts$
}).pipe(
  map(({ accountId, accounts }) => 
    accounts.find(a => a.id === accountId) ?? accounts[0]
  )
);

// New: Handle account selection
onAccountSelected(account: ProductSummaryItem): void {
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { account: account.id },
    queryParamsHandling: 'merge'
  });
}
```

## 6. Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts` | MODIFY | Add `accounts$`, `selectedAccount$`, `onAccountSelected()` method |
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.html` | MODIFY | Add `bb-account-selector-ui` above search filter; remove filter badge |
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts` | MODIFY | Import `AccountSelectorModule` from `@backbase/ui-ang/account-selector` |
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.spec.ts` | MODIFY | Add tests for account selector behavior |
| `libs/transactions-journey/src/lib/transactions-journey-shell.module.ts` | MODIFY | Add `EntitlementsGuard` to route with `Transactions.Transactions.view` triplet |

## 7. Edge Cases

| Scenario | Handling |
|----------|----------|
| **Loading** | Show loading indicator while `accounts$` resolves (selector handles internally) |
| **Empty accounts** | Selector shows placeholder; no transactions displayed |
| **Error loading accounts** | Let existing error handling in ArrangementsService propagate |
| **Invalid account ID in URL** | Default to first account (handled by `?? accounts[0]` fallback) |
| **Single account** | Selector still shown with one item; auto-selected |

## 8. Testing Strategy

### Unit Tests
- `should render account selector with accounts from service`
- `should select first account by default when no query param`
- `should navigate to query param when account selected`
- `should filter transactions by selected account`
- `should update selection when query param changes`

### Integration Tests
- Account selector + transaction list filtering flow

### E2E Tests (out of scope for this ticket)
- Full flow from account selection to transaction display

## 9. Out of Scope

- Modifying transaction item display (date format stays as-is)
- Multi-account selection
- Persisting selection to localStorage
- Server-side pagination changes
- E2E test implementation (separate task)
- Account selector styling customization

---

## Self-Check
- [x] All selected ADRs addressed (see 3.3)
- [x] No scope creep beyond ticket
- [x] Edge cases documented
- [x] Changes list complete
- [x] UI component bindings verified against existing usage

