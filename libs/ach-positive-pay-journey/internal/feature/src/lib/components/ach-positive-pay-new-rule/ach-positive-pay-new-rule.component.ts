import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AchPositivePayHttpService } from '@backbase-gsa/ach-positive-pay-journey/internal/data-access';
import { NotificationService } from '@backbase/ui-ang/notification';
import { ACH_POSITIVE_PAY_TRANSLATIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Observable } from 'rxjs';
import { ModalModule } from '@backbase/ui-ang/modal';
import { HeaderModule } from '@backbase/ui-ang/header';
import { AlertModule } from '@backbase/ui-ang/alert';
import { AchPositivePayRuleFormComponent } from '@backbase-gsa/ach-positive-pay-journey/internal/ui';
import { LoadButtonModule } from '@backbase/ui-ang/load-button';
import { CommonModule } from '@angular/common';

export const ACH_POSITIVE_PAY_NEW_RULE_TRANSLATIONS =
  new InjectionToken<Translations>('ach_positive_pay_new_rule_translations');
export interface Translations {
  [key: string]: string;
}

@Component({
  selector: 'bb-ach-positive-pay-new-rule',
  templateUrl: './ach-positive-pay-new-rule.component.html',
  imports: [
    ModalModule,
    HeaderModule,
    AlertModule,
    AchPositivePayRuleFormComponent,
    LoadButtonModule,
    CommonModule,
  ],
  standalone: true,
})
export class AchPositivePayNewRuleComponent implements OnInit {
  loading = false;

  public readonly translations: Translations = {
    'ach-positive-pay.new-rule.title':
      this.overridingTranslations['ach-positive-pay.new-rule.title'] ||
      $localize`:ACH positive pay title - 'New ACH Rule'|This string is used as the
          title for the heading in the ACH Positive Pay journey component. It is
          presented to the user as the main heading of the page when they are
          viewing the ACH Positive Pay journey. This title is located at the top
          of the ACH Positive Pay journey page@@ach-positive-pay.new-rule.title:New ACH Rule`,
    'ach-positive-pay.error.default.title':
      this.overridingTranslations['ach-positive-pay.error.default.title'] ||
      $localize`:Server Error - 'Unknown error occurred. Try to submit the form
              again.'|This string is used as the title for an alert message that
              is displayed when the server throws an error. It is presented to
              the user when an unknown error occurs while submitting the form.
              This message is located in the ACH Positive Pay new rule
              component.@@ach-positive-pay.error.default.title:Unknown error occurred. Try to submit the form again.`,
    'ach-positive-pay.new-rule.submit-button':
      this.overridingTranslations['ach-positive-pay.new-rule.submit-button'] ||
      $localize`:Submit button label - 'Submit'|This string is used as the label for
            the 'Submit' button. It is presented to the user when they are
            submitting a new rule in the ACH Positive Pay feature. This label is
            located within the modal footer section of the
            layout.@@ach-positive-pay.new-rule.submit-button:Submit`,
    'ach-positive-pay.new-rule.cancel-button':
      this.overridingTranslations['ach-positive-pay.new-rule.cancel-button'] ||
      $localize`:Cancel button label - 'Cancel'|This string is used as the label for
            the 'Cancel' button. It is presented to the user when they want to
            cancel the entry of a new check in the ACH Positive Pay feature.
            This label is located within the modal footer section of the
            layout.@@ach-positive-pay.new-rule.cancel-button:Cancel`,
  };

  modalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: true,
    size: 'md',
    ariaLabelledBy: 'ach-positive-pay-new-blocker-modal-head',
    windowClass: 'ach-positive-pay-new-blocker-modal',
  };

  serverError: string | undefined;

  achRuleForm!: FormGroup;

  accounts$: Observable<ProductSummaryItem[]> =
    this.achPositivePayService.accounts$;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly achPositivePayService: AchPositivePayHttpService,
    private readonly notificationService: NotificationService,
    @Inject(ACH_POSITIVE_PAY_NEW_RULE_TRANSLATIONS)
    private overridingTranslations: Translations
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
  }

  ngOnInit(): void {
    this.achRuleForm = this.fb.group({
      arrangement: [undefined],
      companyId: [''],
      companyName: [''],
      paymentTypes: [''],
    });
  }

  closeModal() {
    this.loading = false;
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onSelectAccountId(account: ProductSummaryItem) {
    this.achRuleForm.get('arrangement')?.setValue(account);
  }

  submitRule() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.achPositivePayService.submitAchRule(this.achRuleForm.value).subscribe(
      () => {
        this.notificationService.showNotification({
          message: ACH_POSITIVE_PAY_TRANSLATIONS.rulesSubmittedSuccessfully,
        });
        this.closeModal();
      },
      (error) => (this.serverError = error.message)
    );
  }

  hideError() {
    this.serverError = undefined;
  }
}
