# ADR-007: Journey Configuration Standards

---

## Decision summary

Journeys in Backbase must use a standardized configuration approach distinguishing between build-time configuration (via Dependency Injection tokens in bundle modules) and run-time configuration (via Remote Config service). Configuration must be defined through typed interfaces with injection tokens, implemented via configuration services with default values, and provided in bundle modules to maintain lazy loading. This approach eliminates ItemModel-based configuration, provides type safety, and gives projects flexibility to determine configuration sources while maintaining separation of concerns between compile-time and runtime configuration needs.

## Context and problem statement

### Business context
- **Configuration Flexibility:** Projects need ability to customize journey behavior without modifying source code
- **Multiple Personas:** Configuration is consumed by both business users (runtime toggles) and extension engineers (compile-time setup)
- **Environment Management:** Different environments (dev, staging, production) require different configurations without rebuilding
- **Feature Toggles:** A/B testing and feature flags require runtime configuration changes
- **Success Criteria:**
  - Type-safe configuration with IDE autocomplete
  - Clear separation between compile-time and runtime configuration
  - No increase in main bundle size from configuration
  - Configuration discoverable and documented

### Technical context
- **Existing Landscape:** Angular applications using journey architecture with lazy-loaded bundles
- **Affected Systems:**
  - Journey modules and their configuration services
  - Bundle modules where configuration is provided
  - App module where remote config is initialized
  - Journey view components consuming configuration
  - Build process and compilation pipeline
- **Technical Challenges:**
  - Widget Architecture 3 previously used ItemModel for configuration
  - Configuration in app.module causes eager loading of journeys
  - No type safety with object-based configuration
  - Unclear where configuration should be provided
  - Difficulty discovering available configuration options

### Constraints and assumptions

**Technical Constraints:**
- Must maintain lazy loading of journey bundles (configuration cannot eagerly load journeys)
- Must support Angular Dependency Injection patterns
- Must work with both View Engine and Ivy compilation (requires function wrappers for $localize in router config)
- Configuration must be serializable for remote config (no functions in runtime config)
- Type safety required at compile time

**Business Constraints:**
- Business users should not need technical knowledge to change runtime configuration
- Extension engineers need flexibility to configure at build time
- Configuration changes should not always require application recompilation
- Projects must have freedom to determine configuration source (environment files, remote config, etc.)

**Environmental Constraints:**
- Must work within Nx monorepo workspace structure
- Must support immutable build principles (build once, deploy many)
- Must integrate with existing Remote Config infrastructure

**Assumptions Made:**
- Projects will adopt Remote Config for runtime configuration needs
- Extension engineers understand TypeScript and Angular DI patterns
- Configuration services will be maintained alongside journey code
- Default configuration values are sensible for most projects

### Affected architecture description elements

**Components:**
- Journey configuration services (define configuration interface and defaults)
- Journey configuration injection tokens
- Bundle modules (provide configuration via DI)
- App module (initialize remote config and provide runtime-dependent config)
- Journey view components (consume configuration via service)
- Environment files (hold compile-time configuration values)
- Remote Config service and infrastructure

**Views:**
- **Development View:** Configuration service structure, injection token patterns, provider hierarchy
- **Logical View:** Configuration flow from source to consumption, service encapsulation
- **Process View:** Build-time vs runtime configuration provision
- **Physical View:** Bundle size impact, lazy loading boundaries

**Stakeholders:**
- **Extension Engineers/Project Developers:** Implement and maintain project-specific configuration
- **Business Users/Analysts:** Configure runtime behavior via remote config dashboard
- **Journey Developers:** Define configuration interfaces and defaults
- **Project Teams:** Consume journeys and provide configuration in bundles

## Decision

### What we decided

**1. Configuration Types:**

Distinguish two types of configuration:

**Build-Time Configuration:**
- Configured in code (bundle module providers, environment files)
- Leverages TypeScript type safety
- Requires application compilation to change
- Configured once during initial project setup
- Can support multiple build flavors
- Can include environment variable placeholders for immutable builds

