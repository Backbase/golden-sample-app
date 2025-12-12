# ADR-011: Entitlements and Access Control Standards

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> All journeys must implement access control using the Backbase EntitlementsModule from `@backbase/foundation-ang/entitlements`. Use `EntitlementsGuard` for route protection and `*bbIfEntitlements` directive for template visibility, following the triplet pattern (`Resource.Function.Permission`).

### Rules

**MUST DO ✅**

1. Import `EntitlementsModule` in the application root module
2. Use `EntitlementsGuard` for all routes requiring permission checks
3. Use `*bbIfEntitlements` directive for conditional UI rendering based on permissions
4. Define permissions using `Resource.Function.Permission` triplet format (PascalCase for Resource/Function, lowercase for Permission)
5. Centralize triplet definitions in constants files to avoid duplication
6. Implement HTTP interceptors for mocking permissions in development environments
7. Provide `redirectTo` fallback routes for permission denials

**MUST NOT ❌**

1. Import `WebSdkModule.forRoot()` in feature modules or lazy-loaded modules (only in root)
2. Use spaces in triplet resource or function names (use `PositivePay`, not `Positive Pay`)
3. Show buttons/links visible that users cannot actually use due to missing permissions
4. Duplicate triplet definitions across components (centralize them)
5. Expose permission details in console logs in production builds
6. Bypass client-side guards without backend enforcement (defense in depth)
7. Use incorrect casing in triplets (Resource/Function must be PascalCase, Permission must be lowercase)

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| route, guard, navigation, protect, canActivate | [Pattern 1: Route Protection](#pattern-1-route-protection) |
| template, hide, show, conditional, directive | [Pattern 2: Template Visibility](#pattern-2-template-visibility) |
| triplet, permission, naming, constant | [Pattern 3: Triplet Definition](#pattern-3-triplet-definition) |
| mock, development, interceptor, testing | [Pattern 4: Development Mocking](#pattern-4-development-mocking) |
| lazy, module, canLoad, bundle | [Pattern 5: Lazy Module Protection](#pattern-5-lazy-module-protection) |

---

### Pattern 1: Route Protection

**Use when:** Protecting routes that require specific user permissions to access

**Don't use when:** Public routes that don't require authentication or authorization

✅ **Good**

```typescript
// CONTEXT: Protecting an account management route with required permissions
// RULE: Use EntitlementsGuard with canActivate and provide redirectTo fallback

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

❌ **Bad**

```typescript
// PROBLEM: Missing EntitlementsGuard and permission configuration

const routes: Routes = [
  {
    path: 'manage-accounts',
    component: AccountsManageComponent
    // No guard, no entitlements data, no redirectTo
  }
];
```

**Why it's wrong:** Routes without EntitlementsGuard allow unauthorized users to access protected features, creating security vulnerabilities.

**Verify:**
- [ ] `EntitlementsGuard` is applied to all permission-required routes
- [ ] `data.entitlements` contains valid triplet(s)
- [ ] `data.redirectTo` provides a fallback route

---

### Pattern 2: Template Visibility

**Use when:** Conditionally showing/hiding UI elements based on user permissions

**Don't use when:** Conditional rendering based on non-permission business logic

✅ **Good**

```typescript
// CONTEXT: Showing edit functionality only to users with edit permission
// RULE: Use *bbIfEntitlements with else clause for alternative content

@Component({
  template: `
    <div *bbIfEntitlements="'Account.Account.edit'; else viewOnly">
      <app-account-editor [account]="account"></app-account-editor>
    </div>
    
    <ng-template #viewOnly>
      <app-account-viewer [account]="account"></app-account-viewer>
    </ng-template>
  `
})
export class AccountComponent {}
```

❌ **Bad**

```typescript
// PROBLEM: Using ngIf with manual permission check instead of directive

@Component({
  template: `
    <div *ngIf="hasEditPermission">
      <app-account-editor [account]="account"></app-account-editor>
    </div>
  `
})
export class AccountComponent {
  hasEditPermission = true; // Hardcoded or manually managed
}
```

**Why it's wrong:** Manual permission checks bypass the EntitlementsModule caching and don't integrate with the standard access control API.

**Verify:**
- [ ] `*bbIfEntitlements` directive used for permission-based rendering
- [ ] Alternative templates provided via `else` clause where appropriate
- [ ] No buttons/links visible that user cannot use

---

### Pattern 3: Triplet Definition

**Use when:** Defining permission triplets for routes or templates

**Don't use when:** N/A - always use this pattern for permissions

✅ **Good**

```typescript
// CONTEXT: Centralizing entitlement triplets for a feature
// RULE: Use PascalCase for Resource/Function, lowercase for permission, no spaces

// entitlements.config.ts
export const FEATURE_ENTITLEMENTS = {
  viewPayments: 'Payments.Payments.view',
  editPayments: 'Payments.Payments.edit',
  createPayments: 'Payments.Payments.create',
  approvePayments: 'Payments.Payments.approve',
  viewDomesticTransfer: 'Payments.DomesticTransfer.view'
} as const;

// In component
import { FEATURE_ENTITLEMENTS } from './entitlements.config';

@Component({
  template: `<button *bbIfEntitlements="entitlements.createPayments">Create</button>`
})
export class PaymentComponent {
  entitlements = FEATURE_ENTITLEMENTS;
}
```

❌ **Bad**

```typescript
// PROBLEM: Spaces in names, wrong casing, duplicated definitions

// Component 1
@Component({
  template: `<button *bbIfEntitlements="'Positive Pay.Positive Pay.View'">View</button>`
})
export class Component1 {}

// Component 2 - duplicate definition
@Component({
  template: `<button *bbIfEntitlements="'positive pay.positive pay.view'">View</button>`
})
export class Component2 {}
```

**Why it's wrong:** Spaces break triplet parsing, incorrect casing causes permission mismatches, and duplicated definitions lead to maintenance issues and inconsistencies.

**Verify:**
- [ ] No spaces in Resource or Function names
- [ ] Resource and Function use PascalCase
- [ ] Permission uses lowercase
- [ ] Triplets centralized in constants file

---

### Pattern 4: Development Mocking

**Use when:** Testing permission scenarios in development environment

**Don't use when:** Production builds (mock should be conditionally excluded)

✅ **Good**

```typescript
// CONTEXT: Mocking entitlements API for development testing
// RULE: Use HTTP interceptor that only activates in non-production environments

// entitlements-mock.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const MOCK_ENTITLEMENTS = [
  {
    additions: {},
    resource: 'Payments',
    function: 'Transfer',
    permissions: { view: true, edit: true, create: true }
  }
];

@Injectable()
export class EntitlementsMockInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (req.url.endsWith('client-api/v2/accessgroups/users/permissions/summary')) {
      return of(new HttpResponse({ status: 200, body: MOCK_ENTITLEMENTS })).pipe(delay(300));
    }
    return next.handle(req);
  }
}

// app.module.ts
@NgModule({
  providers: [
    ...(environment.production ? [] : [
      { provide: HTTP_INTERCEPTORS, useClass: EntitlementsMockInterceptor, multi: true }
    ])
  ]
})
export class AppModule { }
```

❌ **Bad**

```typescript
// PROBLEM: Mock interceptor included in production builds

@NgModule({
  providers: [
    // Always included, even in production!
    { provide: HTTP_INTERCEPTORS, useClass: EntitlementsMockInterceptor, multi: true }
  ]
})
export class AppModule { }
```

**Why it's wrong:** Including mock interceptors in production bypasses real permission checks, creating a critical security vulnerability.

**Verify:**
- [ ] Mock interceptor conditionally provided based on environment
- [ ] Mock permissions are realistic for testing scenarios
- [ ] Production builds exclude mock interceptor

---

### Pattern 5: Lazy Module Protection

**Use when:** Protecting lazy-loaded feature modules from unauthorized bundle loading

**Don't use when:** Eager-loaded modules (use `canActivate` instead)

✅ **Good**

```typescript
// CONTEXT: Preventing unauthorized users from loading admin module bundle
// RULE: Use canLoad guard to block both navigation AND bundle loading

import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';

const routes: Routes = [
  {
    path: 'admin',
    canLoad: [EntitlementsGuard],
    data: { entitlements: 'Admin.AdminPanel.view' },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

❌ **Bad**

```typescript
// PROBLEM: Using canActivate instead of canLoad for lazy module

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [EntitlementsGuard], // Module still loads!
    data: { entitlements: 'Admin.AdminPanel.view' },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

**Why it's wrong:** `canActivate` blocks navigation but still loads the module bundle. `canLoad` prevents both, reducing unnecessary network requests and protecting code from unauthorized access.

**Verify:**
- [ ] Lazy-loaded modules use `canLoad` guard
- [ ] `data.entitlements` contains valid triplet
- [ ] No unnecessary bundle loading for unauthorized users

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `ENT-001` | EntitlementsModule imported in root module | 🔴 BLOCKER | `grep -r "EntitlementsModule" --include="*.module.ts"` |
| `ENT-002` | No spaces in triplet names | 🔴 BLOCKER | `grep -rE "entitlements.*['\"][A-Za-z]+\s+[A-Za-z]+\." --include="*.ts"` |
| `ENT-003` | WebSdkModule.forRoot() only in root module | 🔴 BLOCKER | `grep -r "WebSdkModule.forRoot" --include="*.module.ts" \| wc -l` (should be 1) |
| `ENT-004` | EntitlementsGuard used in route files | 🟡 WARNING | `grep -r "EntitlementsGuard" --include="*routing*.ts"` |
| `ENT-005` | Mock interceptor excluded from production | 🔴 BLOCKER | `grep -r "EntitlementsMockInterceptor" --include="*.ts" \| grep -v "environment.production"` |
| `ENT-006` | Centralized triplet constants exist | 🟡 WARNING | `grep -r "as const" --include="*entitlements*.ts"` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `ENT-R01` | All permission-required routes have EntitlementsGuard | 🔴 BLOCKER |
| `ENT-R02` | All action buttons use *bbIfEntitlements for permission-gated features | 🔴 BLOCKER |
| `ENT-R03` | Triplets match backend Access Control configuration | 🔴 BLOCKER |
| `ENT-R04` | redirectTo paths point to valid routes | 🔴 BLOCKER |
| `ENT-R05` | Lazy modules use canLoad instead of canActivate | 🟡 WARNING |
| `ENT-R06` | Error messages are user-friendly and translated | 🟡 WARNING |
| `ENT-R07` | No console logs exposing permission details in production | 🔴 BLOCKER |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Route guards prevent access without permissions | Unit | ✅ Yes |
| Route guards allow access with permissions | Unit | ✅ Yes |
| *bbIfEntitlements shows/hides content correctly | Unit | ✅ Yes |
| Mock interceptor returns expected permissions | Unit | ✅ Yes |
| Critical user flows with permission scenarios | E2E | ✅ Yes |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Different user roles need different access levels (view, edit, create, approve, etc.). Without standardized access control, teams implement inconsistent solutions with security gaps.

### Business Drivers

- Fine-grained access control across business functions
- Regulatory compliance requires proper authorization
- Unauthorized banking access poses security risks

### Technical Constraints

- `@backbase/foundation-ang` v6.21.0+
- Triplet pattern: `Resource.Function.Permission`
- Permissions resolved via HTTP (async)

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Use Backbase `EntitlementsModule`: `EntitlementsGuard` for route protection, `*bbIfEntitlements` directive for template visibility, centralized triplet constants. Access control mandatory for Definition of Done.

### Rationale

| Choice | Why |
|--------|-----|
| Security by default | DoD requirement ensures no deployment without proper security |
| Centralized triplets | DRY principle, prevents duplication and inconsistencies |
| Declarative approach | Route guards + directives make permissions visible/maintainable |
| Mock interceptor | Dev/test environment support with production exclusion |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Root Module | MODIFY | `app.module.ts` |
| Routing Modules | MODIFY | `*-routing.module.ts`, `*.routes.ts` |
| Feature Components | MODIFY | `*.component.ts`, `*.component.html` |
| Entitlements Config | CREATE | `*-entitlements.config.ts` |
| Mock Interceptor | CREATE | `entitlements-mock.interceptor.ts` |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-002: Angular Security Standards | Related to |
| ADR-007: Journey Configuration Standards | Related to |

### Migration Notes

For existing applications without access control:
1. Import `EntitlementsModule` in root module
2. Configure `ENTITLEMENTS_CONFIG` provider
3. Add `EntitlementsGuard` to all permission-required routes
4. Add `*bbIfEntitlements` to permission-gated UI elements
5. Create centralized triplet configuration files
6. Implement mock interceptor for development

---

## 7. Examples

### Complete Example

**Scenario:** Implementing access control for a payment management feature

```typescript
// File: libs/payments/src/lib/payments-entitlements.config.ts

export const PAYMENTS_ENTITLEMENTS = {
  viewPayments: 'Payments.Payments.view',
  editPayments: 'Payments.Payments.edit',
  createPayments: 'Payments.Payments.create',
  approvePayments: 'Payments.Payments.approve',
  createAndApprove: 'Payments.Payments.create AND Payments.Payments.approve'
} as const;

// File: libs/payments/src/lib/payments-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { PAYMENTS_ENTITLEMENTS } from './payments-entitlements.config';

const routes: Routes = [
  {
    path: '',
    component: PaymentsListComponent,
    canActivate: [EntitlementsGuard],
    data: {
      entitlements: PAYMENTS_ENTITLEMENTS.viewPayments,
      redirectTo: '/error/403'
    }
  },
  {
    path: 'create',
    component: CreatePaymentComponent,
    canActivate: [EntitlementsGuard],
    data: {
      entitlements: PAYMENTS_ENTITLEMENTS.createPayments,
      redirectTo: '/payments'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule {}

// File: libs/payments/src/lib/payments-list/payments-list.component.ts

import { Component } from '@angular/core';
import { PAYMENTS_ENTITLEMENTS } from '../payments-entitlements.config';

@Component({
  selector: 'app-payments-list',
  template: `
    <h1>Payments</h1>
    
    <button 
      *bbIfEntitlements="entitlements.createPayments"
      routerLink="/payments/create"
      class="btn btn-primary">
      Create Payment
    </button>
    
    <button 
      *bbIfEntitlements="entitlements.createAndApprove"
      (click)="createAndApprove()"
      class="btn btn-success">
      Create & Approve
    </button>
  `
})
export class PaymentsListComponent {
  entitlements = PAYMENTS_ENTITLEMENTS;
  
  createAndApprove(): void {
    // Implementation
  }
}
```

### Common Mistakes

**Mistake 1: Spaces in triplet names**

```typescript
// ❌ Wrong
data: { entitlements: 'Positive Pay.Manage Rules.view' }

// ✅ Fix
data: { entitlements: 'PositivePay.ManageRules.view' }
```

**Mistake 2: Wrong casing in triplets**

```typescript
// ❌ Wrong
data: { entitlements: 'payments.domestictransfer.View' }

// ✅ Fix
data: { entitlements: 'Payments.DomesticTransfer.view' }
```

**Mistake 3: WebSdkModule.forRoot() in feature module**

```typescript
// ❌ Wrong - in feature module
@NgModule({
  imports: [WebSdkModule.forRoot()] // Should only be in root!
})
export class PaymentsModule {}

// ✅ Fix - only in app.module.ts
@NgModule({
  imports: [WebSdkModule.forRoot()]
})
export class AppModule {}
```

---

## 8. References

- [Angular Route Guards Documentation](https://angular.io/guide/router#milestone-5-route-guards)
- [Backbase Foundation Angular Entitlements API](https://community.backbase.com/documentation/foundation-ang/latest/entitlements)
- [Backbase Access Control API](https://community.backbase.com/documentation/access-control/latest)

---
