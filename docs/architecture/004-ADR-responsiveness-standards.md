# ADR-004: Responsiveness and Breakpoint Standards

### Important Note
``` markdown
This ADR defines mandatory responsiveness standards for all web applications.
All frontend code must comply with the breakpoint system, minimal screen size requirements, and responsive design patterns defined herein.
```

## Decision summary

All Backbase web applications must implement responsive design following Bootstrap 5.1 breakpoint system with a minimum supported screen size of 360px for standard user interfaces. Complex expert interfaces may use 992px as minimum with explicit scaling-down principles. Angular applications must leverage CSS Grid, Flexbox, and Bootstrap utilities while ensuring mobile-first development approach with comprehensive responsive testing coverage.

## Context and problem statement

### Business context
- Users access Backbase applications across diverse devices: smartphones (360px to 428px), tablets (768px to 1024px), and desktops (1200px+)
- Mobile banking usage continues to grow, requiring seamless experiences on smaller devices
- Market data shows 320px devices (older iPhone SE) represent <3% market share in key regions
- Expert interfaces (Entitlements, Cash Flow) are primarily desktop-focused but must degrade gracefully
- Inconsistent breakpoint implementation across projects leads to maintenance overhead and user experience issues

### Technical context
- Angular framework as core technology stack
- Bootstrap 5.1 utility classes available across all applications
- UI-ANG component library must be responsive out of the box
- Mix of retail (customer-facing) and business (expert user) applications with different responsive requirements
- Existing codebase may have legacy responsive implementations requiring standardization
- Modern browsers support CSS Grid and Flexbox with excellent performance characteristics

### Constraints and assumptions

**Technical Constraints**:
- Must support Angular 15+ with TypeScript
- Bootstrap 5.1 breakpoint system already integrated across platform
- UI-ANG component library dependencies
- Must maintain backward compatibility with existing applications during migration
- CSS-in-JS not permitted; SCSS preprocessing mandatory
- Performance budget: 60fps scrolling and interactions on mobile devices

**Business Constraints**:
- Cannot drop support for devices >360px due to market penetration in key regions
- Development team distributed across multiple time zones requiring clear documentation
- Code review process must be efficient without sacrificing quality
- Migration from legacy responsive implementations must not block feature delivery

**Environmental Constraints**:
- Applications must work across Chrome, Safari, Firefox, Edge (latest 2 versions)
- iOS Safari requires specific attention for viewport and touch handling
- Android WebView compatibility required for embedded scenarios
- Network conditions vary: must optimize asset loading for responsive images

**Assumptions Made**:
- 360px minimum covers 99.5%+ of Android devices in production
- 375px minimum covers all modern iOS devices
- Desktop usage for retail applications remains significant (>40% of traffic)
- Expert interfaces (business applications) will be primarily accessed on desktop
- CSS Grid and Flexbox browser support adequate for target audience
- Development team has foundational understanding of responsive design principles

### Affected architecture description elements

**Components**:
- All Angular components in `apps/business-universal/` and `apps/retail-universal/`
- Shared component libraries in `libs/shared/feature/`
- Layout components for navigation, headers, footers
- Data tables and complex widgets
- Form layouts and input controls
- Modal dialogs and overlays
- Journey bundles in `libs/journey-bundles/`

**Views**:
- Mobile view: 360px - 767px
- Tablet view: 768px - 991px
- Desktop view: 992px+
- Component Storybook documentation must show all breakpoint variations
- E2E test viewports must cover all breakpoints

**Stakeholders**:
- Frontend developers: Must implement responsive patterns correctly
- UX designers: Must design within breakpoint constraints
- QA engineers: Must test across all supported breakpoints
- End users: Receive consistent, optimized experiences on any device
- Product owners: Ensure feature parity across device types where appropriate

## Decision

### What we decided

**1. Breakpoint System**
- Adopt Bootstrap 5.1 standard breakpoints as canonical system:
  - **X-Small**: < 576px (no infix)
  - **Small (sm)**: 576px - 767px
  - **Medium (md)**: 768px - 991px
  - **Large (lg)**: 992px - 1199px
  - **Extra Large (xl)**: 1200px - 1399px
  - **Extra Extra Large (xxl)**: ≥ 1400px

