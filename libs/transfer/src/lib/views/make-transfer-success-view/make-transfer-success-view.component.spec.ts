import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { of } from 'rxjs';
import { MakeTransferJourneyState } from '../../state/make-transfer-journey-state.service';
import { MakeTransferSuccessViewComponent } from './make-transfer-success-view.component';

describe('MakeTransferSuccessViewComponent', () => {
  let component: MakeTransferSuccessViewComponent;
  let mockTransferState: Pick<MakeTransferJourneyState, 'transfer$'>;
  const snapshot: Pick<ActivatedRouteSnapshot, 'data'> = {
    data: {
      title: 'someTitle',
    },
  };
  const mockActivatedRoute: Pick<ActivatedRoute, 'snapshot'> = {
    snapshot: snapshot as ActivatedRouteSnapshot,
  };
  const mockRouter: Pick<Router, 'navigate'> = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    mockTransferState = {
      transfer$: of(),
    };
    component = new MakeTransferSuccessViewComponent(
      mockTransferState as MakeTransferJourneyState,
      mockActivatedRoute as ActivatedRoute,
      mockRouter as Router
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should navigate', () => {
      component.close();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['../make-transfer'], {
        relativeTo: mockActivatedRoute,
      });
    });
  });
});
