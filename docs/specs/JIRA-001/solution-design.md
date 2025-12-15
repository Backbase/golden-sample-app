# Solution Design: JIRA-001

**Agent:** architect  
**Mode:** CREATE  
**Date:** 2025-12-15  
**Status:** APPROVED

---

## 1. Context

**Ticket:** JIRA-001 - View Transactions by Account  
**Summary:** Add an account selector dropdown to the transactions page that filters transactions by the selected account. First account auto-selected on load, URL updated with selection.

---

## 2. Current State

### Existing Files

| File | Current State |
|------|---------------|
| `transactions-view.component.ts` | Has `accountId$` from query params, `accountName$` derived from arrangements, filtering logic in `transactions$` |
| `transactions-view.component.html` | Shows badge when account filter active, but no dropdown selector |
| `transactions-view.module.ts` | Imports for current functionality |
| `ArrangementsService` | Already provides `arrangements$` observable with all accounts |

### Data Flow (Current)

```
URL ?account=123 → accountId$ → filter transactions$ → display
                 ↓
                 accountName$ → show badge
```

### What We Can Reuse

1. `ArrangementsService.arrangements$` — already fetches all accounts
2. `accountId$` stream — already reads from query params
3. Filtering logic in `transactions$` — already filters by `arrangementId`
4. Badge display pattern — shows current filter

---

## 3. Approach

### Data Flow (New)

```
                    ┌─────────────────────┐
                    │  ArrangementsService │
                    │    arrangements$     │
                    └──────────┬──────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────┐
│              TransactionsViewComponent                    │
│                                                          │
│  accounts$ ────────────────► bb-account-selector-ui      │
│                                     │                    │
│  selectedAccount$ ◄────────────────(change)              │
│       │                                                  │
│       ▼                                                  │
│  router.navigate(?account=id) ──► accountId$             │
│                                        │                 │
│                                        ▼                 │
│                              transactions$ (filtered)    │
└──────────────────────────────────────────────────────────┘
```

### Why This Approach

1. **Minimal change surface** — Extends existing component rather than creating new ones
2. **URL-driven state** — Selection persists in URL, enabling bookmarks/sharing
3. **Reactive pattern** — Selection flows through observables, compatible with OnPush
4. **Reuses existing service** — No new data fetching required

---

## 4. Data

### API Endpoints

| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| `/productsummary/context/arrangements` | GET | (via `ArrangementsService`) | `ProductSummaryItem[]` |

Already implemented — no changes needed.

### Interfaces

**Existing (reuse):**

```typescript
// From @backbase/arrangement-manager-http-ang
interface ProductSummaryItem {
  id: string;
  name?: string;
  BBAN?: string;
  IBAN?: string;
  // ... other fields
}
```

**New (none required)** — `bb-account-selector-ui` accepts `ProductSummaryItem[]` directly.

### State Management

| State | Location | Notes |
|-------|----------|-------|
| Selected account ID | URL query param `?account=` | Source of truth |
| Available accounts | `ArrangementsService.arrangements$` | Shared, cached |
| Filtered transactions | Component `transactions$` | Derived |

---

## 5. Changes

### Files to Modify

| File | Change | ADR Compliance |
|------|--------|----------------|
| `transactions-view.component.ts` | Add `accounts$`, `selectedAccount$`, `onAccountSelect()`, auto-select first on load | ADR-000 (OnPush, types), ADR-006 (smart component) |
| `transactions-view.component.html` | Add `bb-account-selector-ui` above search, add empty state | ADR-001 (a11y), ADR-003 (i18n) |
| `transactions-view.module.ts` | Import `AccountSelectorModule` from `@backbase/ui-ang/account-selector` | — |
| `transactions-view.component.spec.ts` | Add tests for account selection flow | ADR-013 (AAA, mocks) |

### New Dependencies

| Package | Import Path | Already in Project? |
|---------|-------------|---------------------|
| `AccountSelectorModule` | `@backbase/ui-ang/account-selector` | ✅ Yes (used in other journeys) |

---

## 6. Edge Cases

| Scenario | Handling |
|----------|----------|
| **No accounts returned** | Show empty account selector (disabled state) |
| **Selected account has 0 transactions** | Show "No transactions found for this account" message with i18n |
| **Invalid account ID in URL** | Fall back to first account |
| **User removes account filter** | Clear URL param, show all transactions |
| **Loading state** | Show loading indicator while accounts load |

---

## 7. Testing Strategy

### Unit Tests (Component)

| Scenario | Type | File |
|----------|------|------|
| Should display account selector with accounts from service | Unit | `transactions-view.component.spec.ts` |
| Should auto-select first account on load when no query param | Unit | `transactions-view.component.spec.ts` |
| Should update URL when account selected | Unit | `transactions-view.component.spec.ts` |
| Should filter transactions by selected account | Unit | `transactions-view.component.spec.ts` |
| Should show empty state when no transactions for account | Unit | `transactions-view.component.spec.ts` |

### Accessibility Tests

| Check | Tool |
|-------|------|
| Account selector keyboard navigation | Manual + axe-core |
| ARIA labels present | axe-core in unit test |
| Focus management on selection | Manual |

### Test Setup Notes

- Mock `ArrangementsService.arrangements$` with test accounts
- Mock `Router.navigate` to verify URL updates
- Use `fakeAsync`/`tick` for async operations

---

## 8. Out of Scope

- ❌ Creating new API endpoints
- ❌ Modifying `ArrangementsService`
- ❌ Adding pagination to account list
- ❌ Multi-account selection
- ❌ Persisting selection to localStorage
- ❌ Adding EntitlementsGuard (already present if needed, but not in current routes)

---

## ADR Compliance Checklist

| ADR | Requirement | How Addressed |
|-----|-------------|---------------|
| ADR-000 | OnPush change detection | Component already uses OnPush via async pipe pattern |
| ADR-000 | Subscription cleanup | Using async pipe (no manual subscriptions) |
| ADR-000 | Type safety | No `any` types; use `ProductSummaryItem` |
| ADR-001 | Keyboard operability | `bb-account-selector-ui` handles internally |
| ADR-001 | ARIA labels | Add `ariaLabelledby` to selector, i18n label |
| ADR-003 | Translation IDs | Add i18n markers with `meaning|description@@id` format |
| ADR-006 | Design system components | Using `bb-account-selector-ui` from `@backbase/ui-ang` |
| ADR-006 | Smart/dumb separation | Component is smart (fetches data), passes to dumb UI |
| ADR-013 | 80% coverage | Add comprehensive unit tests |
| ADR-013 | AAA pattern | All tests follow Arrange-Act-Assert |

---

## Self-Check

- [x] All selected ADRs addressed
- [x] No scope creep beyond ticket
- [x] Edge cases documented
- [x] Changes list complete
- [x] UI component APIs verified against existing usage
- [x] Testing strategy defined

---

**Confidence:** HIGH

⛔ **Ready for approval.** Proceed to execution plan?

