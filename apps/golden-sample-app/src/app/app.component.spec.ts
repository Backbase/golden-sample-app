import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivityMonitorService, AuthService } from '@backbase/identity-auth';
import {
  LOCALES_LIST,
  LocalesService,
  NAVIGATION_MENU_CONFIG,
} from '@backbase/shared/util/app-core';
import { LayoutService } from '@backbase/ui-ang/layout';
import { OAuthService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  const mockOAuthService: Pick<OAuthService, 'logOut' | 'hasValidAccessToken'> =
    {
      logOut: jest.fn(),
      hasValidAccessToken: jest.fn(() => true),
    };
  const mockLayoutService = {
    navigationExpanded$: of(true),
  };
  const mockActivityMonitorService = {
    events: of({ type: 'start' }),
    start: jest.fn(),
    stop: jest.fn(),
  };
  const mockAuthService = {
    isAuthenticated$: of(true),
    initLoginFlow: jest.fn(),
  };
  const mockLocalesService = {
    currentLocale: 'en',
    setLocale: jest.fn(),
  };
  const mockLocalesList = ['en', 'nl', 'es'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: OAuthService, useValue: mockOAuthService },
        {
          provide: ActivityMonitorService,
          useValue: mockActivityMonitorService,
        },
        { provide: AuthService, useValue: mockAuthService },
        { provide: LocalesService, useValue: mockLocalesService },
        { provide: LOCALES_LIST, useValue: mockLocalesList },
        { provide: NAVIGATION_MENU_CONFIG, useValue: [] },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', () => {
    mockOAuthService.logOut = jest.fn();

    const logoutBtn = fixture.debugElement.nativeElement.querySelector(
      '[data-role="logout-btn"]'
    );
    logoutBtn.dispatchEvent(new Event('click'));
    fixture.detectChanges();

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
});
