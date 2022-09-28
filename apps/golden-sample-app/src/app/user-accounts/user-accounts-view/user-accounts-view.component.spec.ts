import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ArrangementsService } from '@libs/transactions';
import { UserAccountsViewComponent } from './user-accounts-view.component';

describe('UserAccountsViewComponent', () => {
  let fixture: ComponentFixture<UserAccountsViewComponent>;

  const mockArrangementsService = {
    arrangements$: of([
      {
        displayName: 'mock display name',
        availableBalance: 0,
        currency: 'EUR',
      },
      {
        displayName: 'mock display name',
        availableBalance: 0,
        currency: 'EUR',
      },
    ]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAccountsViewComponent],
      providers: [
        { provide: ArrangementsService, useValue: mockArrangementsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountsViewComponent);
    fixture.detectChanges();
  });

  it('should render correct ammount of available accounts', () => {
    const accounts = fixture.nativeElement.querySelectorAll(
      '[data-role="arrangmenet-container"]'
    );

    expect(accounts.length).toBe(2);
  });
});
