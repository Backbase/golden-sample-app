/**
 * This file is just to test the toOverflowViewPort matcher.
 * It deoes not test the application
 */
import { test } from '@playwright/test';
import { expect } from '../../expect/expect';

/**
 * Unit-style coverage for the `toOverflowViewPort` matcher's handling of the
 * WCAG 2.1 SC 1.4.10 (Reflow) exception for content that requires
 * two-dimensional layout (data tables, maps, diagrams, video, ...) and for
 * clipped, visually-hidden content.
 *
 * These tests are self-contained (page.setContent) and do not need the app or
 * the mock server.
 */
test.describe(
  'toOverflowViewPort — WCAG 1.4.10 overflow exceptions',
  { tag: ['@a11y', '@e2e', '@viewport'] },
  () => {
    test.use({ viewport: { width: 320, height: 600 } });

    const wideTable = `
      <table style="width: 800px; border-collapse: collapse;">
        <tbody>
          <tr>
            <td>Account</td>
            <td>Date</td>
            <td>Description with a fairly long label</td>
            <td>Category</td>
            <td>Reference number</td>
            <td>Amount</td>
          </tr>
        </tbody>
      </table>`;

    test('passes when wide content sits inside a horizontal scroll container', async ({
      page,
    }) => {
      await page.setContent(`
        <body style="margin: 0;">
          <div id="root" style="width: 320px;">
            <p>Transactions</p>
            <div style="overflow-x: auto; width: 100%;">${wideTable}</div>
          </div>
        </body>`);

      const root = page.locator('#root');

      await expect(root).not.toOverflowViewPort();
    });

    test('still fails when the same wide content has no scroll container', async ({
      page,
    }) => {
      await page.setContent(`
        <body style="margin: 0;">
          <div id="root" style="width: 320px;">
            <p>Transactions</p>
            <div style="width: 100%;">${wideTable}</div>
          </div>
        </body>`);

      const root = page.locator('#root');

      await expect(root).toOverflowViewPort();
    });

    // Screen-reader-only labels (Bootstrap `.visually-hidden`) collapse to a
    // 1px clipped box while keeping their full text for assistive tech. Their
    // scrollWidth >> clientWidth, but overflow:hidden means nothing renders
    // outside the box, so they must not be reported as overflow.
    test('passes for visually-hidden (clipped) labels with wide content', async ({
      page,
    }) => {
      await page.setContent(`
        <body style="margin: 0;">
          <style>
            .visually-hidden {
              position: absolute !important;
              width: 1px !important;
              height: 1px !important;
              padding: 0 !important;
              margin: -1px !important;
              overflow: hidden !important;
              clip: rect(0, 0, 0, 0) !important;
              white-space: nowrap !important;
              border: 0 !important;
            }
          </style>
          <div id="root" style="width: 320px;">
            <label class="visually-hidden">Currency List Dropdown</label>
            <label class="visually-hidden">Integer amount field label</label>
            <input type="text" style="width: 100%; box-sizing: border-box;" />
          </div>
        </body>`);

      const root = page.locator('#root');

      await expect(root).not.toOverflowViewPort();
    });
  }
);
