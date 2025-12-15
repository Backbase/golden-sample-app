# Task Specification: JIRA-001

**Agent:** Product  
**Mode:** CREATE  
**Status:** APPROVED

---

## 1. Summary

Add an account selector dropdown to the transactions page that allows users to filter transactions by selecting a specific account. The first account is selected by default, and the transaction list updates dynamically based on selection.

## 2. User Story

**As a** banking customer  
**I want to** view and filter my transactions by selecting different accounts from a dropdown  
**So that** I can see all transactions related to a specific account

## 3. Acceptance Criteria

| AC | Description | Testable? |
|----|-------------|-----------|
| AC-1 | The transactions page displays an account selector dropdown above the search filter | ✅ |
| AC-2 | The account selector displays all accounts returned from the arrangements API endpoint | ✅ |
| AC-3 | Each account in the dropdown displays its name and account number (default component display) | ✅ |
| AC-4 | When a user selects an account from the dropdown, the account selector displays the selected account name | ✅ |
| AC-5 | When the transactions page loads, the first account is selected by default | ✅ |
| AC-6 | When the transactions page loads, it displays transactions for the default (first) account | ✅ |
| AC-7 | When a user selects a different account, the transaction list updates to show only transactions for the selected account | ✅ |
| AC-8 | All displayed transactions belong to the currently selected account (filtered by arrangementId) | ✅ |
| AC-9 | Each transaction displays: recipient name, date, amount with currency, account number | ✅ |

## 4. Selected ADRs

| ADR | Requirement | Why Applicable |
|-----|-------------|----------------|
| ADR-001: Accessibility | Keyboard operability, ARIA roles, focus management for dropdown | Account selector is interactive UI |
| ADR-003: i18n | Translation IDs for labels, placeholders | User-facing text needs localization |
| ADR-004: Responsiveness | Works at 360px-1920px+, 44px touch targets | Must work on mobile and desktop |
| ADR-005: Performance | Server-side pagination consideration | Transaction list may exceed 50 items |
| ADR-006: Design System | Use `@backbase/ui-ang` components, OnPush | Must use `bb-account-selector-ui` |
| ADR-011: Entitlements | Route protection with EntitlementsGuard | Triplet: `Transactions.Transactions.view` |
| ADR-013: Testing | 80% coverage, AAA pattern, mock HTTP | All new code requires tests |

## 5. Repo Context

### Similar Implementations
- **Account Selector (Payment):** `libs/journey-bundles/custom-payment/src/lib/components/initiator/initiator.component.ts`
- **Account Selector (ACH):** `libs/ach-positive-pay-journey/internal/ui/src/lib/components/ach-positive-pay-rule-form/ach-positive-pay-rule-form.component.html`
- **Transactions View:** `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`

### APIs
- **Arrangements:** `ArrangementsService.arrangements$` via `ProductSummaryHttpService`
- **Transactions:** `TransactionsHttpService.transactions$` (already filters by arrangementId)

### Reusable Types
- `ProductSummaryItem` from `@backbase/arrangement-manager-http-ang`
- `TransactionItem` from `@backbase/transactions-http-ang`

### UI Component API (Verified)
```typescript
<bb-account-selector-ui
  [items]="accounts"
  [markFirst]="true"
  placeholder="Select an account"
  (change)="onAccountSelect($any($event))"
></bb-account-selector-ui>
```

## 6. Clarifications

| Question | Answer |
|----------|--------|
| Q1: Default account selection | First account from API response (index 0) |
| Q2: Account selector placement | Above the search filter (before `bb-text-filter`) |
| Q3: Date format | Keep current format (`'MMM. d'`) — no modification needed |
| Q4: Account number display | Use default `bb-account-selector-ui` display |
| Q5: Entitlements triplet | `Transactions.Transactions.view` (confirmed) |
| Q6: Filter badge behavior | Replace badge pattern entirely with account selector |

## 7. Out of Scope

- Modifying transaction item display (date format stays as-is)
- Multi-account selection
- Persisting account selection to localStorage
- Server-side pagination (existing behavior maintained)
- E2E tests (separate task)

---

## Self-Check
- [x] All ACs testable
- [x] No ambiguous terms
- [x] ADRs mapped
- **Confidence:** HIGH

