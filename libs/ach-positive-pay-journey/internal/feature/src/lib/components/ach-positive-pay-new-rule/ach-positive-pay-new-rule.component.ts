import { Component, OnInit } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AchPositivePayHttpService } from '@backbase-gsa/ach-positive-pay-journey/internal/data-access';
import { NotificationService } from '@backbase/ui-ang/notification';
import { ACH_POSITIVE_PAY_TRANSLATIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Observable } from 'rxjs';
import { ModalModule } from '@backbase/ui-ang/modal';
import { AlertModule } from '@backbase/ui-ang/alert';
import { PageHeaderModule } from '@backbase/ui-ang/page-header';
import { LoadButtonModule } from '@backbase/ui-ang/load-button';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@backbase/ui-ang/button';
import { AchPositivePayRuleFormComponent } from '@backbase-gsa/ach-positive-pay-journey/internal/ui';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'bb-ach-positive-pay-new-rule',
  templateUrl: './ach-positive-pay-new-rule.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule,
    PageHeaderModule,
    AlertModule,
    LoadButtonModule,
    ButtonModule,
    AchPositivePayRuleFormComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  onSelectAccountId(event: any) {
    if (event && typeof event === 'object' && 'id' in event) {
      this.achRuleForm.get('arrangement')?.setValue(event);
    }
  }

  submitRule() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.achPositivePayService.submitAchRule(this.achRuleForm.value).subscribe(
      () => {
        this.notificationService.showNotification({
          header: 'Success',
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