**2. Minimum Screen Size**
- **Standard applications (retail, customer-facing)**: 360px minimum
- **Expert interfaces (business, admin)**: 992px minimum with graceful degradation messaging
- **No support** for 320px devices (phased out market)

**3. Development Approach**
- Mobile-first CSS: Start with mobile styles, progressively enhance for larger screens
- Use Bootstrap utility classes for spacing, display, and grid
- Leverage CSS Grid for two-dimensional layouts
- Use Flexbox for one-dimensional layouts and alignment
- Angular BreakpointObserver for TypeScript-based responsive logic

**4. Component Requirements**
- All UI-ANG components must be responsive by default
- Custom components must document responsive behavior in Storybook
- Components must work in isolation at all supported breakpoints
- Touch targets minimum 44x44px for mobile (WCAG 2.5.5)

**5. Testing Requirements**
- E2E tests must include mobile (360px, 375px), tablet (768px), desktop (1920px) viewports
- Visual regression tests at each breakpoint
- Manual testing on physical iOS and Android devices before major releases

### Rationale

**Bootstrap 5.1 Breakpoints**:
- Industry-standard system widely understood by developers
- Already integrated into Backbase platform
- Extensive documentation and community support
- Aligns with common device sizes in production analytics

**360px Minimum**:
- Covers 99.5%+ of devices in Backbase's target markets
- Android minimum screen size for current devices
- Balances user coverage with development effort
- 320px support provides diminishing returns (< 3% market share)

**Mobile-First Approach**:
- Enforces performance optimization from start
- Easier to enhance than to strip down
- Aligns with Angular and Bootstrap best practices
- Prevents desktop-centric assumptions in code

**CSS Grid + Flexbox**:
- Modern, performant layout systems
- Excellent browser support (>95% in target markets)
- Reduces CSS complexity compared to float-based layouts
- Better developer experience and maintainability

**Angular BreakpointObserver**:
- Reactive, Angular-idiomatic approach
- Efficient: uses native matchMedia API
- Testable with mocked breakpoint values
- Prevents window resize event listener anti-patterns

## Implementation details

### Technical approach

#### 1. SCSS Breakpoint Mixins
Use Bootstrap's responsive breakpoint mixins in SCSS:

```scss
// Mobile-first approach - styles apply to xs, overridden at sm+
.my-component {
  padding: 1rem;
  
  // Small devices and up (≥576px)
  @include media-breakpoint-up(sm) {
    padding: 1.5rem;
  }
  
  // Medium devices and up (≥768px)
  @include media-breakpoint-up(md) {
    padding: 2rem;
  }
  
  // Large devices and up (≥992px)
  @include media-breakpoint-up(lg) {
    padding: 3rem;
  }
}

// Use down() sparingly - usually indicates desktop-first thinking
@include media-breakpoint-down(md) {
  .desktop-only {
    display: none;
  }
}

// Specific breakpoint ranges
@include media-breakpoint-between(sm, md) {
  .tablet-specific {
    font-size: 1.1rem;
  }
}
```

#### 2. Bootstrap Utility Classes
Leverage Bootstrap responsive utilities:

```html
<!-- Responsive display -->
<div class="d-none d-md-block">Visible on medium and larger</div>
<div class="d-block d-md-none">Visible only on mobile</div>

<!-- Responsive spacing -->
<div class="p-2 p-md-3 p-lg-4">Responsive padding</div>
<div class="mb-3 mb-lg-5">Responsive margin bottom</div>

<!-- Responsive flex -->
<div class="d-flex flex-column flex-md-row">
  <div class="flex-grow-1">Content</div>
</div>

<!-- Responsive grid -->
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">Column</div>
</div>

<!-- Responsive typography -->
<h1 class="fs-3 fs-md-2 fs-lg-1">Responsive heading</h1>
```

