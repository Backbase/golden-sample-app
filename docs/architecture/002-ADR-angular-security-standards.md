# ADR-002: Angular Security Standards and Best Practices

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> Use Angular's built-in security features (automatic sanitization, HttpClient with CSRF protection, route guards) for all applications. Never bypass security mechanisms like DomSanitizer without security team review, and never use direct DOM manipulation with untrusted data. Store sensitive tokens in HTTP-only cookies, not localStorage.

### Rules

**MUST DO ✅**

1. Use Angular templates for all HTML rendering (automatic sanitization)
2. Use `DomSanitizer` service when dynamic HTML is absolutely necessary
3. Use `Renderer2` API for all DOM manipulations
4. Use Angular `HttpClient` module with CSRF token configuration
5. Implement route guards (`CanActivate`, `CanActivateChild`, `CanLoad`) for protected routes
6. Validate all user inputs on both client and server side using reactive forms
7. Run automated security scans (`npm audit`, `snyk`) in CI/CD pipeline

**MUST NOT ❌**

1. Never use `innerHTML`, `outerHTML`, or direct DOM manipulation with untrusted data
2. Never use `bypassSecurityTrust*` methods without security team review
3. Never use `eval()`, `Function()` constructor, or dynamic code execution
4. Never store sensitive data (passwords, tokens, PII) in localStorage/sessionStorage
5. Never expose API keys, secrets, or tokens in frontend code
6. Never use `document.querySelector`, `document.getElementById`, or direct DOM queries
7. Never use `ElementRef.nativeElement` for DOM manipulation

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
| innerHTML, dynamic HTML, user content, sanitize | [Pattern 1: Safe HTML Rendering](#pattern-1-safe-html-rendering) |
| DOM, element, addClass, style, manipulation | [Pattern 2: Safe DOM Manipulation](#pattern-2-safe-dom-manipulation) |
| auth, guard, route, protected, login | [Pattern 3: Route Protection](#pattern-3-route-protection) |
| form, input, validation, user data | [Pattern 4: Secure Form Handling](#pattern-4-secure-form-handling) |
| http, api, csrf, request, interceptor | [Pattern 5: Secure HTTP Communication](#pattern-5-secure-http-communication) |

---

### Pattern 1: Safe HTML Rendering

**Use when:** You need to render dynamic HTML content from external sources or user input

**Don't use when:** You're rendering static templates or using Angular's template syntax with property binding

✅ **Good**

```typescript
// CONTEXT: Rendering user-generated content in a component
// RULE: Always use DomSanitizer to sanitize HTML before rendering

import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml, SecurityContext } from '@angular/platform-browser';

@Component({
  selector: 'app-secure-content',
  template: `<div [innerHTML]="sanitizedContent"></div>`
})
export class SecureContentComponent implements OnInit {
  sanitizedContent: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const userContent = '<script>alert("XSS")</script><p>Safe content</p>';
    this.sanitizedContent = this.sanitizer.sanitize(
      SecurityContext.HTML, 
      userContent
    ) || '';
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: Direct innerHTML assignment bypasses Angular's sanitization

export class UnsafeContentComponent {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const userContent = '<script>alert("XSS")</script><p>Content</p>';
    this.el.nativeElement.innerHTML = userContent; // XSS vulnerability!
  }
}
```

**Why it's wrong:** Direct innerHTML manipulation bypasses Angular's automatic sanitization, allowing malicious scripts to execute and enabling XSS attacks.

**Verify:**
- [ ] No direct `innerHTML` or `outerHTML` assignments in code
- [ ] All dynamic HTML uses `DomSanitizer.sanitize()` with appropriate SecurityContext
- [ ] No use of `bypassSecurityTrust*` methods without documented justification

---

### Pattern 2: Safe DOM Manipulation

<!-- LLM: See ADR-000 Pattern 4 for full implementation details -->

**Use when:** Programmatically modifying DOM elements (add classes, set styles, create elements)

**Don't use when:** Angular template bindings (`[class]`, `[style]`, `*ngIf`) can achieve the same result

**Quick Reference:** Use `Renderer2` for all DOM manipulations. See **ADR-000 Pattern 4** for complete examples.

**Security Context:** Direct DOM access (`document.querySelector`, `innerHTML`) bypasses Angular's sanitization, enabling XSS vulnerabilities and breaking SSR compatibility.

**Verify:**
- [ ] No `document.querySelector`, `document.getElementById`, or similar methods
- [ ] No direct `ElementRef.nativeElement` property access for modifications
- [ ] All DOM manipulations use `Renderer2` API

---

### Pattern 3: Route Protection

**Use when:** You have routes that require authentication or specific permissions

**Don't use when:** Routes are publicly accessible with no authorization requirements

✅ **Good**

```typescript
// CONTEXT: Protecting admin routes from unauthorized access
// RULE: Use CanActivate guards for authentication checks

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return false;
        }
        return true;
      })
    );
  }
}

// Route configuration
const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
];
```

❌ **Bad**

```typescript
// PROBLEM: No route protection - any user can access admin routes

const routes: Routes = [
  { path: 'admin', component: AdminComponent } // No guard - accessible to everyone!
];

// Or hiding routes in template only
@Component({
  template: `<a *ngIf="isAdmin" routerLink="/admin">Admin</a>` // UI-only check, route still accessible
})
```

**Why it's wrong:** Without route guards, any user can directly navigate to protected URLs. Template-based hiding only prevents navigation UI but not direct URL access.

**Verify:**
- [ ] All protected routes have appropriate `canActivate` or `canLoad` guards
- [ ] Guards validate permissions on both client and server side
- [ ] Unauthorized access redirects to login with return URL

---

### Pattern 4: Secure Form Handling

**Use when:** Collecting any user input through forms

**Don't use when:** Displaying read-only data without user interaction

✅ **Good**

```typescript
// CONTEXT: User registration form with validation
// RULE: Use reactive forms with built-in validators and custom patterns

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-secure-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input type="text" formControlName="username">
      <div *ngIf="username.invalid && username.touched" role="alert">
        <span *ngIf="username.errors?.['pattern']">Invalid username format</span>
      </div>
      <input type="email" formControlName="email">
      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  `
})
export class SecureFormComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9_-]+$/) // Alphanumeric, underscore, hyphen only
      ]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get username() { return this.userForm.get('username')!; }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Backend must also validate!
    }
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: Template-driven forms without validation, trusting client-side only

