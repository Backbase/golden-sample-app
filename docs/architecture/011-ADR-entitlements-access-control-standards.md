# ADR-011: Entitlements and Access Control Standards

## Decision summary

All journeys must implement access control using the Backbase EntitlementsModule from `@backbase/foundation-ang/entitlements`. Access control implementation is a mandatory part of the Definition of Done for each capability. The implementation must secure route access, manage template visibility, and provide consistent error messages based on user permissions using the triplet pattern (Resource.Function.Permission).

## Context and problem statement

### Business context
- Banks require fine-grained access control to manage user permissions across different business functions
- Different user roles need different levels of access to features (view, edit, create, delete, approve, etc.)
- Unauthorized access to banking functions poses significant security and compliance risks
- Consistent user experience is required when users encounter permission restrictions
- Access control must be configurable and maintainable across multiple journeys and applications

### Technical context
- Angular applications built on Backbase platform using Widget Architecture 3.0
- Multiple journeys and widgets requiring consistent access control patterns
- Route-based navigation requiring protection at multiple levels (lazy loading, activation, child routes)
- Template-based UI requiring conditional rendering based on permissions
- Need to prevent users from starting actions they cannot complete due to insufficient permissions
- Integration with Backbase Access Control API for permission resolution

### Constraints and assumptions

**Technical Constraints**:
- Must use `@backbase/foundation-ang` version 6.21.0 or higher
- Angular Router must be used for navigation and route guards
- Access Control API endpoint must be available: `/access-control/client-api/v2/accessgroups/users/permissions/summary`
- Permissions are resolved asynchronously via HTTP requests
- Triplet pattern (Resource.Function.Permission) is the standard format for permission checks

**Business Constraints**:  
- Access control is mandatory for Definition of Done
- Must support regulatory compliance requirements for banking applications
- Permissions must be centrally managed through Backbase Access Control system
- Error messages and user experience must be consistent across all journeys

**Environmental Constraints**:
- Must work in both development (mocked) and production environments
- Must integrate with existing authentication/authorization infrastructure
- Must support lazy-loaded Angular modules
- Performance requirements for permission checks (minimal latency impact)

**Assumptions Made**:
- Users will have permissions assigned through Backbase Access Control before accessing the application
- Permission structure follows Resource.Function.Permission triplet pattern
- Access Control API is available and responsive
- Permissions are relatively static during a user session (caching is acceptable)
- Error pages (e.g., 403 Forbidden) exist in the application

## Decision

### What we decided

**All Angular applications must implement access control using the following mandatory patterns:**

1. **Module Setup**: Import `EntitlementsModule` from `@backbase/foundation-ang/entitlements` in the application root module
2. **Route Protection**: Use `EntitlementsGuard` for all routes requiring permission checks (supports `canActivate`, `canActivateChild`, and `canLoad`)
3. **Template Visibility**: Use `*bbIfEntitlements` directive for conditional rendering of UI elements based on permissions
4. **Triplet Pattern**: Define all permissions using the `Resource.Function.Permission` format (e.g., `Payments.Transfer.view`)
5. **Consistent Errors**: Provide standard error messages and redirect patterns for permission denials
6. **Development Mocking**: Implement HTTP interceptors for mocking permissions in development environments
7. **Configuration**: Make all permission triplets configurable and maintainable in centralized locations

### Rationale

**Why this decision was made:**

1. **Security by Default**: Making access control part of Definition of Done ensures no capability is deployed without proper security
2. **Consistency**: Using a standard module and patterns ensures consistent behavior across all journeys
3. **Angular Best Practices**: Leverages Angular Router Guards, which is the framework-recommended approach for route protection
4. **Declarative Approach**: Route configuration with guards and template directives makes permissions visible and maintainable
5. **Performance**: Permission resolution can be cached and reused across the application
6. **Testability**: Clear separation of concerns makes permission logic unit testable and mockable
7. **DRY Principle**: Centralized triplet definitions prevent duplication and maintenance issues
8. **User Experience**: Conditional routing and UI rendering prevents users from starting incomplete workflows

