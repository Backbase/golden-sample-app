import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AppAuthService } from 'src/app/services/app-auth.service';

import { LoginPageComponent } from './login-page.component';

import { InputTextModule, InputValidationMessageModule } from '@backbase/ui-ang';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  let authServiceStub: jasmine.SpyObj<AppAuthService>;

  const components = {
    loginInput: () => fixture.debugElement.query(By.css('[data-role="login-input"]')),
    loginForm: () => fixture.debugElement.query(By.css('[data-role="login-form"]')),
    loginValidationMessage: () => fixture.debugElement.query(By.css('[data-role="login-validation-message"]')),
  };

  beforeEach(() => {
    authServiceStub = jasmine.createSpyObj<AppAuthService>(['login']);

    TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [ReactiveFormsModule, InputTextModule, InputValidationMessageModule],
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
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should pass login to authentication service', () => {
    const mockLoginValue = 'mock login';

    submitLoginFromWith(mockLoginValue);

    expect(authServiceStub.login).toHaveBeenCalledWith({
      redirectUri: 'transactions',
      login: mockLoginValue,
    });
  });

  describe('validation message should show', () => {
    it('if the login is less then 4 characters', () => {
      const shortLogin = 'log';

      submitLoginFromWith(shortLogin);

      expect(components.loginValidationMessage()).toBeTruthy();
      expect(authServiceStub.login).not.toHaveBeenCalled();
    });

    it('if user is trying to submit the empty login', () => {
      submitLoginFromWith('');

      expect(components.loginValidationMessage()).toBeTruthy();
      expect(authServiceStub.login).not.toHaveBeenCalled();
    });
  });

  function submitLoginFromWith(login: string) {
    component.loginForm.controls['login'].setValue(login);
    fixture.detectChanges();

    components.loginForm().triggerEventHandler('ngSubmit', {});
  }
});
