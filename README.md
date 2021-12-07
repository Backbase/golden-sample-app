# Golden Sample Angular App

This example project is a reference implementation to showcase a number of best practices to use when building a new Angular SPA that leverages Backbase components and libraries. The project is regularly updated, so come back often to check for new improvements.

## Rendering content from Drupal

!important the code in this branch is only one way of integrating frontend applications using Backbase products with Drupal CMS. You are not limited to this reference implementation and can decide yourself how to better handle this functionality of rendering content items in the application.

### Terminology

Simple article - this is the basic content type from Drupal. Its instances will respond with the whole HTML page, check `simple-content-example.component` to get more details.

Structured content - this is the common term to identify the content item that has some predefined scheme (custom content type). It can be JSON-like key-value pairs with text, number, or boolean types, to check the example visit `structured-content-example.component`. Also, it may have references to other content items (link to other articles, images etc.), for details can be found in the `structured-content-example-with-refs`.

### Requirements:

- Drupal instance up and running on the http://127.0.0.1:80/ (if the port is different for you adjust `proxy.drupal.config.json`);
- Content items are present in the scope of the Drupal instance (in case of other ids, the `content-example.service.ts` should be adjusted to the actual identifiers):
* ID 1 - simple article HTML example 
* ID 2 - structured content with custom item type without references
* ID 3 - structured content with custom item type and with references to other content items

## Authentication details

### Prerequisites:
- Go through the [documentation page](https://community.backbase.com/documentation/foundation_angular/latest/authenticate_users) first to avoid any confusion with implementing authentication in the modelless app 

### Important!

The code that is used for authentication is not for production purposes, this is the example to understand the concepts lying under the hood.
Do not copy-paste anything related to the authentication to your banking application.

### How to add authentication to your app

1. Import `WebSdkModule.forRoot()` to the app module and add the auth config.
2. Create `AppAuthService` that will use `AuthService` from `@backbase/foundation-ang/auth`.
3. Use `AuthGuard` and/or `AuthInterceptor` directly or as base classes.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Running with docker

Run `ng build --configuration production` and then `docker-compose up` to startup the docker container with the application

## Package as a runnable Docker container

Run `ng build:docker` (after a successful build with `ng build`) to create a Docker image. Start a new container with `npm run start:docker`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
