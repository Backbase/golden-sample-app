import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  const mockOAuthService: any = {};

  beforeEach(() => {
    component = new LoginPageComponent(mockOAuthService);
  });

  it('should call authentication service on login', () => {
    mockOAuthService.initLoginFlow = jest.fn();
    component.login();
    expect(mockOAuthService.initLoginFlow).toHaveBeenCalled();
  });
});