**Run-Time Configuration:**
- Configured via Remote Config service
- Can change without recompiling application
- Used for feature toggles, A/B testing, environment-specific behavior
- Accessible to business users via remote config dashboard
- Values cannot be derived statically at build time

**2. Configuration Interface Pattern:**

Every journey must define:

```typescript
// Configuration interface with typed properties
export interface BatchesJourneyConfiguration {
  enableManualBatches: boolean;
  pageSize: number;
  maxUploadSize: number;
}

// Injection token for DI
export const BatchesJourneyConfigurationToken = new InjectionToken<Partial<BatchesJourneyConfiguration>>(
  'BatchesJourneyConfiguration injection token',
);

// Default values object
export const configDefaults: BatchesJourneyConfiguration = {
  pageSize: 50,
  enableManualBatches: true,
  maxUploadSize: 10485760, // 10MB in bytes
};
```

**3. Configuration Service Pattern:**

```typescript
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

Key requirements:
- Configuration service is `@Injectable()` (not `providedIn: 'root'`)
- Constructor accepts `@Optional() @Inject(token)` for overrides
- Merges overrides with defaults using spread operator
- Provides getter methods for each configuration property
- All configuration options exposed via getters (for use as component inputs)

**4. Configuration Provision Location:**

**MUST: Provide in Bundle Module (Not App Module)**

```typescript
// ✅ CORRECT: In bundle module (maintains lazy loading)
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

```typescript
// ❌ INCORRECT: In app.module (causes eager loading)
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
    // This eagerly loads the journey, increasing main bundle size
    {
      provide: BatchesJourneyConfigurationToken,
      useValue: { pageSize: 20 },
    },
  ],
})
export class AppModule {}
```

**Rationale:** Providing configuration in app.module forces Angular to eagerly load the journey to resolve the injection token, increasing main bundle size. Bundle modules are lazy-loaded, so configuration provided there doesn't impact initial load.

**5. Journey Module forRoot Pattern:**

Journey modules must provide `forRoot()` static method:

```typescript
export class BatchesJourneyModule {
  static forRoot(data: { route: Route; [key: string]: any } = { route: defaultRoute }) {
    return {
      ngModule: BatchesJourneyModule,
      providers: [provideRoutes([data.route])],
    };
  }
}
```

This allows:
- Custom route configuration per project
- Future extensibility via additional properties
- Consistent journey initialization pattern

**6. Localizable Router Configuration:**

When router config requires localizable strings, use function wrappers for View Engine compatibility:

```typescript
// Define localized text as functions
export const tabs = {
  firstTab: () => $localize`First tab`,
  secondTab: () => $localize`Second tab`
};

// Use function references in router config
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

// In component, invoke function to get localized string
const title = this.route.snapshot.data['titleFn']();
```

**7. Run-Time Configuration with Remote Config:**

