import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutService } from '@backbase/ui-ang';
import { AppComponent } from './app.component';
import { OAuthService } from 'angular-oauth2-oidc';

describe('AppComponent', () => {
  beforeEach(async () => {
    const layoutServiceStub = jasmine.createSpyObj<LayoutService>(['toggleNav']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        {
          provide: OAuthService,
          useValue: jasmine.createSpyObj<OAuthService>(['logOut','hasValidAccessToken']),
        },
        {
          provide: LayoutService,
          useValue: layoutServiceStub,
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