#### 3. Angular BreakpointObserver Service
For component logic based on screen size:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isMobile = false;
  isTablet = false;
  isDesktop = false;

  // Custom breakpoint strings matching Bootstrap
  private readonly MOBILE_BREAKPOINT = '(max-width: 767px)';
  private readonly TABLET_BREAKPOINT = '(min-width: 768px) and (max-width: 991px)';
  private readonly DESKTOP_BREAKPOINT = '(min-width: 992px)';

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    // Method 1: Observe specific breakpoints
    this.breakpointObserver
      .observe([this.MOBILE_BREAKPOINT, this.TABLET_BREAKPOINT, this.DESKTOP_BREAKPOINT])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.isMobile = state.breakpoints[this.MOBILE_BREAKPOINT];
        this.isTablet = state.breakpoints[this.TABLET_BREAKPOINT];
        this.isDesktop = state.breakpoints[this.DESKTOP_BREAKPOINT];
        
        this.adjustTableColumns();
      });

    // Method 2: Use CDK predefined breakpoints
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints[Breakpoints.Handset]) {
          this.loadMobileView();
        } else if (state.breakpoints[Breakpoints.Tablet]) {
          this.loadTabletView();
        } else {
          this.loadDesktopView();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private adjustTableColumns(): void {
    // Adjust visible columns based on viewport
    if (this.isMobile) {
      this.displayedColumns = ['name', 'actions'];
    } else if (this.isTablet) {
      this.displayedColumns = ['name', 'date', 'status', 'actions'];
    } else {
      this.displayedColumns = ['name', 'date', 'status', 'amount', 'actions'];
    }
  }

  private loadMobileView(): void {
    // Load mobile-specific data or components
  }

  private loadTabletView(): void {
    // Load tablet-specific data or components
  }

  private loadDesktopView(): void {
    // Load desktop-specific data or components
  }
}
```

#### 4. CSS Grid Responsive Layouts

```scss
.grid-container {
  display: grid;
  gap: 1rem;
  
  // Mobile: single column
  grid-template-columns: 1fr;
  
  // Tablet: 2 columns
  @include media-breakpoint-up(md) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  // Desktop: 3 columns
  @include media-breakpoint-up(lg) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  
  // Alternative: auto-fit with minmax
  @include media-breakpoint-up(md) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

// Dashboard layout example
.dashboard {
  display: grid;
  gap: 1rem;
  
  // Mobile: stacked
  grid-template-areas:
    "header"
    "nav"
    "main"
    "sidebar"
    "footer";
  
  // Desktop: classic layout
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

#### 5. Responsive Images

```html
<!-- Method 1: srcset for resolution switching -->
<img 
  src="image-400.jpg"
  srcset="image-400.jpg 400w,
          image-800.jpg 800w,
          image-1200.jpg 1200w"
  sizes="(max-width: 767px) 100vw,
         (max-width: 991px) 50vw,
         33vw"
  alt="Descriptive text">

<!-- Method 2: picture element for art direction -->
<picture>
  <source media="(max-width: 767px)" srcset="image-mobile.jpg">
  <source media="(max-width: 991px)" srcset="image-tablet.jpg">
  <source media="(min-width: 992px)" srcset="image-desktop.jpg">
  <img src="image-desktop.jpg" alt="Descriptive text">
</picture>

<!-- Method 3: Angular with BreakpointObserver -->
<img [src]="currentImageSrc" alt="Descriptive text">
```

#### 6. Touch Target Sizing

```scss
// Minimum touch target: 44x44px (WCAG 2.5.5 Level AAA)
.button,
.link,
.interactive-element {
  min-height: 44px;
  min-width: 44px;
  
  // Ensure padding doesn't shrink touch area
  padding: 0.75rem 1rem;
  
  // For icon-only buttons
  &.icon-only {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
  }
}

// Spacing between touch targets (minimum 8px recommended)
.button-group {
  display: flex;
  gap: 0.5rem; // 8px
  
  @include media-breakpoint-up(md) {
    gap: 0.25rem; // Can be tighter on desktop with mouse
  }
}
```

#### 7. Expert Interface Pattern (992px minimum)

```typescript
@Component({
  selector: 'app-cash-flow-management',
  templateUrl: './cash-flow-management.component.html',
  styleUrls: ['./cash-flow-management.component.scss']
})
export class CashFlowManagementComponent implements OnInit {
  showMobileWarning = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    // Detect if viewport is below minimum supported size
    this.breakpointObserver
      .observe(['(max-width: 991px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        this.showMobileWarning = state.matches;
      });
  }
}
```

```html
<!-- Show warning on small screens -->
<div *ngIf="showMobileWarning" class="min-width-warning">
  <div class="alert alert-warning">
    <h2>Screen Size Too Small</h2>
    <p>This expert interface is optimized for desktop screens (992px minimum width). 
       Please use a larger device or increase your browser window size for the best experience.</p>
    <p>Current features may be difficult to use on this screen size.</p>
  </div>
</div>

<!-- Main content with scaling-down principle -->
<div class="expert-interface" [class.show-on-mobile]="!showMobileWarning">
  <!-- Content scales down but doesn't reflow dramatically -->
  <div class="toolbar">
    <!-- Toolbar content -->
  </div>
  <div class="complex-grid">
    <!-- Grid that maintains structure but scales -->
  </div>
</div>
```

```scss
.expert-interface {
  // Maintain minimum width
  min-width: 992px;
  
  // On smaller viewports, enable horizontal scroll
  @include media-breakpoint-down(lg) {
    overflow-x: auto;
    
    // Inform user of scroll capability
    &::after {
      content: "Scroll horizontally to see more →";
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
  }
}
```

#### 8. Testing Implementation

**Playwright E2E Tests:**

```typescript
// apps/business-universal-e2e/src/specs/responsive.spec.ts
import { test, expect } from '@playwright/test';

const VIEWPORTS = {
  mobile: { width: 360, height: 740 },
  mobileIOS: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  desktopSmall: { width: 1366, height: 768 }
};

test.describe('Responsive Behavior', () => {
  Object.entries(VIEWPORTS).forEach(([device, viewport]) => {
    test(`should display correctly on ${device} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/dashboard');
      
      // Check layout
      await expect(page).toHaveScreenshot(`dashboard-${device}.png`);
      
      // Check interactive elements are accessible
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        
        if (viewport.width <= 767) {
          // Mobile: ensure touch targets are minimum 44x44px
          expect(box?.height).toBeGreaterThanOrEqual(44);
          expect(box?.width).toBeGreaterThanOrEqual(44);
        }
      }
      
      // Check no horizontal overflow
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyScrollWidth).toBeLessThanOrEqual(viewport.width + 1); // +1 for rounding
    });
  });

  test('should hide/show elements at breakpoints', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Desktop: sidebar visible
    await page.setViewportSize(VIEWPORTS.desktop);
    await expect(page.locator('.sidebar')).toBeVisible();
    
    // Mobile: sidebar hidden, menu button visible
    await page.setViewportSize(VIEWPORTS.mobile);
    await expect(page.locator('.sidebar')).not.toBeVisible();
    await expect(page.locator('.mobile-menu-button')).toBeVisible();
    
    // Tablet: should show tablet layout
    await page.setViewportSize(VIEWPORTS.tablet);
    await expect(page.locator('.tablet-nav')).toBeVisible();
  });

  test('should reflow content appropriately', async ({ page }) => {
    await page.goto('/product-list');
    
    // Desktop: 3 columns
    await page.setViewportSize(VIEWPORTS.desktop);
    const desktopColumns = await page.locator('.product-grid > .product-card').count();
    const desktopRows = Math.ceil(desktopColumns / 3);
    
    // Tablet: 2 columns
    await page.setViewportSize(VIEWPORTS.tablet);
    const tabletColumns = await page.locator('.product-grid > .product-card').count();
    expect(tabletColumns).toBe(desktopColumns); // Same items
    
    // Mobile: 1 column (stack)
    await page.setViewportSize(VIEWPORTS.mobile);
    const mobileColumns = await page.locator('.product-grid > .product-card').count();
    expect(mobileColumns).toBe(desktopColumns); // Same items
  });
});
```

**Angular Component Tests:**

```typescript
// component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';

