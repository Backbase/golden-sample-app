import userAccountsRoutes from './user-accounts.routes';
import { UserAccountsViewComponent } from './user-accounts-view/user-accounts-view.component';

describe('User Accounts Routes', () => {
  it('should be defined and have correct structure', () => {
    expect(userAccountsRoutes).toBeDefined();
    expect(Array.isArray(userAccountsRoutes)).toBe(true);
  });

  it('should have a route for the empty path', () => {
    const route = userAccountsRoutes[0];
    expect(route.path).toBe('');
    expect(route.component).toBe(UserAccountsViewComponent);
  });

  it('should define at least one route', () => {
    expect(userAccountsRoutes.length).toBeGreaterThan(0);
  });

  it('should load UserAccountsViewComponent as a standalone component', () => {
    expect((UserAccountsViewComponent as any).ɵcmp?.standalone).toBe(true);
  });

  it('should export default routes', async () => {
    const routeModule = await import('./user-accounts.routes');
    expect(routeModule.default).toBeDefined();
    expect(Array.isArray(routeModule.default)).toBe(true);
  });
});
