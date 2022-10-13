import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserContextComponent } from './user-context.component';
import { Router } from '@angular/router';
import { UserContextGuard } from './user-context.guard';
import { OAuthService } from 'angular-oauth2-oidc';

describe('UserContextComponent', () => {
  let fixture: ComponentFixture<UserContextComponent>;
  const mockRouter: Pick<Router, 'navigateByUrl'> = {
    navigateByUrl: jest.fn(),
  };
  const mockUserContextGuard: Pick<UserContextGuard, 'getTargetUrl'> = {
    getTargetUrl: jest.fn(),
  };
  const mockOAuthService: Pick<OAuthService, 'revokeTokenAndLogout'> = {
    revokeTokenAndLogout: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserContextComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: UserContextGuard, useValue: mockUserContextGuard },
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
});
