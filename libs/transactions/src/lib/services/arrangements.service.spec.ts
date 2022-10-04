import { ProductSummaryHttpService } from '@backbase/data-ang/arrangements';
import { of } from 'rxjs';
import { ArrangementsService } from './arrangements.service';

describe('ArrangementsService', () => {
  let service: ArrangementsService;
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
    service = new ArrangementsService(mockProductSummaryService);
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
    service.arrangements$.subscribe((received) => {
      expect(received.length).toBe(1);
      expect(received[0].id).toBe(arrangementIdMock);
      done();
    });
  });
});
