import { Routes } from '@angular/router';
import { TRANSACTIONS_ROUTES } from './transactions.bundle';
import transactionsBundle from './transactions.bundle';

describe('TransactionsBundle', () => {
  describe('Default Export', () => {
    it('should export routes as default export', () => {
      expect(transactionsBundle).toBeDefined();
      expect(Array.isArray(transactionsBundle)).toBe(true);
    });

    it('should have routes with valid structure', () => {
      expect(transactionsBundle.length).toBeGreaterThan(0);
      expect(transactionsBundle[0]).toHaveProperty('path');
    });

    it('should define the wrapper route with empty path', () => {
      // The bundle now wraps journey routes in a parent route with providers
      const wrapperRoute = transactionsBundle.find(
        (route: any) => route.path === ''
      );
      expect(wrapperRoute).toBeDefined();
    });

    it('should have children routes defined in the wrapper', () => {
      const wrapperRoute = transactionsBundle[0] as any;
      expect(wrapperRoute.children).toBeDefined();
      expect(Array.isArray(wrapperRoute.children)).toBe(true);
      expect(wrapperRoute.children.length).toBeGreaterThan(0);
    });

    it('should have providers attached to the wrapper route', () => {
      const wrapperRoute = transactionsBundle[0] as any;
      expect(wrapperRoute.providers).toBeDefined();
      expect(Array.isArray(wrapperRoute.providers)).toBe(true);
      expect(wrapperRoute.providers.length).toBeGreaterThan(0);
    });
  });

  describe('Named Export (Backward Compatibility)', () => {
    it('should export TRANSACTIONS_ROUTES as named export', () => {
      expect(TRANSACTIONS_ROUTES).toBeDefined();
      expect(Array.isArray(TRANSACTIONS_ROUTES)).toBe(true);
    });

    it('should have consistent route configuration between default and named exports', () => {
      expect(transactionsBundle).toEqual(TRANSACTIONS_ROUTES);
    });

    it('should maintain Routes type compatibility', () => {
      const routes: Routes = TRANSACTIONS_ROUTES;
      expect(routes).toBeDefined();
      expect(Array.isArray(routes)).toBe(true);
    });
  });

  describe('Route Structure', () => {
    it('should have proper route path definitions', () => {
      const routes: Routes = transactionsBundle;
      routes.forEach((route) => {
        expect(typeof route.path === 'string' || route.path === undefined).toBe(
          true
        );
      });
    });

    it('should not have invalid path types', () => {
      transactionsBundle.forEach((route: any) => {
        expect(typeof route.path).not.toBe('number');
        expect(typeof route.path).not.toBe('boolean');
      });
    });
  });

  describe('Lazy Loading Compatibility', () => {
    it('should be compatible with Angular lazy loading pattern', async () => {
      // Simulate dynamic import pattern
      const dynamicModule = await import('./transactions.bundle');

      // Default export should work directly
      expect(dynamicModule.default).toBeDefined();
      expect(Array.isArray(dynamicModule.default)).toBe(true);
    });

    it('should maintain named export for backward compatibility in dynamic imports', async () => {
      const dynamicModule = await import('./transactions.bundle');

      // Named export should still be available
      expect(dynamicModule.TRANSACTIONS_ROUTES).toBeDefined();
      expect(dynamicModule.TRANSACTIONS_ROUTES).toEqual(dynamicModule.default);
    });
  });

  describe('Route Configuration Details', () => {
    it('should have providers included in the wrapper route', () => {
      // Providers are now embedded in the route structure itself
      // This ensures proper lazy loading without static imports
      const wrapperRoute = transactionsBundle[0] as any;
      expect(wrapperRoute.providers).toBeDefined();
      expect(Array.isArray(wrapperRoute.providers)).toBe(true);
      expect(wrapperRoute.providers.length).toBeGreaterThan(0);
    });

    it('should have journey routes as children', () => {
      const wrapperRoute = transactionsBundle[0] as any;
      const children = wrapperRoute.children;

      // Journey routes should include the main view and details routes
      expect(children.length).toBeGreaterThan(0);

      // Check that children have components defined
      children.forEach((route: any) => {
        const hasComponent = route.component !== undefined;
        const hasChildren = route.children !== undefined;
        expect(hasComponent || hasChildren).toBe(true);
      });
    });
  });
});
