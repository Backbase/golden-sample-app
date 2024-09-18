# Golden Sample Angular App

This golden sample provides examples of the code structure, configuration, and best practices for using the Backbase Angular tools.

## Table of Contents

- [Golden Sample Angular App](#golden-sample-angular-app)
  - [Table of Contents](#table-of-contents)
  - [Overview of the app](#overview-of-the-app)
    - [Components included in the app](#components-included-in-the-app)
  - [Prerequisites](#prerequisites)
  - [Authentication](#authentication)
    - [Important Info](#important-info)
    - [How to add authentication to your app](#how-to-add-authentication-to-your-app)
  - [Generate an application](#generate-an-application)
  - [Generate a library](#generate-a-library)
  - [Load app on a development server](#load-app-on-a-development-server)
  - [Code scaffolding](#code-scaffolding)
  - [Build](#build)
  - [Tests](#tests)
  - [Understand your workspace](#understand-your-workspace)
  - [Running with docker](#running-with-docker)
  - [Package as a runnable Docker container](#package-as-a-runnable-docker-container)
  - [Experimental branches](#experimental-branches)
  - [Further help](#further-help)

## Overview of the app

This project is a complete reference implementation for building a new Angular single page application(SPA) with Backbase components and libraries. It includes best practices that front-end developers can use to build their own web applications.

This README provides an overview and set-up of the app, and further guidance is provided as comments in the code to further guide you.

The project uses the latest versions of the tools and libraries.

### Components included in the app

- Auth module: define authentication
- Locale selector for SPA: support multiple languages. Check the example codes [here](https://github.com/Backbase/golden-sample-app/tree/master/apps/golden-sample-app/src/app/locale-selector)
- Entitlements: configure [entitlements](https://community.backbase.com/documentation/foundation_angular/latest/entitlements) for different scenarios. Check the example code in the [`app.component.html`](https://github.com/Backbase/golden-sample-app/blob/738df3de9fb15f96c9fa2017d00269ced63bebaa/apps/golden-sample-app/src/app/app.component.html#L50) and [`entitlementsTriplets.ts`](https://github.com/Backbase/golden-sample-app/blob/master/apps/golden-sample-app/src/app/services/entitlementsTriplets.ts)
- Configure journeys
  - This is [an example](https://github.com/Backbase/golden-sample-app/blob/master/libs/transactions/src/lib/services/transactions-journey-config.service.ts) of how the journey configuration might be defined in the application
  - By default, it will provide some value intended by the journey developers and exported by public API. Check the [`index.ts`](https://github.com/Backbase/golden-sample-app/blob/master/libs/transactions/src/index.ts#L1), however, you can customize values during the creation of applications like [`transactions-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/master/apps/golden-sample-app/src/app/transactions/transactions-journey-bundle.module.ts#L15)
- Communication service or how to communicate between journeys

  - There are 3 parts of the communication chain:
    - Source journey (the one that will send some data or signal) should define and export. Check the [`make-transfer-communication.service.ts`](https://github.com/Backbase/golden-sample-app/blob/master/libs/transfer/src/lib/services/make-transfer-communication.service.ts)
    - The destination journey (the one that will receive the data of signal) should also define the interface of the service that it expects. Check the [`communication/index.ts`](https://github.com/Backbase/golden-sample-app/blob/master/libs/transactions/src/lib/communication/index.ts)
    - The actual implementation of the service lives on the application level and must implement both of the available interfaces (or abstract classes) from source and destination journeys. Check the example [`journey-communication.service.ts`](https://github.com/Backbase/golden-sample-app/blob/master/apps/golden-sample-app/src/app/services/journey-communication.service.ts)
    - Do not forget, that communication service from the application level should be provided to the journeys modules in the bundle files (to avoid breaking lazy loading). Check the [`transactions-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/master/apps/golden-sample-app/src/app/transactions/transactions-journey-bundle.module.ts)
  - The general explanation of the communication service idea and its theoretical underlying can be found in [Understand communication between journeys](https://community.backbase.com/documentation/foundation_angular/latest/communicate_between_journeys)

- Simple examples of journeys such as [transactions](https://github.com/Backbase/golden-sample-app/tree/master/libs/transactions) and [transfer](https://github.com/Backbase/golden-sample-app/tree/master/libs/transfer)
- [How to](./apps/golden-sample-app/src/app/custom-payment/README.md) add a custom component to Initiate Payments Journey
- Analytics: Integrate Analytics in your application or journey using @backbase/foundation-ang@8.0.0. Check the detailed documentation [here](https://community.backbase.com/documentation/foundation_angular/latest/analytics-tracker-web)

## Prerequisites

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

## Authentication

### Important Info

The code that is used for authentication is not for production purposes, this is the example to understand the concepts lying under the hood.
Do not copy-paste anything related to the authentication to your banking application.

### How to add authentication to your app

Check the example code in the [`app.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.module.ts#L46), the related `AuthConfig` in the[`environment.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/environments/environment.ts#L44) files, and the `APP_INITIALIZER` provider logic.
Secure routes with `AuthGuard`s. We rely on <https://github.com/manfredsteyer/angular-oauth2-oidc>, check their documentation for more details.

We've provided the `AuthEventsHandlerService` via the `APP_INITIALIZER` which will handle auth events from the above 3rd party library. This service is an example implementation of how we expect applications to handle auth events. It includes the following default settings:

- The access token will be refreshed when it expires automatically.
- When token refresh, code exchange, or session errors occur the user is automatically logged out.
- A login using an invalid state parameter will be returned to the Auth server. This will likely result in a return to the application, however, in they will now have passed a valid state parameter.

We've also provided an example implementation of an `AuthInterceptor` in the app module. The purpose of this interceptor is to catch 401 errors and attempt to refresh the user's access token. If this refresh is successful the original request will be replayed with the new access token. If the refresh fails, or the original error was not a 401, then we surface the original error to the calling code.

## Generate an application

Run `ng g @nx/angular:app my-app` to generate an application.

> You can also use Nx Console to generate libraries as well.

When using [Nx](https://nx.dev/), you can create multiple applications and libraries in the same workspace.

After the app has been generated, use tags in `nx.json` and `.eslintrs.json` to impose constraints on the dependency graph. [Nx Tags](https://nx.dev/structure/monorepo-tags)

## Generate a library

Run `ng g @nx/angular:lib my-lib` to generate a library.

> You can also use Nx Console to generate libraries as well.

Libraries can be shared across libraries and applications. You can import them from `@backbase/mylib`.

## Load app on a development server

Run `npm run start` for a dev server. Navigate to <http://0.0.0.0:4200/>. The app will automatically reload if you change any of the source files.

## User credentials

Credentials to login can be found [here](https://backbase.io/ebp-sandbox/user-credentials).

## Running the app with Mocks

Run `npm run mock-server` for bringing up the mock server followed by `npm run start:mocks` for running the application locally with mocks.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

To run the project on a development server, run
`ng build my-app

The build artifacts are stored in the `dist/` directory.

To build the app to production, use the `--prod` flag.

## Tests

- Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

- Running end-to-end tests

Run `npx playwright test`

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Running with docker

Run `npm run build:start:docker` to startup the docker container with the application

## Package as a runnable Docker container

Run `ng build:docker` (after a successful build with `ng build`) to create a Docker image. Start a new container with `npm run start:docker`.

## Experimental branches

_nojira/without-positive-pay_ resolves issues with M1 chip devices.

_feature/content-from-drupal-integration-reference_ showcases integration with Drupal.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
