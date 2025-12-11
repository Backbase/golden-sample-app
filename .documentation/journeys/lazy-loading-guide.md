<!-- .documentation/journeys/lazy-loading-guide.md -->
##### Lazy Loading with Provider Scoping !heading

When a journey is lazy-loaded, it's critical to scope providers correctly to ensure dependencies are available only within that route's feature module. This guide explains why this matters and how to implement it correctly.

###### Why Provider Scoping Matters

Lazy-loaded routes should have their own set of providers to:

1. **Isolate Dependencies**: Services are only instantiated when the route is accessed, not when the app loads
2. **Save Memory**: Providers don't exist until needed - each lazy-loaded feature has its own scope
3. **Enable Multiple Instances**: If needed, different route instances can have their own service instances
4. **Prevent Cross-Feature Pollution**: Services from one journey don't leak into another

###### The Correct Pattern

In the modern journeyFactory pattern, providers are scoped at the **NgModule level** inside the bundle file. When the route is lazy-loaded, the entire module (with its providers) is loaded as a unit:

```typescript
// libs/journey-bundles/transactions/src/lib/transactions.bundle.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { transactionsJourney, withConfig, withCommunicationService } from '@backbase/transactions-journey';

// Create the journey routes with all helpers configured
const routes: Routes = transactionsJourney(
  withConfig({ pageSize: 10, slimMode: false }),
  withCommunicationService(JourneyCommunicationService),
);

// NgModule that encapsulates the journey
@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    // These services are ONLY available within this lazy-loaded feature
    TransactionsRouteTitleResolverService,
    TransactionsConfigService,
    {
      provide: TRANSACTIONS_JOURNEY_CONFIG,
      useFactory: (configService: TransactionsConfigService) => {
        return configService.getJourneyConfig();
      },
      deps: [TransactionsConfigService],
    },
  ],
})
export class TransactionsModule {}

export default TransactionsModule;
```

```typescript
// libs/journey-bundles/transactions/src/lib/route.ts
export const TRANSACTIONS_ROUTE = {
  path: 'transactions',
  loadChildren: () => import('./transactions.bundle'),  // Lazy-loads the entire module
  canActivate: [AuthGuard, SharedUserContextGuard, EntitlementsGuard],
};
```

When the route is accessed, Angular lazy-loads `TransactionsModule`, which brings its providers into scope.

###### Real Example: Transactions Journey Bundle

Looking at the actual Transactions Journey structure:

```typescript
// libs/journey-bundles/transactions/src/lib/transactions.bundle.ts
import { NgModule, Injectable, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  TRANSACTIONS_JOURNEY_CONFIG,
} from '@backbase/transactions-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { SHARED_JOURNEY_CONFIG } from '@backbase/shared/util/config';

// Service to manage configuration logic
@Injectable()
export class TransactionsConfigService {
  readonly #slimMode =
    inject(SHARED_JOURNEY_CONFIG, { optional: true })?.designSlimMode ?? false;

  getJourneyConfig() {
    return {
      pageSize: 10,
      slimMode: this.#slimMode,
    };
  }
}

// Create the routes
const routes: Routes = transactionsJourney(
  withConfig({ pageSize: 10, slimMode: false }),
  withCommunicationService(JourneyCommunicationService),
);

// Module that encapsulates the feature
@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    TransactionsConfigService,
    TransactionsRouteTitleResolverService,
    {
      provide: TRANSACTIONS_JOURNEY_CONFIG,
      useFactory: (configService: TransactionsConfigService) => {
        return configService.getJourneyConfig();
      },
      deps: [TransactionsConfigService],
    },
  ],
})
export class TransactionsModule {}

export default TransactionsModule;
```

The module providers are **only loaded** when the journey is accessed via the lazy-loaded route.

###### What NOT to Do

This pattern will cause issues with lazy-loaded features:

