import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Account, Transfer } from "../model/Account";

@Component({
  selector: 'bb-make-transfer-form',
  templateUrl: 'make-transfer-form.component.html'
})
export class MakeTransferFormComponent implements OnInit {
  @Input() account: Account | undefined;
  @Input() showMaksIndicator: boolean = true;

  @Output() submitTransfer = new EventEmitter<Transfer>();
  makeTransferForm!: FormGroup;

  private getControl(field: string): AbstractControl | undefined {
    return this.makeTransferForm.controls[field];
  }

  private validateAmount(value: number) {
    return (control: AbstractControl) => {
      const amount = control.value.amount as number;

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
      this.submitTransfer.emit({
        fromAccount: this.makeTransferForm.value.fromAccount,
        toAccount: this.makeTransferForm.value.toAccount,
        amount: this.makeTransferForm.value.amount.amount,
      })
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
