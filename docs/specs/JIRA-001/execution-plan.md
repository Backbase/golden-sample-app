# JIRA-001: Execution Plan

## View Transactions by Account

Each step follows TDD: write tests (2.1) → implement (2.2) → run tests (2.3) → commit (2.4)

---

## Steps

### Step 1: Add EntitlementsGuard to Route

- **Description:** Add `EntitlementsGuard` to parent transactions route with `Transactions.Transactions.view` permission
- **Files:** `libs/transactions-journey/src/lib/transactions-journey-shell.module.ts`
- **Tests:** Route guard applied, redirectTo configured
- **Depends:** None

---

### Step 2: Import AccountSelectorModule

- **Description:** Import `AccountSelectorModule` from `@backbase/ui-ang/account-selector` into `TransactionsViewModule`
- **Files:** `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts`
- **Tests:** Module compiles without errors
- **Depends:** None

---

### Step 3: Add Account Selector to Template

- **Description:** Add `bb-account-selector-ui` component to template with label, i18n, and aria attributes
- **Files:** 
  - `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.html`
  - `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`
- **Tests:**
  - Account selector renders
  - Selector receives accounts from service
  - First account marked by default
  - Aria-labelledby correctly set
- **Depends:** S2

---

### Step 4: Implement Account Selection Handler

- **Description:** Add `onAccountChange()` method that navigates with query param when account is selected
- **Files:** `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`
- **Tests:**
  - Selecting account calls router.navigate with account ID
  - Query param updates correctly
  - Transactions filter by selected account
- **Depends:** S3

---

### Step 5: Handle Default Account Selection

- **Description:** Ensure first account is selected on page load when no account query param exists
- **Files:** `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`
- **Tests:**
  - No query param → first account selected
  - Query param exists → that account selected
  - Invalid account ID → falls back to first account
- **Depends:** S4

---

## Execution Order

```
S1 (EntitlementsGuard) ──┐
                         ├──► S3 (Template) ──► S4 (Handler) ──► S5 (Default)
S2 (Module Import) ──────┘
```

S1 and S2 can be done in parallel, then S3 → S4 → S5 sequentially.

---

## Commit Strategy

| Step | Commit Message |
|------|----------------|
| S1 | `feat(JIRA-001): step 1 - add entitlements guard to transactions route` |
| S2 | `feat(JIRA-001): step 2 - import account selector module` |
| S3 | `feat(JIRA-001): step 3 - add account selector to template` |
| S4 | `feat(JIRA-001): step 4 - implement account selection handler` |
| S5 | `feat(JIRA-001): step 5 - handle default account selection` |

---

## Test Commands

```bash
# Run tests for the component
npx nx test transactions-journey-internal-feature-transaction-view --watch=false

# Run tests with specific pattern
npx nx test transactions-journey-internal-feature-transaction-view --testNamePattern="S[N]"
```

---

