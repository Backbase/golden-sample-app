# JIRA-001: Solution Design

## View Transactions by Account

---

## 1. Context

- **Ticket:** JIRA-001
- **Summary:** Add account selector dropdown to transactions view, allowing users to filter transactions by selecting an account. First account is selected by default.

---

## 2. Current State

### Existing Files

| File | Purpose |
|------|---------|
| `transactions-view.component.ts` | Main view component with transaction list |
| `transactions-view.component.html` | Template showing search filter, badge filter, transaction list |
| `transactions-view.module.ts` | Module importing dependencies |
| `transactions-journey-shell.module.ts` | Journey shell with route definitions |
| `ArrangementsService` | Service providing `arrangements$` observable |

### Existing Behavior

- `accountId$` reads from URL query param `?account=<id>`
- `accountName$` resolves account name from ID
- `transactions$` filters by `accountId` if present
- Badge shows when filtered, with "Remove filter" option

### What We Can Reuse

- `ArrangementsService.arrangements$` - already fetches accounts
- Query param sync pattern - already implemented
- `bb-account-selector-ui` from `@backbase/ui-ang`

---

## 3. Approach

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TransactionsViewComponent                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ArrangementsService.arrangements$                               │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐     (change)      ┌──────────────────┐     │
│  │ bb-account-     │ ─────────────────▶│ onAccountChange()│     │
│  │ selector-ui     │                   │ → router.navigate│     │
│  │ [items]         │                   │   ?account=id    │     │
│  │ [markFirst]=true│                   └──────────────────┘     │
│  └─────────────────┘                            │               │
│                                                 ▼               │
│                                    ┌────────────────────┐       │
│                                    │ accountId$ (from   │       │
│                                    │ queryParamMap)     │       │
│                                    └────────────────────┘       │
│                                                 │               │
│                                                 ▼               │
│                                    ┌────────────────────┐       │
│                                    │ transactions$      │       │
│                                    │ .filter(accountId) │       │
│                                    └────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Approach

1. **Reuses existing query param pattern** - maintains deep linking capability
2. **No new state management** - leverages existing observables
3. **Follows existing patterns** - consistent with `initiator.component.ts`
4. **Minimal changes** - only 4 files modified

---

## 4. Data

### API Endpoints

| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| `/productsummary/context/arrangements` | GET | — | `ProductSummaryItem[]` |
| `/transactions` | POST | `{ arrangementsIds }` | `TransactionItem[]` |

### Interfaces (Existing - No Changes)

```typescript
// From @backbase/arrangement-manager-http-ang
interface ProductSummaryItem {
  id: string;
  name?: string;
  bankAlias?: string;
  BBAN?: string;
  // ... other fields
}
```

### Data Location

| Data | Location |
|------|----------|
| Accounts list | `ArrangementsService.arrangements$` (existing) |
| Selected account ID | URL query param `?account=<id>` |
| Transactions | `TransactionsHttpService.transactions$` (existing) |

---

## 5. Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `transactions-view.component.ts` | MODIFY | Add `onAccountChange()` method, add `accounts$` property |
| `transactions-view.component.html` | MODIFY | Add `bb-account-selector-ui` with label, i18n, aria attributes |
| `transactions-view.module.ts` | MODIFY | Import `AccountSelectorModule` from `@backbase/ui-ang/account-selector` |
| `transactions-journey-shell.module.ts` | MODIFY | Add `EntitlementsGuard` to parent route with `Transactions.Transactions.view` |
| `transactions-view.component.spec.ts` | MODIFY | Add tests for account selector functionality |

### New Dependencies

```typescript
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
```

---

## 6. Edge Cases

| Scenario | Handling |
|----------|----------|
| **No accounts returned** | Dropdown shows empty; transactions list empty |
| **Single account** | Dropdown still visible; account auto-selected |
| **Account in URL not found** | Falls back to first account |
| **No transactions for account** | Empty list displayed (existing behavior) |
| **API error loading accounts** | Handled by existing error handling in ArrangementsService |
| **User lacks entitlements** | Redirected to `/error/403` by EntitlementsGuard |

---

## 7. Testing Strategy

### Unit Tests to Add

| Scenario | Type | File |
|----------|------|------|
| Account selector renders with accounts | Unit | `transactions-view.component.spec.ts` |
| Selecting account navigates with query param | Unit | `transactions-view.component.spec.ts` |
| First account selected by default (markFirst) | Unit | `transactions-view.component.spec.ts` |
| Transactions filtered by selected account | Unit | `transactions-view.component.spec.ts` |
| Accessibility: aria-labelledby set correctly | Unit | `transactions-view.component.spec.ts` |

### Existing Tests

- Transaction list rendering (existing)
- Search filter functionality (existing)

---

## 8. ADR Compliance

| ADR | Compliance Approach |
|-----|---------------------|
| **ADR-000: Common Angular Patterns** | Use `async` pipe for subscriptions; existing component already uses OnPush pattern implicitly through observables |
| **ADR-001: Accessibility** | Add `aria-labelledby` to selector; use native `label` element with `for`/`id` |
| **ADR-003: i18n** | Add `i18n` attribute to label with format `@@transactions.account-selector.label` |
| **ADR-006: Design System** | Use `bb-account-selector-ui` from `@backbase/ui-ang`; component receives data via observable |
| **ADR-011: Entitlements** | Add `EntitlementsGuard` to route with `Transactions.Transactions.view` triplet |
| **ADR-013: Testing** | AAA pattern; mock `ArrangementsService`; 80%+ coverage target |

---

## 9. Out of Scope

- ❌ "All Accounts" option (explicitly excluded per disambiguation)
- ❌ Account grouping or categorization
- ❌ Remembering last selected account (uses URL param)
- ❌ Custom account display format (uses component default)
- ❌ Loading states for account selector (accounts load with page)

---

## Self-Check

- [x] All selected ADRs addressed
- [x] No scope creep beyond ticket
- [x] Edge cases documented
- [x] Changes list complete
- [x] UI component APIs verified against existing usage

---

