# ADR-006: Design System and Component Library Standards

---

## Decision summary

Backbase will maintain a unified design system component library (`@backbase/ui-ang`) for shared components across all capabilities, with each capability team publishing their own capability-specific component library. Component ownership will be clearly defined and governed by the Frontend Guild. All components must follow strict quality gates including 80%+ test coverage, accessibility compliance, visual regression testing, and mandatory code review by component owners before merging. Third-party library dependencies must be approved by the Frontend Guild and exposed as peer dependencies to customers.

## Context and problem statement

### Business context
- **Product Consistency:** Banking applications across multiple capabilities (Retail, Business, Wealth) need consistent UI/UX to maintain brand identity and user trust
- **Development Efficiency:** Component reuse reduces development time, maintenance burden, and ensures quality across products
- **Scalability:** Multiple teams developing widgets and journeys need clear boundaries and ownership to prevent conflicts and bottlenecks
- **Customer Customization:** Customers must be able to build custom widgets using public component APIs without being locked into Backbase state management
- **Quality Assurance:** Component quality directly impacts all consuming applications; poor quality components cascade issues across the platform
- **Success Criteria:**
  - Single source of truth for design system components
  - Clear ownership model preventing orphaned components
  - 80%+ test coverage across all components
  - Zero breaking changes without major version bump
  - Capability teams unblocked by ability to create capability-specific components

### Technical context
- **Existing Landscape:** Multiple Angular-based applications (retail-universal, business-universal) consuming shared UI components from `@backbase/ui-ang`
- **Affected Systems:**
  - `@backbase/ui-ang` - Design System Component Library
  - Capability-specific UI libraries (per capability)
  - All journey bundles and widgets
  - Theme and styling system
  - Component documentation and Storybook
  - CI/CD pipelines and release processes
- **Technical Challenges:**
  - Component ownership unclear leading to stale/broken components
  - No enforced quality gates causing regressions
  - Capability teams blocked waiting for design system updates
  - Unclear boundaries between design system and capability components
  - Version conflicts and breaking changes causing production issues
  - Inconsistent testing and documentation standards

### Constraints and assumptions

**Technical Constraints:**
- Must maintain Angular version compatibility across all consuming applications
- Cannot introduce breaking changes without major version increments
- All third-party dependencies must be peer dependencies (not bundled/hidden)
- Must support theming and customization by customers
- Component APIs must be stable and well-documented
- Test coverage minimum of 80% enforced at build time
- Must work across all supported browsers and accessibility requirements

**Business Constraints:**
- Component ownership must not create single points of failure
- Capability teams cannot be blocked indefinitely waiting for design system components
- Release schedule must align with widget collection releases
- Cannot require complete application rewrites for version upgrades
- Design system team capacity is limited and must be protected
- Must balance consistency with capability team autonomy

**Environmental Constraints:**
- Must integrate with existing Nx monorepo workspace
- Must work within current CI/CD pipeline infrastructure
- Design system itself must be approved by designers before implementation
- Must support both on-premise and cloud deployment models
- Documentation must be co-located with code and version-controlled

**Assumptions Made:**
- Frontend Guild has authority to approve/reject third-party library additions
- Component owners will maintain their components and respond to PRs
- Designers will provide design system specifications before Angular implementation
- Backend teams will not be affected by component library structure decisions
- Automated testing will reach sufficient quality to skip manual regression testing
- Teams will adopt latest stable ui-ang versions without extensive delays

### Affected architecture description elements

**Components:**
- `@backbase/ui-ang` NPM package (Design System Component Library)
- Capability UI libraries (one per capability: Retail, Business, Wealth, etc.)
- Theme system and component styling
- Component documentation (Storybook, API docs)
- Widget implementations (smart components)
- Journey bundles consuming components
- CI/CD pipeline for component library releases
- Version management and changelog systems

**Views:**
- **Development View:** Module structure, component boundaries, ownership mapping, testing requirements
- **Logical View:** Component composition patterns, smart/dumb component separation, design system hierarchy
- **Process View:** PR approval workflow, release process, MAINT ticket routing, quality gates
- **Physical View:** NPM package distribution, versioning strategy, peer dependency management

