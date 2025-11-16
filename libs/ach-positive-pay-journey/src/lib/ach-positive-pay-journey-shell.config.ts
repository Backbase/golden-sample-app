import { achPositivePayDefaultRoutes } from './ach-positive-pay-journey.routes';
import { Routes, provideRoutes } from '@angular/router';

/**
 * Provides the default routes for ACH Positive Pay journey.
 * For standalone applications, use provideAchPositivePayRoutes() in app config.
 */
export function provideAchPositivePayRoutes(
  data: { [key: string]: unknown; routes: Routes } = {
    routes: achPositivePayDefaultRoutes,
  }
) {
  return provideRoutes(data.routes);
}

/**
 * Default routes for ACH Positive Pay journey.
 * @deprecated Use provideAchPositivePayRoutes() instead for standalone apps.
 */
export { achPositivePayDefaultRoutes } from './ach-positive-pay-journey.routes';
