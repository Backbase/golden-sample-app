# Add a custom component to Initiate Payments Journey

## Scope

Scope of this example is to explain how to create a custom component and connect it with the out-of-the-box Initiate Payments Journey. The component in this example replaces the out-of-the-box `intiator` group but it can also be used to replace any other configuration group such as `counterparty`, `remittanceInfo` and `schedule` or add a new `additions` configuration group.

## Initiate Payments Journey

Initiate Payment journey allows customers create or edit a payment. The journey is fully customizable with a TypeScript configuration to support different payment types, guide on this topic can be found [here](https://backbase.io/documentation/business-banking-usa/2024.12/payments/web/initiate-payment-configuration). Check included links or the documentation on backbase.io to learn more about internal workings of the journey and [out-of-the-box configurations](https://backbase.io/documentation/business-banking-usa/2024.12/payments/web/initiate-payment-understand) for different payment types.

### Create a payment

**!important**
As of now, this is a code-sample only, do not expect, that feature is working e2e.

In a nutshell, when making a payment, the bank customer enters the following information in a payments form:

1. From account / Debit account / Initiator
2. To account / Credit account / Counterparty
3. Amount
4. Payment Schedule

The details are captured in the form through configuration groups below and are provided to the `fields` property of the payment configuration. Check the enum `PaymentBaseFields` for more information. The groups are constructed by selecting one or more of the Payment Components.

- `initiator`
- `counterparty`
- `remittanceInfo`
- `schedule`
- `additions`(Optional)

All out-of-the-box configurations define the above mandatory fields and in addition may have some fields specific to the payment type. These fields are combined together to create a payment config of type `InitiatePaymentConfig` provided to the journey using Injection Token `INITIATE_PAYMENT_CONFIG`. This is demonstrated in `initiate-payment-journey-bundle-module.ts`.

## Custom Initiator Component

The task is to replace the existing component used inside the `initiator` configuration group with a custom one and apply this change to the configuration. The example is valid not only for the `initiator` group, but for any configuration group of any component.

Each configuration group adheres to certain defined types. For example, the out-of-the-box component for `initiator` follows types defined in the interface `InitiatorDetails`. Similarly, `counterparty`, `remittanceInfo`, and `schedule` configuration groups adhere to types defined in `CounterPartyDetails`, `RemittanceDetails`, and `ScheduleItem` respectively.

**IMPORTANT**: Your custom component MUST adhere to the type interface of the component it's replacing. This is mandatory for the payments journey business logic to work correctly and integrate with Banking Services. Any deviation from the type will cause validation or submission errors.

### Custom Component Structure

The custom component must:
1. **Implement `PaymentFormField` interface** - Required by the journey framework
2. **Have required properties** - `config`, `group`, `options`
3. **Manage form controls** - Based on the field interface (e.g., `InitiatorFields`)
4. **Handle selection and validation** - Update the form group with selected values

### Minimal Example

Here's what a custom component needs:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  InitiatorFields,
  PaymentFormField,
  PaymentFormFieldConfig,
  PaymentFormFieldOptions,
} from '@backbase/initiate-payment-journey-ang';

@Component({
  selector: 'bb-payment-initiator',
  template: `
    <div>
      <!-- Your custom UI here -->
      <select (change)="selectItem($event)">
        <option value="">Select Account</option>
        <option *ngFor="let account of accounts" [value]="account.id">
          {{ account.name }}
        </option>
      </select>
    </div>
  `,
  standalone: false,
})
export class InitiatorComponent implements OnInit, PaymentFormField {
  // Required properties from PaymentFormField interface
  config!: PaymentFormFieldConfig;
  group!: FormGroup;
  options!: PaymentFormFieldOptions;

  accounts: any[] = [];

  ngOnInit() {
    // Set up form controls for required fields
    [InitiatorFields.id, InitiatorFields.name].forEach(field => {
      this.group.addControl(field, new FormControl('', this.options.validators));
    });
  }

  selectItem(event: any) {
    // Update form with selected values
    this.group.patchValue({
      [InitiatorFields.id]: event.target.value,
      [InitiatorFields.name]: event.target.options[event.target.selectedIndex].text,
    });
  }
}
```

### Real Implementation

For the complete, production-ready example in this application, see:

- **Component**: `libs/journey-bundles/custom-payment/src/lib/components/initiator/initiator.component.ts`
- **Service**: `libs/journey-bundles/custom-payment/src/lib/components/initiator/initiator.service.ts`
- **Model**: `libs/journey-bundles/custom-payment/src/lib/components/initiator/initiator.model.ts`

This implementation includes:
- ✅ Account selector UI with async data loading
- ✅ Form validation with error messages
- ✅ Service integration for fetching arrangements
- ✅ Proper type safety with models
- ✅ Accessibility considerations

### Integration in Bundle Module

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
          // Other configuration groups
        ],
      },
    },
  ],
})
export class InitiatePaymentJourneyBundleModule {}
```

### Field Interfaces by Group

- **Initiator**: `InitiatorFields` - debit account/source
- **Counterparty**: `CounterPartyFields` - credit account/destination
- **Remittance Info**: `RemittanceFields` - payment details and purpose
- **Schedule**: `ScheduleFields` - payment timing (immediate, scheduled, recurring)

### Next Steps

1. Review the complete example in `components/initiator/`
2. Copy the pattern for your use case
3. Implement your custom component
4. Register it in the bundle module configuration
5. Test thoroughly before deploying to production

For more information on the Initiate Payments Journey, see the [Backbase documentation](https://backbase.io/documentation/business-banking-usa/2024.12/payments/web/initiate-payment-configuration).
