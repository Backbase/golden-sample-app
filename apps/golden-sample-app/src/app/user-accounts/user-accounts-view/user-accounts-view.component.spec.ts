import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserAccountsService } from '../user-accounts.service';
import { UserAccountsViewComponent } from './user-accounts-view.component';

describe('UserAccountsViewComponent', () => {
  let fixture: ComponentFixture<UserAccountsViewComponent>;

  const mockUserAccountsService = {
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
        { provide: UserAccountsService, useValue: mockUserAccountsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
