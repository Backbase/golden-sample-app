import {
  Component,
  Inject,
  InjectionToken,
  OnInit,
  Optional,
} from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AchPositivePayHttpService } from '@backbase-gsa/ach-positive-pay-journey/internal/data-access';
import { NotificationService } from '@backbase/ui-ang/notification';
import { ACH_POSITIVE_PAY_TRANSLATIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';
import { ProductSummaryItem } from '@backbase/arrangement-manager-http-ang';
import { Observable, catchError, finalize, of, switchMap } from 'rxjs';
import { ModalModule } from '@backbase/ui-ang/modal';
import { AlertModule } from '@backbase/ui-ang/alert';
import { PageHeaderModule } from '@backbase/ui-ang/page-header';
import { LoadButtonModule } from '@backbase/ui-ang/load-button';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@backbase/ui-ang/button';
import { AchPositivePayRuleFormComponent } from '@backbase-gsa/ach-positive-pay-journey/internal/ui';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Define a minimal interface for transaction signing service
export interface TransactionSigningInterface {
  signTransaction(transactionId: string): Observable<boolean>;
}

// Define local token to prevent circular dependencies
export const ACH_TRANSACTION_SIGNING_SERVICE =
  new InjectionToken<TransactionSigningInterface>(
    'ACH_TRANSACTION_SIGNING_SERVICE'
  );

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
  signingInProgress = false;
  transactionSigningEnabled = false;

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
    @Optional()
    @Inject(ACH_TRANSACTION_SIGNING_SERVICE)
    private readonly transactionSigningService: TransactionSigningInterface
  ) {
    this.transactionSigningEnabled = !!this.transactionSigningService;
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

  onSelectAccountId(event: any) {
    if (event && typeof event === 'object' && 'id' in event) {
      this.achRuleForm.get('arrangement')?.setValue(event);
    }
  }

  submitRule() {
    if (this.loading || this.signingInProgress) {
      return;
    }

    this.loading = true;

    // If transaction signing is not enabled, submit directly
    if (!this.transactionSigningEnabled || !this.transactionSigningService) {
      this.submitDirectly();
      return;
    }

    // Otherwise use transaction signing flow
    this.signingInProgress = true;

    // Generate a transaction ID based on timestamp and form values
    const transactionId = `ach-rule-${Date.now()}-${
      this.achRuleForm.get('companyId')?.value
    }`;

    // Call transaction signing service first
    this.transactionSigningService
      .signTransaction(transactionId)
      .pipe(
        // Only proceed with submission if signing is successful
        switchMap((signingResult) => {
          if (!signingResult) {
            throw new Error('Transaction signing failed');
          }
          return this.achPositivePayService.submitAchRule(
            this.achRuleForm.value
          );
        }),
        catchError((error) => {
          this.serverError =
            error.message || 'An error occurred during transaction signing';
          return of(null);
        }),
        finalize(() => {
          this.signingInProgress = false;
        })
      )
      .subscribe((result) => {
        if (result) {
          this.notificationService.showNotification({
            header: 'Success',
            message: ACH_POSITIVE_PAY_TRANSLATIONS.rulesSubmittedSuccessfully,
          });
          this.closeModal();
        }
        this.loading = false;
      });
  }

  private submitDirectly() {
    this.achPositivePayService.submitAchRule(this.achRuleForm.value).subscribe(
      () => {
        this.notificationService.showNotification({
          header: 'Success',
          message: ACH_POSITIVE_PAY_TRANSLATIONS.rulesSubmittedSuccessfully,
        });
        this.closeModal();
      },
      (error) => {
        this.serverError = error.message;
        this.loading = false;
      }
    );
  }

  hideError() {
    this.serverError = undefined;
  }
}
