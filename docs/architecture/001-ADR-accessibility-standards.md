# ADR-001: Adopting WCAG 2.2 AA Standards for Front-End Development


## Decision summary

All front-end development at Backbase must comply with WCAG 2.2 Level AA accessibility standards. This decision establishes mandatory accessibility requirements, automated testing gates, code review checklists, and Angular-specific implementation patterns to ensure our application is usable by all users, including those with disabilities. Non-compliance will block merge to main branches.

## Context and problem statement

### Business context
- **Regulatory Compliance:** Banking applications must comply with accessibility regulations (ADA, Section 508, EN 301 549, EAA).
- **Market Reach:** Approximately 15% of the global population has some form of disability; inaccessible applications exclude a significant user base.
- **Legal Risk:** Non-compliant applications expose the organization to legal action and reputational damage.
- **Brand Values:** Commitment to inclusive banking requires accessible digital experiences.
- **Success Criteria:** 
  - Zero critical accessibility violations in production
  - Pass WCAG 2.2 AA automated and manual audits
  - Positive feedback from users with disabilities

### Technical context
- **Existing Landscape:** Current implementation lacks consistent accessibility standards and enforcement
- **Affected Systems:** All Angular applications, UI component library (ui-ang), shared services, and platform utilities
- **Technical Gaps:** 
  - No automated accessibility testing in CI/CD pipeline
  - Inconsistent keyboard navigation patterns
  - Missing ARIA attributes on custom components
  - Insufficient color contrast in some UI elements
  - No formal accessibility code review process

### Constraints and assumptions

**Technical Constraints:**
- Must maintain backward compatibility with existing Angular components
- Cannot introduce breaking changes to public APIs
- Performance overhead from accessibility features must be < 5%
- Must work across all supported browsers (Chrome, Firefox, Safari, Edge)
- Screen reader compatibility required (JAWS, NVDA, VoiceOver)

**Business Constraints:**
- Implementation must not delay current roadmap commitments
- No additional budget for third-party accessibility tools
- Must leverage existing open-source tooling where possible
- Training budget limited to internal knowledge sharing sessions

**Environmental Constraints:**
- Must integrate with existing CI/CD pipeline (Nx workspace)
- Must work within current development toolchain
- Cannot require additional infrastructure provisioning
- Must support both internal and external deployments

**Assumptions Made:**
- Developers have basic HTML/CSS knowledge but limited accessibility expertise
- Design team will provide accessibility-compliant designs going forward
- Manual testing will complement automated checks
- Accessibility requirements will evolve; standards will be reviewed annually
- Angular framework will continue to improve built-in accessibility features

### Affected architecture description elements

**Components:**
- All Angular components in ui-ang design system
- Application-level routing and navigation
- Form controls and validation components
- Modal dialogs and overlays
- Data tables and complex interactive widgets
- Custom directives and pipes
- Shared services (Focus management, Announcements)

**Views:**
- **Development View:** Component library structure, build pipeline, testing frameworks
- **Logical View:** ARIA patterns, keyboard interaction models, focus management architecture
- **Process View:** CI/CD gates, code review workflows, accessibility testing process
- **Physical View:** Browser compatibility, assistive technology support matrix

**Stakeholders:**
- **End Users with Disabilities:** Primary beneficiaries of accessible interfaces
- **Development Teams:** Required to implement and maintain standards
- **QA Teams:** Must validate accessibility compliance
- **Design Teams:** Must create accessible designs
- **Legal/Compliance:** Ensure regulatory requirements are met
- **Product Owners:** Balance accessibility with feature delivery

## Decision

### What we decided

**We will adopt WCAG 2.2 Level AA as the mandatory accessibility standard for all front-end development**, with the following implementation requirements:

1. **Mandatory Automated Testing**
   - axe-core integration in unit tests (via jest-axe)
   - Lighthouse CI accessibility audits on every PR
   - Pre-commit hooks to catch common violations

2. **Code Review Requirements**
   - Accessibility checklist completion mandatory for all PRs
   - At least one reviewer must verify keyboard navigation
   - Focus management verification for dynamic content

3. **Angular-Specific Standards**
   - Mandatory use of Angular CDK accessibility utilities
   - Specific guidance on LiveAnnouncer usage
   - FocusMonitor integration for focus management

4. **Component Library Requirements**
   - All ui-ang components must pass WCAG 2.2 AA
   - Storybook accessibility addon enabled for all stories
   - Accessibility documentation required for each component

5. **Enforcement**
   - CI/CD pipeline blocks on accessibility failures
   - Monthly accessibility audits of deployed applications
   - Quarterly training sessions for all developers

### Rationale

**Why WCAG 2.2 AA:**
- Industry standard for government and enterprise applications
- Level A is insufficient for banking applications
- Level AAA is not realistic for all content types
- WCAG 2.2 includes modern interaction patterns (touch, mobile)

**Why Automated Testing:**
- Catches 30-40% of accessibility issues automatically
- Provides immediate feedback to developers
- Reduces QA burden and speeds up delivery
- Creates documentation of compliance

**Why Angular-Specific Patterns:**
- Leverages framework capabilities for consistency
- Reduces custom implementation bugs
- Provides clear patterns for developers to follow
- Ensures maintainability as Angular evolves

## Implementation details

### Technical approach

#### 1. Automated Testing Integration

**Jest Unit Tests with axe-core:**
```typescript
import { render } from '@testing-library/angular';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('MyComponent Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = await render(MyComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Lighthouse CI Configuration:**
```json
{
  "ci": {
    "collect": {
      "settings": {
        "onlyCategories": ["accessibility"]
      }
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", {"minScore": 0.9}]
      }
    }
  }
}
```

**Pre-commit Hook (Husky):**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "nx affected --target=test:a11y"
    }
  }
}
```

#### 2. Angular CDK Integration

**Focus Management:**
```typescript
import { FocusMonitor } from '@angular/cdk/a11y';

export class MyComponent implements OnInit, OnDestroy {
  constructor(private focusMonitor: FocusMonitor, private elementRef: ElementRef) {}

  ngOnInit() {
    this.focusMonitor.monitor(this.elementRef, true);
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
}
```

