# ADR-009: View Extension Standards for Journey Customization

---

## Decision summary

View extensions provide a controlled, type-safe mechanism for adding custom components to predefined extension slots within journey views. Extension slots are empty by default and serve exclusively for adding content—never for modifying or removing existing journey components. This approach enables implementers to extend journey functionality while maintaining journey integrity, type safety, and upgradability.

## Context and problem statement

### Business context
- **Customization Demand:** Customers implementing journeys require the ability to add custom fields, controls, or UI elements (e.g., custom "print" button, additional fields from API `additions` property) without forking journey source code
- **Product Flexibility vs. Maintainability:** Need to balance customer-specific requirements with maintaining a core product that can be upgraded and supported
- **Request-Driven Development:** Multiple customers requesting similar extensions indicate common needs that should be supported generically
- **Implementation Cost:** Complete view replacement is heavyweight for minor additions; need lightweight extension mechanism
- **Success Criteria:**
  - Customers can add custom content to journeys without modifying journey source
  - Type-safe extension API prevents runtime errors
  - Journey upgrades don't break customer extensions
  - Clear decision process for which extensions to support
  - Zero impact on customers not using extensions

### Technical context
- **Existing Landscape:** Angular-based journey bundles (transactions, payments, etc.) in Nx monorepo consuming `@backbase/ui-ang` design system
- **Current Solution:** Full view replacement—customers override entire view components to add small customizations, creating maintenance burden
- **Affected Systems:**
  - Journey bundle libraries (transactions, payments, accounts, etc.)
  - `@backbase/ui-ang` - provides `ViewExtensionComponent` and `ViewExtensionDirective`
  - Application bundles (retail-universal, business-universal)
  - Journey module configuration and dependency injection system
  - TypeScript type system for compile-time safety
- **Technical Challenges:**
  - Ensuring type safety between journey and consumer
  - Preventing breaking changes when journey internal data structures evolve
  - Limiting surface area of exposed data to minimize coupling
  - Maintaining clear ownership of extension slot content
  - Documenting available extension points without exposing internal implementation

### Constraints and assumptions

**Technical Constraints:**
- Must maintain full TypeScript type safety at compile time
- Cannot expose journey internal implementation details
- Must work with Angular's dependency injection system
- Extension components must follow Angular lifecycle (OnInit, OnChanges, OnDestroy)
- Must not impact journey performance when extensions aren't used
- Journey must remain functional without any extensions provided
- Extension context must be versioned with journey public API

