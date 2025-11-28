import { Routes } from '@angular/router';
import transferJourneyBundle from './transfer-journey.bundle';

describe('TransferJourneyBundle', () => {
  describe('Default Export', () => {
    it('should export routes as default export', () => {
      expect(transferJourneyBundle).toBeDefined();
      expect(Array.isArray(transferJourneyBundle)).toBe(true);
    });

    it('should have routes with valid structure', () => {
      expect(transferJourneyBundle.length).toBeGreaterThan(0);
      expect(transferJourneyBundle[0]).toHaveProperty('path');
    });

    it('should define the wrapper route with empty path', () => {
      // The bundle now wraps journey routes in a parent route with providers
      const wrapperRoute = transferJourneyBundle.find(
        (route: any) => route.path === ''
      );
      expect(wrapperRoute).toBeDefined();
    });

    it('should have children routes defined in the wrapper', () => {
      const wrapperRoute = transferJourneyBundle[0] as any;
      expect(wrapperRoute.children).toBeDefined();
      expect(Array.isArray(wrapperRoute.children)).toBe(true);
      expect(wrapperRoute.children.length).toBeGreaterThan(0);
    });

    it('should have providers attached to the wrapper route', () => {
      const wrapperRoute = transferJourneyBundle[0] as any;
      expect(wrapperRoute.providers).toBeDefined();
      expect(Array.isArray(wrapperRoute.providers)).toBe(true);
      expect(wrapperRoute.providers.length).toBeGreaterThan(0);
    });
  });

  describe('Route Structure', () => {
    it('should have proper route path definitions', () => {
      const routes: Routes = transferJourneyBundle;
      routes.forEach((route) => {
        expect(typeof route.path === 'string' || route.path === undefined).toBe(
          true
        );
      });
    });

    it('should not have invalid path types', () => {
      transferJourneyBundle.forEach((route: any) => {
        expect(typeof route.path).not.toBe('number');
        expect(typeof route.path).not.toBe('boolean');
      });
    });
  });

  describe('Route Configuration Details', () => {
    it('should have providers included in the wrapper route', () => {
      // Providers are now embedded in the route structure itself
      // This ensures proper lazy loading without static imports
      const wrapperRoute = transferJourneyBundle[0] as any;
      expect(wrapperRoute.providers).toBeDefined();
      expect(Array.isArray(wrapperRoute.providers)).toBe(true);
      expect(wrapperRoute.providers.length).toBeGreaterThan(0);
    });

    it('should have journey routes as children', () => {
      const wrapperRoute = transferJourneyBundle[0] as any;
      const children = wrapperRoute.children;

      // Journey routes should include the transfer view routes
      expect(children.length).toBeGreaterThan(0);

      // Check that children have components defined
      children.forEach((route: any) => {
        const hasComponent = route.component !== undefined;
        const hasChildren = route.children !== undefined;
        const hasRedirect = route.redirectTo !== undefined;
        expect(hasComponent || hasChildren || hasRedirect).toBe(true);
      });
    });
  });
});