```typescript
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RemoteConfigModule, RemoteConfigService } from '@backbase/remote-config-ang';

export function applicationInitializer(
  remoteConfig: RemoteConfigService<RetailAppRemoteConfig>
) {
  return () => remoteConfig.fetchAndActivate();
}

export function configureMegaMenuPagesRendering(
  remoteConfig: RemoteConfigService<RetailAppRemoteConfig>,
): Partial<MegaMenuContainerConfig> {
  return {
    linksMap: (links: any[]) => {
      const hiddenPages: { [key: string]: boolean } = {
        'billpay,manage-payees': true,
        'self-service,manage-contacts': !remoteConfig.getValue('show_contacts'),
      };
      
      links.forEach((link) =>
        link.children?.forEach((child: any, index: number) => {
          if (hiddenPages[child.id]) link.children.splice(index, 1);
        }),
      );
      
      return links;
    },
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    RemoteConfigModule.forRoot({
      appName: 'bb-retail-app-ang',
      appVersion: '2021.10-beta',
      defaults: remoteConfigDefaults,
      disabled: false,
      projectName: 'backbase-retail-prototypes',
      serviceRoot: '/api/remote-config',
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: applicationInitializer,
      multi: true,
      deps: [RemoteConfigService],
    },
    {
      provide: MEGA_MENU_CONTAINER_CONFIG,
      useFactory: configureMegaMenuPagesRendering,
      deps: [RemoteConfigService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**8. Configuration Documentation Requirements:**

Every configuration option must be documented with:
- Property in configuration interface with type annotation
- JSDoc comment describing purpose and valid values
- Default value in configDefaults object
- Getter method in configuration service
- Entry in journey README documenting the option

### Rationale

**Type Safety Over ItemModel:**
- Configuration interfaces provide compile-time type checking and IDE autocomplete
- Eliminates runtime errors from configuration typos or wrong types
- Makes configuration options discoverable via TypeScript definitions
- Refactoring-friendly (renames propagate automatically)

**Injection Token Pattern:**
- Standard Angular pattern for providing configuration
- Allows projects flexibility in how they provide values (useValue, useFactory)
- Supports partial overrides (only specify what differs from defaults)
- Works seamlessly with Angular DI hierarchy

**Bundle Module Provision:**
- Maintains lazy loading and optimal bundle sizes
- Configuration co-located with journey initialization
- Clear separation: app.module for app concerns, bundle for journey concerns
- Prevents accidental eager loading of journeys

**Separation of Build-Time and Run-Time:**
- Build-time config for static project setup (rarely changes)
- Run-time config for dynamic behavior (feature flags, environment differences)
- Avoids rebuilding application for business-driven configuration changes
- Supports immutable build principles (build once, configure per environment)

**Getter Methods Pattern:**
- Encapsulates configuration access
- Allows future logic additions (validation, transformation, caching)
- Provides single source of truth for configuration consumption
- Simplifies passing configuration to child components as inputs

## Implementation details

### Technical approach

**Configuration Flow:**

1. **Journey Developer** defines configuration interface, token, defaults, and service
2. **Extension Engineer** provides configuration in bundle module
3. **Angular DI** injects configuration into journey's configuration service
4. **Configuration Service** merges overrides with defaults
5. **View Components** inject configuration service and use getters
6. **(Optional) Business User** changes runtime config via Remote Config dashboard

**File Structure:**

```
libs/batch-journey/
├── src/
│   ├── batches-journey.module.ts
│   ├── batches-journey-config.service.ts    // Configuration service
│   ├── batches-journey-config.interface.ts  // Interface, token, defaults
│   └── views/
│       └── batches-manager-list-view.component.ts
```

**Configuration Service Structure:**

```typescript
// batches-journey-config.interface.ts
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

```typescript
// batches-journey-config.service.ts
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

**Usage in View Components:**

```typescript
@Component({
  selector: 'bb-batches-list-view',
  templateUrl: './batches-list-view.component.html',
})
export class BatchesListViewComponent {
  pageSize$ = this.config.pageSize;
  
  constructor(
    private config: BatchesJourneyConfigurationService
  ) {}
}
```

**Bundle Module Configuration:**

```typescript
// apps/business-universal/src/bundles/batches-journey-bundle.module.ts
import { NgModule } from '@angular/core';
import { 
  BatchesJourneyModule,
  BatchesJourneyConfigurationToken 
} from '@backbase/batch-journey';

@NgModule({
  imports: [
    BatchesJourneyModule.forRoot({
      route: {
        path: 'batches',
        loadChildren: () => import('./views/batches-views.module')
          .then(m => m.BatchesViewsModule),
      },
    }),
  ],
  providers: [
    {
      provide: BatchesJourneyConfigurationToken,
      useValue: {
        pageSize: 20,
        enableManualBatches: false,
        maxUploadSize: 5242880, // 5MB
      },
    },
  ],
})
export class BatchesJourneyBundleModule {}
```

**Runtime Configuration with Factory:**

```typescript
// Bundle module with runtime configuration
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

### Standards compliance

