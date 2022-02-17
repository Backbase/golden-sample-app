import {
  ProductSummaryHttpService,
  ProductSummaryItem,
} from '@backbase/data-ang/arrangements';
import { of } from 'rxjs';
import { UserAccountsService } from './user-accounts.service';

describe('UserAccountsService', () => {
  let service: UserAccountsService;

  const mockProductSummaryService = {
    getArrangementsByBusinessFunction: jest.fn(() =>
      of([{} as ProductSummaryItem])
    ),
  } as unknown as ProductSummaryHttpService;

  beforeEach(() => {
    service = new UserAccountsService(mockProductSummaryService);
  });

  it('should call product summary service to get arrangements', (done) => {
    service.arrangements$.subscribe(() => {
      expect(
        mockProductSummaryService.getArrangementsByBusinessFunction
      ).toHaveBeenCalled();
      done();
    });
  });
});
