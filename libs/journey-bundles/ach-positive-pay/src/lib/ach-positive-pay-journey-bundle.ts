import { achPositivePayJourney } from '@backbase/ach-positive-pay-journey';

/**
 * ACH Positive Pay Journey Bundle
 *
 * This file provides the journey routes for lazy loading using the journey factory pattern.
 * Use `loadChildren: () => import('./ach-positive-pay-journey-bundle')` in your route configuration.
 *
 * The routes include all necessary components and guards from the journey library.
 *
 * @example
 * ```typescript
 * const routes: Routes = [
 *   {
 *     path: 'ach-positive-pay',
 *     loadChildren: () => import('@backbase/journey-bundles/ach-positive-pay'),
 *   },
 * ];
 * ```
 */
export default achPositivePayJourney();
