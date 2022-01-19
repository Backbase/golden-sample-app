import { MakeTransferSuccessViewComponent } from './make-transfer-success-view.component';

describe('MakeTransferSuccessViewComponent', () => {
  let component: MakeTransferSuccessViewComponent;
  let mockTransferStore: any;
  const mockActivatedRoute: any = {
    snapshot: {
      data: {
        title: 'title',
      },
    },
  };
  const mockRouter: any = {
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
