import { Component, Inject, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CONDITIONS, PropertyResolver } from "@backbase/foundation-ang/web-sdk";
import { Account, Transfer } from "../model/Account";

@Component({
  selector: 'bb-make-transfer-form',
  templateUrl: 'make-transfer-form.component.html'
})
export class MakeTransferFormComponent implements OnInit {
  @Input() account: Account | undefined;
  @Input() showMaksIndicator: boolean = true;

  makeTransferForm!: FormGroup;
  transferInQuestion: Transfer | undefined;
  showSummary = false;

  private getControl(field: string): AbstractControl | undefined {
    return this.makeTransferForm.controls[field];
  }

  private validateAmount(value: number) {
    return (control: AbstractControl) => {
      const amount = control.value.amount as number;
      console.log(amount);
      if(amount > value) {
        return {
          max: 'value is too high',
        }
      }

      return null;
    }
  }

  transfer() {
    if (this.makeTransferForm.valid) {
      this.transferInQuestion = {
        fromAccount: this.makeTransferForm.value.fromAccount,
        toAccount: this.makeTransferForm.value.toAccount,
        amount: this.makeTransferForm.value.amount.amount,
      }
      this.showSummary = true;
    } else {
      this.makeTransferForm.markAllAsTouched();
    }
  }

  hasError(field: string, type: string) {
    const control = this.getControl(field);

    return control && control.errors && control.errors[type];
  }

  isInvalidControl(field: string): boolean {
    const control = this.getControl(field);

    return !!control && control.touched && control.invalid;
  }

  confirmTransfer() {
    this.makeTransferForm.reset({
      fromAccount: `${this.showMaksIndicator ? '*****' : this.account?.name}: €${this.account?.amount}`,
      toAccount: '',
      amount: {
        amount: '',
        currency: 'EUR'
      },
    });
    this.transferInQuestion = undefined;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.makeTransferForm = this.fb.group({
        fromAccount: [{
          value: `${this.showMaksIndicator ? '*****' : this.account?.name}: €${this.account?.amount}`,
          disabled: true
        }],
        toAccount: ['', Validators.required],
        amount: ['', [Validators.required, this.validateAmount(this.account?.amount || 0)]],
    });
  }
}