**Evaluation criteria used:**
- Security effectiveness (preventing unauthorized access)
- Developer experience (ease of implementation)
- Maintainability (clarity and centralization)
- Performance impact (minimal latency)
- Testability (can be mocked and unit tested)
- Alignment with Angular and Backbase platform standards

## Implementation details

### Technical approach

#### 1. Module Configuration

**Import EntitlementsModule in application root:**

```typescript
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { WebSdkModule, ENTITLEMENTS_CONFIG } from '@backbase/foundation-ang/web-sdk';

@NgModule({
  imports: [
    EntitlementsModule,
    WebSdkModule.forRoot()
  ],
  providers: [{
    provide: ENTITLEMENTS_CONFIG,
    useValue: {
      forceResolved: false,
      accessControlBasePath: '/access-control',
      accessControlPath: '/client-api/v2/accessgroups/users/permissions/summary'
    }
  }]
})
export class AppModule { }
```

**⚠️ Critical Rules:**
- Import `WebSdkModule.forRoot()` **only once** in the application root module
- Never import `WebSdkModule.forRoot()` in feature modules or lazy-loaded modules
- Configuration must match your backend Access Control API paths

#### 2. Route Protection with Guards

**Pattern: Protect route with canActivate**

```typescript
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';

const routes: Routes = [
  {
    path: 'manage-accounts',
    component: AccountsManageComponent,
    canActivate: [EntitlementsGuard],
    data: {
      entitlements: 'ProductSummary.ProductSummary.edit AND Account.Account.edit',
      redirectTo: '/error/403'
    }
  }
];
```

**Pattern: Protect child routes with canActivateChild**

```typescript
const routes: Routes = [
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivateChild: [EntitlementsGuard],
    children: [
      {
        path: 'detail',
        component: TransactionDetailsComponent,
        data: { entitlements: 'Transactions.Transactions.view' }
      },
      {
        path: 'export',
        component: TransactionExportComponent,
        data: { entitlements: 'Transactions.Transactions.export' }
      }
    ]
  }
];
```

**Pattern: Protect lazy-loaded modules with canLoad**

```typescript
const routes: Routes = [
  {
    path: 'admin',
    canLoad: [EntitlementsGuard],
    data: { entitlements: 'Admin.AdminPanel.view' },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

**Pattern: Conditional redirection based on permissions**

```typescript
import { EntitlementsGuard, ResolveEntitlements } from '@backbase/foundation-ang/entitlements';

// Centralize triplet definitions for DRY principle
export const ENTITLEMENTS = {
  userManagement: 'User.ManageUsers.view',
  messageCenter: 'MessageCenter.ManageMessages.view OR MessageCenter.SuperviseMessages.view'
} as const;

const routes: Routes = [
  {
    path: 'support/users',
    component: UserSearchComponent,
    canActivate: [EntitlementsGuard],
    data: {
      entitlements: ENTITLEMENTS.userManagement,
      redirectTo: async (resolveEntitlements: ResolveEntitlements) => {
        // Conditional fallback: try another route before defaulting to error page
        if (await resolveEntitlements(ENTITLEMENTS.messageCenter)) {
          return '/support/messages';
        }
        return '/admin';
      }
    }
  }
];
```

**Pattern: Dynamic redirection with route parameters**

```typescript
import { ActivatedRouteSnapshot } from '@angular/router';

const routes: Routes = [
  {
    path: 'users/:userId/edit',
    component: EditUserComponent,
    canActivate: [EntitlementsGuard],
    data: {
      entitlements: 'User.ManageUsers.edit',
      redirectTo: (_: any, route: ActivatedRouteSnapshot) => {
        // Redirect to view page with preserved parameters
        return `/users/${route.params.userId}/view`;
      }
    }
  }
];
```

#### 3. Template Visibility Control

**Pattern: Conditional rendering with *bbIfEntitlements**

```html
<!-- Show button only if user has required permissions -->
<button 
  *bbIfEntitlements="'Payments.Transfer.create'"
  (click)="createPayment()"
  class="btn btn-primary">
  Create Payment
