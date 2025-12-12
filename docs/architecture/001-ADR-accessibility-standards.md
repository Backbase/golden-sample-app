# ADR-001: Adopting WCAG 2.2 AA Standards for Front-End Development

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> All front-end development must comply with WCAG 2.2 Level AA accessibility standards. This includes mandatory automated testing with axe-core, keyboard operability for all functionality, proper ARIA usage, and CI/CD gates that block non-compliant code from merging.

### Rules

**MUST DO ✅**

1. Use native HTML elements (`<button>`, `<a>`, `<input>`) over `<div>`/`<span>` for interactive elements
2. Ensure all form inputs have associated `<label>` elements with matching `for`/`id`
3. Maintain color contrast of 4.5:1 for text and 3:1 for large text/UI components
4. Use `:focus-visible` for keyboard focus indicators with minimum 3:1 contrast
5. Follow logical heading hierarchy (h1 → h2 → h3) without skipping levels
6. Include axe-core accessibility tests for all UI components
7. Use ARIA landmarks (`banner`, `navigation`, `main`, `contentinfo`) for page regions

**MUST NOT ❌**

1. Never use positive `tabindex` values (tabindex="1", "2", etc.)
2. Never remove focus outlines without providing an alternative indicator
3. Never use `LiveAnnouncer` — prefer `bbFocus` directive with `aria-live` regions
4. Never skip heading levels in document structure
5. Never use placeholder text as the only label for form fields
6. Never trigger context changes (navigation, form submit) on focus
7. Never use images of text except for logos

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

