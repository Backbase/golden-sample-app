# JIRA-001: Solution Design

## 1. Context

- **Ticket:** [docs/JIRA-001.md](../../JIRA-001.md)
- **Summary:** Add account selector dropdown to transactions page allowing users to filter transactions by account, with default selection of first account on page load.

## 2. Current State

### What exists today:
- `TransactionsViewComponent` at `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/`
- Already has `accountId$` observable from URL query params (`?account=<id>`)
- Already filters transactions by `arrangementId` when `accountId` is present
- Shows badge with account name when filtered, with ability to remove filter
- `ArrangementsService` fetches accounts from API
- `TransactionsHttpService` fetches transactions

### What can we reuse/reference:
- `libs/journey-bundles/custom-payment/src/lib/components/initiator/` - AccountSelector usage pattern
- `libs/ach-positive-pay-journey/internal/ui/src/lib/components/ach-positive-pay-rules/` - Empty state pattern
- `@backbase/ui-ang/account-selector` - AccountSelectorModule
- `@backbase/ui-ang/empty-state` - EmptyStateModule

## 3. Approach

### Data Flow
```
Page Load
    ↓
ArrangementsService.arrangements$ → accounts$
    ↓
Default to first account (accounts[0].id)
    ↓
Update URL: ?account=<firstAccountId>
    ↓
accountId$ emits → transactions$ filters by arrangementId
    ↓
Display filtered transactions (or empty state if none)
```

### Why this approach:
- **URL-driven state:** Maintains current pattern of using query params for account selection (enables bookmarking, back/forward navigation)
- **Reactive streams:** Uses existing Observable patterns, no additional state management needed
- **Minimal changes:** Extends existing component rather than creating new ones

## 4. Data

### API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/arrangement-manager/client-api/v2/productsummary/context/arrangements` | GET | Fetch accounts (already implemented) |
| `/transaction-manager/client-api/v2/transactions` | POST | Fetch transactions (already implemented) |

### New/Modified Interfaces
No new interfaces needed. Use existing:
- `ProductSummaryItem` from `@backbase/arrangement-manager-http-ang`
- `TransactionItem` from `@backbase/transactions-http-ang`

### Where data lives
- Account selection: URL query param (`?account=<id>`)
- Accounts list: `ArrangementsService.arrangements$` (cached with `shareReplay`)
- Transactions: `TransactionsHttpService.transactions$` (cached with `shareReplay`)

## 5. Changes

| File | Change |
|------|--------|
| `transactions-view.component.ts` | Add `accounts$` observable mapping to selector format; Add `selectedAccount$`; Add `onAccountSelected()` method; Set default account on init |
| `transactions-view.component.html` | Add `bb-account-selector-ui` above transaction list; Add empty state template |
| `transactions-view.module.ts` | Import `AccountSelectorModule`, `EmptyStateModule` |

### New Dependencies
- `AccountSelectorModule` from `@backbase/ui-ang/account-selector`
- `EmptyStateModule` from `@backbase/ui-ang/empty-state`

## 6. Edge Cases

| Scenario | Handling |
|----------|----------|
| **Loading accounts** | Show loading indicator (existing pattern) |
| **No accounts returned** | AccountSelector will be empty; unlikely scenario for authenticated user |
| **Selected account has no transactions** | Show empty state: "No transactions" |
| **Account in URL doesn't exist** | Fall back to first account |
| **API error fetching accounts** | Let existing error handling propagate |
| **API error fetching transactions** | Let existing error handling propagate |

## 7. Testing Strategy

### Key Scenarios to Cover
1. **Account selector displays all accounts** - Verify dropdown shows accounts from API
2. **Default account selection** - Verify first account selected on page load
3. **Account selection updates transactions** - Verify selecting account filters transaction list
4. **Empty state** - Verify "no transactions" shown when account has none
5. **URL persistence** - Verify account selection updates URL query param

### Test Setup Notes
- Mock `ArrangementsService.arrangements$` with test accounts
- Mock `TransactionsHttpService.transactions$` with test transactions
- Use `RouterTestingModule` for query param testing

## 8. Out of Scope

- ❌ Changes to transaction item display (recipient, date, amount format)
- ❌ Changes to transaction details view
- ❌ Pagination of transactions
- ❌ Multiple account selection
- ❌ Persisting selection to backend/user preferences
- ❌ Account search/filtering within dropdown

