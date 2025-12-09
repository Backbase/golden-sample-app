# JIRA-001: View Transactions by Account

## Selected ADRs

- **ADR-001: Accessibility Standards** - Account selector and transaction list require WCAG 2.2 AA compliance, keyboard navigation, screen reader support
- **ADR-003: Translation/Internationalization Standards** - User-facing labels, date formatting ("Mon D, YYYY"), currency display with i18n
- **ADR-004: Responsiveness Standards** - E2E tests require responsive behavior across breakpoints (360px, 768px, 1200px)
- **ADR-006: Design System Component Standards** - Use `AccountSelector` UI component from `@backbase/ui-ang`
- **ADR-011: Entitlements/Access Control Standards** - Permission-based route access for transactions viewing
- **ADR-013: Unit/Integration Testing Standards** - Unit test coverage ≥ 80%, TDD approach

## Repo Context

No repo-specific conventions or styleguide additions found beyond the selected ADRs.

The ADRs (001, 003, 004, 006, 011, 013) provide the complete set of standards to follow.

## Disambiguation

### Resolved Questions

**Q1: What is the "default account"?**
> **Answer:** First account returned from the arrangements API.

**Q2: Which "account number" field should be displayed in dropdown?**
> **Answer:** Account name if available, otherwise BBAN (masked as-is), otherwise IBAN - use whatever is available.

**Q3: What "account number" in transaction item?**
> **Answer:** No changes to transaction list items. Only add accountId as a filter parameter for fetching transactions.

**Q4: Date format change?**
> **Answer:** No changes to date format - keep current implementation as-is.

**Q5: UI placement of account selector?**
> **Answer:** Display on top of the transactions list. Reference existing similar component in code (custom-payment initiator).

**Q6: Empty state?**
> **Answer:** Show "no transactions" empty state when selected account has zero transactions.
