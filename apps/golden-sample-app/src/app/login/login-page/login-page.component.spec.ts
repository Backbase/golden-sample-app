import { OAuthService } from 'angular-oauth2-oidc';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  const mockOAuthService: Pick<OAuthService, 'initLoginFlow'> = {
    initLoginFlow: jest.fn(),
  };

  beforeEach(() => {
    component = new LoginPageComponent(mockOAuthService as OAuthService);
  });

  it('should call authentication service on login', () => {
    component.login();
    expect(mockOAuthService.initLoginFlow).toHaveBeenCalled();
  });
});
