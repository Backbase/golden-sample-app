# ADR-002: Angular Security Standards and Best Practices

## Decision summary

This ADR establishes comprehensive security standards for Angular applications within our organization. We mandate the use of Angular's built-in security features, enforce strict Content Security Policy (CSP), implement XSS and CSRF protection mechanisms, and define secure coding practices for DOM manipulation, data sanitization, API communication, and third-party library usage. All Angular applications must follow these security standards to protect against common web vulnerabilities and ensure the integrity and confidentiality of user data.

## Context and problem statement

### Business context
- Modern web applications face increasing security threats including Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), injection attacks, and data breaches
- Security vulnerabilities can lead to significant financial losses, reputational damage, legal liabilities, and loss of customer trust
- Regulatory requirements (GDPR, SOC2, PCI-DSS) mandate robust security controls and data protection measures
- Angular is our core frontend technology stack, requiring standardized security practices across all development teams

### Technical context
- Angular framework provides built-in security features that must be properly utilized
- Current landscape shows inconsistent security implementations across different projects
- Developer knowledge of Angular security features varies across teams
- Third-party libraries and dependencies introduce potential security vulnerabilities
- Direct DOM manipulation and improper use of Angular APIs can bypass security protections
- API communication patterns need standardization for secure data exchange

### Constraints and assumptions

**Technical Constraints**:
- Must maintain compatibility with Angular v17+ and future versions
- Cannot significantly impact application performance (< 5% overhead for security measures)
- Must integrate with existing CI/CD pipelines and development workflows
- CSP implementation must not break existing legitimate functionality
- Security measures must be enforceable through automated linting and code review

**Business Constraints**:  
- Limited budget for security training and tooling implementation
- Timeline requirement: Full implementation within 6 months
- Must maintain backward compatibility with existing applications during migration
- Cannot require complete rewrite of existing codebases

**Environmental Constraints**:
- Must work across all supported browsers (Chrome, Firefox, Safari, Edge)
- Integration with existing authentication/authorization infrastructure required
- Security measures must be compatible with current hosting environment
- Must support both server-side rendering (SSR) and client-side rendering patterns

**Assumptions Made**:
- Development teams have basic Angular knowledge
- HTTPS is enforced at infrastructure level
- Backend APIs implement proper security controls
- Regular security audits and penetration testing will be conducted
- Security patches and updates will be applied promptly
- Development teams will receive adequate security training

### Affected architecture description elements

**Components**:
- All Angular components and directives
- HTTP interceptors for API communication
- Route guards for authentication and authorization
- Custom pipes and validators
- DOM sanitization services
- Authentication/authorization modules
- Form validation components
- Third-party library integrations

**Views**:
- Logical view: Security service layer architecture
- Development view: Coding standards and linting rules
- Process view: Security validation in CI/CD pipeline
- Physical view: CSP headers and HTTPS enforcement

**Stakeholders**:
- Frontend development teams: Must implement and maintain security standards
- Security team: Responsible for audits and compliance validation
- DevOps team: Implements security measures in deployment pipeline
- QA team: Tests security controls and validates implementation
- Product owners: Balance security requirements with feature delivery
- End users: Benefit from enhanced security and data protection

## Decision

### What we decided

We have decided to implement and enforce the following Angular security standards across all web applications:

#### 1. Cross-Site Scripting (XSS) Prevention
- **Mandatory**: Use Angular templates for all HTML rendering (automatic sanitization)
- **Mandatory**: Never use `innerHTML`, `outerHTML`, or direct DOM manipulation with untrusted data
- **Mandatory**: Use `DomSanitizer` service when dynamic HTML is absolutely necessary
- **Mandatory**: Avoid template interpolation with user-generated content in unsafe contexts
- **Mandatory**: Use Angular's property binding `[property]` instead of attribute interpolation for dynamic values

#### 2. Content Security Policy (CSP)
- **Mandatory**: Implement strict CSP headers for all applications
- **Mandatory**: Use nonce-based or hash-based CSP for inline scripts and styles
- **Mandatory**: Disable `unsafe-eval` and `unsafe-inline` in production
- **Mandatory**: Whitelist only trusted domains for external resources
- **Recommended**: Use CSP reporting to monitor violations

