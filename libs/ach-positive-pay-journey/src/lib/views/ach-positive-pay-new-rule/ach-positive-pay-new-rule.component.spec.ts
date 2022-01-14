import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AchPositivePayNewRuleComponent } from './ach-positive-pay-new-rule.component';

describe('AchPositivePayNewRuleComponent', () => {
  let component: AchPositivePayNewRuleComponent;
  const mockRouter: any = {
    navigate: jest.fn(),
  };
  const mockActivatedRoute: any = {
    route: 'route',
  };
  let mockFormBuilder: any = {
    group: jest.fn(),
  };
  const mockAchPositivePayService: any = {
    accounts$: of(),
  };
  const mockNotificationService: any = {
    showNotification: jest.fn(),
  };

  const createComponent = () => {
    component = new AchPositivePayNewRuleComponent(
      mockRouter,
      mockActivatedRoute,
      mockFormBuilder,
      mockAchPositivePayService,
      mockNotificationService
    );
  };
  beforeEach(() => {
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should build the form', () => {
      component.ngOnInit();
      expect(mockFormBuilder.group).toHaveBeenCalledWith({
        arrangement: [undefined],
        companyId: [''],
        companyName: [''],
        paymentTypes: [''],
      });
    });
  });

  describe('closeModal', () => {
    it('should close the modal and navigate', () => {
      component.closeModal();
      expect(mockRouter.navigate).toBeCalledWith(['..'], {
        relativeTo: { route: 'route' },
      });
      expect(component.loading).toBeFalsy();
    });
  });

  describe('onSelectAccountId', () => {
    it('should arrangement to new account', () => {
      const mockAccount = { id: 'id', legalEntityIds: ['ids'] };
      mockFormBuilder = new FormBuilder();
      createComponent();
      component.ngOnInit();
      component.onSelectAccountId(mockAccount);
      expect(component.achRuleForm.get('arrangement')?.value).toEqual(
        mockAccount
      );
    });
  });

  describe('submitRule', () => {
    it('should return', () => {
      component.loading = true;
      const spy = jest.spyOn(component, 'submitRule');
      component.submitRule();
      expect(spy).toReturn();
    });
    it('should subscribe to positive pay service success', () => {
      (mockAchPositivePayService.submitAchRule = jest.fn(() => of('stream'))),
        (mockFormBuilder = new FormBuilder());
      createComponent();
      component.ngOnInit();
      component.loading = false;
      component.submitRule();
      expect(mockAchPositivePayService.submitAchRule).toHaveBeenCalled();
      expect(mockNotificationService.showNotification).toHaveBeenCalled();
    });
    it('should subscribe to positive pay service error', () => {
      mockAchPositivePayService.submitAchRule = jest.fn(() =>
        throwError(() => {
          return { message: 'error' };
        })
      );
      mockFormBuilder = new FormBuilder();
      createComponent();
      component.ngOnInit();
      component.loading = false;
      component.submitRule();
      expect(component.serverError).toEqual('error');
    });
  });

  describe('hideError', () => {
    it('should set servError to undefined', () => {
      component.hideError();
      expect(component.serverError).toBeUndefined();
    });
  });
});
