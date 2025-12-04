# JIRA-001: View Transactions by Account

## User Story

**As a** banking customer  
**I want to** view and filter my transactions by selecting different accounts from a dropdown  
**So that** I can see all transactions related to a specific account

## Description

Users need the ability to view their transaction history for individual accounts. The application should provide an account selector dropdown that allows users to switch between their available accounts, and the transaction list should update dynamically to show only transactions for the selected account.

## Acceptance Criteria

### Account Selector
- [ ] The transactions page displays an account selector dropdown
- [ ] The account selector displays all accounts returned from the arrangements API endpoint
- [ ] Each account in the dropdown displays its name and account number
- [ ] When a user selects an account from the dropdown, the account selector displays the selected account name

### Transaction List Display
- [ ] When the transactions page loads, it displays transactions for the default account
- [ ] The number of transactions displayed matches the account's transaction history count
- [ ] When a user selects a different account, the transaction list updates to show only transactions for the selected account
- [ ] All displayed transactions belong to the currently selected account

### Transaction Item Details
- [ ] Each transaction in the list displays the recipient name
- [ ] Each transaction in the list displays the transaction date in "Mon D, YYYY" format
- [ ] Each transaction in the list displays the transaction amount with currency symbol
- [ ] Each transaction in the list displays the associated account number

## Non-Functional Requirements (NFRs)

This feature must comply with the following ADRs:

- **ADR-001**: Accessibility (WCAG 2.2 AA) - Account selector must support keyboard navigation, screen readers, proper ARIA attributes
- **ADR-003**: Internationalization - All text must be translatable, dates/amounts must use locale-aware formatting
- **ADR-004**: Responsiveness - Must work on 360px+ screens, follow Bootstrap breakpoints, mobile-first approach
- **ADR-005**: Performance - Core Web Vitals thresholds, server-side pagination, request debouncing, caching
- **ADR-006**: Design System - Use `@backbase/ui-ang` AccountSelector component
- **ADR-011**: Access Control - Route protected with `EntitlementsGuard` using `Transactions.View.view` permission
- **ADR-012**: State Management - Reactive patterns with RxJS, OnPush change detection (if applicable)
- **ADR-013**: Testing - 80% unit test coverage, integration tests, zero flakiness

## Technical Details

- Account data is retrieved from the arrangements API endpoint (`/productsummary/context/arrangements`)
- Transactions are filtered by the `arrangementId` matching the selected account's `id`
- The account selector component uses the `AccountSelector` UI component from `@backbase/ui-ang`
- The transactions list uses the `Transactions` component to display transaction items

## Related Files

- `libs/transactions-journey/e2e-tests/specs/transactions-list.spec.ts`
- `libs/transactions-journey/e2e-tests/page-objects/pages/transactions-list-page.ts`
- `libs/transactions-journey/e2e-tests/page-objects/ui-components/account-selector.ts`
- `libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts`

## Test Coverage

### E2E Tests (Existing)
- [ ] Account selector dropdown functionality
- [ ] Transaction list filtering by account selection
- [ ] All transaction fields display correctly
- [ ] Responsive behavior across breakpoints (360px, 768px, 1200px)
- [ ] Gherkin feature file: `libs/transactions-journey/e2e-tests/test-cases/transactions-list/transaction-list-display-and-search.fixture`

### Unit Tests (Required per ADR-013)
- [ ] Component: Account selection state management
- [ ] Component: Transaction filtering logic
- [ ] Component: Loading and error states
- [ ] Service: API calls and error handling
- [ ] Minimum 80% coverage for new/changed code

### Integration Tests (Required per ADR-013)
- [ ] API contract validation for arrangements endpoint
- [ ] API contract validation for transactions endpoint
- [ ] Permission-based route access

## Definition of Done

- [ ] All Acceptance Criteria verified
- [ ] All NFRs compliant (ADR-001 through ADR-013)
- [ ] Unit test coverage ≥ 80%
- [ ] E2E tests pass
- [ ] Accessibility audit passed (axe-core + Lighthouse)
- [ ] Performance audit passed (Core Web Vitals in "Good" range)
- [ ] Code reviewed and approved
- [ ] No linting errors
- [ ] All methods ≤ 24 lines
- [ ] JSDoc on public methods
- [ ] CI pipeline green
