# ADR-010: View Replacement Standards for Journey Customization

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> View replacement enables app developers to provide custom routing configurations with entirely new view components for journey routes. This approach creates tight coupling to journey internals and should only be used when View Extension mechanisms are insufficient. Journeys must export all view components, services, guards, and resolvers as public API to support this pattern.

### Rules

**MUST DO ✅**

1. Evaluate View Extension pattern first before using view replacement
2. Export all routable view components in journey's public API (`src/index.ts`)
3. Export all UI components used in view templates in journey module's `exports` array
4. Export all services, guards, and resolvers used by view components
5. Document complete routing structure in journey README
6. Create bundle module wrapper when implementing custom routing
7. Maintain journey's route guards unless explicitly overriding with justification

**MUST NOT ❌**

1. Do not extend OOTB view components via TypeScript inheritance (fragile pattern)
2. Do not remove `canActivate`/`canDeactivate` guards without security review
3. Do not access journey internals beyond the public API
4. Do not use `innerHTML` with unsanitized user data in custom views
5. Do not create custom views without thorough testing including error scenarios
6. Do not bypass journey guards without valid reason and security approval
7. Do not assume routing changes in journeys are breaking changes from journey's perspective

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

<!-- 
Cross-reference: For subscription cleanup (takeUntil) pattern, see ADR-000 Pattern 1.
-->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| bundle, module, wrapper, forRoot | [Pattern 1: Bundle Module Wrapper](#pattern-1-bundle-module-wrapper) |
| routing, routes, custom, override | [Pattern 2: Custom Routing Configuration](#pattern-2-custom-routing-configuration) |
| view, component, custom, replace | [Pattern 3: Custom View Component](#pattern-3-custom-view-component) |
| export, public API, index | [Pattern 4: Journey Public API Exports](#pattern-4-journey-public-api-exports) |
| extend, inheritance, OOTB | [Pattern 5: Component Composition vs Extension](#pattern-5-component-composition-vs-extension) |

---

### Pattern 1: Bundle Module Wrapper

**Use when:** You need to customize routing or configuration for a journey

**Don't use when:** Using journey with default configuration and no view replacement needed

✅ **Good**

```typescript
// CONTEXT: Creating bundle module to wrap journey with custom routing
// RULE: Bundle module imports journey with forRoot() and provides custom configuration

// File: apps/my-app/src/app/some-journey/some-journey-bundle.module.ts
import { NgModule } from '@angular/core';
import { SomeJourneyModule, SomeJourneyConfiguration } from '@backbase/some-journey';
import { customRoute } from './some-journey-custom-routes';

@NgModule({
  imports: [
    SomeJourneyModule.forRoot({
      route: customRoute,
    }),
  ],
  providers: [
    {
      provide: SomeJourneyConfiguration,
      useValue: {
        // journey-specific configuration
      } as SomeJourneyConfiguration,
    },
  ],
})
export class SomeJourneyBundleModule {}
```

❌ **Bad**

```typescript
// PROBLEM: Directly importing journey module without bundle wrapper loses customization point

// File: apps/my-app/src/app/app-routing.module.ts
{
  path: 'some-path',
  loadChildren: () =>
    import('@backbase/some-journey').then(m => m.SomeJourneyModule),
}
```

**Why it's wrong:** Without a bundle module wrapper, you cannot provide custom routing configuration or journey-specific settings. The journey loads with defaults only.

**Verify:**
- [ ] Bundle module exists in app directory
- [ ] Bundle module imports journey with `forRoot()`
- [ ] App routing lazy loads the bundle module, not the journey directly

---

### Pattern 2: Custom Routing Configuration

**Use when:** Replacing one or more views in a journey with custom components

**Don't use when:** View Extension slots are sufficient for the customization

✅ **Good**

```typescript
// CONTEXT: Creating custom routing that replaces list view while keeping detail view
// RULE: Import components, guards, resolvers from journey public API; replace only needed views

// File: apps/my-app/src/app/some-journey/some-journey-custom-routes.ts
import { Route } from '@angular/router';
import {
  DetailViewComponent,       // Keep original
  SomeResolverService,
  SomeGuard,
} from '@backbase/some-journey';
import { CustomListComponent } from './custom-list/custom-list.component';

export const customRoute: Route = {
  path: '',
  children: [
    {
      path: 'list',
      component: CustomListComponent,  // REPLACED with custom component
      resolve: {
        title: SomeResolverService,    // KEEP original resolver
      },
    },
    {
      path: 'detail/:id',
      component: DetailViewComponent,  // KEEP original
      resolve: {
        title: SomeResolverService,
      },
      canActivate: [SomeGuard],        // KEEP original guard
    },
  ],
};
```

❌ **Bad**

```typescript
// PROBLEM: Removing guards and resolvers without understanding implications

import { Route } from '@angular/router';
import { CustomListComponent } from './custom-list/custom-list.component';
import { CustomDetailComponent } from './custom-detail/custom-detail.component';

export const customRoute: Route = {
  path: '',
  children: [
    {
      path: 'list',
      component: CustomListComponent,
      // Missing resolver - breaks title functionality
    },
    {
      path: 'detail/:id',
      component: CustomDetailComponent,
      // Missing canActivate - bypasses authorization!
    },
  ],
};
```

**Why it's wrong:** Removing guards bypasses authorization checks, creating security vulnerabilities. Removing resolvers breaks functionality that views depend on.

**Verify:**
- [ ] All original guards are maintained (or removal is justified and approved)
- [ ] All original resolvers are maintained (or custom view handles data differently)
- [ ] Imports use `@backbase/<journey>` package, not relative paths
- [ ] Route structure matches journey's documented structure initially

---

### Pattern 3: Custom View Component

**Use when:** Implementing the replacement view component

**Don't use when:** Minor UI tweaks possible via View Extension slots

✅ **Good**

```typescript
// CONTEXT: Custom view component that uses journey services and state
// RULE: Inject journey services from public API; reuse journey UI components when possible

// File: apps/my-app/src/app/some-journey/custom-list/custom-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  SomeJourneyState, 
  SomeJourneyService 
} from '@backbase/some-journey';

@Component({
  selector: 'app-custom-list',
  templateUrl: './custom-list.component.html',
  styleUrls: ['./custom-list.component.scss'],
})
export class CustomListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  constructor(
    public readonly journeyState: SomeJourneyState,  // Public for template access
    private journeyService: SomeJourneyService,
  ) {}

  ngOnInit(): void {
    this.journeyState.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        // React to state changes
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAction(): void {
    this.journeyService.someMethod();
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: Accessing journey internals, not cleaning up subscriptions

import { Component, OnInit } from '@angular/core';
import { SomeInternalService } from '@backbase/some-journey/lib/internal/some.service';

@Component({
  selector: 'app-custom-list',
  templateUrl: './custom-list.component.html',
})
export class CustomListComponent implements OnInit {
  constructor(
    private internalService: SomeInternalService,  // NOT public API!
  ) {}

  ngOnInit(): void {
    this.internalService.internalData$.subscribe(data => {
      // Memory leak - no unsubscribe!
    });
  }
}
```

**Why it's wrong:** Importing from internal paths bypasses public API stability guarantees. Missing unsubscribe causes memory leaks. Internal services may change in minor versions.

**Verify:**
- [ ] All journey imports use public API (`@backbase/<journey>`)
- [ ] Observables are unsubscribed in `ngOnDestroy`
- [ ] Services used in template are `public readonly`
- [ ] Component is declared in bundle module

---

### Pattern 4: Journey Public API Exports

**Use when:** Developing a journey that should support view replacement

**Don't use when:** Journey explicitly does not support view replacement

✅ **Good**

```typescript
// CONTEXT: Journey index.ts exporting public API for view replacement support
// RULE: Export all routable components, services, guards, resolvers, and models

// File: libs/some-journey/src/index.ts

// View components (each route = one exported component)
export { ListViewComponent } from './lib/components/list-view/list-view.component';
export { DetailViewComponent } from './lib/components/detail-view/detail-view.component';
export { CreateViewComponent } from './lib/components/create-view/create-view.component';

// Services used by views
export { SomeJourneyState } from './lib/state/some-journey.state';
export { SomeJourneyService } from './lib/services/some-journey.service';

// Guards and resolvers
export { SomeGuard } from './lib/guards/some.guard';
export { TitleResolverService } from './lib/resolvers/title-resolver.service';

// Types and configuration
export { SomeDataModel } from './lib/models/some-data.model';
export { JourneyConfiguration } from './lib/config/journey-configuration';

// Module
export { SomeJourneyModule } from './lib/some-journey.module';
```

❌ **Bad**

```typescript
// PROBLEM: Only exporting module, not supporting view replacement

// File: libs/some-journey/src/index.ts
export { SomeJourneyModule } from './lib/some-journey.module';
// Missing: view components, services, guards, resolvers
```

**Why it's wrong:** Without exported view components, guards, resolvers, and services, app developers cannot create custom routing that maintains journey functionality.

**Verify:**
- [ ] All routable view components exported in `index.ts`
- [ ] All services used by views exported
- [ ] All guards and resolvers exported
- [ ] Journey module `exports` array includes all UI components

---

### Pattern 5: Component Composition vs Extension

**Use when:** Deciding how to create a custom view

**Don't use when:** N/A - always prefer composition

✅ **Good**

```typescript
// CONTEXT: Creating custom view that reuses journey components via composition
// RULE: Compose using journey's exported UI components, don't extend view components

// File: apps/my-app/src/app/some-journey/custom-list/custom-list.component.ts
import { Component } from '@angular/core';
import { SomeJourneyState } from '@backbase/some-journey';

@Component({
  selector: 'app-custom-list',
  template: `
    <div class="custom-layout">
      <app-custom-header></app-custom-header>
      
      <!-- Reuse journey's table component -->
      <bb-some-table 
        [data]="journeyState.items$ | async"
        (rowClick)="onRowClick($event)">
      </bb-some-table>
      
      <app-custom-footer></app-custom-footer>
    </div>
  `,
})
export class CustomListComponent {
  constructor(public readonly journeyState: SomeJourneyState) {}
  
  onRowClick(item: any): void { /* custom logic */ }
}
```

❌ **Bad**

```typescript
// PROBLEM: Extending OOTB component - fragile and not recommended

import { Component } from '@angular/core';
import { ListViewComponent } from '@backbase/some-journey';

@Component({
  selector: 'app-extended-list',
  templateUrl: './extended-list.component.html',  // Must duplicate template
})
export class ExtendedListComponent extends ListViewComponent {
  // Inherits non-public members that may change
  // Template references internal properties - fragile!
  
  additionalMethod(): void {
    // May call internal methods that change
    super.someInternalMethod();  // NOT guaranteed stable!
  }
}
```

**Why it's wrong:** TypeScript extension couples to component internals. Template must be duplicated and references non-public properties. Internal component logic may change in minor versions, breaking extensions.

**Verify:**
- [ ] Custom view does NOT extend journey view components
- [ ] Journey UI components used via selector composition
- [ ] Only public API services injected
- [ ] Template uses only `@Input()`/`@Output()` of journey components

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `VR-001` | Journey imports use public API path | 🔴 BLOCKER | `grep -r "from '@backbase/.*/(lib\|internal)" apps/` |
| `VR-002` | Custom components not extending journey views | 🔴 BLOCKER | `grep -r "extends.*Component.*from '@backbase" apps/` |
| `VR-003` | Custom views declared in bundle module | 🟡 WARNING | Check bundle module `declarations` array |
| `VR-004` | Journey exports all view components | 🟡 WARNING | Verify `index.ts` exports match routing components |
| `VR-005` | No innerHTML with user data | 🔴 BLOCKER | `grep -r "\[innerHTML\]" apps/` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `VR-R01` | View Extension evaluated first with documented rationale | 🔴 BLOCKER |
| `VR-R02` | Route guards maintained or removal approved by security | 🔴 BLOCKER |
| `VR-R03` | Custom routing imports from public API only | 🔴 BLOCKER |
| `VR-R04` | Observable subscriptions cleaned up in ngOnDestroy | 🔴 BLOCKER |
| `VR-R05` | Journey routing documentation updated (journey side) | 🟡 WARNING |
| `VR-R06` | Upgrade strategy documented for custom routing | 🟡 WARNING |
| `VR-R07` | Custom view handles error scenarios appropriately | 🟡 WARNING |
| `VR-R08` | Accessibility requirements met in custom view | 🔴 BLOCKER |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Custom view component renders correctly | Unit | ✅ Yes |
| Custom view integrates with journey services | Unit | ✅ Yes |
| Custom routing configuration loads views | Integration | ✅ Yes |
| Error scenarios handled gracefully | Unit | ✅ Yes |
| Custom view works in journey routing | E2E | ✅ Yes |
| Data flows correctly from journey services | Integration | ✅ Yes |
| Journey upgrade doesn't break custom routing | Regression | ⚪ Recommended |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Some requirements cannot be satisfied by View Extension—they require fundamentally different view structures or workflows. No standardized way to override views while maintaining access to journey services.

### Business Drivers

- Complete customization when View Extension insufficient
- Regional/vertical regulations may mandate different UI
- Competitive differentiation with distinctive experiences

### Technical Constraints

- Angular Router `Route[]` structure
- Custom views must access journey services/guards/resolvers
- Journey routing changes are not guaranteed breaking changes

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

View Extension takes priority; view replacement available when needed. Journeys export all view components, services, guards, resolvers as public API. Custom routing via bundle modules with `forRoot()`. Composition over inheritance.

### Rationale

| Choice | Why |
|--------|-----|
| Export full public API | Custom views can access journey services/logic |
| Bundle module pattern | Maintains lazy loading, co-located configuration |
| Composition over inheritance | Component inheritance is fragile, breaks on internal changes |
| View Extension first | Explicit trade-off documentation for informed decisions |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Journey public API | MODIFY | `libs/<journey>/src/index.ts` |
| Journey module | MODIFY | `libs/<journey>/src/lib/*.module.ts` |
| App bundle module | CREATE | `apps/<app>/src/app/<journey>/*-bundle.module.ts` |
| Custom routes | CREATE | `apps/<app>/src/app/<journey>/*-custom-routes.ts` |
| Custom view components | CREATE | `apps/<app>/src/app/<journey>/<view>/*.component.ts` |
| Journey documentation | MODIFY | `libs/<journey>/README.md` |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-009 View Extension Standards | Evaluate first before view replacement |
| ADR-007 Journey Configuration Standards | Bundle module configuration pattern |
| ADR-013 Unit/Integration Testing Standards | Testing requirements for custom views |

### Migration Notes

N/A - This is a new customization standard. Existing view replacements should be reviewed against this ADR for compliance with public API usage and security requirements.

---

## 7. Examples

### Complete Example

<!-- 
NOTE: For bundle module, custom routing, and custom view patterns,
see Patterns 1-3 above. This example shows file organization only.
-->

**Scenario:** Replace list view in transactions journey, keep detail view original

**File Organization:**

```
apps/my-app/src/app/transactions/
├── transactions-custom-routes.ts       # Custom Route[] (Pattern 2)
├── transactions-bundle.module.ts       # Bundle with forRoot() (Pattern 1)
└── custom-list/
    └── custom-list.component.ts        # Custom view using journey services (Pattern 3)
```

**Key Integration Points:**

| Step | What | How |
|------|------|-----|
| 1. Custom routes | Replace only list, keep detail | Import `DetailViewComponent`, guards, resolvers from journey |
| 2. Bundle module | Wrap journey | `JourneyModule.forRoot({ route: customRoute })` |
| 3. Custom view | Use journey services | Inject from public API (`@backbase/journey`), use composition |

**Critical Rules:**
- Keep original guards (`canActivate: [OriginalGuard]`) unless security-reviewed
- Import ONLY from journey's public API (not `/lib/internal/`)
- Use composition, never `extends OriginalComponent`

### Common Mistakes

**Mistake 1: Importing from internal paths**

```typescript
// ❌ Wrong
import { SomeService } from '@backbase/some-journey/lib/internal/some.service';

// ✅ Fix
import { SomeService } from '@backbase/some-journey';
```

**Mistake 2: Removing security guards**

```typescript
// ❌ Wrong
{
  path: 'admin',
  component: AdminViewComponent,
  // Missing canActivate - security bypass!
}

// ✅ Fix
{
  path: 'admin',
  component: AdminViewComponent,
  canActivate: [AdminGuard],  // Keep original guard
}
```

**Mistake 3: Extending journey components**

```typescript
// ❌ Wrong
export class CustomListComponent extends JourneyListComponent {
  // Fragile - depends on internal implementation
}

// ✅ Fix
export class CustomListComponent {
  constructor(public readonly state: JourneyState) {}
  // Compose, don't extend
}
```

**Mistake 4: Not declaring custom component in bundle**

```typescript
// ❌ Wrong
@NgModule({
  imports: [JourneyModule.forRoot({ route: customRoute })],
  // Missing declarations!
})

// ✅ Fix
@NgModule({
  declarations: [CustomViewComponent],
  imports: [JourneyModule.forRoot({ route: customRoute })],
})
```

---

## 8. References

- [Angular Router Documentation](https://angular.io/guide/router) — Core routing concepts and configuration
- [Angular NgModule FAQs](https://angular.io/guide/ngmodule-faq) — Module exports and public API patterns
- [Angular Dependency Injection](https://angular.io/guide/dependency-injection) — Service injection in custom views
- [Angular Route Interface](https://angular.io/api/router/Route) — Route configuration API
- [TypeScript Modules](https://www.typescriptlang.org/docs/handbook/modules.html) — Public API export patterns
- [Semantic Versioning 2.0.0](https://semver.org/) — Versioning conventions for journey public API
- [Nx Library Types](https://nx.dev/concepts/more-concepts/library-types) — Library public APIs in monorepos
- [Backbase Developer Portal](http://developer.backbase.com/angular/) — Journey routing documentation

---
