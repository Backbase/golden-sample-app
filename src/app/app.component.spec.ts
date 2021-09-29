import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutService } from '@backbase/ui-ang';
import { AppComponent } from './app.component';
import { AppAuthService } from './services/app-auth.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    const layoutServiceStub = jasmine.createSpyObj<LayoutService>(['toggleNav']);
    const authSerivceStub = jasmine.createSpyObj<AppAuthService>(['runInitialLoginSequence']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        {
          provide: AppAuthService,
          useValue: authSerivceStub,
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
