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
      * [Configure journeys](#configure-journeys)
      * [Communication service or how to communicate between journeys](#communication-service-or-how-to-communicate-between-journeys)
      * [Simple examples of journeys](#simple-examples-of-journeys)
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
- **ACH Positive Pay Journey:** Configured in [`ach-positive-pay-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/ach-positive-pay/ach-positive-pay-journey-bundle.module.ts)
- **Transfer Journey:** Configured in [`transfer-journey-bundle.module.ts](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/transfer/transfer-journey-bundle.module.ts)
- **Custom Payment Journey:** Configured in [`initiate-payment-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/custom-payment/initiate-payment-journey-bundle.module.ts)

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

We've also provided an example implementation of an `AuthInterceptor` in the app module. The purpose of this interceptor is to catch 401 errors and attempt to refresh the user's access token. If this refresh is successful the original request will be replayed with the new access token. If the refresh fails, or the original error was not a 401, then we surface the original error to the calling code.


Follow the next steps to add authentication to your app:
* Set up the configuration in the `environment.ts` files.
  * Import [`AuthConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts#L6)
  * Create an [`authConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts#L34-L63) object and export it.
* Make changes to the `app.module.ts` file.
  * Import [everything necessary](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L30-L36) from [`angular-oauth2-oidc`](https://github.com/manfredsteyer/angular-oauth2-oidc)
  * Import [`authConfig` and `environment`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L38)
  * Import [`AuthEventsHandlerService`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L42)
  * Import [`AuthInterceptor`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L44)
  * Set the [`AuthConfig` provider to return `authConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L94) 
  * Set the [`HTTP_INTERCEPTORS` to use `AuthInterceptor`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L95-L99)
  * Set the [`OAuthModuleConfig`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L105-L113) to use the environment configuration.
  * Set the [`OAuthStorage`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L114) to use `localStorage`.
  * Enable the app to wait for authentication services to be handled before the app is initialized by setting the [`APP_INITIALIZER`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L117-L142)  
* Make changes to those routes you want to secure by setting your route guards.
  * Create an `auth.guard.ts` file if you didn't have it yet.
  (https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/auth/guard/auth.guard.ts)
  * Export [`AuthGuard`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/auth/guard/auth.guard.ts#L10-L43) to use it in routes you want to secure.
  * Import [`AuthGuard`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app-routing.module.ts#L5) in `app-routing-module.ts` file
  * Add [`canActivate` and pass `AuthGuard` into it](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app-routing.module.ts#L22) to the route you want to secure.


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
- `npm run e2e-test-a11y` - run only web accessibility tests.

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

<!-- .documentation/journeys/configure.md -->
#### Configure journeys

  - This is [an example](https://github.com/Backbase/golden-sample-app/blob/main/libs/transactions-journey/internal/data-access/src/lib/services/transactions-journey-config/transactions-journey-config.service.ts) of how the journey configuration might be defined in the application

  - By default, it will provide some value intended by the journey developers and exported by public API. Check the [`index.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/transactions-journey/src/index.ts), however, you can customize values during the creation of applications like [`transactions-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/transactions/transactions-journey-bundle.module.ts#L15)
  
<!-- .documentation/journeys/communication-service.md -->
#### Communication service or how to communicate between journeys

  - There are 3 parts of the communication chain:
    - Source journey (the one that will send some data or signal) should define and export. Check the [`make-transfer-communication.service.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/transfer-journey/internal/data-access/src/lib/services/make-transfer-communication/make-transfer-communication.service.ts)
    - The destination journey (the one that will receive the data of signal) should also define the interface of the service that it expects. Check the [`communication/index.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/transactions-journey/internal/data-access/src/lib/services/transactions-journey-communication/transactions-journey-communication.service.ts)
    - The actual implementation of the service lives on the application level and must implement both of the available interfaces (or abstract classes) from source and destination journeys. Check the example [`journey-communication.service.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/services/journey-communication.service.ts)
    - Do not forget, that communication service from the application level should be provided to the journeys modules in the bundle files (to avoid breaking lazy loading). Check the [`transactions-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/transactions/transactions-journey-bundle.module.ts)
  - The general explanation of the communication service idea and its theoretical underlying can be found in [Understand communication between journeys](https://backbase.io/documentation/web-devkit/journey-development-advanced/communication-between-journeys)

<!-- .documentation/journeys/simple-examples.md -->
#### Simple examples of journeys

  - [transactions](https://github.com/Backbase/golden-sample-app/tree/main/libs/transactions-journey)
  - [transfer](https://github.com/Backbase/golden-sample-app/tree/main/libs/transfer-journey)

<!-- .documentation/journeys/custom-component.md -->
#### Custom component example

  - [How to](./apps/golden-sample-app/src/app/custom-payment/README.md) add a custom component to Initiate Payments Journey


<!-- .documentation/analytics/main.md -->
### Analytics
Integrate Analytics in your application or journey using @backbase/foundation-ang@8.0.0 or higher. 
- Check how to add Analytics to your app [here](https://backbase.io/documentation/web-devkit/app-development/add-analytics-tracker-web-app)
- Check how to integrate Analytics to your journey [here](https://backbase.io/documentation/web-devkit/journey-development-basics/add-analytics-tracker-web-journey)

<!-- .documentation/further-help/main.md -->
## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
