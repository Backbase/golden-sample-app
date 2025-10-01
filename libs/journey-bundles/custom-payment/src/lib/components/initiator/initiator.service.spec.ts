import { ProductSummaryHttpService } from '@backbase/arrangement-manager-http-ang';
import { of } from 'rxjs';
import { AccountSelectorItems } from './initiator.model';
import { InitiatorService } from './initiator.service';
import { TestBed } from '@angular/core/testing';

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
    TestBed.configureTestingModule({
      providers: [
        InitiatorService,
        {
          provide: ProductSummaryHttpService,
          useValue: mockProductSummaryService,
        },
      ],
    });
    service = TestBed.inject(InitiatorService);
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
