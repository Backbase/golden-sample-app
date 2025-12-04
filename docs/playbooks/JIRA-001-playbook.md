# JIRA-001 Implementation Playbook

## View Transactions by Account - Step-by-Step Guide

This playbook guides you through implementing JIRA-001 using Cursor's LLM-assisted development.

---

## How to Use This Playbook

1. **Open Cursor Chat** (Cmd+L or Ctrl+L)
2. **Copy prompts** from this playbook into the chat
3. **Wait for responses** - never skip human gates (🚦)
4. **Apply generated code** - click "Apply" button or use Cmd+Enter on code blocks
5. **Run terminal commands** in Cursor's integrated terminal

> **Tip:** The `@file` references in prompts automatically include files in context. You don't need to open them manually.

---

## Phase 1: Requirements Clarification

### Step 1: Initialize Session

Copy this prompt into Cursor Chat:

```
I'm implementing JIRA-001: View Transactions by Account.

## Context Files
JIRA Ticket: @docs/JIRA-001.md

Target Files (to be modified):
- @libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts
- @libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.html
- @libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.scss
- @libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts
- @libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.spec.ts
- @libs/transactions-journey/src/lib/transactions-journey-shell.module.ts

Reference Files (read-only context):
- @libs/transactions-journey/internal/data-access/src/lib/services/arrangements/arrangements.service.ts
- @libs/transactions-journey/e2e-tests/mocks/product-summary-arrangements.json

ADRs:
- @docs/architecture/001-ADR-accessibility-standards.md
- @docs/architecture/003-ADR-translation-internationalization-standards.md
- @docs/architecture/006-ADR-design-system-component-standards.md
- @docs/architecture/011-ADR-entitlements-access-control-standards.md
- @docs/architecture/013-ADR-unit-integration-testing-standards.md

Agent: @docs/agents/angular-typescript-agent.md

## Instructions
Please act as the Senior Angular/TypeScript Agent defined in the agent file above.

Before creating any plan, I need you to clarify requirements. Read the JIRA ticket and the current component implementation, then ask me questions about anything that's unclear or ambiguous.

Format your response as:
## ASK
[Your questions here]

Do NOT proceed to planning until I answer all questions.
```

### Step 2: 🚦 HUMAN GATE - Answer Clarification Questions

The LLM will output questions. **You must answer ALL questions before proceeding.**

Example questions you might receive:
- "Should the account selector show all accounts or only active ones?"
- "What should happen when no account is selected - show all transactions or show empty?"
- "Should the account selector be positioned above or below the search filter?"

**Write your answers and send them to the LLM.**

---

## Phase 2: Solution Planning

### Step 3: Request Implementation Plan

After answering all clarification questions, send this prompt:

```
Now please create an implementation plan.

Requirements:
1. Implementation steps (numbered, sequential)
2. Files to create or modify (with paths)
3. Interfaces/types required
4. Dependencies on existing services or components
5. How each ADR requirement will be addressed:
   - ADR-001: Accessibility approach
   - ADR-003: i18n approach  
   - ADR-006: Which design system components to use
   - ADR-011: Entitlements triplet for route protection
   - ADR-013: Test coverage approach

Format your response as:
## PLAN
[Your plan here]

Do NOT generate any implementation code yet. Wait for my approval.
```

### Step 4: 🚦 HUMAN GATE - Review and Approve Plan

Review the plan carefully. Check:

- [ ] Does the plan address ALL acceptance criteria from JIRA-001?
- [ ] Does the plan use `@backbase/ui-ang` AccountSelector component? (ADR-006)
- [ ] Does the plan include EntitlementsGuard with `Transactions.View.view`? (ADR-011)
- [ ] Does the plan include i18n for all new text? (ADR-003)
- [ ] Does the plan include accessibility attributes? (ADR-001)
- [ ] Does the plan include unit tests? (ADR-013)

**If the plan is acceptable:** Reply "Plan approved. Proceed to decomposition."

**If changes needed:** Reply with specific feedback and request updated plan.

---

## Phase 3: Task Decomposition

### Step 5: Request Step Decomposition

```
Break down the approved plan into discrete implementation steps.

For each step provide:
- Step number and name
- Single responsibility (what this step does)
- Input types
- Output types
- Dependencies (services, components)

Requirements:
- Maximum 10 steps
- Each step should be implementable as ONE method or ONE small template change
- Each method must be ≤24 lines

Format as:
## DECOMPOSITION
[Steps here]

Wait for my approval before proceeding.
```

