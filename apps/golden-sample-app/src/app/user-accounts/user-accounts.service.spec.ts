import { TestBed } from '@angular/core/testing';

import { UserAccountsService } from './user-accounts.service';

describe('UserAccountsService', () => {
  let service: UserAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
