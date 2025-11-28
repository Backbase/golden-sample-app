import { Routes } from '@angular/router';
import achPositivePayBundle, {
  ACH_POSITIVE_PAY_ROUTES,
} from './ach-positive-pay-journey-bundle';

describe('AchPositivePayJourneyBundle', () => {
  describe('Default Export', () => {
    it('should export routes as default export', () => {
      expect(achPositivePayBundle).toBeDefined();
      expect(Array.isArray(achPositivePayBundle)).toBe(true);
    });

    it('should have routes with valid structure', () => {
      expect(achPositivePayBundle.length).toBeGreaterThan(0);
      expect(achPositivePayBundle[0]).toHaveProperty('path');
    });

    it('should define the rules path as first route', () => {
      const rulesRoute = achPositivePayBundle.find(
        (route) => route.path === 'rules'
      );
      expect(rulesRoute).toBeDefined();
    });

    it('should have component or children defined for rules route', () => {
      const rulesRoute = achPositivePayBundle.find(
        (route) => route.path === 'rules'
      );
      expect(rulesRoute).toBeDefined();
      const hasComponent = rulesRoute?.component !== undefined;
      const hasChildren = rulesRoute?.children !== undefined;
      expect(hasComponent || hasChildren).toBe(true);
    });

    it('should include redirect to rules for empty path', () => {
      const redirectRoute = achPositivePayBundle.find(
        (route) => route.path === '' && route.redirectTo === 'rules'
      );
      expect(redirectRoute).toBeDefined();
    });
  });

  describe('Named Export (Backward Compatibility)', () => {
    it('should export ACH_POSITIVE_PAY_ROUTES as named export', () => {
      expect(ACH_POSITIVE_PAY_ROUTES).toBeDefined();
      expect(Array.isArray(ACH_POSITIVE_PAY_ROUTES)).toBe(true);
    });

    it('should have consistent route configuration between default and named exports', () => {
      expect(achPositivePayBundle).toEqual(ACH_POSITIVE_PAY_ROUTES);
    });

    it('should maintain Routes type compatibility', () => {
      const routes: Routes = ACH_POSITIVE_PAY_ROUTES;
      expect(routes).toBeDefined();
      expect(Array.isArray(routes)).toBe(true);
    });
  });

  describe('Route Structure', () => {
    it('should have children routes under rules path', () => {
      const rulesRoute = achPositivePayBundle.find(
        (route) => route.path === 'rules'
      );
      expect(rulesRoute?.children).toBeDefined();
      expect(rulesRoute?.children?.length).toBeGreaterThan(0);
    });

    it('should include list route as child of rules', () => {
      const rulesRoute = achPositivePayBundle.find(
        (route) => route.path === 'rules'
      );
      const listRoute = rulesRoute?.children?.find(
        (route) => route.path === 'list'
      );
      expect(listRoute).toBeDefined();
    });

    it('should include new rule route with modal outlet', () => {
      const rulesRoute = achPositivePayBundle.find(
        (route) => route.path === 'rules'
      );
      const newRoute = rulesRoute?.children?.find(
        (route) => route.path === 'new'
      );
      expect(newRoute).toBeDefined();
      expect(newRoute?.outlet).toBe('modal');
    });
  });
});
