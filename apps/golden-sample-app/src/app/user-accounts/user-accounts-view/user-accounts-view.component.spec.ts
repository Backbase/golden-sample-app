import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ArrangementsService } from '@backbase-gsa/transactions-journey';
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

  const mockActivatedRoute = {
    snapshot: {
      queryParams: {},
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountsViewComponent],
      providers: [
        { provide: ArrangementsService, useValue: mockArrangementsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountsViewComponent);
    fixture.detectChanges();
  });

  it('should render correct ammount of available accounts', () => {
    const accounts = fixture.nativeElement.querySelectorAll(
      '[data-role="product"]'
    );

    expect(accounts.length).toBe(2);
  });
});
