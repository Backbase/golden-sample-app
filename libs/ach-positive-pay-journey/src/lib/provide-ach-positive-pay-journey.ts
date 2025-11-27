import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideRoutes, Routes } from '@angular/router';
import { achPositivePayDefaultRoutes } from './ach-positive-pay-journey.routes';

/**
 * Provides the ACH Positive Pay Journey configuration in a standalone context.
 *
 * @param routes - Optional custom routes. If not provided, uses default routes.
 * @returns Environment providers for ACH Positive Pay Journey
 *
 * @example
 * ```typescript
 * import { ApplicationConfig } from '@angular/core';
 * import { provideAchPositivePayJourney } from '@backbase/ach-positive-pay-journey';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAchPositivePayJourney(),
 *   ],
 * };
 * ```
 */
export function provideAchPositivePayJourney(
  routes: Routes = achPositivePayDefaultRoutes
): EnvironmentProviders {
  return makeEnvironmentProviders([provideRoutes(routes)]);
}
