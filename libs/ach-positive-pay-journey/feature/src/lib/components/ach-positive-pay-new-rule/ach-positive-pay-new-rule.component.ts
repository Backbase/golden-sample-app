import { Component, OnInit } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AchPositivePayHttpService } from '@backbase-gsa/internal-ach-positive-pay-data-access';
import { NotificationService } from '@backbase/ui-ang/notification';
import { ACH_POSITIVE_PAY_TRANSLATIONS } from '@backbase-gsa/internal-ach-positive-pay-shared-data';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Observable } from 'rxjs';
import { ModalModule } from '@backbase/ui-ang/modal';
import { HeaderModule } from '@backbase/ui-ang/header';
import { AlertModule } from '@backbase/ui-ang/alert';
import { AchPositivePayRuleFormComponent } from '@backbase-gsa/internal-ach-positive-pay-ui';
import { LoadButtonModule } from '@backbase/ui-ang/load-button';
import { CommonModule } from '@angular/common';

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
    private readonly notificationService: NotificationService
  ) {}

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