#### 3. Cross-Site Request Forgery (CSRF) Protection
- **Mandatory**: Use Angular `HttpClient` module (includes built-in CSRF protection)
- **Mandatory**: Configure CSRF token handling with backend services
- **Mandatory**: Implement `HttpXsrfTokenExtractor` for custom token extraction if needed
- **Recommended**: Use `SameSite` cookie attribute for additional protection

#### 4. DOM Sanitization and Trusted Types
- **Mandatory**: Leverage Angular's automatic sanitization for HTML, styles, URLs, and resource URLs
- **Mandatory**: Use `DomSanitizer` methods explicitly:
  - `sanitize()` for automatic context-based sanitization
  - `sanitizeHtml()` for HTML content
  - `sanitizeStyle()` for CSS styles
  - `sanitizeUrl()` for URLs
  - `sanitizeResourceUrl()` for resource URLs
- **Prohibited**: Never use `bypassSecurityTrust*` methods without security team review
- **Mandatory**: Document all uses of `bypassSecurityTrust*` with justification
- **Recommended**: Enable Trusted Types API in modern browsers

#### 5. Safe DOM Manipulation
- **Prohibited**: Direct use of `ElementRef.nativeElement` for DOM manipulation
- **Mandatory**: Use `Renderer2` API for all DOM manipulations
- **Prohibited**: Use of `document.querySelector`, `document.getElementById`, etc.
- **Mandatory**: Use Angular template references (`@ViewChild`, `@ViewChildren`) instead
- **Prohibited**: Use of `eval()`, `Function()` constructor, or similar dynamic code execution

#### 6. HTTP and API Security
- **Mandatory**: Always use HTTPS for all API communications
- **Mandatory**: Implement authentication tokens via HTTP-only cookies or secure headers
- **Mandatory**: Use HTTP interceptors for centralized authentication and error handling
- **Mandatory**: Validate SSL/TLS certificates (disable certificate bypass in production)
- **Mandatory**: Implement proper timeout and retry logic for HTTP requests
- **Prohibited**: Expose API keys, secrets, or tokens in frontend code
- **Mandatory**: Use environment variables for configuration management
- **Recommended**: Implement rate limiting and request throttling

#### 7. Authentication and Authorization
- **Mandatory**: Implement route guards (`CanActivate`, `CanActivateChild`, `CanLoad`) for protected routes
- **Mandatory**: Validate user permissions on both client and server side
- **Mandatory**: Implement proper session timeout and idle detection
- **Mandatory**: Clear sensitive data from memory on logout
- **Prohibited**: Store sensitive data in localStorage or sessionStorage
- **Recommended**: Use secure, HTTP-only cookies for authentication tokens
- **Recommended**: Implement JWT with appropriate expiration times

#### 8. Third-Party Libraries and Dependencies
- **Mandatory**: Conduct security review before adding new dependencies
- **Mandatory**: Run automated security scans (`npm audit`, `snyk`) in CI/CD pipeline
- **Mandatory**: Keep all dependencies up to date with latest security patches
- **Mandatory**: Remove unused dependencies to reduce attack surface
- **Mandatory**: Pin dependency versions in package.json
- **Recommended**: Use lock files (package-lock.json) and verify integrity
- **Recommended**: Limit use of libraries with poor security track records

#### 9. Input Validation and Sanitization
- **Mandatory**: Validate all user inputs on both client and server side
- **Mandatory**: Use Angular reactive forms with built-in validators
- **Mandatory**: Implement custom validators for business-specific validation rules
- **Mandatory**: Sanitize user input before processing or displaying
- **Mandatory**: Implement proper error handling without exposing sensitive information
- **Prohibited**: Trust client-side validation alone

#### 10. Secure Data Storage
- **Prohibited**: Store sensitive data (passwords, tokens, PII) in localStorage/sessionStorage
- **Mandatory**: Use secure, HTTP-only cookies with Secure and SameSite flags for sensitive data
- **Mandatory**: Encrypt sensitive data before storage if client-side storage is necessary
- **Mandatory**: Clear sensitive data from browser memory after use
- **Recommended**: Implement proper data retention policies