### Step 6: 🚦 HUMAN GATE - Approve Decomposition

Review the decomposition:

- [ ] Are steps small enough? (single responsibility)
- [ ] Are dependencies clear?
- [ ] Is the order logical?

**If acceptable:** Reply "Decomposition approved. Let's start with Step 1."

---

## Phase 4: Test-Driven Implementation

For **each step** in the decomposition, follow this cycle:

### Step 7: Generate Tests First

```
Generate unit tests for Step [N]: [STEP NAME]

Requirements:
- Follow AAA pattern (Arrange-Act-Assert)
- Use naming: should_[expected]_when_[condition]
- Cover: happy path, error case, edge case
- Mock external dependencies (services, HTTP)
- One assertion per test

Reference ADR-013 for testing patterns.

Do NOT implement the code. Output tests only.
Wait for my review before implementing.
```

### Step 8: 🚦 HUMAN GATE - Review Tests

Review the generated tests:

- [ ] Do tests cover the acceptance criteria?
- [ ] Are mocks appropriate?
- [ ] Is the test naming clear?

**If acceptable:** Reply "Tests approved. Now implement the code to make these tests pass."

### Step 9: Implement Step

```
Implement Step [N]: [STEP NAME]

Constraints:
- Must pass the tests generated above
- Maximum 24 lines per method
- Include JSDoc for public methods
- Use OnPush change detection
- Include i18n for any user-facing text (ADR-003 pattern)
- Include accessibility attributes (ADR-001)

Add inline comments:
- RULE: for business rules
- ASSUMPTION: for assumptions made

Output the implementation code.
```

> **Cursor Tip:** When the LLM generates code, click the **"Apply"** button on each code block to apply changes to the file. Review the diff before accepting.

### Step 10: Run Tests Locally

In Cursor's terminal (Ctrl+`), run:

```bash
nx test transactions-journey-internal-feature-transaction-view --watch=false
```

**If tests pass:** Proceed to Step 11.

**If tests fail:** Send this prompt:

```
Test failed:

TEST: [test name]
ERROR: [error message]
STACK: [relevant stack trace]

Rules:
1. Analyze the failure
2. Fix the IMPLEMENTATION, not the test
3. Only modify the test if it contains an obvious bug
4. Explain what was wrong

Output the corrected code.
```

### Step 11: Self-Critique

```
Review the code you just generated for Step [N].

Check for:
1. Missing null/undefined checks
2. Unhandled Observable errors (missing catchError)
3. Memory leaks (subscriptions without takeUntilDestroyed)
4. ADR violations (check all open ADRs)
5. Methods exceeding 24 lines
6. Missing accessibility attributes
7. Missing i18n markers

If issues found, provide corrected code.
If no issues: state "Self-review passed for Step [N]"
```

### Step 12: Repeat for Each Step

Repeat Steps 7-11 for each step in the decomposition.

---

## Phase 5: Route Protection (ADR-011)

### Step 13: Add EntitlementsGuard

After all component steps are complete, update the route:

```
Now update the transactions route to add EntitlementsGuard per ADR-011.

File: libs/transactions-journey/src/lib/transactions-journey-shell.module.ts

Requirements:
- Add EntitlementsGuard to canActivate
- Use triplet: 'Transactions.Transactions.view'
- Add redirectTo for unauthorized access

Show me the modified route configuration.
```

### Step 14: 🚦 HUMAN GATE - Verify Route

Check the route configuration:

- [ ] EntitlementsGuard added to canActivate?
- [ ] Correct triplet format (Resource.Function.permission)?
- [ ] redirectTo specified?

---

## Phase 6: Final Quality Check

### Step 15: Architecture Compliance Check

```
Perform final architecture compliance check on all changes:

1. Does any class have >10 public methods?
2. Does any method exceed 24 lines?
3. Are there direct HttpClient imports outside of services?
4. Are all subscriptions properly cleaned up?
5. Is OnPush change detection used?
6. Are all user-facing strings translated (i18n)?
7. Do all interactive elements have accessibility attributes?
8. Is EntitlementsGuard on the route?
9. Do unit tests exist for new/changed code?

For each check, state:
- ✅ PASS: [what was verified]
- ❌ FAIL: [what needs fixing] + corrected code

End with: "Compliant" or "Changes required: [list]"
```

### Step 16: 🚦 HUMAN GATE - Fix Any Violations

If any violations were found, apply the fixes and re-run the compliance check.

### Step 17: Run Full Test Suite

