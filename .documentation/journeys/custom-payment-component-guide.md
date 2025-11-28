<!-- .documentation/journeys/custom-payment-component-guide.md -->

### How to Add a Custom Component to Initiate Payments Journey

This guide shows how to create a custom component and integrate it with the Initiate Payments Journey.

###### Overview

The Initiate Payments Journey is fully customizable through TypeScript configuration. This example demonstrates how to replace the out-of-the-box `initiator` component (the debit/source account selector) with a custom component.

The same principles apply to replacing other configuration groups like `counterparty`, `remittanceInfo`, and `schedule`, or adding new `additions` groups.

###### Why Create a Custom Component?

The out-of-the-box components may not meet all business requirements. Custom components allow you to:
- Implement custom validation logic
- Add business-specific account filtering
- Customize the UI/UX for your use case
- Integrate with custom services or APIs
- Support specialized payment scenarios

###### Key Requirement: Implement PaymentFormField

Your custom component **MUST** implement the `PaymentFormField` interface from `@backbase/initiate-payment-journey-ang`:

```typescript
import { PaymentFormField } from '@backbase/initiate-payment-journey-ang';

export class YourCustomComponent implements PaymentFormField {
  // Required properties
  config!: PaymentFormFieldConfig;
  group!: FormGroup;
  options!: PaymentFormFieldOptions;
}
```

This interface ensures your component integrates properly with the payment journey business logic.

###### Real Example: Custom Initiator Component

Here's the actual `InitiatorComponent` from the application:

**Component File** (`initiator.component.ts`):

```typescript
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
        #accountSelector
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

      @if (group?.touched && group?.invalid) {
      <div class="bb-input-validation-message">
        {{ requiredMessage }}
      </div>
      }
    </div>
  `,
  providers: [InitiatorService],
  standalone: false,
})
// The custom component MUST implement PaymentFormField
export class InitiatorComponent implements OnInit, PaymentFormField {
  private readonly initiatorService: InitiatorService =
    inject(InitiatorService);
  
  // Required by PaymentFormField interface
  config!: PaymentFormFieldConfig;
  group!: FormGroup;
  options!: PaymentFormFieldOptions;

  // Component-specific properties
  debitAccounts$;
  requiredMessage!: string;

  // Form controls based on InitiatorDetails interface
  private initiatorFormControls: InitiatorFields[] = [
    InitiatorFields.id,
    InitiatorFields.name,
    InitiatorFields.accountNumber,
    InitiatorFields.currency,
  ];

  constructor() {
    // Load debit accounts from service
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
    // Update form with selected account details
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
```

**Service File** (`initiator.service.ts`):

```typescript
// Fetch arrangements/debit accounts from Banking Services
@Injectable()
export class InitiatorService {
  private http = inject(HttpClient);

  arrangements$ = this.http.get<AccountSelectorItem[]>('/api/arrangements');
}
```

**Model File** (`initiator.model.ts`):

```typescript
export interface AccountSelectorItem {
  id: string;
  name: string;
  number: string;
  currency: string;
}
```

###### Integration: Using the Custom Component

To use your custom component in the payment configuration, provide it in the bundle module:

**Bundle Module** (`initiate-payment-journey-bundle.module.ts`):

```typescript
import { INITIATE_PAYMENT_CONFIG } from '@backbase/initiate-payment-journey-ang';
import { InitiatorComponent } from './components/initiator/initiator.component';

@NgModule({
  imports: [InitiatorComponent, /* other imports */],
  providers: [
    {
      provide: INITIATE_PAYMENT_CONFIG,
      useValue: {
        fields: [
          {
            type: 'initiator',
            component: InitiatorComponent, // Your custom component
          },
          // Other payment configuration groups
        ],
      },
    },
  ],
})
export class InitiatePaymentJourneyBundleModule {}
```

###### Important Considerations

**1. Form Control Names**

Your form controls must match the interface expected by the journey:

```typescript
// For initiator, use InitiatorFields
private initiatorFormControls: InitiatorFields[] = [
  InitiatorFields.id,
  InitiatorFields.name,
  InitiatorFields.accountNumber,
  InitiatorFields.currency,
];

// For counterparty, use CounterPartyFields
// For remittance info, use RemittanceFields
// etc.
```

**2. Validation**

Use the validators provided in `PaymentFormFieldOptions`:

```typescript
new FormControl(
  '',
  this.options.validators || [],      // Synchronous validators
  this.options.asyncValidators || []  // Asynchronous validators
)
```

**3. Styling**

Apply CSS classes from options:

```html
<div [ngClass]="options.cssClasses || ''">
  <!-- Component content -->
</div>
```

**4. Error Messages**

Get localized validation messages from options:

```typescript
private getValidationMessage(key: string): string {
  return (
    this.options?.validationMessages?.find((field: any) => field.name === key)
      ?.message || ''
  );
}
```

###### Component Structure for Custom Payment

The custom payment bundle is organized as:

```
libs/journey-bundles/custom-payment/
├── src/lib/
│   ├── components/
│   │   └── initiator/
│   │       ├── initiator.component.ts      ← Custom component
│   │       ├── initiator.model.ts          ← Data models
│   │       └── initiator.service.ts        ← Business logic
│   ├── custom-payment.config.ts            ← Configuration
│   ├── initiate-payment-journey-bundle.module.ts  ← Bundle module
│   ├── navigation.ts                       ← Navigation setup
│   └── route.ts                            ← Route definition
```

###### Learn More

For detailed information about the Initiate Payments Journey configuration, see:
- [Initiate Payment Configuration](https://backbase.io/documentation/business-banking-usa/2024.12/payments/web/initiate-payment-configuration)
- [Out-of-the-box Configurations](https://backbase.io/documentation/business-banking-usa/2024.12/payments/web/initiate-payment-understand)
- Payment Types and Scenarios in Backbase Documentation

###### Full Example Location

The complete working example is available in:
- `libs/journey-bundles/custom-payment/src/lib/components/initiator/`

