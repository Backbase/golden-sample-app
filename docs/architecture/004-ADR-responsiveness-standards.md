# ADR-004: Responsiveness and Breakpoint Standards

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> All Backbase web applications must implement responsive design using Bootstrap 5.1 breakpoints with a minimum supported screen size of 360px. Use mobile-first CSS, Angular BreakpointObserver for TypeScript logic, and ensure 44x44px minimum touch targets on mobile devices.

### Rules

**MUST DO ✅**

1. Use Bootstrap 5.1 breakpoint system (sm/md/lg/xl/xxl) as the canonical system
2. Use mobile-first CSS approach: base styles for mobile, `@include media-breakpoint-up()` for larger screens
3. Support minimum 360px screen width for standard applications
4. Use Angular BreakpointObserver for viewport-based component logic
5. Ensure touch targets are minimum 44x44px on mobile (WCAG 2.5.5)
6. Test at multiple viewports: mobile (360px, 375px), tablet (768px), desktop (1920px)
7. Use CSS Grid for 2D layouts and Flexbox for 1D layouts

**MUST NOT ❌**

1. Do not use custom breakpoints outside the ADR-defined system (320px, 640px, 1024px, etc.)
2. Do not use fixed pixel widths that break responsiveness
3. Do not use `window.addEventListener('resize')` - use BreakpointObserver instead
4. Do not use float-based layouts - use CSS Grid or Flexbox
5. Do not create touch targets smaller than 44x44px on mobile
6. Do not hide content without alternative access method at any breakpoint
7. Do not use desktop-first CSS (avoid `@include media-breakpoint-down()` as primary approach)

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

