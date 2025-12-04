# ADR-010: View Replacement Standards for Journey Customization

---

## Decision summary

View replacement enables app developers to provide custom routing configurations with entirely new view components for one or more journey routes. This approach provides maximum customization flexibility but creates tight coupling to journey internals, making upgrades difficult. View replacement should only be used when View Extension mechanisms are insufficient for the required customization. This decision defines the standards, requirements, and implementation patterns for view replacement to minimize upgrade friction while maintaining necessary customization capabilities.

## Context and problem statement

### Business context
- **Complete Customization Need:** Some customer requirements cannot be satisfied by predefined extension points; they require fundamentally different view structures, workflows, or data presentations
- **Market-Specific Requirements:** Regional or vertical-specific regulations may mandate UI structures incompatible with out-of-the-box journey views
- **Competitive Differentiation:** Customers need ability to create distinctive user experiences that significantly diverge from standard journeys
- **Migration Path:** Legacy applications being migrated may have existing UIs that need preservation during transition
- **Success Criteria:**
  - Customers can completely override journey views when necessary
  - Journey teams understand what must be exposed to enable view replacement
  - App developers understand maintenance implications of view replacement
  - Clear decision criteria guide when to use view replacement vs. view extension
  - Journey updates that impact replaced views are discoverable and documentable

### Technical context
- **Existing Landscape:** Angular-based journey bundles using Angular Router's lazy loading and `forRoot()` configuration pattern in Nx monorepo
- **Current Challenge:** Journey routing configuration is internal to journeys; no standardized way to override views while maintaining access to journey services, guards, resolvers
- **Affected Systems:**
  - Journey bundle libraries (transactions, payments, accounts, etc.)
  - Journey routing configuration (`journey.routes.ts`)
  - Journey public API (component exports, service exports)
  - Application bundle modules (retail-universal, business-universal)
  - Angular Router lazy loading mechanism
  - Build-time type checking and compilation
- **Technical Challenges:**
  - Exposing sufficient journey internals for custom views without creating maintenance nightmares
  - Maintaining type safety for routable components, services, guards, resolvers
  - Documenting stable public API surface for view components
  - Version compatibility when journey routing structure changes
  - Testing custom views against journey updates
  - Managing complexity of duplicated routing configuration

### Constraints and assumptions

**Technical Constraints:**
- Must work with Angular Router's configuration structure (`Route[]`)
- Custom views must have access to journey services, state management, guards, resolvers
- Journey view components must be exported as part of journey's public API
- All components used in view templates must be available for re-use
- Routing changes in journeys are not guaranteed to be breaking changes from journey's perspective
- Custom routing must support lazy loading pattern
- Must maintain TypeScript type safety for all imported journey artifacts

**Business Constraints:**
- View replacement understood to incur maintenance cost for app developers
- Journey teams not responsible for breaking changes to routing structure within major versions
- App developers accept responsibility for merging routing changes during journey upgrades
- View Extension pattern must be documented and considered first
- Documentation must clearly communicate maintenance implications

**Environmental Constraints:**
- Must work within Nx monorepo architecture
- Must integrate with journey module `forRoot()` pattern
- Custom components created in app-level directories, not journey libraries
- Node modules directory contains compiled JavaScript of journey routes (not TypeScript source)
- Journey routing configuration may evolve without being considered breaking changes

**Assumptions Made:**
- App developers have sufficient Angular and TypeScript expertise to implement custom views
- App developers can access journey route structure via documentation or node_modules inspection
- View replacement used sparingly for cases where View Extension insufficient
- Journey teams commit to exporting view components, services, guards, resolvers as public API
- App developers understand and accept upgrade maintenance burden
- Custom views will potentially use journey's internal services and state management

## Decision

### What we decided

**We will support view replacement as an advanced customization mechanism** with the following characteristics:

1. **View Extension Takes Priority:**
   - View Extension must be evaluated first for all customization requests
   - View replacement only used when View Extension insufficient or inappropriate
   - Decision criteria documented: structural changes, workflow changes, data model changes justify view replacement

2. **Journey Requirements for Supporting View Replacement:**
   
   **A. Export All Routable View Components:**
   - Every view component representing a route must be exported in journey's public API (`src/index.ts`)
   - Each route represented by single view component (not multiple components or dynamic resolution)
   - Exported components considered stable within major version (semver conventions apply)
   
   **B. Export All UI Components Used in Views:**
   - All components rendered within view components must be exported in journey module's `exports` array
   - Enables custom views to re-use journey components "as is" or compose new structures
   - Allows partial view replacement (keep some original components, replace others)
   - Component selectors, inputs, outputs considered public API (stable within major version)
   - Not required to re-export in `index.ts` (module-level exports sufficient)
   
   **C. Export Services and Injectables:**
   - All services, state management, and other injectables used by view components must be exported in public API
   - Enables custom view developers to inject same services as original views
   - Service public methods and properties considered stable API
   
   **D. Document Routing Configuration:**
   - Complete routing structure documented at http://developer.backbase.com/angular/
   - Documentation includes routes, view components, guards, resolvers, route data
   - Changes to routing structure communicated in changelog (even if not technically breaking)
   - Routing documentation updated with each journey release