#### 11. Angular Security Configuration
- **Mandatory**: Enable production mode in production builds (`enableProdMode()`)
- **Mandatory**: Disable debug information in production
- **Mandatory**: Use Angular CLI build optimizations (`ng build --configuration=production`)
- **Mandatory**: Enable strict TypeScript compiler options
- **Recommended**: Use Angular's strict template type checking

#### 12. Server-Side Rendering (SSR) Security
- **Mandatory**: Sanitize all server-rendered content
- **Mandatory**: Implement proper state transfer security
- **Mandatory**: Avoid exposing server-side secrets in SSR output
- **Recommended**: Use separate security configurations for SSR vs client-side rendering

### Rationale

**Why Angular's Built-in Security Features**:
- Angular provides automatic context-aware sanitization that prevents most XSS attacks
- Built-in CSRF protection through HttpClient reduces implementation complexity
- Framework-level security is tested and maintained by Angular team

**Why Strict CSP**:
- CSP is the most effective defense-in-depth measure against XSS attacks
- Modern browsers provide excellent CSP support
- CSP reporting helps identify security violations and potential attacks

**Why Renderer2 over Direct DOM Access**:
- Renderer2 works across different platforms (browser, server, web workers)
- Provides abstraction layer that can enforce security policies
- Prevents bypass of Angular's sanitization mechanisms

**Why HTTP-only Cookies over localStorage**:
- HTTP-only cookies cannot be accessed via JavaScript, preventing XSS-based token theft
- localStorage is vulnerable to XSS attacks
- Cookies can be configured with Secure and SameSite flags for additional protection

**Why Strict Dependency Management**:
- Third-party vulnerabilities are a leading cause of security breaches
- Automated scanning catches known vulnerabilities early
- Regular updates ensure latest security patches are applied

## Implementation details

### Technical approach

#### 1. Code Structure and Organization

**Security Service Layer**:
```typescript
// src/app/core/security/dom-sanitizer.service.ts
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SecureDomSanitizerService {
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Sanitizes HTML content to prevent XSS attacks
   * Use only when dynamic HTML from trusted sources is required
   * @param html - The HTML content to sanitize
   * @returns SafeHtml - Sanitized HTML safe for rendering
   */
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }

  /**
   * Sanitizes URLs to prevent javascript: and data: URL attacks
   * @param url - The URL to sanitize
   * @returns SafeUrl - Sanitized URL safe for use
   */
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.sanitize(SecurityContext.URL, url) || '';
  }

  /**
   * Sanitizes resource URLs (for iframes, scripts, etc.)
   * Use with extreme caution and only for trusted sources
   * @param url - The resource URL to sanitize
   * @returns SafeResourceUrl - Sanitized resource URL
   */
  sanitizeResourceUrl(url: string): SafeResourceUrl {
    return this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, url) || '';
  }
}
```

**HTTP Interceptor for Security Headers**:
```typescript
// src/app/core/interceptors/security.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone request and add security headers
    const secureReq = req.clone({
      withCredentials: true, // Include cookies for CSRF protection
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
        'X-Content-Type-Options': 'nosniff', // Prevent MIME sniffing
      }
    });

    return next.handle(secureReq);
  }
}
```

**Route Guard for Authentication**:
```typescript
// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
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
```

**Safe Component Implementation Example**:
```typescript
// Example of secure component implementation
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-secure-content',
  template: `
    <div [innerHTML]="sanitizedContent"></div>
    <a [href]="sanitizedUrl">Safe Link</a>
  `
})
export class SecureContentComponent implements OnInit {
  sanitizedContent: SafeHtml = '';
  sanitizedUrl: SafeUrl = '';

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // CORRECT: Sanitize before rendering
    const userContent = '<script>alert("XSS")</script><p>Safe content</p>';
    this.sanitizedContent = this.sanitizer.sanitize(
      SecurityContext.HTML, 
      userContent
    ) || '';

    // CORRECT: Sanitize URLs
    const userUrl = 'javascript:alert("XSS")';
    this.sanitizedUrl = this.sanitizer.sanitize(
      SecurityContext.URL, 
      userUrl
    ) || 'about:blank';
  }

  // CORRECT: Use Renderer2 for DOM manipulation
  addClass(): void {
    this.renderer.addClass(this.el.nativeElement, 'active');
  }

  // INCORRECT: Never do this
  // dangerousMethod(): void {
  //   this.el.nativeElement.innerHTML = userContent; // XSS vulnerability!
  //   document.querySelector('.target').innerHTML = userContent; // XSS vulnerability!
  // }
}
```

