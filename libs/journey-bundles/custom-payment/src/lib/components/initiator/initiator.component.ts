import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  InitiatorFields,
  PaymentFormField,
  PaymentFormFieldConfig,
  PaymentFormFieldOptions,
} from '@backbase/initiate-payment-journey-ang';

import { AccountSelectorItem } from './initiator.model';
import { InitiatorService } from './initiator.service';

@Component({
  selector: 'bb-payment-initiator',
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

<<<<<<< Updated upstream
      @if (group.touched && group.invalid) {
=======
      @if (group?.touched && group?.invalid) {
>>>>>>> Stashed changes
      <div class="bb-input-validation-message">
        {{ requiredMessage }}
      </div>
      }
    </div>
  `,
  providers: [InitiatorService],
  standalone: false,
})

// The custom component MUST implement PaymentFormField or ActivatableFormField and it should be an Angular form control.
export class InitiatorComponent implements OnInit, PaymentFormField {
  private readonly initiatorService: InitiatorService =
    inject(InitiatorService);
  config!: PaymentFormFieldConfig;
  group!: FormGroup;
  options!: PaymentFormFieldOptions;

  // Fetch arrangements from Banking Services to display in the dropdown
  debitAccounts$;
  requiredMessage!: string;

  // Form controls based on InitiatorDetails
  private initiatorFormControls: InitiatorFields[] = [
    InitiatorFields.id,
    InitiatorFields.name,
    InitiatorFields.accountNumber,
    InitiatorFields.currency,
  ];

  constructor() {
    this.debitAccounts$ = this.initiatorService.arrangements$;
  }

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