</button>

<!-- Show one of two templates based on permissions -->
<div *bbIfEntitlements="'Account.Account.edit'; else viewOnly">
  <app-account-editor [account]="account"></app-account-editor>
</div>

<ng-template #viewOnly>
  <app-account-viewer [account]="account"></app-account-viewer>
</ng-template>
```

**Pattern: Complex permission logic with OR/AND**

```html
<!-- Multiple permissions with OR logic -->
<nav *bbIfEntitlements="'Payments.DomesticPayments.view OR Payments.InternationalPayments.view'">
  <a routerLink="/payments">Payments</a>
</nav>

<!-- Multiple permissions with AND logic -->
<button 
  *bbIfEntitlements="'Payments.Transfer.create AND Payments.Transfer.approve'"
  (click)="createAndApprove()">
  Create & Approve
</button>
```

**Pattern: Reusing centralized entitlement definitions**

```typescript
// entitlements.config.ts
export const FEATURE_ENTITLEMENTS = {
  viewPayments: 'Payments.Payments.view',
  editPayments: 'Payments.Payments.edit',
  createPayments: 'Payments.Payments.create',
  approvePayments: 'Payments.Payments.approve'
} as const;
```

```typescript
// payment.component.ts
import { FEATURE_ENTITLEMENTS } from './entitlements.config';

@Component({
  selector: 'app-payment',
  template: `
    <button 
      *bbIfEntitlements="entitlements.createPayments"
      (click)="create()">
      Create
    </button>
  `
})
export class PaymentComponent {
  // Expose to template
  entitlements = FEATURE_ENTITLEMENTS;
}
```

#### 4. Development Environment Mocking

**Pattern: HTTP Interceptor for mocking permissions**

```typescript
// entitlements-mock.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Define mock permissions for development
const MOCK_ENTITLEMENTS = [
  {
    additions: {},
    resource: 'Payments',
    function: 'Transfer',
    permissions: {
      view: true,
      edit: true,
      create: true
    }
  },
  {
    additions: {},
    resource: 'Account',
    function: 'ManageAccounts',
    permissions: {
      view: true,
      edit: false  // Explicitly deny edit permission for testing
    }
  }
];

@Injectable()
export class EntitlementsMockInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (req.url.endsWith('client-api/v2/accessgroups/users/permissions/summary')) {
      return of(new HttpResponse({
        status: 200,
        body: MOCK_ENTITLEMENTS
      })).pipe(delay(300)); // Simulate network latency
    }
    return next.handle(req);
  }
}
```

```typescript
// app.module.ts (development only)
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EntitlementsMockInterceptor } from './entitlements-mock.interceptor';
import { environment } from './environments/environment';