describe('DataTableComponent Responsive Behavior', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(() => {
    const breakpointSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);

    TestBed.configureTestingModule({
      declarations: [DataTableComponent],
      providers: [
        { provide: BreakpointObserver, useValue: breakpointSpy }
      ]
    });

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    breakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
  });

  it('should show 2 columns on mobile', () => {
    breakpointObserver.observe.and.returnValue(of({
      matches: true,
      breakpoints: {
        '(max-width: 767px)': true,
        '(min-width: 768px) and (max-width: 991px)': false,
        '(min-width: 992px)': false
      }
    }));

    fixture.detectChanges();

    expect(component.displayedColumns).toEqual(['name', 'actions']);
  });

  it('should show 4 columns on tablet', () => {
    breakpointObserver.observe.and.returnValue(of({
      matches: true,
      breakpoints: {
        '(max-width: 767px)': false,
        '(min-width: 768px) and (max-width: 991px)': true,
        '(min-width: 992px)': false
      }
    }));

    fixture.detectChanges();

    expect(component.displayedColumns).toEqual(['name', 'date', 'status', 'actions']);
  });

  it('should show all columns on desktop', () => {
    breakpointObserver.observe.and.returnValue(of({
      matches: true,
      breakpoints: {
        '(max-width: 767px)': false,
        '(min-width: 768px) and (max-width: 991px)': false,
        '(min-width: 992px)': true
      }
    }));

    fixture.detectChanges();

    expect(component.displayedColumns).toEqual(['name', 'date', 'status', 'amount', 'actions']);
  });
});
```

### Standards compliance

- [x] Bootstrap 5.1 breakpoint system followed
- [x] Mobile-first CSS approach mandated
- [x] Angular CDK BreakpointObserver service used for TypeScript logic
- [x] WCAG 2.5.5 touch target minimum (44x44px) enforced on mobile
- [x] E2E tests include responsive viewport testing
- [x] Visual regression tests at each breakpoint
- [x] Component Storybook documentation shows responsive behavior
- [x] Performance budget maintained (60fps interactions)
- [x] Browser compatibility verified (Chrome, Safari, Firefox, Edge)

### Quality attributes addressed

| Quality Attribute | Requirement | How Decision Addresses It |
|-------------------|-------------|---------------------------|
| Usability | Consistent UX across devices | Standard breakpoints ensure predictable behavior; touch targets optimized for mobile |
| Performance | 60fps scrolling/interactions | CSS Grid/Flexbox native browser optimization; mobile-first reduces unused CSS; lazy loading images |
| Maintainability | Quick updates across breakpoints | Bootstrap utilities reduce custom CSS; BreakpointObserver centralizes logic; clear patterns in ADR |
| Accessibility | WCAG 2.1 Level AA (min 44x44 touch) | Touch target sizing enforced; responsive reflow supports zoom; semantic HTML maintained |
| Testability | Automated responsive testing | Playwright multi-viewport tests; mockable BreakpointObserver; visual regression at each breakpoint |
| Portability | 360px to 2560px+ support | Standard breakpoints scale to all device sizes; CSS Grid/Flexbox fluid |
| Scalability | Supports new components/apps | Reusable patterns; Bootstrap utilities; documented in ADR; Storybook examples |

## Success metrics

### Technical success criteria
- **100% of components** pass responsive viewport tests (360px, 768px, 992px, 1920px)
- **Zero custom breakpoints** outside ADR-defined system (detected by linter)
- **Zero horizontal scroll** issues on standard viewports
- **60fps minimum** for scrolling and interactions on mobile (Lighthouse CI)
- **95%+ code coverage** for BreakpointObserver logic in unit tests
- **All touch targets ≥44x44px** on mobile viewports (automated accessibility tests)
- **Lighthouse mobile score ≥90** for all applications

### Business success criteria  
- **<1% support tickets** related to responsive layout issues (vs. 5% baseline)
- **15% improvement** in mobile task completion rates (analytics)
- **20% reduction** in mobile bounce rate (analytics)
- **Consistent NPS** across device types (currently desktop 10pts higher)
- **Zero "mobile not supported" escalations** (currently 2-3 per month)

### Monitoring and measurement
- **Analytics Dashboard**: Track device distribution, viewport sizes, task completion by device
- **Lighthouse CI**: Automated performance testing on every PR
- **Playwright Reports**: Visual regression results across viewports
- **Error Monitoring**: Track layout shift (CLS), interaction delays (FID) by device type
- **Support Ticket Analysis**: Tag and trend responsive-related issues
- **Quarterly Review**: Tech leads review compliance, identify patterns, update ADR if needed

## Best practices for responsive development

### 1. Mobile-First CSS

**DO:**
```scss
// ✅ Start with mobile, enhance for larger screens
.card {
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

**DON'T:**
```scss
// ❌ Desktop-first requires overrides
.card {
  padding: 2rem;        // Desktop default
  font-size: 1.125rem;
  
  @include media-breakpoint-down(md) {
    padding: 1rem;      // Override for mobile
    font-size: 0.875rem;
  }
}
```

### 2. Leverage Bootstrap Utilities

**DO:**
```html
<!-- ✅ Use Bootstrap responsive utilities -->
<div class="d-flex flex-column flex-md-row gap-3">
  <div class="flex-grow-1">Content</div>
  <aside class="col-12 col-md-4">Sidebar</aside>
</div>
```

**DON'T:**
```html
<!-- ❌ Custom classes for common patterns -->
<div class="custom-flex-container">
  <div class="custom-flex-item">Content</div>
  <aside class="custom-sidebar">Sidebar</aside>
</div>
```

### 3. Use CSS Grid for Layouts

**DO:**
```scss
// ✅ CSS Grid for two-dimensional layouts
.dashboard {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @include media-breakpoint-up(lg) {
    grid-template-columns: 250px 1fr 300px;
    grid-template-rows: auto 1fr auto;
  }
}
```

**DON'T:**
```scss
// ❌ Float-based layouts
.dashboard {
  .sidebar {
    float: left;
    width: 250px;
  }
  .main {
    margin-left: 260px;
  }
}
```

### 4. BreakpointObserver Pattern

**DO:**
```typescript
// ✅ Use BreakpointObserver with cleanup
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isMobile = state.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**DON'T:**
```typescript
// ❌ Direct window resize listeners
export class MyComponent implements OnInit {
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

### 5. Touch Target Sizing

**DO:**
```scss
// ✅ Ensure minimum 44x44px touch targets
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
}
```

**DON'T:**
```scss
// ❌ Tiny touch targets on mobile
.icon-button {
  width: 24px;  // Too small!
  height: 24px;
  padding: 0;
}
```

### 6. Responsive Images

**DO:**
```html
<!-- ✅ Use srcset for resolution switching -->
<img 
  src="image-400.jpg"
  srcset="image-400.jpg 400w,
          image-800.jpg 800w,
          image-1200.jpg 1200w"
  sizes="(max-width: 767px) 100vw,
         (max-width: 991px) 50vw,
         33vw"
  alt="Descriptive text"
  loading="lazy">
```

**DON'T:**
```html
<!-- ❌ Single large image for all devices -->
<img src="image-2400.jpg" alt="Descriptive text">
```

### 7. Test Across Breakpoints

**DO:**
```typescript
// ✅ Test at each breakpoint
const VIEWPORTS = {
  mobile: { width: 360, height: 740 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 }
};

Object.entries(VIEWPORTS).forEach(([device, viewport]) => {
  test(`should work on ${device}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    // Test assertions
  });
});
```

**DON'T:**
```typescript
// ❌ Only test on desktop
test('should work', async ({ page }) => {
  // Uses default 1280x720 viewport only
  await page.goto('/dashboard');
});
```

### 8. Avoid Fixed Widths

**DO:**
```scss
// ✅ Fluid widths with max constraints
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