#### 2. Content Security Policy Configuration

**CSP Header Configuration (to be implemented on server)**:
```typescript
// Example CSP configuration for Angular application
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'nonce-{RANDOM_NONCE}'", // Generated per request
    // For production, avoid 'unsafe-inline' and 'unsafe-eval'
  ],
  'style-src': [
    "'self'",
    "'nonce-{RANDOM_NONCE}'",
    'https://fonts.googleapis.com',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
  ],
  'img-src': [
    "'self'",
    'data:', // For inline images
    'https:', // For external images
  ],
  'connect-src': [
    "'self'",
    'https://api.yourdomain.com', // Your API endpoints
  ],
  'frame-ancestors': ["'none'"], // Prevent clickjacking
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': [], // Upgrade HTTP to HTTPS
  'block-all-mixed-content': [], // Block mixed content
};

// Generate CSP header string
const cspHeader = Object.entries(cspDirectives)
  .map(([key, values]) => `${key} ${values.join(' ')}`)
  .join('; ');
```

**Angular Configuration for CSP**:
```typescript
// angular.json - Add CSP meta tag in index.html
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "index": {
              "input": "src/index.html",
              "output": "index.html"
            }
          }
        }
      }
    }
  }
}
```

```html
<!-- src/index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Secure Angular App</title>
  <meta http-equiv="Content-Security-Policy" 
        content="default-src 'self'; script-src 'self' 'nonce-{NONCE}'; style-src 'self' 'nonce-{NONCE}'">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="/">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

#### 3. CSRF Protection Configuration

```typescript
// app.config.ts or app.module.ts
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN', // Backend must set this cookie
        headerName: 'X-XSRF-TOKEN', // Angular will send token in this header
      }),
      withInterceptors([securityInterceptor])
    )
  ]
};
```

#### 4. Validation and Form Security

```typescript
// Secure form implementation example
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-secure-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input type="text" formControlName="username" 
             [attr.aria-invalid]="username.invalid && username.touched">
      <div *ngIf="username.invalid && username.touched" role="alert">
        <span *ngIf="username.errors?.['required']">Username is required</span>
        <span *ngIf="username.errors?.['pattern']">Invalid username format</span>
      </div>
      
      <input type="email" formControlName="email"
             [attr.aria-invalid]="email.invalid && email.touched">
      <div *ngIf="email.invalid && email.touched" role="alert">
        <span *ngIf="email.errors?.['required']">Email is required</span>
        <span *ngIf="email.errors?.['email']">Invalid email format</span>
      </div>
      
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
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  get username() { return this.userForm.get('username')!; }
  get email() { return this.userForm.get('email')!; }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Form values are already validated
      const formData = this.userForm.value;
      // Send to backend - backend must also validate!
    }
  }
}
```

#### 5. Secure Configuration Management

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://dev-api.yourdomain.com',
  // NEVER commit sensitive data like API keys to version control
  // Use environment variables or secret management instead
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com',
};
```

### Standards compliance

Document compliance with Design Authority standards:
- [x] Platform API standards followed (HTTPS, authentication, authorization)
- [x] Data model patterns implemented (secure data transfer, sanitization)
- [x] Security requirements met (XSS, CSRF, CSP, input validation)
- [x] Monitoring and logging implemented (security event logging, CSP reporting)
- [x] Integration patterns from approved catalogue used (HTTP interceptors, route guards)

### Quality attributes addressed

