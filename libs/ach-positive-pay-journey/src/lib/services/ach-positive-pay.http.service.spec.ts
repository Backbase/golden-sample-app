import { TestBed } from '@angular/core/testing';

import { AchPositivePayHttpService } from './ach-positive-pay.http.service';

describe('AchPositivePayJourneyService', () => {
  let service: AchPositivePayHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AchPositivePayHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