**DON'T:**
```scss
// ❌ Fixed widths break responsiveness
.container {
  width: 1200px;  // Overflows on < 1200px screens
  margin: 0 auto;
}
```

### 9. Content Hierarchy

**DO:**
```html
<!-- ✅ Reorder content for mobile importance -->
<div class="d-flex flex-column flex-lg-row">
  <main class="order-1 order-lg-2 flex-grow-1">Primary content</main>
  <aside class="order-2 order-lg-1">Secondary sidebar</aside>
</div>
```

**DON'T:**
```html
<!-- ❌ Force mobile users to scroll past secondary content -->
<div class="d-flex">
  <aside>Long sidebar...</aside>
  <main>Primary content</main>
</div>
```

### 10. Performance Optimization

**DO:**
```typescript
// ✅ Lazy load mobile-only components
@Component({
  selector: 'app-dashboard',
  template: `
    <app-desktop-nav *ngIf="!isMobile"></app-desktop-nav>
    <ng-container *ngIf="isMobile">
      <ng-container *ngComponentOutlet="mobileNavComponent | async"></ng-container>
    </ng-container>
  `
})
export class DashboardComponent {
  isMobile = false;
  mobileNavComponent = this.isMobile 
    ? import('./mobile-nav/mobile-nav.component').then(m => m.MobileNavComponent)
    : of(null);
}
```