**Stakeholders:**
- **Frontend Guild:** Governs third-party library approvals and overall standards
- **Design System Team:** Maintains `@backbase/ui-ang` and theme
- **Capability Teams:** Own capability-specific components and consume design system
- **Widget Developers:** Compose components into smart widgets
- **Customers:** Customize and extend components for their implementations
- **Designers:** Define design system specifications and approve visual changes
- **QA Teams:** Validate component quality and regressions
- **Platform Team:** Maintains release pipeline and versioning

## Decision

### What we decided

**1. Component Library Structure:**
- **Single Design System Library:** `@backbase/ui-ang` contains all shared components across capabilities (e.g., ButtonModule, EmptyStateModule)
- **Capability-Specific Libraries:** Each capability maintains their own UI library for capability-specific components (e.g., Retail UI library, Business UI library)
- **Composition Pattern:** Capability components are compositions of design system components
- **Presentational Components:** Capability components must be dumb/presentational (no direct DBS service connections)
- **Cross-Capability Prohibition:** Capabilities cannot depend on other capability UI libraries

**2. Ownership Model:**
Component ownership assigned to Backbase teams with frontend engineers responsible for:
- Quality maintenance and consistency
- Design system alignment
- Accessibility and non-functional requirements
- Use case coverage and documentation
- Theme styling for owned components

Ownership determined by:
- Capability with highest component utilization
- Team with most contribution history and knowledge
- Developer Enablement VS for universal components (buttons, loading indicators)
- Volunteer teams claiming ownership

**3. Third-Party Library Policy:**
- All third-party dependencies must be approved by Frontend Guild
- Dependencies must be peer dependencies (explicitly exposed to customers)
- No vendor library abstraction/hiding allowed
- Customers can use third-party libraries directly

**4. Quality Gates (Mandatory for all PRs):**
- ✅ Successful pipeline build
- ✅ Accessibility tests covering changes
- ✅ Unit tests updated and covering changes
- ✅ Unit test coverage ≥ 80% (no decrease from baseline)
- ✅ SonarQube validation passed
- ✅ 2+ approvals from FE engineers (including at least one component owner)
- ✅ API documentation updated
- ✅ Changelog updated with JIRA ticket reference
- ✅ QA approval after testing
- ✅ Visual regression tests updated and passed
- ✅ Designer approval (if visual changes)

**5. Release Process:**
- Platform team manages release, versioning, and distribution of `@backbase/ui-ang`
- Incremental releases created automatically on each PR merge (semantic versioning)
- Teams develop against latest stable version
- Release schedule controlled by delivery manager of Platform VS
- Documentation published with each promoted release

**6. MAINT Ticket Handling:**
- No MAINT tickets initiated within R&D (affected team fixes immediately)
- External MAINT tickets land in backlog of owning team
- Component owners analyze and delegate fix responsibility
- All fixes must follow contribution rules

### Rationale

**Unified Design System:**
- Ensures UI consistency across all Backbase products
- Prevents duplication of common components (buttons, inputs, modals)
- Single version of truth for designers and developers
- Reduces maintenance burden by avoiding component proliferation

**Capability-Specific Libraries:**
- Prevents blocking capability teams waiting for design system approvals
- Allows teams to move quickly with domain-specific components
- Clear escalation path: capability component → design system component (if proven valuable)
- Maintains capability team autonomy while ensuring consistency

**Strict Ownership Model:**
- Eliminates orphaned/unmaintained components
- Ensures knowledgeable reviews preventing quality degradation
- Creates accountability for component quality and documentation
- Prevents merge conflicts and unclear decision-making

**Peer Dependencies for Third-Party:**
- Transparency to customers about external dependencies
- Customers can upgrade libraries independently if needed
- Prevents hidden version conflicts
- Allows customers to use same libraries directly in their code

**Extensive Quality Gates:**
- 80%+ coverage catches regressions before production
- Accessibility tests ensure WCAG compliance
- Visual regression tests catch unintended styling changes
- Owner approval prevents architectural inconsistencies
- Automated testing reduces need for manual regression testing

## Code review checklist

### Angular-Specific Standards

