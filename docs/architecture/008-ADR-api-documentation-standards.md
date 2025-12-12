# ADR-008: API Documentation Standards

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> All Backbase journeys must provide comprehensive API documentation generated using Compodoc and the `@backbase/capability-docs-plugin`. Documentation includes README with screenshots, CHANGELOG with migration instructions, TSDoc-generated configuration docs, view replacement information, and exposed UI components. Documentation is automatically published to the Developer Hub as part of CI/CD.

### Rules

**MUST DO ✅**

1. Include TSDoc comments on all public APIs (classes, interfaces, methods, properties)
2. Provide README with journey overview, screenshots, BASE_PATH reexports, and entitlements
3. Maintain CHANGELOG with meaningful descriptions and migration instructions for major versions
4. Configure `.compodocrc.json` with `disablePrivate: true` and `disableInternal: true`
5. Add `docs-build` executor to journey library's `project.json`
6. Publish documentation via CI/CD pipeline using `runFeApiDocsPublish()`
7. Document all configurable static assets with full paths including journey name

**MUST NOT ❌**

1. Do not expose private or internal APIs in public documentation
2. Do not include irrelevant changes in CHANGELOG (refactoring, pipeline changes, .gitignore)
3. Do not use Jira ticket numbers without meaningful descriptions in CHANGELOG
4. Do not skip TSDoc @example tags for configuration interfaces
5. Do not publish documentation from non-release branches
6. Do not use placeholder screenshots or "TODO" markers in documentation
7. Do not omit migration guides for breaking changes in major versions

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| tsdoc, comment, interface, property | [TSDoc Comments](#pattern-1-tsdoc-comments) |
| compodoc, config, json | [Compodoc Configuration](#pattern-2-compodoc-configuration) |
| executor, project.json, nx | [NX Executor Setup](#pattern-3-nx-executor-setup) |
| changelog, migration, version | [Changelog Quality](#pattern-4-changelog-quality) |
| pipeline, publish, ci/cd | [CI/CD Integration](#pattern-5-cicd-integration) |

---

### Pattern 1: TSDoc Comments

**Use when:** Documenting any public API (configuration interfaces, components, services, methods)

**Don't use when:** Documenting private or internal implementation details (use @internal decorator)

✅ **Good**

```typescript
// CONTEXT: Documenting a journey configuration interface
// RULE: Include description, @example, @default, and external links

/**
 * Configuration interface for the Journey.
 * 
 * @example
 * ```typescript
 * const config: JourneyConfig = {
 *   enableFeatureX: true,
 *   maxItems: 10
 * };
 * ```
 */
export interface JourneyConfig {
  /**
   * Enables Feature X functionality.
   * See: [Feature X Documentation](https://link-to-docs)
   * 
   * @default false
   */
  enableFeatureX?: boolean;

  /**
   * Maximum number of items to display.
   * 
   * @default 20
   * @minimum 1
   * @maximum 100
   */
  maxItems?: number;
}
```

❌ **Bad**

```typescript
// PROBLEM: No TSDoc comments, no @default tags, no examples

export interface JourneyConfig {
  enableFeatureX?: boolean;
  maxItems?: number;
}
```

**Why it's wrong:** Consumers cannot discover configuration options, understand defaults, or see usage examples without consulting source code.

**Verify:**
- [ ] All public properties have TSDoc comments with descriptions
- [ ] @default tags included for optional properties with defaults
- [ ] @example tags provided showing actual usage
- [ ] External documentation linked with @see or inline links

---

### Pattern 2: Compodoc Configuration

**Use when:** Setting up documentation generation for any journey library

**Don't use when:** [Not applicable - all public journeys require this]

✅ **Good**

```json
// CONTEXT: .compodocrc.json in journey library root
// RULE: Use standard configuration with private/internal disabled

{
  "$schema": "node_modules/@compodoc/compodoc/src/config/schema.json",
  "customFavicon": "../../favicon.ico",
  "disableSourceCode": false,
  "disableLifeCycleHooks": false,
  "disablePrivate": true,
  "disableProtected": false,
  "disableInternal": true,
  "disableDomTree": false,
  "disableTemplateTab": false,
  "disableStyleTab": false,
  "disableCoverage": false,
  "hideGenerator": true,
  "hideDarkModeToggle": true,
  "disableGraph": true,
  "disableRoutesGraph": false,
  "minimal": false,
  "theme": "material",
  "navTabConfig": [
    {
      "id": "info",
      "label": "API"
    }
  ]
}
```

❌ **Bad**

```json
// PROBLEM: Exposes private APIs and omits standard configuration

{
  "disablePrivate": false,
  "disableInternal": false,
  "minimal": true
}
```

**Why it's wrong:** Exposing private/internal APIs creates incorrect expectations for consumers and pollutes documentation with implementation details.

**Verify:**
- [ ] `disablePrivate` is `true`
- [ ] `disableInternal` is `true`
- [ ] Favicon path is relative to library folder: `"../../favicon.ico"`
- [ ] `navTabConfig` includes "API" tab

---

### Pattern 3: NX Executor Setup

**Use when:** Configuring documentation build for a journey library

**Don't use when:** [Not applicable - all public journeys require this]

✅ **Good**

```json
// CONTEXT: project.json in journey library
// RULE: Configure docs-build executor with correct paths

{
  "docs-build": {
    "builder": "@backbase/capability-docs-plugin:build",
    "options": {
      "libraryRootDir": "libs/journey-name",
      "name": "journey-name-in-kebab-case"
    }
  }
}
```

```json
// CONTEXT: project.json in any application
// RULE: Configure docs-start executor for local preview

{
  "docs-start": {
    "builder": "@backbase/capability-docs-plugin:start",
    "options": {
      "docsDir": "./dist/docs"
    }
  }
}
```

❌ **Bad**

```json
// PROBLEM: Incorrect path, non-kebab-case name

{
  "docs-build": {
    "builder": "@backbase/capability-docs-plugin:build",
    "options": {
      "libraryRootDir": "./journey-name",
      "name": "JourneyName"
    }
  }
}
```

**Why it's wrong:** Incorrect paths cause build failures; non-kebab-case names create inconsistent Developer Hub URLs.

**Verify:**
- [ ] `libraryRootDir` path is correct and exists
- [ ] `name` is URL-safe kebab-case and unique
- [ ] `docs-start` executor configured in one application

---

### Pattern 4: Changelog Quality

**Use when:** Documenting version changes for journey releases

**Don't use when:** [Not applicable - all releases require changelog updates]

✅ **Good**

```markdown
<!-- CONTEXT: CHANGELOG.md entry for a release -->
<!-- RULE: Meaningful descriptions, grouped by type, migration instructions for breaking changes -->

## [2.0.0] - 2024-01-15

### Added
- New `enableBatchProcessing` configuration option to process multiple items simultaneously
- Support for custom validators in form fields via `customValidators` config property

### Changed  
- **BREAKING:** Renamed `maxRetries` to `maxRetryAttempts` for clarity
- Improved error messages to include actionable guidance for users

### Fixed
- Resolved issue where date picker showed incorrect timezone for users in GMT+12 or higher
- Fixed memory leak in subscription cleanup for view components

### Migration Guide (Breaking Changes)
Update configuration from:
```typescript
config = { maxRetries: 3 }
```
To:
```typescript
config = { maxRetryAttempts: 3 }
```
```

❌ **Bad**

```markdown
<!-- PROBLEM: Jira-only descriptions, includes irrelevant changes, no migration guide -->

## [2.0.0] - 2024-01-15

- FEAT-1234
- FEAT-1235
- Updated .gitignore
- Refactored internal service
- Pipeline improvements
```

**Why it's wrong:** Consumers cannot understand changes without Jira access; internal changes create noise; missing migration guides cause upgrade failures.

**Verify:**
- [ ] Breaking changes clearly marked with **BREAKING:**
- [ ] Descriptions meaningful without Jira ticket access
- [ ] Migration instructions provided for major versions
- [ ] No irrelevant internal changes included

---

### Pattern 5: CI/CD Integration

**Use when:** Setting up documentation publishing in capability pipeline

**Don't use when:** Publishing to staging only (use `publishToproduction: false`)

✅ **Good**

```groovy
// CONTEXT: Jenkinsfile documentation stage
// RULE: Align with library publishing, build docs before publish

stage('Publish documentation') {
  when { 
    expression { BRANCH_NAME ==~ RELEASE_ON_MERGE_TO } 
  }
  steps {
    script {
      sh "npm run build:docs"
      runFeApiDocsPublish()
    }
  }
}
```

❌ **Bad**

```groovy
// PROBLEM: No branch condition, runs on every branch

stage('Publish documentation') {
  steps {
    script {
      sh "npm run build:docs"
      runFeApiDocsPublish()
    }
  }
}
```

**Why it's wrong:** Publishing from non-release branches overwrites production documentation with unreleased code.

**Verify:**
- [ ] Stage condition matches library publishing condition
- [ ] `npm run build:docs` executes before publication
- [ ] `runFeApiDocsPublish()` called with appropriate parameters

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `DOC-001` | .compodocrc.json exists in library root | 🔴 BLOCKER | `test -f libs/*/journey*/.compodocrc.json` |
| `DOC-002` | disablePrivate is true | 🔴 BLOCKER | `grep -l '"disablePrivate": false' **/.compodocrc.json` |
| `DOC-003` | disableInternal is true | 🔴 BLOCKER | `grep -l '"disableInternal": false' **/.compodocrc.json` |
| `DOC-004` | docs-build executor configured | 🔴 BLOCKER | `grep -l 'docs-build' libs/*/project.json` |
| `DOC-005` | README.md exists in library root | 🔴 BLOCKER | `test -f libs/*/journey*/README.md` |
| `DOC-006` | CHANGELOG.md exists in library root | 🔴 BLOCKER | `test -f libs/*/journey*/CHANGELOG.md` |
| `DOC-007` | No TODO placeholders in documentation | 🟡 WARNING | `grep -r 'TODO' libs/*/journey*/README.md` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `DOC-R01` | All public APIs have TSDoc comments with descriptions | 🔴 BLOCKER |
| `DOC-R02` | Configuration interfaces have @example tags | 🔴 BLOCKER |
| `DOC-R03` | README includes journey overview and screenshots | 🔴 BLOCKER |
| `DOC-R04` | CHANGELOG entry has meaningful description (not Jira-only) | 🔴 BLOCKER |
| `DOC-R05` | Breaking changes have migration instructions | 🔴 BLOCKER |
| `DOC-R06` | Static assets documented with full paths if configurable | 🟡 WARNING |
| `DOC-R07` | View replacement examples provided for replaceable views | 🟡 WARNING |
| `DOC-R08` | Code examples are tested and functional | 🟡 WARNING |
| `DOC-R09` | Screenshots show actual UI (not placeholders) | 🟡 WARNING |
| `DOC-R10` | Pipeline condition aligns with library publishing | 🔴 BLOCKER |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Documentation builds without errors | Build | ✅ Yes |
| Local documentation server starts | Build | ✅ Yes |
| All public exports have TSDoc comments | Coverage | ✅ Yes |
| Code examples in @example tags compile | Syntax | ⚪ Optional |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Inconsistent documentation quality across capabilities. Docs frequently out of sync with code. Changelogs contain Jira references external customers cannot access.

### Business Drivers

- Self-service adoption without capability team contact
- Reduce support tickets from inadequate docs
- Enable view extension/replacement without consulting source

### Technical Constraints

- Generate docs from TypeScript/TSDoc
- Version alongside journey releases
- CI/CD integration (Jenkins)

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Use `@backbase/capability-docs-plugin` (wrapping Compodoc) for standardized API docs. Include README, CHANGELOG with migration guides, TSDoc-generated config docs. Auto-publish to Developer Hub via CI/CD.

### Rationale

| Choice | Why |
|--------|-----|
| Compodoc | Industry-standard Angular docs tool, generates from source |
| capability-docs-plugin | Consistent config, Nx executor abstraction |
| Mandatory structure | Discoverability across all capabilities |
| CI/CD publish | Docs always synchronized with releases |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Journey libraries | MODIFY | `libs/*-journey/.compodocrc.json` |
| Journey libraries | MODIFY | `libs/*-journey/project.json` |
| Journey libraries | CREATE/MODIFY | `libs/*-journey/README.md` |
| Journey libraries | CREATE/MODIFY | `libs/*-journey/CHANGELOG.md` |
| Applications | MODIFY | `apps/*/project.json` (docs-start) |
| Root | MODIFY | `package.json` (scripts) |
| CI/CD | MODIFY | `Jenkinsfile` |
| Source code | MODIFY | `**/*.ts` (TSDoc comments) |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-007 Journey Configuration Standards | Related: Config interfaces need TSDoc for docs |
| ADR-009 View Extension Standards | Related: View extension APIs need documentation |
| ADR-010 View Replacement Standards | Related: View replacement patterns need documentation |

### Migration Notes

For existing journeys without documentation:

1. Add `.compodocrc.json` using standard template
2. Add `docs-build` executor to `project.json`
3. Create or update README.md with overview and screenshots
4. Create or update CHANGELOG.md following quality standards
5. Add TSDoc comments to all public APIs
6. Add `docs-start` executor to one application
7. Add `build:docs` and `start:docs` scripts to root package.json
8. Add documentation publish stage to CI/CD pipeline

---

## 7. Examples

### Complete Example

**Scenario:** Setting up API documentation for a new journey library

```typescript
// File: libs/payment-journey/src/lib/configuration/payment-config.interface.ts

/**
 * Configuration interface for the Payment Journey.
 * 
 * This interface defines all configurable options for customizing
 * the payment journey behavior and appearance.
 * 
 * @example
 * ```typescript
 * import { PaymentJourneyModule, PaymentConfig } from '@backbase/payment-journey';
 * 
 * const paymentConfig: PaymentConfig = {
 *   enableScheduledPayments: true,
 *   maxPaymentAmount: 50000,
 *   defaultCurrency: 'USD'
 * };
 * 
 * @NgModule({
 *   imports: [
 *     PaymentJourneyModule.forRoot(paymentConfig)
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
export interface PaymentConfig {
  /**
   * Enables scheduled payment functionality.
   * When enabled, users can schedule payments for future dates.
   * 
   * See: [Scheduled Payments](https://community.backbase.com/docs/payments/scheduled)
   * 
   * @default false
   */
  enableScheduledPayments?: boolean;

  /**
   * Maximum payment amount allowed in a single transaction.
   * Amount is in the smallest currency unit (e.g., cents for USD).
   * 
   * @default 100000
   * @minimum 1
   * @maximum 1000000
   */
  maxPaymentAmount?: number;

  /**
   * Default currency code for new payments.
   * Must be a valid ISO 4217 currency code.
   * 
   * @default 'EUR'
   */
  defaultCurrency?: string;
}
```

```json
// File: libs/payment-journey/.compodocrc.json

{
  "$schema": "node_modules/@compodoc/compodoc/src/config/schema.json",
  "customFavicon": "../../favicon.ico",
  "disablePrivate": true,
  "disableInternal": true,
  "hideGenerator": true,
  "hideDarkModeToggle": true,
  "theme": "material",
  "navTabConfig": [
    { "id": "info", "label": "API" },
    { "id": "readme", "label": "Overview" }
  ]
}
```

```json
// File: libs/payment-journey/project.json (partial)

{
  "targets": {
    "docs-build": {
      "builder": "@backbase/capability-docs-plugin:build",
      "options": {
        "libraryRootDir": "libs/payment-journey",
        "name": "payment-journey"
      }
    }
  }
}
```

### Common Mistakes

**Mistake 1: Missing TSDoc on configuration properties**

```typescript
// ❌ Wrong
export interface PaymentConfig {
  enableScheduledPayments?: boolean;
}

// ✅ Fix
export interface PaymentConfig {
  /**
   * Enables scheduled payment functionality.
   * @default false
   */
  enableScheduledPayments?: boolean;
}
```

**Mistake 2: Jira-only changelog entries**

```markdown
<!-- ❌ Wrong -->
## [1.2.0]
- FEAT-1234
- BUG-5678

<!-- ✅ Fix -->
## [1.2.0] - 2024-01-15

### Added
- New batch payment processing for multiple recipients

### Fixed
- Resolved currency conversion rounding errors
```

**Mistake 3: Exposing internal APIs in documentation**

```json
// ❌ Wrong
{
  "disablePrivate": false,
  "disableInternal": false
}

// ✅ Fix
{
  "disablePrivate": true,
  "disableInternal": true
}
```

---

## 8. References

- [API docs structure](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/3708059787/API+docs+structure) — Backbase Wiki
- [How to generate API docs](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/4207413145) — Backbase Wiki
- [Static assets management](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/3939991812) — Backbase Wiki
- [View replacement](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/3747053569) — Backbase Wiki
- [View extension](https://backbase.atlassian.net/wiki/spaces/GUIL/pages/3736830271) — Backbase Wiki
- [Documentation coverage using Compodoc](https://backbase.atlassian.net/wiki/spaces/DE/pages/3869835268) — Backbase Wiki
- [Backbase Developer Hub](https://backbase.io/developers/angular/) — Production documentation portal
- [Developer Hub Staging](https://developer-staging.backbase.eu/angular/) — Staging documentation portal
- [Compodoc Official Documentation](https://compodoc.app/) — Version-specific documentation
- [@backbase/capability-docs-plugin Repository](https://github.com/backbase-rnd/fbb-backbase-nx-plugins/tree/main/packages/nx-plugin/src/executors/docs) — Build executor source
- [runFeApiDocsPublish Pipeline Function](https://stash.backbase.com/projects/BSFG/repos/wa3-fa-shared-library/browse/vars/runFeApiDocsPublish.groovy) — Shared Jenkins function
- [TSDoc Specification](https://tsdoc.org/) — TSDoc comment syntax standard
- [Semantic Versioning 2.0.0](https://semver.org/) — Versioning standard for changelogs

---
