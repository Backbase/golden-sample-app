import { TestBed } from '@angular/core/testing';

import { TodoJourneyService } from './todo-journey.service';

describe('TodoJourneyService', () => {
  let service: TodoJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
