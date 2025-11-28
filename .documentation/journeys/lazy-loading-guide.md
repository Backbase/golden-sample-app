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

The route-level `providers` property wraps the journey routes and ensures dependency scoping:

```typescript
// Correct: Provider wrapping for lazy-loaded routes
@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      providers: [
        // These services are only available within this lazy-loaded feature
        TransferHttpService,
        TransferRouteTitleResolverService,
        {
          provide: TRANSFER_JOURNEY_CONFIG,
          useValue: transferConfig,
        },
      ],
      children: transactionsJourney(
        withConfig(config),
        withCommunicationService(CommunicationService)
      ),
    },
  ])],
})
export class TransferJourneyBundleModule {}
```

###### Real Example: Transfer Journey Bundle

Looking at the actual Transfer Journey structure:

```typescript
// transfer-journey-bundle.module.ts
import {
  transferJourney,
  withConfig,
  withCommunicationService,
} from '@backbase/transfer-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      providers: [
        TransferHttpService,
        TransferRouteTitleResolverService,
      ],
      children: transferJourney(
        withConfig({ /* configuration */ }),
        withCommunicationService(JourneyCommunicationService),
      ),
    },
  ])],
})
export class TransferJourneyBundleModule {}

export default TransferJourneyBundleModule;
```

###### What NOT to Do

This pattern will cause issues with lazy-loaded features:

```typescript
// WRONG: No provider wrapping
@NgModule({
  imports: [RouterModule.forChild(
    transferJourney(
      withConfig(config),
      withCommunicationService(CommunicationService)
    )
  )],
  providers: [TransferHttpService],  // Might not be available where needed
})
export class TransferJourneyBundleModule {}
```

Problems with this approach:
- Services may not be properly scoped to the lazy-loaded route
- Dependency injection might fail or use the wrong instance
- Services intended for the feature might leak to other parts of the app
- Route-level guards and resolvers may not work correctly

###### Provider Scoping Levels

Angular provides different levels of provider scoping:

```typescript
// 1. Application-level (providedIn: 'root')
// Used for: Global services, singleton services
@Injectable({ providedIn: 'root' })
export class GlobalService {}

// 2. Feature-module level (providers array in component/module)
// Used for: Feature-specific services
@NgModule({
  providers: [FeatureService],  // Scoped to this module
})
export class FeatureModule {}

// 3. Route-level (providers property in route config)
// Used for: Lazy-loaded feature services
const routes: Routes = [
  {
    path: 'feature',
    providers: [FeatureService],  // Scoped to this route tree
    children: [...]
  }
];
```

For lazy-loaded journeys, use route-level scoping (option 3).

###### Communication Service Pattern

The communication service is a special case that bridges multiple journeys:

```typescript
// transfer-journey defines a communication interface
export interface MakeTransferCommunicationService {
  onTransferComplete(data: TransferData): void;
}

export const MAKE_TRANSFER_JOURNEY_COMMUNICATION_SERVICE = 
  new InjectionToken<MakeTransferCommunicationService>(...);

// transactions-journey also expects a communication service
export interface TransactionsCommunicationService {
  onTransactionViewed(id: string): void;
}

export const TRANSACTIONS_JOURNEY_COMMUNICATION_SERVICE =
  new InjectionToken<TransactionsCommunicationService>(...);

// The bundle provides a single implementation that satisfies both
@NgModule({
  providers: [
    JourneyCommunicationService,
    {
      provide: MAKE_TRANSFER_JOURNEY_COMMUNICATION_SERVICE,
      useExisting: JourneyCommunicationService,
    },
    {
      provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERVICE,
      useExisting: JourneyCommunicationService,
    },
  ],
})
export class TransferJourneyBundleModule {}
```

###### Troubleshooting

**Problem**: NullInjectorError: No provider for MyService
**Solution**: Add `MyService` to the `providers` array in the route configuration

```typescript
{
  path: '',
  providers: [MyService],  // Add here
  children: journeyRoutes,
}
```

**Problem**: Service instances are not isolated between features
**Solution**: Ensure each feature bundle has route-level providers, not just root-level

```typescript
// Wrong: Root-level (shared across all routes)
// @NgModule({ providers: [MyService] })

// Correct: Route-level (per feature)
// {
//   path: '',
//   providers: [MyService],
//   children: [...]
// }
```

**Problem**: Changes to one journey's service affect another journey
**Solution**: Verify that services are provided at the route level, not globally

###### Best Practices

1. **Always wrap journey routes with a providers property**: This ensures proper dependency scoping
2. **Use feature-specific services**: Don't rely on globally-provided services within a feature
3. **Keep communication services at the app level**: Use interfaces and dependency injection to let features communicate
4. **Test provider scoping**: If two instances of the same journey exist, they should have independent services
5. **Document service dependencies**: Make it clear what providers each journey needs

###### Additional Resources

- [Journey Factory Patterns](.documentation/journeys/journey-factory-patterns.md)
- [Configure Journeys](.documentation/journeys/configure.md)
- [Communication Between Journeys](.documentation/journeys/communication-service.md)
- [Angular Route-level Providers](https://angular.io/guide/dependency-injection#providing-services-in-libraries)

