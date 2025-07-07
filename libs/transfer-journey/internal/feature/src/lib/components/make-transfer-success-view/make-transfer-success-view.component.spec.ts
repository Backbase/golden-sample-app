import { TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { of } from 'rxjs';
import { MakeTransferJourneyState } from '@backbase/transfer-journey/internal/data-access';
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

    TestBed.configureTestingModule({
      providers: [
        MakeTransferSuccessViewComponent,
        { provide: MakeTransferJourneyState, useValue: mockTransferState },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    });

    component = TestBed.inject(MakeTransferSuccessViewComponent);
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