In Cursor's terminal:

```bash
nx test transactions-journey --watch=false
nx test transactions-journey-internal-feature-transaction-view --watch=false
nx test transactions-journey-internal-data-access --watch=false
```

All tests must pass before proceeding.

### Step 18: Run E2E Tests (Optional)

```bash
nx e2e transactions-journey-e2e
```

---

## Phase 7: Final Review

### Step 19: Definition of Done Checklist

Verify all items from JIRA-001:

**Acceptance Criteria:**
- [ ] Account selector dropdown displays on transactions page
- [ ] Dropdown shows all accounts from arrangements API
- [ ] Each account shows name and account number
- [ ] Selecting an account updates the selector display
- [ ] Transaction list filters by selected account
- [ ] Default account shows transactions on page load
- [ ] Each transaction shows: recipient, date (Mon D, YYYY), amount, account number

**Non-Functional Requirements:**
- [ ] ADR-001: Keyboard navigation, ARIA attributes, screen reader support
- [ ] ADR-003: All text translatable, dates/amounts locale-aware
- [ ] ADR-006: Uses @backbase/ui-ang AccountSelector component
- [ ] ADR-011: Route protected with EntitlementsGuard
- [ ] ADR-013: ≥80% unit test coverage

**Code Quality:**
- [ ] All methods ≤24 lines
- [ ] JSDoc on public methods
- [ ] OnPush change detection
- [ ] No linting errors
- [ ] Self-review passed

---

## Summary: Quick Reference

| Phase | Steps | Human Gates |
|-------|-------|-------------|
| 1. Clarification | 1-2 | Answer questions |
| 2. Planning | 3-4 | Approve plan |
| 3. Decomposition | 5-6 | Approve steps |
| 4. Implementation | 7-12 (per step) | Approve tests |
| 5. Route Protection | 13-14 | Verify route |
| 6. Quality Check | 15-17 | Fix violations |
| 7. Final Review | 18-19 | DoD checklist |

---

## Troubleshooting

### LLM generates code without waiting
Type in chat: "STOP. You skipped a human gate. Go back to [phase] and wait for my approval."

### LLM ignores ADR requirements
Type in chat: "Check ADR-[XXX] before proceeding. Specifically look at [section]. Update your response to comply."

### Code doesn't apply correctly
1. Click "Reject" on the code block
2. Ask the LLM to regenerate with more context
3. Or manually copy-paste the code

### Tests fail unexpectedly
1. Check if mocks are correctly set up
2. Verify imports are correct
3. Check for async issues (use fakeAsync/tick)

### Component doesn't render
1. Check module imports/exports
2. Verify selector matches template usage
3. Check for OnPush change detection issues with async data

### Context seems missing
If LLM doesn't seem to see a file, re-add it with `@filename` in your next message.

---

## Files Changed Summary

After completing this playbook, you should have modified:

```
MODIFIED:
├── libs/transactions-journey/src/lib/transactions-journey-shell.module.ts
│   └── Added EntitlementsGuard to route
│
└── libs/transactions-journey/internal/feature-transaction-view/src/lib/
    └── components/transactions-view/
        ├── transactions-view.component.ts    (account selector logic)
        ├── transactions-view.component.html  (account selector template)
        ├── transactions-view.component.scss  (styling if needed)
        ├── transactions-view.module.ts       (import AccountSelectorModule)
        └── transactions-view.component.spec.ts (new tests for account selector)
```

---

## Appendix: Key Code Patterns

### Account Selector Pattern (ADR-006)

```html
<bb-account-selector-ui
  [accounts]="accounts$ | async"
  [selectedAccount]="selectedAccount$ | async"
  (accountSelected)="onAccountSelected($event)"
  i18n-label="@@transactions.account-selector.label"
  label="Select Account"
></bb-account-selector-ui>
```

### Entitlements Guard Pattern (ADR-011)

```typescript
{
  path: '',
  component: TransactionsViewComponent,
  canActivate: [EntitlementsGuard],
  data: {
    entitlements: 'Transactions.Transactions.view',
    redirectTo: '/error/403'
  }
}
```

### OnPush with Observables Pattern

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsViewComponent {
  accounts$ = this.arrangementsService.arrangements$;
  selectedAccount$ = this.route.queryParamMap.pipe(
    map(params => params.get('account'))
  );
}
```

### i18n Pattern (ADR-003)

```html
<label 
  i18n="Account selector label|Label for dropdown@@transactions.account-selector.label">
  Select Account
</label>
```