#### Component Architecture
- [ ] **Smart/Dumb Separation:** Presentational components don't inject services (except utility services like Router, i18n)
- [ ] **Component Inputs:** All `@Input()` properties have type annotations and JSDoc descriptions
- [ ] **Component Outputs:** All `@Output()` events use `EventEmitter<T>` with specific types (not `any`)
- [ ] **Change Detection:** `OnPush` strategy used where possible for performance
- [ ] **Lifecycle Hooks:** Only implemented interfaces for used hooks (e.g., `implements OnInit`)
- [ ] **Template Syntax:** No complex logic in templates; use component methods or pipes
- [ ] **Standalone Components:** Consider standalone components (Angular 14+) for better tree-shaking

#### Component Design
- [ ] **Single Responsibility:** Component has one clear purpose
- [ ] **Reusability:** Component is configurable via inputs rather than hard-coded
- [ ] **Encapsulation:** Component styles use `:host` and don't leak globally
- [ ] **View Encapsulation:** Appropriate encapsulation strategy (default: Emulated)
- [ ] **Host Binding:** Use `@HostBinding` and `@HostListener` appropriately for host element interaction

#### Template Best Practices
- [ ] **Async Pipe:** Use `async` pipe for observables to prevent memory leaks
- [ ] **TrackBy Function:** `*ngFor` includes `trackBy` function for performance
- [ ] **Null Safety:** Templates handle null/undefined cases with safe navigation (`?.`) or `*ngIf`
- [ ] **Minimal Logic:** Complex logic extracted to component methods or pipes
- [ ] **No DOM Manipulation:** No direct DOM manipulation; use Angular directives/renderers

#### RxJS & State Management
- [ ] **Observable Cleanup:** Subscriptions unsubscribed in `ngOnDestroy` (or use `async` pipe)
- [ ] **Subject Usage:** `Subject`/`BehaviorSubject` properly typed and private when internal
- [ ] **Error Handling:** Observable streams include error handling (`catchError`)
- [ ] **Subscription Management:** Consider `takeUntil` pattern for automatic unsubscription
- [ ] **No Nested Subscriptions:** Avoid nested subscriptions; use RxJS operators (`switchMap`, `mergeMap`, etc.)

#### Forms
- [ ] **Form Validation:** Reactive forms with typed form controls (Angular 14+)
- [ ] **Form State:** Form state accessible for UI feedback (touched, dirty, valid)
- [ ] **Custom Validators:** Custom validators are pure functions and testable
- [ ] **ControlValueAccessor:** Custom form controls implement `ControlValueAccessor`
- [ ] **Form Arrays:** Dynamic forms use `FormArray` with proper type safety

#### Dependency Injection
- [ ] **Constructor Injection:** Dependencies injected via constructor
- [ ] **Provider Scope:** Services provided at appropriate level (`root`, module, component)
- [ ] **Tree-shakeable Services:** Services use `providedIn: 'root'` when appropriate
- [ ] **Interface Injection:** Prefer interfaces with `InjectionToken` for flexibility

#### Performance
- [ ] **Lazy Loading:** Large modules lazy loaded at route level
- [ ] **Pure Pipes:** Pipes are pure unless absolutely necessary
- [ ] **OnPush Strategy:** Components use `OnPush` when state is immutable
- [ ] **Large Lists:** Virtual scrolling (`cdk-virtual-scroll`) used for large lists
- [ ] **No Heavy Computations:** Heavy computations in `ngDoCheck` or getters avoided

#### Testing
- [ ] **Unit Tests:** All public methods tested with positive and negative cases
- [ ] **Component Testing:** Component inputs/outputs tested with all variations
- [ ] **Mock Services:** Services mocked appropriately in component tests
- [ ] **Async Testing:** Async operations tested with `fakeAsync`/`async`/`flush`
- [ ] **Test Isolation:** Tests don't depend on execution order
- [ ] **Accessibility Tests:** Automated axe-core tests for component variations
- [ ] **Visual Tests:** Visual regression tests updated for UI changes

