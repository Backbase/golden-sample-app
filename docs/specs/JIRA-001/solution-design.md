# Solution Design: JIRA-001

| Ticket | JIRA-001: View Transactions by Account |
|--------|----------------------------------------|
| Status | APPROVED |
| Task | `docs/specs/JIRA-001/task.md` |
| Date | 2024-12-16 |

---

## 1. Approach

**Summary:** Add an account selector dropdown (`bb-account-selector-ui`) to the transactions page that filters transactions by selected account. Selection persists via URL query param `?account=<id>`. First account auto-selected on load via `markFirst=true`.

**ADR Compliance:**

| ADR | How Satisfied |
|-----|---------------|
| ADR-001 (A11y) | Use `bb-account-selector-ui` with built-in keyboard/ARIA support; add `aria-label` via i18n attribute |
| ADR-003 (i18n) | Add `i18n` attribute to label, `i18n-placeholder` for placeholder text |
| ADR-004 (Responsiveness) | Component is responsive by default; add mobile-first margin/padding via SCSS |
| ADR-005 (Performance) | No additional API calls; reuse existing `ArrangementsService.arrangements$` cached observable |
| ADR-006 (Design System) | Use `bb-account-selector-ui` from `@backbase/ui-ang/account-selector`; component has OnPush by default |
| ADR-011 (Entitlements) | Add `EntitlementsGuard` to route with triplet `Transactions.Transactions.view` |
| ADR-013 (Testing) | Add unit tests with AAA pattern; target 80% coverage for new code |

---

## 2. Design

### 2.1 Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    TransactionsViewComponent                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │  bb-account-selector-ui                             │    │
│  │  [items]="accounts$ | async"                        │    │
│  │  [markFirst]="true"                                 │    │
│  │  (change)="onAccountSelected($event)"               │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│                            ▼ updates query param             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  bb-text-filter (existing search)                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│                            ▼ filters by arrangementId        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Transaction List (existing)                        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
Page Load → ArrangementsService.arrangements$ → accounts$ displayed in selector
         → markFirst=true auto-selects first account → triggers (change) event
         → onAccountSelected() → Router updates ?account=<id>
         → accountId$ reacts → transactions$ filtered by arrangementId
```

### 2.3 State

| State | Location | Why |
|-------|----------|-----|
| Selected Account ID | URL query param `?account=<id>` | Enables deep linking, shareable URLs, matches existing pattern |
| Accounts List | `ArrangementsService.arrangements$` | Already cached via `shareReplay()`, no duplication |
| Filtered Transactions | Component `transactions$` | Derived from `accountId$` + service, reactive updates |

---

## 3. Interfaces

### API (existing, no changes)

```
GET /api/arrangement-manager/client-api/v2/productsummary/context/arrangements
Response: ProductSummaryItem[]
```

### TypeScript

```typescript
// No new interfaces needed
// bb-account-selector-ui accepts ProductSummaryItem[] directly via [items]
// Existing ProductSummaryItem from ArrangementsService is compatible
```

### Component I/O

| Type | Name | Type | Purpose |
|------|------|------|---------|
| Property | accounts$ | Observable<ProductSummaryItem[]> | Accounts for dropdown from ArrangementsService |
| Property | selectedAccount$ | Observable<ProductSummaryItem> | Currently selected account for binding |
| Method | onAccountSelected | (account: ProductSummaryItem) => void | Handles selection, updates URL |

---

## 4. Changes

### Create

*None — all changes are modifications to existing files*

### Modify

| File | Change |
|------|--------|
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts` | Add `accounts$`, `selectedAccount$` observables; add `onAccountSelected()` method |
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.html` | Add `bb-account-selector-ui` above search filter; remove filter badge |
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts` | Import `AccountSelectorModule` from `@backbase/ui-ang/account-selector` |
| `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.spec.ts` | Add tests for account selector rendering, selection, filtering |
| `libs/transactions-journey/src/lib/transactions-journey-shell.module.ts` | Add `EntitlementsGuard` to route with `Transactions.Transactions.view` triplet |

---

## 5. Edge Cases

| Scenario | User Sees | Implementation |
|----------|-----------|----------------|
| Loading | Selector shows loading spinner | `bb-account-selector-ui` handles loading state internally |
| Empty accounts | Selector shows placeholder, no transactions | Check `accounts.length === 0`, show empty state message |
| Error loading accounts | Error handled by ArrangementsService | Let existing error handling propagate; selector shows placeholder |
| Invalid account ID in URL | First account selected | Fallback: `accounts.find(a => a.id === accountId) ?? accounts[0]` |
| Single account | Selector with one item, auto-selected | Same behavior as multiple; `markFirst=true` handles selection |

---

## 6. Tests

| Unit | Key Scenarios |
|------|---------------|
| TransactionsViewComponent | `should render account selector with accounts from service` |
| TransactionsViewComponent | `should select first account by default when no query param` |
| TransactionsViewComponent | `should navigate to query param when account selected` |
| TransactionsViewComponent | `should filter transactions by selected account` |
| TransactionsViewComponent | `should update selection when query param changes externally` |

---

## 7. Open Questions

| Question | Owner |
|----------|-------|
| *Empty* | — |

*Empty = ready for approval*

---

## Out of Scope

- Modifying transaction item display (date format stays as-is)
- Multi-account selection
- Persisting selection to localStorage
- Server-side pagination changes
- E2E test implementation (separate task)
- Account selector styling customization

---

## Approval

- [x] Design implements all ACs from task.md §3
- [x] ADR compliance documented for each ADR in task.md §4
- [x] Edge cases cover loading, empty, error

**Approved by:** _Engineer_ **Date:** _2024-12-16_
