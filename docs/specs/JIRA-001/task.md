# JIRA-001: View Transactions by Account

## Task Specification

**User Story:** As a banking customer, I want to view and filter my transactions by selecting different accounts from a dropdown, so that I can see all transactions related to a specific account.

---

## 1. Selected ADRs

| ADR | Rationale |
|-----|-----------|
| **ADR-000: Common Angular Patterns** | Subscription cleanup with `takeUntil`, OnPush change detection for components, type safety for account/transaction models |
| **ADR-001: Accessibility Standards** | Account selector dropdown needs keyboard operability, proper ARIA labels, focus management |
| **ADR-003: Translation/i18n Standards** | "Select Account" label, transaction display text, and all user-facing strings require translation markers |
| **ADR-006: Design System Standards** | Uses `bb-account-selector-ui` from `@backbase/ui-ang`; must follow smart/dumb component separation |
| **ADR-011: Entitlements Standards** | Transactions viewing requires `Transactions.Transactions.view` permission; route guard needed |
| **ADR-013: Unit Testing Standards** | New functionality requires 80%+ coverage, AAA pattern, mocked dependencies |

---

## 2. Repo Context

### 2.1 Similar Implementations to Reference

| Feature | File Path |
|---------|-----------|
| Account Selector in Custom Payment | `libs/journey-bundles/custom-payment/src/lib/components/initiator/initiator.component.ts` |
| Account Selector in ACH Positive Pay | `libs/ach-positive-pay-journey/internal/ui/src/lib/components/ach-positive-pay-rule-form/ach-positive-pay-rule-form.component.html` |
| Transactions View (target file) | `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts` |

### 2.2 API Contracts

| Endpoint | Purpose |
|----------|---------|
| `GET /arrangement-manager/client-api/v2/productsummary/context/arrangements` | Fetch all user accounts |
| `POST /transactions-manager/client-api/v2/transactions` | Fetch transactions (existing) |

**Existing Service:** `ArrangementsService` at `libs/transactions-journey/internal/data-access/src/lib/services/arrangements/arrangements.service.ts`

### 2.3 Existing Types/Interfaces to Reuse

| Type | Source |
|------|--------|
| `ProductSummaryItem` | `@backbase/arrangement-manager-http-ang` |
| `TransactionItem` | `@backbase/transactions-http-ang` |
| `AccountSelectorItem` | `libs/journey-bundles/custom-payment/src/lib/components/initiator/initiator.model.ts` |

### 2.4 UI Component API (bb-account-selector-ui)

**Verified Inputs:**
- `[items]` - Array of account items
- `[markFirst]` - Auto-select first item
- `[closeOnSelect]` - Close dropdown on selection
- `placeholder` - Placeholder text
- `ariaLabelledby` - Accessibility label reference

**Verified Outputs:**
- `(change)` - Emits selected item (requires `$any()` cast)
- `(blur)` - Blur event

### 2.5 Current State

The `TransactionsViewComponent` already has:
- `accountId$` from query params
- `accountName$` resolving account name
- Transaction filtering by `accountId`
- Badge UI to remove filter

**Missing:** Account selector dropdown to select accounts.

---

## 3. Disambiguation

### Answered Questions

| Question | Answer |
|----------|--------|
| **Q1: Default Account** | First account in API response (index 0) is the default selection |
| **Q2: Selector Visibility** | Always visible, even with single account |
| **Q3: "All Accounts" Option** | No "All Accounts" option; user always has a specific account selected; default is first account |
| **Q4: Account Display Format** | Use default format from `bb-account-selector-ui` component |
| **Q5: Entitlements Guard Scope** | Apply to parent route covering all child routes |
| **Q6: Empty State** | Use existing empty state behavior (empty list) |

### Clarified Requirements

1. **Default Selection:** On page load, automatically select the first account from the arrangements API and filter transactions to that account
2. **Dropdown Always Visible:** Account selector dropdown is always shown regardless of account count
3. **No "All Accounts" View:** User cannot view all transactions across accounts; must always have one account selected
4. **URL Sync:** Selected account ID syncs with URL query parameter `?account=<id>` for deep linking
5. **Entitlements:** `EntitlementsGuard` with `Transactions.Transactions.view` applied at parent route level

---


