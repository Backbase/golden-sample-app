// Source: apps/golden-sample-app-e2e/src/specs/adopted-tests/transactions-list.spec.ts — 3 integration examples.
import { expect } from '@playwright/test';
import {
  integrationVendorSeed,
  TransactionsResponseBuilder,
} from '../../data/mocks-data';
import { test, testData } from '../../fixtures/transactions.fixture';

const data = testData();

let suiteStartedAt: number;

test.describe(
  'Transactions list — integration examples',
  { tag: ['@integration', '@transactions', '@mocks'] },
  () => {
    test.beforeAll(({}, workerInfo) => {
      suiteStartedAt = Date.now();
      expect(
        data.transactionList.size,
        'Mocked transactions dataset must be populated before the integration suite runs'
      ).toBeGreaterThan(0);
      console.info(
        `[transactions-list.integration] Suite starting on worker ${workerInfo.workerIndex} with ${data.transactionList.size} mocked rows`
      );
    });

    test.afterAll(({}, workerInfo) => {
      const elapsedSeconds = Math.max(
        0,
        Math.round((Date.now() - suiteStartedAt) / 1000)
      );
      console.info(
        `[transactions-list.integration] Suite finished on worker ${workerInfo.workerIndex} in ${elapsedSeconds}s`
      );
    });

    test.describe(
      'Example 1 — Good integration test: single boundary, deterministic mocks',
      () => {
        test('renders the mocked transactions list with stable counts and recipients', async ({
          transactionsPage,
          transactionsMockSetup,
        }) => {
          await transactionsMockSetup(data.transactionList);
          await transactionsPage.open();

          await expect(
            transactionsPage.transactions.items,
            `Expect "${data.transactionList.size}" transaction rows to render from the mocked /v2/transactions payload`
          ).toHaveCount(data.transactionList.size);

          await expect(
            transactionsPage.transactions.recipients,
            'Expect the rendered recipients to match the mocked dataset in order'
          ).toHaveText(data.recipients);
        });
      }
    );

    test.describe(
      'Example 2 — Test data setup and cleanup: per-test seed and explicit unrouting',
      () => {
        test.beforeEach(async ({ transactionMockSetup }) => {
          await transactionMockSetup([integrationVendorSeed]);
        });

        test.afterEach(async ({ page }) => {
          await page.unrouteAll({ behavior: 'ignoreErrors' });
        });

        test('finds the seeded transaction via the search box and tears down its routes after the test', async ({
          transactionsPage,
        }) => {
          await transactionsPage.open();
          await transactionsPage.search.fill(integrationVendorSeed.recipient!);

          await expect(
            transactionsPage.transactions.items,
            `Expect exactly one row to match the seeded recipient "${integrationVendorSeed.recipient}"`
          ).toHaveCount(1);

          await expect(
            transactionsPage.transactions.recipients.first(),
            `Expect the seeded recipient "${integrationVendorSeed.recipient}" to be rendered verbatim`
          ).toHaveText(integrationVendorSeed.recipient!);
        });
      }
    );

    test.describe(
      'Example 3 — External dependency handling: explicit 200 and 500 responses via page.route(...)',
      () => {
        test('renders the mocked transactions when /v2/transactions returns a custom 200 payload', async ({
          page,
          transactionsPage,
          transactionsMockSetup,
        }) => {
          await transactionsMockSetup(data.transactionList);

          const customResponse = TransactionsResponseBuilder.twoVendorSuccess();

          await page.route('**/v2/transactions', (route) =>
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(customResponse),
            })
          );

          await transactionsPage.open();

          await expect(
            transactionsPage.transactions.items,
            'Expect 2 transaction rows to render from the custom 200 payload'
          ).toHaveCount(2);

          await expect(
            transactionsPage.transactions.recipients,
            'Expect the rendered recipients to match the custom 200 payload in order'
          ).toHaveText([
            TransactionsResponseBuilder.ACME_COFFEE_SEED.recipient!,
            TransactionsResponseBuilder.CITY_LIBRARY_SEED.recipient!,
          ]);
        });

        test('renders zero transaction rows when the upstream transactions service is unavailable', async ({
          page,
          transactionsPage,
          transactionsMockSetup,
        }) => {
          await transactionsMockSetup(data.transactionList);

          await page.route('**/v2/transactions', (route) =>
            route.fulfill({
              status: 500,
              contentType: 'application/json',
              body: JSON.stringify({
                message: 'Upstream transactions service unavailable',
              }),
            })
          );

          await transactionsPage.open();

          await expect(
            transactionsPage.transactions.items,
            'Expect zero transaction rows when the upstream dependency returns 500'
          ).toHaveCount(0);
        });
      }
    );
  }
);