3. **App Developer Implementation Pattern:**
   
   **Step 1: Create Bundle Module** (if not exists)
   - Wrap journey in app-level bundle module
   - Bundle module imports journey module with `forRoot()`
   - Bundle module provides journey configuration
   - App routing lazy loads bundle module
   
   **Step 2: Copy Routing Configuration**
   - Copy journey's routing from documentation or node_modules compiled JavaScript
   - Create `<journey>-custom-routes.ts` in app bundle directory
   - Import view components, guards, resolvers from `@backbase/<journey>`
   - Maintain original routing structure initially (validate no breaks)
   
   **Step 3: Provide Custom Routing**
   - Pass custom routes to journey's `forRoot({ route: customRoute })`
   - Verify application functions identically (no changes yet)
   
   **Step 4: Create Custom View Component**
   - Implement custom component in app directory
   - Inject necessary journey services (exported from journey public API)
   - Implement view logic (can be from scratch or extend journey patterns)
   - Create template using journey UI components or custom markup
   
   **Step 5: Replace View in Routing**
   - Update custom routing configuration to use custom component
   - Update any dependent route configuration (titles, guards, etc.)
   - Test thoroughly including edge cases and error scenarios

4. **Extending OOTB Components (Advanced Pattern):**
   - TypeScript extension of journey view components is technically possible but **NOT RECOMMENDED**
   - **Concerns:**
     - Non-public properties/methods used in custom template are fragile
     - Journey developers unaware of extended usage patterns
     - Template duplication leads to "component not declared" errors
     - Higher upgrade risk than full custom implementation
   - **If Used:** App developer accepts full responsibility for maintenance
   - **Alternative:** Contact journey team to request View Extension slot

5. **Documentation and Communication:**
   - Journey README includes "View Replacement Support" section
   - Lists all exported view components with route paths
   - Documents exported services and their purposes
   - Provides example of copying and overriding routing
   - Changelog explicitly calls out routing structure changes
   - Migration guides provided when routing changes significantly

### Rationale

**Why this decision addresses the problem:**

1. **Maximum Flexibility:** Enables complete UI overhaul when business requirements demand it; no artificial limitations on customization scope
2. **Explicit Trade-offs:** Clear documentation of maintenance cost ensures informed decisions; app developers know what they're accepting
3. **Public API Boundaries:** Explicit exports create contract between journey and app; TypeScript compilation enforces compatibility
4. **Fallback Option:** Ensures view extension pattern doesn't become bottleneck; customers not blocked when extension insufficient
5. **Journey Team Clarity:** Clear requirements (exports, documentation) guide journey development; no ambiguity about responsibilities
6. **Upgrade Discoverability:** Documented routing changes enable app developers to plan and execute updates; not surprised by breaks
7. **Service Reuse:** Exported services enable custom views to maintain journey's business logic; don't have to reimplement everything
8. **Component Reuse:** Exported components allow partial customization; replace view but keep complex components (tables, forms, etc.)

**Key evaluation criteria:**
- ✅ **Customization Completeness:** No limitations on UI structure or workflow changes
- ⚠️ **Maintainability:** Lower than view extension; explicitly documented trade-off
- ⚠️ **Upgrade Safety:** Custom routing may break; requires manual merge of changes
- ✅ **Type Safety:** TypeScript enforces valid imports and usage
- ✅ **Service Reuse:** Custom views can leverage journey business logic
- ⚠️ **Component Reuse:** Possible but requires careful dependency management
- ✅ **Documentation:** Routing structure documented per requirement

**Factors influencing choice:**
- View Extension cannot cover all possible customization scenarios
- Some customers have requirements that fundamentally change view structure
- Angular Router provides natural override mechanism via route configuration
- TypeScript compilation provides safety net for public API usage
- Journey module `forRoot()` already accepts custom route configuration
- Market demands balance between product standardization and customer flexibility
- Similar patterns exist in other frameworks (React Router configuration, Vue Router overrides)

## Implementation details

### Technical approach

**1. Journey-Side Implementation**

**Requirement A: Export All Routable View Components**

Location: `<journey>/src/index.ts`

```typescript
// Export all view components that represent routes
export { SomeViewComponent } from './lib/components/some-view/some-view.component';
export { AnotherViewComponent } from './lib/components/another-view/another-view.component';
export { DetailViewComponent } from './lib/components/detail-view/detail-view.component';
// ... all routable view components
```

**Design principle:** Each route in journey's routing configuration must be represented by a single exported component. App developers need access to these to recreate routing configuration.

**Requirement B: Export All UI Components in Journey Module**

