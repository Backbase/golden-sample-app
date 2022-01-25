import { LayoutService } from '@backbase/ui-ang';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppComponent } from './app.component';
describe('AppComponent', () => {
  let component: AppComponent;
  const mockOAuthService: Pick<OAuthService, 'logOut' | 'hasValidAccessToken'> =
    {
      logOut: jest.fn(),
      hasValidAccessToken: jest.fn(() => true),
    };
  let mockLayoutService: LayoutService;
  beforeEach(async () => {
    component = new AppComponent(
      mockOAuthService as OAuthService,
      mockLayoutService
    );
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', () => {
    mockOAuthService.logOut = jest.fn();
    component.logout();
    expect(mockOAuthService.logOut).toHaveBeenCalledWith(true);
  });

  it('should skip to content and focus element ', () => {
    const focus = jest.fn();
    const mockDocument: Pick<Document, 'querySelector'> = {
      querySelector: () => {
        return { focus };
      },
    };
    const mockEvent: Pick<MouseEvent, 'view'> = {
      view: {
        window: {
          document: mockDocument,
        },
      } as Window,
    };
    component.focusMainContainer(mockEvent as MouseEvent);
    expect(focus).toHaveBeenCalled();
  });

  it('should not focus anything', () => {
    const mockEvent: Pick<MouseEvent, 'view'> = {
      view: null,
    };
    component.focusMainContainer(mockEvent as MouseEvent);
  });
});
