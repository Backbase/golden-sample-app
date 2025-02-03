import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InputValidationMessageModule } from '@backbase/ui-ang/input-validation-message';
import { CurrencyInputModule } from '@backbase/ui-ang/currency-input';
import { ButtonModule } from '@backbase/ui-ang/button';
import {
  TRANSLATIONS,
  Account,
  Transfer,
} from '@backbase-gsa/transfer-journey/internal/shared-data';
import { ActivatedRoute } from '@angular/router';
import {
  TRANSFER_JOURNEY_MAKE_TRANSFER_FORM_TRANSLATIONS,
  transferJourneyMakeTransferFormTranslations,
  TransferJourneyMakeTransferFormTranslations,
} from '../../../translations-catalog';

@Component({
  selector: 'bb-make-transfer-form',
  templateUrl: 'make-transfer-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputValidationMessageModule,
    CurrencyInputModule,
    ButtonModule,
  ],
  standalone: true,
})
export class MakeTransferFormComponent implements OnInit {
  @Input() account: Account | undefined;
  @Input() showMaskIndicator = true;
  @Input() maxLimit = 0;

  @Output() submitTransfer = new EventEmitter<Transfer | undefined>();

  makeTransferForm!: FormGroup;
  currencies = ['USD', 'EUR'];

  private readonly defaultTranslations: TransferJourneyMakeTransferFormTranslations =
    transferJourneyMakeTransferFormTranslations;
  public readonly translations: TransferJourneyMakeTransferFormTranslations;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    @Inject(TRANSFER_JOURNEY_MAKE_TRANSFER_FORM_TRANSLATIONS)
    private readonly overridingTranslations: Partial<TransferJourneyMakeTransferFormTranslations>
  ) {
    
    
    this.translations = {
      ...this.defaultTranslations,
      ...Object.fromEntries(
        Object.entries(this.overridingTranslations ?? {}).map(([key, value]) => [
          key,
          value ?? this.defaultTranslations[key],
        ])
      ),
    };
  }

  private getControl(field: string): AbstractControl | undefined {
    return this.makeTransferForm.controls[field];
  }

  private validateAmount(
    value: number,
    description: string
  ): (control: AbstractControl) => unknown {
    return (control: AbstractControl) => {
      const amount = control?.value?.amount as number;

      if (amount > value) {
        return {
          max: description,
        };
      }

      return null;
    };
  }

  transfer(): void {
    if (this.makeTransferForm.valid) {
      this.submitTransfer.emit({
        fromAccount: this.makeTransferForm.value.fromAccount,
        toAccount: this.makeTransferForm.value.toAccount,
        amount: this.makeTransferForm.value.amount.amount,
      });
    } else {
      this.makeTransferForm.markAllAsTouched();
    }
  }

  getError(field: string, type: string): string {
    const control = this.getControl(field);

    return control && control.errors && control.errors[type];
  }

  isInvalidControl(field: string): boolean {
    const control = this.getControl(field);

    return !!control && control.touched && control.invalid;
  }

  ngOnInit(): void {
    const accountName: string =
      this.route.snapshot.parent?.params['accountName'];
    const amount: string = this.route.snapshot.parent?.params['amount'];

    this.makeTransferForm = this.fb.group({
      fromAccount: [
        {
          value: `${this.showMaskIndicator ? '*****' : this.account?.name}: ${
            this.account?.amount
          }`,
          disabled: true,
        },
      ],
      toAccount: [accountName, Validators.required],
      amount: [
        amount ? { amount: parseFloat(amount) } : '',
        [
          Validators.required,
          this.validateAmount(this.account?.amount || 0, TRANSLATIONS.maxError),
          ...(this.maxLimit > 0
            ? [
                this.validateAmount(
                  this.maxLimit,
                  TRANSLATIONS.limitError(this.maxLimit)
                ),
              ]
            : []),
        ],
      ],
    });
  }
}