Location: `<journey>/src/lib/journey.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { SomeViewComponent } from './components/some-view/some-view.component';
import { SomeFormComponent } from './components/some-form/some-form.component';
import { SomeTableComponent } from './components/some-table/some-table.component';
import { SomeHeaderComponent } from './components/some-header/some-header.component';

@NgModule({
  declarations: [
    SomeViewComponent,
    SomeFormComponent,
    SomeTableComponent,
    SomeHeaderComponent,
    // ... all components
  ],
  exports: [
    // Export ALL components used in view templates
    // This enables custom views to use them "as is"
    SomeViewComponent,
    SomeFormComponent,
    SomeTableComponent,
    SomeHeaderComponent,
    // ... all components
  ],
  imports: [/* ... */],
})
export class JourneyModule {
  static forRoot(config: JourneyModuleConfig = {}): ModuleWithProviders<JourneyModule> {
    return {
      ngModule: JourneyModule,
      providers: [
        provideRoutes([config.route || defaultRoute]),
        // ... other providers
      ],
    };
  }
}
```

**Note:** Components must be in module's `exports` array to be usable in custom view templates. Component selectors, @Input() properties, and @Output() events are considered public API.

**Requirement C: Export Services and Injectables**

Location: `<journey>/src/index.ts`

```typescript
// Export services used by view components
export { SomeJourneyState } from './lib/state/some-journey.state';
export { SomeJourneyService } from './lib/services/some-journey.service';
export { SomeDataService } from './lib/services/some-data.service';

// Export guards and resolvers used in routing
export { SomeGuard } from './lib/guards/some.guard';
export { SomeResolverService } from './lib/resolvers/some-resolver.service';

// Export types/interfaces that custom views might need
export { SomeDataModel } from './lib/models/some-data.model';
export { JourneyConfiguration } from './lib/config/journey-configuration';
```

**Design principle:** Export anything that original view components use which custom view developers might need. Public methods and properties of exported services are considered stable API.

**Requirement D: Document Routing Configuration**

Location: `<journey>/README.md` section "Routing Structure"

```markdown
## Routing Structure

### Routes

The journey defines the following routing structure:

#### Root Route
- **Path:** `''` (empty)
- **Component:** None (parent route)
- **Children:** [see below]

#### List View
- **Path:** `'list'`
- **Component:** `ListViewComponent`
- **Resolve:** `{ title: TitleResolverService }`
- **Description:** Displays paginated list of items

#### Detail View
- **Path:** `'detail/:id'`
- **Component:** `DetailViewComponent`
- **Resolve:** `{ title: TitleResolverService, data: DataResolverService }`
- **CanActivate:** `[DetailGuard]`
- **Description:** Displays detailed information for specific item

#### Create View
- **Path:** `'create'`
- **Component:** `CreateViewComponent`
- **Resolve:** `{ title: TitleResolverService }`
- **CanActivate:** `[CreateGuard]`
- **Description:** Form for creating new item

### View Replacement Support

This journey supports view replacement. To replace views:

1. All view components listed above are exported in public API
2. All components, guards, and resolvers are importable from `@backbase/<journey>`
3. Example routing configuration available in `docs/routing-example.ts`

**Note:** Routing structure may change in minor versions. Check changelog for routing updates.
```

**Note:** Documentation should be comprehensive enough that app developers can recreate routing without inspecting node_modules.

---

**2. App-Side Implementation**

**Step 1: Create Bundle Module**

Location: `apps/<app>/src/app/<journey>/<journey>-bundle.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { SomeJourneyModule } from '@backbase/some-journey';

@NgModule({
  imports: [
    SomeJourneyModule.forRoot({
      // Configuration will be added here
    }),
  ],
  providers: [
    {
      provide: SomeJourneyConfiguration,
      useValue: {
        // ... journey-specific configuration
      } as SomeJourneyConfiguration,
    },
  ],
})
export class SomeJourneyBundleModule {}
```

Location: `apps/<app>/src/app/app-routing.module.ts`

```typescript
{
  path: 'some-path',
  loadChildren: () =>
    import('./some-journey/some-journey-bundle.module').then(
      (m) => m.SomeJourneyBundleModule
    ),
}
```

**Note:** Bundle module wraps journey module, providing app-level configuration and customization point.

**Step 2: Copy Routing Configuration**

Location: `apps/<app>/src/app/<journey>/<journey>-custom-routes.ts`

```typescript
import { Route } from '@angular/router';
import {
  SomeViewComponent,
  AnotherViewComponent,
  DetailViewComponent,
  SomeResolverService,
  SomeGuard,
} from '@backbase/some-journey';

export const customRoute: Route = {
  path: '',
  children: [
    {
      path: 'list',
      component: SomeViewComponent,
      resolve: {
        title: SomeResolverService,
      },
    },
    {
      path: 'detail/:id',
      component: DetailViewComponent,
      resolve: {
        title: SomeResolverService,
      },
      canActivate: [SomeGuard],
    },
    {
      path: 'create',
      component: AnotherViewComponent,
      resolve: {
        title: SomeResolverService,
      },
    },
  ],
};
```