```typescript
// WRONG: No providers in the NgModule
@NgModule({
  imports: [RouterModule.forChild(
    transactionsJourney(
      withConfig(config),
      withCommunicationService(CommunicationService)
    )
  )],
})
export class TransactionsModule {}

// WRONG: Trying to use route-level providers (this is a legacy pattern)
@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      providers: [TransactionsRouteTitleResolverService],  // Might not work as expected
      children: [...]
    }
  ])],
})
export class TransactionsModule {}
```

Problems with these approaches:
- Services may not be properly scoped to the lazy-loaded journey
- Dependency injection might fail or use the wrong instance
- The bundle pattern won't provide services at the right time
- Module-level providers in NgModule are the correct scope for lazy-loaded features

###### Provider Scoping Levels in Angular

Angular provides different levels of provider scoping:

```typescript
// 1. Application-level (providedIn: 'root')
// Used for: Global services, singleton services
// Loaded: When the app starts
@Injectable({ providedIn: 'root' })
export class GlobalService {}

// 2. Feature-module level (NgModule providers)
// Used for: Feature-specific services in lazy-loaded modules
// Loaded: When the module is lazy-loaded
@NgModule({
  providers: [FeatureService],  // Scoped to this module
})
export class FeatureModule {}

// 3. Component level (component providers - Angular 14+)
// Used for: Component-specific services
// Loaded: When the component is created
@Component({
  providers: [ComponentService],  // Scoped to this component
})
export class MyComponent {}
```

For lazy-loaded journeys, use **NgModule-level providers** (option 2) as shown in the bundle files.

###### Communication Service Pattern

The communication service is a special case that bridges multiple journeys:

```typescript
// transactions-journey defines a communication interface
export interface TransactionsCommunicationService {
  onTransactionViewed(id: string): void;
}

export const TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE = 
  new InjectionToken<TransactionsCommunicationService>(...);

// The bundle provides an implementation
@NgModule({
  providers: [
    JourneyCommunicationService,
    {
      provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
      useExisting: JourneyCommunicationService,  // Use the app-level implementation
    },
  ],
})
export class TransactionsModule {}
```

This pattern allows journeys to communicate without tight coupling. See [Communication Between Journeys](./communication-service.md) for more details.

###### Troubleshooting

**Problem**: NullInjectorError: No provider for MyService
**Solution**: Add `MyService` to the `providers` array in the NgModule

```typescript
@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [MyService],  // Add here
})
export class MyJourneyModule {}
```

**Problem**: Service instances are not isolated between features
**Solution**: Ensure each feature bundle has its own providers in the NgModule

```typescript
// Correct: Module-level (per feature)
@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [MyService],  // Each lazy-loaded journey gets its own instance
})
export class MyJourneyModule {}
```

**Problem**: Changes to one journey's service affect another journey
**Solution**: Verify that services are provided at the module level, not globally

```typescript
// Wrong: Singleton at root (shared across all routes)
@Injectable({ providedIn: 'root' })
export class MyService {}

// Correct: Provided in module (per feature)
@NgModule({
  providers: [MyService],  // Scoped to this lazy-loaded module
})
export class MyJourneyModule {}
```

###### Best Practices

1. **Always provide services at the module level**: This ensures proper dependency scoping in lazy-loaded journeys
2. **Use feature-specific services**: Don't rely on globally-provided services (`providedIn: 'root'`) within a feature unless necessary
3. **Keep communication services at the app level**: Use interfaces and dependency injection to let features communicate
4. **Test provider scoping**: Verify that two instances of the same journey have independent services
5. **Document service dependencies**: Make it clear what providers each journey needs

###### Additional Resources

- [Journey Factory Patterns](./journey-factory-patterns.md)
- [Configure Journeys](./configure.md)
- [Communication Between Journeys](./communication-service.md)
- [Angular Lazy Loading](https://angular.io/guide/lazy-loading-ngmodules)
- [Angular Dependency Injection](https://angular.io/guide/dependency-injection)