**DON'T:**
```typescript
// ❌ Load all components regardless of viewport
@Component({
  template: `
    <app-desktop-nav [hidden]="isMobile"></app-desktop-nav>
    <app-mobile-nav [hidden]="!isMobile"></app-mobile-nav>
  `
})
```

## Code review checklist

### Responsive CSS

- [ ] **Mobile-first approach used**: Base styles for mobile, `@include media-breakpoint-up()` for larger screens
- [ ] **Bootstrap breakpoints only**: No custom breakpoints (320px, 640px, 1024px, etc.)
- [ ] **No fixed widths**: Uses percentage, `fr`, `auto`, or `max-width` instead of fixed pixel widths
- [ ] **No horizontal overflow**: Content fits within viewport at all breakpoints
- [ ] **Appropriate layout method**: CSS Grid for 2D layouts, Flexbox for 1D, Bootstrap grid for standard cases
- [ ] **Bootstrap utilities preferred**: Uses `d-flex`, `gap-*`, `p-*`, `m-*` instead of custom classes where applicable
- [ ] **Typography scales responsively**: Font sizes adjust for readability across devices
- [ ] **Spacing scales appropriately**: Padding/margins increase from mobile to desktop

### Responsive TypeScript/Angular

- [ ] **BreakpointObserver used for viewport logic**: Not `window.innerWidth` or resize events
- [ ] **takeUntil pattern for subscriptions**: Proper cleanup in `ngOnDestroy`
- [ ] **Breakpoint strings match ADR**: `'(max-width: 767px)'`, `'(min-width: 768px) and (max-width: 991px)'`, etc.
- [ ] **Lazy loading considered**: Mobile-only or desktop-only components lazy loaded if significant
- [ ] **Conditional rendering**: Uses `*ngIf` to remove unused DOM, not just hiding with CSS

