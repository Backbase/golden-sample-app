import { ActivatedRoute, Router } from '@angular/router';
import { AchPositivePayJourneyComponent } from './ach-positive-pay-journey.component';
import { Translations } from './translations.provider';

describe('AchPositivePayJourneyComponent', () => {
  let component: AchPositivePayJourneyComponent;
  const mockRouter: Pick<Router, 'navigate'> = {
    navigate: jest.fn(),
  };
  const mockActivatedRoute = new ActivatedRoute();

  beforeEach(() => {
    component = new AchPositivePayJourneyComponent(
      mockRouter as Router,
      mockActivatedRoute,
      {} as Translations
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
