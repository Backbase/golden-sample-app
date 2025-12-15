# Task Specification: JIRA-001

**Agent:** product  
**Mode:** CREATE  
**Status:** APPROVED

---

## 1. Summary

Implement account selector dropdown on transactions page that allows users to filter transactions by selecting different accounts.

## 2. User Story

**As a** banking customer  
**I want to** view and filter my transactions by selecting different accounts from a dropdown  
**So that** I can see all transactions related to a specific account

---

## 3. Selected ADRs

| ADR | Key Requirement | Why Applicable |
|-----|-----------------|----------------|
| ADR-000: Common Angular Patterns | `takeUntilDestroyed`, OnPush, no `any` types | Component implementation requires subscription cleanup, change detection optimization |
| ADR-001: Accessibility Standards | Keyboard accessible dropdown, proper labels, ARIA | Account selector must be accessible via keyboard, screen readers |
| ADR-003: i18n Standards | i18n markers on all user-facing text | Labels like "Select Account" and transaction display text need translation |
| ADR-004: Responsiveness Standards | Mobile-first CSS, support 360px minimum | Transaction list must work across mobile/tablet/desktop breakpoints |
| ADR-005: Performance Standards | Server-side pagination if >50 transactions | Transaction lists can be large, need efficient data loading |
| ADR-006: Design System Standards | Use `bb-account-selector-ui` from ui-ang | Must use standard Backbase UI components, smart/dumb separation |
| ADR-011: Entitlements Standards | `EntitlementsGuard` on route | Route must be protected with `Transactions.Transactions.view` permission |
| ADR-013: Unit Testing Standards | 80% coverage, AAA pattern, mocked services | All new code requires comprehensive unit tests |

---

## 4. Repo Context

### Similar Implementations to Reference

| Feature | Path | What to Reuse |
|---------|------|---------------|
| **Initiator Component** | `libs/journey-bundles/custom-payment/src/lib/components/initiator/initiator.component.ts` | `bb-account-selector-ui` pattern |
| **ACH Positive Pay Form** | `libs/ach-positive-pay-journey/internal/ui/src/lib/components/ach-positive-pay-rule-form/ach-positive-pay-rule-form.component.html` | i18n pattern for account selector |
| **Transactions View** | `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts` | Current filtering, combineLatest pattern |
| **User Accounts View** | `libs/journey-bundles/user-accounts/src/lib/user-accounts-view/user-accounts-view.component.ts` | ArrangementsService usage |

### API Contracts

| Endpoint | Service |
|----------|---------|
| `/productsummary/context/arrangements` | `ArrangementsService` (already exists) |
| Transactions API | `TransactionsHttpService` (already exists) |

### Existing Types/Interfaces

| Type | Source |
|------|--------|
| `TransactionItem` | `@backbase/transactions-http-ang` |
| `ProductSummaryItem` | `@backbase/arrangement-manager-http-ang` |

### Existing Services

| Service | Path |
|---------|------|
| `ArrangementsService` | `libs/transactions-journey/internal/data-access/src/lib/services/arrangements/arrangements.service.ts` |
| `TransactionsHttpService` | `libs/transactions-journey/internal/data-access/src/lib/services/transactions-http/transactions.http.service.ts` |

### UI Components (Design System)

| Component | Package |
|-----------|---------|
| `bb-account-selector-ui` | `@backbase/ui-ang/account-selector` |
| `AccountSelectorModule` | `@backbase/ui-ang/account-selector` |

---

## 5. Clarifications

| Question | Answer |
|----------|--------|
| **Q1: Default Account** | First account in the list returned by the API |
| **Q2: Account Number Format** | BBAN if available, fallback to IBAN |
| **Q3: Empty States** | Use standard empty state from `@backbase/ui-ang` for both (no transactions, no accounts) |
| **Q4: URL Persistence** | Yes, update URL with `?account={accountId}` for deep-linking support |
| **Q5: Entitlements Triplet** | `Transactions.Transactions.view` confirmed |
| **Q6: Loading on Switch** | No loading indicator needed - client-side filtering of already-loaded transactions |

---

## 6. Out of Scope

- Server-side pagination for transactions (current implementation loads all)
- Account favorites or pinning
- Multi-account selection
- Transaction search within selected account (separate feature)

---

## 7. Acceptance Criteria (Refined)

| AC | Description | Testable |
|----|-------------|----------|
| AC-1 | Account selector dropdown displays on transactions page | ✅ |
| AC-2 | Dropdown shows all accounts from arrangements API | ✅ |
| AC-3 | Each account shows name + BBAN (or IBAN fallback) | ✅ |
| AC-4 | Selecting account updates dropdown display | ✅ |
| AC-5 | First account selected by default on page load | ✅ |
| AC-6 | Transaction list filters by selected account's `arrangementId` | ✅ |
| AC-7 | URL updates with `?account={id}` on selection | ✅ |
| AC-8 | Empty state shown when no transactions for account | ✅ |
| AC-9 | Each transaction shows recipient, date (Mon D, YYYY), amount with currency | ✅ |

---

**Status:** APPROVED - Ready for Architect

