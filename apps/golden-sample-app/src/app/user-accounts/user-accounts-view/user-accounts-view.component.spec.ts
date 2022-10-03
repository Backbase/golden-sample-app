import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ArrangementsService } from '@backbase-gsa/transactions';
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
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountsViewComponent);
    fixture.detectChanges();
  });

  it('should render correct ammount of available accounts', () => {
    const accounts = fixture.nativeElement.querySelectorAll(
      '[data-role="arrangement-container"]'
    );

    expect(accounts.length).toBe(2);
  });
});
