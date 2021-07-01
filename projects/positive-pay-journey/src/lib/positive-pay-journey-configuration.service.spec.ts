import { TestBed } from '@angular/core/testing';

import { PositivePayJourneyConfigurationService } from './positive-pay-journey.service';

describe('PositivePayJourneyService', () => {
  let service: PositivePayJourneyConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositivePayJourneyConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
