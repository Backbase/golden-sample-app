# Golden Sample Angular App

This example project is a reference implementation to showcase a number of best practices to use when building a new Angular SPA that leverages Backbase components and libraries. The project is regularly updated, so come back often to check for new improvements.

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

## Package as a runnable Docker container

Run `ng build:docker` after a successful build to create a Docker image). Start a new container with `npm run start:docker`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Custom icons

There are examples of custom icons in the project. For every case there is a `scss` file in the `/src` directory. It's possible to run the project with different sets of custom icons. Here are some details on every set:
* `npm run start:custom_icons:styles_replace-entire-icon-font-when-icon-names-match` - runs the project with `Material Icons Round` icon font instead of `Material Icons Outlined`. All icon names are exaclty the same in both fonts
* `npm run start:custom_icons:replace-entire-icon-font-when-icon-names-dont-match` - runs the project with the `Icon Moon` font instead of `Material Icons Outlined`. Some icon names in both fonts don't match
* `npm run start:custom_icons:replace-some-icons` - runs the project with the `Icon Moon` font for some icons only. The rest of icons use `Material Icons Outlined`
* ` npm run start:custom_icons:replace-icon-with-svg` - runs the project with the the custom `SVG` icons replacement 
