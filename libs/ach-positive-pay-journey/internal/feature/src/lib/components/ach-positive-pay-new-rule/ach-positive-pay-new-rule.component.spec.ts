import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@backbase/ui-ang/notification';
import { of, throwError } from 'rxjs';
import { AchPositivePayHttpService } from '@backbase/ach-positive-pay-journey/internal/data-access';
import { AchPositivePayNewRuleComponent } from './ach-positive-pay-new-rule.component';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';

describe('AchPositivePayNewRuleComponent', () => {
  let component: AchPositivePayNewRuleComponent;
  const mockRouter: Pick<Router, 'navigate'> = {
    navigate: jest.fn(),
  };
  const mockActivatedRoute = new ActivatedRoute();
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

  describe('with mock FormBuilder', () => {
    let mockFormBuilder: Pick<FormBuilder, 'group'> = {
      group: jest.fn(),
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          AchPositivePayNewRuleComponent,
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: FormBuilder, useValue: mockFormBuilder },
          {
            provide: AchPositivePayHttpService,
            useValue: mockAchPositivePayService,
          },
          { provide: NotificationService, useValue: mockNotificationService },
        ],
      });

      component = TestBed.inject(AchPositivePayNewRuleComponent);
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

    describe('submitRule', () => {
      it('should return', () => {
        component.loading = true;
        const spy = jest.spyOn(component, 'submitRule');
        component.submitRule();
        expect(spy).toReturn();
      });
    });

    describe('hideError', () => {
      it('should set servError to undefined', () => {
        component.hideError();
        expect(component.serverError).toBeUndefined();
      });
    });
  });

  describe('with real FormBuilder', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          AchPositivePayNewRuleComponent,
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          FormBuilder,
          {
            provide: AchPositivePayHttpService,
            useValue: mockAchPositivePayService,
          },
          { provide: NotificationService, useValue: mockNotificationService },
        ],
      });

      component = TestBed.inject(AchPositivePayNewRuleComponent);
    });

    describe('onSelectAccountId', () => {
      it('should arrangement to new account', () => {
        const mockAccount: ProductSummaryItem = {
          id: 'id',
          legalEntityIds: ['ids'],
          debitCards: [{ unmaskableAttributes: ['BBAN'] }],
        };
        component.ngOnInit();
        component.onSelectAccountId(mockAccount);
        expect(component.achRuleForm.get('arrangement')?.value).toEqual(
          mockAccount
        );
      });
    });

    describe('submitRule', () => {
      it('should subscribe to positive pay service success', () => {
        (mockAchPositivePayService.submitAchRule as jest.Mock) = jest.fn(() =>
          of('stream')
        );
        component.ngOnInit();
        component.loading = false;
        component.submitRule();
        expect(mockAchPositivePayService.submitAchRule).toHaveBeenCalled();
        expect(mockNotificationService.showNotification).toHaveBeenCalled();
      });

      it('should subscribe to positive pay service error', () => {
        (mockAchPositivePayService.submitAchRule as jest.Mock) = jest.fn(() =>
          throwError(() => {
            return { message: 'error' };
          })
        );
        component.ngOnInit();
        component.loading = false;
        component.submitRule();
        expect(component.serverError).toEqual('error');
      });
    });
  });
});