**Keyboard Navigation:**
```typescript
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  template: `
    <div cdkTrapFocus [cdkTrapFocusAutoCapture]="true">
      <!-- Modal content -->
    </div>
  `
})
```

**Important: LiveAnnouncer Usage Caution**
```typescript
// ❌ AVOID: LiveAnnouncer can disrupt screen reader order
import { LiveAnnouncer } from '@angular/cdk/a11y';

// ✅ PREFER: Use bbFocus directive and aria-live attributes
@Component({
  template: `
    <div bbFocus>
      <div role="status" aria-live="polite" aria-atomic="true">
        {{ statusMessage }}
      </div>
    </div>
  `
})
```

**LiveAnnouncer should only be used when:**
- Announcements are independent of DOM order
- No focusable element is available for the announcement
- Browser/screen reader order must be explicitly overridden

**In most cases, use instead:**
- `bbFocus` directive to manage focus programmatically
- `aria-live="polite"` or `aria-live="assertive"` regions
- Focus management to move users to updated content

#### 3. Component Requirements

**Mandatory Accessibility Properties:**
```typescript
export interface AccessibleComponent {
  // Keyboard navigation
  onKeyDown(event: KeyboardEvent): void;
  
  // ARIA attributes
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  
  // Focus management
  focus(): void;
  blur(): void;
  
  // Screen reader support
  role?: string;
}
```

**Component Documentation Template:**
```markdown
## Accessibility

### Keyboard Support
| Key | Function |
|-----|----------|
| Tab | Moves focus to/from component |
| Space/Enter | Activates the component |
| Escape | Closes/cancels (if applicable) |

### ARIA Roles and Attributes
- `role`: [role name]
- `aria-label`: [when used]
- `aria-expanded`: [for expandable elements]

### Focus Management
[Description of focus behavior]

### Screen Reader Announcements
[What is announced and when]
```

#### 4. Integration Patterns

**Skip Links:**
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<header><!-- Navigation --></header>
<main id="main-content" tabindex="-1">
  <!-- Main content -->
</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 100;
  padding: 8px;
  background: #000;
  color: #fff;
}

.skip-link:focus {
  top: 0;
}
```

**Focus-Visible Polyfill (Business-app):**
```typescript
// Already integrated in business-app polyfills
import 'focus-visible';
```

```css
/* Use :focus-visible for keyboard-only focus styles */
button:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Hide focus for mouse users */
button:focus:not(:focus-visible) {
  outline: none;
}
```

**Form Validation:**
```html
<label for="email">Email</label>
<input 
  id="email" 
  type="email" 
  aria-describedby="email-error"
  [attr.aria-invalid]="emailControl.invalid && emailControl.touched"
>
<span 
  id="email-error" 
  role="alert" 
  *ngIf="emailControl.invalid && emailControl.touched"
>
  Please enter a valid email address
</span>
```

**Modal Dialog:**
```typescript
@Component({
  template: `
    <div 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="dialog-title"
      cdkTrapFocus
      [cdkTrapFocusAutoCapture]="true"
    >
      <h2 id="dialog-title">{{ title }}</h2>
      <!-- Dialog content -->
      <button (click)="close()" bbFocus>Close</button>
    </div>
  `
})
export class ModalComponent implements OnDestroy {
  private previousActiveElement: HTMLElement;

  ngOnInit() {
    this.previousActiveElement = document.activeElement as HTMLElement;
  }

  close() {
    // Return focus to triggering element
    this.previousActiveElement?.focus();
  }
}
```

### Quality attributes addressed

| Quality Attribute | Requirement | How Decision Addresses It |
|-------------------|-------------|---------------------------|
| **Accessibility** | WCAG 2.2 AA | Mandatory standards, automated testing, code review checklists |
| **Usability** | 100% keyboard operable | Keyboard interaction patterns, focus management, skip links |
| **Compliance** | Legal/regulatory | WCAG 2.2 AA meets ADA, Section 508, EN 301 549, EAA requirements |
| **Maintainability** | Clear patterns | Angular CDK integration, documented components, automated tests |
| **Performance** | < 5% overhead | Lightweight ARIA, efficient focus management, minimal polyfills |
| **Testability** | 80% automated coverage | Jest-axe, Lighthouse CI, Storybook accessibility addon |

## Success metrics

### Technical success criteria
- **Automated Test Coverage:** 100% of components have axe-core tests
- **Zero Critical Violations:** No WCAG 2.2 Level A or AA violations in production
- **Lighthouse Score:** All pages achieve accessibility score ≥ 90
- **Build Pipeline:** Accessibility tests complete in < 3 minutes
- **Test Pass Rate:** < 5% false positive rate from automated tests
- **Component Documentation:** 100% of ui-ang components have accessibility docs

### Business success criteria
- **Legal Risk:** Zero accessibility-related legal complaints or regulatory findings
- **User Satisfaction:** Positive feedback from users with disabilities (via surveys)
- **Market Reach:** Enable onboarding for users with assistive technologies
- **Audit Results:** Pass external WCAG 2.2 AA audit with no major findings
- **Training Completion:** 100% of developers complete accessibility training
- **Time to Market:** Development time increase stabilizes at < 5% after 6 months

### Monitoring and measurement
- **Weekly:** CI/CD accessibility test results dashboard
- **Monthly:** 
  - Component library accessibility compliance report
  - Lighthouse scores for all deployed applications
  - Developer survey on accessibility tooling effectiveness
- **Quarterly:**
  - Manual accessibility audit of key user flows
  - Screen reader compatibility testing
  - Review of accessibility-related support tickets
- **Annually:**
  - External WCAG 2.2 AA audit
  - Review and update standards based on new WCAG releases
  - Assess training program effectiveness

## Mandatory Requirements by Category

### 1. Keyboard and Input Devices

#### 1.1 Keyboard Operability (WCAG 2.1.1 - Level A)
**Requirement:** All functionality must be operable via keyboard.

**Implementation:**
- ✅ Use native HTML elements (`<button>`, `<a>`, `<input>`) over `<div>`/`<span>`
- ✅ Custom components must handle keyboard events (Enter, Space, Arrow keys, Escape)
- ✅ No functionality requires mouse-only interaction

**Code Example:**
```typescript
// ✅ CORRECT: Native button
<button (click)="submit()">Submit</button>

