import { TestBed } from '@angular/core/testing';

import { TransferJourneyService } from './transfer-journey.service';

describe('TransferJourneyService', () => {
  let service: TransferJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
