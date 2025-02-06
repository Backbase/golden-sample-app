import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountSelectorModule } from '@backbase/ui-ang/account-selector';
import {
  InitiatorFields,
  PaymentFormField,
  PaymentFormFieldConfig,
  PaymentFormFieldOptions,
} from '@backbase/internal-payments-shared-util';

import { AccountSelectorItem } from './initiator.model';
import { InitiatorService } from './initiator.service';

@Component({
  selector: 'app-payment-initiator',
  template: `
    <div [ngClass]="options.cssClasses || ''">
      <label class="d-block">
        <span> {{ options.label }} </span>
      </label>
      <bb-account-selector-ui
        placeholder="{{ options.placeholder }}"
        [items]="debitAccounts$ | async"
        [markFirst]="true"
        [highlight]="false"
        [disableScrollEnd]="false"
        [closeOnSelect]="true"
        [filterItems]="true"
        [dropdownPosition]="'bottom'"
        [multiple]="false"
        [required]="true"
        (change)="selectItem($any($event))"
        (blur)="onBlur()"
      >
      </bb-account-selector-ui>

      <div
        class="bb-input-validation-message"
        *ngIf="group?.touched && group?.invalid"
      >
        {{ requiredMessage }}
      </div>
    </div>
  `,
  providers: [InitiatorService],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AccountSelectorModule],
})

// The custom component MUST implement PaymentFormField or ActivatableFormField and it should be an Angular form control.
export class InitiatorComponent implements OnInit, PaymentFormField {
  config!: PaymentFormFieldConfig;
  group!: FormGroup;
  options!: PaymentFormFieldOptions;

  // Fetch arrangements from Banking Services to display in the dropdown
  debitAccounts$ = this.initiatorService.arrangements$;
  requiredMessage!: string;

  // Form controls based on InitiatorDetails
  private readonly initiatorFormControls: InitiatorFields[] = [
    InitiatorFields.id,
    InitiatorFields.name,
    InitiatorFields.accountNumber,
    InitiatorFields.currency,
  ];

  constructor(private readonly initiatorService: InitiatorService) {}

  ngOnInit() {
    this.setupInitiatorFormGroup(this.initiatorFormControls);
    this.requiredMessage = this.getValidationMessage('required');
  }

  onBlur() {
    this.group.markAllAsTouched();
  }

  selectItem(account: AccountSelectorItem) {
    this.group.patchValue({
      [InitiatorFields.id]: account.id,
      [InitiatorFields.name]: account.name,
      [InitiatorFields.accountNumber]: account.number,
      [InitiatorFields.currency]: account.currency,
    });

    this.group.markAllAsTouched();
    this.group.markAsDirty();
  }

  private getValidationMessage(key: string): string {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.options?.validationMessages?.find((field: any) => field.name === key)
        ?.message || ''
    );
  }

  private setupInitiatorFormGroup(fields: InitiatorFields[]) {
    fields.forEach((field: InitiatorFields) => {
      this.group.addControl(
        field,
        new FormControl(
          '',
          this.options.validators || [],
          this.options.asyncValidators || []
        )
      );
    });
  }
}