@NgModule({
  providers: [
    // Only provide mock interceptor in development
    ...(environment.production ? [] : [
      { provide: HTTP_INTERCEPTORS, useClass: EntitlementsMockInterceptor, multi: true }
    ])
  ]
})
export class AppModule { }
```

#### 5. Triplet Naming Conventions

**Standard format:** `Resource.Function.Permission`

**Rules:**
- **Remove all spaces** from resource and function names: `"Positive Pay"` → `"PositivePay"`
- Use **PascalCase** for resource and function: `"manage accounts"` → `"ManageAccounts"`
- Use **lowercase** for permission: `view`, `edit`, `create`, `delete`, `approve`, `cancel`

**Examples:**
- ✅ `ProductSummary.ProductSummary.view`
- ✅ `Payments.DomesticTransfer.create`
- ✅ `User.ManageUsers.edit`
- ❌ `Product Summary.Product Summary.view` (spaces not removed)
- ❌ `payments.domestictransfer.create` (not PascalCase)
- ❌ `User.ManageUsers.View` (permission should be lowercase)

### Standards compliance

- [x] Angular Router Guards best practices followed (official Angular documentation)
- [x] Backbase Foundation Angular API standards met
- [x] Security requirements implemented at route and template level
- [x] Consistent error handling and user feedback
- [x] Development environment mocking capability provided
- [x] Performance optimized through EntitlementsModule caching

### Quality attributes addressed

| Quality Attribute | Requirement | How Decision Addresses It |
|-------------------|-------------|---------------------------|
| Security | Prevent unauthorized access to routes and features | EntitlementsGuard blocks navigation, *bbIfEntitlements hides UI |
| Usability | Users don't see features they can't access | Template directives conditionally render based on permissions |
| Maintainability | Easy to understand and modify permissions | Centralized triplet definitions, declarative route config |
| Testability | Can test permission scenarios | HTTP interceptor mocking, isolated guard/directive logic |
| Performance | Minimal latency for permission checks | EntitlementsModule caches resolved permissions |
| Consistency | Same patterns across all journeys | Standard module, guard, and directive API |
| Auditability | Clear visibility of what's protected | Declarative route data, centralized triplet definitions |
| Configurability | Permissions can be changed without code changes | Triplets resolved from backend Access Control API |

## Consequences

### Positive consequences

1. **Security by Default**: All teams follow the same secure patterns, reducing vulnerabilities
2. **Consistent UX**: Users experience uniform behavior when encountering permission restrictions
3. **Better Developer Experience**: Clear, reusable patterns reduce implementation time and errors
4. **Improved Maintainability**: Centralized triplet definitions make permission changes easier
5. **Audit Compliance**: Clear trail of what permissions protect which features
6. **Testability**: Mocking capabilities enable comprehensive permission testing
7. **Performance**: Built-in caching reduces redundant permission checks
8. **Prevents Incomplete Workflows**: Users cannot start actions they cannot complete
9. **Framework Alignment**: Uses Angular best practices (guards) and Backbase platform standards

### Negative consequences  

1. **Learning Curve**: Teams must learn EntitlementsModule API and patterns
2. **Initial Setup Time**: Requires configuration and interceptor setup for each application
3. **Dependency**: Applications are coupled to Backbase foundation-ang library
4. **Async Complexity**: Permission resolution is asynchronous, requiring proper handling
5. **Testing Overhead**: Each component with conditional rendering needs permission tests
6. **Mock Maintenance**: Development mock permissions must be kept in sync with real permissions

### Risks and mitigation

| Risk | Probability | Impact | Mitigation Strategy | Owner |
|------|-------------|---------|-------------------|-------|
| Permissions not resolved in time for route activation | Low | High | EntitlementsModule handles async resolution; guards wait for resolution before allowing navigation | Platform Team |
| Inconsistent triplet naming across teams | Medium | Medium | Document naming conventions; provide linting rules; code review checklist | Architecture Team |
| Forgotten permission checks on new routes/features | Medium | High | Make access control part of Definition of Done; automated security testing | QA/Security Teams |
| Mock permissions diverge from production | Medium | Medium | Document sync process; automated comparison tests between mock and prod configs | Dev Teams |
| Performance degradation from excessive permission checks | Low | Medium | Use EntitlementsModule caching; avoid redundant checks; monitor performance | Platform Team |
| Backend API unavailable causing permission failures | Low | High | Implement circuit breaker pattern; provide degraded mode behavior; monitoring/alerting | Platform/Ops Teams |

## Code Review Checklist

### ✅ Module Setup
- [ ] `EntitlementsModule` is imported in the application root module
- [ ] `WebSdkModule.forRoot()` is imported **only once** in root (never in features)
- [ ] `ENTITLEMENTS_CONFIG` provider is configured with correct API paths
- [ ] HTTP interceptor for mocking is implemented for development environment
- [ ] Mock permissions are defined and realistic for testing

### ✅ Route Protection
- [ ] All routes requiring permissions have `EntitlementsGuard` applied
- [ ] Appropriate guard type used: `canActivate`, `canActivateChild`, or `canLoad`
- [ ] `data.entitlements` property contains valid triplet(s)
- [ ] `data.redirectTo` provides fallback route or callback function
- [ ] Lazy-loaded modules use `canLoad` to prevent unnecessary bundle loading
- [ ] Child routes leverage `canActivateChild` for efficiency
- [ ] Route data doesn't contain placeholder or incomplete triplet values

### ✅ Triplet Format Validation
- [ ] All triplets follow `Resource.Function.Permission` format
- [ ] Resource and Function use **PascalCase** (e.g., `ManageUsers`)
- [ ] Permission uses **lowercase** (e.g., `view`, `edit`, `create`)
- [ ] **No spaces** in resource or function names (e.g., `PositivePay`, not `Positive Pay`)
- [ ] Logical operators (`AND`, `OR`) are uppercase when combining triplets
- [ ] Triplets match backend Access Control configuration

### ✅ Template Visibility
- [ ] `*bbIfEntitlements` directive used for conditional rendering based on permissions
- [ ] Directive receives valid triplet string or reference to centralized constant
- [ ] Alternative templates provided via `else` clause where appropriate
- [ ] No buttons/links visible that user cannot actually use
- [ ] Loading states handled gracefully during async permission resolution
- [ ] Accessibility maintained (screen readers handle conditional content appropriately)

### ✅ Centralization and DRY
- [ ] Triplets defined in centralized constants file (not duplicated across components)
- [ ] Constants exported and reused in routes, templates, and tests
- [ ] File naming follows convention (e.g., `feature-name.entitlements.ts`)
- [ ] TypeScript `as const` assertion used for type safety
- [ ] Documentation provided for each triplet's purpose

### ✅ Error Handling
- [ ] 403/Forbidden error page exists in application
- [ ] `redirectTo` paths in route guards point to valid routes
- [ ] Error messages are user-friendly and consistent
- [ ] Error states are translated (i18n ready)
- [ ] Logging implemented for permission denial events (for security auditing)

### ✅ Testing
- [ ] Unit tests verify route guards prevent access without permissions
- [ ] Unit tests verify route guards allow access with permissions
- [ ] Unit tests mock permission resolution using test utilities
- [ ] Component tests verify `*bbIfEntitlements` shows/hides content correctly
- [ ] E2E tests cover permission scenarios for critical user flows
- [ ] Mock interceptor permissions align with test scenarios

### ✅ Performance
- [ ] No redundant permission checks in tight loops or frequently called methods
- [ ] Permission resolution is not blocking UI rendering unnecessarily
- [ ] `canLoad` guard used for lazy modules to prevent loading unauthorized bundles
- [ ] No excessive API calls to Access Control service (module caches results)

### ✅ Documentation
- [ ] README or documentation explains what permissions protect which features
- [ ] Triplet definitions include comments explaining their purpose
- [ ] Setup instructions provided for new developers
- [ ] Mock configuration documented for local development

### ✅ Security
- [ ] No client-side bypasses possible (guards and directives are security boundaries)
- [ ] Backend APIs also enforce permissions (defense in depth)
- [ ] Sensitive data not exposed in templates before permission checks
- [ ] No console logs exposing permission details in production builds
- [ ] Security-sensitive routes have appropriate redirection on denial

### ✅ Accessibility
- [ ] Focus management handled when permission denial triggers navigation
- [ ] Screen reader announcements for dynamic content changes based on permissions
- [ ] Keyboard navigation not broken by conditional rendering
- [ ] ARIA attributes updated appropriately for permission-based UI states

### ✅ Definition of Done
- [ ] Access control implementation completed before capability considered "done"
- [ ] All user-facing routes evaluated for permission requirements
- [ ] All action buttons/links evaluated for permission requirements
- [ ] QA sign-off includes permission testing
- [ ] Security review completed and documented
