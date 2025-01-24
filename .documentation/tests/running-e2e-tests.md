<!-- .documentation/tests/running-e2e-tests.md -->
#### Running end-to-end tests !heading

Run `npm run e2e` to run the default e2e tests suite that runs on the CI.

Use one of the following commands to run a different set of tests:

- `npm run e2e-test-mocks` - run all the tests against mocks data,
- `npm run e2e-test-sndbx-all` - run all the tests against sandbox env,
- `npm run e2e-test-sndbx-ci` - run sandbox CI tests suite,
- `npm run e2e-test-responsive` - run only visual mobile tests.

For more information on playwright tests see [playwright-readme.md](/apps/golden-sample-app-e2e/playwright-readme.md).
