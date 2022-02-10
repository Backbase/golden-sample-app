import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserAccountsService } from '../user-accounts.service';
import { UserAccountsViewComponent } from './user-accounts-view.component';

describe('UserAccountsViewComponent', () => {
  let component: UserAccountsViewComponent;
  let fixture: ComponentFixture<UserAccountsViewComponent>;

  const mockUserAccountsService = {
    arrangements$: of([{
      displayName: 'mock display name',
      availableBalance: 0,
      currency: 'EUR' 
    }, {
      displayName: 'mock display name',
      availableBalance: 0,
      currency: 'EUR' 
    }]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountsViewComponent ],
      providers: [
        { provide: UserAccountsService, useValue: mockUserAccountsService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render correct ammount of available accounts', () => {
    const accounts = fixture.nativeElement.querySelectorAll('[data-role="arrangmenet-container"]');

    expect(accounts.length).toBe(2);
  })
});
