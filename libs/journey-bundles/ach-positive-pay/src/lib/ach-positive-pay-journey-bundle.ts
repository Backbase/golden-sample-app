import { Routes } from '@angular/router';
import { achPositivePayDefaultRoutes } from '@backbase/ach-positive-pay-journey';

/**
 * ACH Positive Pay Journey Bundle
 *
 * This file provides the journey routes for lazy loading.
 * Use `loadChildren: () => import('./ach-positive-pay-journey-bundle')` in your route configuration.
 *
 * The routes include all necessary components and guards from the journey library.
 */
const routes: Routes = achPositivePayDefaultRoutes;

// Default export for Angular lazy loading
export default routes;

// Named export for backward compatibility and testing
export const ACH_POSITIVE_PAY_ROUTES = routes;
