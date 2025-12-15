# Execution Plan: JIRA-001

**Agent:** architect  
**Mode:** CREATE  
**Depends on:** solution-design.md (APPROVED)

---

## Steps

Each step follows TDD: tests (2.1) → code (2.2) → run tests (2.3) → commit (2.4)

---

### Step 1: Add EntitlementsGuard to Route

- **Description:** Protect transactions route with `Transactions.Transactions.view` entitlement
- **Files:** `libs/transactions-journey/src/lib/transactions-journey-shell.module.ts`
- **Tests:**
  - Route has EntitlementsGuard in canActivate
  - Route data contains correct entitlements triplet
  - Route data contains redirectTo fallback
- **Depends:** None

---

### Step 2: Import AccountSelectorModule

- **Description:** Add AccountSelectorModule to TransactionsViewModule imports
- **Files:** `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts`
- **Tests:**
  - Module compiles without errors
  - AccountSelectorModule is in imports array
- **Depends:** None

---

### Step 3: Add Account Selector to Component

- **Description:** Add accounts$, selectedAccount$, onAccountSelected() to TransactionsViewComponent with OnPush change detection
- **Files:** `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`
- **Tests:**
  - `should expose accounts$ observable with mapped items`
  - `should expose selectedAccount$ based on URL param`
  - `should navigate to first account when no account in URL`
  - `should update URL when onAccountSelected() called`
  - `should map BBAN to account number`
  - `should fallback to IBAN when BBAN not available`
- **Depends:** Step 2

---

### Step 4: Add Account Selector Template

- **Description:** Add bb-account-selector-ui to template with i18n labels and accessibility attributes
- **Files:** `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.html`
- **Tests:**
  - Account selector renders in DOM
  - Label has i18n attribute with correct ID
  - Placeholder has i18n-placeholder attribute
  - ariaLabelledby points to label ID
  - Empty state displays when no accounts
- **Depends:** Step 3

---

### Step 5: Add Empty State for No Transactions

- **Description:** Add empty state UI when selected account has zero transactions
- **Files:** 
  - `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.html`
  - `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts` (import EmptyStateModule if needed)
- **Tests:**
  - Empty state displays when transactions array is empty
  - Empty state has appropriate i18n message
- **Depends:** Step 4

---

## Execution Order

```
S1 ────┐
       ├──► S3 ──► S4 ──► S5
S2 ────┘
```

Steps 1 and 2 can run in parallel (no dependencies).
Steps 3, 4, 5 are sequential.

---

## Commit Strategy

| Step | Commit Message |
|------|----------------|
| S1 | `feat(JIRA-001): step 1 - add EntitlementsGuard to transactions route` |
| S2 | `feat(JIRA-001): step 2 - import AccountSelectorModule` |
| S3 | `feat(JIRA-001): step 3 - add account selector logic to component` |
| S4 | `feat(JIRA-001): step 4 - add account selector template with i18n` |
| S5 | `feat(JIRA-001): step 5 - add empty state for no transactions` |

---

## Test Commands

```bash
# Run tests for specific step
npx nx test transactions-journey-internal-feature-transaction-view --testPathPattern="transactions-view" --watch=false

# Run all transactions journey tests
npx nx test transactions-journey --watch=false
```

---

## Rollback Plan

- If step fails tests: `git revert HEAD`, diagnose, retry
- If design flaw discovered: return to solution-design.md, update, restart from affected step

---

## Definition of Done Checklist

- [ ] All 5 steps implemented and committed
- [ ] All unit tests pass (80%+ coverage on new code)
- [ ] No linting errors
- [ ] EntitlementsGuard protecting route
- [ ] Account selector accessible via keyboard
- [ ] All user-facing text has i18n markers
- [ ] Empty states implemented