// ❌ INCORRECT: Div with click handler
<div (click)="submit()">Submit</div>

// ✅ ACCEPTABLE: Div with proper ARIA and keyboard support
<div role="button" tabindex="0" 
     (click)="submit()" 
     (keydown.enter)="submit()" 
     (keydown.space)="submit()">
  Submit
</div>
```

**Testing:**
```bash
# Manual: Tab through entire page, use Space/Enter to activate
# Automated: jest-axe will catch missing keyboard support
```

#### 1.2 Visible Focus Indicator (WCAG 2.4.7 - Level AA)
**Requirement:** Keyboard focus must be clearly visible with minimum 3:1 contrast ratio.

**Implementation:**
```css
/* ✅ CORRECT: Use :focus-visible for keyboard-only focus */
*:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Hide focus for mouse/touch users */
*:focus:not(:focus-visible) {
  outline: none;
}

/* ❌ INCORRECT: Never do this */
*:focus {
  outline: none; /* Removes focus indicator */
}
```

**Design Requirements:**
- Focus indicator must have ≥ 3:1 contrast against background
- Minimum 2px outline or equivalent visual indicator
- Focus indicator must be visible on all interactive elements

**Verification:**
- Use Color Contrast Analyzer to verify focus indicator contrast
- Tab through interface and visually verify all focus states
- Test in high contrast mode

#### 1.3 Logical Focus Order (WCAG 2.4.3 - Level A)
**Requirement:** Focus order must follow logical reading order (left-to-right, top-to-bottom).

**Implementation:**
```html
<!-- ✅ CORRECT: Logical DOM order matches visual order -->
<nav><!-- Navigation --></nav>
<main><!-- Main content --></main>
<aside><!-- Sidebar --></aside>

<!-- ❌ INCORRECT: Using positive tabindex -->
<button tabindex="3">Third</button>
<button tabindex="1">First</button>
<button tabindex="2">Second</button>
```

**Rules:**
- Never use positive `tabindex` values (tabindex="1", tabindex="2", etc.)
- Use `tabindex="0"` to add elements to natural tab order
- Use `tabindex="-1"` for programmatic focus only (not in tab order)
- Ensure visual order matches DOM order

**Focus Management for Dynamic Content:**
```typescript
// ✅ Move focus to error summary
if (formInvalid) {
  this.errorSummary.nativeElement.focus();
}

// ✅ Move focus to modal when opened
ngAfterViewInit() {
  this.modalElement.nativeElement.focus();
}

// ✅ Return focus to trigger when modal closes
closeModal() {
  this.triggerElement.nativeElement.focus();
}
```

#### 1.4 No Keyboard Trap (WCAG 2.1.2 - Level A)
**Requirement:** Users must be able to exit all components using keyboard alone.

**Implementation:**
```typescript
// ✅ CORRECT: Modal with escape key support
@Component({
  template: `
    <div role="dialog" 
         (keydown.escape)="close()"
         cdkTrapFocus>
      <!-- Modal content -->
      <button (click)="close()">Close</button>
    </div>
  `
})
```

**Common Issues:**
- Modals that can't be closed with Escape key
- Infinite scroll iframes requiring excessive tabbing
- Video players without keyboard controls

#### 1.5 Touch Target Size (WCAG 2.5.5 - Level AAA, Best Practice)
**Requirement:** Touch targets should be minimum 44×44 CSS pixels.

**Implementation:**
```css
/* ✅ Ensure minimum target size */
button, a, input, select {
  min-width: 44px;
  min-height: 44px;
  /* Or use padding to expand hit area */
  padding: 12px 16px;
}

/* Ensure spacing between targets */
.button-group > * + * {
  margin-left: 8px;
}
```

**Testing:**
- Use Adrian Roselli's Touch Target Bookmarklet
- Test on mobile devices

#### 1.6 No Context Change on Focus (WCAG 3.2.1 - Level A)
**Requirement:** Receiving focus must not automatically trigger context changes.

**Implementation:**
```typescript
// ❌ INCORRECT: Auto-submit on focus
<input (focus)="submitForm()">

// ❌ INCORRECT: Auto-navigate on focus
<a (focus)="navigate()">

// ✅ CORRECT: Require explicit activation
<input (change)="updateValue()">
<button (click)="submitForm()">Submit</button>
```

### 2. Magnification and Contrast

#### 2.1 Reflow at 400% Zoom (WCAG 1.4.10 - Level AA)
**Requirement:** Content must be usable at 400% zoom (320px viewport width at 1280px).

**Implementation:**
```css
/* ✅ Use responsive units */
.container {
  max-width: 100%;
  padding: 1rem;
}

/* ✅ Use min-height instead of fixed height */
.card {
  min-height: 200px; /* Instead of height: 200px */
}

