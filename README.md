<!-- NOTE: This README.md is auto-generated. Changes made directly to this file may be overwritten. Update the corresponding '.md' files in the '.documentation' folder instead. -->

# Table of Contents

  * [Golden Sample Angular App](#golden-sample-angular-app)
    * [Overview of the app](#overview-of-the-app)
      * [Components included in the app](#components-included-in-the-app)
    * [Prerequisites](#prerequisites)
    * [Authentication](#authentication)
      * [Important Info](#important-info)
      * [How to add authentication to your app](#how-to-add-authentication-to-your-app)
    * [User credentials](#user-credentials)
    * [API Sandbox](#api-sandbox)
      * [How to use API Sandbox endpoints](#how-to-use-api-sandbox-endpoints)
    * [Code scaffolding](#code-scaffolding)
      * [Generate an application](#generate-an-application)
      * [Generate a library](#generate-a-library)
      * [Generate a component](#generate-a-component)
    * [Load app on a development server](#load-app-on-a-development-server)
    * [Running the app with Mocks](#running-the-app-with-mocks)
    * [Build](#build)
    * [Tests](#tests)
      * [Running unit tests](#running-unit-tests)
      * [Running end-to-end tests](#running-end-to-end-tests)
    * [Understand your workspace](#understand-your-workspace)
    * [Working with Docker](#working-with-docker)
      * [Running with docker](#running-with-docker)
      * [Package as a runnable Docker container](#package-as-a-runnable-docker-container)
    * [Journeys](#journeys)
        * [Journey Factory Patterns](#journey-factory-patterns)
      * [Configure journeys](#configure-journeys)
        * [Lazy Loading with Provider Scoping](#lazy-loading-with-provider-scoping)
      * [Communication service or how to communicate between journeys](#communication-service-or-how-to-communicate-between-journeys)
      * [Simple examples of journeys](#simple-examples-of-journeys)
        * [Migrating from ShellModule to Journey Factory](#migrating-from-shellmodule-to-journey-factory)
      * [Custom component example](#custom-component-example)
    * [Analytics](#analytics)
  * [Further help](#further-help)


<!-- .documentation/main.md -->
<!-- .documentation/introduction/main.md -->
## Golden Sample Angular App

This golden sample provides examples of the code structure, configuration, and best practices for using the Backbase Angular tools.

<!-- .documentation/overview/main.md -->
### Overview of the app

This project is a complete reference implementation for building a new Angular single page application(SPA) with Backbase components and libraries. It includes best practices that front-end developers can use to build their own web applications.

This README provides an overview and set-up of the app, and further guidance is provided as comments in the code to further guide you.

The project uses the latest versions of the tools and libraries.

<!-- .documentation/components-included-in-app/main.md -->
#### Components included in the app

- **Auth module:** Defines authentication.
- **Locale selector for SPA:** Supports multiple languages. Check the example codes [here](https://github.com/Backbase/golden-sample-app/tree/main/apps/golden-sample-app/src/app/locale-selector)
- **Entitlements:** Configure [entitlements](https://backbase.io/documentation/web-devkit/journey-development-basics/use-access-control-journeys) for different scenarios. Check the example code in the [`app.component.html`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.component.html#L74) and [`entitlementsTriplets.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/services/entitlementsTriplets.ts)
- **Transactions Journey:** Configured in [`transactions.bundle.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transactions/src/lib/transactions.bundle.ts) (Modern journeyFactory pattern)
- **Transfer Journey:** Configured in [`transfer-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transfer/src/lib/transfer-journey-bundle.module.ts) (Legacy NgModule pattern)
- **ACH Positive Pay Journey:** Configured in [`ach-positive-pay-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/ach-positive-pay/src/lib/ach-positive-pay-journey-bundle.module.ts) (Legacy NgModule pattern)
- **Custom Payment Journey:** Configured in [`initiate-payment-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/custom-payment/src/lib/initiate-payment-journey-bundle.module.ts) (Legacy NgModule pattern)
- **User Accounts Journey:** Configured in [`user-accounts.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/user-accounts/src/lib/user-accounts.module.ts) (Legacy NgModule pattern)

<!-- .documentation/pre-requisites/main.md -->
### Prerequisites

- Install the following VSCode extensions:

  - [nrwl.angular-console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console): to find and run the Nx Commands.
  - [firsttris.vscode-jest-runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner): to isolated tests while you are developing.

- For AWS environments with specific WAF configurations, you may need to use `http://0.0.0.0:4200/` when accessing the app locally, in order to successfully authenticate.

- For you local development, setup backbase npm registry using the following commands:

  - Run the following command in your npm client. When prompted, provide your Artifactory login credentials and email:
    ```
      npm adduser --registry=https://repo.backbase.com/api/npm/npm-backbase/ --always-auth --scope=@backbase
    ```
    This will set your npm client to get all the packages belonging to @backbase scope from the registry specified above.
  - As a result of this command you can expect your npm client configuration file: ~/.npmrc file (in Windows %USERPROFILE%/.npmrc) to have following content:
    ```
      @backbase:registry=https://repo.backbase.com/api/npm/npm-backbase/
      //repo.backbase.com/api/npm/npm-backbase/:_authToken=<YOUR_UNIQUE_AUTHENTICATION_TOKEN>
    ```

<!-- .documentation/authentication/main.md -->
### Authentication

#### Important Info

The code that is used for authentication is not for production purposes, this is the example to understand the concepts lying under the hood.
Do not copy-paste anything related to the authentication to your banking application.

<!-- .documentation/authentication/how-to-add-authentication-to-your-app.md -->
#### How to add authentication to your app

We rely on <https://github.com/manfredsteyer/angular-oauth2-oidc>, check their documentation for more details.

We've provided the `AuthEventsHandlerService` via the `APP_INITIALIZER` which will handle auth events from the above 3rd party library. This service is an example implementation of how we expect applications to handle auth events. It includes the following default settings:

- The access token will be refreshed when it expires automatically.
- When token refresh, code exchange, or session errors occur the user is automatically logged out.
- A login using an invalid state parameter will be returned to the Auth server. This will likely result in a return to the application, however, in they will now have passed a valid state parameter.

We've also provided an example implementation of an `AuthInterceptor` in the application configuration. The purpose of this interceptor is to catch 401 errors and attempt to refresh the user's access token. If this refresh is successful the original request will be replayed with the new access token. If the refresh fails, or the original error was not a 401, then we surface the original error to the calling code.

The application uses a standalone configuration with providers set up in the `app.config.ts` file.

Follow the next steps to add authentication to your app:
* Set up the configuration in the `environment.ts` files.
  * Import [`AuthConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts#L6)
  * Create an [`authConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts#L34-L63) object and export it.
* Set up authentication in the `app.config.ts` file (standalone configuration).
  * Import authentication services from [`angular-oauth2-oidc`](https://github.com/manfredsteyer/angular-oauth2-oidc)
  * Import [`authConfig` and `environment`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts)
  * Add [`AuthEventsHandlerService`](https://github.com/Backbase/golden-sample-app/blob/main/libs/shared/feature/auth/src/lib/guard/auth.guard.ts) to the application providers via `APP_INITIALIZER`
  * Add [`AuthInterceptor`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.config.ts) to the `HTTP_INTERCEPTORS` provider
  * Configure [`OAuthStorage`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.config.ts) to use `localStorage` for token storage
* Secure routes by setting your route guards.
  * Use [`AuthGuard`](https://github.com/Backbase/golden-sample-app/blob/main/libs/shared/feature/auth/src/lib/guard/auth.guard.ts#L10-L41) in routes you want to secure
  * Add [`canActivate`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app-routes.ts#L21) property with `AuthGuard` to the routes you want to protect. See [`app-routes.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app-routes.ts) for examples.


<!-- .documentation/user-credentials/main.md -->
### User credentials

Credentials to login can be found [here](https://backbase.io/ebp-sandbox/user-credentials).

<!-- .documentation/api-sandbox/main.md -->
### API Sandbox

<!-- .documentation/api-sandbox/how-to-use-api-sandbox.md -->
#### How to use API Sandbox endpoints

Since API Sandbox requires an individual API Key to allow requests to go through the services, you need to request a new API Key for yourself. You can do this by sending an email to `api-sandbox-support@backbase.com`.

When you receive your API Key, you can add it to your environment file. For example, in `environment.ts`:

```ts
export const environment: Environment = {
  apiSandboxKey: 'YOUR_API_KEY'
}
```

<!-- .documentation/generate/main.md -->
### Code scaffolding

<!-- .documentation/generate/generate-an-application.md -->
#### Generate an application

Run `ng g @nx/angular:app my-app` to generate an application.

> You can also use Nx Console to generate libraries as well.

When using [Nx](https://nx.dev/), you can create multiple applications and libraries in the same workspace.

After the app has been generated, use tags in `nx.json` and `.eslintrs.json` to impose constraints on the dependency graph. [Nx Tags](https://nx.dev/structure/monorepo-tags)

<!-- .documentation/generate/generate-a-library.md -->
#### Generate a library

Run `ng g @nx/angular:lib my-lib` to generate a library.

> You can also use Nx Console to generate libraries as well.

Libraries can be shared across libraries and applications. You can import them from `@backbase/mylib`.

<!-- .documentation/generate/generate-a-component.md -->
#### Generate a component

Run `ng g component my-component --project=my-app` to generate a new component.


<!-- .documentation/load-app-development/main.md -->
### Load app on a development server

Run `npm run start` for a dev server. Navigate to <http://0.0.0.0:4200/>. The app will automatically reload if you change any of the source files.

<!-- .documentation/run-app/main.md -->
### Running the app with Mocks

Run `npm run start:mocks` for running the application locally with mocks.

<!-- .documentation/build/main.md -->
### Build

To run the project on a development server, run
`ng build my-app

The build artifacts are stored in the `dist/` directory.

To build the app to production, use the `--prod` flag.

<!-- .documentation/tests/main.md -->
### Tests

<!-- .documentation/tests/running-unit-tests.md -->
#### Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

<!-- .documentation/tests/running-e2e-tests.md -->
#### Running end-to-end tests

Run `npm run e2e` to run the default e2e tests suite that runs on the CI.

Use one of the following commands to run a different set of tests:

- `npm run e2e-test-mocks` - run all the tests against mocks data,
- `npm run e2e-test-sndbx-all` - run all the tests against sandbox env,
- `npm run e2e-test-sndbx-ci` - run sandbox CI tests suite,
- `npm run e2e-test-responsive` - run only visual mobile tests.

For more information on playwright tests see [playwright-readme.md](/apps/golden-sample-app-e2e/playwright-readme.md).


<!-- .documentation/understand-your-workspace/main.md -->
### Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

<!-- .documentation/docker/main.md -->
### Working with Docker

<!-- .documentation/docker/running-with-docker.md -->
#### Running with docker

Run `npm run build:start:docker` to startup the docker container with the application

<!-- .documentation/docker/package-as-a-runnable-docker-container.md -->
#### Package as a runnable Docker container

Run `ng build:docker` (after a successful build with `ng build`) to create a Docker image. Start a new container with `npm run start:docker`.


<!-- .documentation/journeys/main.md -->
### Journeys

<!-- .documentation/journeys/journey-factory-patterns.md -->
##### Journey Factory Patterns

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


<!-- .documentation/journeys/configure.md -->
#### Configure journeys

Journey configuration differs depending on whether you're using the **modern journeyFactory pattern** or the **legacy NgModule pattern**.

###### Modern Pattern (journeyFactory)

**Example**: [Transactions Journey](https://github.com/Backbase/golden-sample-app/tree/main/libs/transactions-journey)

In the journey definition file, configuration is handled through helper functions:

```typescript
// libs/transactions-journey/src/lib/transactions-journey.ts
export interface TransactionsJourneyConfig {
  pageSize: number;
  slimMode: boolean;
}

const defaultConfig: TransactionsJourneyConfig = {
  pageSize: 20,
  slimMode: true,
};

// Helper function for configuration
export const withConfig = (config: Partial<TransactionsJourneyConfig>) =>
  withFullConfig({
    useValue: {
      ...defaultConfig,
      ...config,
    },
  });
```

In the bundle file, you pass configuration to the journey:

```typescript
// libs/journey-bundles/transactions/src/lib/transactions.bundle.ts
const routes: Routes = transactionsJourney(
  withConfig({
    pageSize: 10,
    slimMode: false,
  }),
  withCommunicationService(JourneyCommunicationService),
);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
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
```

###### Legacy Pattern (ShellModule.forRoot)

**Examples**: [Transfer Journey](https://github.com/Backbase/golden-sample-app/tree/main/libs/transfer-journey), [ACH Positive Pay Journey](https://github.com/Backbase/golden-sample-app/tree/main/libs/ach-positive-pay-journey)

In the journey shell module, configuration is provided through `forRoot()`:

```typescript
// libs/transfer-journey/src/lib/transfer-journey-shell.module.ts
@NgModule({...})
export class TransferJourneyShellModule {
  static forRoot(
    data: { [key: string]: unknown; route: Route } = { route: defaultRoute }
  ): ModuleWithProviders<TransferJourneyShellModule> {
    return {
      ngModule: TransferJourneyShellModule,
      providers: [provideRoutes([data.route])],
    };
  }
}
```

In the bundle, you use the `forRoot()` method:

```typescript
// libs/journey-bundles/transfer/src/lib/transfer-journey-bundle.module.ts
@NgModule({
  imports: [TransferJourneyShellModule.forRoot()],
  providers: [
    {
      provide: MakeTransferJourneyConfiguration,
      useFactory: (): MakeTransferJourneyConfiguration => ({
        maskIndicator: false,
        maxTransactionAmount: 100,
      }),
    },
  ],
})
export class TransferJourneyBundleModule {}
```

###### Configuration Best Practices

1. **Define a configuration interface** that matches your journey's needs
2. **Provide sensible defaults** so journeys work without configuration
3. **Use factory functions** to merge defaults with custom values
4. **Allow runtime configuration** through services when needed
5. **Document configuration options** so consumers know what can be customized
<!-- .documentation/journeys/lazy-loading-guide.md -->
##### Lazy Loading with Provider Scoping

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


<!-- .documentation/journeys/communication-service.md -->
#### Communication service or how to communicate between journeys

Communication between journeys allows them to work together without tight coupling. This pattern works the same way for both modern journeyFactory and legacy NgModule patterns.

###### The Communication Pattern

There are 3 key parts of the communication chain:

1. **Source Journey** - Defines what data/signals it can send
   - Defines a communication interface and exports it
   - Example: [Make Transfer Communication](https://github.com/Backbase/golden-sample-app/blob/main/libs/transfer-journey/internal/data-access/src/lib/services/make-transfer-communication/make-transfer-communication.service.ts)

2. **Destination Journey** - Defines what data/signals it expects to receive
   - Also defines a communication interface matching what it expects
   - Example: [Transactions Journey Communication](https://github.com/Backbase/golden-sample-app/blob/main/libs/transactions-journey/internal/data-access/src/lib/services/transactions-journey-communication/transactions-journey-communication.service.ts)

3. **Application Level** - Provides the actual implementation
   - Implements both interfaces (or abstract classes) from source and destination journeys
   - Bridges the two journeys together
   - Must be provided to the journey bundles to avoid breaking lazy loading
   - Example: [Journey Communication Service](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/services/journey-communication.service.ts)

###### Implementation Example (journeyFactory Pattern)

```typescript
// libs/transfer-journey/internal/data-access/.../make-transfer-communication.service.ts
// SOURCE: Defines what data the transfer journey can send
export interface MakeTransferCommunicationService {
  onTransferComplete(data: TransferData): void;
}

export const MAKE_TRANSFER_JOURNEY_COMMUNICATION_SERVICE = 
  new InjectionToken<MakeTransferCommunicationService>(...);
```

```typescript
// libs/transactions-journey/internal/data-access/.../transactions-journey-communication.service.ts
// DESTINATION: Defines what data transactions journey expects to receive
export interface TransactionsCommunicationService {
  onTransactionViewed(id: string): void;
}

export const TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE =
  new InjectionToken<TransactionsCommunicationService>(...);
```

```typescript
// apps/golden-sample-app/src/app/services/journey-communication.service.ts
// IMPLEMENTATION: Implements both interfaces at the app level
@Injectable({ providedIn: 'root' })
export class JourneyCommunicationService
  implements MakeTransferCommunicationService, TransactionsCommunicationService
{
  onTransferComplete(data: TransferData): void {
    // Handle transfer completion
    console.log('Transfer completed:', data);
    // Maybe trigger navigation to transactions
  }

  onTransactionViewed(id: string): void {
    // Handle transaction view
    console.log('Transaction viewed:', id);
  }
}
```

```typescript
// libs/journey-bundles/transactions/src/lib/transactions.bundle.ts
// CONFIGURATION: Provide the implementation to the journey
@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    TransactionsRouteTitleResolverService,
    {
      provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
      useExisting: JourneyCommunicationService,  // Use app-level implementation
    },
  ],
})
export class TransactionsModule {}
```

**Important**: Always provide the communication service in the **journey bundle** (not in a global provider). This ensures proper scoping with lazy loading and allows each journey instance to have access to the service.

###### Important Notes

- The communication service from the application level should be provided to the journeys modules in the **bundle files** (to avoid breaking lazy loading)
- Don't forget to provide the service with `useExisting` rather than `useClass` to reference the same instance
- Keep the communication service logic at the app level, not inside journeys
- Use dependency injection and interfaces to keep journeys loosely coupled

###### More Information

For theoretical understanding and best practices, check [Understand communication between journeys](https://backbase.io/documentation/web-devkit/journey-development-advanced/communication-between-journeys) in the Backbase documentation.

<!-- .documentation/journeys/simple-examples.md -->
#### Simple examples of journeys

###### Modern Pattern Examples (journeyFactory)

- **Transactions Journey** ✓ Recommended
  - Pattern: journeyFactory
  - [Journey Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/transactions-journey/src/lib/transactions-journey.ts)
  - [Bundle File](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transactions/src/lib/transactions.bundle.ts)
  - [Route Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transactions/src/lib/route.ts)
  - [How it works](https://github.com/Backbase/golden-sample-app/tree/main/libs/journey-bundles/transactions/src/lib)

###### Legacy Pattern Examples (NgModule)

- **Transfer Journey**
  - Pattern: ShellModule.forRoot()
  - [Journey Library](https://github.com/Backbase/golden-sample-app/tree/main/libs/transfer-journey)
  - [Shell Module](https://github.com/Backbase/golden-sample-app/blob/main/libs/transfer-journey/src/lib/transfer-journey-shell.module.ts)
  - [Bundle Configuration](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transfer/src/lib/transfer-journey-bundle.module.ts)
  - [Route Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transfer/src/lib/route.ts)

- **ACH Positive Pay Journey**
  - Pattern: ShellModule.forRoot()
  - [Bundle Configuration](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/ach-positive-pay/src/lib/ach-positive-pay-journey-bundle.module.ts)
  - [Route Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/ach-positive-pay/src/lib/route.ts)

- **Custom Payment Journey**
  - Pattern: ShellModule.forRoot()
  - [Bundle Configuration](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/custom-payment/src/lib/initiate-payment-journey-bundle.module.ts)
  - [Route Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/custom-payment/src/lib/route.ts)

- **User Accounts Journey**
  - Pattern: ShellModule.forRoot()
  - [Bundle Configuration](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/user-accounts/src/lib/user-accounts.module.ts)
  - [Route Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/user-accounts/src/lib/route.ts)

###### Recommended Approach

For new journeys, use the **journeyFactory pattern** demonstrated by the Transactions Journey. It provides:
- Better type safety
- Clearer separation of concerns
- Easier configuration
- Better tree-shaking by bundlers

See [Journey Factory Patterns](./journey-factory-patterns.md) for more details on implementing new journeys.

<!-- .documentation/journeys/migration-guide.md -->
##### Migrating from ShellModule to Journey Factory

This guide explains how to migrate an existing journey from the legacy `ShellModule.forRoot()` pattern to the modern `journeyFactory` pattern.

###### Why Migrate?

The `journeyFactory` pattern offers several advantages:

- **Type Safety**: Better TypeScript support and compile-time error detection
- **Simpler Configuration**: Less boilerplate, easier helper functions
- **Better Tree Shaking**: Modern bundlers can eliminate more unused code
- **Clearer Intent**: Configuration is explicit and easier to understand
- **Future Proof**: Aligned with Angular's direction toward standalone components

###### Migration Steps

####### Step 1: Analyze the Current Implementation

First, understand your current journey structure:

```typescript
// Current legacy pattern:
// libs/transfer-journey/src/lib/transfer-journey-shell.module.ts

@NgModule({
  // ... declarations, imports, etc.
})
export class TransferJourneyShellModule {
  static forRoot(
    data: { [key: string]: unknown; route: Route } = { route: defaultRoute }
  ): ModuleWithProviders<TransferJourneyShellModule> {
    return {
      ngModule: TransferJourneyShellModule,
      providers: [provideRoutes([data.route])],
    };
  }
}
```

Identify:
1. The default routes
2. Configuration tokens and interfaces
3. Services that should be configurable
4. Components and imports

####### Step 2: Create the Journey Definition File

Create a new journey definition file using `journeyFactory`:

```typescript
// libs/transfer-journey/src/lib/transfer-journey.ts
import { journeyFactory } from '@backbase/foundation-ang/core';
import { Routes, InjectionToken } from '@angular/router';

// 1. Define your configuration interface
export interface TransferJourneyConfig {
  maskIndicator: boolean;
  maxTransactionAmount: number;
  slimMode: boolean;
}

// 2. Define default values
const defaultConfig: TransferJourneyConfig = {
  maskIndicator: false,
  maxTransactionAmount: 100,
  slimMode: false,
};

// 3. Create configuration token
export const TRANSFER_JOURNEY_CONFIG =
  new InjectionToken<TransferJourneyConfig>('TRANSFER_JOURNEY_CONFIG', {
    providedIn: 'root',
    factory: () => defaultConfig,
  });

// 4. Define your routes
const defaultRoutes: Routes = [
  {
    path: '',
    component: TransferJourneyComponent,
    children: [
      {
        path: 'make-transfer',
        component: MakeTransferViewComponent,
        resolve: { title: MakeTransferRouteTitleResolverService },
      },
      // ... more routes
    ],
  },
];

// 5. Create the journey factory
export const {
  transferJourney,
  withConfig: withFullConfig,
  withCommunicationService: withFullCommunicationService,
} = journeyFactory({
  journeyName: 'transferJourney',
  defaultRoutes,
  tokens: {
    config: TRANSFER_JOURNEY_CONFIG,
    communicationService: TRANSFER_JOURNEY_COMMUNICATION_SERVICE,
  },
});

// 6. Create helper functions for consumers
export const withTransferConfig = (config: Partial<TransferJourneyConfig>) =>
  withFullConfig({
    useValue: {
      ...defaultConfig,
      ...config,
    },
  });

export const withCommunicationService = (
  service: Type<MakeTransferCommunicationService>
) =>
  withFullCommunicationService({
    useExisting: service,
  });
```

####### Step 3: Update the Bundle File

Refactor your bundle to use the journey factory:

```typescript
// libs/journey-bundles/transfer/src/lib/transfer-journey-bundle.module.ts - BEFORE
@NgModule({
  imports: [TransferJourneyShellModule.forRoot()],
  providers: [
    {
      provide: MakeTransferJourneyConfiguration,
      useFactory: (): MakeTransferJourneyConfiguration => ({
        maskIndicator: false,
        maxTransactionAmount: 100,
      }),
    },
    { provide: MakeTransferCommunicationService, useExisting: JourneyCommunicationService },
  ],
})
export class TransferJourneyBundleModule {}
```

```typescript
// libs/journey-bundles/transfer/src/lib/transfer-journey-bundle.module.ts - AFTER
import { transferJourney, withTransferConfig, withCommunicationService } from '@backbase/transfer-journey';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Create the routes with configuration
const routes: Routes = transferJourney(
  withTransferConfig({
    maskIndicator: false,
    maxTransactionAmount: 100,
  }),
  withCommunicationService(JourneyCommunicationService),
);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    MakeTransferAccountHttpService,
    MakeTransferRouteTitleResolverService,
    MakeTransferPermissionsService,
  ],
})
export class TransferJourneyBundleModule {}

export default TransferJourneyBundleModule;
```

####### Step 4: Update the Route Declaration

Keep the route declaration similar, but update the import path:

```typescript
// libs/journey-bundles/transfer/src/lib/route.ts
export const TRANSFER_ROUTE = {
  path: 'transfer',
  loadChildren: () =>
    import('./transfer-journey-bundle.module').then(
      (m) => m.TransferJourneyBundleModule
    ),
  canActivate: [AuthGuard, SharedUserContextGuard],
};
```

####### Step 5: Update Exports

Update the public API to export the new journey function:

```typescript
// libs/transfer-journey/src/index.ts
export * from './lib/transfer-journey-shell.module';
export {
  transferJourney,
  withTransferConfig,
  withCommunicationService,
  TransferJourneyConfig,
  TRANSFER_JOURNEY_CONFIG,
} from './lib/transfer-journey';
export { MakeTransferCommunicationService } from '@backbase/transfer-journey/internal/data-access';
```

####### Step 6: Update the Bundle Exports

Ensure the bundle exports the module as default:

```typescript
// libs/journey-bundles/transfer/src/index.ts
export { TRANSFER_ROUTE } from './lib/route';
```

The bundle file should export as default:

```typescript
// At end of transfer-journey-bundle.module.ts
export default TransferJourneyBundleModule;
```

###### Migration Checklist

- [ ] Create journey definition file with `journeyFactory`
- [ ] Define configuration interface and defaults
- [ ] Create configuration token with `InjectionToken`
- [ ] Export journey function and helper functions
- [ ] Update bundle file to use journey factory
- [ ] Move configuration from `forRoot()` to helper functions
- [ ] Update route declaration (usually no changes needed)
- [ ] Update public API exports
- [ ] Ensure bundle exports module as default
- [ ] Test lazy loading works correctly
- [ ] Test configuration overrides work
- [ ] Test communication service integration
- [ ] Update unit tests

###### Testing Your Migration

After migration, verify:

1. **Lazy Loading** - Route loads correctly when accessed
2. **Configuration** - Custom configuration is applied correctly
3. **Communication** - Journey communication service works
4. **Services** - All services are available within the journey
5. **Type Safety** - TypeScript compilation succeeds

```typescript
// Test that the journey can be imported and configured
import { transferJourney, withTransferConfig } from '@backbase/transfer-journey';

const routes = transferJourney(
  withTransferConfig({
    maskIndicator: true,
    maxTransactionAmount: 500,
  })
);

// Verify routes are created correctly
expect(routes).toBeDefined();
expect(routes.length).toBeGreaterThan(0);
```

###### Common Issues

**Issue**: "Cannot find module 'journeyFactory'"
**Solution**: Ensure you have `@backbase/foundation-ang/core` installed and imported correctly

**Issue**: Services not available in lazy-loaded journey
**Solution**: Ensure services are provided in the NgModule's `providers` array in the bundle file

**Issue**: Configuration not being applied
**Solution**: Verify helper functions are correctly merging with defaults and passing to `withFullConfig`

**Issue**: Type errors in configuration
**Solution**: Ensure your configuration interface and defaults match exactly, including optional properties

###### Additional Resources

- [Journey Factory Patterns](./journey-factory-patterns.md)
- [Configure Journeys](./configure.md)
- [Lazy Loading with Provider Scoping](./lazy-loading-guide.md)
- [Communication Between Journeys](./communication-service.md)


<!-- .documentation/journeys/custom-component.md -->
#### Custom component example

<!-- .documentation/journeys/custom-payment-component-guide.md -->

### How to Add a Custom Component to Initiate Payments Journey

This guide shows how to create a custom component and integrate it with the Initiate Payments Journey.

###### Overview

The Initiate Payments Journey is fully customizable through TypeScript configuration. This example demonstrates how to replace the out-of-the-box `initiator` component (the debit/source account selector) with a custom component.

The same principles apply to replacing other configuration groups like `counterparty`, `remittanceInfo`, and `schedule`, or adding new `additions` groups.

###### Why Create a Custom Component?

The out-of-the-box components may not meet all business requirements. Custom components allow you to:
- Implement custom validation logic
- Add business-specific account filtering
- Customize the UI/UX for your use case
- Integrate with custom services or APIs
- Support specialized payment scenarios

###### Key Requirement: Implement PaymentFormField

Your custom component **MUST** implement the `PaymentFormField` interface from `@backbase/initiate-payment-journey-ang`:

```typescript
import { PaymentFormField } from '@backbase/initiate-payment-journey-ang';

export class YourCustomComponent implements PaymentFormField {
  // Required properties
  config!: PaymentFormFieldConfig;
  group!: FormGroup;
  options!: PaymentFormFieldOptions;
}
```

This interface ensures your component integrates properly with the payment journey business logic.

###### Real Example: Custom Initiator Component

Here's the actual `InitiatorComponent` from the application:

**Component File** (`initiator.component.ts`):

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  InitiatorFields,
  PaymentFormField,
  PaymentFormFieldConfig,
  PaymentFormFieldOptions,
} from '@backbase/initiate-payment-journey-ang';

import { AccountSelectorItem } from './initiator.model';
import { InitiatorService } from './initiator.service';

@Component({
  selector: 'bb-payment-initiator',
  template: `
    <div [ngClass]="options.cssClasses || ''">
      <label class="d-block">
        <span> {{ options.label }} </span>
      </label>
      <bb-account-selector-ui
        #accountSelector
        placeholder="{{ options.placeholder }}"
        [items]="debitAccounts$ | async"
        [markFirst]="true"
        [highlight]="false"
        [disableScrollEnd]="false"
        [closeOnSelect]="true"
        [filterItems]="true"
        [dropdownPosition]="'bottom'"
        [multiple]="false"
        [required]="true"
        (change)="selectItem($any($event))"
        (blur)="onBlur()"
      >
      </bb-account-selector-ui>

      @if (group?.touched && group?.invalid) {
      <div class="bb-input-validation-message">
        {{ requiredMessage }}
      </div>
      }
    </div>
  `,
  providers: [InitiatorService],
  standalone: false,
})
// The custom component MUST implement PaymentFormField
export class InitiatorComponent implements OnInit, PaymentFormField {
  private readonly initiatorService: InitiatorService =
    inject(InitiatorService);
  
  // Required by PaymentFormField interface
  config!: PaymentFormFieldConfig;
  group!: FormGroup;
  options!: PaymentFormFieldOptions;

  // Component-specific properties
  debitAccounts$;
  requiredMessage!: string;

  // Form controls based on InitiatorDetails interface
  private initiatorFormControls: InitiatorFields[] = [
    InitiatorFields.id,
    InitiatorFields.name,
    InitiatorFields.accountNumber,
    InitiatorFields.currency,
  ];

  constructor() {
    // Load debit accounts from service
    this.debitAccounts$ = this.initiatorService.arrangements$;
  }

  ngOnInit() {
    this.setupInitiatorFormGroup(this.initiatorFormControls);
    this.requiredMessage = this.getValidationMessage('required');
  }

  onBlur() {
    this.group.markAllAsTouched();
  }

  selectItem(account: AccountSelectorItem) {
    // Update form with selected account details
    this.group.patchValue({
      [InitiatorFields.id]: account.id,
      [InitiatorFields.name]: account.name,
      [InitiatorFields.accountNumber]: account.number,
      [InitiatorFields.currency]: account.currency,
    });

    this.group.markAllAsTouched();
    this.group.markAsDirty();
  }

  private getValidationMessage(key: string): string {
    return (
      this.options?.validationMessages?.find((field: any) => field.name === key)
        ?.message || ''
    );
  }

  private setupInitiatorFormGroup(fields: InitiatorFields[]) {
    fields.forEach((field: InitiatorFields) => {
      this.group.addControl(
        field,
        new FormControl(
          '',
          this.options.validators || [],
          this.options.asyncValidators || []
        )
      );
    });
  }
}
```

**Service File** (`initiator.service.ts`):

```typescript
// Fetch arrangements/debit accounts from Banking Services
@Injectable()
export class InitiatorService {
  private http = inject(HttpClient);

  arrangements$ = this.http.get<AccountSelectorItem[]>('/api/arrangements');
}
```

**Model File** (`initiator.model.ts`):

```typescript
export interface AccountSelectorItem {
  id: string;
  name: string;
  number: string;
  currency: string;
}
```

###### Integration: Using the Custom Component

To use your custom component in the payment configuration, provide it in the bundle module:

**Bundle Module** (`initiate-payment-journey-bundle.module.ts`):

```typescript
import { INITIATE_PAYMENT_CONFIG } from '@backbase/initiate-payment-journey-ang';
import { InitiatorComponent } from './components/initiator/initiator.component';

@NgModule({
  imports: [InitiatorComponent, /* other imports */],
  providers: [
    {
      provide: INITIATE_PAYMENT_CONFIG,
      useValue: {
        fields: [
          {
            type: 'initiator',
            component: InitiatorComponent, // Your custom component
          },
          // Other payment configuration groups
        ],
      },
    },
  ],
})
export class InitiatePaymentJourneyBundleModule {}
```

###### Important Considerations

**1. Form Control Names**

Your form controls must match the interface expected by the journey:

```typescript
// For initiator, use InitiatorFields
private initiatorFormControls: InitiatorFields[] = [
  InitiatorFields.id,
  InitiatorFields.name,
  InitiatorFields.accountNumber,
  InitiatorFields.currency,
];

// For counterparty, use CounterPartyFields
// For remittance info, use RemittanceFields
// etc.
```

**2. Validation**

Use the validators provided in `PaymentFormFieldOptions`:

```typescript
new FormControl(
  '',
  this.options.validators || [],      // Synchronous validators
  this.options.asyncValidators || []  // Asynchronous validators
)
```

**3. Styling**

Apply CSS classes from options:

```html
<div [ngClass]="options.cssClasses || ''">
  <!-- Component content -->
</div>
```

**4. Error Messages**

Get localized validation messages from options:

```typescript
private getValidationMessage(key: string): string {
  return (
    this.options?.validationMessages?.find((field: any) => field.name === key)
      ?.message || ''
  );
}
```

###### Component Structure for Custom Payment

The custom payment bundle is organized as:

```
libs/journey-bundles/custom-payment/
├── src/lib/
│   ├── components/
│   │   └── initiator/
│   │       ├── initiator.component.ts      ← Custom component
│   │       ├── initiator.model.ts          ← Data models
│   │       └── initiator.service.ts        ← Business logic
│   ├── custom-payment.config.ts            ← Configuration
│   ├── initiate-payment-journey-bundle.module.ts  ← Bundle module
│   ├── navigation.ts                       ← Navigation setup
│   └── route.ts                            ← Route definition
```

###### Learn More

For detailed information about the Initiate Payments Journey configuration, see:
- [Initiate Payment Configuration](https://backbase.io/documentation/business-banking-usa/2024.12/payments/web/initiate-payment-configuration)
- [Out-of-the-box Configurations](https://backbase.io/documentation/business-banking-usa/2024.12/payments/web/initiate-payment-understand)
- Payment Types and Scenarios in Backbase Documentation

###### Full Example Location

The complete working example is available in:
- `libs/journey-bundles/custom-payment/src/lib/components/initiator/`




<!-- .documentation/workspace-architecture/main.md -->
## Workspace Architecture

This section explains how the monorepo is organized, the project structure, and the architectural principles that guide this application.

<!-- .documentation/workspace-architecture/monorepo-structure.md -->

### Monorepo Structure Overview

This project is organized as an Nx monorepo that contains both applications and libraries following a scalable, maintainable structure. Understanding this organization is key to navigating and developing effectively.

###### Directory Layout

```
golden-sample-app-wf-2271-26-11-2025/
├── apps/                          # Applications that run in the browser
│   ├── golden-sample-app/         # Main Angular SPA application
│   └── golden-sample-app-e2e/     # End-to-end tests (Playwright)
├── libs/                          # Shared and feature libraries
│   ├── journey-bundles/           # Lazy-loadable journey bundles
│   ├── transactions-journey/      # Modern journey (journeyFactory pattern)
│   ├── transfer-journey/          # Legacy journey (NgModule pattern)
│   ├── ach-positive-pay-journey/  # Legacy journey (NgModule pattern)
│   └── shared/                    # Shared features and utilities
│       ├── feature/               # Feature modules (auth, communication, etc.)
│       └── util/                  # Utility libraries (permissions, config, etc.)
├── tools/                         # Custom Nx generators and scripts
├── mock-server/                   # Mock API server for local development
├── nx.json                        # Nx workspace configuration
├── package.json                   # Project dependencies
└── tsconfig.base.json            # Base TypeScript configuration
```

###### Core Directories Explained

**apps/** - Production Applications
- `golden-sample-app`: The main Angular SPA that users interact with
- `golden-sample-app-e2e`: Playwright-based end-to-end test suite

**libs/** - Reusable Code Libraries

The libraries are organized by feature and scope:

1. **Journey Libraries** (Feature implementations)
   - `transactions-journey/` - Shows transactions (modern journeyFactory pattern)
   - `transfer-journey/` - Handles money transfers (legacy pattern)
   - `ach-positive-pay-journey/` - ACH positive pay feature (legacy pattern)

2. **Journey Bundles** (Lazy-loaded modules)
   - `journey-bundles/transactions/` - Bundle for lazy-loading transactions
   - `journey-bundles/transfer/` - Bundle for lazy-loading transfers
   - `journey-bundles/ach-positive-pay/` - Bundle for ACH positive pay
   - `journey-bundles/custom-payment/` - Bundle for custom payments
   - `journey-bundles/user-accounts/` - Bundle for user accounts

3. **Shared Libraries** (Cross-cutting concerns)
   - `shared/feature/` - Feature modules used across the app
     - `auth/` - Authentication logic and guards
     - `communication/` - Journey-to-journey communication
     - `navigation-menu/` - Main navigation component
     - `user-context/` - User context management
     - `view-wrapper/` - Layout wrapper for journeys
   - `shared/util/` - Utility and helper libraries
     - `app-core/` - Core app utilities
     - `config/` - Shared configuration
     - `permissions/` - Permission constants and helpers
     - `e2e-tests/` - Shared e2e test utilities

###### Library Structure Pattern

Each library follows a consistent structure:

```
lib-name/
├── internal/              # Internal implementation (not exported)
│   ├── data-access/      # HTTP services, data fetching
│   ├── feature/          # Feature components and logic
│   ├── shared-data/      # Models, constants, shared types
│   └── ui/               # Presentational components
├── src/
│   ├── index.ts          # Public API exports
│   ├── lib/              # Main library code
│   └── test-setup.ts     # Jest setup
├── project.json          # Nx project configuration
├── package.json          # Library metadata (for npm publishing)
└── tsconfig.*.json       # TypeScript configurations
```

This layered structure ensures:
- **Separation of Concerns**: Each layer has a specific responsibility
- **Internal vs Public**: `internal/` folders are not part of the public API
- **Testability**: Data-access and feature layers can be tested independently
- **Reusability**: UI components are isolated and easily reusable

###### Journey Organization

Journeys are organized in multiple layers:

**Journey Library** (e.g., `libs/transactions-journey/`)
- Core journey logic and configuration
- Components, services, and state
- Exported as a shareable npm package

**Journey Bundle** (e.g., `libs/journey-bundles/transactions/`)
- Lazy-loadable wrapper module
- Provides app-level configuration
- Handles dependency injection at route level

**App Integration** (in `apps/golden-sample-app/`)
- Routes are composed from journey bundles
- App-level communication service bridges multiple journeys

Example flow:
```
User navigates to /transactions
  ↓
Route loads TransactionsBundle (lazy-loaded)
  ↓
Bundle module provides configuration & services
  ↓
Journey renders TransactionsViewComponent
```

###### Why This Structure?

- **Scalability**: New features can be added without affecting existing code
- **Modularity**: Each journey is independent and can be used in other apps
- **Lazy Loading**: Journey bundles load only when accessed
- **Team Collaboration**: Clear boundaries make parallel development easier
- **Testing**: Layers can be tested in isolation
- **Reusability**: Shared utilities and features are centrally managed


<!-- .documentation/workspace-architecture/project-scoping.md -->

### Project Scoping and Dependency Constraints

Nx uses **project scoping** and **tagging** to enforce architectural boundaries. This prevents dependencies from flowing in unintended directions and keeps the codebase organized.

###### Scoping Strategy

Every library in this workspace has a `scope` tag that defines its domain:

| Scope | Purpose | Examples |
|-------|---------|----------|
| `scope:transactions-journey` | Transactions feature | `transactions-journey`, `transactions-journey-ui`, etc. |
| `scope:transfer-journey` | Transfer/Payment feature | `transfer-journey`, `transfer-journey-ui`, etc. |
| `scope:ach-positive-pay-journey` | ACH feature | `ach-positive-pay-journey`, `ach-positive-pay-journey-ui`, etc. |
| `scope:shared` | Cross-cutting concerns | `shared-feature-auth`, `shared-util-permissions`, etc. |

###### Type Tags

Each library also has a `type` tag describing its role:

| Type | Purpose | Examples |
|------|---------|----------|
| `type:shell` | Main journey package (public API) | `transactions-journey-shell`, `transfer-journey-shell` |
| `type:feature` | Feature implementation | `transactions-journey-feature`, `shared-feature-auth` |
| `type:data-access` | HTTP services, data layer | `transactions-journey-data-access` |
| `type:ui` | Presentational components | `transactions-journey-ui` |
| `type:shared-data` | Constants, models, types | `transactions-journey-shared-data` |
| `type:util` | Helper functions | `shared-util-permissions` |
| `type:journey-bundle` | Lazy-loaded journey wrapper | `journey-bundles-transactions` |

###### Dependency Flow Rules

The architecture enforces these dependency rules:

```
App (golden-sample-app)
  ├── Can depend on: Journey Bundles, Shared Features
  └── Cannot depend on: Journey internals, other scope internals

Journey Bundle (journey-bundles/transactions)
  ├── Can depend on: Journey Shell, Shared libraries
  └── Cannot depend on: Other journey bundles, app code

Journey Shell (transactions-journey-shell)
  ├── Can depend on: Internal layers, Shared libraries
  └── Cannot depend on: Other journeys, App code

Journey Internal Layers (data-access, feature, ui)
  ├── Can depend on: Shared utilities, other internal layers
  └── Cannot depend on: Other journey internals, Journey shells

Shared Features (shared/feature/auth)
  ├── Can depend on: Shared utilities, other shared features
  └── Cannot depend on: Any journeys or app code

Shared Utilities (shared/util/permissions)
  ├── Can have NO dependencies on: Journeys, Features, or App
  └── Purpose: Pure utilities with minimal dependencies
```

###### Viewing Project Dependencies

Use Nx to visualize and enforce these boundaries:

```bash
# View the full project graph
nx dep-graph

# View dependencies for a specific project
nx dep-graph --focus=transactions-journey-shell

# Identify circular dependencies (if any)
nx affected --base=main --head=HEAD
```

###### Example: Transactions Journey Dependencies

The transactions journey follows these dependency rules:

1. **transactions-journey-shell** (public API)
   - Exports: `transactionsJourney`, `withConfig`, etc.
   - Depends on: internal data-access, feature, ui
   - Used by: `journey-bundles-transactions`

2. **transactions-journey-data-access** (HTTP services)
   - Exports: HTTP client services, communication interface
   - Depends on: shared-data, Backbase HTTP client library
   - Used by: feature, journey bundle

3. **transactions-journey-feature** (Business logic)
   - Exports: Route components
   - Depends on: data-access, ui, shared-data
   - Used by: shell module

4. **transactions-journey-ui** (Components)
   - Exports: Presentational components
   - Depends on: shared-data, Angular common
   - Used by: feature

5. **transactions-journey-shared-data** (Models)
   - Exports: TypeScript interfaces, constants
   - Depends on: Nothing (leaf dependency)
   - Used by: all other layers

```
transactions-journey-shell
    ↑
    │ depends on
    ↓
transactions-journey-feature ← transactions-journey-ui
    ↑
    │ depends on
    ↓
transactions-journey-data-access
    ↑
    │ depends on
    ↓
transactions-journey-shared-data
```

###### Why Scoping Matters

1. **Prevents Accidental Coupling**: You can't accidentally import from internal modules
2. **Enables Team Boundaries**: Different teams can work on different scopes
3. **Facilitates Reuse**: Clear APIs make it easy to reuse code
4. **Simplifies Testing**: Scoped dependencies are easier to mock and test
5. **Supports Migration**: Can gradually migrate from one pattern to another

###### Enforcing Scoping

The ESLint configuration (`eslint.config.mjs`) enforces these boundaries:

```typescript
// This works - importing from public API
import { transactionsJourney } from '@backbase/transactions-journey';

// This fails - importing from internal modules
import { SomeInternalComponent } from '@backbase/transactions-journey/internal/feature';
// Error: Cannot import from a library that is declared as internal
```

###### Adding a New Feature

When adding a new journey or feature, follow this scoping pattern:

1. Create the feature under `libs/your-feature/`
2. Organize internal code under `libs/your-feature/internal/`
3. Define a clear public API in `libs/your-feature/src/index.ts`
4. Only export what should be public
5. Prevent direct imports from internal folders
6. Tag the project appropriately in `project.json`

###### Common Scoping Mistakes to Avoid

❌ **Don't**: Import feature code directly from a journey internal folder
```typescript
import { MyComponent } from '@backbase/transactions-journey/internal/feature';
```

✅ **Do**: Import from the public API only
```typescript
import { transactionsJourney } from '@backbase/transactions-journey';
```

❌ **Don't**: Create cross-journey dependencies
```typescript
// In transfer-journey
import { SomeComponent } from '@backbase/transactions-journey/internal/ui';
```

✅ **Do**: Use shared libraries for cross-journey code
```typescript
// In shared/feature/communication
export class JourneyCommunicationService { }
// Used by all journeys
```


<!-- .documentation/workspace-architecture/dependency-management.md -->

### Dependency Management with Nx

Nx provides sophisticated caching, task orchestration, and dependency tracking. Understanding how to work effectively with Nx dependencies is crucial for performance and maintainability.

###### Key Nx Concepts

**Project Graph**
- Nx analyzes your code to understand project dependencies
- Projects depend on each other through imports in source code
- Run `nx dep-graph` to visualize the entire graph

**Task Graph**
- Tasks (like `build`, `test`, `lint`) form a dependency graph based on project dependencies
- Nx knows which tasks must run before others
- Example: Building an app requires building all its dependencies first

**Named Inputs and Caching**
- Nx caches task results based on input files
- Different tasks use different inputs (configured in `nx.json`)
- Example: Tests depend on source files, but not build artifacts

###### nx.json Configuration

The key Nx settings are in `nx.json`:

```json
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json"
    ]
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "cache": true
    },
    "@nx/jest:jest": {
      "inputs": ["default", "^production"],
      "cache": true,
      "options": { "passWithNoTests": true }
    }
  },
  "parallel": 1,
  "defaultBase": "main"
}
```

Key settings explained:

- **namedInputs**: Reusable patterns for what files affect a task
  - `default`: All project files + shared globals
  - `production`: Excludes test files and test configuration
- **targetDefaults**: Default settings for all tasks of a given type
  - `build`: Must run dependencies' builds first (`^build`)
  - `cache: true`: Cache build results (very important!)
- **parallel**: 1 = serial execution (prevents race conditions)
- **defaultBase**: Used for `affected` commands (`main` branch)

###### Running Tasks Efficiently

**Building a Single Project**
```bash
# Just build this project (and its dependencies automatically)
nx build golden-sample-app

# Faster: Skip dependency analysis
nx build golden-sample-app --skip-nx-cache
```

**Building Multiple Projects**
```bash
# Build all projects
nx run-many --target=build --all

# Build only affected projects (faster CI builds)
nx affected --target=build --base=main --head=HEAD
```

**Testing**
```bash
# Test a single project
nx test transactions-journey-shell

# Test all projects
nx run-many --target=test --all

# Test only affected projects (very fast for CI)
nx affected --target=test --base=main --head=HEAD
```

**Linting**
```bash
# Lint a project and check dependency rules
nx lint golden-sample-app

# Lint all projects
nx run-many --target=lint --all
```

###### Understanding Task Dependencies

When you run a task, Nx automatically executes all task dependencies first:

```bash
# Running this:
nx build apps/golden-sample-app

# Automatically also runs:
nx build libs/journey-bundles/transactions  # dependency
nx build libs/transactions-journey          # dependency
nx build libs/shared/feature/auth           # dependency
# ... and so on for all transitive dependencies
```

The `dependsOn: ["^build"]` in `targetDefaults` tells Nx: "Before building this project, build all its dependencies."

The `^` prefix means "run this target in all dependencies."

###### Caching and Performance

Nx caches task outputs by default. This makes subsequent runs much faster:

**First run** (no cache):
```bash
nx build shared-util-permissions
> Compiling...
> Takes 5 seconds
```

**Second run** (cache hit):
```bash
nx build shared-util-permissions
> Found in cache, restoring from cache
> Instant (if files haven't changed)
```

Cache is invalidated when:
- Source files change
- Dependencies change
- tsconfig.json changes
- Configuration changes

To skip the cache:
```bash
nx build golden-sample-app --skip-nx-cache
```

To clear all caches:
```bash
nx reset  # Clears entire Nx cache
```

###### Dependency Constraints

Nx can enforce architectural rules. Currently, this project relies on:
1. TypeScript path mapping (in `tsconfig.base.json`)
2. ESLint rules to prevent inappropriate imports
3. Manual code review

###### Optimizing Your Workspace

**1. Keep Dependencies Shallow**
- Avoid deep dependency chains (A → B → C → D)
- Share utilities directly with consumers

**2. Use `providedIn: 'root'` for Services**
```typescript
@Injectable({
  providedIn: 'root'  // Singleton at app root
})
export class MyService {}
```

**3. Lazy Load Routes**
```typescript
{
  path: 'transactions',
  loadChildren: () => import('./transactions.bundle'),  // Lazy loaded
}
```

**4. Limit Entry Points**
- Public API in `src/index.ts`
- Everything else is internal to the project

**5. Use Shared Utilities**
- Create `shared/util/` for truly universal code
- Dependencies: None or only Angular core

###### Checking Dependency Health

View your project graph:
```bash
nx dep-graph

# Focus on a single project
nx dep-graph --focus=transactions-journey-shell

# Show what depends on this project
nx dep-graph --focus=transactions-journey-shell --reverse
```

Look for:
- ✅ Acyclic dependencies (no circular imports)
- ✅ Shallow chains (direct dependencies, not deep nesting)
- ✅ Few dependencies at app level (most in libraries)
- ❌ Avoid circular dependencies
- ❌ Avoid bidirectional dependencies

###### Common Issues with Dependencies

**Issue**: "Cannot find module '@backbase/my-lib'"
**Solution**: 
1. Check `tsconfig.base.json` - is the path configured?
2. Check `nx.json` - does the project exist?
3. Check the project's public API (`src/index.ts`) - is the symbol exported?

**Issue**: Build times are slow
**Solution**:
1. Run `nx dep-graph` to visualize dependencies
2. Look for unnecessary dependencies
3. Check if you can move code to a shared utility
4. Consider lazy loading routes

**Issue**: Circular dependency errors
**Solution**:
1. Identify which projects have circular dependencies: `nx dep-graph`
2. Move shared code to a new library
3. Or restructure to break the cycle
4. Use `providedIn: 'root'` for services to avoid circular module dependencies

###### Best Practices

1. **Import from public APIs only**
   - Use `@backbase/transactions-journey`
   - NOT `@backbase/transactions-journey/internal/feature`

2. **Keep imports organized**
   - Group imports by scope (external, internal, relative)
   - Use TypeScript path aliases from `tsconfig.base.json`

3. **Design for tree-shaking**
   - Export specific symbols, not namespaces
   - Let bundlers remove unused code

4. **Use Nx console (VSCode extension)**
   - Visualize tasks and their dependencies
   - Run tasks from the IDE
   - No need to remember command syntax

5. **Run affected tests before commit**
   ```bash
   # Only test code you actually changed
   nx affected --target=test --base=origin/main --head=HEAD
   ```




<!-- .documentation/best-practices/main.md -->
## Best Practices

This section documents Angular, TypeScript, and Nx best practices used throughout this application. Following these practices ensures your code is maintainable, performant, and consistent with the rest of the codebase.

<!-- .documentation/best-practices/angular-patterns.md -->

### Angular Patterns and Best Practices

This application uses modern Angular patterns with standalone components, signals, and reactive forms. This section covers the key patterns you'll encounter.

###### Standalone Components vs Modules

This application uses **standalone components** (the modern approach). Do NOT use NgModules unless necessary.

✅ **Do** - Standalone Component:
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>Hello</div>`,
})
export class MyComponent {}
```

❌ **Don't** - NgModule (legacy, avoid in new code):
```typescript
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule],
})
export class MyModule {}
```

Key points:
- Set `standalone: true` in component decorator
- Import dependencies directly in `imports` array
- No `declarations` array needed
- In Angular v20+, standalone is becoming the default

###### Using Signals for State Management

Signals are the modern way to manage component state in Angular. They provide better performance through fine-grained reactivity.

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <p>Doubled: {{ doubled() }}</p>
    <button (click)="increment()">Increment</button>
  `,
})
export class CounterComponent {
  // Create a signal with an initial value
  count = signal(0);

  // Derived state using computed
  doubled = computed(() => this.count() * 2);

  increment() {
    // Update using set() or update()
    this.count.update(c => c + 1);
  }
}
```

Key signal methods:
- `signal(initialValue)` - Create a signal
- `signal()` - Read current value (call as function)
- `set(value)` - Replace value completely
- `update(fn)` - Transform current value
- `computed(() => ...)` - Derived/memoized state
- `effect(() => ...)` - Side effects when signals change

✅ **Do** - Use signals for component state:
```typescript
count = signal(0);
users = signal<User[]>([]);
isLoading = signal(false);
```

❌ **Don't** - Use RxJS subjects for component state:
```typescript
count$ = new BehaviorSubject(0);  // Use signal instead
```

###### Dependency Injection with `inject()`

Use the `inject()` function instead of constructor parameters:

✅ **Do** - Modern approach with `inject()`:
```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string) {
    return this.http.get(`/api/users/${id}`);
  }
}
```

❌ **Don't** - Constructor injection (legacy):
```typescript
export class UserService {
  constructor(private http: HttpClient) {}
}
```

Benefits of `inject()`:
- Works outside constructors (in functions, guards, resolvers)
- Cleaner code with no parameter boilerplate
- Better for tree-shaking in small components

Example in a route guard:

```typescript
export const canActivateAdmin = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
```

###### OnPush Change Detection

Always use `OnPush` change detection strategy for optimal performance:

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ data() }}`,
})
export class MyComponent {
  data = input<string>();  // Signal from input
}
```

Why OnPush?
- Component only checks for changes when inputs change
- Reduces unnecessary change detection cycles
- Significantly improves performance with many components
- Angular signals work perfectly with OnPush

###### Using `input()` and `output()` Functions

Modern Angular uses `input()` and `output()` instead of `@Input` and `@Output` decorators:

✅ **Do** - Using input/output functions:
```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div>{{ user().name }}</div>
    <button (click)="onDelete()">Delete</button>
  `,
})
export class UserCardComponent {
  user = input<User>();
  deleted = output<string>();

  onDelete() {
    if (this.user()) {
      this.deleted.emit(this.user()!.id);
    }
  }
}
```

✅ **Usage**:
```typescript
<app-user-card 
  [user]="currentUser()"
  (deleted)="removeUser($event)"
/>
```

❌ **Don't** - Using decorators (legacy):
```typescript
@Input() user: User;
@Output() deleted = new EventEmitter<string>();
```

###### Reactive Forms

Always prefer reactive forms over template-driven forms:

```typescript
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <input formControlName="email" />
      <button [disabled]="form.invalid">Login</button>
    </form>
  `,
})
export class LoginFormComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

Benefits:
- Type-safe form control
- Easier testing
- Better for complex forms
- Synchronous validation

###### Control Flow: @if, @for, @switch

Use native Angular control flow instead of structural directives:

✅ **Do** - Using new syntax:
```typescript
<div>
  @if (isLoading()) {
    <p>Loading...</p>
  } @else if (error()) {
    <p>Error: {{ error() }}</p>
  } @else {
    <p>{{ data() }}</p>
  }

  @for (item of items(); track item.id) {
    <div>{{ item.name }}</div>
  }

  @switch (status()) {
    @case ('active') {
      <p>Active</p>
    }
    @case ('inactive') {
      <p>Inactive</p>
    }
    @default {
      <p>Unknown</p>
    }
  }
</div>
```

❌ **Don't** - Using old structural directives:
```typescript
<div *ngIf="isLoading()">Loading...</div>
<div *ngFor="let item of items">{{ item }}</div>
<div [ngSwitch]="status()">
  <div *ngSwitchCase="'active'">Active</div>
</div>
```

Benefits of new syntax:
- Better performance
- Cleaner syntax
- Safer (no accidental scoping issues)
- Better TypeScript support

###### Template Binding

Use modern binding syntax:

✅ **Do** - Modern approach:
```typescript
<!-- Property binding (not attribute binding) -->
<img [src]="imagePath()" [alt]="imageAlt()" />

<!-- Event binding -->
<button (click)="save()">Save</button>

<!-- Two-way binding (rarely needed with signals) -->
<input [(ngModel)]="name" />

<!-- Use track function in @for -->
@for (item of items(); track item.id) {
  {{ item.name }}
}
```

❌ **Don't** - Old syntax:
```typescript
<!-- Don't use ngClass and ngStyle -->
<div [ngClass]="{ active: isActive }">X</div>
<div [ngStyle]="{ color: textColor }">X</div>
```

✅ **Do** - Direct class/style binding:
```typescript
<div [class.active]="isActive()">X</div>
<div [style.color]="textColor()">X</div>
```

###### Host Bindings

Put host bindings in the `host` object, NOT in decorators:

✅ **Do** - Using host object:
```typescript
@Component({
  selector: 'app-my-component',
  host: {
    class: 'custom-class',
    '[class.active]': 'isActive()',
    '(click)': 'onClick()',
    'role': 'button',
    'tabindex': '0',
  },
  template: `...`,
})
export class MyComponent {
  isActive = signal(false);
  onClick() { /* ... */ }
}
```

❌ **Don't** - Using decorators:
```typescript
@Component({...})
export class MyComponent {
  @HostBinding('class.active') isActive = false;
  @HostListener('click') onClick() { }
}
```

###### Service Communication

Use services with `providedIn: 'root'` for app-level singletons:

```typescript
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private http = inject(HttpClient);

  loadUser() {
    this.http.get<User>('/api/me').subscribe(
      user => this.userSubject.next(user)
    );
  }
}
```

###### Lazy Loading Routes

Always lazy-load feature routes:

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule),
    canActivate: [AuthGuard],
  },
];
```

This ensures:
- App loads faster (features load on-demand)
- Better for mobile users
- Scales to many features without bloat


<!-- .documentation/best-practices/typescript-guidelines.md -->

### TypeScript Guidelines

This application enforces strict TypeScript checking. Understanding these patterns ensures your code is type-safe and maintainable.

###### Strict Mode Configuration

The workspace uses strict TypeScript checking. Key settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

This means:
- No untyped variables (`any` is not allowed)
- Null/undefined must be handled explicitly
- All function parameters must be typed
- Unused variables cause compilation errors

###### Type Inference

Let TypeScript infer types when obvious. Only add explicit types when needed:

✅ **Do** - Let TypeScript infer:
```typescript
// TypeScript knows this is a number
const count = 0;

// TypeScript infers the type from the return value
function getName() {
  return 'John';
}

// TypeScript infers from the array contents
const items = [1, 2, 3];  // number[]
```

❌ **Don't** - Over-specify types:
```typescript
const count: number = 0;
function getName(): string {
  return 'John';
}
const items: number[] = [1, 2, 3];
```

⚠️ **Do add explicit types when**:
- Function parameters (always required in strict mode)
- Public API return types
- Complex types that aren't obvious
- Service properties

###### Using `unknown` vs `any`

Never use `any`. Use `unknown` when the type is truly unknown:

```typescript
// ❌ Don't
function processData(data: any) {
  return data.value;  // No type checking!
}

// ✅ Do
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: any }).value;
  }
  throw new Error('Invalid data');
}

// ✅ Better - use a type guard
function isDataObject(data: unknown): data is { value: any } {
  return typeof data === 'object' && data !== null && 'value' in data;
}

function processData(data: unknown) {
  if (isDataObject(data)) {
    return data.value;
  }
  throw new Error('Invalid data');
}
```

###### Interfaces vs Types

Use `interface` for object shapes that will be implemented/extended. Use `type` for unions and aliases:

✅ **Do**:
```typescript
// Interface - for object contracts
interface User {
  id: string;
  name: string;
  email: string;
}

// Type - for unions and complex types
type Status = 'active' | 'inactive' | 'pending';
type Result<T> = { success: true; data: T } | { success: false; error: Error };
```

❌ **Don't**:
```typescript
// Using type for a simple object (interface is clearer)
type User = {
  id: string;
  name: string;
};
```

###### Nullability and Optional Properties

Be explicit about null and undefined:

```typescript
// Property is required
interface User {
  id: string;
  name: string;
}

// Property is optional
interface User {
  id: string;
  name?: string;  // string | undefined
}

// Property can be null
interface User {
  id: string;
  name: string | null;  // Must be string OR null
}

// Property can be null or undefined
interface User {
  id: string;
  name: string | null | undefined;
}
```

✅ **Do** - Handle null/undefined:
```typescript
function getName(user: User | null): string {
  if (!user) {
    return 'Unknown';
  }
  return user.name ?? 'No name';  // Nullish coalescing
}
```

❌ **Don't** - Assume things aren't null:
```typescript
function getName(user: User | null): string {
  return user.name;  // TS Error: user could be null
}
```

###### Union Types and Discriminated Unions

Use union types for exclusive states:

```typescript
// ✅ Good - discriminated union (also called tagged union)
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Usage with type guard
function processState<T>(state: AsyncState<T>) {
  if (state.status === 'success') {
    console.log(state.data);  // TypeScript knows data exists here
  }
}

// ❌ Avoid - ambiguous union
type UserOrAdmin = User | Admin;  // Ambiguous what the difference is
```

###### Generic Types

Use generics for reusable, type-safe code:

```typescript
// Generic function
function wrappedInArray<T>(value: T): T[] {
  return [value];
}

// Generic interface
interface Container<T> {
  value: T;
  isEmpty(): boolean;
}

// Generic class
class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T) {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
}
```

###### Utility Types

Use TypeScript's utility types to manipulate types:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Partial - all properties optional
type UserUpdate = Partial<User>;

// Pick - select specific properties
type UserPublic = Pick<User, 'id' | 'name'>;

// Omit - exclude specific properties
type UserPrivate = Omit<User, 'email'>;

// Record - object with specific keys
type UserRoles = Record<'admin' | 'user' | 'guest', boolean>;

// Required - all properties required
type StrictUser = Required<Partial<User>>;

// ReadOnly - immutable properties
type ImmutableUser = Readonly<User>;
```

###### Function Typing

Always type function parameters and return types:

```typescript
// ✅ Explicit and clear
function calculateTotal(
  items: CartItem[],
  taxRate: number
): number {
  return items.reduce((sum, item) => sum + item.price * taxRate, 0);
}

// ✅ Function type annotation
const handleClick: (event: MouseEvent) => void = (event) => {
  console.log(event);
};

// ✅ Callback types
type Callback<T> = (value: T) => void;
function subscribe<T>(
  items: T[],
  onEach: Callback<T>,
  onComplete: () => void
) {
  items.forEach(onEach);
  onComplete();
}
```

###### Enum Alternatives

Use `const` objects or union types instead of enums for better tree-shaking:

```typescript
// ✅ Do - using const object
const Status = {
  Active: 'active',
  Inactive: 'inactive',
  Pending: 'pending',
} as const;

type Status = typeof Status[keyof typeof Status];

// ✅ Do - using union type (simplest)
type Status = 'active' | 'inactive' | 'pending';

// ❌ Avoid - enums are harder to tree-shake
enum Status {
  Active = 'active',
  Inactive = 'inactive',
}
```

###### Private Fields

Use private fields with `#` prefix for encapsulation:

```typescript
export class Service {
  // ✅ Do - private field (truly private)
  #cache = new Map<string, any>();

  #getCached(key: string) {
    return this.#cache.get(key);
  }

  public getData(key: string) {
    return this.#getCached(key);
  }
}

// ❌ Don't - private property (can be accessed via bracket notation)
export class Service {
  private cache = new Map<string, any>();
}

// Can be accessed: service['cache']
```

###### Strict Null Checks in Templates

When using values in templates, ensure proper null checking:

```typescript
export class Component {
  user: User | null = null;

  // ✅ Template safe
  userName(): string {
    return this.user?.name ?? 'Guest';
  }

  // ✅ In template
  template: `
    {{ user?.name || 'Guest' }}
    @if (user) {
      <p>{{ user.email }}</p>
    }
  `
}
```

###### Decorators Typing

Type decorator metadata properly:

```typescript
// ✅ Explicit typing
@Component({
  selector: 'app-my-component',
  template: `<div>{{ count() }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {}

// ✅ Service injection
export class MyService {
  private http = inject(HttpClient);
  
  getData(): Observable<Data[]> {
    return this.http.get<Data[]>('/api/data');
  }
}
```

###### Avoid Type Assertions

Instead of `as` type assertions, use type guards:

```typescript
// ❌ Avoid - type assertion
const value = (json as any) as User;

// ✅ Better - type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

if (isUser(json)) {
  const user: User = json;  // TypeScript knows this is User
}
```


<!-- .documentation/best-practices/code-organization.md -->

### Code Organization and File Structure

A well-organized codebase is easier to navigate, maintain, and test. This section covers the patterns used in this project.

###### File Naming Conventions

Follow these naming conventions for consistency:

```
components:
- my-component.component.ts (component class)
- my-component.component.html (template)
- my-component.component.scss (styles)
- my-component.component.spec.ts (tests)

services:
- user.service.ts (public service)
- user.service.spec.ts (tests)

directives:
- highlight.directive.ts
- highlight.directive.spec.ts

pipes:
- safe-html.pipe.ts
- safe-html.pipe.spec.ts

guards:
- auth.guard.ts
- auth.guard.spec.ts

models/interfaces:
- user.model.ts (or in shared-data/src/lib/models/)

constants:
- permissions.ts
- translations.ts
```

Use `kebab-case` for file names and folder names.

###### Folder Organization for Features

Organize feature libraries with this structure:

```
libs/transactions-journey/
├── src/
│   └── index.ts                 # Public API
├── internal/
│   ├── data-access/             # HTTP services
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── transactions.service.ts
│   │   │   │   └── transactions.http.service.ts
│   │   │   └── index.ts         # Public API of data-access
│   │   └── project.json
│   ├── feature/                 # Smart/container components
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── transaction-view/
│   │   │   │   │   ├── transaction-view.component.ts
│   │   │   │   │   └── transaction-view.component.html
│   │   │   │   └── index.ts
│   │   │   └── test-setup.ts
│   │   └── project.json
│   ├── ui/                      # Presentational components
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── transaction-card/
│   │   │   │   ├── transaction-list/
│   │   │   │   └── index.ts
│   │   │   └── test-setup.ts
│   │   └── project.json
│   └── shared-data/             # Models, constants, types
│       ├── src/
│       │   ├── lib/
│       │   │   ├── models/
│       │   │   ├── constants/
│       │   │   └── index.ts
│       │   └── test-setup.ts
│       └── project.json
└── project.json
```

###### Layering Pattern

Features are organized in layers:

1. **Shared Data** (models, constants, types)
   - No dependencies (leaf nodes)
   - Pure data structures
   - Exported constants and types

2. **Data Access** (HTTP services)
   - Depends on: shared-data, Backbase HTTP clients
   - Handles API communication
   - No component dependencies

3. **UI** (Presentational components)
   - Depends on: shared-data, Angular common
   - Pure components (all data via inputs)
   - No service dependencies (only through parent)

4. **Feature** (Smart components)
   - Depends on: data-access, ui, shared-data
   - Handles routing and state
   - Orchestrates data and presentation

5. **Shell** (Public API)
   - Exports the journey configuration
   - Bundles all layers for distribution

This layering ensures:
- ✅ Testability (each layer independently testable)
- ✅ Reusability (UI components are component-agnostic)
- ✅ Maintainability (clear separation of concerns)
- ✅ Performance (can lazy-load features)

###### Component Structure

For component files, follow this order:

```typescript
// 1. Imports (external first, then internal)
import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UserService } from '@backbase/shared/feature/auth';
import { UserListComponent } from './user-list.component';

// 2. Types and interfaces (if not in separate file)
export interface UserFilter {
  role?: string;
  status?: 'active' | 'inactive';
}

// 3. Component decorator
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
  styles: [`...`],
})
export class UsersComponent {
  // 4. Properties (signals first, then public properties)
  users = input<User[]>([]);
  filter = input<UserFilter>();
  userUpdated = output<User>();

  filteredUsers = computed(() => {
    // Derived state
  });

  // 5. Private fields
  #userService = inject(UserService);
  #router = inject(Router);

  // 6. Public methods
  selectUser(user: User) {
    this.userUpdated.emit(user);
  }

  // 7. Private methods
  #loadUsers() {
    // Implementation
  }
}
```

###### Organizing Shared Utilities

For truly universal utilities (no framework dependencies):

```
libs/shared/util/permissions/
├── src/
│   └── lib/
│       ├── entitlementsTriplets.ts  # Constants
│       ├── permission.model.ts       # Types
│       ├── has-permission.util.ts    # Pure functions
│       └── index.ts                  # Public API
```

###### Import Organization

Organize imports in this order (with blank lines between groups):

```typescript
// 1. Angular core
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// 2. Third-party libraries
import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';

// 3. Backbase libraries (external)
import { LayoutModule } from '@backbase/ui-ang/layout';

// 4. Workspace imports (path aliases)
import { UserService } from '@backbase/shared/feature/auth';
import { PERMISSIONS } from '@backbase/shared/util/permissions';

// 5. Relative imports (rarely used)
import { UserCardComponent } from './user-card.component';
```

###### Barrel Exports (index.ts)

Each public library should have an `index.ts` that exports the public API:

```typescript
// libs/transactions-journey/src/index.ts

// Core exports
export * from './lib/transactions-journey';
export { TransactionsJourneyConfig } from './lib/transactions-journey';

// Re-export commonly used items from internal modules
export {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@backbase/transactions-journey/internal/data-access';

// ❌ Don't export internal modules directly
// export * from './internal/feature';  // Don't do this
```

###### Internal Modules

Prevent direct imports from internal folders. Update `project.json` tag policy:

```json
{
  "tags": ["scope:transactions-journey", "type:shell"]
}
```

This prevents:
```typescript
// ❌ This should fail in linting
import { Component } from '@backbase/transactions-journey/internal/feature';

// ✅ Use public API instead
import { transactionsJourney } from '@backbase/transactions-journey';
```

###### Service Organization

Group related services:

```typescript
// ❌ Don't - One class per file (overcomplicated)
user.service.ts
user-http.service.ts
user-cache.service.ts

// ✅ Better - Related services grouped
data-access/
├── src/lib/
│   ├── user.service.ts (main service)
│   ├── user.http.service.ts (HTTP client)
│   └── index.ts (exports main service)
```

###### Constants Organization

Group related constants:

```typescript
// ❌ Scattered
interface Permission { }
interface Role { }
const PERMISSIONS = { };
const ROLES = { };

// ✅ Better - organized file
// permissions.ts
export interface Permission { }
export const PERMISSIONS = { };

// roles.ts
export interface Role { }
export const ROLES = { };

// index.ts
export * from './permissions';
export * from './roles';
```

###### Testing File Co-location

Keep test files next to source files:

```
src/lib/
├── user.service.ts
├── user.service.spec.ts    ← Test file next to source
├── user-card.component.ts
└── user-card.component.spec.ts
```

Not:
```
src/
├── lib/
├── __tests__/              ← Don't separate tests
│   ├── user.service.spec.ts
```

###### README Files

Include README.md in library root explaining:
- What the library does
- Key exports
- Common usage patterns
- Links to related libraries

Example:

```markdown
# Transactions Journey

Core library for the transactions feature.

## Exports

- `transactionsJourney()` - Journey factory function
- `withConfig()` - Configure page size and slim mode
- `TransactionsJourneyConfig` - Configuration interface

## Usage

```typescript
import { transactionsJourney, withConfig } from '@backbase/transactions-journey';
```

See [Journey Factory Patterns](../../.documentation/journeys/journey-factory-patterns.md) for detailed examples.
```


<!-- .documentation/best-practices/performance.md -->

### Performance Optimization

This section covers performance best practices and optimization techniques used in this application.

###### Change Detection Optimization

Use OnPush change detection strategy everywhere:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  items = input<Item[]>();
  selected = signal(null);
}
```

Benefits:
- Component only checks for changes when inputs or signals change
- Reduced change detection cycles from O(n) to O(1) in many cases
- Signals are perfect for this strategy

###### Memoization with Computed

Use `computed()` to avoid expensive calculations:

```typescript
// ❌ Bad - recalculates every change detection cycle
get filteredItems(): Item[] {
  return this.items().filter(item => item.status === 'active');
}

// ✅ Good - calculates only when dependencies change
filteredItems = computed(() =>
  this.items().filter(item => item.status === 'active')
);
```

###### Lazy Loading Routes

Always lazy-load feature routes:

```typescript
// ✅ Good - bundle only loads when accessed
const routes: Routes = [
  {
    path: 'transactions',
    loadChildren: () => import('./transactions.bundle'),
  },
];

// Initial bundle size: ~50KB
// After navigating to transactions: +20KB (transactions bundle)
```

Without lazy loading, the main bundle would include all features (+200KB).

###### Image Optimization

Use `NgOptimizedImage` for all images:

```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  template: `
    <!-- Always use ngSrc, not src -->
    <img 
      ngSrc="assets/logo.png" 
      width="100" 
      height="100" 
      alt="Logo"
    />
    <!-- Optional: priority for above-the-fold images -->
    <img 
      ngSrc="hero.png" 
      priority 
      width="1200" 
      height="400"
      alt="Hero"
    />
  `,
})
export class AppComponent {}
```

Benefits:
- ✅ Automatic image optimization
- ✅ Responsive image sizing
- ✅ Lazy loading by default
- ✅ Modern formats (WebP, etc.)
- ✅ Content Layout Shift prevention

###### Caching Strategy

**HTTP Response Caching**

```typescript
// Data that changes infrequently
@Injectable({ providedIn: 'root' })
export class UserService {
  private cache = new Map<string, Observable<User>>();

  getUser(id: string): Observable<User> {
    if (!this.cache.has(id)) {
      this.cache.set(
        id,
        this.http.get<User>(`/api/users/${id}`).pipe(
          shareReplay(1)  // Cache the result
        )
      );
    }
    return this.cache.get(id)!;
  }
}
```

**Local Storage for Session Data**

```typescript
@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private storage = inject(SessionStorageService);

  getPreferences(): Preferences {
    // Try cache first
    const cached = this.storage.get<Preferences>('preferences');
    if (cached) return cached;

    // Fall back to API
    return this.http.get<Preferences>('/api/preferences').pipe(
      tap(prefs => this.storage.set('preferences', prefs))
    );
  }
}
```

###### Reducing Bundle Size

**1. Code Splitting**
- Routes are lazy-loaded (already done)
- Each journey is a separate bundle

**2. Tree Shaking**
- Export specific symbols, not namespaces:
  ```typescript
  // ✅ Good - tree-shakeable
  export const PERMISSIONS = { ... };
  export interface User { }

  // ❌ Bad - bundle includes entire object
  export const Config = {
    permissions: { ... },
    ...
  };
  ```

**3. Removing Unused Dependencies**
- Run `npm audit` to check for unused packages
- Use `npm prune` to remove unused packages
- Check `node_modules` size: `du -sh node_modules`

**4. Update Dependencies**
- Newer versions often include optimizations
- Regularly update: `npm update`

###### Memory Optimization

**Unsubscribe from Observables**

Use the async pipe or destroy subjects:

```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ✅ Good - auto-unsubscribe on destroy
@Component({
  template: `{{ users$ | async }}`
})
export class UsersComponent {
  users$ = inject(UserService).getUsers();
}

// ✅ Good - manual cleanup with takeUntil
@Component({...})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  users$: Observable<User[]>;

  ngOnInit() {
    this.users$ = inject(UserService).getUsers().pipe(
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ❌ Bad - memory leak (observable never unsubscribes)
@Component({...})
export class UsersComponent {
  subscription = inject(UserService).getUsers().subscribe(...);
  // subscription never cleaned up!
}
```

**Cleaning Up Signals**

Unlike observables, signals don't need cleanup:

```typescript
// ✅ Signals don't leak memory
@Component({...})
export class Component {
  users = signal<User[]>([]);
  loading = signal(false);
  // No cleanup needed!
}
```

###### Network Optimization

**Request Batching**

Combine multiple requests:

```typescript
// ❌ Bad - 3 separate requests
this.users$ = this.http.get('/api/users');
this.roles$ = this.http.get('/api/roles');
this.permissions$ = this.http.get('/api/permissions');

// ✅ Better - batched request
this.appData$ = this.http.get('/api/app-data');  // Returns all 3
```

**Request Debouncing**

```typescript
import { debounceTime } from 'rxjs/operators';

searchTerm = signal('');

results$ = toObservable(this.searchTerm).pipe(
  debounceTime(300),  // Wait 300ms after user stops typing
  switchMap(term => this.search(term))
);
```

**Progressive Loading**

```typescript
// Load most important data first
ngOnInit() {
  // 1. Critical data (user info)
  this.userService.loadUser().subscribe();

  // 2. Important data (after user loads)
  this.userService.user$.pipe(
    take(1),
    switchMap(() => this.transactionService.loadTransactions())
  ).subscribe();

  // 3. Nice-to-have data (after a delay)
  timer(2000).pipe(
    switchMap(() => this.analyticsService.loadMetrics())
  ).subscribe();
}
```

###### Rendering Performance

**Virtual Scrolling for Large Lists**

```typescript
import { Component, input } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  imports: [ScrollingModule, CommonModule],
  template: `
    <cdk-virtual-scroll-viewport [itemSize]="50" class="list">
      @for (item of items(); trackBy: trackByFn) {
        <div>{{ item.name }}</div>
      }
    </cdk-virtual-scroll-viewport>
  `,
})
export class VirtualListComponent {
  items = input<Item[]>([]);

  trackByFn(index: number, item: Item) {
    return item.id;
  }
}
```

Benefits:
- Only renders visible items
- Smooth scrolling even with 10,000+ items
- Reduced DOM elements

**TrackBy in Loops**

Always provide a trackBy function:

```typescript
// ❌ Bad - recreates DOM for every item
@for (item of items()) {
  <div>{{ item.name }}</div>
}

// ✅ Good - reuses DOM nodes
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

// ✅ Better - with trackBy method
@for (item of items(); track trackByFn($index, item)) {
  <div>{{ item.name }}</div>
}

trackByFn(index: number, item: Item) {
  return item.id;  // Unique identifier
}
```

###### CSS Performance

**CSS-in-JS vs Stylesheet**

```typescript
// ✅ Prefer external CSS files
@Component({
  selector: 'app-my-component',
  styleUrls: ['./my-component.component.scss'],
  template: `...`,
})
export class MyComponent {}

// ⚠️ Use inline styles only for small components or dynamic styles
@Component({
  selector: 'app-my-component',
  styles: [`
    .container { display: flex; }
  `],
})
export class MyComponent {}
```

**Minimize CSS Calculations**

```scss
// ❌ Avoid complex selectors
.header .nav .item > span[data-active="true"] { }

// ✅ Use direct classes
.nav-item.active { }

// ❌ Avoid nth-child heavily used
.list li:nth-child(2n+1) { }

// ✅ Better
.list li.odd { }
```

###### Monitoring Performance

Use Angular's built-in performance APIs:

```typescript
// Measure component initialization time
@Component({...})
export class MyComponent implements OnInit {
  ngOnInit() {
    performance.mark('component-init-start');
    
    // Initialization code
    
    performance.mark('component-init-end');
    performance.measure(
      'component-init',
      'component-init-start',
      'component-init-end'
    );
  }
}

// Check the measurement
const measure = performance.getEntriesByName('component-init')[0];
console.log(`Initialization took ${measure.duration}ms`);
```

###### Performance Checklist

- [ ] OnPush change detection on all components
- [ ] Lazy-loaded routes for all features
- [ ] TrackBy functions in @for loops
- [ ] NgOptimizedImage for all images
- [ ] Unsubscribed from observables (or use async pipe)
- [ ] No memory leaks (check browser devtools)
- [ ] HTTP response caching where appropriate
- [ ] No unnecessary re-renders (signals, computed)
- [ ] Bundle size < 500KB (initial)
- [ ] First Contentful Paint < 2 seconds




<!-- .documentation/troubleshooting/main.md -->
## Troubleshooting

Common issues, their causes, and solutions. Use this guide to quickly resolve problems during development.

<!-- .documentation/troubleshooting/common-issues.md -->

### Common Issues and Solutions

###### Issue: Port 4200 already in use

**Symptom**: `Port 4200 is already in use. Use '--port' to specify a different port.`

**Causes**:
- Another instance of `npm start` is running
- Another application is using port 4200
- Process hung from previous run

**Solutions**:

1. **Find and kill the process**:
   ```bash
   # macOS/Linux
   lsof -i :4200
   kill -9 <PID>

   # Windows
   netstat -ano | findstr :4200
   taskkill /PID <PID> /F
   ```

2. **Use a different port**:
   ```bash
   npm start -- --port 4201
   ```

3. **Clear Nx daemon**:
   ```bash
   nx reset
   npm start
   ```

---

###### Issue: Module not found

**Symptom**: `Cannot find module '@backbase/my-lib'`

**Causes**:
- Path alias not configured in `tsconfig.base.json`
- Project not listed in `tsconfig.base.json` paths
- Typo in import path
- Module hasn't been built yet

**Solutions**:

1. **Check path configuration**:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@backbase/*": ["libs/*/src"]
       }
     }
   }
   ```

2. **Verify module exists**:
   ```bash
   # Check if project exists
   nx list | grep my-lib

   # Check if index.ts exports the symbol
   cat libs/my-lib/src/index.ts
   ```

3. **Check for typos**:
   - Import path case-sensitive
   - Must match folder names exactly

4. **Build the dependency**:
   ```bash
   nx build my-lib
   ```

---

###### Issue: Build hangs or is very slow

**Symptom**: `ng build` or `nx build` takes 5+ minutes or hangs indefinitely

**Causes**:
- Nx cache is corrupted
- Too many projects building in parallel
- Circular dependencies
- Memory issues

**Solutions**:

1. **Clear Nx cache**:
   ```bash
   nx reset
   rm -rf dist/
   npm start
   ```

2. **Check for circular dependencies**:
   ```bash
   nx dep-graph
   ```
   Look for bidirectional arrows between projects

3. **Build in verbose mode**:
   ```bash
   nx build golden-sample-app -v
   ```
   See which step is hanging

4. **Increase Node memory**:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm start
   ```

5. **Kill Nx daemon and restart**:
   ```bash
   pkill -f "nx-daemon"
   npm start
   ```

---

###### Issue: Tests fail with "Cannot find module"

**Symptom**: `Cannot find module '@backbase/something' from 'src/app.spec.ts'`

**Causes**:
- Jest hasn't been configured for the path alias
- Module exports don't match imports
- Test file trying to import from internal module

**Solutions**:

1. **Check jest config**:
   ```json
   {
     "moduleNameMapper": {
       "^@backbase/(.*)$": "<rootDir>/../../libs/$1/src"
     }
   }
   ```

2. **Verify module exports**:
   ```bash
   cat libs/my-lib/src/index.ts
   ```

3. **Check for internal imports**:
   ```typescript
   // ❌ Don't import from internal
   import { Component } from '@backbase/my-lib/internal/feature';

   // ✅ Use public API
   import { SomeComponent } from '@backbase/my-lib';
   ```

4. **Clear cache and retry**:
   ```bash
   nx test my-lib --clearCache
   ```

---

###### Issue: "NullInjectorError: No provider for X"

**Symptom**: `NullInjectorError: No provider found for ServiceX!`

**Causes**:
- Service not provided in providers array
- Service provided at wrong scope (app level vs module level)
- Service in lazy-loaded module not provided there

**Solutions**:

1. **Add to providers**:
   ```typescript
   @NgModule({
     imports: [...],
     providers: [MyService],  // Add here
   })
   export class MyModule {}
   ```

2. **Or use providedIn**:
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class MyService {}
   ```

3. **For lazy-loaded modules, provide in bundle**:
   ```typescript
   @NgModule({
     imports: [RouterModule.forChild(routes)],
     providers: [MyService],  // Provide here, not globally
   })
   export class MyJourneyModule {}
   ```

---

###### Issue: Types don't match in template

**Symptom**: Template errors like `Property 'X' does not exist on type 'Y'`

**Causes**:
- Component property is private
- Property is signal (need to call it)
- Wrong type passed to input

**Solutions**:

1. **Make property public**:
   ```typescript
   // ❌ Private - can't use in template
   private count = signal(0);

   // ✅ Public
   count = signal(0);
   ```

2. **Call signal in template**:
   ```typescript
   // ✅ Signals are called as functions
   {{ count() }}
   @for (item of items(); track item.id) { }
   ```

3. **Check type in component**:
   ```typescript
   export interface ComponentInputs {
     name: string;
   }

   @Component({...})
   export class MyComponent {
     name = input<string>();  // Must be string, not optional
   }
   ```

---

###### Issue: Authentication fails silently

**Symptom**: Redirect to login page keeps happening, even with valid credentials

**Causes**:
- OAuth configuration incorrect
- Token storage not accessible
- CORS issues with auth server
- Session mismatch

**Solutions**:

1. **Check OAuth configuration**:
   ```typescript
   // Check environment.ts
   authConfig: {
     clientId: 'your-client-id',
     redirectUrl: 'http://0.0.0.0:4200/callback',  // Must match auth server
   }
   ```

2. **Check browser storage**:
   ```javascript
   // Open DevTools > Application
   localStorage.getItem('access_token')  // Should have a value
   ```

3. **Check network requests**:
   - Open DevTools > Network tab
   - Look for auth service calls
   - Check for CORS errors

4. **Try different localhost URL**:
   ```bash
   # Some AWS WAF configs require 0.0.0.0
   http://0.0.0.0:4200/
   # Instead of
   http://localhost:4200/
   ```

---

###### Issue: Styles not applying

**Symptom**: CSS styles from SCSS files don't appear in component

**Causes**:
- SCSS file path incorrect
- CSS module conflicts
- Style encapsulation issue
- File not being watched during development

**Solutions**:

1. **Check style paths**:
   ```typescript
   @Component({
     styleUrls: ['./my-component.component.scss'],  // Relative to component file
   })
   ```

2. **Try inline styles temporarily**:
   ```typescript
   @Component({
     styles: [`
       :host { display: block; }
       .container { color: red; }
     `],
   })
   ```

3. **Check for naming conflicts**:
   ```typescript
   // If using CSS modules
   @Component({
     styleUrls: ['./my-component.component.scss'],
     encapsulation: ViewEncapsulation.None,  // Disable encapsulation if needed
   })
   ```

4. **Rebuild the project**:
   ```bash
   nx build my-lib --skip-nx-cache
   ```

---

###### Issue: "Circular dependency detected"

**Symptom**: Compilation fails with circular dependency error

**Causes**:
- Service A imports from Service B, and B imports from A
- Library imports another library that imports back
- Module imports feature that imports module

**Solutions**:

1. **Identify the cycle**:
   ```bash
   nx dep-graph --focus=my-lib
   ```
   Look for arrows pointing both ways between projects

2. **Extract shared code**:
   ```typescript
   // Create libs/shared/util/models.ts
   export interface MyModel { }

   // Now both can import from shared without cycling
   import { MyModel } from '@backbase/shared/util/models';
   ```

3. **Use dependency injection instead**:
   ```typescript
   // ❌ Circular - A imports B, B imports A
   // service-a.ts
   import { ServiceB } from './service-b';
   export class ServiceA {
     constructor(private b: ServiceB) {}
   }

   // ✅ Break cycle - use injection token
   // service-a.ts
   export const SERVICE_A = new InjectionToken('ServiceA');

   // App root provides both without cycle
   providers: [ServiceA, ServiceB]
   ```

---

###### Issue: Lazy-loaded route not loading

**Symptom**: Navigate to lazy route and nothing loads, or get "Cannot find module"

**Causes**:
- loadChildren path is incorrect
- Bundle module doesn't have `export default`
- Route guard preventing access
- Network error loading chunk

**Solutions**:

1. **Check route configuration**:
   ```typescript
   // ✅ Correct
   {
     path: 'transactions',
     loadChildren: () => import('./transactions.bundle').then(m => m.default),
   }

   // ✅ Also correct (with proper naming)
   {
     path: 'transactions',
     loadChildren: () => import('./transactions.bundle'),
   }
   ```

2. **Check bundle exports**:
   ```typescript
   // libs/journey-bundles/transactions/src/lib/transactions.bundle.ts
   @NgModule({...})
   export class TransactionsModule {}

   export default TransactionsModule;  // Must have default export
   ```

3. **Check route guards**:
   ```typescript
   {
     path: 'transactions',
     loadChildren: () => import('./transactions.bundle'),
     canActivate: [AuthGuard],  // Make sure you're authenticated
   }
   ```

4. **Check network tab**:
   - DevTools > Network > XHR/Fetch
   - Look for failing chunk requests
   - Check for CORS or 404 errors

---

###### Issue: "This likely means that the library exported more than just the type"

**Symptom**: TypeScript error about library exports when importing type

**Causes**:
- Importing type without `import type`
- Module has side effects during import
- Circular dependency during type resolution

**Solutions**:

1. **Use `import type`**:
   ```typescript
   // ✅ Only the type is imported (no runtime code)
   import type { User } from '@backbase/shared/util/models';

   // ❌ Imports both type and any runtime code
   import { User } from '@backbase/shared/util/models';
   ```

2. **Check for side effects**:
   ```typescript
   // Don't execute code at module level
   // ❌ Bad
   export const config = console.log('Module loaded');

   // ✅ Good
   export const config = {};
   ```


<!-- .documentation/troubleshooting/build-errors.md -->

### Build Errors

Errors that occur during compilation or bundling.

###### Error: "Cannot find name X"

**Symptom**: `error TS2304: Cannot find name 'X'.`

**Solution**:
1. Check if the symbol is exported from its module
2. Check if the import path is correct
3. Verify tsconfig.json includes the file
4. Restart the dev server (`npm start`)

```typescript
// ✅ Fix - import the missing symbol
import { MyClass } from './my-class';
```

---

###### Error: "Property X is missing in type Y"

**Symptom**: `Property 'email' is missing in type 'User' but required in type 'StrictUser'.`

**Solution**:
Provide all required properties of the interface:

```typescript
// ✅ Fix - provide all required properties
const user: User = {
  id: '123',
  name: 'John',
  email: 'john@example.com',  // Add missing property
};
```

Or make the property optional:

```typescript
interface User {
  id: string;
  name: string;
  email?: string;  // Make optional
}
```

---

###### Error: "Unsafe assignment of any value"

**Symptom**: `error TS7006: Parameter 'x' implicitly has an 'any' type.`

**Solution**:
Add explicit type annotations:

```typescript
// ✅ Fix - add type annotation
const process = (value: string) => {
  return value.toUpperCase();
};

const items = [1, 2, 3].map((item: number) => item * 2);
```

---

###### Error: "Argument of type X is not assignable to parameter of type Y"

**Symptom**: `Argument of type 'string' is not assignable to parameter of type 'number'.`

**Solution**:
Convert the value to the correct type:

```typescript
// ✅ Fix - convert to correct type
const count: number = parseInt(userInput);
const items: Item[] = Array.from(itemSet);
```

---

###### Error: "Cannot assign to readonly property X"

**Symptom**: `Cannot assign to 'count' because it is a read-only property.`

**Solution**:
Use setter methods or create new objects:

```typescript
// If it's a signal
count = signal(0);

// ✅ Use update
count.update(c => c + 1);

// Or set
count.set(5);

// If it's a property
// ❌ Direct assignment
this.config.name = 'new name';

// ✅ Create new object
this.config = { ...this.config, name: 'new name' };
```

---

###### Error: "Argument type X is not assignable to parameter of type Y"

**Symptom**: When calling a function with wrong type argument

**Solution**:
Match the function signature exactly:

```typescript
interface User {
  id: string;
  name: string;
}

// Function expects User
function processUser(user: User): void {}

// ❌ Wrong - missing name property
processUser({ id: '123' });

// ✅ Correct
processUser({ id: '123', name: 'John' });
```

---

###### Error: "NGCC compilation"

**Symptom**: Compilation hangs on "Building Angular Package Format" with NGCC

**Cause**: Node modules haven't been processed by Angular

**Solution**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or just clear Nx cache
nx reset
```

---

###### Error: "Cannot resolve dependencies"

**Symptom**: `ERROR in ./src/app.ts Could not resolve '@backbase/my-lib'`

**Solution**:
1. Check `tsconfig.base.json` has the path alias
2. Build the library: `nx build my-lib`
3. Check the library exports the symbol in `src/index.ts`

---

###### Error: "Unexpected token" in SCSS

**Symptom**: SCSS compilation fails with `Unexpected token`

**Solution**:
Check for common SCSS issues:

```scss
/* ✅ Valid SCSS */
.container {
  display: flex;
  
  &.active {
    color: red;
  }
}

/* ❌ Invalid - missing closing brace */
.container {
  display: flex;
```

---

###### Error: "Module not found: Error: Can't resolve X"

**Symptom**: Webpack can't find module during build

**Solution**:

```bash
# 1. Check file exists
ls -la libs/my-lib/src/lib/my-file.ts

# 2. Rebuild dependency
nx build my-lib

# 3. Clear cache
nx reset
nx build golden-sample-app
```


<!-- .documentation/troubleshooting/runtime-errors.md -->

### Runtime Errors

Errors that occur when the application is running in the browser.

###### Error: "Cannot read property X of undefined"

**Symptom**: `TypeError: Cannot read property 'name' of undefined`

**Cause**: Accessing property on null/undefined value

**Solution**:
Add null checks before accessing properties:

```typescript
// ❌ Will crash if user is undefined
const name = user.name;

// ✅ Safe access
const name = user?.name ?? 'Unknown';

// ✅ Or check explicitly
const name = user ? user.name : 'Unknown';

// ✅ In templates
{{ user?.name || 'Unknown' }}

@if (user) {
  <p>{{ user.name }}</p>
}
```

---

###### Error: "Cannot assign to readonly property"

**Symptom**: Runtime error when trying to modify readonly property

**Solution**:
Use proper update mechanisms:

```typescript
// ❌ Wrong - readonly
data = signal({ name: 'John' });
data.name = 'Jane';  // Error!

// ✅ Correct - use update
data.update(d => ({ ...d, name: 'Jane' }));

// Or set new value
data.set({ name: 'Jane' });
```

---

###### Error: "No provider found for X"

**Symptom**: `NullInjectorError: No provider found for MyService!`

**Cause**: Service not provided in dependency injection

**Solution**:
Add the service to providers:

```typescript
// Option 1: Provide in root
@Injectable({ providedIn: 'root' })
export class MyService {}

// Option 2: Provide in module
@NgModule({
  providers: [MyService],
})
export class MyModule {}

// Option 3: Provide in component
@Component({
  providers: [MyService],
})
export class MyComponent {}
```

---

###### Error: "XHR failed loading: POST http://..."

**Symptom**: Network request fails in browser console

**Cause**: 
- Backend server not running
- CORS issue
- Wrong API endpoint
- 401/403 authentication error

**Solution**:

1. **Check backend is running**:
   ```bash
   # Start mock server if needed
   npm run start:mocks
   ```

2. **Check API endpoint** in `environment.ts`:
   ```typescript
   apiUrl: 'http://localhost:8080',
   ```

3. **Check CORS headers** - backend must allow your origin

4. **Check authentication** - token might be expired

5. **Check network tab** for actual error response

---

###### Error: "ExpressionChangedAfterCheckError"

**Symptom**: `ExpressionChangedAfterCheckError: Expression has changed after it was checked.`

**Cause**: Component property changed during change detection cycle

**Solution**:

```typescript
// ❌ Causes error - changing data during check
ngOnInit() {
  this.items = [];  // Then immediately modified somewhere
}

// ✅ Use setTimeout to defer to next cycle
ngOnInit() {
  setTimeout(() => {
    this.items = [];
  });
}

// ✅ Better - use proper signal/observable pattern
items = signal<Item[]>([]);

ngOnInit() {
  this.itemService.getItems().subscribe(items => {
    this.items.set(items);
  });
}

// ✅ Or use async pipe (best)
items$ = this.itemService.getItems();

// Template
@for (item of items$ | async; track item.id) {
  {{ item.name }}
}
```

---

###### Error: "Maximum call stack size exceeded"

**Symptom**: `RangeError: Maximum call stack size exceeded` or infinite loop

**Cause**:
- Circular dependency
- Infinite recursion
- Signal change causing effect that changes signal

**Solution**:

1. **Identify the cycle**:
   ```typescript
   // ❌ Infinite - signal updates effect that updates signal
   count = signal(0);
   effect(() => {
     this.count.update(c => c + 1);  // Triggers effect again!
   });
   ```

2. **Fix with proper state management**:
   ```typescript
   // ✅ Correct
   count = signal(0);
   
   increment() {
     this.count.update(c => c + 1);
   }
   
   // Or use effect with dependency guard
   effect(() => {
     const current = this.count();
     if (current > 0) {
      // Do something, but don't modify count
    }
   });
   ```

---

###### Error: "Cannot match any routes"

**Symptom**: 404 page shows or wildcard route triggers unexpectedly

**Cause**:
- Route path doesn't match URL
- Route not configured
- Lazy-loading failed

**Solution**:

1. **Check route configuration**:
   ```typescript
   // In app-routes.ts
   const routes: Routes = [
     { path: 'transactions', loadChildren: () => import(...) },
   ];
   ```

2. **Navigate with correct path**:
   ```typescript
   // ✅ Correct
   this.router.navigate(['/transactions']);
   
   // ❌ Wrong - extra slash
   this.router.navigate(['/', 'transactions']);
   ```

3. **Check lazy-loading**:
   ```bash
   # Check network tab for failed chunk loads
   # Rebuild if needed
   nx build transactions-journey
   ```

---

###### Error: "Cannot find module or its corresponding type declarations"

**Symptom**: `error TS2307: Cannot find module '@backbase/my-lib' or its corresponding type declarations.`

**Cause**:
- Module not built
- Path alias not configured
- Module doesn't export the symbol

**Solution**:

```bash
# 1. Build the module
nx build my-lib

# 2. Check it's listed in tsconfig.base.json
cat tsconfig.base.json | grep -A5 "paths"

# 3. Check public API
cat libs/my-lib/src/index.ts
```

---

###### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Symptom**: Browser console shows CORS error for API request

**Cause**: Backend doesn't allow requests from your origin

**Solution**:

1. **Check backend configuration** - must allow your URL
2. **Use proxy during development**:
   ```json
   {
     "/api": {
       "target": "http://localhost:8080",
       "pathRewrite": { "^/api": "" }
     }
   }
   ```

3. **Or use mock server**:
   ```bash
   npm run start:mocks
   ```

---

###### Error: "Route transitions"

**Symptom**: Navigating to a route that doesn't exist

**Solution**:

```typescript
// ✅ Handle errors
this.router.navigate(['/transactions']).catch(err => {
  console.error('Navigation failed', err);
});

// Or in resolver
@Injectable()
export class MyResolver implements Resolve<Data> {
  resolve(route: ActivatedRouteSnapshot): Observable<Data> {
    return this.service.getData().pipe(
      catchError(() => {
        this.router.navigate(['/error']);
        return of(null);
      })
    );
  }
}
```

---

###### Error: "Signal value not updating in template"

**Symptom**: Changing a signal but template doesn't update

**Cause**: Signal not properly used in template

**Solution**:

```typescript
// ❌ Wrong - signal not called
@Component({
  template: `{{ count }}`  // Missing ()
})
export class Component {
  count = signal(0);
}

// ✅ Correct - call signal as function
@Component({
  template: `{{ count() }}`
})
export class Component {
  count = signal(0);
}
```

---

###### Error: "Memory leak - listener never removed"

**Symptom**: Warnings in DevTools, app gets slower over time

**Cause**: Event listeners or subscriptions not cleaned up

**Solution**:

```typescript
// ✅ Use async pipe (auto-cleanup)
@Component({
  template: `{{ data$ | async }}`
})
export class Component {
  data$ = this.service.getData();
}

// ✅ Or manually cleanup
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({...})
export class Component {
  private destroyRef = inject(DestroyRef);
  
  ngOnInit() {
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.process(data));
  }
}

// ❌ Avoid - never cleaned up
subscription = this.service.getData().subscribe(...);
```

---

###### Error: "Validation Error in Form"

**Symptom**: Form always invalid or validation doesn't trigger

**Solution**:

```typescript
// Check form state
if (this.form.valid) {
  console.log('Valid:', this.form.value);
} else {
  console.log('Errors:', this.form.errors);
  // Check which controls have errors
  Object.keys(this.form.controls).forEach(key => {
    const control = this.form.get(key);
    if (control?.errors) {
      console.log(`${key}: ${JSON.stringify(control.errors)}`);
    }
  });
}
```

---

###### Error: "EmptyError: no elements in sequence"

**Symptom**: RxJS error when observable completes without emitting

**Cause**: Using `first()` or similar on empty observable

**Solution**:

```typescript
// ❌ Fails if no items
items$ = this.itemService.getItems().pipe(
  first()  // Throws if empty
);

// ✅ Provide default
items$ = this.itemService.getItems().pipe(
  defaultIfEmpty([]),
  first()
);

// ✅ Or handle error
items$ = this.itemService.getItems().pipe(
  catchError(() => of([]))
);
```




<!-- .documentation/git-workflow/main.md -->
## Git Workflow and Contributing

Guidelines for working with Git, branching strategy, and contributing to this project.

<!-- .documentation/git-workflow/branching-strategy.md -->

### Branching Strategy

This project uses a feature branch workflow with a main branch for production-ready code.

###### Main Branches

**main**
- Production-ready code
- Deployable at any time
- Protected - requires code review
- Tagged with semantic versions

**develop** (if applicable)
- Integration branch for features
- May be less stable than main
- Features merge here before main

###### Feature Branches

Create feature branches from `main`:

```bash
# Create and switch to feature branch
git checkout -b feat/WF-2280-add-new-feature

# Or with main as base
git checkout main
git pull origin main
git checkout -b feat/WF-2280-add-new-feature

# Push to remote
git push origin feat/WF-2280-add-new-feature
```

###### Branch Naming Convention

Follow this naming pattern:

```
feat/JIRA-XXXX-description
fix/JIRA-XXXX-description
chore/JIRA-XXXX-description
docs/JIRA-XXXX-description
refactor/JIRA-XXXX-description
test/JIRA-XXXX-description
```

Examples:
- `feat/WF-2280-update-documentation-after-refactoring`
- `fix/WF-2281-authentication-token-refresh`
- `docs/WF-2282-add-typescript-guidelines`
- `refactor/WF-2283-simplify-journey-logic`

###### Branch Lifecycle

1. **Create**: Branch off from `main`
2. **Develop**: Make commits regularly
3. **Test**: Run tests locally
4. **Push**: Push branch to remote
5. **Review**: Create Pull Request
6. **Merge**: After approval, merge to main
7. **Clean up**: Delete merged branch

```bash
# Create and develop
git checkout -b feat/WF-2280-description
git add .
git commit -m "feat: add new feature"
git push origin feat/WF-2280-description

# After PR is merged
git checkout main
git pull origin main
git branch -D feat/WF-2280-description
git push origin --delete feat/WF-2280-description
```

###### Keeping Branch Updated

Before creating PR, sync with main:

```bash
# Fetch latest from remote
git fetch origin

# Rebase on main (preferred)
git rebase origin/main

# Or merge main (if team prefers)
git merge origin/main

# Push updates
git push origin feat/WF-2280-description -f  # -f if rebased
```

###### Branch Protection Rules

The `main` branch should be protected with:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass (CI/CD)
- ✅ Require branches to be up to date before merging
- ✅ Dismiss stale pull request approvals
- ✅ Require code reviews from CODEOWNERS

###### Handling Merge Conflicts

If your branch has conflicts with main:

```bash
# Option 1: Rebase (cleaner history)
git fetch origin
git rebase origin/main

# Resolve conflicts in your editor, then:
git add .
git rebase --continue

# Or abort if you change your mind
git rebase --abort

# Option 2: Merge (keeps history)
git fetch origin
git merge origin/main

# Resolve conflicts, then:
git add .
git commit -m "Merge main into feature branch"

# Push the merge commit
git push origin feat/WF-2280-description
```

###### Working with Multiple Feature Branches

If working on multiple features:

```bash
# List all branches
git branch -a

# Switch between branches
git checkout feat/WF-2280-feature1
git checkout feat/WF-2281-feature2

# Stash uncommitted changes to switch branches
git stash
git checkout feat/WF-2281-feature2
git stash pop  # Get changes back

# Or commit them
git add .
git commit -m "WIP: work in progress"
```

###### Syncing Fork (if applicable)

If working with a fork:

```bash
# Add upstream remote
git remote add upstream https://github.com/Backbase/golden-sample-app.git

# Fetch upstream changes
git fetch upstream

# Rebase your branch on upstream/main
git rebase upstream/main

# Push to your fork
git push origin feat/WF-2280-description
```


<!-- .documentation/git-workflow/commit-standards.md -->

### Commit Standards

Well-structured commits make history readable and facilitate automated tooling.

###### Commit Message Format

Follow conventional commits format:

```
type(scope): subject

body

footer
```

**Type**: One of
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (not affecting logic)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Build, dependencies, tooling
- `ci` - CI/CD configuration

**Scope**: Component or area affected (optional but recommended)
- `app` - Main app
- `transactions` - Transactions journey
- `transfer` - Transfer journey
- `auth` - Authentication
- `ui` - UI components

**Subject**: Short description (50 chars or less)
- Imperative mood ("add" not "added")
- No period at end
- Lowercase first letter

###### Examples

```
# ✅ Good examples

feat(transactions): add transaction filtering
fix(auth): refresh token on 401 response
docs(contributing): add commit standards
refactor(transfer): simplify form logic
perf(transactions): memoize filtered list
test(auth): add guard tests
chore(deps): update Angular to v20

# ❌ Bad examples

Added new feature                          # No type
feat: fix transaction page                 # Wrong type
feat(WF-2280): Update Documentation...    # JIRA issue not in subject
fixed stuff                                # Vague and lowercase type
```

###### Commit Body

For complex changes, include a body explaining why:

```
feat(transactions): add export to PDF

Implement PDF export functionality for transaction lists.
This allows users to download their transactions for offline access.

The implementation:
- Uses jsPDF for PDF generation
- Formats data into a table layout
- Includes headers with date range

Closes WF-2280
```

###### Commit Footer

Reference related issues and PRs:

```
Closes #123
Fixes WF-2280
Related to WF-2281
Co-authored-by: Jane Doe <jane@example.com>
```

###### Pre-commit Hooks

Use Husky to enforce standards:

```bash
# Will run before each commit
npm run pre-commit

# This runs:
# - Linting
# - Tests
# - Type checking
```

If hooks fail, fix issues before committing:

```bash
# Fix linting automatically
npm run lint -- --fix

# Then commit again
git add .
git commit -m "feat: your message"
```

###### Staging and Committing

Commit related changes together:

```bash
# ✅ Good - related changes in one commit
git add src/lib/transactions.service.ts
git add src/lib/transactions.component.ts
git commit -m "feat(transactions): add filtering"

# ✅ Also good - stage files with git add -p
git add -p
# Choose which hunks to stage

# ❌ Avoid - mixing unrelated changes
# Don't add auth changes and transaction changes in same commit
```

###### Amending Commits

Fix the last commit (if not pushed yet):

```bash
# Make changes
git add .

# Amend previous commit (keeps same message)
git commit --amend --no-edit

# Or edit the message
git commit --amend

# If already pushed, force push (use carefully!)
git push origin feat/WF-2280-description --force-with-lease
```

###### Interactive Rebase

Clean up commits before pushing:

```bash
# Start interactive rebase of last 3 commits
git rebase -i HEAD~3

# Choose actions:
# pick - use commit
# reword - use but edit message
# squash - combine with previous
# fixup - combine and discard message
```

Example:

```
pick b4d5e12 feat: add feature
fixup a3c1f78 fix: typo in feature
pick 9e2k3l1 feat: add related feature
```

Result: Two commits instead of three, with the typo fix squashed into the main feature.

###### Checking Commit History

```bash
# View recent commits
git log --oneline -10

# View commits for a file
git log --oneline -- src/lib/transactions.service.ts

# View what changed in each commit
git log -p -5

# View graphical history
git log --graph --oneline --decorate
```

###### Push Strategy

Push regularly to avoid large changesets:

```bash
# After each logical feature
git push origin feat/WF-2280-description

# Or multiple times a day
git add .
git commit -m "feat: checkpoint 1"
git push origin feat/WF-2280-description

# Continue work
git add .
git commit -m "feat: checkpoint 2"
git push origin feat/WF-2280-description
```

###### Reverting Commits

If you need to undo a commit:

```bash
# View commit hash
git log --oneline

# Revert (creates new commit)
git revert <commit-hash>

# Or reset (removes commit locally)
git reset --soft <commit-hash>  # Keep changes
git reset --hard <commit-hash>  # Discard changes

# If already pushed, revert instead of reset
git revert <commit-hash>
git push origin feat/WF-2280-description
```

###### Common Commit Scenarios

**Multiple small fixes that should be one commit**:
```bash
# Make fixes
git add fix1.ts
git commit -m "WIP: fix 1"
git add fix2.ts
git commit -m "WIP: fix 2"

# Squash them
git rebase -i HEAD~2
# Change second 'pick' to 'squash'

# Rename
git commit --amend -m "fix(auth): multiple authentication issues"
```

**Oops, committed to wrong branch**:
```bash
# Check out correct branch
git checkout feat/WF-2280-description

# Cherry-pick the commit
git cherry-pick <commit-hash>

# Go back to wrong branch and undo
git checkout wrong-branch
git reset --hard HEAD~1
```

**Committing part of a file**:
```bash
# Interactive staging
git add -p

# Choose which hunks to stage
# Stage hunks you want, skip others

# Commit staged hunks
git commit -m "feat: add feature (partial)"

# Later, commit remaining hunks
git add -p
git commit -m "feat: add feature (part 2)"
```


<!-- .documentation/git-workflow/code-review.md -->

### Code Review Process

Guidelines for reviewing and approving code changes.

###### Pull Request Workflow

**1. Create Pull Request**

```bash
# Push feature branch
git push origin feat/WF-2280-description

# Create PR on GitHub/GitLab with:
# - Clear title (same as commit subject)
# - Description of changes
# - Link to related issues/JIRA
# - Screenshot if UI changes
```

**2. PR Template**

Include this information:

```markdown
## Description
Brief description of the changes

## Related Issues
Closes #123
Related to WF-2280

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Steps to verify the changes:
1. Run `npm start`
2. Navigate to /transactions
3. ...

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Accessibility checked
- [ ] Performance impact assessed
```

**3. Code Review**

Reviewer should check:
- ✅ Code follows guidelines (see Best Practices)
- ✅ Tests are adequate
- ✅ No console errors or warnings
- ✅ Performance is acceptable
- ✅ Documentation is clear
- ✅ No breaking changes (or documented)
- ✅ Follows commit standards

**4. Approval and Merge**

```bash
# After approval, merge PR
git checkout main
git pull origin main
git merge origin/feat/WF-2280-description
git push origin main

# Or squash (cleaner history)
git merge --squash origin/feat/WF-2280-description
git commit -m "feat(transactions): add new feature"
git push origin main

# Delete branch
git branch -D feat/WF-2280-description
git push origin --delete feat/WF-2280-description
```

###### Review Checklist for Reviewers

**Code Quality**
- [ ] Code is clear and well-structured
- [ ] Variable names are descriptive
- [ ] Functions are small and focused
- [ ] Complex logic is commented
- [ ] No code duplication

**Best Practices**
- [ ] Uses correct patterns (standalone components, signals, etc.)
- [ ] OnPush change detection used
- [ ] Services provided correctly
- [ ] No memory leaks (unsubscribed from observables)
- [ ] Types are properly defined (no `any`)

**Testing**
- [ ] Unit tests added for new code
- [ ] Tests are meaningful (not just coverage)
- [ ] Edge cases are tested
- [ ] Tests pass locally

**Performance**
- [ ] No unnecessary re-renders
- [ ] Appropriate use of memoization (computed)
- [ ] No O(n²) algorithms
- [ ] Images are optimized

**Accessibility**
- [ ] ARIA labels where appropriate
- [ ] Keyboard navigation works
- [ ] Color contrast is adequate
- [ ] Focus indicators visible

**Documentation**
- [ ] README updated if relevant
- [ ] Inline comments explain complex logic
- [ ] Public APIs are documented
- [ ] Breaking changes documented

**Security**
- [ ] No hardcoded secrets
- [ ] Input is validated
- [ ] CSRF protection if needed
- [ ] XSS prevention (Angular template escaping)

###### Review Comments Best Practices

**Be Constructive**

❌ **Bad**: "This is wrong"
✅ **Good**: "This approach might have performance issues. Consider using memoization instead."

**Ask Questions**

❌ **Bad**: "Add unit tests"
✅ **Good**: "Can you add a unit test for the error case? I want to ensure we handle invalid input correctly."

**Suggest Code**

```suggestion
// Original
const name = user.firstName + ' ' + user.lastName;

// Suggestion
const name = `${user.firstName} ${user.lastName}`;
```

**Approve with Comments**

- Approve if changes are good with minor fixes
- Request changes if there are serious issues
- Comment if you have suggestions but approve

###### Addressing Review Comments

1. **Read carefully** - Understand the concern
2. **Ask for clarification** - If comment is unclear
3. **Make changes** - Or explain why not needed
4. **Reply to comments** - Explain your changes
5. **Re-request review** - After making updates

```
✅ Example reply:
"Good point! I've refactored the loop to use a more efficient algorithm.
See commit 5e3a1c for changes."

✅ Example disagreement:
"I see your point, but I think the current approach is clearer for this
use case. The performance impact is negligible (<1ms). However, I'm open
to reconsider if you have concerns."
```

###### Common Review Issues

**Issue: Too many changes in one PR**

Solution: Split into smaller PRs
- Easier to review
- Easier to revert if needed
- Easier to understand history

**Issue: PR sitting without review**

Solution:
- Ping reviewers in Slack/Teams
- Keep PR small so easier to review
- Be patient (24-48 hours typical)

**Issue: Disagreement with reviewer**

Solution:
- Discuss in PR comment
- Or schedule a quick call
- Team lead can make final decision if needed

**Issue: PR needs large refactor after review**

Solution:
- Discuss if refactor is necessary
- Or create follow-up PR after merge
- Keep current PR focused on original change

###### After Merge

1. **Verify deployment** - Check that changes are live
2. **Monitor** - Watch for errors in logs/monitoring
3. **Clean up** - Delete local and remote branch
4. **Update tracking** - Mark JIRA ticket as done
5. **Celebrate** - Great work!

```bash
# Clean up local
git branch -D feat/WF-2280-description

# Verify remote is cleaned
git branch -r | grep WF-2280  # Should be empty
```

###### Advanced Review Techniques

**Review in order**:
1. Understand the context (PR description, related issues)
2. Check architecture/design
3. Check implementation details
4. Check tests
5. Check documentation

**Look for anti-patterns**:
- ❌ Circular dependencies
- ❌ Tight coupling
- ❌ Memory leaks
- ❌ Race conditions
- ❌ Magic numbers (hardcoded values)

**Check the diff strategically**:
- Focus on additions and changes
- Understand why code was deleted
- Look at context (few lines before/after)
- Consider performance impact




<!-- .documentation/analytics/main.md -->
### Analytics
Integrate Analytics in your application or journey using @backbase/foundation-ang@8.0.0 or higher. 
- Check how to add Analytics to your app [here](https://backbase.io/documentation/web-devkit/app-development/add-analytics-tracker-web-app)
- Check how to integrate Analytics to your journey [here](https://backbase.io/documentation/web-devkit/journey-development-basics/add-analytics-tracker-web-journey)

<!-- .documentation/further-help/main.md -->
## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