**Source of routing structure:**
1. **Preferred:** Journey documentation (README or developer.backbase.com)
2. **Fallback:** Inspect `node_modules/@backbase/<journey>/esm2015/src/<journey>.routes.js` (compiled JavaScript)

**Note:** At this stage, routing is identical to journey's original routing. This validates the copy before making changes.

**Step 3: Provide Custom Routing Configuration**

Location: `apps/<app>/src/app/<journey>/<journey>-bundle.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { SomeJourneyModule } from '@backbase/some-journey';
import { customRoute } from './<journey>-custom-routes';

@NgModule({
  imports: [
    SomeJourneyModule.forRoot({
      route: customRoute, // Provide custom routing
    }),
  ],
  providers: [/* ... */],
})
export class SomeJourneyBundleModule {}
```

**Validation:** Run application and verify it works identically to before. If there are differences, routing copy is incorrect.

**Step 4: Create Custom View Component**

Location: `apps/<app>/src/app/<journey>/<custom-view>/<custom-view>.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { 
  SomeJourneyState, 
  SomeJourneyService 
} from '@backbase/some-journey';

@Component({
  selector: 'app-custom-view',
  templateUrl: './custom-view.component.html',
  styleUrls: ['./custom-view.component.scss'],
})
export class CustomViewComponent implements OnInit {
  constructor(
    public readonly journeyState: SomeJourneyState,
    private journeyService: SomeJourneyService,
  ) {}

  ngOnInit(): void {
    // Initialize component
    // Can call journey services, access journey state
  }

  someAction(): void {
    this.journeyService.someMethod();
  }
}
```

**Template Options:**

**Option A: Completely Custom Template**
```html
<!-- Fully custom HTML structure -->
<div class="custom-container">
  <h1>Custom View</h1>
  <p>{{ journeyState.someData$ | async }}</p>
  <button (click)="someAction()">Custom Action</button>
</div>
```

**Option B: Re-use Journey Components**
```html
<!-- Use journey's exported components within custom structure -->
<div class="custom-container">
  <app-custom-header></app-custom-header>
  
  <!-- Journey's original table component -->
  <bb-some-table [data]="journeyState.data$ | async"></bb-some-table>
  
  <app-custom-footer></app-custom-footer>
</div>
```

**Note:** Journey components can be used via their selectors if exported in journey module's `exports` array.

**Step 5: Replace View in Routing**

Location: `apps/<app>/src/app/<journey>/<journey>-custom-routes.ts`

```typescript
import { Route } from '@angular/router';
import {
  SomeViewComponent,
  DetailViewComponent,  // Keep original
  SomeResolverService,
  SomeGuard,
} from '@backbase/some-journey';
import { CustomViewComponent } from './custom-view/custom-view.component';

export const customRoute: Route = {
  path: '',
  children: [
    {
      path: 'list',
      component: CustomViewComponent,  // REPLACED with custom component
      resolve: {
        title: SomeResolverService,
      },
    },
    {
      path: 'detail/:id',
      component: DetailViewComponent,  // Kept original
      resolve: {
        title: SomeResolverService,
      },
      canActivate: [SomeGuard],
    },
  ],
};
```

Location: `apps/<app>/src/app/<journey>/<journey>-bundle.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { SomeJourneyModule } from '@backbase/some-journey';
import { customRoute } from './<journey>-custom-routes';
import { CustomViewComponent } from './custom-view/custom-view.component';

@NgModule({
  declarations: [
    CustomViewComponent,  // Declare custom component
  ],
  imports: [
    SomeJourneyModule.forRoot({
      route: customRoute,
    }),
    // ... other imports
  ],
  providers: [/* ... */],
})
export class SomeJourneyBundleModule {}
```

**Testing:** Thoroughly test custom view including:
- All data loads correctly
- All actions function as expected
- Error scenarios handled appropriately
- Responsive behavior works
- Accessibility requirements met
- Performance acceptable

---

**3. Advanced Pattern: Extending OOTB Components (NOT RECOMMENDED)**

**Pattern Description:**

TypeScript class extension of journey view components to reuse logic while providing custom template.

```typescript
import { Component } from '@angular/core';
import { SomeViewComponent } from '@backbase/some-journey';

@Component({
  selector: 'app-extended-view',
  templateUrl: './extended-view.component.html',  // Custom template
  styleUrls: ['./extended-view.component.scss'],
})
export class ExtendedViewComponent extends SomeViewComponent {
  // Inherits all properties and methods from SomeViewComponent
  // Can override methods if needed
  
  additionalProperty: string = 'custom value';
  
  customMethod(): void {
    // Custom logic
    // Can call super.someMethod() if overriding
  }
}
```