| Quality Attribute | Requirement | How Decision Addresses It |
|-------------------|-------------|---------------------------|
| Security | Protection against XSS, CSRF, injection attacks | Angular's automatic sanitization, CSP headers, CSRF tokens, input validation |
| Reliability | 99.9% uptime without security incidents | Proactive security measures prevent exploitation and downtime |
| Maintainability | < 2 day security patch deployment | Standardized security patterns enable rapid updates across codebase |
| Compliance | Meet GDPR, SOC2, PCI-DSS requirements | Secure data handling, encryption, access controls, audit trails |
| Performance | < 5% overhead for security measures | Efficient built-in Angular security features with minimal performance impact |
| Usability | Transparent security without UX degradation | Security measures implemented without impacting user experience |
| Testability | 100% security controls covered by tests | Unit tests for validators, interceptors, guards, and sanitization logic |

## Success metrics

### Technical success criteria
- **Zero critical security vulnerabilities** in automated scans (npm audit, Snyk)
- **100% of applications** implement CSP in blocking mode
- **100% of applications** use HttpClient with CSRF protection
- **Zero usage** of prohibited patterns (innerHTML with untrusted data, direct DOM access)
- **All new code** passes security linting rules without warnings
- **< 5% performance overhead** from security measures
- **100% test coverage** for security-critical code (guards, interceptors, validators)

### Business success criteria  
- **Zero security breaches** related to frontend vulnerabilities
- **Successful compliance audits** (SOC2, GDPR, PCI-DSS)
- **< 24 hour** response time for critical security patches
- **80% developer satisfaction** with security tooling and guidelines (measured via survey)
- **50% reduction** in security-related code review issues within 6 months
- **Zero customer data breaches** attributable to frontend vulnerabilities

### Monitoring and measurement
**Key metrics to track**:
- Number of security vulnerabilities detected and resolved (by severity)
- Code coverage for security-critical components
- CSP violation reports (frequency and types)
- Time to patch critical security vulnerabilities
- Percentage of applications compliant with security standards
- Developer training completion rates
- Security incident frequency and severity

**Monitoring tools and dashboards**:
- CSP reporting dashboard for violation monitoring
- Dependency vulnerability dashboard (Snyk/npm audit)
- CI/CD pipeline security gates (pass/fail metrics)
- Application security monitoring (failed authentication attempts, suspicious patterns)
- Security incident tracking system

**Review schedule and checkpoints**:
- **Weekly**: Review CSP violation reports and dependency scan results
- **Monthly**: Security working group meeting to review progress and issues
- **Quarterly**: Comprehensive security audit and penetration testing
- **Quarterly**: Review and update security documentation and standards
- **Annual**: Full security program review and ADR update

## References

