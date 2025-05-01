# Golden Sample Playwright Guide

## Playwright General Information

Playwright tests are located in the `apps/golden-sample-app-e2e` directory. Below is a brief explanation of items contained within.

- Spec files are constructed with a top level `test.describe` block and can contain multiple `test` blocks. In addition to this playwright allows you to use multiple `test.step` blocks inside a `test` block.
  - `test.step` blocks will assert on each step. This is useful if you have a certain journey or path you want to run through and makes debugging easier.

To run a subset of tests you can either give individual tests `test.only` syntax or you can tag entire `test.describe` blocks with a unique tag and use `--grep @tag-name` in your command when running tests.

- You can exclude tests with certain tags by adding the argument `--grep-invert @tag-name` to your command.

Extensive documentation can be viewed on the [official playwright documentation](https://playwright.dev/docs/intro).

## Playwright Configuration

Playwright tests use configuration files usually named by default `playwright.config.ts` (although you can rename them to anything you want so long as it has the appendage `config.ts`). The `playwright.config.ts` file is located in the root directory.
For more information visit the [official playwright configuration documentation](https://playwright.dev/docs/test-configuration) url. This guide only touches on basic parameters in the config file: \

- `testDir` if you want to run tests in different directory.
- `baseURL` if you want to run against an alternative url such as an application with a different port or dev/prod environment.
- `projects` if you want to change what browsers/devices/resolution etc... are tested against.

### Running Playwright Tests

To run playwright tests the golden sample web app needs to be running. It can be run with and without mocks. For the majority of test cases running with mocks is sufficient:

- In terminal 1: `npm run mock-server`
- In terminal 2: `npm run start:mocks`
- Navigate to [http://localhost:4200/](http://localhost:4200/) in your browser to view the app

There are two ways to execute the tests. The first method is to use the npm commands (see [package.json](../../package.json)) or you can build up the command using `npx playwright test` followed by the test parameters, eg `npx playwright test --project 'mobile chrome --grep '@visual' --grep '@responsive' --workers=2'`.

## Visual Tests

Visual testing is carried out using Playwright's own visual testing solution which uses the [pixelmatch library](https://github.com/mapbox/pixelmatch). More information can be found [here](https://playwright.dev/docs/test-snapshots).\
Due to the nature of **Playwright visual not being platform-agnostic** if you want to run tests on different browsers you will need to generate snapshots for each browser. Bear in mind currently all snapshots are stored in repo and will gradually cause your repo to increase in size as everything is stored in git history.

### Creating Visual Tests

Visual tests are almost like any other playwright test. In the examples inside this repo a [visual-validator](../golden-sample-app-e2e/utils/visual-validator.ts) util has been created that contains methods for carrying out visual validation. These are accessed using fixtures in the regular playwright manner and are defined in the [test-runner](../golden-sample-app-e2e/page-objects/test-runner.ts). This should make the tests easier to maintain. An example spec with visual tests can be viewed in the [transactions.visual.spec.ts](../golden-sample-app-e2e/specs/transactions.visual.spec.ts).

## Accessibility Tests

Accessibility testing is carried out using the [axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright) npm library. This uses the standard set of [axe rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md) for checking a subset of accessibility criteria. Automated accessiblity tests using axe-core are not substitute for manual testing but should compliment manual testing.

### Creating Accessibility Tests

Accessibily tests are written in the same way as any other playwright test. The examples in this repo we use an [accessibility](../golden-sample-app-e2e/utils/a11y/a11y-expect.ts) util that extends playwright expect so that it can be used as you would other playwright assertions. An example spec with accessibily tests can be viewed in the [transactions.a11y.spec.ts](../golden-sample-app-e2e/specs/transactions.a11y.spec.ts).
