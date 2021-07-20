import { TestBed } from '@angular/core/testing';

import { HeroesJourneyService } from './heroes-journey.service';

describe('HeroesJourneyService', () => {
  let service: HeroesJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroesJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
