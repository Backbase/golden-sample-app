<!-- .documentation/journeys/journey-factory-patterns.md -->
##### Journey Factory Patterns !heading

Modern journey implementations in the application use the **journeyFactory** pattern - a well-established approach that separates concerns and makes code more maintainable. This guide explains how to structure journeys using this pattern.

> **Note:** The application has both legacy NgModule-based journeys and modern journeyFactory-based journeys. This guide focuses on the journeyFactory pattern, which is the recommended approach for new journeys.

###### The Four-File Pattern

Every modern journey using journeyFactory is organized into four main files that work together:

1. **Journey Definition File** (e.g., `libs/transactions-journey/src/lib/transactions-journey.ts`)
   - Contains the core `journeyFactory()` call with configuration tokens and default routes
   - Defines the configuration interface and default values
   - Creates simplified helper wrapper functions that simplify the API for consumers
   - These helpers handle defaults and make configuration easier
   - Exports the journey function and helper functions

2. **Bundle File** (e.g., `libs/journey-bundles/transactions/src/lib/transactions.bundle.ts`)
   - Imports the journey helpers from the definition file
   - Calls the journey function with the configured helpers
   - Creates an NgModule that imports `RouterModule.forChild(routes)`
   - Provides route-level services and configuration
   - Exported as the default export for lazy loading
   - This is what gets lazy-loaded by the route

3. **Route Declaration File** (e.g., `libs/journey-bundles/transactions/src/lib/route.ts`)
   - Creates a route object with metadata needed for lazy loading
   - Includes route guards (AuthGuard, EntitlementsGuard, etc.)
   - Includes route metadata (permissions, data, etc.)
   - Uses `loadChildren` to dynamically import the bundle
   - Exported as a named constant (e.g., `TRANSACTIONS_ROUTE`)

4. **Public API File** (e.g., `libs/journey-bundles/transactions/src/index.ts`)
   - Exports the route object for use in the app's route configuration
   - May also export navigation-related constants

###### Example: Transactions Journey Structure

This is a real-world example from the application showing the journeyFactory pattern in use.

```typescript
// libs/transactions-journey/src/lib/transactions-journey.ts - Journey Definition
import { journeyFactory } from '@backbase/foundation-ang/core';
import { Routes } from '@angular/router';

// Configuration Interface
export interface TransactionsJourneyConfig {
  pageSize: number;
  slimMode: boolean;
}

// Default Configuration
const defaultConfig: TransactionsJourneyConfig = {
  pageSize: 20,
  slimMode: true,
};

// Configuration Token
export const TRANSACTIONS_JOURNEY_CONFIG =
  new InjectionToken<TransactionsJourneyConfig>('TRANSACTIONS_JOURNEY_CONFIG', {
    providedIn: 'root',
    factory: () => defaultConfig,
  });

// Default Routes
const defaultRoutes: Routes = [
  {
    path: '',
    component: TransactionsViewComponent,
    resolve: { title: TransactionsRouteTitleResolverService },
  },
  {
    path: ':id',
    component: TransactionDetailsComponent,
    resolve: { title: TransactionsRouteTitleResolverService },
  },
];

// Journey Factory - Creates the journey and helper functions
export const {
  transactionsJourney,
  withConfig: withFullConfig,
  withCommunicationService: withFullCommunicationService,
} = journeyFactory({
  journeyName: 'transactionsJourney',
  defaultRoutes,
  tokens: {
    config: TRANSACTIONS_JOURNEY_CONFIG,
    communicationService: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
  },
});

// Helper Functions - Simplified API for consumers
export const withConfig = (config: Partial<TransactionsJourneyConfig>) =>
  withFullConfig({
    useValue: {
      ...defaultConfig,
      ...config,
    },
  });

export const withCommunicationService = (
  service: Type<TransactionsCommunicationService>
) =>
  withFullCommunicationService({
    useExisting: service,
  });
```