@Component({
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="username" name="username">
      <button type="submit">Submit</button>
    </form>
  `
})
export class UnsafeFormComponent {
  username = '';

  onSubmit(): void {
    this.api.submit(this.username); // No validation - accepts any input
  }
}
```

**Why it's wrong:** Without proper validation, malicious or malformed data can be submitted. Client-side validation alone is insufficient as it can be bypassed; server-side validation is always required.

**Verify:**
- [ ] All forms use reactive forms with explicit validators
- [ ] Input patterns restrict characters appropriately for field type
- [ ] Backend always re-validates all input (never trust client-side only)

---

### Pattern 5: Secure HTTP Communication

**Use when:** Making any HTTP requests to APIs

**Don't use when:** Never - always use secure HTTP patterns

✅ **Good**

```typescript
// CONTEXT: Configuring Angular app for secure HTTP with CSRF protection
// RULE: Use HttpClient with XSRF configuration and security interceptors

import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

// Security interceptor
@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const secureReq = req.clone({
      withCredentials: true, // Include cookies for CSRF protection
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Content-Type-Options': 'nosniff',
      }
    });
    return next.handle(secureReq);
  }
}

// App configuration
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      withInterceptors([securityInterceptor])
    )
  ]
};
```

❌ **Bad**

```typescript
// PROBLEM: Hardcoded secrets and no CSRF protection

@Injectable()
export class UnsafeApiService {
  private apiKey = 'hardcoded-secret-key'; // Exposed in frontend bundle!

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get('/api/data', {
      headers: { 'X-API-Key': this.apiKey } // Secret exposed to anyone
    });
  }
}
```

**Why it's wrong:** API keys in frontend code are exposed in the browser's dev tools and bundled JavaScript. CSRF protection is required to prevent cross-site request forgery attacks.

**Verify:**
- [ ] No hardcoded secrets, API keys, or tokens in frontend code
- [ ] HttpClient uses `withXsrfConfiguration` for CSRF protection
- [ ] `withCredentials: true` is set for requests requiring authentication

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `SEC-001` | No direct innerHTML assignment | 🔴 BLOCKER | `grep -r "\.innerHTML\s*=" --include="*.ts"` |
| `SEC-002` | No direct outerHTML assignment | 🔴 BLOCKER | `grep -r "\.outerHTML\s*=" --include="*.ts"` |
| `SEC-003` | No document.querySelector usage | 🔴 BLOCKER | `grep -r "document\.querySelector" --include="*.ts"` |
| `SEC-004` | No document.getElementById usage | 🔴 BLOCKER | `grep -r "document\.getElementById" --include="*.ts"` |
| `SEC-005` | No eval() usage | 🔴 BLOCKER | `grep -r "eval\(" --include="*.ts"` |
| `SEC-006` | No new Function() usage | 🔴 BLOCKER | `grep -r "new Function\(" --include="*.ts"` |
| `SEC-007` | No localStorage for tokens | 🔴 BLOCKER | `grep -r "localStorage\.setItem.*[Tt]oken" --include="*.ts"` |
| `SEC-008` | No bypassSecurityTrust without review | 🔴 BLOCKER | `grep -r "bypassSecurityTrust" --include="*.ts"` |
| `SEC-009` | No hardcoded API keys | 🔴 BLOCKER | `grep -rE "(apiKey|API_KEY|secret)\s*[:=]\s*['\"]" --include="*.ts"` |
| `SEC-010` | npm audit clean | 🔴 BLOCKER | `npm audit --audit-level=high` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `SEC-R01` | All dynamic HTML uses DomSanitizer with appropriate SecurityContext | 🔴 BLOCKER |
| `SEC-R02` | All protected routes have authentication/authorization guards | 🔴 BLOCKER |
| `SEC-R03` | All forms use reactive forms with proper validators | 🔴 BLOCKER |
| `SEC-R04` | HttpClient is configured with CSRF protection | 🔴 BLOCKER |
| `SEC-R05` | No sensitive data exposed in error messages | 🟡 WARNING |
| `SEC-R06` | All bypassSecurityTrust* usage has documented justification | 🔴 BLOCKER |
| `SEC-R07` | Session timeout and idle detection implemented | 🟡 WARNING |
| `SEC-R08` | Sensitive data cleared from memory on logout | 🟡 WARNING |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Route guard authentication logic | Unit | ✅ Yes |
| HTTP interceptor security headers | Unit | ✅ Yes |
| Form validators (custom patterns) | Unit | ✅ Yes |
| DOM sanitization service | Unit | ✅ Yes |
| Protected route access control | Integration | ✅ Yes |
| CSRF token handling | Integration | ✅ Yes |
| XSS attack prevention | E2E | ⚪ Optional |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Web applications face XSS, CSRF, injection attacks, and data breaches. Inconsistent security implementations and varying developer knowledge create vulnerabilities. Regulatory requirements (GDPR, SOC2, PCI-DSS) mandate standardized security controls.

### Business Drivers

- Regulatory compliance (GDPR, SOC2, PCI-DSS)
- Financial/reputational risk from breaches
- Customer trust in data handling

### Technical Constraints

- Angular v17+ compatibility
- Performance overhead < 5%
- Cross-browser support (Chrome, Firefox, Safari, Edge)

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Enforce Angular's built-in security features (automatic sanitization, HttpClient CSRF, route guards), strict CSP, and secure coding practices (Renderer2 for DOM, HTTP-only cookies for tokens).

### Rationale

| Choice | Why |
|--------|-----|
| Angular built-in security | Framework-maintained XSS/CSRF protection |
| Renderer2 over direct DOM | Platform-agnostic, enforces security policies |
| HTTP-only cookies over localStorage | Not accessible via JavaScript, prevents XSS token theft |
| Strict CSP | Most effective XSS defense-in-depth |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Angular components | MODIFY | `**/*.component.ts` |
| HTTP interceptors | CREATE/MODIFY | `**/interceptors/*.ts` |
| Route guards | CREATE/MODIFY | `**/guards/*.ts` |
| Security services | CREATE | `**/services/*sanitizer*.ts` |
| Form components | MODIFY | `**/*form*.component.ts` |
| App configuration | MODIFY | `app.config.ts`, `app.module.ts` |
| Index HTML | MODIFY | `src/index.html` (CSP meta tag) |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-001: Accessibility Standards | Related to - Form validation patterns overlap |
| ADR-013: Unit/Integration Testing | Depends on - Security components require test coverage |

### Migration Notes

For existing applications:
1. Audit all uses of `innerHTML`, `outerHTML`, and direct DOM access
2. Replace direct DOM manipulation with Renderer2
3. Add DomSanitizer for any necessary dynamic HTML
4. Configure HttpClient with XSRF protection
5. Migrate auth token storage from localStorage to HTTP-only cookies
6. Add route guards to all protected routes
7. Run `npm audit` and resolve all high/critical vulnerabilities
8. Add CSP headers or meta tag to index.html

---

## 7. Examples

### Complete Example

**Scenario:** Secure component that renders user-generated content, manipulates DOM safely, and communicates with an API

```typescript
// File: src/app/features/user-content/user-content.component.ts

import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml, SecurityContext } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-content',
  template: `
    <div [innerHTML]="sanitizedContent"></div>
    <a [href]="sanitizedUrl">User Link</a>
    
    <form [formGroup]="commentForm" (ngSubmit)="onSubmit()">
      <textarea formControlName="comment"></textarea>
      <div *ngIf="comment.invalid && comment.touched" role="alert">
        <span *ngIf="comment.errors?.['maxlength']">Comment too long</span>
      </div>
      <button type="submit" [disabled]="commentForm.invalid">Submit</button>
    </form>
  `
})
export class UserContentComponent implements OnInit {
  sanitizedContent: SafeHtml = '';
  sanitizedUrl: string = '';
  commentForm: FormGroup;

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private el: ElementRef,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  get comment() { return this.commentForm.get('comment')!; }

  ngOnInit(): void {
    // CORRECT: Sanitize user HTML content
    const userHtml = '<script>alert("XSS")</script><p>User content</p>';
    this.sanitizedContent = this.sanitizer.sanitize(
      SecurityContext.HTML, 
      userHtml
    ) || '';

    // CORRECT: Sanitize user URL
    const userUrl = 'javascript:alert("XSS")';
    this.sanitizedUrl = this.sanitizer.sanitize(
      SecurityContext.URL, 
      userUrl
    ) || 'about:blank';
  }

  // CORRECT: Use Renderer2 for DOM manipulation
  highlightContent(): void {
    this.renderer.addClass(this.el.nativeElement, 'highlighted');
    this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid blue');
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      // HttpClient automatically includes CSRF token
      this.http.post('/api/comments', this.commentForm.value).subscribe();
    }
  }
}
```

### Common Mistakes

**Mistake 1: Direct innerHTML with User Content**

```typescript
// ❌ Wrong
this.el.nativeElement.innerHTML = userContent;

// ✅ Fix
this.sanitizedContent = this.sanitizer.sanitize(SecurityContext.HTML, userContent) || '';
// In template: <div [innerHTML]="sanitizedContent"></div>
```

**Mistake 2: Storing Tokens in localStorage**

```typescript
// ❌ Wrong
localStorage.setItem('authToken', token);
const token = localStorage.getItem('authToken');

// ✅ Fix
// Configure backend to set HTTP-only cookie
// Configure HttpClient with withCredentials: true
this.http.post('/api/login', credentials, { withCredentials: true }).subscribe();
```

**Mistake 3: Unprotected Routes**

```typescript
// ❌ Wrong
const routes: Routes = [
  { path: 'admin', component: AdminComponent }
];

// ✅ Fix
const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
];
```

---

## 8. References

### Angular (Primary)

- [Angular Security Guide (v17)](https://v17.angular.io/guide/security) — Official security documentation
- [Angular DomSanitizer](https://v17.angular.io/api/platform-browser/DomSanitizer) — Sanitization service
- [Angular HttpClient CSRF](https://v17.angular.io/api/common/http/HttpClient) — CSRF protection

### Security Standards (When Deep-Diving)

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — Common web security risks
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) — XSS mitigation
- [Content Security Policy](https://content-security-policy.com/) — CSP reference

---
