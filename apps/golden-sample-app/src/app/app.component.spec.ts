import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutService } from '@backbase/ui-ang/layout';
import { OAuthService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { APP_TRANSLATIONS } from './translations-catalog';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: OAuthService, useValue: mockOAuthService },
        { provide: APP_TRANSLATIONS, useValue: {} },
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

  describe('When data is mock', () => {
    it('should set the isAuthenticated to true', () => {
      environment.mockEnabled = true;
      expect(component.isAuthenticated).toBe(true);
    });
  });
});
