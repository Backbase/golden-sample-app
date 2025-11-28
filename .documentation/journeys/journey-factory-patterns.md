<!-- .documentation/journeys/journey-factory-patterns.md -->
##### Journey Factory Patterns !heading

Modern journey implementations in the application use a well-established three-file pattern that separates concerns and makes the code more maintainable. This guide explains each part and shows you how to structure your own journeys.

###### The Three-File Pattern

Every journey is organized into three main files that work together:

1. **Journey Definition File** (e.g., `transfer-journey.ts`, `transactions-journey.ts`)
   - Contains the core `journeyFactory()` call with configuration tokens and default routes
   - Creates simplified helper wrapper functions that simplify the API
   - These helpers handle defaults and make configuration easier for consumers

2. **Bundle Orchestration File** (e.g., `transfer-journey-bundle.module.ts`, `transactions-journey-bundle.module.ts`)
   - Imports the journey helpers from the definition file
   - Calls the journey function with the configured helpers
   - Wraps the result in a route with `providers` property for proper dependency scoping in lazy-loaded routes
   - Exported as the default export for lazy loading

3. **Route Declaration File** (e.g., `route.ts`)
   - Creates a route object with all metadata needed for lazy loading
   - Includes route guards (AuthGuard, EntitlementsGuard, etc.)
   - Includes route metadata (permissions, data, etc.)
   - Uses `loadChildren` to dynamically import the bundle
   - Exported as a named constant (e.g., `TRANSFER_ROUTE`)

4. **Public API File** (e.g., `index.ts`)
   - Exports the route object for use in the app's route configuration
   - May also export navigation-related constants

###### Example: Transfer Journey Structure

```typescript
// transfer-journey.ts - Journey Definition
// Contains journeyFactory setup with helper wrapper functions
export const { transferJourney, withConfig, withCommunicationService } = journeyFactory({
  journeyName: 'transferJourney',
  defaultRoutes: [...],
  tokens: {
    config: TRANSFER_JOURNEY_CONFIG,
    communicationService: TRANSFER_JOURNEY_COMMUNICATION_SERVICE,
  },
});

// Simplified wrapper for easier configuration
export const withTransferConfig = (config: Partial<TransferConfig>) =>
  withConfig({
    useValue: { ...defaultConfig, ...config },
  });
```

```typescript
// transfer-journey-bundle.module.ts - Bundle Orchestration
// Imports helpers and composes the journey with actual implementations
import { transferJourney, withTransferConfig, withCommunicationService } from '@backbase/transfer-journey';

const routes = transferJourney(
  withTransferConfig({ /* custom config */ }),
  withCommunicationService(JourneyCommunicationService),
);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    TransferHttpService,
    TransferRouteTitleResolverService,
  ],
})
export class TransferJourneyBundleModule {}

export default TransferJourneyBundleModule;
```

```typescript
// route.ts - Route Declaration
// Defines how this journey is lazy-loaded and what guards/metadata it has
export const TRANSFER_ROUTE = {
  path: 'transfer',
  loadChildren: () =>
    import('./transfer-journey-bundle.module').then(m => m.TransferJourneyBundleModule),
  canActivate: [AuthGuard, SharedUserContextGuard],
};
```

```typescript
// index.ts - Public API
// Exports the route for use in the app's routing configuration
export { TRANSFER_ROUTE } from './route';
```

###### Why This Pattern Works

- **Separation of Concerns**: Each file has one clear responsibility
- **Reusability**: Journeys can be tested and configured independently
- **Lazy Loading**: Bundle modules are only loaded when accessed
- **Type Safety**: Simplified wrappers provide better TypeScript support
- **Easy Composition**: App routing can just spread route objects: `[TRANSFER_ROUTE, ACH_ROUTE, ...]`

###### Existing Journey Examples

- [Transfer Journey](https://github.com/Backbase/golden-sample-app/tree/main/libs/journey-bundles/transfer)
- [Transactions Journey](https://github.com/Backbase/golden-sample-app/tree/main/libs/journey-bundles/transactions)
- [ACH Positive Pay Journey](https://github.com/Backbase/golden-sample-app/tree/main/libs/journey-bundles/ach-positive-pay)
- [Custom Payment Journey](https://github.com/Backbase/golden-sample-app/tree/main/libs/journey-bundles/custom-payment)

###### Creating Helper Wrapper Functions

While the journey factory provides raw configuration functions, it's best practice to create simplified wrappers:

```typescript
// Instead of this (raw factory output):
// const { withFullConfig } = journeyFactory({...});
// export withFullConfig;

// Create this (simplified wrapper):
export const withTransferConfig = (config: Partial<TransferConfig>) =>
  withFullConfig({
    useValue: { ...defaultConfig, ...config },
  });

// Now consumers use the simpler API:
transferJourney(
  withTransferConfig({ timeout: 5000 })  // Much easier!
)
```

Benefits of wrapper functions:
- **Easier to use**: Only pass properties you want to override
- **Type-safe**: TypeScript helps with Partial<Config> validation
- **Handles defaults**: Automatic merging with default values
- **Consistent API**: All journeys follow the same pattern
- **Encapsulation**: Internal implementation details are hidden

###### Real-World Usage in the App

All routes are composed together in the app's main routing file:

```typescript
// app-routes.ts
import { TRANSFER_ROUTE } from '@backbase/journey-bundles/transfer';
import { TRANSACTIONS_ROUTE } from '@backbase/journey-bundles/transactions';
import { ACH_POSITIVE_PAY_ROUTE } from '@backbase/journey-bundles/ach-positive-pay';

export const APP_ROUTES: Routes = [
  TRANSFER_ROUTE,
  TRANSACTIONS_ROUTE,
  ACH_POSITIVE_PAY_ROUTE,
  // ... more routes
];
```

Each route object is lazy-loaded and its bundle orchestration file handles all configuration and dependency injection for that feature.