- [x] Configuration uses TypeScript interfaces for type safety
- [x] Configuration provided in bundle modules (not app.module)
- [x] Injection tokens follow Angular DI best practices
- [x] Configuration services use getter methods for encapsulation
- [x] Default values provided for all configuration options
- [x] JSDoc documentation for all configuration properties
- [x] Partial overrides supported via `Partial<T>` type
- [x] `@Optional()` decorator used to prevent injection errors
- [x] Remote Config used for runtime configuration needs
- [x] Localizable strings wrapped in functions for View Engine compatibility

### Quality attributes addressed

| Quality Attribute | Requirement | How Decision Addresses It |
|-------------------|-------------|---------------------------|
| Type Safety | Compile-time validation of configuration | TypeScript interfaces with strict typing; no `any` types |
| Maintainability | Clear configuration structure | Standard pattern across all journeys; single service per journey |
| Performance | No bundle size increase | Configuration provided in bundle modules (lazy loaded) |
| Flexibility | Support multiple configuration sources | Injection token allows useValue, useFactory, or useExisting |
| Discoverability | Easy to find configuration options | Typed interfaces in public API; IDE autocomplete |
| Testability | Configuration mockable in tests | Injectable service easily mocked; overrides via providers |
| Extensibility | Projects can add custom config | Partial overrides allow extending defaults |
| Documentation | Self-documenting configuration | JSDoc comments; TypeScript types serve as documentation |

## Consequences

### Positive consequences
- **Type Safety:** Configuration errors caught at compile time, not runtime
- **IDE Support:** Autocomplete and refactoring work for configuration properties
- **Bundle Size:** Lazy loading maintained; no impact on main bundle
- **Flexibility:** Projects choose configuration source (environment files, remote config, factory)
- **Consistency:** Standard pattern across all journeys
- **Encapsulation:** Configuration service provides single access point
- **Defaults:** Sensible defaults reduce configuration burden for standard cases
- **Partial Overrides:** Only specify what differs from defaults
- **Testability:** Configuration easily mocked for unit tests
- **Documentation:** Interface serves as configuration documentation

### Negative consequences
- **Learning Curve:** Extension engineers must understand Angular DI patterns
- **Boilerplate:** Each journey requires interface, token, defaults, service, getters
- **Migration:** Existing ItemModel-based configuration requires migration
- **Getter Verbosity:** Must create getter for each configuration property
- **No Runtime Inspection:** Cannot easily view all configuration at runtime (unlike object)
- **Factory Complexity:** Runtime-dependent config requires factory functions

## Code review checklist

### Journey Configuration Structure

#### Configuration Interface
- [ ] **Interface Defined:** Journey has configuration interface (e.g., `XxxJourneyConfiguration`)
- [ ] **Typed Properties:** All properties have explicit types (no `any`)
- [ ] **JSDoc Comments:** Each property documented with purpose and valid values
- [ ] **Meaningful Names:** Property names are clear and self-explanatory
- [ ] **No Functions:** Interface contains data only (no methods or functions)
- [ ] **Optional Properties:** Only required properties are mandatory; others marked optional with `?`

#### Injection Token
- [ ] **Token Exported:** Injection token is exported from public API
- [ ] **Partial Type:** Token type is `Partial<XxxJourneyConfiguration>` for flexible overrides
- [ ] **Descriptive Name:** Token name ends with "Token" (e.g., `BatchesJourneyConfigurationToken`)
- [ ] **Generic Parameter:** InjectionToken uses configuration interface as generic parameter
- [ ] **Token Description:** InjectionToken constructor includes descriptive string

#### Default Configuration
- [ ] **Defaults Object:** `configDefaults` constant exported with all properties
- [ ] **All Properties Set:** Every interface property has a default value
- [ ] **No Magic Numbers:** Numeric defaults explained with comments if not obvious
- [ ] **Sensible Defaults:** Default values work for most common use cases
- [ ] **Constants Named:** Magic numbers extracted to named constants with explanations

