import { TestBed } from '@angular/core/testing';

import { ArrangementsService } from './arrangements.service';

describe('ArrangementsService', () => {
  let service: ArrangementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrangementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