#### Accessibility (WCAG 2.1 AA)
- [ ] **Semantic HTML:** Use semantic elements (`<button>`, `<nav>`, `<main>`)
- [ ] **ARIA Attributes:** Proper ARIA labels, roles, and states where semantic HTML insufficient
- [ ] **Keyboard Navigation:** All interactive elements keyboard accessible (tab order, Enter/Space)
- [ ] **Focus Management:** Visible focus indicators; focus managed for modals/dynamic content
- [ ] **Color Contrast:** Text meets WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
- [ ] **Screen Reader:** Component announces state changes to screen readers
- [ ] **Form Labels:** All form inputs have associated labels (explicit or `aria-label`)
- [ ] **Automated A11y Tests:** axe-core tests pass for all component states

#### Documentation
- [ ] **JSDoc Comments:** Public API documented with JSDoc (inputs, outputs, methods)
- [ ] **Usage Examples:** Complex components include usage examples in comments
- [ ] **Component README:** Capability components include README with use cases
- [ ] **Migration Guide:** Breaking changes include migration guide
- [ ] **Storybook Stories:** Component has Storybook story showing all variations

#### Dependencies & Imports
- [ ] **Peer Dependencies:** Third-party libraries added as peer dependencies
- [ ] **Guild Approval:** New third-party libraries approved by Frontend Guild
- [ ] **Tree-shakeable Imports:** Import specific items, not entire libraries (`import { map } from 'rxjs/operators'`)
- [ ] **Circular Dependencies:** No circular dependencies between modules
- [ ] **Barrel Imports:** Use barrel imports (`index.ts`) for public APIs only

#### Type Safety
- [ ] **No `any` Type:** Avoid `any`; use proper types or `unknown`
- [ ] **Strict Mode:** Code compatible with TypeScript strict mode
- [ ] **Type Inference:** Let TypeScript infer types when obvious
- [ ] **Generic Types:** Use generics for reusable type-safe components
- [ ] **Null Checks:** Handle `null`/`undefined` explicitly with strict null checks

#### Styling & Theming
- [ ] **Component Styles:** Styles scoped to component (no global style pollution)
- [ ] **Theme Variables:** Use CSS custom properties from theme, not hard-coded colors
- [ ] **Responsive:** Component responsive using theme breakpoints
- [ ] **No Magic Numbers:** Use theme spacing/sizing variables
- [ ] **BEM or Similar:** Consistent class naming convention

#### Design System Alignment
- [ ] **Design System Components:** Use design system components instead of creating custom ones
- [ ] **Design Approval:** Visual changes approved by designer
- [ ] **Capability Boundary:** Capability-specific logic not in design system components
- [ ] **Composition:** Capability components compose design system components
- [ ] **No Cross-Capability:** Capability libraries don't depend on each other

### Quality Assurance
- [ ] **QA Testing:** QA has tested the change in appropriate environment
- [ ] **Manual Testing:** Component manually tested in multiple browsers
- [ ] **Regression Testing:** Existing functionality not broken
- [ ] **Visual Regression:** Visual regression tests pass or updated appropriately
- [ ] **Edge Cases:** Edge cases tested (empty states, errors, loading)

### Release Readiness
- [ ] **Semantic Versioning:** Change categorized correctly (major/minor/patch)
- [ ] **Breaking Changes:** Breaking changes documented and justified
- [ ] **Migration Path:** Breaking changes include migration path for consumers
- [ ] **Backward Compatibility:** Deprecation warnings added for breaking changes in next major

## References

### Authoritative sources
- [Frontend Guild Decision](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/1838973010) - Component library structure
- [Contribution Rules](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/2020934329) - PR requirements
- [Ownership Model](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/2019264332) - Component ownership
- [Release Process](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/2020967202) - ui-ang releases
- [MAINT Process](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/2041774628) - Issue handling

### Technical references
- [Angular Style Guide](https://angular.io/guide/styleguide) - Official Angular coding standards
- [Angular Component API](https://angular.io/api/core/Component) - Component API reference
- [RxJS Best Practices](https://rxjs.dev/guide/overview) - Observable patterns
- [Semantic Versioning](https://semver.org/) - Version numbering standard
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message standard
- [NPM Peer Dependencies](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies) - Peer dependency specification

### Standards compliance
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa) - Accessibility standard
- [Angular Best Practices](https://angular.io/guide/styleguide) - Framework conventions
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict) - Type safety
- [Jest Testing Framework](https://jestjs.io/docs/getting-started) - Unit testing
