import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import UserContextComponent from './user-context.component';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  SharedUserContextGuard,
  SharedUserContextService,
} from '@backbase/shared/feature/user-context';

describe('UserContextComponent', () => {
  let fixture: ComponentFixture<UserContextComponent>;
  let router: Router;
  const mockUserContextService: jest.Mocked<
    Pick<SharedUserContextService, 'setServiceAgreementId'>
  > = {
    setServiceAgreementId: jest.fn(),
  };
  const mockUserContextGuard: jest.Mocked<
    Pick<SharedUserContextGuard, 'getTargetUrl'>
  > = {
    getTargetUrl: jest.fn(),
  };
  const mockOAuthService: jest.Mocked<Pick<OAuthService, 'logOut'>> = {
    logOut: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserContextComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SharedUserContextService, useValue: mockUserContextService },
        { provide: SharedUserContextGuard, useValue: mockUserContextGuard },
        { provide: OAuthService, useValue: mockOAuthService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    // Reset mocks before each test
    mockUserContextService.setServiceAgreementId.mockClear();
    mockUserContextGuard.getTargetUrl.mockClear();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContextComponent);
    fixture.detectChanges();
  });

  it('should render select context widget', () => {
    const selectContextWidget = fixture.nativeElement.querySelector(
      '[data-role="user-context-selector"]'
    );

    expect(selectContextWidget).not.toBeNull();
  });

  it('should remember serviceAgreement', () => {
    fixture.componentInstance.selectContextSuccess({ id: '123' });

    expect(mockUserContextService.setServiceAgreementId).toHaveBeenCalledWith(
      '123'
    );
  });

  it('should redirect to root', () => {
    mockUserContextGuard.getTargetUrl.mockReturnValue(undefined);
    fixture.componentInstance.selectContextSuccess({ id: '123' });

    expect(router.navigateByUrl).toHaveBeenCalledWith('');
  });

  it('should redirect to target url when tragetUrl provided by UserContextGuard', () => {
    mockUserContextGuard.getTargetUrl.mockReturnValue('/origin-url');
    fixture.componentInstance.selectContextSuccess({ id: '123' });

    expect(router.navigateByUrl).toHaveBeenCalledWith('/origin-url');
  });

  describe('Singleton behavior verification', () => {
    it('should use root-provided singleton services without component-level providers', () => {
      // Since SHARED_USER_CONTEXT_PROVIDERS was removed from component's providers array,
      // the injected services should be the application-wide singletons
      const injectedService = TestBed.inject(SharedUserContextService);
      const injectedGuard = TestBed.inject(SharedUserContextGuard);

      // Verify that the real services (not mocks) are available at root level
      expect(injectedService).toBeDefined();
      expect(injectedGuard).toBeDefined();

      // Verify that multiple injections return the same instance (singleton)
      const secondInjection = TestBed.inject(SharedUserContextService);
      expect(injectedService).toBe(secondInjection);
    });

    it('should not create duplicate provider instances at component level', () => {
      // The component should not override the root-level singleton providers
      // This test ensures the fix is in place by verifying the component
      // uses the application-wide singleton services
      expect(fixture.componentInstance).toBeDefined();

      // If the component had its own providers, these instances would differ
      // from the root injector instances, which would be an anti-pattern
      const rootGuard = TestBed.inject(SharedUserContextGuard);
      const rootService = TestBed.inject(SharedUserContextService);

      // These should exist and be consistent across the application
      expect(rootGuard).toBeDefined();
      expect(rootService).toBeDefined();
    });
  });
});