**Challenges with this pattern:**

1. **Fragile Template Dependencies:**
   - Custom template uses properties/methods not guaranteed to be public API
   - Journey team may refactor component internals breaking custom template
   - No compile-time safety for template expressions referencing internal members

2. **Component Declaration Errors:**
   - Journey's internal components used in custom template may not be declared/exported
   - Results in "component is not known" Angular compilation errors
   - Requires importing additional journey modules, increasing coupling

3. **Property Visibility:**
   - `private` and `protected` members not accessible in template
   - Journey may change property visibility in non-breaking releases
   - Workarounds (accessing via `any` cast) defeat type safety

4. **Lifecycle Complexity:**
   - Must call `super.ngOnInit()`, `super.ngOnDestroy()`, etc. if overriding
   - Easy to forget, leading to memory leaks or broken functionality
   - Journey may add lifecycle logic in minor versions

**When this pattern might be acceptable:**

- Journey component explicitly documented as "extendable"
- Only public methods/properties used in custom template
- App developer commits to frequent testing against journey updates
- Custom template very similar to original (minimal changes)

**Recommendation:** Create fully custom component instead. Copy necessary logic rather than extending. Journey services are designed to be reused; components are not.

---

**4. Key Integration Patterns**

**Pattern 1: Partial View Replacement**
```typescript
// Replace only one view, keep others original
export const customRoute: Route = {
  path: '',
  children: [
    {
      path: 'list',
      component: CustomListComponent,  // CUSTOM
    },
    {
      path: 'detail/:id',
      component: OriginalDetailComponent,  // ORIGINAL from journey
    },
    {
      path: 'create',
      component: OriginalCreateComponent,  // ORIGINAL from journey
    },
  ],
};
```

**Pattern 2: Re-using Journey Components in Custom View**
```html
<!-- Custom view template using journey's exported components -->
<div class="custom-layout">
  <div class="custom-sidebar">
    <!-- Custom navigation -->
  </div>
  
  <div class="custom-main">
    <!-- Journey's original form component -->
    <bb-some-form 
      [formData]="data$ | async"
      (formSubmit)="onSubmit($event)">
    </bb-some-form>
  </div>
</div>
```

**Pattern 3: Maintaining Custom Routes Across Journey Updates**

**When journey updates, compare:**
```typescript
// Journey's NEW routing (from changelog or docs)
{
  path: 'list',
  component: ListViewComponent,
  resolve: { title: TitleResolver, newResolver: NewDataResolver },  // Added resolver
  data: { breadcrumb: 'List' },  // Added data
}

// Your CUSTOM routing (update to match)
{
  path: 'list',
  component: CustomListComponent,  // Keep custom component
  resolve: { title: TitleResolver, newResolver: NewDataResolver },  // ADD new resolver
  data: { breadcrumb: 'List' },  // ADD new data
}
```

**Process:**
1. Read journey changelog for routing changes
2. Compare journey's new routing with your custom routing
3. Update custom routing to include new guards, resolvers, data
4. Test thoroughly to ensure new routing configuration works with custom component
5. Update custom component to handle any new resolved data or route params

**Pattern 4: Accessing Journey State in Custom Component**
```typescript
@Component({/* ... */})
export class CustomViewComponent implements OnInit {
  // Inject journey state management
  constructor(
    public readonly journeyState: SomeJourneyState,
  ) {}
  
  // Use in template
  // <div>{{ journeyState.items$ | async }}</div>
  
  // Or subscribe in component
  ngOnInit(): void {
    this.journeyState.items$.subscribe(items => {
      // React to state changes
    });
  }
}
```

---

**5. Security and Compliance Measures**

- **Authorization:** Custom views must respect journey's guards; do not remove `canActivate`, `canDeactivate` guards without understanding implications
- **Data Access:** Custom views accessing journey services receive same permission-checked data as original views
- **XSS Prevention:** Use Angular's built-in sanitization; avoid `innerHTML` with user data; use `DomSanitizer` when dynamic HTML necessary
- **Route Guards:** Maintain journey's route guards unless explicitly overriding for valid reason; guards often enforce business rules and permissions
- **Service Usage:** Journey services may have preconditions; review service documentation before calling from custom views
- **Type Safety:** Maintain TypeScript strict mode; type checking prevents many security issues from incorrect API usage

### Standards compliance

Document compliance with Design Authority standards:
- [x] Platform API standards followed (Angular public API patterns)
- [x] TypeScript strict mode compilation enforced
- [x] Journey public API exports documented and versioned
- [x] Semver conventions applied to view component exports
- [x] Routing changes documented in changelog
- [x] Security considerations addressed (guards, sanitization)
- [x] Accessibility requirements delegated to custom view developers
- [x] Performance considerations documented (lazy loading maintained)

### Quality attributes addressed

