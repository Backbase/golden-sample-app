# Execution Plan: JIRA-001

**Agent:** architect  
**Mode:** CREATE  
**Date:** 2025-12-15  
**Based on:** `docs/specs/JIRA-001/solution-design.md` (APPROVED)

---

## Execution Plan

Each step follows TDD cycle:
1. **2.1** Write tests first
2. **2.2** Implement code to pass tests
3. **2.3** Run tests to verify
4. **2.4** Commit step

---

## Steps

### Step 1: Add AccountSelectorModule to TransactionsViewModule

- **Description:** Import the account selector module to make `bb-account-selector-ui` available
- **Files:** `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts`
- **Tests:** Module compiles without errors (build verification)
- **Depends:** None

---

### Step 2: Add accounts$ observable and account selector to template

- **Description:** Expose `accounts$` from ArrangementsService, add `bb-account-selector-ui` to template with proper a11y and i18n
- **Files:** 
  - `transactions-view.component.ts` — add `accounts$` property
  - `transactions-view.component.html` — add account selector UI above search
- **Tests:**
  - Should display account selector dropdown
  - Should show all accounts from arrangements service
  - Account selector has proper ARIA label
- **Depends:** Step 1

---

### Step 3: Implement account selection with URL navigation

- **Description:** Add `onAccountSelect()` method that navigates with query param, derive `selectedAccount$` from URL
- **Files:**
  - `transactions-view.component.ts` — add `selectedAccount$`, `onAccountSelect()`
- **Tests:**
  - Should update URL query param when account selected
  - Should reflect selected account from URL in selector
  - Should handle `$any()` type casting for change event
- **Depends:** Step 2

---

### Step 4: Auto-select first account on page load

- **Description:** When no account query param exists, automatically navigate to first account
- **Files:**
  - `transactions-view.component.ts` — add initialization logic
- **Tests:**
  - Should auto-select first account when no query param present
  - Should NOT auto-select if account param already in URL
  - Should handle empty accounts list gracefully
- **Depends:** Step 3

---

### Step 5: Add empty state for zero transactions

- **Description:** Show i18n message when selected account has no transactions
- **Files:**
  - `transactions-view.component.html` — add empty state template with i18n
- **Tests:**
  - Should show "No transactions found" message when transactions list is empty
  - Empty state message has proper i18n marker
- **Depends:** Step 4

---

## Execution Order

```
Step 1 (module import)
    │
    ▼
Step 2 (accounts$ + template)
    │
    ▼
Step 3 (selection + URL)
    │
    ▼
Step 4 (auto-select first)
    │
    ▼
Step 5 (empty state)
```

All steps are sequential — each depends on the previous.

---

## Commit Strategy

| Step | Commit Message |
|------|----------------|
| 1 | `feat(JIRA-001): step 1 - import AccountSelectorModule` |
| 2 | `feat(JIRA-001): step 2 - add account selector to template` |
| 3 | `feat(JIRA-001): step 3 - implement account selection with URL` |
| 4 | `feat(JIRA-001): step 4 - auto-select first account on load` |
| 5 | `feat(JIRA-001): step 5 - add empty transactions state` |

---

## Test Commands

```bash
# Run tests for specific step (example for Step 2)
npx nx test transactions-journey-internal-feature-transaction-view --testPathPattern="transactions-view" --watch=false

# Run all transaction journey tests
npx nx test transactions-journey-internal-feature-transaction-view --watch=false
```

---

## Estimated Effort

| Step | Complexity | Estimate |
|------|------------|----------|
| Step 1 | Low | 5 min |
| Step 2 | Medium | 15 min |
| Step 3 | Medium | 15 min |
| Step 4 | Medium | 10 min |
| Step 5 | Low | 10 min |
| **Total** | | **~55 min** |

---

⛔ **STOP:** Execution plan complete. Ready for **SIGN-OFF gate** (Step 1.6)?