/* ✅ Allow text wrapping */
.text {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* ❌ Avoid fixed dimensions */
.hero {
  height: 400px; /* May break at zoom */
}
```

**Testing:**
- Zoom browser to 400% (Cmd/Ctrl + multiple times)
- Verify no horizontal scrolling
- Verify all content is reachable
- Test with responsive design mode at 320px width

#### 2.2 Text Resize to 200% (WCAG 1.4.4 - Level AA)
**Requirement:** Text must be readable when resized to 200%.

**Implementation:**
```css
/* ✅ Use relative units */
body {
  font-size: 16px; /* Base size */
}

h1 {
  font-size: 2rem; /* Scales with zoom */
}

p {
  font-size: 1rem;
  line-height: 1.5;
}

/* ❌ Don't use fixed pixel sizes for text */
.small-text {
  font-size: 10px; /* May be unreadable when zoomed */
}
```

#### 2.3 Text Spacing (WCAG 1.4.12 - Level AA)
**Requirement:** Content must not break when users override text spacing.

**Implementation:**
```css
/* ✅ User must be able to set: */
* {
  line-height: 1.5; /* Minimum */
  letter-spacing: 0.12em; /* Minimum */
  word-spacing: 0.16em; /* Minimum */
}

p {
  margin-bottom: 2em; /* Paragraph spacing */
}

/* ✅ Use min-height to prevent overflow */
.text-container {
  min-height: 100px;
  overflow: visible;
}
```

**Testing:**
```javascript
// Bookmarklet to test text spacing
javascript:(function(){
  document.body.style.lineHeight='1.5';
  document.body.style.letterSpacing='0.12em';
  document.body.style.wordSpacing='0.16em';
  document.querySelectorAll('p').forEach(p=>p.style.marginBottom='2em');
})();
```

#### 2.4 Color Contrast (WCAG 1.4.3 - Level AA)
**Requirement:** Minimum contrast ratios:
- **4.5:1** for normal text (< 24px or < 19px bold)
- **3:1** for large text (≥ 24px or ≥ 19px bold)
- **3:1** for UI components and graphics

**Implementation:**
```css
/* ✅ CORRECT: Sufficient contrast */
.text-primary {
  color: #000000; /* Black on white = 21:1 */
  background: #ffffff;
}

.text-secondary {
  color: #595959; /* 7:1 on white */
  background: #ffffff;
}

/* ❌ INCORRECT: Insufficient contrast */
.text-light-gray {
  color: #cccccc; /* Only 1.6:1 on white */
  background: #ffffff;
}
```

**Tools:**
- Color Contrast Analyzer (Desktop app)
- Chrome DevTools Accessibility Panel
- axe DevTools browser extension

**Verification:**
```typescript
// Automated contrast checking in Lighthouse CI
// Will fail if contrast ratios don't meet AA standards
```

#### 2.5 No Images of Text (WCAG 1.4.5 - Level AA)
**Requirement:** Use real text instead of images of text (except logos).

**Implementation:**
```html
<!-- ❌ INCORRECT: Text in image -->
<img src="heading-text.png" alt="Welcome to our site">

<!-- ✅ CORRECT: Real text with custom font -->
<h1 style="font-family: 'CustomFont', sans-serif;">
  Welcome to our site
</h1>

<!-- ✅ ACCEPTABLE: Logo as image -->
<img src="logo.png" alt="Company Name">
```

#### 2.6 Content on Hover/Focus (WCAG 1.4.13 - Level AA)
**Requirement:** Additional content on hover/focus must be dismissible, hoverable, and persistent.

**Implementation:**
```typescript
@Component({
  template: `
    <button 
      (mouseenter)="showTooltip()"
      (mouseleave)="hideTooltip()"
      (focus)="showTooltip()"
      (blur)="hideTooltip()"
      (keydown.escape)="hideTooltip()"
      aria-describedby="tooltip-1"
    >
      Help
    </button>
    
    <div 
      id="tooltip-1"
      role="tooltip"
      *ngIf="tooltipVisible"
      (mouseenter)="keepTooltipOpen()"
      (mouseleave)="hideTooltip()"
    >
      {{ tooltipContent }}
    </div>
  `
})
```

**Requirements:**
- **Dismissible:** ESC key must close tooltip without moving focus
- **Hoverable:** User can move mouse to tooltip content
- **Persistent:** Tooltip stays visible until dismissed or focus moves

### 3. Screen Readers

#### 3.1 Language Codes (WCAG 3.1.1 - Level A, WCAG 3.1.2 - Level AA)
**Requirement:** Page language must be specified; language changes must be marked.

**Implementation:**
```html
<!-- ✅ Page language -->
<html lang="en">

<!-- ✅ Language changes -->
<p>The French word for hello is <span lang="fr">bonjour</span>.</p>

<blockquote lang="es">
  <p>Hola mundo</p>
</blockquote>
```

#### 3.2 Page Titles (WCAG 2.4.2 - Level A)
**Requirement:** Pages must have descriptive titles.

**Format:** `[Page Name] | [Section] | [Application Name]`

**Implementation:**
```typescript
// Angular Title Service
constructor(private titleService: Title) {}

ngOnInit() {
  this.titleService.setTitle('Account Details | Accounts | Banking');
}

// Route configuration
{
  path: 'account/:id',
  component: AccountDetailsComponent,
  data: { title: 'Account Details | Accounts | Banking' }
}
```

#### 3.3 Landmarks (WCAG 1.3.1 - Level A)
**Requirement:** Use ARIA landmarks to define page regions.

**Implementation:**
```html
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation links -->
  </nav>
  <div role="search">
    <!-- Search form -->
  </div>
</header>

<main role="main" id="main-content" tabindex="-1">
  <!-- Main content -->
</main>

<aside role="complementary">
  <!-- Sidebar content -->
</aside>

<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

**Key Landmarks:**
- `banner` - Site header (one per page)
- `navigation` - Navigation links (multiple allowed, use aria-label to differentiate)
- `search` - Search functionality
- `main` - Main content (one per page)
- `complementary` - Sidebar/supporting content
- `contentinfo` - Footer (one per page)

#### 3.4 Headings (WCAG 1.3.1, 2.4.6 - Level AA)
**Requirement:** Use proper heading hierarchy (h1-h6) without skipping levels.

**Implementation:**
```html
<!-- ✅ CORRECT: Logical heading structure -->
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>

<!-- ❌ INCORRECT: Skipped level -->
<h1>Page Title</h1>
  <h3>Section 1</h3> <!-- Skipped h2 -->
```

**Rules:**
- One `<h1>` per page
- Don't skip heading levels
- Don't use headings for styling (use CSS)
- Use aria-label or aria-labelledby if visual heading isn't appropriate

#### 3.5 Lists (WCAG 1.3.1 - Level A)
**Requirement:** Use proper list markup for lists.

**Implementation:**
```html
<!-- ✅ Unordered list -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<!-- ✅ Ordered list -->
<ol>
  <li>Step 1</li>
  <li>Step 2</li>
</ol>

<!-- ✅ Description list -->
<dl>
  <dt>Term</dt>
  <dd>Definition</dd>
</dl>

<!-- ❌ INCORRECT: Fake list -->
<div>• Item 1</div>
<div>• Item 2</div>
```

#### 3.6 Data Tables (WCAG 1.3.1 - Level A)
**Requirement:** Tables must have proper headers and structure.

**Implementation:**
```html
<!-- ✅ Simple table -->
<table>
  <caption>Account Summary</caption>
  <thead>
    <tr>
      <th scope="col">Account</th>
      <th scope="col">Balance</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Checking</th>
      <td>$1,250.00</td>
      <td>Active</td>
    </tr>
  </tbody>
</table>

<!-- ✅ Complex table with headers -->
<table>
  <caption>Quarterly Sales</caption>
  <thead>
    <tr>
      <th id="region" scope="col">Region</th>
      <th id="q1" scope="col">Q1</th>
      <th id="q2" scope="col">Q2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="north" scope="row">North</th>
      <td headers="north q1">$100K</td>
      <td headers="north q2">$120K</td>
    </tr>
  </tbody>
</table>
```

**Requirements:**
- Use `<caption>` to describe table
- Use `<th>` for headers with `scope` attribute
- Use `headers` attribute for complex relationships
- Don't use tables for layout

#### 3.7 Form Labels (WCAG 1.3.1, 3.3.2 - Level A)
**Requirement:** All form inputs must have associated labels.

**Implementation:**
```html
<!-- ✅ CORRECT: Explicit label -->
<label for="email">Email Address</label>
<input id="email" type="email" name="email">

<!-- ✅ CORRECT: Implicit label -->
<label>
  Email Address
  <input type="email" name="email">
</label>

<!-- ✅ Additional information -->
<label for="password">Password</label>
<input 
  id="password" 
  type="password"
  aria-describedby="password-hint"
>
<div id="password-hint">
  Must be at least 8 characters
</div>

<!-- ❌ INCORRECT: No label -->
<input type="email" placeholder="Email">
```

**For Angular Forms:**
```typescript
@Component({
  template: `
    <label for="accountNumber">Account Number</label>
    <input 
      id="accountNumber"
      type="text"
      formControlName="accountNumber"
      [attr.aria-invalid]="accountNumber.invalid && accountNumber.touched"
      aria-describedby="accountNumber-error"
    >
    <div 
      id="accountNumber-error"
      role="alert"
      *ngIf="accountNumber.invalid && accountNumber.touched"
    >
      {{ getErrorMessage('accountNumber') }}
    </div>
  `
})
```

#### 3.8 Error Identification (WCAG 3.3.1 - Level A)
**Requirement:** Errors must be identified and described in text.

**Implementation:**
```typescript
@Component({
  template: `
    <!-- Error summary -->
    <div 
      *ngIf="form.invalid && form.touched"
      role="alert"
      aria-live="assertive"
      tabindex="-1"
      #errorSummary
    >
      <h2>There are {{ errorCount }} errors in the form:</h2>
      <ul>
        <li *ngFor="let error of errors">
          <a [href]="'#' + error.field">{{ error.message }}</a>
        </li>
      </ul>
    </div>

    <!-- Individual field errors -->
    <label for="email">Email</label>
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
  `
})
export class FormComponent {
  onSubmit() {
    if (this.form.invalid) {
      // Move focus to error summary
      this.errorSummary.nativeElement.focus();
    }
  }
}
```

#### 3.9 Error Suggestions (WCAG 3.3.3 - Level AA)
**Requirement:** Provide suggestions for correcting errors (unless it compromises security).

**Implementation:**
```html
<!-- ✅ Helpful error messages -->
<div role="alert">
  <strong>Error:</strong> Phone number must be in format: (555) 555-5555
</div>

<div role="alert">
  <strong>Error:</strong> Date must be between 01/01/2020 and 12/31/2023
</div>

<!-- ❌ Unhelpful error message -->
<div role="alert">Invalid input</div>

<!-- ✅ ACCEPTABLE: Security-conscious message -->
<div role="alert">
  Username or password is incorrect. Please try again.
</div>
```

#### 3.10 Alternative Text (WCAG 1.1.1 - Level A)
**Requirement:** Non-text content must have text alternatives.

**Informative Images:**
```html
<!-- ✅ CORRECT: Descriptive alt text -->
<img src="chart.png" alt="Bar chart showing 25% increase in sales from Q1 to Q2">

<!-- ✅ CORRECT: Alt text in context -->
<a href="report.pdf">
  <img src="pdf-icon.png" alt=""> <!-- Empty alt, link text provides context -->
  Annual Report 2023
</a>
```

**Decorative Images:**
```html
<!-- ✅ CORRECT: Null alt for decorative images -->
<img src="decorative-border.png" alt="">
<div role="presentation"><img src="decorative.png"></div>
```

**Functional Images:**
```html
<!-- ✅ CORRECT: Describe action, not image -->
<button>
  <img src="search-icon.png" alt="Search">
</button>

<a href="home">
  <img src="home-icon.png" alt="Go to home page">
</a>
```

**SVG Images:**
```html
<!-- ✅ For decorative SVG -->
<svg role="presentation" focusable="false">
  <path d="..."/>
</svg>

<!-- ✅ For functional SVG -->
<svg role="img" focusable="false" aria-labelledby="icon-title">
  <title id="icon-title">Search</title>
  <path d="..."/>
</svg>
```

**Complex Images (Charts, Diagrams):**
```html
<!-- ✅ Provide data table alternative -->
<figure>
  <img src="sales-chart.png" alt="Sales trends chart">
  <details>
    <summary>View data table</summary>
    <table>
      <caption>Sales Data</caption>
      <!-- Full data table -->
    </table>
  </details>
</figure>
```

#### 3.11 ARIA Patterns (WCAG 4.1.2 - Level A)
**Requirement:** Custom components must use proper ARIA roles, states, and properties.

**Common Patterns:**

**Accordion:**
```html
<div class="accordion">
  <h3>
    <button 
      id="accordion-header-1"
      aria-expanded="false"
      aria-controls="accordion-panel-1"
      (click)="toggle()"
    >
      Section Title
    </button>
  </h3>
  <div 
    id="accordion-panel-1"
    role="region"
    aria-labelledby="accordion-header-1"
    [hidden]="!isExpanded"
  >
    Content
  </div>
</div>
```

**Tabs:**
```html
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

**Dialog:**
```html
<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure you want to proceed?</p>
  <button (click)="confirm()">Yes</button>
  <button (click)="cancel()">No</button>
</div>
```

**Combobox (Autocomplete):**
```html
<label for="country">Country</label>
<input 
  id="country"
  type="text"
  role="combobox"
  aria-autocomplete="list"
  aria-expanded="false"
  aria-controls="country-listbox"
  (input)="onSearch($event)"
  (keydown)="onKeyDown($event)"
>
<ul 
  id="country-listbox"
  role="listbox"
  [hidden]="!showResults"
>
  <li 
    *ngFor="let country of filteredCountries; let i = index"
    role="option"
    [id]="'country-' + i"
    [attr.aria-selected]="i === selectedIndex"
  >
    {{ country.name }}
  </li>
</ul>
```

#### 3.12 Live Regions (WCAG 4.1.3 - Level AA)
**Requirement:** Status messages must be announced to screen readers.

**Implementation:**
```html
<!-- ✅ Polite announcement (doesn't interrupt) -->
<div role="status" aria-live="polite" aria-atomic="true">
  {{ statusMessage }}
</div>

<!-- ✅ Assertive announcement (interrupts) -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  {{ errorMessage }}
</div>

<!-- ✅ Loading state -->
<div 
  role="status" 
  aria-live="polite"
  aria-busy="true"
  *ngIf="loading"
>
  Loading...
</div>
```

**Angular Implementation:**
```typescript
@Component({
  template: `
    <div bbFocus>
      <div role="status" aria-live="polite" aria-atomic="true">
        {{ statusMessage }}
      </div>
    </div>
  `
})
export class StatusComponent {
  statusMessage: string;

  showStatus(message: string) {
    // Update message - screen reader will announce
    this.statusMessage = message;
    
    // Clear after 5 seconds
    setTimeout(() => {
      this.statusMessage = '';
    }, 5000);
  }
}
```

**IMPORTANT: Avoid LiveAnnouncer (see section 1.2 Angular CDK Integration)**

#### 3.13 Autocomplete Tokens (WCAG 1.3.5 - Level AA)
**Requirement:** Use autocomplete attributes for personal information fields.

**Implementation:**
```html
<form>
  <label for="name">Name</label>
  <input id="name" type="text" autocomplete="name">
  
  <label for="email">Email</label>
  <input id="email" type="email" autocomplete="email">
  
  <label for="tel">Phone</label>
  <input id="tel" type="tel" autocomplete="tel">
  
  <label for="address">Street Address</label>
  <input id="address" type="text" autocomplete="street-address">
  
  <label for="city">City</label>
  <input id="city" type="text" autocomplete="address-level2">
  
  <label for="postal">Postal Code</label>
  <input id="postal" type="text" autocomplete="postal-code">
  
  <label for="country">Country</label>
  <select id="country" autocomplete="country">
    <option>United States</option>
  </select>
</form>
```

**Common Tokens:**
- `name` - Full name
- `given-name` - First name
- `family-name` - Last name
- `email` - Email address
- `tel` - Phone number
- `street-address` - Full street address
- `address-level1` - State/Province
- `address-level2` - City
- `postal-code` - ZIP/Postal code
- `country` - Country

### 4. Motion and Animation

#### 4.1 Pause, Stop, Hide (WCAG 2.2.2 - Level A)
**Requirement:** Auto-updating content must have controls to pause, stop, or hide.

**Implementation:**
```typescript
@Component({
  template: `
    <div class="carousel">
      <button 
        (click)="toggleAutoPlay()"
        aria-label="{{ isPlaying ? 'Pause' : 'Play' }} carousel"
      >
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      
      <!-- Carousel content -->
    </div>
  `
})
export class CarouselComponent {
  isPlaying = false; // Start paused
  
  toggleAutoPlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }
}
```

**Best Practice:** Avoid auto-rotating carousels entirely. If required:
- Start paused by default
- Pause on hover/focus
- Provide clear pause/play controls
- Ensure controls are keyboard accessible

#### 4.2 No Auto-Playing Audio (WCAG 1.4.2 - Level A)
**Requirement:** Audio that plays automatically must stop after 3 seconds or have a control.

**Implementation:**
```html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

<!-- ❌ INCORRECT: Autoplay without controls -->
<audio autoplay src="audio.mp3"></audio>
```

### 5. Time and Session Management

#### 5.1 Timing Adjustable (WCAG 2.2.1 - Level A)
**Requirement:** Users must be warned before time limits and given options to extend.

**Implementation:**
```typescript
@Component({
  template: `
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeout-title"
      *ngIf="showTimeoutWarning"
    >
      <h2 id="timeout-title">Session Timeout Warning</h2>
      <p>Your session will expire in {{ secondsRemaining }} seconds.</p>
      <button (click)="extendSession()">Continue Session</button>
      <button (click)="logout()">Log Out</button>
    </div>
  `
})
export class TimeoutWarningComponent {
  showTimeoutWarning = false;
  secondsRemaining = 60;
  
  ngOnInit() {
    // Show warning 2 minutes before timeout
    setTimeout(() => {
      this.showWarning();
    }, this.sessionDuration - 120000);
  }
  
  showWarning() {
    this.showTimeoutWarning = true;
    // Announce to screen readers
    this.liveRegion.nativeElement.textContent = 
      'Warning: Your session will expire soon';
  }
}
```

## Code Review Checklist

Every pull request touching UI components must complete this checklist:

### Keyboard Accessibility
- [ ] All functionality can be operated with keyboard alone (no mouse required)
- [ ] Tab order is logical (left-to-right, top-to-bottom)
- [ ] Focus indicators are clearly visible on all interactive elements
- [ ] No positive tabindex values used (tabindex="1", "2", etc.)
- [ ] Custom components handle keyboard events (Enter, Space, Escape, Arrows)
- [ ] Keyboard focus doesn't get trapped in any component
- [ ] Skip link is present and functional (if applicable)
- [ ] Modal/dialog can be closed with Escape key
- [ ] No unexpected context changes on focus

### Screen Reader Support
- [ ] All images have appropriate alt text (or alt="" for decorative)
- [ ] Form inputs have associated labels (not placeholder text)
- [ ] ARIA roles are used correctly on custom components
- [ ] ARIA states (aria-expanded, aria-selected) update dynamically
- [ ] ARIA properties (aria-label, aria-describedby) are present where needed
- [ ] Headings follow logical hierarchy (h1, h2, h3 - no skipping)
- [ ] Landmarks are used (header, nav, main, aside, footer)
- [ ] Lists use proper markup (ul, ol, li)
- [ ] Tables have proper headers and structure
- [ ] Page title is descriptive and unique
- [ ] Language is set on html element and language changes are marked
- [ ] Live regions used for dynamic content announcements
- [ ] Error messages are associated with form fields (aria-describedby)
- [ ] Required fields are marked with aria-required or required attribute

### Visual Design
- [ ] Color contrast meets WCAG AA requirements (4.5:1 for text, 3:1 for large text/UI)
- [ ] Information is not conveyed by color alone
- [ ] Focus indicators have 3:1 contrast against background
- [ ] Text can resize to 200% without loss of content
- [ ] Content reflows at 400% zoom without horizontal scrolling
- [ ] No images of text (except logos)
- [ ] Touch targets are minimum 44×44 pixels (mobile)
- [ ] Sufficient spacing between touch targets

### Dynamic Content
- [ ] Loading states have aria-busy and announcements
- [ ] Error messages appear in aria-live regions or receive focus
- [ ] Success messages are announced to screen readers
- [ ] Tooltips/popovers can be dismissed with Escape key
- [ ] Tooltips remain visible when hovered
- [ ] Modal dialogs trap focus correctly
- [ ] Focus returns to trigger element when modal closes
- [ ] Single page app route changes move focus to new content

### Forms
- [ ] All form controls have labels
- [ ] Required fields are clearly indicated
- [ ] Error messages are clear and specific
- [ ] Errors are announced to screen readers
- [ ] Error summary links to fields with errors
- [ ] Autocomplete attributes used for personal information
- [ ] Form validation doesn't happen on input (only on blur/submit)

### Angular-Specific
- [ ] Angular CDK a11y utilities used where appropriate (FocusMonitor, A11yModule)
- [ ] LiveAnnouncer avoided in favor of bbFocus + aria-live
- [ ] focus-visible polyfill active for Safari support
- [ ] SVGs have focusable="false" to prevent IE focus issues
- [ ] Custom form controls implement ControlValueAccessor

### Testing
- [ ] Unit tests include axe-core accessibility checks
- [ ] Manual keyboard testing completed
- [ ] Manual screen reader testing completed (or scheduled)
- [ ] Component tested at 200% and 400% zoom
- [ ] Component tested with text spacing overrides
- [ ] Lighthouse accessibility score ≥ 90

### Documentation
- [ ] Component accessibility documentation updated (keyboard support, ARIA)
- [ ] Storybook story includes accessibility notes
- [ ] Breaking accessibility changes noted in PR description

## Automated Testing Requirements

### 1. Unit Tests with jest-axe

**Installation:**
```bash
npm install --save-dev jest-axe @types/jest-axe
```

**Configuration (jest.config.js):**
```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // ... other config
};
```

**Setup (jest.setup.ts):**
```typescript
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
```

**Test Template:**
```typescript
import { render } from '@testing-library/angular';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MyComponent } from './my-component';