### Authoritative sources
- [Angular Security Guide (v17)](https://v17.angular.io/guide/security) - Official Angular security documentation
- [Angular API Security Context](https://v17.angular.io/api/core/SecurityContext) - Angular sanitization contexts
- [Angular DomSanitizer](https://v17.angular.io/api/platform-browser/DomSanitizer) - Sanitization service documentation
- [Angular HttpClient](https://v17.angular.io/api/common/http/HttpClient) - HTTP client with CSRF support
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Common web application security risks
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Content Security Policy (CSP) Reference](https://content-security-policy.com/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

### Technical references
- [Angular Official Documentation](https://angular.dev/best-practices/security) - Latest Angular security best practices
- [Trusted Types API](https://w3c.github.io/trusted-types/dist/spec/) - Browser API for preventing DOM XSS
- [SameSite Cookie Specification](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-05) - CSRF protection via cookies
- [HTTP Strict Transport Security (HSTS)](https://tools.ietf.org/html/rfc6797) - Enforce HTTPS
- [Subresource Integrity (SRI)](https://www.w3.org/TR/SRI/) - Verify integrity of external resources
- [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/) - Cryptographic operations in web applications

### Standards compliance
- [ISO/IEC/IEEE 42010:2022] - Systems and software engineering — Architecture description
- [OWASP ASVS (Application Security Verification Standard)](https://owasp.org/www-project-application-security-verification-standard/) - Security requirements framework
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) - Cybersecurity standards
- [PCI DSS (Payment Card Industry Data Security Standard)](https://www.pcisecuritystandards.org/) - Payment data security
- [GDPR (General Data Protection Regulation)](https://gdpr.eu/) - Data protection and privacy
- [SOC 2 (Service Organization Control)](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/sorhome.html) - Security and availability standards

### Industry best practices
- [Google Web Security Best Practices](https://developers.google.com/web/fundamentals/security)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [Angular Security Best Practices (Community)](https://dev.to/kristiyanvelkov/angular-security-best-practices-guide-in3)
- [Web Application Security Consortium (WASC)](http://www.webappsec.org/)

### Security testing tools
- [OWASP ZAP (Zed Attack Proxy)](https://www.zaproxy.org/) - Automated security testing
- [Burp Suite](https://portswigger.net/burp) - Web vulnerability scanner
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency vulnerability scanner
- [Snyk](https://snyk.io/) - Security platform for developers
- [Dependabot](https://github.com/dependabot) - Automated dependency updates
- [ESLint Security Plugin](https://github.com/eslint-community/eslint-plugin-security) - Security-focused linting

### Training resources
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/) - Hands-on security training
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) - Free online security training
- [Secure Code Warrior](https://www.securecodewarrior.com/) - Security skills platform
- [Angular Security Course](https://angular-university.io/) - Angular-specific security training

---

## Appendix: Quick Reference Guide

### Prohibited Patterns ❌

```typescript
// ❌ NEVER: Direct innerHTML manipulation
element.innerHTML = userInput;
this.el.nativeElement.innerHTML = data;

// ❌ NEVER: Direct DOM queries
document.querySelector('.target').innerHTML = content;
document.getElementById('myId').style.color = userColor;

// ❌ NEVER: Bypassing security without review
this.sanitizer.bypassSecurityTrustHtml(userInput); // Requires security review

// ❌ NEVER: Using eval or Function constructor
eval(userCode);
new Function(userCode)();

// ❌ NEVER: Storing sensitive data in localStorage
localStorage.setItem('authToken', token);
sessionStorage.setItem('password', password);

// ❌ NEVER: Exposing secrets in frontend
const API_KEY = 'hardcoded-secret-key';
```

### Approved Patterns ✅

```typescript
// ✅ CORRECT: Use Angular templates with property binding
@Component({
  template: `
    <div [innerHTML]="sanitizedContent"></div>
    <a [href]="sanitizedUrl">Link</a>
  `
})

// ✅ CORRECT: Use DomSanitizer for necessary dynamic content
this.sanitizedContent = this.sanitizer.sanitize(SecurityContext.HTML, userInput);

// ✅ CORRECT: Use Renderer2 for DOM manipulation
this.renderer.addClass(this.el.nativeElement, 'active');
this.renderer.setStyle(this.el.nativeElement, 'color', 'blue');

// ✅ CORRECT: Use HttpClient with CSRF protection
this.http.post('/api/data', payload).subscribe();

// ✅ CORRECT: Use route guards
{ path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }

// ✅ CORRECT: Validate user input with reactive forms
this.form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)]]
});

// ✅ CORRECT: Use secure HTTP-only cookies for auth tokens (configured on backend)
// Frontend: cookies are automatically included with withCredentials: true

// ✅ CORRECT: Use environment variables for configuration
constructor(@Inject('API_URL') private apiUrl: string) {}
```

### Security Checklist for Code Review

**Before merging code, verify**:
- [ ] No direct innerHTML manipulation with untrusted data
- [ ] No direct DOM access via ElementRef or document methods
- [ ] All dynamic content is sanitized using DomSanitizer
- [ ] No use of bypassSecurityTrust* methods (or documented with justification)
- [ ] HttpClient is used for all HTTP requests (CSRF protection)
- [ ] Route guards implemented for protected routes
- [ ] User input is validated with reactive forms
- [ ] No sensitive data stored in localStorage/sessionStorage
- [ ] No hardcoded secrets or API keys
- [ ] No use of eval() or Function() constructor
- [ ] All dependencies are up to date (no high/critical vulnerabilities)
- [ ] CSP compliance verified (no inline scripts/styles without nonces)
- [ ] Security tests written for authentication/authorization logic
- [ ] Error messages don't expose sensitive information


