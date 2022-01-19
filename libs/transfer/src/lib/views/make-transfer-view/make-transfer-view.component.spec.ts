import { Transfer } from '../../model/Account';
import { MakeTransferViewComponent } from './make-transfer-view.component';

describe('MakeTransferViewComponent', () => {
  let component: MakeTransferViewComponent;
  const mockActivatedRoute: any = {
    snapshot: {
      data: {
        title: 'some mocked title',
      },
    },
  };
  const mockRouter: any = {
    navigate: jest.fn(),
  };
  const mockTransferStore: any = {
    next: jest.fn(),
  };
  const mockPermissions: any = {};
  const mockAcounts: any = {};
  const mockConfig: any = {};
  const mockTransfer: Transfer = {
    fromAccount: 'from',
    toAccount: 'to',
    amount: 1,
  };

  beforeEach(() => {
    component = new MakeTransferViewComponent(
      mockActivatedRoute,
      mockRouter,
      mockTransferStore,
      mockPermissions,
      mockAcounts,
      mockConfig
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submitTransfer', () => {
    it('should navigate and update store', () => {
      component.submitTransfer(mockTransfer);
      expect(mockTransferStore.next).toHaveBeenCalledWith(mockTransfer);
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['../make-transfer-summary'],
        { relativeTo: mockActivatedRoute }
      );
    });
  });
});