expect.extend(toHaveNoViolations);

describe('MyComponent Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = await render(MyComponent, {
      componentProperties: {
        // props
      }
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have no violations in error state', async () => {
    const { container } = await render(MyComponent, {
      componentProperties: {
        error: true,
        errorMessage: 'This field is required'
      }
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should support keyboard navigation', async () => {
    const { container } = await render(MyComponent);
    const button = container.querySelector('button');
    
    button?.focus();
    expect(document.activeElement).toBe(button);
    
    // Test keyboard events
    button?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    // Assert expected behavior
  });
});
```

**Custom axe Configuration:**
```typescript
// For specific rule configuration
const results = await axe(container, {
  rules: {
    'color-contrast': { enabled: true },
    'label': { enabled: true },
    'button-name': { enabled: true }
  }
});

// To exclude specific elements
const results = await axe(container, {
  exclude: [['.third-party-widget']]
});
```

### 2. Lighthouse CI

**Installation:**
```bash
npm install --save-dev @lhci/cli
```

**Configuration (lighthouserc.json):**
```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start",
      "url": [
        "http://localhost:4200",
        "http://localhost:4200/accounts",
        "http://localhost:4200/transactions"
      ],
      "numberOfRuns": 3,
      "settings": {
        "onlyCategories": ["accessibility"],
        "skipAudits": ["uses-http2"]
      }
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "color-contrast": ["error", {"minScore": 1}],
        "button-name": ["error", {"minScore": 1}],
        "label": ["error", {"minScore": 1}],
        "link-name": ["error", {"minScore": 1}],
        "image-alt": ["error", {"minScore": 1}],
        "aria-required-attr": ["error", {"minScore": 1}],
        "aria-valid-attr": ["error", {"minScore": 1}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**CI/CD Integration (GitHub Actions):**
```yaml
name: Lighthouse CI
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm install -g @lhci/cli
      - run: lhci autorun
```

**Nx Integration:**
```json
// project.json
{
  "targets": {
    "lighthouse": {
      "executor": "@nrwl/workspace:run-commands",
      "options": {
        "commands": [
          "lhci autorun"
        ]
      }
    }
  }
}
```

### 3. Storybook Accessibility Addon

**Installation:**
```bash
npm install --save-dev @storybook/addon-a11y
```

**Configuration (.storybook/main.js):**
```javascript
module.exports = {
  addons: [
    '@storybook/addon-a11y'
  ]
};
```

**Story Configuration:**
```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { MyComponent } from './my-component';

const meta: Meta<MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true
          }
        ]
      },
      // Add manual checks reminder
      manual: true
    }
  }
};

export default meta;
type Story = StoryObj<MyComponent>;

export const Default: Story = {
  args: {
    label: 'Click me'
  }
};

export const ErrorState: Story = {
  args: {
    label: 'Submit',
    error: true,
    errorMessage: 'This field is required'
  },
  parameters: {
    a11y: {
      // Ensure error states are tested
      element: '.component-wrapper'
    }
  }
};
```

### 4. Pre-commit Hooks

**Installation:**
```bash
npm install --save-dev husky lint-staged
```

**Configuration (package.json):**
```json
{
  "lint-staged": {
    "*.{ts,tsx,html}": [
      "nx affected --target=test:a11y --uncommitted",
      "eslint --fix"
    ]
  }
}
```

**Husky Setup:**
```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### 5. ESLint Plugin

**Installation:**
```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

**Configuration (.eslintrc.json):**
```json
{
  "plugins": ["jsx-a11y"],
  "extends": ["plugin:jsx-a11y/recommended"],
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/no-autofocus": "warn"
  }
}
```

### 6. CI/CD Pipeline Integration

**Nx Affected Commands:**
```bash
# Run accessibility tests only on affected projects
nx affected --target=test:a11y

# Run Lighthouse on affected apps
nx affected --target=lighthouse
```

**Pipeline Configuration:**
```yaml
# .github/workflows/ci.yml
name: CI

on: [pull_request]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run accessibility tests
        run: npx nx affected --target=test:a11y --base=origin/main
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
      
      - name: Upload Lighthouse results
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-results
          path: .lighthouseci/
```

## References

### Authoritative sources
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - W3C Recommendation, October 2023
- [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) - W3C Recommendation
- [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) - W3C Working Group
- [Section 508](https://www.section508.gov/) - U.S. Federal Accessibility Standards
- [EN 301 549](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf) - European Accessibility Standard
- [ADA Standards](https://www.ada.gov/2010ADAstandards_index.htm) - Americans with Disabilities Act

### Technical references
- [Angular CDK Accessibility](https://material.angular.io/cdk/a11y/overview) - Version 17.x
- [axe-core](https://github.com/dequelabs/axe-core) - v4.8+
- [jest-axe](https://github.com/nickcolley/jest-axe) - v8.0+
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - v0.12+
- [focus-visible polyfill](https://github.com/WICG/focus-visible) - v5.2+
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro/) - v14+

### Testing and validation tools
- [Color Contrast Analyser](https://developer.paciellogroup.com/resources/contrastanalyser/) - Desktop application
- [axe DevTools Browser Extension](https://www.deque.com/axe/devtools/) - Free browser extension
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome DevTools
- [NVDA Screen Reader](https://www.nvaccess.org/) - Free Windows screen reader
- [JAWS Screen Reader](https://www.freedomscientific.com/products/software/jaws/) - Commercial Windows screen reader
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) - Built into macOS/iOS
- [Adrian Roselli Touch Target Bookmarklet](https://codepen.io/aardrian/pen/eYZWNyv)

### Learning resources
- [WebAIM](https://webaim.org/) - Web Accessibility In Mind
- [The A11Y Project](https://www.a11yproject.com/) - Community-driven accessibility resource
- [Inclusive Components](https://inclusive-components.design/) - Component patterns by Heydon Pickering
- [Accessible App](https://accessible-app.com/) - SPA accessibility patterns
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility) - Mozilla Developer Network
- [Google Web Fundamentals: Accessibility](https://developers.google.com/web/fundamentals/accessibility)
- [Deque University](https://dequeuniversity.com/) - Accessibility training platform

### Standards compliance
- ISO/IEC/IEEE 42010:2022 - Systems and software engineering — Architecture description
- WCAG 2.2 Level AA - Web Content Accessibility Guidelines
- Section 508 (U.S. Federal) - Rehabilitation Act
- EN 301 549 (European) - Accessibility requirements for ICT products and services
- ADA (U.S.) - Americans with Disabilities Act

### Internal documentation
- `docs/ADRs/accessibility.md` - Original guidance document
- `.cursor/rules/rule-creation-guidelines.mdc` - Rule documentation standards
- [Storybook Documentation](http://localhost:6006) - Component accessibility documentation

## Quick Reference

### Common WCAG 2.2 AA Violations and Fixes

| Violation | Fix |
|-----------|-----|
| Button has no accessible name | Add aria-label or text content |
| Form field has no label | Add <label> with matching for/id |
| Insufficient color contrast | Adjust colors to meet 4.5:1 (text) or 3:1 (UI) |
| Missing alt text on image | Add alt="" for decorative or descriptive alt for informative |
| Heading levels skipped | Follow h1 → h2 → h3 hierarchy |
| Missing focus indicator | Add :focus-visible styles |
| Links have same text | Make link text unique or add aria-label |
| No page title | Set document title with Title service |
| Invalid ARIA attributes | Check ARIA spec for valid attributes |
| ARIA role conflicts with semantic HTML | Remove redundant role or use correct element |

### Browser + Screen Reader Testing Combinations

| OS | Browser | Screen Reader | Notes |
|---|---------|---------------|-------|
| Windows | Chrome | NVDA (free) | Primary testing combination |
| Windows | Firefox | NVDA | Alternative combination |
| Windows | Edge | JAWS (license) | Enterprise standard |
| macOS | Safari | VoiceOver (built-in) | Primary for Mac/iOS |
| iOS | Safari | VoiceOver (built-in) | Mobile testing |
| Android | Chrome | TalkBack (built-in) | Mobile testing |

### Keyboard Testing Quick Guide

1. **Tab** through all interactive elements
2. **Shift+Tab** to go backward
3. **Enter** to activate links/buttons
4. **Space** to activate buttons/checkboxes
5. **Arrow keys** for radio groups, tabs, listboxes
6. **Escape** to close modals/tooltips
7. **Home/End** to jump to first/last (in lists)

### Focus Management Patterns

```typescript
// Open modal → focus modal
// Close modal → focus trigger
// Form error → focus error summary
// Route change → focus h1 or main
// Load content → focus new content
// Delete item → focus previous/next item
```
