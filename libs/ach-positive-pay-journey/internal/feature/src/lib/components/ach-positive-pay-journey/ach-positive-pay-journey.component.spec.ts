import { ActivatedRoute, Router } from '@angular/router';
import { AchPositivePayJourneyComponent } from './ach-positive-pay-journey.component';
import { TestBed } from '@angular/core/testing';

describe('AchPositivePayJourneyComponent', () => {
  let component: AchPositivePayJourneyComponent;
  const mockRouter: Pick<Router, 'navigate'> = {
    navigate: jest.fn(),
  };
  const mockActivatedRoute = new ActivatedRoute();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AchPositivePayJourneyComponent,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });
    component = TestBed.inject(AchPositivePayJourneyComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openNewBlockerModal', () => {
    it('should create', () => {
      component.openNewBlockerModal();
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [{ outlets: { modal: 'new' } }],
        { relativeTo: mockActivatedRoute }
      );
    });
  });
});
