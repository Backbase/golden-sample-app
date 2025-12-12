# ADR-007: Journey Configuration Standards

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> Journeys must use typed configuration interfaces with injection tokens, provided in bundle modules (not app.module) to maintain lazy loading. Build-time configuration uses DI tokens; run-time configuration uses Remote Config service. Configuration services must merge project overrides with sensible defaults.

### Rules

**MUST DO ✅**

1. Define typed configuration interface with JSDoc comments for each journey
2. Create injection token typed as `Partial<Configuration>` for flexible overrides
3. Provide configuration in bundle modules using `useValue` or `useFactory`
4. Use `@Optional() @Inject(token)` in configuration service constructor
5. Expose configuration via getter methods (not public properties)
6. Merge overrides with defaults: `{ ...configDefaults, ...configOverrides }`
7. Wrap localizable router strings in functions: `() => $localize\`text\``

**MUST NOT ❌**

1. Provide journey configuration tokens in app.module (causes eager loading)
2. Use `@Injectable({ providedIn: 'root' })` for configuration services
3. Use `any` type for configuration interfaces or tokens
4. Expose configuration object directly (no encapsulation)
5. Allow configuration mutation after construction (no setters)
6. Use string-based keys without typed interface (e.g., `'page-size'`)
7. Skip default values (forcing projects to provide all configuration)

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| configuration, interface, token, defaults | [Configuration Definition](#pattern-1-configuration-definition) |
| bundle, provider, useValue, useFactory | [Configuration Provision](#pattern-2-configuration-provision) |
| service, inject, getter, merge | [Configuration Service](#pattern-3-configuration-service) |
| remote config, runtime, feature flag | [Runtime Configuration](#pattern-4-runtime-configuration) |
| router, localize, i18n, tabs | [Localizable Router Config](#pattern-5-localizable-router-config) |

---

### Pattern 1: Configuration Definition

**Use when:** Creating a new journey that requires customizable behavior

**Don't use when:** Configuration is truly static and never varies between projects

✅ **Good**

```typescript
// CONTEXT: Defining journey configuration interface, token, and defaults
// RULE: Use typed interface, Partial token, and exported defaults

import { InjectionToken } from '@angular/core';

/** Configuration for Batches Journey */
export interface BatchesJourneyConfiguration {
  /** Number of items to display per page in batch lists */
  pageSize: number;
  /** Whether manual batch creation is enabled */
  enableManualBatches: boolean;
  /** Maximum file upload size in bytes */
  maxUploadSize: number;
}

export const BatchesJourneyConfigurationToken = 
  new InjectionToken<Partial<BatchesJourneyConfiguration>>(
    'BatchesJourneyConfiguration injection token',
  );

export const configDefaults: BatchesJourneyConfiguration = {
  pageSize: 50,
  enableManualBatches: true,
  maxUploadSize: 10485760, // 10MB
};
```

❌ **Bad**

```typescript
// PROBLEM: Using 'any' type, no defaults, string-based keys

export const ConfigToken = new InjectionToken<any>('Config');

// No interface, no defaults, no type safety
useValue: {
  'page-size': 20,
  'enableManualBatches': false
}
```

**Why it's wrong:** Without typed interfaces, configuration typos aren't caught at compile time. String-based keys provide no IDE autocomplete or refactoring support.

**Verify:**
- [ ] Interface has explicit types for all properties (no `any`)
- [ ] JSDoc comments document each property
- [ ] Token is typed as `Partial<Interface>`
- [ ] Default values provided for all properties

---

### Pattern 2: Configuration Provision

**Use when:** Providing journey configuration in a project

**Don't use when:** Never provide configuration in app.module

✅ **Good**

```typescript
// CONTEXT: Bundle module providing journey configuration
// RULE: Provide in bundle module to maintain lazy loading

import { NgModule } from '@angular/core';
import { 
  BatchesJourneyModule,
  BatchesJourneyConfigurationToken 
} from '@backbase/batch-journey';

@NgModule({
  imports: [BatchesJourneyModule.forRoot()],
  providers: [
    {
      provide: BatchesJourneyConfigurationToken,
      useValue: {
        pageSize: 20,
        enableManualBatches: false,
      },
    },
  ],
})
export class BatchesJourneyBundleModule {}
```

❌ **Bad**

```typescript
// PROBLEM: Configuration in app.module causes journey to load eagerly

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BackbaseCoreModule.forRoot({
      classMap: {},
      lazyModules: bundlesDefinitions,
    }),
  ],
  providers: [
    // This eagerly loads the journey, increasing main bundle size!
    {
      provide: BatchesJourneyConfigurationToken,
      useValue: { pageSize: 20 },
    },
  ],
})
export class AppModule {}
```

**Why it's wrong:** Providing configuration in app.module forces Angular to resolve the injection token eagerly, loading the journey code into the main bundle and increasing initial load time.

**Verify:**
- [ ] Configuration token provided in bundle module (not app.module)
- [ ] Only non-default values are specified
- [ ] Values match interface types

---

### Pattern 3: Configuration Service

**Use when:** Consuming configuration in a journey

**Don't use when:** N/A - always use this pattern for configuration access

✅ **Good**

```typescript
// CONTEXT: Configuration service with constructor injection and getters
// RULE: Use @Optional() @Inject(), merge with defaults, expose via getters

import { Injectable, Optional, Inject } from '@angular/core';
import { 
  BatchesJourneyConfiguration,
  BatchesJourneyConfigurationToken,
  configDefaults 
} from './batches-journey-config.interface';

@Injectable()
export class BatchesJourneyConfigurationService {
  private config: BatchesJourneyConfiguration;

  constructor(
    @Optional() 
    @Inject(BatchesJourneyConfigurationToken) 
    configOverrides: Partial<BatchesJourneyConfiguration>
  ) {
    this.config = { ...configDefaults, ...configOverrides };
  }

  get pageSize(): number {
    return this.config.pageSize;
  }

  get enableManualBatches(): boolean {
    return this.config.enableManualBatches;
  }

  get maxUploadSize(): number {
    return this.config.maxUploadSize;
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: providedIn root, direct property access, no defaults, mutable

@Injectable({ providedIn: 'root' })
export class ConfigService {
  config: BatchesJourneyConfiguration; // Public - no encapsulation!

  constructor(@Inject(ConfigToken) config: BatchesJourneyConfiguration) {
    this.config = config; // No defaults!
  }

  set pageSize(value: number) {
    this.config.pageSize = value; // Mutation allowed!
  }
}
```

**Why it's wrong:** `providedIn: 'root'` creates a singleton that can't be overridden per bundle. Direct property access breaks encapsulation. Missing defaults forces all projects to provide complete configuration. Setters allow runtime mutation.

**Verify:**
- [ ] Service uses `@Injectable()` (not `providedIn: 'root'`)
- [ ] Constructor uses `@Optional() @Inject(token)`
- [ ] Defaults merged with spread operator
- [ ] All properties exposed via getters only (no setters)

---

### Pattern 4: Runtime Configuration

**Use when:** Configuration needs to change without recompiling (feature flags, A/B tests)

**Don't use when:** Configuration is static per project/environment

✅ **Good**

```typescript
// CONTEXT: Bundle module with runtime configuration from Remote Config
// RULE: Use useFactory with RemoteConfigService for runtime-dependent values

import { NgModule } from '@angular/core';
import { RemoteConfigService } from '@backbase/remote-config-ang';
import { 
  BatchesJourneyModule,
  BatchesJourneyConfigurationToken 
} from '@backbase/batch-journey';

@NgModule({
  imports: [BatchesJourneyModule.forRoot()],
  providers: [
    {
      provide: BatchesJourneyConfigurationToken,
      useFactory: (remoteConfig: RemoteConfigService) => ({
        pageSize: 20,
        enableManualBatches: remoteConfig.getValue('enable_manual_batches'),
        maxUploadSize: remoteConfig.getValue('max_upload_size'),
      }),
      deps: [RemoteConfigService],
    },
  ],
})
export class BatchesJourneyBundleModule {}
```

❌ **Bad**

```typescript
// PROBLEM: Using useFactory without listing dependencies

@NgModule({
  providers: [
    {
      provide: ConfigToken,
      useFactory: (remoteConfig: RemoteConfigService) => ({
        flag: remoteConfig.getValue('key'),
      }),
      // deps array missing! Will throw runtime error
    },
  ],
})
```

**Why it's wrong:** Factory functions require explicit `deps` array to receive injected dependencies. Missing deps causes Angular injection to fail at runtime.

**Verify:**
- [ ] APP_INITIALIZER fetches remote config before app starts
- [ ] Factory uses `deps` array for all dependencies
- [ ] Remote config values have sensible defaults

---

### Pattern 5: Localizable Router Config

**Use when:** Router configuration needs localized tab titles or labels

**Don't use when:** Text is static and never translated

✅ **Good**

```typescript
// CONTEXT: Localizable strings in router configuration
// RULE: Wrap $localize in functions for View Engine compatibility

export const tabs = {
  firstTab: () => $localize`First tab`,
  secondTab: () => $localize`Second tab`
};

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabWrapperComponent,
    children: [
      {
        path: 'first',
        component: FirstTabComponent,
        data: { titleFn: tabs.firstTab },
      },
      {
        path: 'second',
        component: SecondTabComponent,
        data: { titleFn: tabs.secondTab },
      }
    ],
  },
];

// In component - invoke function to get localized string
const title = this.route.snapshot.data['titleFn']();
```

❌ **Bad**

```typescript
// PROBLEM: Direct $localize in route config fails with View Engine

export const routes: Routes = [
  {
    path: 'first',
    component: FirstTabComponent,
    data: { title: $localize`First tab` }, // Fails at build time!
  },
];
```

**Why it's wrong:** View Engine evaluates route configuration at compile time before `$localize` is available. Wrapping in a function defers evaluation to runtime.

**Verify:**
- [ ] Localizable strings wrapped in arrow functions
- [ ] Route data stores function reference (not invocation result)
- [ ] Component invokes function to get localized string

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `JC-001` | Configuration token in app.module | 🔴 BLOCKER | `grep -r "ConfigurationToken" apps/*/src/app/app.module.ts` |
| `JC-002` | Configuration service with providedIn root | 🔴 BLOCKER | `grep -B2 "ConfigurationService" \| grep "providedIn: 'root'"` |
| `JC-003` | InjectionToken without Partial type | 🟡 WARNING | `grep "InjectionToken<[^P]" libs/**/config*.ts` |
| `JC-004` | Public config property (no encapsulation) | 🟡 WARNING | `grep "public config:" libs/**/*config*.service.ts` |
| `JC-005` | Missing @Optional on config injection | 🔴 BLOCKER | `grep "@Inject(.*ConfigurationToken)" \| grep -v "@Optional"` |
| `JC-006` | useFactory without deps array | 🔴 BLOCKER | `grep -A3 "useFactory" \| grep -v "deps:"` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `JC-R01` | Configuration interface has JSDoc for all properties | 🟡 WARNING |
| `JC-R02` | All interface properties have explicit types (no `any`) | 🔴 BLOCKER |
| `JC-R03` | Default values provided for all configuration properties | 🔴 BLOCKER |
| `JC-R04` | Getter methods exist for all configuration properties | 🔴 BLOCKER |
| `JC-R05` | Configuration service has no setter methods | 🟡 WARNING |
| `JC-R06` | Bundle module only specifies non-default values | 🟡 WARNING |
| `JC-R07` | Journey README documents all configuration options | 🟡 WARNING |
| `JC-R08` | Localized router strings wrapped in functions | 🔴 BLOCKER |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Default values used when no overrides provided | Unit | ✅ Yes |
| Overrides correctly replace defaults | Unit | ✅ Yes |
| Partial overrides merge with defaults | Unit | ✅ Yes |
| All getter methods return correct values | Unit | ✅ Yes |
| Configuration provided in bundle module | Integration | ✅ Yes |
| View components receive configuration via service | Integration | ⚪ Optional |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Widget Architecture 3 used ItemModel (no type safety, hard to discover options). Configuration in app.module caused eager loading, harming performance.

### Business Drivers

- Configuration flexibility without modifying source code
- Dev/staging/production configs without rebuilding
- Runtime feature toggles and A/B testing support

### Technical Constraints

- Must maintain lazy loading (configuration cannot eagerly load journeys)
- Angular DI patterns with type safety
- Immutable build principles (build once, deploy many)

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Typed configuration interfaces with injection tokens (`Partial<Config>`). Configuration services with defaults merged via spread operator. Provide in bundle modules (not app.module) to maintain lazy loading. Use Remote Config for runtime values.

### Rationale

| Choice | Why |
|--------|-----|
| Typed interfaces | Compile-time checking, IDE autocomplete |
| Injection tokens in bundles | Maintains lazy loading, co-located config |
| Defaults + spread merge | Projects override only what they need |
| Getter methods | Encapsulation, single source of truth |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Configuration Interface | CREATE | `libs/*/src/*-journey-config.interface.ts` |
| Configuration Service | CREATE | `libs/*/src/*-journey-config.service.ts` |
| Journey Module | MODIFY | `libs/*/src/*-journey.module.ts` |
| Bundle Module | MODIFY | `libs/journey-bundles/*/src/*-bundle.module.ts` |
| View Components | MODIFY | `libs/*/src/views/*.component.ts` |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-003: Translation/Internationalization | Related: Localizable router config pattern |

### Migration Notes

If migrating from ItemModel-based configuration:

1. Create typed interface with all existing configuration properties
2. Create injection token with `Partial<Interface>` type
3. Define default values in configDefaults constant
4. Create configuration service with constructor injection and getters
5. Move configuration provision from app.module to bundle modules
6. Update view components to inject configuration service
7. Update journey README with configuration documentation

---

## 7. Examples

### Complete Example

<!-- 
NOTE: For interface, token, and service patterns, see Patterns 1-3 above.
This example shows the file organization structure only.
-->

**Scenario:** File organization for journey configuration

```
libs/batch-journey/
├── src/
│   ├── batches-journey-config.interface.ts   # Interface + Token + Defaults (Pattern 1)
│   ├── batches-journey-config.service.ts     # Service with getters (Pattern 3)
│   └── batches-journey.module.ts
│
libs/journey-bundles/batches/
└── src/
    └── batches-bundle.module.ts              # Provider with overrides (Pattern 2)
```

**Key Files Summary:**

| File | Contains | Pattern |
|------|----------|---------|
| `*-config.interface.ts` | Interface, `InjectionToken<Partial<T>>`, `configDefaults` | Pattern 1 |
| `*-config.service.ts` | `@Optional() @Inject()`, spread merge, getter methods | Pattern 3 |
| `*-bundle.module.ts` | `useValue` provider with only non-default values | Pattern 2 |

### Common Mistakes

**Mistake 1: Configuration in App Module**

```typescript
// ❌ Wrong - causes eager loading
@NgModule({
  providers: [
    { provide: JourneyConfigToken, useValue: { ... } }
  ],
})
export class AppModule {}

// ✅ Fix - provide in bundle module
@NgModule({
  imports: [JourneyModule.forRoot()],
  providers: [
    { provide: JourneyConfigToken, useValue: { ... } }
  ],
})
export class JourneyBundleModule {}
```

**Mistake 2: No Default Values**

```typescript
// ❌ Wrong - requires all projects to provide complete config
constructor(@Inject(ConfigToken) config: JourneyConfiguration) {
  this.config = config;
}

// ✅ Fix - merge with defaults
constructor(
  @Optional() @Inject(ConfigToken) overrides: Partial<JourneyConfiguration>
) {
  this.config = { ...configDefaults, ...overrides };
}
```

**Mistake 3: Direct Property Access**

```typescript
// ❌ Wrong - no encapsulation
export class ConfigService {
  config: JourneyConfiguration; // Public!
}
// Usage: this.configService.config.pageSize

// ✅ Fix - use getters
export class ConfigService {
  private config: JourneyConfiguration;
  get pageSize(): number { return this.config.pageSize; }
}
// Usage: this.configService.pageSize
```

---

## 8. References

- [Developing a Journey - Backbase Docs](https://community.backbase.com/documentation/foundation_angular/latest/develop_journey) — Journey development patterns
- [Remote Config Documentation](https://community.backbase.com/documentation/foundation_angular/latest/remote_config) — Runtime configuration
- [Web Apps Configuration](https://community.backbase.com/documentation/foundation_angular/latest/web_apps_configuration) — Configuration approaches
- [Angular Dependency Injection](https://angular.io/guide/dependency-injection) — DI patterns and InjectionToken
- [InjectionToken API](https://angular.io/api/core/InjectionToken) — InjectionToken usage
- [ModuleWithProviders](https://angular.io/api/core/ModuleWithProviders) — forRoot pattern
- [Angular Localization](https://angular.io/guide/i18n-common-prepare) — $localize usage
- [TypeScript Partial Type](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) — Partial utility type
- [Angular Style Guide](https://angular.io/guide/styleguide) — Configuration service patterns

---
