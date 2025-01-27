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
import { TRANSFER_JOURNEY_MAKE_TRANSFER_FORM_TRANSLATIONS } from './translations.provider';

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

  overridingTranslations = Inject(
    TRANSFER_JOURNEY_MAKE_TRANSFER_FORM_TRANSLATIONS
  );

  translations = {
    'transfer.form.fromAccount.label':
      this.overridingTranslations['transfer.form.fromAccount.label'] ||
      $localize`:From account label - 'From account'|This string is used as the label for the
        'From Account' field in the transfer form. It is presented to the user when
        they need to specify the source account for the transfter. This label is
        located in the transfer form layout@@transfer.form.fromAccount.label:From account`,
    'transfer.form.toAccount.label':
      this.overridingTranslations['transfer.form.toAccount.label'] ||
      $localize`:To account label - 'To Account'|This string is used as the label for
          the 'To Account' field in the transfer form. It is presented to the
          user when they need to specify the destination account for the
          transfer. This label is located in the transfer form
          layout.@@transfer.form.toAccount.label:To account`,
    'transfer.form.toAccount.placeholder':
      this.overridingTranslations['transfer.form.toAccount.placeholder'] ||
      $localize`:From account placeholder - 'type an account name'|This string is used
          as the placeholder for the 'From Account' field in the transfer form.
          It is presented to the user when they need to type the name of the
          account from which the transfer will be made. This placeholder is
          located in the transfer form
          layout.@@transfer.form.toAccount.placeholder:type an account name`,
    'transfer.form.toAccount.error.required':
      this.overridingTranslations['transfer.form.toAccount.error.required'] ||
      $localize`:To account required error message - 'Required field'|This string
              is used as the error message for the 'To Account' field in the
              transfer form when the field is required but not filled. It is
              presented to the user when they need to fill in the 'To Account'
              field. This error message is located in the transfer form
              layout.@@transfer.form.toAccount.error.required:Required field`,
    'transfer.form.amount.label':
      this.overridingTranslations['transfer.form.amount.label'] ||
      $localize`:Amount label - 'Amount'|This string is used as the label for the
      'Amount' field in the transfer form. It is presented to the user when
      they need to specify the amount to be transferred. This label is
      located in the transfer form layout@@transfer.form.amount.label:Amount`,
    'transfer.form.amount.error.required':
      this.overridingTranslations['transfer.form.amount.error.required'] ||
      $localize`:Amount required error - 'Required field'|This string
              is used as the error message for the 'Amount' field in the
              transfer form when the field is required but not filled. It is
              presented to the user when they need to fill in the 'Amount'
              field. This error message is located in the transfer form
              layout.@@transfer.form.amount.error.required:Required field`,
    'transfer.form.submit.text':
      this.overridingTranslations['transfer.form.submit.text'] ||
      $localize`:Submit button label - 'Submit'|This string is used as the label for the
      'Submit' button in the transfer form. It is presented to the user as the button to be
      pressed when the data in form is ready to make a transfer. This label is
      located in the transfer form layout@@transfer.form.submit.text:Submit`,
  };

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

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

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
