import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchPositivePayJourneyComponent } from './ach-positive-pay-journey.component';

describe('AchPositivePayJourneyComponent', () => {
  let component: AchPositivePayJourneyComponent;
  let mockRouter: any = {
    navigate: jest.fn(),
  };
  let mockActivatedRoute: any = {
    route: 'route',
  };

  beforeEach(() => {
    component = new AchPositivePayJourneyComponent(
      mockRouter,
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
        { relativeTo: { route: 'route' } }
      );
    });
  });
});