### Touch and Interaction

- [ ] **Touch targets ≥44x44px on mobile**: Buttons, links, interactive elements meet minimum size
- [ ] **Adequate spacing between interactive elements**: Minimum 8px gap to prevent mis-taps
- [ ] **Hover states don't break mobile**: Interactive feedback works with both mouse and touch
- [ ] **No hover-only functionality**: Critical actions accessible without hover (mobile has no hover)

### Images and Media

- [ ] **Responsive images implemented**: Uses `srcset` and `sizes`, or `<picture>` element
- [ ] **Images lazy loaded**: `loading="lazy"` on below-fold images
- [ ] **Alt text provided**: Meaningful descriptions for screen readers
- [ ] **Aspect ratio preserved**: Images don't cause layout shift (use `aspect-ratio` CSS or fixed dimensions)

### Testing

- [ ] **E2E tests include multiple viewports**: Tests at 360px, 768px, 992px minimum
- [ ] **Visual regression tests added**: Screenshots at each breakpoint
- [ ] **BreakpointObserver mocked in unit tests**: Tests behavior at different breakpoints
- [ ] **Touch target sizes verified**: Automated accessibility tests pass
- [ ] **No console errors at any viewport**: Check browser console at each breakpoint

### Documentation

- [ ] **Storybook includes responsive variants**: Shows component at multiple breakpoints
- [ ] **Responsive behavior documented**: Comments explain why certain breakpoints chosen
- [ ] **Complex responsive logic explained**: Non-obvious breakpoint behaviors have code comments

