import { MakeTransferSummaryViewComponent } from './make-transfer-summary-view.component';

describe('MakeTransferSymmaryViewComponent', () => {
  let component: MakeTransferSummaryViewComponent;
  let mockCommunicationService: any = {};
  const mockTransferStore: any = {
    currentValue: 'currentValue',
  };
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

  const createComponent = () => {
    component = new MakeTransferSummaryViewComponent(
      mockTransferStore,
      mockActivatedRoute,
      mockRouter,
      mockCommunicationService
    );
  };

  beforeEach(() => {
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('close', () => {
    it('should navigate', () => {
      component.close();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['../make-transfer'], {
        relativeTo: mockActivatedRoute,
      });
    });
  });

  describe('submit', () => {
    it('should call use communicationService', () => {
      mockCommunicationService = {
        makeTransfer: jest.fn(),
      };
      createComponent();
      component.submit();
      expect(mockCommunicationService.makeTransfer).toBeCalledWith(
        mockTransferStore.currentValue
      );
    });
    it('should navigate', () => {
      mockCommunicationService = undefined;
      createComponent();
      component.submit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['../make-transfer-success'],
        {
          relativeTo: mockActivatedRoute,
        }
      );
    });
  });
});