```typescript
// libs/journey-bundles/transactions/src/lib/transactions.bundle.ts - Bundle File
import {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  TRANSACTIONS_JOURNEY_CONFIG,
} from '@backbase/transactions-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { NgModule, Injectable, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Optional: Service to manage configuration logic
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

// Create the journey routes with all helpers configured
const routes: Routes = transactionsJourney(
  withConfig({
    pageSize: 10,
    slimMode: false,
  }),
  withCommunicationService(JourneyCommunicationService),
);

// NgModule that will be lazy-loaded
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

```typescript
// libs/journey-bundles/transactions/src/lib/route.ts - Route Declaration
import { EntitlementsGuard } from '@backbase/foundation-ang/entitlements';
import { AuthGuard } from '@backbase/shared/feature/auth';
import { SharedUserContextGuard } from '@backbase/shared/feature/user-context';
import { PERMISSIONS } from '@backbase/shared/util/permissions';

export const TRANSACTIONS_ROUTE = {
  path: 'transactions',
  loadChildren: () => import('./transactions.bundle'),
  data: {
    entitlements: PERMISSIONS.canViewTransactions,
  },
  canActivate: [AuthGuard, SharedUserContextGuard, EntitlementsGuard],
};
```

```typescript
// libs/journey-bundles/transactions/src/index.ts - Public API
export { TRANSACTIONS_ROUTE } from './lib/route';
```

###### Why This Pattern Works

- **Separation of Concerns**: Each file has one clear responsibility
- **Reusability**: Journeys can be tested and configured independently
- **Lazy Loading**: Bundle modules are only loaded when accessed
- **Type Safety**: Simplified wrappers provide better TypeScript support
- **Easy Composition**: App routing can just spread route objects: `[TRANSACTIONS_ROUTE, TRANSFER_ROUTE, ...]`
- **Tree Shaking**: Modern bundlers can better eliminate unused code

###### Existing Journey Examples

- [Transactions Journey (journeyFactory)](https://github.com/Backbase/golden-sample-app/tree/main/libs/transactions-journey) - Recommended pattern
- [Transfer Journey (Legacy)](https://github.com/Backbase/golden-sample-app/tree/main/libs/transfer-journey)
- [ACH Positive Pay Journey (Legacy)](https://github.com/Backbase/golden-sample-app/tree/main/libs/ach-positive-pay-journey)

###### Creating Helper Wrapper Functions

While the journey factory provides raw configuration functions, it's best practice to create simplified wrappers:

```typescript
// raw factory output:
export const { transactionsJourney, withConfig: withFullConfig } = journeyFactory({...});

// Create this (simplified wrapper):
export const withConfig = (config: Partial<TransactionsJourneyConfig>) =>
  withFullConfig({
    useValue: { ...defaultConfig, ...config },
  });

// Now consumers use the simpler API:
transactionsJourney(
  withConfig({ pageSize: 15 })  // Much easier! Only pass what you want to override
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
// apps/golden-sample-app/src/app/app-routes.ts
import { TRANSACTIONS_ROUTE } from '@backbase/journey-bundles/transactions';
import { TRANSFER_ROUTE } from '@backbase/journey-bundles/transfer';
import { ACH_POSITIVE_PAY_ROUTE } from '@backbase/journey-bundles/ach-positive-pay';

export const APP_ROUTES: Routes = [
  TRANSACTIONS_ROUTE,
  TRANSFER_ROUTE,
  ACH_POSITIVE_PAY_ROUTE,
  // ... more routes
];
```

Each route object is lazy-loaded and its bundle module handles all configuration and dependency injection for that feature.

###### Journey Factory Pattern in Use (Current Journeys)

| Journey | Pattern | Bundle File |
|---------|---------|------------|
| **Transactions** | journeyFactory ✓ | `libs/journey-bundles/transactions/src/lib/transactions.bundle.ts` |
| **Transfer** | Legacy NgModule | Uses `TransferJourneyShellModule.forRoot()` |
| **ACH Positive Pay** | Legacy NgModule | Uses `AchPositivePayJourneyShellModule.forRoot()` |
| **Custom Payment** | Legacy NgModule | Legacy pattern |
| **User Accounts** | Legacy NgModule | Legacy pattern |

The Transactions journey demonstrates the recommended journeyFactory pattern. Other journeys are gradually being migrated to this pattern.

