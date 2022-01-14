import { AppComponent } from './app.component';
describe('AppComponent', () => {
  let component: AppComponent;
  const mockOAuthService: any = {};
  const mockLayoutService: any = {};
  beforeEach(async () => {
    mockOAuthService.hasValidAccessToken = jest.fn(() => true);
    component = new AppComponent(mockOAuthService, mockLayoutService);
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
    const mockEvent: any = {
      view: {
        window: {
          document: {
            querySelector: () => {
              return { focus };
            },
          },
        },
      },
    };
    component.focusMainContainer(mockEvent);
    expect(focus).toHaveBeenCalled();
  });

  it('should not focus anything, nothing to expect', () => {
    const mockEvent: any = {
      view: undefined,
    };
    component.focusMainContainer(mockEvent);
  });
});