### Accessibility

- [ ] **Content reflow supports zoom**: 200% zoom doesn't break layout (WCAG 1.4.10)
- [ ] **No loss of information at any breakpoint**: Critical content visible or accessible at all sizes
- [ ] **Semantic HTML maintained**: `<nav>`, `<main>`, `<aside>` properly used
- [ ] **Focus indicators visible**: Keyboard focus clear at all breakpoints
- [ ] **Responsive tables accessible**: Tables use responsive patterns (stack, scroll, or hide columns appropriately)

### Performance

- [ ] **No layout thrashing**: BreakpointObserver subscriptions don't cause excessive recalculations
- [ ] **CSS specificity low**: Avoids overly specific selectors that are hard to override responsively
- [ ] **Critical CSS for mobile**: Above-fold mobile styles optimized
- [ ] **Lighthouse mobile score ≥90**: Performance budget maintained

### Expert Interfaces (if applicable)

- [ ] **Minimum 992px enforced**: Expert interface uses 992px minimum or shows clear warning
- [ ] **Graceful degradation messaging**: Users on small screens see helpful message
- [ ] **Horizontal scroll indicated**: If interface scrolls horizontally, users are informed
- [ ] **Scaling-down principle applied**: Interface maintains structure but scales vs. reflows

### General

- [ ] **No magic numbers**: Breakpoint values use variables or Bootstrap mixins, not hardcoded pixels
- [ ] **Consistent patterns**: Follows established responsive patterns in codebase
- [ ] **No over-engineering**: Doesn't add responsive complexity where simple solution works
- [ ] **Cross-browser tested**: Verified in Chrome, Safari, Firefox, Edge

## References

### Authoritative sources
- [Bootstrap 5.1 Breakpoints Documentation](https://getbootstrap.com/docs/5.1/layout/breakpoints/)
- [Angular CDK Layout Module](https://material.angular.io/cdk/layout/overview)
- [WCAG 2.1 Success Criterion 2.5.5 (Target Size)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [WCAG 2.1 Success Criterion 1.4.10 (Reflow)](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)
- [Mobile Device Market Share - StatCounter](https://gs.statcounter.com/screen-resolution-stats/mobile/)

### Technical references
- [CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/) - W3C Recommendation
- [CSS Flexible Box Layout Module Level 1](https://www.w3.org/TR/css-flexbox-1/) - W3C Recommendation
- [Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) - MDN Web Docs
- [Using Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries) - MDN Web Docs
- [Angular Performance Best Practices](https://angular.io/guide/performance-best-practices) - Angular Documentation
- [Playwright Emulation](https://playwright.dev/docs/emulation) - Playwright Documentation

### Standards compliance
- **ISO/IEC/IEEE 42010:2022** - Systems and software engineering — Architecture description
- **WCAG 2.1 Level AA** - Web Content Accessibility Guidelines
- **Angular Style Guide** - Official Angular coding standards
- **Bootstrap 5.1** - CSS Framework standards

### External factors
- Android minimum device width is 360dp (density-independent pixels)
- iOS minimum device width is 375px (iPhone SE 2020+)
- 320px devices (iPhone SE 1st gen) <3% market share in target regions
- Google, Microsoft, and other major platforms use similar breakpoint systems
- CSS Container Queries browser support maturing (consider for future ADR)