#### Configuration Service
- [ ] **Injectable Decorator:** Service uses `@Injectable()` (not `providedIn: 'root'`)
- [ ] **Constructor Injection:** Accepts `@Optional() @Inject(token)` configuration overrides
- [ ] **Partial Override Type:** Constructor parameter typed as `Partial<XxxJourneyConfiguration>`
- [ ] **Merge Pattern:** Uses spread operator: `{ ...configDefaults, ...configOverrides }`
- [ ] **Private Config:** Configuration object stored as private property
- [ ] **Getter Methods:** All configuration properties exposed via public getters
- [ ] **No Setters:** Configuration is read-only (no setter methods)
- [ ] **Return Types:** Getter methods have explicit return type annotations
- [ ] **No Business Logic:** Service only stores and retrieves configuration (no complex logic)

### Configuration Provision

#### Bundle Module Provision
- [ ] **In Bundle Module:** Configuration provided in bundle module (NOT app.module)
- [ ] **Correct Token:** Uses journey's exported configuration token
- [ ] **Valid Values:** Provided values match interface types
- [ ] **Partial Override:** Only non-default values specified (don't repeat defaults)
- [ ] **UseValue or UseFactory:** Uses `useValue` for static config or `useFactory` for runtime-dependent
- [ ] **Factory Dependencies:** If `useFactory`, all dependencies listed in `deps` array
- [ ] **No Eager Loading:** Configuration provision doesn't cause journey to load eagerly

#### Remote Config Integration (if applicable)
- [ ] **APP_INITIALIZER:** Remote config fetched in APP_INITIALIZER before app starts
- [ ] **Factory Pattern:** Runtime config uses `useFactory` with RemoteConfigService dependency
- [ ] **Default Values:** Remote config values have sensible defaults if not set
- [ ] **Type Safety:** Remote config values cast to correct types
- [ ] **Boolean Handling:** Boolean flags handled correctly (not string 'true'/'false')

### Journey Module Pattern

#### forRoot Static Method
- [ ] **forRoot Exists:** Journey module has `static forRoot()` method
- [ ] **Route Parameter:** Accepts `route: Route` parameter with default value
- [ ] **Extensible Signature:** Parameter type is `{ route: Route; [key: string]: any }`
- [ ] **Returns ModuleWithProviders:** Return type is `ModuleWithProviders<XxxJourneyModule>`
- [ ] **Provides Routes:** Uses `provideRoutes([data.route])` in providers array
- [ ] **Returns Module:** Returns object with `ngModule` and `providers` properties

#### Localizable Router Config (if applicable)
- [ ] **Function Wrappers:** Localizable strings wrapped in functions: `() => $localize\`text\``
- [ ] **Function References:** Router data uses function references, not invocations
- [ ] **Invoked in Component:** Component invokes function to get localized string
- [ ] **Exported Constants:** Localized function wrappers exported as constants for reuse

### Configuration Usage in Components

#### View Component Consumption
- [ ] **Service Injection:** Configuration service injected via constructor
- [ ] **Getter Usage:** Uses configuration service getters (not accessing private properties)
- [ ] **No Direct Access:** Doesn't access configuration object directly
- [ ] **Template Binding:** Configuration values bound to template via properties or getters
- [ ] **Input Properties:** Configuration passed to child components as `@Input()` properties

### Configuration Documentation

#### Public API Documentation
- [ ] **Interface Exported:** Configuration interface exported from journey's public API
- [ ] **Token Exported:** Injection token exported from journey's public API
- [ ] **README Updated:** Journey README documents all configuration options
- [ ] **Examples Provided:** README includes configuration examples
- [ ] **Default Values Listed:** Documentation lists default value for each option
- [ ] **Migration Guide:** If changing config, migration guide provided for consumers

### TypeScript Best Practices

#### Type Safety
- [ ] **No Any Type:** No `any` types in configuration interface or service
- [ ] **Explicit Types:** All properties, parameters, and return values explicitly typed
- [ ] **Strict Null Checks:** Handles null/undefined appropriately
- [ ] **Enum Usage:** Uses enums for fixed sets of values (not string unions)
- [ ] **Type Guards:** Uses type guards if configuration has union types

#### Code Quality
- [ ] **Single Responsibility:** Configuration service only handles configuration
- [ ] **Immutability:** Configuration object not mutated after construction
- [ ] **No Side Effects:** Getter methods are pure (no side effects)
- [ ] **Consistent Naming:** Follows journey naming conventions
- [ ] **No Code Duplication:** Configuration pattern consistent with other journeys

### Testing

#### Configuration Service Tests
- [ ] **Default Values Test:** Test that defaults are used when no overrides provided
- [ ] **Override Test:** Test that overrides replace defaults
- [ ] **Partial Override Test:** Test that partial overrides merge with defaults
- [ ] **Getter Tests:** Test all getter methods return correct values
- [ ] **Null Override Test:** Test that `null` or `undefined` override uses default

#### Integration Tests
- [ ] **Bundle Module Test:** Test configuration provided correctly in bundle module
- [ ] **Component Test:** Test view components receive configuration via service
- [ ] **Mock Configuration:** Test components with mocked configuration service

### Common Anti-Patterns to Avoid

#### ❌ Configuration Provided in App Module
```typescript
// WRONG: Causes eager loading
@NgModule({
  imports: [BrowserModule],
  providers: [
    { provide: JourneyConfigToken, useValue: { ... } }
  ],
})
export class AppModule {}
```

#### ❌ No Default Values
```typescript
// WRONG: Every project must provide all values
constructor(
  @Inject(ConfigToken) config: JourneyConfiguration
) {
  this.config = config; // No defaults!
}
```

#### ❌ Direct Property Access
```typescript
// WRONG: No encapsulation
export class ConfigService {
  config: JourneyConfiguration; // Public!
}

// Component
this.config.config.pageSize // Direct access
```

#### ❌ Mutable Configuration
```typescript
// WRONG: Configuration can be changed
export class ConfigService {
  set pageSize(value: number) {
    this.config.pageSize = value; // Mutation!
  }
}
```

#### ❌ Configuration in providedIn Root
```typescript
// WRONG: Eagerly loaded, can't be overridden per bundle
@Injectable({ providedIn: 'root' })
export class ConfigService {}
```

#### ❌ No Type Safety
```typescript
// WRONG: No type checking
export const ConfigToken = new InjectionToken<any>('Config');
```

#### ❌ String-Based Config (No Interface)
```typescript
// WRONG: No type safety, no IDE support
useValue: {
  'page-size': 20, // Typos not caught
  'enableManualBatches': false
}
```

### Performance Considerations

#### Bundle Size
- [ ] **No Eager Loading:** Configuration doesn't cause journey to load in main bundle
- [ ] **Tree-shakeable:** Unused configuration options don't increase bundle size
- [ ] **No Large Defaults:** Default values don't include large objects or arrays

#### Runtime Performance
- [ ] **No Heavy Computation:** Getter methods don't perform expensive operations
- [ ] **Cached Values:** If expensive transformation needed, value cached after first access
- [ ] **No External Calls:** Getters don't make HTTP requests or async operations

## References

### Authoritative sources
- [Developing a Journey - Backbase Docs](https://community.backbase.com/documentation/foundation_angular/latest/develop_journey) - Journey development patterns
- [Remote Config Documentation](https://community.backbase.com/documentation/foundation_angular/latest/remote_config) - Runtime configuration
- [Web Apps Configuration](https://community.backbase.com/documentation/foundation_angular/latest/web_apps_configuration) - Configuration approaches

### Technical references
- [Angular Dependency Injection](https://angular.io/guide/dependency-injection) - DI patterns and InjectionToken
- [InjectionToken API](https://angular.io/api/core/InjectionToken) - InjectionToken usage
- [ModuleWithProviders](https://angular.io/api/core/ModuleWithProviders) - forRoot pattern
- [Angular Localization](https://angular.io/guide/i18n-common-prepare) - $localize usage
- [TypeScript Partial Type](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype) - Partial utility type
- [Immutable Web Apps](https://github.com/ImmutableWebApps/ng-immutable-example) - Immutable build principles

### Standards compliance
- [Angular Style Guide](https://angular.io/guide/styleguide) - Configuration service patterns
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html) - Interface design


