# JIRA-001: Execution Plan

Based on: [solution-design.md](./solution-design.md)

Each step follows TDD: write tests (2.1) → implement (2.2) → run tests (2.3) → commit (2.4)

---

## Steps

- [ ] **S1: Module imports** — Add AccountSelectorModule and EmptyStateModule to TransactionsViewModule
  - Files: `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts`
  - Tests: Module compiles without errors

- [ ] **S2: Account selector data** — Add accounts$ observable and selectedAccount$ for dropdown binding
  - Files: `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`
  - Tests: accounts$ emits mapped arrangement data; selectedAccount$ emits correct account
  - Depends: S1

- [ ] **S3: Default account selection** — Set first account as default on page load when no account in URL
  - Files: `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`
  - Tests: First account selected when URL has no account param; URL account respected if present
  - Depends: S2

- [ ] **S4: Account selection handler** — Add onAccountSelected() method to update URL query param
  - Files: `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`
  - Tests: Selecting account updates URL; transactions filter by selected account
  - Depends: S2

- [ ] **S5: Template updates** — Add account selector UI and empty state to template
  - Files: `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.html`
  - Tests: Account selector renders; empty state shows when no transactions
  - Depends: S1, S2, S3, S4

---

## Order

```
S1 → S2 → S3 → S4 → S5
```

All steps are sequential due to dependencies.

