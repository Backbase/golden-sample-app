import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@backbase/ui-ang/notification';
import { of, throwError } from 'rxjs';
import { AchPositivePayHttpService } from '../../services/ach-positive-pay.http.service';
import { AchPositivePayNewRuleComponent } from './ach-positive-pay-new-rule.component';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';

describe('AchPositivePayNewRuleComponent', () => {
  let component: AchPositivePayNewRuleComponent;
  const mockRouter: Pick<Router, 'navigate'> = {
    navigate: jest.fn(),
  };
  const mockActivatedRoute = new ActivatedRoute();
  let mockFormBuilder: Pick<FormBuilder, 'group'> = {
    group: jest.fn(),
  };
  const mockAchPositivePayService: Pick<
    AchPositivePayHttpService,
    'accounts$' | 'submitAchRule'
  > = {
    accounts$: of(),
    submitAchRule: jest.fn(),
  };
  const mockNotificationService: Pick<NotificationService, 'showNotification'> =
    {
      showNotification: jest.fn(),
    };

  const createComponent = () => {
    component = new AchPositivePayNewRuleComponent(
      mockRouter as Router,
      mockActivatedRoute,
      mockFormBuilder as FormBuilder,
      mockAchPositivePayService as AchPositivePayHttpService,
      mockNotificationService as NotificationService
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
        relativeTo: mockActivatedRoute,
      });
      expect(component.loading).toBeFalsy();
    });
  });

  describe('onSelectAccountId', () => {
    it('should arrangement to new account', () => {
      const mockAccount: ProductSummaryItem = {
        id: 'id',
        legalEntityIds: ['ids'],
        debitCards: [{ unmaskableAttributes: ['BBAN'] }],
      };
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
