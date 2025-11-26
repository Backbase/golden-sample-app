import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UserContextComponent } from './user-context.component';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  SharedUserContextGuard,
  SharedUserContextService,
} from '@backbase/shared/feature/user-context';

describe('UserContextComponent', () => {
  let fixture: ComponentFixture<UserContextComponent>;
  const mockRouter: jest.Mocked<Pick<Router, 'navigateByUrl'>> = {
    navigateByUrl: jest.fn(),
  };
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
        { provide: SharedUserContextService, useValue: mockUserContextService },
        { provide: SharedUserContextGuard, useValue: mockUserContextGuard },
        { provide: OAuthService, useValue: mockOAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
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

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('');
  });

  it('should redirect to target url when tragetUrl provided by UserContextGuard', () => {
    mockUserContextGuard.getTargetUrl.mockReturnValue('/origin-url');
    fixture.componentInstance.selectContextSuccess({ id: '123' });

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/origin-url');
  });
});