| Quality Attribute | Requirement | How Decision Addresses It |
|-------------------|-------------|---------------------------|
| Customization Flexibility | Complete UI override capability | Full routing replacement enables any UI structure |
| Type Safety | Compile-time verification of imports | TypeScript enforces valid usage of journey exports |
| Maintainability | Clear upgrade path despite coupling | Documented routing, exported APIs, changelog process |
| Performance | No degradation vs. original journey | Lazy loading maintained; custom views control performance |
| Security | Consistent authorization and data access | Journey guards and services enforce permissions |
| Testability | Custom views can be unit tested | Standard Angular component testing applies |
| Discoverability | Developers understand what's replaceable | Comprehensive documentation of exports and routing |
| Backward Compatibility | Journey exports remain stable within major versions | Semver conventions; breaking changes only in major releases |

## Consequences

### Positive consequences
- **Unblocked Customization:** Customers with requirements beyond View Extension capabilities have supported path forward
- **Documented Process:** Clear steps reduce ambiguity and support burden; app developers know what to do
- **Type Safety:** Compile-time checking catches many integration issues early; TypeScript provides safety net
- **Service Reuse:** Custom views can leverage journey business logic; don't need to reimplement everything
- **Component Reuse:** Ability to use journey's components enables partial customization; replace view but keep complex components
- **Clear Ownership:** Journey team knows what must be exported; app team knows they own maintenance of custom views
- **Fallback Option:** View Extension pattern can evolve without pressure to handle every edge case
- **Upgrade Discoverability:** Documented routing changes allow app developers to plan updates

### Negative consequences
- **Tight Coupling:** Custom routing couples app to journey's routing structure; increases upgrade friction
- **Maintenance Burden:** App developers must merge routing changes during journey updates; ongoing effort required
- **Journey Complexity:** Journey public API surface area increases; more to document and maintain
- **Non-Breaking Changes Can Break:** Journey routing changes not considered breaking from journey perspective may break custom routing
- **Testing Burden:** Custom views require thorough testing; app team responsible for quality
- **Support Complexity:** Support must diagnose whether issues in journey or custom view; requires more context
- **Export Discipline:** Journey teams must remember to export components, services, maintain public API stability
- **Documentation Overhead:** Journey teams must maintain routing documentation; update with each change

### Risks and mitigation

| Risk | Probability | Impact | Mitigation Strategy | Owner |
|------|-------------|---------|---------------------|-------|
| Journey routing changes break custom routing | High | Medium | Document routing changes in changelog; provide migration guide | Journey Teams |
| App developers unaware of routing changes | Medium | High | Automated detection in CI (compare route structure); release notes highlighting routing changes | Platform Team |
| Journey forgets to export necessary components | Medium | Medium | Code review checklist for journey PRs; automated linting rule to check exports | Journey Teams |
| Custom views break journey functionality | Low | High | Comprehensive testing guidelines; journey provides integration test suite app can run | App Teams |
| Custom views have security vulnerabilities | Low | Critical | Security review checklist; automated scanning; require same standards as journey views | App Teams |
| Support cannot diagnose custom view issues | Medium | Medium | Clear logging boundaries; custom view logs tagged differently; runbook for support | Support + App Teams |
| Documentation becomes outdated | Medium | High | Automated generation of routing docs from code; validation in CI that docs match code | Journey Teams + Platform |
| App developers extend components unsafely | Medium | Medium | Explicitly document pattern as NOT RECOMMENDED; guide toward full custom components | Documentation Team |

## Success metrics

### Technical success criteria
- **Public API Compliance:** 100% of journeys supporting view replacement export all required components, services, guards, resolvers
- **Documentation Coverage:** 100% of journeys document complete routing structure with all routes, components, guards, resolvers
- **Type Safety:** All view replacement implementations pass TypeScript strict mode compilation with zero type errors
- **Routing Parity:** Custom routing configurations can replicate all journey functionality (guards, resolvers, lazy loading)
- **Upgrade Success:** 80%+ of apps with custom views successfully upgrade journeys within one sprint of release

### Business success criteria
- **Customization Enablement:** Zero deals lost due to inability to customize beyond View Extension capabilities
- **Decision Clarity:** 100% of customization requests evaluated against View Extension first, with documented decision rationale
- **Implementation Time:** Custom view implementation time < 2 weeks for typical view replacement
- **Support Efficiency:** < 20% increase in support tickets related to customizations (view extension + view replacement combined)
- **Customer Satisfaction:** Positive feedback from app developer teams on view replacement pattern clarity and documentation

## References

