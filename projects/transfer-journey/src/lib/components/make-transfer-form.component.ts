import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Account } from "../model/Account";

@Component({
  selector: 'bb-make-transfer-form',
  templateUrl: 'make-transfer-form.component.html'
})
export class MakeTransferFormComponent implements OnInit {
  @Input() account: Account | undefined;
  makeTransferForm!: FormGroup;

  private getControl(field: string): AbstractControl | undefined {
    return this.makeTransferForm.controls[field];
  }

  transfer() {
    if (this.makeTransferForm.valid) {
      
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
          value: `${this.account?.name}: €${this.account?.amount}`,
          disabled: true
        }],
        toAccount: ['', Validators.required],
        amount: ['', Validators.required],
    });
  }
}
