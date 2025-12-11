import { journeyFactory } from '@backbase/foundation-ang/core';
import defaultRoutes from './ach-positive-pay-journey.routes';

/**
 * Creates and configures the ACH Positive Pay Journey using the journey factory pattern.
 *
 * The journey factory provides a flexible, type-safe way to configure and extend the journey.
 * It allows consumers to:
 * - Override default routes
 * - Add custom providers
 * - Customize behavior through configuration tokens
 *
 * @example
 * ```typescript
 * // In app/journeys/ach-positive-pay.ts
 * import { achPositivePayJourney } from '@backbase/ach-positive-pay-journey';
 * import type { Routes } from '@angular/router';
 *
 * export default achPositivePayJourney();
 *
 * // Then in app routing:
 * const routes: Routes = [
 *   {
 *     path: 'ach-positive-pay',
 *     loadChildren: () => import('./journeys/ach-positive-pay'),
 *   },
 * ];
 * ```
 */
export const { achPositivePayJourney } = journeyFactory({
  journeyName: 'achPositivePayJourney',
  defaultRoutes,
  tokens: {},
});