### Authoritative sources
- **Angular Documentation** - [Routing & Navigation](https://angular.io/guide/router) - Core routing concepts and configuration
- **Angular Documentation** - [NgModule FAQs](https://angular.io/guide/ngmodule-faq) - Module exports and public API patterns
- **Angular Documentation** - [Dependency Injection](https://angular.io/guide/dependency-injection) - Service injection in custom views
- **TypeScript Documentation** - [Modules](https://www.typescriptlang.org/docs/handbook/modules.html) - Public API export patterns
- **Semantic Versioning 2.0.0** - [semver.org](https://semver.org/) - Versioning conventions for journey public API

### Technical references
- **Angular Router** - [Route Configuration](https://angular.io/api/router/Route) - `Route` interface documentation
- **Angular Style Guide** - [Angular Style Guide](https://angular.io/guide/styleguide) - Component and service patterns
- **Nx Documentation** - [Library Types](https://nx.dev/concepts/more-concepts/library-types) - Patterns for library public APIs in monorepos

### Related decisions and concerns
- **View Extension vs. View Replacement Decision Tree** - Criteria for choosing between patterns
- **Journey Public API Guidelines** - What should be exported from journey libraries
- **RFF Process** - When View Extension slot should be requested vs. using view replacement

### Standards compliance
- **ISO/IEC/IEEE 42010:2022** - Systems and software engineering — Architecture description
- **Semantic Versioning 2.0.0** - Journey exports follow semver for breaking changes
- **TypeScript Strict Mode** - Type safety enforced per platform standards
- **Angular Public API Conventions** - Barrel exports, module exports, component selectors as public API

## Code review checklist

Use this checklist when reviewing implementations of view replacements:

### Journey-Side Implementation Review

**Public API Exports (index.ts):**
- [ ] All routable view components exported in `src/index.ts`
- [ ] All services used in view components exported
- [ ] All guards used in routing exported
- [ ] All resolvers used in routing exported
- [ ] Data models/interfaces used by views exported
- [ ] Journey configuration interface exported
- [ ] Exports follow barrel export pattern (clean public API)
- [ ] No internal implementation details leaked in exports

**Module Configuration (journey.module.ts):**
- [ ] All view components declared in module
- [ ] All UI components used in view templates declared in module
- [ ] **All components added to module `exports` array** (enables reuse in custom views)
- [ ] Module `forRoot()` accepts `route?: Route` parameter
- [ ] Module provides custom route if supplied: `provideRoutes([config.route || defaultRoute])`
- [ ] Module works correctly when route not provided (uses default)
- [ ] Lazy loading pattern maintained (ModuleWithProviders returned)

**Component Exports:**
- [ ] Component selectors considered stable public API (not changed without major version bump)
- [ ] Component `@Input()` properties considered public API (documented and stable)
- [ ] Component `@Output()` events considered public API (documented and stable)
- [ ] Internal/private components not exported unless necessary for custom views
- [ ] Component dependencies (other components used in template) also exported

**Service Exports:**
- [ ] Public methods documented with JSDoc comments
- [ ] Public properties have clear purpose
- [ ] Private methods marked as `private` or prefixed with underscore
- [ ] Service considered stable within major version (semver)
- [ ] Service dependencies injectable by custom views (no hidden requirements)

**Routing Documentation:**
- [ ] Complete routing structure documented in README or docs folder
- [ ] Each route documented with: path, component, guards, resolvers, data
- [ ] Route parameters documented (e.g., `:id` in `detail/:id`)
- [ ] Route data objects documented (purpose of each property)
- [ ] Lazy-loaded child routes documented
- [ ] Example of copying and customizing routing provided
- [ ] Routing changes noted in CHANGELOG.md (even if not breaking)

**Guards and Resolvers:**
- [ ] All guards exported in public API
- [ ] Guard logic documented (what permission/condition they check)
- [ ] All resolvers exported in public API
- [ ] Resolver return types documented
- [ ] Resolver data keys documented (used in `resolve: { key: ResolverService }`)

**Change Management:**
- [ ] Routing structure changes documented in CHANGELOG.md
- [ ] Breaking changes to exports noted with migration guide
- [ ] New routes/guards/resolvers added to documentation
- [ ] Deprecated exports marked with `@deprecated` JSDoc tag

**Testing:**
- [ ] Journey functions correctly with default routing
- [ ] Journey functions correctly with custom routing (minimal example tested)
- [ ] Exports validated (can be imported from package)
- [ ] Module exports validated (components usable in external templates)

### App-Side Implementation Review

**Bundle Module Structure:**
- [ ] Journey wrapped in app-level bundle module (if customization needed)
- [ ] Bundle module imports journey module with `forRoot()`
- [ ] App routing lazy loads bundle module
- [ ] Bundle module provides journey configuration if needed

**Custom Routing Configuration:**
- [ ] Custom routing file created (e.g., `<journey>-custom-routes.ts`)
- [ ] Routing imports components from `@backbase/<journey>` (not relative paths)
- [ ] Routing imports guards from `@backbase/<journey>`
- [ ] Routing imports resolvers from `@backbase/<journey>`
- [ ] Routing structure matches journey's documented structure (initially)
- [ ] Route paths match original (unless intentionally changed)
- [ ] Guards maintained unless intentionally removed (with justification)
- [ ] Resolvers maintained unless intentionally removed (with justification)
- [ ] Custom routing provided to journey `forRoot({ route: customRoute })`

**Custom View Component:**
- [ ] Component created in app directory (not journey library)
- [ ] Component selector follows app naming convention (e.g., `app-*`)
- [ ] Component injects necessary journey services (from journey public API)
- [ ] Component does not access journey internals beyond public API
- [ ] Component handles all required functionality of replaced view
- [ ] Component declares injected services as `public readonly` if used in template
- [ ] Lifecycle methods implemented correctly (OnInit, OnDestroy if needed)
- [ ] Observables unsubscribed in `ngOnDestroy` if manually subscribed

**Template:**
- [ ] Template uses journey components via selectors (if reusing components)
- [ ] Journey components used have correct `@Input()` bindings
- [ ] No direct manipulation of journey internals
- [ ] Accessibility requirements met (semantic HTML, ARIA attributes)
- [ ] Design system components used where appropriate
- [ ] Responsive design considered (mobile, tablet, desktop)
- [ ] XSS prevention: no unsafe `innerHTML` with user data
- [ ] Safe navigation operator used: `data?.property`

**Styling:**
- [ ] Styles scoped to component (not global)
- [ ] Styles follow app/design system conventions
- [ ] No styles that break journey layout or other views
- [ ] Responsive breakpoints consistent with design system
- [ ] Does not override journey component styles aggressively

**Module Declaration:**
- [ ] Custom view component declared in bundle module `declarations`
- [ ] Custom view component NOT exported (internal to bundle)
- [ ] Required dependencies imported (CommonModule, ReactiveFormsModule, etc.)
- [ ] Journey module imported with custom routing configuration

**Routing Integration:**
- [ ] Custom component replaces correct view in routing configuration
- [ ] Route path unchanged unless intentionally modified
- [ ] Route guards maintained unless intentionally removed
- [ ] Route resolvers maintained unless intentionally removed
- [ ] Custom routing exported as `const` for type safety

**Security:**
- [ ] Journey guards not bypassed without valid reason and security review
- [ ] User data properly sanitized before display
- [ ] External URLs validated before use in `href` or `src`
- [ ] No sensitive data logged to console
- [ ] Same authorization checks as original view (if custom logic added)

**Testing:**
- [ ] Custom view component has unit tests
- [ ] Unit tests cover all component methods
- [ ] Unit tests mock journey services appropriately
- [ ] Integration test verifies custom view renders in journey routing
- [ ] E2E tests cover critical user flows through custom view
- [ ] Tests validate data flows correctly from journey services
- [ ] Error scenarios tested (service failures, missing data, etc.)

**Documentation:**
- [ ] Decision to use view replacement documented (why view extension insufficient)
- [ ] Custom view purpose documented in component JSDoc
- [ ] Any deviations from original view behavior documented
- [ ] Maintenance notes added (what to check during journey upgrades)
- [ ] README or docs updated with custom routing information

**Upgrade Strategy:**
- [ ] Process documented for checking journey routing changes during upgrades
- [ ] Responsibility assigned for maintaining custom routing
- [ ] Testing plan defined for journey upgrades
- [ ] Rollback plan defined if upgrade breaks custom view

### General Review Points

**Decision Validation:**
- [ ] View Extension evaluated first and determined insufficient
- [ ] Rationale documented for why view replacement necessary
- [ ] Product Owner or tech lead approval obtained

**Type Safety:**
- [ ] TypeScript strict mode compilation passes with zero errors
- [ ] No use of `any` types (or justified and documented)
- [ ] All journey imports correctly typed
- [ ] IDE provides autocomplete for journey exports (validates public API)

**Performance:**
- [ ] Lazy loading maintained (bundle size not significantly increased)
- [ ] No unnecessary change detection triggers
- [ ] Observables not over-subscribed
- [ ] Component uses `OnPush` change detection if applicable

**Maintainability:**
- [ ] Code follows clean code guidelines (meaningful names, single responsibility)
- [ ] No magic numbers or strings (use constants)
- [ ] Complex logic extracted into methods with clear names
- [ ] Comments explain "why" not "what"
- [ ] Code is DRY (duplicated logic extracted)

**Backward Compatibility (Journey Changes):**
- [ ] Journey routing changes noted in CHANGELOG reviewed
- [ ] Custom routing updated to match new journey routing structure
- [ ] New guards/resolvers added to custom routing if required
- [ ] Deprecated components replaced if journey deprecated them
- [ ] Migration guide followed if journey provided one

**Compliance:**
- [ ] Follows platform web standards
- [ ] Meets accessibility requirements (WCAG 2.1 AA minimum)
- [ ] Meets security requirements (no vulnerabilities introduced)
- [ ] Design system components used appropriately
- [ ] Responsive design requirements met
