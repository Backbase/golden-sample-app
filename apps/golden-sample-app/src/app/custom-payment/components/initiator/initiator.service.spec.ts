import { ProductSummaryHttpService } from '@backbase/data-ang/arrangements';
import { of } from 'rxjs';
import { AccountSelectorItems } from './initiator.model';
import { InitiatorService } from './initiator.service';

describe('InitiatorService', () => {
  let service: InitiatorService;
  const arrangementIdMock = 'arrangment-id-mock';

  const mockProductSummaryService = {
    getArrangementsByBusinessFunction: jest.fn(() =>
      of([
        {
          id: arrangementIdMock,
        },
      ])
    ),
  } as unknown as ProductSummaryHttpService;

  beforeEach(() => {
    service = new InitiatorService(mockProductSummaryService);
  });

  it('should call product summary service to get arrangements', (done) => {
    service.arrangements$.subscribe(() => {
      expect(
        mockProductSummaryService.getArrangementsByBusinessFunction
      ).toHaveBeenCalled();
      done();
    });
  });

  it('should mapp arrangements to their ids', (done) => {
    service.arrangements$.subscribe((received: AccountSelectorItems) => {
      expect(received.length).toBe(1);
      expect(received[0].id).toBe(arrangementIdMock);
      done();
    });
  });
});
