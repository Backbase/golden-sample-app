import { MakeTransferSuccessViewComponent } from './make-transfer-success-view.component';

describe('MakeTransferSuccessViewComponent', () => {
  let component: MakeTransferSuccessViewComponent;
  let mockTransferStore: any;
  let mockActivatedRoute: any = {
    snapshot: {
      data: {
        title: 'title',
      },
    },
  };
  let mockRouter: any = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    component = new MakeTransferSuccessViewComponent(
      mockTransferStore,
      mockActivatedRoute,
      mockRouter
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
