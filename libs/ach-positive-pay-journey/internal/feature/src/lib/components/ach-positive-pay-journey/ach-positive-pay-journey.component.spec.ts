import { ActivatedRoute, Router } from '@angular/router';
import { AchPositivePayJourneyComponent } from './ach-positive-pay-journey.component';

describe('AchPositivePayJourneyComponent', () => {
  let component: AchPositivePayJourneyComponent;
  const mockRouter: Pick<Router, 'navigate'> = {
    navigate: jest.fn(),
  };
  const mockActivatedRoute = new ActivatedRoute();

  beforeEach(() => {
    component = new AchPositivePayJourneyComponent(
      mockRouter as Router,
      mockActivatedRoute
    );
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
