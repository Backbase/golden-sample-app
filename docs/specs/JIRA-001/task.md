# Task Specification: JIRA-001

**Agent:** product  
**Mode:** CREATE  
**Status:** APPROVED

---

## 1. Summary

Add an account selector dropdown to the transactions page that allows users to filter transactions by selecting a specific account from their available accounts.

## 2. User Story

**As a** banking customer  
**I want to** view and filter my transactions by selecting different accounts from a dropdown  
**So that** I can see all transactions related to a specific account

## 3. Acceptance Criteria

| AC | Description | Testable? |
|----|-------------|-----------|
| AC-1 | The transactions page displays an account selector dropdown | ✅ |
| AC-2 | The account selector displays all accounts returned from the arrangements API endpoint | ✅ |
| AC-3 | Each account in the dropdown displays its name and account number | ✅ |
| AC-4 | When a user selects an account from the dropdown, the account selector displays the selected account name | ✅ |
| AC-5 | When the transactions page loads, it displays transactions for the default account | ✅ |
| AC-6 | When a user selects a different account, the transaction list updates to show only transactions for the selected account | ✅ |
| AC-7 | Each transaction displays: recipient name, date (Mon D, YYYY format), amount with currency, account number | ✅ |

## 4. Selected ADRs

| ADR | Key Requirement | Why Applicable |
|-----|-----------------|----------------|
| ADR-000: Common Angular Patterns | OnPush, takeUntil, type safety, no `any` | New component logic requires proper patterns |
| ADR-001: Accessibility Standards | Keyboard navigation, ARIA labels, focus management | Account selector dropdown requires a11y compliance |
| ADR-003: i18n Standards | Translation IDs with meaning\|description@@id format | "Select Account" label, empty states need translation |
| ADR-006: Design System Component Standards | Use `@backbase/ui-ang` components, smart/dumb separation | Uses `bb-account-selector-ui` from design system |
| ADR-011: Entitlements & Access Control | EntitlementsGuard, `*bbIfEntitlements` directive | Route protection for transactions view |
| ADR-013: Unit/Integration Testing Standards | 80% coverage, AAA pattern, mocked dependencies | DoD requires comprehensive test coverage |

## 5. Repo Context

### Similar Implementations

| Feature | Path | What to Reuse |
|---------|------|---------------|
| ACH Positive Pay account selector | `libs/ach-positive-pay-journey/internal/ui/src/lib/components/ach-positive-pay-rule-form/ach-positive-pay-rule-form.component.html` | i18n patterns, ARIA labeling |
| Custom Payment initiator | `libs/journey-bundles/custom-payment/src/lib/components/initiator/initiator.component.ts` | `bb-account-selector-ui` usage pattern, event handling |
| Transactions View (current) | `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts` | Existing accountId$ stream, filtering logic |

### API Contracts

| Endpoint | Service | Notes |
|----------|---------|-------|
| `/productsummary/context/arrangements` | `ArrangementsService` | Already exists, exposes `arrangements$` observable |
| Transactions API | `TransactionsHttpService` | Already filters by `arrangementId` |

### Existing Types/Interfaces

| Type | Source | Usage |
|------|--------|-------|
| `ProductSummaryItem` | `@backbase/arrangement-manager-http-ang` | Account data shape from API |
| `TransactionItem` | `@backbase/transactions-http-ang` | Transaction data shape |

### UI Component API (Verified)

**Component:** `bb-account-selector-ui`

```html
<bb-account-selector-ui
  [items]="accounts$ | async"
  [markFirst]="true"
  [dropdownPosition]="'bottom'"
  [closeOnSelect]="true"
  [filterItems]="true"
  placeholder="Select an account"
  i18n-placeholder="..."
  ariaLabelledby="account-selector-label"
  (change)="onAccountSelect($any($event))"
  (blur)="onBlur()"
></bb-account-selector-ui>
```

⚠️ **Note:** `(change)` event requires `$any($event)` for type safety.

## 6. Clarifications

| Question | Answer |
|----------|--------|
| Q1: Default account selection | First account in the list (by API order) is auto-selected on page load |
| Q2: Account selector placement | Above the search filter (top of the card body) |
| Q3: Empty state handling | Show "No transactions found for this account" message |
| Q4: Account display format | Use account name; follow default `bb-account-selector-ui` display logic |
| Q5: URL persistence | Update URL with `?account=` query param (enables bookmarking/sharing) |

## 7. Out of Scope

- Creating new API endpoints
- Modifying the arrangements service
- Adding pagination to account selector
- Caching account data beyond existing shareReplay

---

## Self-Check
- [x] All ACs testable
- [x] ADRs mapped with rationale
- [x] Repo context captured (similar implementations, APIs, types)
- [x] UI component API verified against existing usage
- Confidence: **HIGH**