<!-- 
Cross-reference: For subscription cleanup (takeUntil) pattern used in BreakpointObserver, 
see ADR-000 Pattern 1: Subscription Cleanup.
-->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| mobile-first, scss, breakpoint, media query | [Pattern 1: Mobile-First SCSS](#pattern-1-mobile-first-scss) |
| breakpoint, typescript, viewport, observable | [Pattern 2: BreakpointObserver Service](#pattern-2-breakpointobserver-service) |
| grid, layout, responsive, columns | [Pattern 3: CSS Grid Responsive Layouts](#pattern-3-css-grid-responsive-layouts) |
| touch, button, tap, mobile, accessibility | [Pattern 4: Touch Target Sizing](#pattern-4-touch-target-sizing) |
| expert, minimum, desktop-only | [Pattern 5: Expert Interface Pattern](#pattern-5-expert-interface-pattern) |

---

### Pattern 1: Mobile-First SCSS

**Use when:** Writing responsive styles for any component

**Don't use when:** Styling truly desktop-only expert interfaces (use Pattern 5 instead)

✅ **Good**

```scss
// CONTEXT: Component needs different padding at various screen sizes
// RULE: Start with mobile styles, enhance for larger screens using media-breakpoint-up()

.my-component {
  padding: 1rem;        // Mobile default
  font-size: 0.875rem;
  
  @include media-breakpoint-up(md) {
    padding: 1.5rem;    // Tablet enhancement
    font-size: 1rem;
  }
  
  @include media-breakpoint-up(lg) {
    padding: 2rem;      // Desktop enhancement
    font-size: 1.125rem;
  }
}
```

❌ **Bad**

```scss
// PROBLEM: Desktop-first approach requires overrides and loads unnecessary CSS on mobile

.my-component {
  padding: 2rem;        // Desktop default
  font-size: 1.125rem;
  
  @include media-breakpoint-down(md) {
    padding: 1rem;      // Override for mobile
    font-size: 0.875rem;
  }
}
```

**Why it's wrong:** Desktop-first loads larger values then overrides them for mobile, wasting bytes and requiring more CSS rules to undo styles.

**Verify:**
- [ ] Base styles apply to mobile (no media query)
- [ ] `media-breakpoint-up()` used for larger screen enhancements
- [ ] `media-breakpoint-down()` used sparingly (only for desktop-only hiding)

---

### Pattern 2: BreakpointObserver Service

**Use when:** Component behavior changes based on viewport (show/hide columns, load different data)

**Don't use when:** Simple show/hide can be achieved with CSS classes (`d-none d-md-block`)

✅ **Good**

```typescript
// CONTEXT: Data table component needs different columns at different viewports
// RULE: Use BreakpointObserver with takeUntil for proper cleanup

import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html'
})
export class DataTableComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isMobile = false;
  isTablet = false;
  isDesktop = false;
  displayedColumns: string[] = [];

  private readonly MOBILE_BREAKPOINT = '(max-width: 767px)';
  private readonly TABLET_BREAKPOINT = '(min-width: 768px) and (max-width: 991px)';
  private readonly DESKTOP_BREAKPOINT = '(min-width: 992px)';

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([this.MOBILE_BREAKPOINT, this.TABLET_BREAKPOINT, this.DESKTOP_BREAKPOINT])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isMobile = state.breakpoints[this.MOBILE_BREAKPOINT];
        this.isTablet = state.breakpoints[this.TABLET_BREAKPOINT];
        this.isDesktop = state.breakpoints[this.DESKTOP_BREAKPOINT];
        
        this.adjustTableColumns();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private adjustTableColumns(): void {
    if (this.isMobile) {
      this.displayedColumns = ['name', 'actions'];
    } else if (this.isTablet) {
      this.displayedColumns = ['name', 'date', 'status', 'actions'];
    } else {
      this.displayedColumns = ['name', 'date', 'status', 'amount', 'actions'];
    }
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: Direct window resize listener causes memory leaks and is not Angular-idiomatic

export class DataTableComponent implements OnInit {
  isMobile = false;

  ngOnInit(): void {
    // Memory leak - no cleanup
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
    
    // Initial check unreliable
    this.isMobile = window.innerWidth < 768;
  }
}
```

**Why it's wrong:** Window resize listeners cause memory leaks without cleanup, are not testable, and don't leverage Angular's change detection efficiently.

**Verify:**
- [ ] BreakpointObserver used instead of window resize events
- [ ] takeUntil pattern with destroy$ subject for cleanup
- [ ] Breakpoint strings match Bootstrap values (767px, 768px, 991px, 992px)

---

### Pattern 3: CSS Grid Responsive Layouts

**Use when:** Creating two-dimensional layouts (dashboards, card grids, complex page structures)

**Don't use when:** Simple one-dimensional alignment (use Flexbox) or standard 12-column layout (use Bootstrap grid)

✅ **Good**

```scss
// CONTEXT: Dashboard layout with header, nav, main, sidebar, footer
// RULE: Use CSS Grid with grid-template-areas for complex responsive layouts

.dashboard {
  display: grid;
  gap: 1rem;
  
  // Mobile: stacked single column
  grid-template-areas:
    "header"
    "nav"
    "main"
    "sidebar"
    "footer";
  
  // Desktop: classic 3-column layout
  @include media-breakpoint-up(lg) {
    grid-template-columns: 250px 1fr 300px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "header header header"
      "nav main sidebar"
      "footer footer footer";
  }
  
  .header { grid-area: header; }
  .nav { grid-area: nav; }
  .main { grid-area: main; }
  .sidebar { grid-area: sidebar; }
  .footer { grid-area: footer; }
}
```

❌ **Bad**

```scss
// PROBLEM: Float-based layouts are fragile, require clearfix hacks, and don't reflow well

.dashboard {
  .sidebar {
    float: left;
    width: 250px;
  }
  .main {
    margin-left: 260px;
  }
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}
```

**Why it's wrong:** Float-based layouts don't reflow properly on different screen sizes, require clearfix hacks, and are harder to maintain than CSS Grid.

**Verify:**
- [ ] CSS Grid used for 2D layouts
- [ ] Mobile layout defined first (single column typically)
- [ ] Desktop layout uses explicit grid-template-columns/rows

---

### Pattern 4: Touch Target Sizing

**Use when:** Creating interactive elements (buttons, links, icons) that will be used on mobile

**Don't use when:** Desktop-only expert interfaces with 992px minimum

✅ **Good**

```scss
// CONTEXT: Button component used on mobile devices
// RULE: Minimum 44x44px touch target (WCAG 2.5.5), can be smaller on desktop

.button {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1rem;
  
  // Desktop can be smaller for mouse precision
  @include media-breakpoint-up(lg) {
    min-height: 36px;
    min-width: 36px;
    padding: 0.5rem 1rem;
  }
  
  // Icon-only variant
  &.icon-only {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
  }
}

// Minimum 8px gap between touch targets
.button-group {
  display: flex;
  gap: 0.5rem; // 8px
  
  @include media-breakpoint-up(lg) {
    gap: 0.25rem; // Can be tighter on desktop
  }
}
```

❌ **Bad**

```scss
// PROBLEM: Touch target too small for mobile interaction

.icon-button {
  width: 24px;  // Too small!
  height: 24px;
  padding: 0;
}
```

**Why it's wrong:** 24x24px is too small for reliable touch input, causing user frustration and accessibility violations (WCAG 2.5.5).

**Verify:**
- [ ] Interactive elements are minimum 44x44px on mobile
- [ ] At least 8px gap between adjacent touch targets
- [ ] Icon-only buttons have explicit sizing

---

### Pattern 5: Expert Interface Pattern

**Use when:** Building complex admin/business interfaces that require large screen real estate (992px+ minimum)

**Don't use when:** Building customer-facing retail applications (must support 360px)

✅ **Good**

```typescript
// CONTEXT: Complex cash flow management interface optimized for desktop
// RULE: Show warning on small screens, maintain minimum width with horizontal scroll

@Component({
  selector: 'app-cash-flow-management',
  templateUrl: './cash-flow-management.component.html',
  styleUrls: ['./cash-flow-management.component.scss']
})
export class CashFlowManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  showMobileWarning = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 991px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.showMobileWarning = state.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

```html
<!-- Template with graceful degradation -->
<div *ngIf="showMobileWarning" class="min-width-warning">
  <div class="alert alert-warning">
    <h2>Screen Size Too Small</h2>
    <p>This expert interface is optimized for desktop screens (992px minimum). 
       Please use a larger device for the best experience.</p>
  </div>
</div>

<div class="expert-interface" [class.show-on-mobile]="!showMobileWarning">
  <!-- Content scales but doesn't reflow dramatically -->
</div>
```

```scss
// CONTEXT: Expert interface SCSS
// RULE: Maintain minimum width, enable horizontal scroll on smaller viewports

.expert-interface {
  min-width: 992px;
  
  @include media-breakpoint-down(lg) {
    overflow-x: auto;
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: No warning or handling for unsupported viewport sizes

@Component({
  template: `
    <div class="complex-dashboard">
      <!-- Complex layout that breaks on mobile with no warning -->
    </div>
  `
})
export class CashFlowManagementComponent {}
```

**Why it's wrong:** Users on small screens have no indication the interface isn't designed for their device, leading to broken layouts and poor UX.

**Verify:**
- [ ] Viewport detection shows warning below minimum size
- [ ] Interface maintains minimum width with horizontal scroll
- [ ] Clear messaging explains minimum requirements

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `RESP-001` | No custom breakpoints (320px, 640px, 1024px) | 🔴 BLOCKER | `grep -r "320px\|640px\|1024px" --include="*.scss"` |
| `RESP-002` | No window.addEventListener('resize') | 🔴 BLOCKER | `grep -r "addEventListener.*resize" --include="*.ts"` |
| `RESP-003` | No fixed widths without max-width | 🟡 WARNING | `grep -r "width:\s*[0-9]+px" --include="*.scss"` |
| `RESP-004` | No float layouts | 🔴 BLOCKER | `grep -r "float:\s*left\|float:\s*right" --include="*.scss"` |
| `RESP-005` | BreakpointObserver has takeUntil | 🔴 BLOCKER | Manual: check for memory leaks in subscriptions |
| `RESP-006` | Touch targets meet minimum | 🟡 WARNING | `grep -r "width:\s*[0-3][0-9]px\|height:\s*[0-3][0-9]px" --include="*.scss"` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `RESP-R01` | Mobile-first CSS: base styles for mobile, media-breakpoint-up for larger | 🔴 BLOCKER |
| `RESP-R02` | Bootstrap 5.1 breakpoints only (576px, 768px, 992px, 1200px, 1400px) | 🔴 BLOCKER |
| `RESP-R03` | No horizontal overflow at any supported viewport | 🔴 BLOCKER |
| `RESP-R04` | Touch targets ≥44x44px on mobile viewports | 🔴 BLOCKER |
| `RESP-R05` | BreakpointObserver cleanup in ngOnDestroy | 🔴 BLOCKER |
| `RESP-R06` | Bootstrap utilities used where applicable (d-flex, gap-*, p-*, m-*) | 🟡 WARNING |
| `RESP-R07` | Responsive images use srcset or picture element | 🟡 WARNING |
| `RESP-R08` | Content reflow supports 200% zoom (WCAG 1.4.10) | 🟡 WARNING |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Component renders at 360px viewport | E2E | ✅ Yes |
| Component renders at 768px viewport | E2E | ✅ Yes |
| Component renders at 1920px viewport | E2E | ✅ Yes |
| BreakpointObserver logic mocked | Unit | ✅ Yes |
| Visual regression at each breakpoint | Visual | ✅ Yes |
| Touch targets ≥44x44px on mobile | Accessibility | ✅ Yes |
| No horizontal overflow | E2E | ✅ Yes |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Users access applications across diverse devices (360px-1920px+). Inconsistent breakpoint implementations lead to maintenance overhead. Retail apps need full mobile support; expert interfaces need graceful degradation.

### Business Drivers

- Mobile banking growth demands seamless small-screen experiences
- 320px devices < 3% market share (not worth supporting)
- Consistent UX across device types

### Technical Constraints

- Bootstrap 5.1 breakpoints already integrated
- SCSS preprocessing mandatory (no CSS-in-JS)
- 60fps performance budget on mobile

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Bootstrap 5.1 breakpoints (sm/md/lg/xl/xxl) with 360px minimum for retail apps, 992px for expert interfaces. Mobile-first CSS, BreakpointObserver for TypeScript, 44x44px touch targets.

### Rationale

| Choice | Why |
|--------|-----|
| Bootstrap 5.1 breakpoints | Industry standard, already integrated, well-documented |
| 360px minimum | Covers 99.5%+ of target devices; 320px is <3% market |
| Mobile-first CSS | Performance optimization, easier to enhance |
| BreakpointObserver | Reactive, testable, prevents resize listener anti-patterns |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Angular Components | MODIFY | `apps/**/src/**/*.component.scss` |
| Layout Components | MODIFY | `libs/**/layout/**/*.scss` |
| Shared Components | MODIFY | `libs/shared/**/*.component.ts` |
| Journey Bundles | MODIFY | `libs/journey-bundles/**/*.scss` |
| E2E Tests | CREATE/MODIFY | `apps/**-e2e/**/*.spec.ts` |
| Storybook Stories | MODIFY | `**/*.stories.ts` |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-001: Accessibility Standards | Related to: Touch target sizing (WCAG 2.5.5) |
| ADR-005: Performance Standards | Related to: 60fps requirement, image optimization |
| ADR-006: Design System Standards | Related to: UI-ANG component responsiveness |

### Migration Notes

For existing applications:
1. Audit existing breakpoint usage with `grep -r "@media" --include="*.scss"`
2. Replace custom breakpoints with Bootstrap 5.1 equivalents
3. Convert desktop-first media queries to mobile-first
4. Replace window resize listeners with BreakpointObserver
5. Add responsive E2E tests to CI pipeline
6. Run Lighthouse mobile audits to verify performance budget

---

## 7. Examples

### Complete Example

<!-- 
NOTE: For BreakpointObserver TypeScript patterns, see Pattern 2 above.
This example focuses on SCSS mobile-first styling only.
-->

**Scenario:** Mobile-first SCSS for a responsive data table

```scss
// File: libs/shared/feature/src/lib/data-table/data-table.component.scss

.data-table {
  width: 100%;
  
  // Mobile: compact view (base styles)
  .cell {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
  
  // Touch targets: minimum 44x44px on mobile
  .action-button {
    min-height: 44px;
    min-width: 44px;
  }
  
  // Tablet: medium spacing
  @include media-breakpoint-up(md) {
    .cell {
      padding: 0.75rem;
      font-size: 1rem;
    }
  }
  
  // Desktop: full spacing, smaller touch targets OK
  @include media-breakpoint-up(lg) {
    .cell { padding: 1rem; }
    .action-button {
      min-height: 36px;
      min-width: 36px;
    }
  }
}
```

### Common Mistakes

**Mistake 1: Using desktop-first media queries**

```scss
// ❌ Wrong
.card {
  padding: 2rem;
  @include media-breakpoint-down(md) {
    padding: 1rem;
  }
}

// ✅ Fix
.card {
  padding: 1rem;
  @include media-breakpoint-up(lg) {
    padding: 2rem;
  }
}
```

**Mistake 2: Missing subscription cleanup**

See **ADR-000 Pattern 1: Subscription Cleanup** for the `takeUntil` pattern. Always use `takeUntil(destroy$)` with BreakpointObserver subscriptions.

**Mistake 3: Fixed widths breaking responsiveness**

```scss
// ❌ Wrong
.container {
  width: 1200px;
  margin: 0 auto;
}

// ✅ Fix
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

---

## 8. References

- [Bootstrap 5.1 Breakpoints Documentation](https://getbootstrap.com/docs/5.1/layout/breakpoints/)
- [Angular CDK Layout Module](https://material.angular.io/cdk/layout/overview)
- [WCAG 2.1 Success Criterion 2.5.5 (Target Size)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [WCAG 2.1 Success Criterion 1.4.10 (Reflow)](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
- [CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/) — W3C Recommendation
- [CSS Flexible Box Layout Module Level 1](https://www.w3.org/TR/css-flexbox-1/) — W3C Recommendation
- [Responsive Images - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Angular Performance Best Practices](https://angular.io/guide/performance-best-practices)
- [Playwright Emulation](https://playwright.dev/docs/emulation) — Viewport testing documentation
- [Mobile Device Market Share - StatCounter](https://gs.statcounter.com/screen-resolution-stats/mobile/)

---
