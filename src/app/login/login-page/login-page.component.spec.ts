import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppAuthService } from 'src/app/services/app-auth.service';

import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  let authServiceStub: jasmine.SpyObj<AppAuthService>;

  const components = {
    loginBtn: () => fixture.debugElement.query(By.css('[data-role="login-button"]')),
  };

  beforeEach(() => {
    authServiceStub = jasmine.createSpyObj<AppAuthService>(['login']);

    TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      providers: [
        {
          provide: AppAuthService,
          useValue: authServiceStub,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call authentication service after btn click', () => {
    components.loginBtn().triggerEventHandler('click', {});

    fixture.detectChanges();

    expect(authServiceStub.login).toHaveBeenCalled();
  });
});
