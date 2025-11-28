import { Routes } from '@angular/router';
import transactionsBundle from './transactions.bundle';
import { TransactionsJourneyConfiguration } from '@backbase/transactions-journey/internal/data-access';

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

  describe('Route Configuration Details', () => {
    it('should have providers included in the wrapper route', () => {
      // Providers are now embedded in the route structure itself
      // This ensures proper lazy loading without static imports
      const wrapperRoute = transactionsBundle[0] as any;
      expect(wrapperRoute.providers).toBeDefined();
      expect(Array.isArray(wrapperRoute.providers)).toBe(true);
      expect(wrapperRoute.providers.length).toBeGreaterThan(0);
    });

    it('should provide TransactionsJourneyConfiguration in providers via withConfig', () => {
      // Verify that the configuration class provider is included
      // This is now provided transparently by withConfig()
      const wrapperRoute = transactionsBundle[0] as any;
      const configProvider = wrapperRoute.providers.find(
        (provider: any) => provider.provide === TransactionsJourneyConfiguration
      );
      expect(configProvider).toBeDefined();
      expect(configProvider.useValue).toBeDefined();
      expect(configProvider.useValue.pageSize).toBe(10);
      expect(configProvider.useValue.slimMode).toBe(false);
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