**Business Constraints:**
- Product Owner approval required for each new extension slot (prevents unbounded complexity)
- Extension requests must come through RFF (Request for Feature) process
- Decision to support or reject extension must be timely (don't block customers indefinitely)
- Very specific requests may be rejected in favor of view replacement approach
- Extension slots cannot contain default content (simplifies documentation and ownership)

**Environmental Constraints:**
- Must work within existing Nx monorepo architecture
- Must integrate with journey module `forRoot()` configuration pattern
- Must be documented for external implementers without revealing internal code
- Must support multiple extensions per journey
- Extensions must be lazily instantiated (only when provided)

**Assumptions Made:**
- Product Owners will use RFF tickets and previous experience to decide which extensions to support
- Developers implementing journeys understand Angular dependency injection and component lifecycle
- Extension consumers will use TypeScript (not JavaScript) for type safety benefits
- Journey teams will maintain backward compatibility of extension context types
- `@backbase/ui-ang` will continue providing `ViewExtensionComponent` and `ViewExtensionDirective` base classes
- Extensions will primarily be used for rendering additional data, not for complex interactions

### Affected architecture description elements

**Components:**
- Journey bundle modules (e.g., `TransactionsJourneyModule`, `PaymentsJourneyModule`)
- Journey public API exports (extension component and context types)
- Journey internal extension configuration system (`InjectionToken` based)
- Journey view components (parent components rendering extensions)
- Journey extension directives (type-safe rendering directives)
- Application bundle modules (consumer configuration)
- Application extension components (consumer implementations)
- `@backbase/ui-ang` view extension infrastructure

**Views:**
- **Development View:** Journey library structure, extension type definitions, directive patterns, barrel exports
- **Logical View:** Extension component composition, context data flow, dependency injection hierarchy
- **Process View:** RFF approval workflow, extension request evaluation, implementation guidelines
- **Physical View:** NPM package distribution, type definition exports, runtime component instantiation

**Stakeholders:**
- **Product Owners:** Decide which extension requests to support based on demand and alignment
- **Journey Developers:** Implement extension slots in journey views with proper typing
- **Application Developers:** Create extension components and configure journeys
- **Customers:** Request extensions via RFF process for specific use cases
- **Design Authority:** Ensure pattern consistency across journeys and platform

## Decision

### What we decided

**We will implement a standardized view extension mechanism** with the following characteristics:

1. **Extension Slots Are Empty by Default:**
   - No default content in extension slots
   - Slots serve exclusively for adding content, never removing/modifying existing content
   - Journeys function fully without any extensions provided

2. **Type-Safe Extension API:**
   - Each extension defines a `Context` type (subset of journey data)
   - Each extension defines a `Component` type extending `ViewExtensionComponent<Context>`
   - Journey exports these types in its public API
   - Applications implement the component type with compile-time type checking

3. **Controlled Extension Point Creation:**
   - Product Owner approval required for each new extension slot
   - Requests come through RFF (Request for Feature) process
   - Common requests → generic solution provided
   - Very specific requests → rejected, customer uses view replacement

4. **Journey-Side Implementation Pattern:**
   ```typescript
   // 1. Define extension types
   export type ExtensionContext = Pick<DataModel, 'field1' | 'field2'>;
   export type ExtensionComponent = ViewExtensionComponent<ExtensionContext>;
   
   // 2. Add to journey configuration
   interface JourneyExtensionsConfig {
     extensionSlotName?: Type<ExtensionComponent>;
   }
   const EXTENSIONS_CONFIG = new InjectionToken<JourneyExtensionsConfig>('...');
   
   // 3. Accept in forRoot()
   static forRoot({ extensionSlots }: Config): ModuleWithProviders {
     providers: [
       { provide: EXTENSIONS_CONFIG, useValue: extensionSlots || {} }
     ]
   }
   
   // 4. Render in template using directive
   <ng-container *ngIf="extensionComponent"
                 bbExtensionDirective
                 [componentType]="extensionComponent"
                 [context]="(context$ | async) || undefined">
   </ng-container>
   ```

5. **App-Side Implementation Pattern:**
   ```typescript
   // 1. Create component implementing journey's type
   @Component({...})
   export class MyExtensionComponent implements ExtensionComponent {
     @Input() context: ExtensionContext | undefined;
     // Lifecycle methods: OnInit, OnChanges, OnDestroy available
   }
   
   // 2. Configure in forRoot()
   JourneyModule.forRoot({
     extensionSlots: {
       extensionSlotName: MyExtensionComponent
     }
   })
   ```

6. **Documentation Requirements:**
   - Journey README documents available extension slots
   - Each extension documents its Context type properties
   - Examples provided for implementing extensions
   - No internal implementation details exposed

### Rationale

**Why this decision addresses the problem:**

1. **Type Safety:** Compile-time checking prevents runtime errors from mismatched data structures; breaking changes in context types are caught at build time
2. **Limited Coupling:** Context types expose only necessary data subset (often just `additions` field); journey can refactor internals without breaking extensions
3. **Controlled Complexity:** PO approval process ensures only valuable, reusable extensions are added; prevents journey templates from becoming Swiss cheese
4. **Clear Ownership:** Journey owns slot placement and context; consumer owns slot content; no ambiguity about responsibilities
5. **Lightweight:** Significantly less code than view replacement; no need to copy/maintain entire view template
6. **Backward Compatible:** Extensions optional; existing journeys and apps unaffected
7. **Self-Documenting:** TypeScript types serve as documentation; IDEs provide autocomplete and type checking
8. **Feedback Loop:** RFF process creates data on what customers need; informs future journey design decisions

**Key evaluation criteria:**
- ✅ **Developer Experience:** Type-safe API with IDE support
- ✅ **Maintainability:** Clear boundaries between journey and consumer
- ✅ **Upgrade Safety:** Extensions survive journey version updates
- ✅ **Performance:** Zero overhead when extensions not used
- ✅ **Scalability:** Pattern works for any number of extensions
- ✅ **Documentation:** Self-documenting through types

**Factors influencing choice:**
- Angular's dependency injection system provides natural configuration mechanism
- TypeScript generics enable type-safe yet flexible extension API
- Existing `@backbase/ui-ang` infrastructure provides foundation
- RFF process already exists for feature requests
- View replacement is too heavyweight for minor additions
- Similar patterns successfully used in other frameworks (React render props, Vue slots)

## Implementation details

### Technical approach

**1. Journey-Side Implementation**

**Step 1: Define Extension Types**

Location: `<journey>/src/lib/extensions/<extension-name>.ts`

```typescript
import { ViewExtensionComponent } from '@backbase/ui-ang/view-extensions';
import { DataModel } from '../models';

// Define context: subset of data available to extension
export type ExtensionNameContext = Pick<DataModel, 
  'additions' | 'relevantField1' | 'relevantField2'
>;

// Define component type
export type ExtensionNameComponent = ViewExtensionComponent<ExtensionNameContext>;
```

**Design principle:** Context should include only necessary data. Commonly includes `additions` property from API spec. Limiting exposed data reduces coupling and impact of future changes.

**Step 2: Create Extensions Configuration**

Location: `<journey>/src/lib/extensions/config.ts`

```typescript
import { InjectionToken, Type } from '@angular/core';

export interface JourneyExtensionsConfig {
  extensionSlotName1?: Type<ExtensionName1Component>;
  extensionSlotName2?: Type<ExtensionName2Component>;
  // ... other extensions
}

export const JOURNEY_EXTENSIONS_CONFIG = new InjectionToken<JourneyExtensionsConfig>(
  'JOURNEY_EXTENSIONS_CONFIG'
);
```

**Note:** `InjectionToken` is internal to journey; not exported in public API. This ensures type safety by forcing consumers to use typed `forRoot()` method.

**Step 3: Create Extensions Barrel Export**

Location: `<journey>/src/lib/extensions/index.ts`

```typescript
// Internal barrel file for journey's use
export * from './extension-name1';
export * from './extension-name2';
export * from './config';
```

**Step 4: Export Extension Types in Public API**

Location: `<journey>/src/index.ts`

```typescript
// Public API: export only component and context types
export {
  ExtensionName1Component,
  ExtensionName1Context,
  ExtensionName2Component,
  ExtensionName2Context,
} from './lib/extensions';

// Do NOT export InjectionToken or config interface
```

**Step 5: Accept Configuration in Module**

Location: `<journey>/src/lib/journey.module.ts`

```typescript
import { ModuleWithProviders, NgModule } from '@angular/core';
import { JourneyExtensionsConfig, JOURNEY_EXTENSIONS_CONFIG } from './extensions';

export interface JourneyModuleConfig {
  route?: Route;
  extensionSlots?: JourneyExtensionsConfig;
}

@NgModule({
  declarations: [/* components */],
  imports: [/* modules */],
})
export class JourneyModule {
  static forRoot(config: JourneyModuleConfig = {}): ModuleWithProviders<JourneyModule> {
    return {
      ngModule: JourneyModule,
      providers: [
        provideRoutes([config.route || defaultRoute]),
        {
          provide: JOURNEY_EXTENSIONS_CONFIG,
          useValue: config.extensionSlots || {}
        }
      ],
    };
  }
}
```

**Step 6: Create Extension Directive**

Location: `<journey>/src/lib/components/<parent>/<parent>.component.ts` (after component class)

```typescript
import { Directive } from '@angular/core';
import { ViewExtensionDirective } from '@backbase/ui-ang/view-extensions';
import { ExtensionNameContext } from '../../extensions';

@Directive({
  selector: '[bbJourneyExtensionName]'
})
export class JourneyExtensionNameDirective extends ViewExtensionDirective<ExtensionNameContext> {}
```

**Note:** One directive per extension. Directive provides type-safe rendering mechanism.

**Step 7: Declare Directive in Module**

```typescript
@NgModule({
  declarations: [
    // ... other declarations
    JourneyExtensionNameDirective,
  ],
  // ...
})
export class JourneyModule { /* ... */ }
```

**Step 8: Inject and Prepare in Parent Component**

```typescript
import { Component, Inject, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  ExtensionNameComponent, 
  ExtensionNameContext,
  JourneyExtensionsConfig,
  JOURNEY_EXTENSIONS_CONFIG 
} from '../../extensions';

@Component({
  selector: 'bb-parent-component',
  templateUrl: './parent.component.html',
})
export class ParentComponent {
  // Store extension component type (if provided)
  public extensionComponent?: Type<ExtensionNameComponent>;
  
  // Prepare context observable (or getter)
  public extensionContext$: Observable<ExtensionNameContext> = this.data$.pipe(
    map(data => ({
      additions: data.additions,
      relevantField1: data.relevantField1,
      relevantField2: data.relevantField2,
    }))
  );
  
  constructor(
    @Inject(JOURNEY_EXTENSIONS_CONFIG) extensionsConfig: JourneyExtensionsConfig,
    // ... other dependencies
  ) {
    this.extensionComponent = extensionsConfig.extensionSlotName;
  }
}
```

**Step 9: Render in Template**

Location: `<journey>/src/lib/components/<parent>/<parent>.component.html`

```html
<!-- Existing content -->

<!-- Extension slot -->
<ng-container
  *ngIf="extensionComponent"
  bbJourneyExtensionName
  [componentType]="extensionComponent"
  [context]="(extensionContext$ | async) || undefined">
</ng-container>

<!-- More existing content -->
```

**Key points:**
- `*ngIf` ensures slot only renders if extension provided
- Directive selector must match directive created in step 6
- `componentType` receives the component class
- `context` receives the typed context data (handles async with `|| undefined`)

---

**2. App-Side Implementation**

**Step 1: Create Extension Component**

Location: `apps/<app>/src/app/<journey>/<extension-name>.component.ts`

```typescript
import { Component, Input } from '@angular/core';
import { 
  ExtensionNameComponent, 
  ExtensionNameContext 
} from '@libs/<journey>';

@Component({
  selector: 'app-extension-name',
  templateUrl: './extension-name.component.html',
  styleUrls: ['./extension-name.component.scss'],
})
export class MyExtensionComponent implements ExtensionNameComponent {
  @Input() context: ExtensionNameContext | undefined;
  
  // Optional: implement lifecycle methods
  ngOnInit(): void {
    // Initialization logic
  }
  
  ngOnChanges(): void {
    // React to context changes
  }
  
  ngOnDestroy(): void {
    // Cleanup logic
  }
}
```

**Note:** Component implements journey's exported type, ensuring compile-time compatibility. Lifecycle methods (OnInit, OnChanges, OnDestroy) available without explicit interface implementation.

**Step 2: Create Template**

Location: `apps/<app>/src/app/<journey>/<extension-name>.component.html`

```html
<!-- Access context properties in type-safe way -->
<div class="extension-container">
  <span class="field">{{ context?.relevantField1 }}</span>
  
  <!-- Access additions -->
  <span class="custom-field" *ngIf="context?.additions?.['myCustomField']">
    {{ context?.additions?.['myCustomField'] }}
  </span>
</div>
```

**Step 3: Configure Journey Module**

Location: `apps/<app>/src/app/<journey>/<journey>-bundle.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { JourneyModule } from '@libs/<journey>';
import { MyExtensionComponent } from './<extension-name>.component';

@NgModule({
  declarations: [MyExtensionComponent],
  imports: [
    // ... other imports
    JourneyModule.forRoot({
      extensionSlots: {
        extensionSlotName: MyExtensionComponent,
      },
    }),
  ],
})
export class JourneyBundleModule {}
```

**Type safety:** TypeScript enforces that `MyExtensionComponent` implements `ExtensionNameComponent` interface, and that key `extensionSlotName` matches configuration interface.

---

**3. Key Integration Patterns**

**Pattern 1: Multiple Extensions in One Journey**
```typescript
// Journey exports multiple extension types
export {
  Extension1Component, Extension1Context,
  Extension2Component, Extension2Context,
  Extension3Component, Extension3Context,
} from './lib/extensions';

// App configures multiple extensions
JourneyModule.forRoot({
  extensionSlots: {
    extension1: MyExtension1Component,
    extension2: MyExtension2Component,
    // extension3 not provided - slot remains empty
  },
})
```

**Pattern 2: Conditional Rendering in Extension**
```typescript
// Extension component with conditional logic
export class MyExtensionComponent implements ExtensionNameComponent {
  @Input() context: ExtensionNameContext | undefined;
  
  get shouldRender(): boolean {
    return !!this.context?.additions?.['specificField'];
  }
}
```
```html
<div *ngIf="shouldRender">
  <!-- Render only when specific data present -->
</div>
```

**Pattern 3: Complex Data Transformations**
```typescript
export class MyExtensionComponent implements ExtensionNameComponent {
  @Input() context: ExtensionNameContext | undefined;
  
  get transformedData(): CustomType | null {
    if (!this.context?.additions) return null;
    // Transform additions data
    return {
      field1: this.context.additions['rawField1'],
      field2: this.processField(this.context.additions['rawField2']),
    };
  }
}
```

---

**4. Security and Compliance Measures**

- **Input Sanitization:** Extension components responsible for sanitizing any user-generated content from `additions` before rendering
- **Access Control:** Extensions receive only pre-filtered data from journey; journey enforces permissions before populating context
- **XSS Prevention:** Use Angular's built-in sanitization; avoid `innerHTML` with untrusted `additions` data
- **Type Safety:** TypeScript prevents accidental access to non-exposed journey internals
- **Encapsulation:** Extension cannot access journey component private members or services not explicitly provided

## Success metrics

### Technical success criteria
- **Type Safety:** 100% of extension implementations pass TypeScript strict mode compilation with zero type errors
- **Performance:** < 5ms overhead per extension render measured via Angular DevTools profiler
- **Test Coverage:** Extension examples achieve 80%+ test coverage (journey teams maintain existing coverage SLAs)
- **API Stability:** Zero breaking changes to extension context types within major versions
- **Documentation:** 100% of public extension slots documented with context type explanation and usage example

### Business success criteria
- **Adoption:** 50% reduction in view replacement usage for minor customizations within 6 months
- **Customer Satisfaction:** Positive feedback on customization DX from 3+ application developer teams
- **RFF Process:** < 2 week turnaround for extension request approval/rejection decision
- **Support Reduction:** 30% decrease in support tickets related to broken view overrides after journey upgrades
- **Time to Market:** 50% reduction in development time for adding custom fields vs. view replacement approach

### Monitoring and measurement
- **Metrics to Track:**
  - Number of extension slots per journey (complexity metric)
  - Extension usage analytics (how many apps use which extensions)
  - Time from RFF submission to implementation (process efficiency)
  - Build failures due to extension type mismatches (type safety effectiveness)
  - Performance benchmarks for extension rendering
  - Support ticket trends related to customizations

- **Monitoring Tools:**
  - TypeScript compilation errors tracked in CI/CD
  - Bundle size impact measured per journey
  - Usage analytics via telemetry (if available)
  - RFF Jira board metrics
  - Developer surveys quarterly

- **Review Schedule:**
  - Monthly: Review new RFF requests and approve/reject
  - Quarterly: Analyze extension usage metrics and performance
  - Bi-annually: Comprehensive review of pattern effectiveness
  - Annually: Evaluate if extensions should be deprecated or enhanced based on usage data

## References

### Authoritative sources
- **Angular Documentation** - [Dependency Injection](https://angular.io/guide/dependency-injection) - Core pattern for extension configuration
- **Angular Documentation** - [Dynamic Component Loader](https://angular.io/guide/dynamic-component-loader) - Conceptual foundation for extension rendering
- **TypeScript Documentation** - [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) - Type-safe extension component pattern
- **Backbase UI-ANG** - `@backbase/ui-ang/view-extensions` - `ViewExtensionComponent`, `ViewExtensionDirective` base classes

### Technical references
- **Golden Sample App** - [Transactions Journey](https://github.com/Backbase/golden-sample-app) - Reference implementation of view extensions
- **Angular Style Guide** - [Angular Style Guide](https://angular.io/guide/styleguide) - Component and directive naming conventions
- **RxJS Documentation** - [Observable](https://rxjs.dev/guide/observable) - Context data streaming pattern

### Related decisions and concerns
- **RFF Process** - [RFF Jira Board](https://backbase.atlassian.net/jira/software/c/projects/RFF/boards/1631) - Approval workflow for extension requests
- **Frontend Guild** - Component library governance and standards approval

### Standards compliance
- **ISO/IEC/IEEE 42010:2022** - Systems and software engineering — Architecture description
- **Semantic Versioning 2.0.0** - Extension context types follow semver for breaking changes
- **TypeScript Strict Mode** - Type safety enforced per platform standards
- **Angular Component API Guidelines** - Lifecycle methods, input/output patterns

---

## Code review checklist

Use this checklist when reviewing implementations of view extensions:

### Journey-Side Implementation Review

**Type Definitions:**
- [ ] Context type uses `Pick<>` or explicit interface to limit exposed data
- [ ] Context includes only necessary fields (commonly `additions` + specific fields)
- [ ] Component type correctly extends `ViewExtensionComponent<Context>`
- [ ] Both context and component types exported in public API (`src/index.ts`)
- [ ] Type names follow naming convention: `<DescriptiveName>Context`, `<DescriptiveName>Component`

**Configuration:**
- [ ] `InjectionToken` created with descriptive name
- [ ] Extensions config interface has optional (`?`) properties for each extension
- [ ] Config interface uses `Type<ExtensionComponent>` (not component instance)
- [ ] `InjectionToken` is **NOT** exported in public API (internal only)
- [ ] Config interface is **NOT** exported in public API (internal only)
- [ ] Extensions barrel file (`extensions/index.ts`) exports config for internal use

**Module Configuration:**
- [ ] Journey module config interface includes `extensionSlots?: ExtensionsConfig`
- [ ] `forRoot()` provides `EXTENSIONS_CONFIG` token with `useValue: config.extensionSlots || {}`
- [ ] Module works correctly when `extensionSlots` not provided (default `{}`)

**Directive Implementation:**
- [ ] One directive per extension slot created
- [ ] Directive extends `ViewExtensionDirective<ContextType>` with correct context type
- [ ] Directive selector follows naming convention: `[bb<Journey><ExtensionName>]`
- [ ] Directive declared in journey module's `declarations` array
- [ ] Directive is standalone=false (declared, not imported)

**Parent Component:**
- [ ] Injects `EXTENSIONS_CONFIG` token with `@Inject()`
- [ ] Stores extension component in public property (e.g., `extensionComponent`)
- [ ] Creates context observable/getter with correct type: `Observable<Context>` or `() => Context`
- [ ] Context includes exactly the fields defined in context type
- [ ] Context observable properly handles async data (uses `async` pipe in template)
- [ ] Component imports are from `'../../extensions'` (internal barrel)

**Template Rendering:**
- [ ] `<ng-container>` used (not template element introducing extra DOM)
- [ ] `*ngIf="extensionComponent"` prevents rendering when extension not provided
- [ ] Directive attribute matches directive selector (e.g., `bbJourneyExtensionName`)
- [ ] `[componentType]="extensionComponent"` passes component class
- [ ] `[context]="(context$ | async) || undefined"` handles async and undefined case
- [ ] Extension slot placed in appropriate location in template
- [ ] No default content in extension slot (slot is empty by default)

**Documentation:**
- [ ] Extension documented in journey README with:
  - Extension slot name
  - Context type properties explained
  - Use case description
  - Example of implementing the extension
- [ ] JSDoc comments on context and component types
- [ ] Public API exports documented

**Testing:**
- [ ] Parent component unit test includes test case with mock extension component
- [ ] Parent component unit test includes test case without extension (slot empty)
- [ ] Context data correctly provided to extension in test
- [ ] Extension directive is imported in test's TestBed declarations

### App-Side Implementation Review

**Extension Component:**
- [ ] Component implements journey's exported component type: `implements ExtensionComponent`
- [ ] `@Input() context: ExtensionContext | undefined;` declared with correct types
- [ ] Context property handles `undefined` case (optional chaining in template)
- [ ] Component selector follows app naming convention
- [ ] Template file uses context properties in type-safe way: `context?.propertyName`
- [ ] Additions accessed safely: `context?.additions?.['key']`
- [ ] Lifecycle methods implemented if needed: `ngOnInit()`, `ngOnChanges()`, `ngOnDestroy()`
- [ ] No direct access to journey internals beyond provided context

**Template:**
- [ ] Uses optional chaining: `context?.field`
- [ ] Checks for existence before rendering: `*ngIf="context?.additions?.['field']"`
- [ ] No unsafe innerHTML with untrusted additions data
- [ ] Accessible HTML structure (semantic elements, ARIA attributes if needed)
- [ ] Design system components used (not raw HTML for controls)

**Module Configuration:**
- [ ] Extension component declared in app bundle module
- [ ] Journey module imported with `forRoot()` configuration
- [ ] `extensionSlots` object includes extension with correct key name
- [ ] Extension component class passed (not instance): `slotName: MyComponent`
- [ ] TypeScript compilation passes with strict mode (validates type compatibility)

**Security:**
- [ ] User-generated content from `additions` properly sanitized
- [ ] No use of `innerHTML` with untrusted data
- [ ] External URLs from additions validated before use in `href` or `src`
- [ ] Sensitive data not logged to console from context

**Styling:**
- [ ] Styles scoped to component (not global)
- [ ] Follows app/design system styling conventions
- [ ] Responsive design considered
- [ ] Does not break journey layout (e.g., excessive width/height)

**Testing:**
- [ ] Extension component has unit tests
- [ ] Tests cover context variations (with/without additions)
- [ ] Tests handle `undefined` context gracefully
- [ ] Integration test verifies extension renders in journey

### General Review Points

**Type Safety:**
- [ ] No use of `any` types
- [ ] TypeScript strict mode compilation passes
- [ ] IDE provides autocomplete for context properties
- [ ] Breaking changes to context type trigger compile errors

**Performance:**
- [ ] Extension component uses `OnPush` change detection if possible
- [ ] No heavy computation in template expressions
- [ ] Observables properly unsubscribed in `ngOnDestroy()` if manually subscribed
- [ ] Extension doesn't cause excessive change detection cycles

**Backward Compatibility:**
- [ ] Adding new context fields is non-breaking (optional fields)
- [ ] Removing/renaming context fields noted as breaking change
- [ ] Migration guide provided for breaking changes
- [ ] Deprecated extensions documented with removal timeline

**Code Quality:**
- [ ] Follows clean code guidelines (meaningful names, single responsibility)
- [ ] No magic numbers or strings (use constants)
- [ ] Comments explain "why", not "what"
- [ ] Code is DRY (no unnecessary duplication)

**Process Compliance:**
- [ ] Extension request approved via RFF process (for journey-side)
- [ ] PO approval documented (for journey-side)
- [ ] Extension documented in changelog
- [ ] Related ADR or documentation updated if pattern changes