<!-- 
Cross-reference: For safe DOM manipulation patterns (Renderer2 vs direct DOM access), 
see ADR-000 Pattern 4: Safe DOM Manipulation.
-->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| button, click, interactive, keyboard | [Keyboard Operability](#pattern-1-keyboard-operability) |
| form, input, label, validation, error | [Form Accessibility](#pattern-2-form-accessibility) |
| modal, dialog, focus, trap | [Focus Management](#pattern-3-focus-management) |
| announce, status, loading, dynamic | [Dynamic Content Announcements](#pattern-4-dynamic-content-announcements) |
| tabs, accordion, listbox, combobox | [ARIA Widget Patterns](#pattern-5-aria-widget-patterns) |

---

### Pattern 1: Keyboard Operability

**Use when:** Creating any interactive element (buttons, links, custom controls)

**Don't use when:** Element is purely decorative with no user interaction

✅ **Good**

```typescript
// CONTEXT: Interactive submit button
// RULE: Use native HTML elements for built-in keyboard support

<button (click)="submit()">Submit</button>
```

```typescript
// CONTEXT: Custom interactive element that must be non-native
// RULE: Add role, tabindex, and keyboard handlers

<div role="button" 
     tabindex="0" 
     (click)="submit()" 
     (keydown.enter)="submit()" 
     (keydown.space)="submit()">
  Submit
</div>
```

❌ **Bad**

```typescript
// PROBLEM: Div with click handler has no keyboard support

<div (click)="submit()">Submit</div>
```

**Why it's wrong:** Screen reader users and keyboard-only users cannot activate this element. It has no role, is not focusable, and doesn't respond to keyboard events.

**Verify:**
- [ ] Element is focusable via Tab key
- [ ] Element activates with Enter and/or Space
- [ ] Focus indicator is visible (3:1 contrast minimum)
- [ ] No functionality requires mouse-only interaction

---

### Pattern 2: Form Accessibility

**Use when:** Creating any form with input fields

**Don't use when:** N/A — all forms must follow this pattern

✅ **Good**

```typescript
// CONTEXT: Form field with validation
// RULE: Associate labels, describe errors, indicate invalid state

<label for="email">Email Address</label>
<input 
  id="email"
  type="email"
  formControlName="email"
  [attr.aria-invalid]="email.invalid && email.touched"
  aria-describedby="email-error"
>
<span 
  id="email-error"
  role="alert"
  *ngIf="email.invalid && email.touched"
>
  <span *ngIf="email.errors?.required">Email is required.</span>
  <span *ngIf="email.errors?.email">Please enter a valid email.</span>
</span>
```

❌ **Bad**

```typescript
// PROBLEM: No label, using placeholder only, no error association

<input type="email" placeholder="Email">
<div *ngIf="emailError">Invalid email</div>
```

**Why it's wrong:** Placeholder disappears on input (users forget what field is for), no programmatic association between field and error, screen readers cannot announce the error.

**Verify:**
- [ ] Every input has a `<label>` with matching `for`/`id`
- [ ] Error messages use `aria-describedby` to associate with field
- [ ] Invalid fields have `aria-invalid="true"`
- [ ] Error messages use `role="alert"` for immediate announcement

---

### Pattern 3: Focus Management

**Use when:** Opening modals/dialogs, navigating SPAs, showing dynamic content

**Don't use when:** Static content that doesn't change

✅ **Good**

```html
<!-- CONTEXT: Modal dialog component -->
<!-- RULE: Trap focus, support ESC, return focus on close -->

<div 
  role="dialog" 
  aria-modal="true"
  aria-labelledby="dialog-title"
  cdkTrapFocus
  [cdkTrapFocusAutoCapture]="true"
  (keydown.escape)="close()"
>
  <h2 id="dialog-title">{{ title }}</h2>
  <!-- content -->
  <button (click)="close()">Close</button>
</div>
```

```typescript
// Store previous focus, restore on close
private previousActiveElement = document.activeElement as HTMLElement;
close() { this.previousActiveElement?.focus(); }
```

❌ **Bad**

```html
<!-- PROBLEM: No focus trap, no ESC support, no focus restoration -->
<div class="modal">
  <h2>{{ title }}</h2>
  <button (click)="visible = false">Close</button>
</div>
```

**Why it's wrong:** Users can Tab outside modal, ESC doesn't work, focus lost on close.

**Verify:**
- [ ] Focus moves into modal when opened
- [ ] Tab cycles only within modal (focus trap)
- [ ] ESC key closes the modal
- [ ] Focus returns to triggering element on close

---

### Pattern 4: Dynamic Content Announcements

**Use when:** Loading states, success/error messages, live updates

**Don't use when:** Static content or content that receives focus

✅ **Good**

```html
<!-- CONTEXT: Status message announcement -->
<!-- RULE: Use aria-live regions, avoid LiveAnnouncer -->

<!-- Polite announcements (status messages) -->
<div role="status" aria-live="polite" aria-atomic="true">
  {{ statusMessage }}
</div>

<!-- Loading state -->
<div role="status" aria-live="polite" aria-busy="true" *ngIf="loading">
  Loading...
</div>

<!-- Assertive announcements (errors) -->
<div role="alert" aria-live="assertive">
  {{ errorMessage }}
</div>
```

❌ **Bad**

```typescript
// PROBLEM: LiveAnnouncer disrupts screen reader reading order
import { LiveAnnouncer } from '@angular/cdk/a11y';
this.liveAnnouncer.announce('Form submitted successfully');
```

**Why it's wrong:** LiveAnnouncer interrupts screen reader flow. Prefer DOM-based `aria-live` regions.

**Verify:**
- [ ] Status messages use `role="status"` with `aria-live="polite"`
- [ ] Error alerts use `role="alert"` with `aria-live="assertive"`
- [ ] No use of `LiveAnnouncer` from Angular CDK
- [ ] `bbFocus` directive used for focus management

---

### Pattern 5: ARIA Widget Patterns

**Use when:** Building custom widgets (tabs, accordions, comboboxes)

**Don't use when:** Native HTML elements suffice (use `<select>` over custom dropdown)

✅ **Good**

```html
<!-- CONTEXT: Tab interface -->
<!-- RULE: Use proper ARIA roles, states, and keyboard navigation -->

<div role="tablist" aria-label="Account Information">
  <button 
    role="tab"
    [attr.aria-selected]="selectedTab === 'details'"
    [attr.aria-controls]="'details-panel'"
    [attr.tabindex]="selectedTab === 'details' ? 0 : -1"
    (click)="selectTab('details')"
  >
    Details
  </button>
  <button 
    role="tab"
    [attr.aria-selected]="selectedTab === 'transactions'"
    [attr.aria-controls]="'transactions-panel'"
    [attr.tabindex]="selectedTab === 'transactions' ? 0 : -1"
    (click)="selectTab('transactions')"
  >
    Transactions
  </button>
</div>

<div 
  id="details-panel"
  role="tabpanel"
  [hidden]="selectedTab !== 'details'"
  tabindex="0"
>
  Details content
</div>
```

❌ **Bad**

```html
<!-- PROBLEM: Missing ARIA roles, states, and keyboard support -->

<div class="tabs">
  <div class="tab" [class.active]="tab === 'details'" (click)="selectTab('details')">
    Details
  </div>
  <div class="tab" [class.active]="tab === 'transactions'" (click)="selectTab('transactions')">
    Transactions
  </div>
</div>
<div class="panel" *ngIf="tab === 'details'">Details content</div>
```

**Why it's wrong:** Screen readers cannot identify this as a tab interface, cannot announce which tab is selected, and keyboard users cannot navigate between tabs.

**Verify:**
- [ ] Container has `role="tablist"`
- [ ] Tabs have `role="tab"` with `aria-selected` state
- [ ] Panels have `role="tabpanel"` with `aria-labelledby`
- [ ] Only selected tab has `tabindex="0"`, others have `tabindex="-1"`

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `A11Y-001` | No positive tabindex values | 🔴 BLOCKER | `grep -r 'tabindex="[1-9]'` |
| `A11Y-002` | No outline:none without alternative | 🔴 BLOCKER | `grep -r 'outline:\s*none'` (manual review) |
| `A11Y-003` | No LiveAnnouncer usage | 🔴 BLOCKER | `grep -r 'LiveAnnouncer'` |
| `A11Y-004` | Images have alt attribute | 🔴 BLOCKER | `axe-core: image-alt` |
| `A11Y-005` | Form inputs have labels | 🔴 BLOCKER | `axe-core: label` |
| `A11Y-006` | Color contrast sufficient | 🔴 BLOCKER | `axe-core: color-contrast` |
| `A11Y-007` | Buttons have accessible names | 🔴 BLOCKER | `axe-core: button-name` |
| `A11Y-008` | Links have accessible names | 🔴 BLOCKER | `axe-core: link-name` |
| `A11Y-009` | ARIA attributes valid | 🟡 WARNING | `axe-core: aria-valid-attr` |
| `A11Y-010` | Heading hierarchy correct | 🟡 WARNING | `axe-core: heading-order` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `A11Y-R01` | All functionality operable via keyboard alone | 🔴 BLOCKER |
| `A11Y-R02` | Focus order follows logical reading order | 🔴 BLOCKER |
| `A11Y-R03` | Focus indicators visible on all interactive elements | 🔴 BLOCKER |
| `A11Y-R04` | Modal dialogs trap focus and support ESC | 🔴 BLOCKER |
| `A11Y-R05` | Error messages associated with fields via aria-describedby | 🔴 BLOCKER |
| `A11Y-R06` | Dynamic content uses aria-live regions | 🟡 WARNING |
| `A11Y-R07` | Skip link present for main content | 🟡 WARNING |
| `A11Y-R08` | Touch targets minimum 44×44 pixels | 🟡 WARNING |
| `A11Y-R09` | Content reflows at 400% zoom without horizontal scroll | 🟡 WARNING |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Banking applications must comply with accessibility regulations (ADA, Section 508, EN 301 549, EAA). ~15% of global population has disabilities; inaccessible applications create legal risk and exclude users.

### Business Drivers

- Regulatory compliance (ADA, Section 508, EN 301 549, EAA)
- 15% market reach (users with disabilities)
- Legal risk mitigation

### Technical Constraints

- Must work across Chrome, Firefox, Safari, Edge
- Screen reader compatibility (JAWS, NVDA, VoiceOver)
- Performance overhead < 5%

---

## 5. Decision

<!--
LLM: SKIP this section unless user asks about rationale or alternatives.
This section documents WHY the decision was made for human readers.
-->

### What We Decided

Adopt WCAG 2.2 Level AA as mandatory standard with axe-core automated testing in unit tests, Lighthouse CI audits on PRs, and CI/CD gates blocking non-compliant code.

### Rationale

1. **WCAG 2.2 AA**: Industry standard; Level A insufficient, AAA too restrictive
2. **Automated testing**: Catches 30-40% of issues with immediate feedback
3. **CI/CD enforcement**: Prevents accessibility debt accumulation

### Alternatives Considered

| Alternative | Verdict |
|-------------|---------|
| WCAG 2.1 AA | Rejected: Missing modern interaction patterns |
| Manual testing only | Rejected: Not scalable, no CI integration |

---

## 6. Implementation

<!--
LLM: Load selectively - "Affected Components" useful for scoping, rest is reference.
-->

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| All Angular components | MODIFY | `libs/**/src/**/*.component.ts` |
| Form components | MODIFY | `libs/**/*form*.component.ts` |
| Modal/dialog components | MODIFY | `libs/**/*modal*.component.ts`, `*dialog*.component.ts` |
| Jest configuration | MODIFY | `jest.config.ts`, `jest.setup.ts` |
| CI/CD pipeline | CREATE | `.github/workflows/accessibility.yml` |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-000 (Common Angular Patterns) | Reference: Safe DOM Manipulation pattern |
| ADR-013 (Unit/Integration Testing) | Extends: accessibility tests are subset of unit tests |

### Migration Notes

1. Add axe-core tests to component test files
2. Add keyboard handlers to custom interactive elements
3. Associate labels with form inputs
4. Replace LiveAnnouncer with aria-live regions

---

## 7. Examples

### Complete Example

**Scenario:** Accessible form with validation and error handling

```typescript
// File: libs/shared/ui/src/lib/contact-form/contact-form.component.ts

import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  template: `
    <!-- Error Summary -->
    <div 
      *ngIf="form.invalid && submitted"
      role="alert"
      aria-live="assertive"
      tabindex="-1"
      #errorSummary
      class="error-summary"
    >
      <h2>There are errors in the form:</h2>
      <ul>
        <li *ngIf="form.get('name')?.errors?.required">
          <a href="#name">Name is required</a>
        </li>
        <li *ngIf="form.get('email')?.errors?.required">
          <a href="#email">Email is required</a>
        </li>
        <li *ngIf="form.get('email')?.errors?.email">
          <a href="#email">Email format is invalid</a>
        </li>
      </ul>
    </div>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <!-- Name Field -->
      <div class="form-group">
        <label for="name">Name <span aria-hidden="true">*</span></label>
        <input 
          id="name"
          type="text"
          formControlName="name"
          [attr.aria-invalid]="form.get('name')?.invalid && submitted"
          aria-describedby="name-error"
          aria-required="true"
          autocomplete="name"
        >
        <span 
          id="name-error"
          role="alert"
          *ngIf="form.get('name')?.errors?.required && submitted"
        >
          Name is required
        </span>
      </div>

      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email <span aria-hidden="true">*</span></label>
        <input 
          id="email"
          type="email"
          formControlName="email"
          [attr.aria-invalid]="form.get('email')?.invalid && submitted"
          aria-describedby="email-error email-hint"
          aria-required="true"
          autocomplete="email"
        >
        <span id="email-hint" class="hint">We'll never share your email</span>
        <span 
          id="email-error"
          role="alert"
          *ngIf="form.get('email')?.invalid && submitted"
        >
          <span *ngIf="form.get('email')?.errors?.required">Email is required</span>
          <span *ngIf="form.get('email')?.errors?.email">Please enter a valid email</span>
        </span>
      </div>

      <!-- Submit Button -->
      <button type="submit">Submit</button>
    </form>

    <!-- Success Message -->
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
      *ngIf="successMessage"
    >
      {{ successMessage }}
    </div>
  `,
  styles: [`
    .form-group { margin-bottom: 1rem; }
    
    label { display: block; margin-bottom: 0.25rem; }
    
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #666;
    }
    
    input[aria-invalid="true"] {
      border-color: #d32f2f;
    }
    
    [role="alert"] {
      color: #d32f2f;
      font-size: 0.875rem;
    }
    
    button:focus-visible {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
    
    .error-summary {
      border: 2px solid #d32f2f;
      padding: 1rem;
      margin-bottom: 1rem;
    }
  `]
})
export class ContactFormComponent {
  @ViewChild('errorSummary') errorSummary: ElementRef;
  
  form: FormGroup;
  submitted = false;
  successMessage = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.form.invalid) {
      // Move focus to error summary
      setTimeout(() => this.errorSummary?.nativeElement?.focus());
      return;
    }

    this.successMessage = 'Form submitted successfully!';
  }
}
```

### Common Mistakes

**Mistake 1: Using placeholder as label**

```typescript
// ❌ Wrong
<input type="email" placeholder="Enter your email">

// ✅ Fix
<label for="email">Email</label>
<input id="email" type="email" placeholder="e.g., user@example.com">
```

**Mistake 2: Removing focus outlines**

```css
/* ❌ Wrong */
*:focus {
  outline: none;
}

/* ✅ Fix */
*:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}
```

**Mistake 3: Missing keyboard support on custom elements**

```typescript
// ❌ Wrong
<div class="card" (click)="select()">Select this option</div>

// ✅ Fix
<div 
  class="card" 
  role="button"
  tabindex="0"
  (click)="select()"
  (keydown.enter)="select()"
  (keydown.space)="select()"
>
  Select this option
</div>
```

---

## 8. References

### Standards
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — W3C Recommendation (primary standard)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) — Widget patterns
- [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) — ARIA specification

### Tools
- [Angular CDK Accessibility](https://material.angular.io/cdk/a11y/overview) — cdkTrapFocus, FocusMonitor
- [axe-core](https://github.com/dequelabs/axe-core) / [jest-axe](https://github.com/nickcolley/jest-axe) — Automated testing
- [axe DevTools Extension](https://www.deque.com/axe/devtools/) — Browser testing

### Learning
- [WebAIM](https://webaim.org/) — Accessibility guidance
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) — Technical reference

---
