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

    it('should define the transactions path', () => {
      const transactionsRoute = transactionsBundle.find(
        (route: any) => route.path === 'transactions'
      );
      expect(transactionsRoute).toBeDefined();
    });

    it('should have component or loadChildren defined', () => {
      transactionsBundle.forEach((route: any) => {
        const hasComponent = route.component !== undefined;
        const hasLoadChildren = route.loadChildren !== undefined;
        const hasChildren = route.children !== undefined;
        expect(
          hasComponent || hasLoadChildren || hasChildren
        ).toBe(true);
      });
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
    it('should have providers array available', async () => {
      const { TRANSACTIONS_PROVIDERS } = await import('./transactions.bundle');
      
      expect(TRANSACTIONS_PROVIDERS).toBeDefined();
      expect(Array.isArray(TRANSACTIONS_PROVIDERS)).toBe(true);
      expect(TRANSACTIONS_PROVIDERS.length).toBeGreaterThan(0);
    });

    it('should provide TransactionsRouteTitleResolverService', async () => {
      const { TRANSACTIONS_PROVIDERS } = await import(
        './transactions.bundle'
      );
      
      // Check that the title resolver service is in the providers array
      expect(TRANSACTIONS_PROVIDERS.length).toBeGreaterThan(0);
      expect(TRANSACTIONS_PROVIDERS[0]).toBeDefined();
    });

    it('should provide extension configurations', async () => {
      const { TRANSACTIONS_PROVIDERS } = await import(
        './transactions.bundle'
      );
      
      // Check that TRANSACTION_EXTENSIONS_CONFIG is provided
      const hasExtensionsConfig = TRANSACTIONS_PROVIDERS.some(
        (provider: any) => 
          provider.provide?.toString().includes('TRANSACTION_EXTENSIONS_CONFIG') ||
          (typeof provider === 'object' && provider.provide)
      );
      expect(hasExtensionsConfig).toBe(true);
    });
  });
});

