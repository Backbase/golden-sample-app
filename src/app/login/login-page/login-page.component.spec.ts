import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppAuthService } from 'src/app/services/app-auth.service';

import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    const authSerivceStub = jasmine.createSpyObj<AppAuthService>(['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [FormsModule],
      providers: [
        {
          provide: AppAuthService,
          useValue: authSerivceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
