# Execution Plan: JIRA-001

**Agent:** Architect  
**Mode:** CREATE  
**Depends on:** solution-design.md (APPROVED)

---

## Steps

Each step follows TDD: tests (2.1) → code (2.2) → run tests (2.3) → commit (2.4)

---

### Step 1: Add AccountSelectorModule Import

- **Description:** Import `AccountSelectorModule` from `@backbase/ui-ang/account-selector` into the transactions view module
- **Files:** 
  - `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts`
- **Tests:** Module compiles without errors (build verification)
- **Depends:** None

---

### Step 2: Add Account Selector to Template

- **Description:** Add `bb-account-selector-ui` component above the search filter with i18n markers; remove filter badge
- **Files:**
  - `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.html`
- **Tests:** 
  - `should render account selector element`
  - `should have i18n markers for label and placeholder`
- **Depends:** Step 1

---

### Step 3: Add Account Selection Logic

- **Description:** Add `accounts$`, `selectedAccount$` observables and `onAccountSelected()` method to component
- **Files:**
  - `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`
- **Tests:**
  - `should expose accounts$ observable from ArrangementsService`
  - `should select first account when no query param exists`
  - `should navigate with query param when account selected`
  - `should update selectedAccount$ when query param changes`
- **Depends:** Step 2

---

### Step 4: Update Transaction Filtering

- **Description:** Ensure transactions are filtered by selectedAccount when first account is auto-selected (fix edge case where no query param exists initially)
- **Files:**
  - `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`
- **Tests:**
  - `should filter transactions by first account on initial load`
  - `should filter transactions when account selection changes`
  - `should show all matching transactions for selected account`
- **Depends:** Step 3

---

### Step 5: Add EntitlementsGuard to Route

- **Description:** Protect the transactions route with `EntitlementsGuard` using triplet `Transactions.Transactions.view`
- **Files:**
  - `libs/transactions-journey/src/lib/transactions-journey-shell.module.ts`
- **Tests:**
  - `should have EntitlementsGuard on transactions route`
  - `should have correct entitlements triplet in route data`
- **Depends:** None (can be done in parallel with Steps 1-4)

---

## Execution Order

```
S1 (Module Import)
    │
    ▼
S2 (Template)
    │
    ▼
S3 (Component Logic)
    │
    ▼
S4 (Filtering Fix)

S5 (Entitlements) ──── runs in parallel, no dependencies
```

**Recommended sequential order:** S1 → S2 → S3 → S4 → S5

---

## Commit Strategy

Each step = 1 commit with the following message format:

| Step | Commit Message |
|------|----------------|
| S1 | `feat(JIRA-001): step 1 - import AccountSelectorModule` |
| S2 | `feat(JIRA-001): step 2 - add account selector to template` |
| S3 | `feat(JIRA-001): step 3 - add account selection logic` |
| S4 | `feat(JIRA-001): step 4 - update transaction filtering` |
| S5 | `feat(JIRA-001): step 5 - add EntitlementsGuard to route` |

---

## Test Commands

```bash
# Run tests for specific step (example for Step 3)
npx nx test transactions-journey-internal-feature-transaction-view --testFile=transactions-view.component.spec.ts --testNamePattern="S3"

# Run all feature tests
npx nx test transactions-journey-internal-feature-transaction-view --watch=false
```

---

## Rollback Plan

- **If step fails tests:** Revert commit with `git revert HEAD`, diagnose issue, retry step
- **If design flaw discovered:** Return to solution-design.md for revision
- **If ADR violation found:** Fix before proceeding to next step

---

## Definition of Done (per step)

- [ ] Tests written and passing
- [ ] Code implements only what's specified for that step
- [ ] No linting errors
- [ ] Commit message follows convention
- [ ] Human approval before next step

