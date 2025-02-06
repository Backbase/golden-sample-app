import '@angular/localize/init';

import {
  InitiatePaymentConfig,
  PaymentTypeConfig,
  CounterPartyFields,
  Frequencies,
  InitiatorFields,
  PaymentBaseFields,
  PaymentComponents,
  PaymentFormGroup,
  PaymentHooksCallbackFn,
  PaymentHooksParams,
  RemittanceInfoFields,
  ReviewScreens,
  ScheduleFields,
} from '@backbase/initiate-payment-journey-ang';


import { InitiatorComponent } from './components/initiator/initiator.component';
import { Validators } from '@angular/forms';

/**
 * Configuration group contains 1 field:
 * 1. initiatorAccountGroup
 *
 * This configuration group contains a custom component identifed by type "customInitiator".
 * Form fields created inside the configuration group are created by looking at the InitiatorDetails interface.
 * Check `initiator.componet.ts` to look at the form controls.
 */
const initiator: PaymentFormGroup = {
  name: PaymentBaseFields.initiator,
  fields: [
    {
      type: 'customInitiator',
      name: InitiatorFields.initiatorAccountGroup,
      options: {
        label: $localize`:Initiator Label - 'From'|This string is used as a label for the initiator account selection field in the custom payment form. It is presented to the user when they need to select an account to transfer from. This label is located in the custom payment form layout.@@internal-config.initiator-label:From`,
        placeholder: $localize`:Initiator Placeholder - 'Select an account'|This string is used as a placeholder for the initiator account selection field in the custom payment form. It is presented to the user when they need to select an account to transfer from. This placeholder is located in the custom payment form layout.@@internal-config.initiator-placeholder:Select an account`,
        cssClasses: ['col-12', 'bb-block', 'bb-block--lg'],
        validators: [Validators.required],
        validationMessages: [
          {
            name: 'required',
            message: $localize`:Initiator Required Field Validation Message - 'Please select an account from the list to transfer from'|This string is used as a validation message for the initiator account selection field in the custom payment form. It is presented to the user when they attempt to submit the form without selecting an account to transfer from. This message is located in the custom payment form layout.@@mediator:Please select an account from the list to transfer from`,
          },
        ],
      },
    },
  ],
};

/**
 * Configuration group contains 1 field:
 * 1. counterPartyAccountGroup
 *
 * If this group needs to be replaced by a custom component, check CounterPartyDetails interface to identify required fields for this group
 */
const counterParty: PaymentFormGroup = {
  name: PaymentBaseFields.counterparty,
  fields: [
    {
      type: PaymentComponents.internalAccountSelector,
      name: CounterPartyFields.counterPartyAccountGroup,
      options: {
        label: $localize`:Beneficiary Label - 'To'|This string is used as a label for the beneficiary account selection field in the custom payment form and in the internal transfer form. It is presented to the user when they need to select an account to transfer to. This label is located in the custom payment form layout and in the internal transfer form layout.@@internal-config.beneficiary-label:To`,
        placeholder: $localize`:Beneficiary Placeholder - 'Select an account'|This string is used as a placeholder for the beneficiary account selection field in the custom payment form and in the internal transfer form. It is presented to the user when they need to select an account to transfer to. This placeholder is located in the custom payment form layout and in the internal transfer form layout.@@internal-config.beneficiary-placeholder:Select an account`,
        cssClasses: ['col-12', 'bb-block', 'bb-block--lg'],
        validationMessages: [
          {
            name: 'required',
            message: $localize`:Beneficiary Required Field Validation Message - 'Please select an account from the list to transfer to'|This string is used as a validation message for the beneficiary account selection field in the custom payment form. It is presented to the user when they attempt to submit the form without selecting an account to transfer to. This message is located in the custom payment form layout.@@internal-config.beneficiary-required-messag:Please select an account from the list to transfer to`,
          },
        ],
      },
    },
  ],
};

/**
 * Configuration group contains 3 fields:
 * 1. header
 * 2. ammountCurrencyGroup
 * 3. description
 *
 * If this group needs to be replaced by a custom component, check RemittanceDetails interface to identify required fields for this group
 */
const remittanceInfo: PaymentFormGroup = {
  name: PaymentBaseFields.remittanceInfo,
  fields: [
    {
      type: PaymentComponents.header,
      name: PaymentComponents.header,
      options: {
        cssClasses: ['col-12', 'pb-0', 'pt-2', 'bb-fieldset__heading'],
        heading: $localize`:Payment details heading - 'Payment details'|This string is used as a heading for the remittance info as a header in the custom payment journey.It is presented to the user when they need to check the remittent of payment details@@internal-config.remittance-info-heading:Payment details`,
        headingType: 'h2',
        headingClasses: ['mb-0'],
        separatorLine: true,
      },
    },
    {
      type: PaymentComponents.amount,
      name: RemittanceInfoFields.amountCurrencyGroup,
      options: {
        label: $localize`:Amount Label - 'Amount'|This string is used as a label for the amount input field in the custom payment form. It is presented to the user when they need to enter the amount for the transfer. This label is located in the custom payment form layout.@@internal-config.amount-label:Amount`,
        cssClasses: ['d-block', 'align-top'],
        currencies: ['USD'],
        defaultValue: {
          amount: '0.00',
        },
        validators: [Validators.required],
        validationMessages: [
          {
            name: 'invalidAmount',
            message: $localize`:Invalid Amount Validation Message - 'Please enter an amount of this transfer'|This string is used as a validation message for the amount input field in the custom payment form. It is presented to the user when they enter an invalid amount for the transfer. This message is located in the custom payment form layout.@@internal-config.invalid-amount-message:Please enter an amount of this transfer`,
          },
          {
            name: 'fundingBalence',
            message: $localize`:Funding Balance Validation Message - 'Funding account balance is less than payment amount.|This string is used as a validation message for the amount input field in the custom payment form. It is presented to the user when the funding account balance is less than the payment amount. This message is located in the custom payment form layout.@@internal-config.funding-balance-message:Funding account balance is less than payment amount.`,
          },
        ],
      },
      hooks: {},
    },
    {
      type: PaymentComponents.textarea,
      name: RemittanceInfoFields.description,
      options: {
        label: $localize`:Add Note Label - 'Add Note'|This string is used as a label for the note input field in the custom payment form. It is presented to the user when they need to add a note or description for the transfer. This label is located in the custom payment form layout.@@internal-config.add-note-label:Add Note`,
        placeholder: $localize`:Add Note Placeholder - 'Enter transfer description'|This string is used as a placeholder for the note input field in the custom payment form. It is presented to the user when they need to add a note or description for the transfer. This placeholder is located in the custom payment form layout.@@internal-config.add-Enter transfer description-placeholder:Enter transfer description`,
        showCharCounter: true,
        minLength: 0,
        rows: 2,
        maxLength: 140,
        helperText: $localize`:Add Note Helper Text - ' (Optional)'|This string is used as helper text for the note input field in the custom payment form. It is presented to the user to indicate that adding a note or description for the transfer is optional. This helper text is located in the custom payment form layout.@@internal-config.add-memo-helper-text: (Optional)`,
        cssClasses: ['bb-block', 'bb-block--lg'],
      },
    },
  ],
};

/**
 * Configuration group contains 2 fields:
 * 1. startDate
 * 2. frequency
 *
 * If this group needs to be replaced by a custom component, check ScheduleItem interface to identify required fields for this group
 */
const schedule: PaymentFormGroup = {
  name: PaymentBaseFields.schedule,
  hidden: true,
  fields: [
    {
      type: PaymentComponents.date,
      name: ScheduleFields.startDate,
      options: {
        defaultValue: new Date().toISOString(),
      },
    },
    {
      type: PaymentComponents.select,
      name: ScheduleFields.frequency,
      options: {
        defaultValue: Frequencies.ONCE,
      },
    },
  ],
};

export const INTERNAL_TRANSFERS: PaymentTypeConfig = {
  fields: [initiator, counterParty, remittanceInfo, schedule],
  name: $localize`:Internal Transfer Name - 'Internal Transfer'|This string is used as the name for the internal transfer payment type configuration. It is presented to the user when they are selecting or viewing the internal transfer payment type. This name is located in the internal transfer payment type configuration.@@internal-config.name:Internal Transfer`,
  // dummy payment type and business function for the sake of this example
  paymentType: 'INTERNAL_TRANSFER',
  businessFunction: $localize`:Business Function for Internal Transfer - 'A2A Transfer'|This string is used as the business function identifier for the internal transfer payment type configuration. It is used internally to specify the type of business function associated with the internal transfer. This identifier is located in the internal transfer payment type configuration.@@internal-config.business-function:A2A Transfer`,
  // customFields property needs to be set here too due to a known bug
  customFields: {
    customInitiator: InitiatorComponent,
  },
};

export const customPaymentConfig: InitiatePaymentConfig = {
  paymentTypes: [INTERNAL_TRANSFERS],
  businessFunctions: [INTERNAL_TRANSFERS.businessFunction || ''],
  options: {
    enablePaymentTemplateSelector: false,
    enableSavePaymentAsTemplate: false,
    reviewScreenType: ReviewScreens.ADAPTED,
    isModalView: false,
    header: () =>
      $localize`:Make a Payment Link - 'Make internal payment (custom)'|This string is used as the header text for the custom payment form. It is presented to the user when they are making an internal payment using the custom payment form. This header is located at the top of the custom payment form layout.@@main.make-a-payment.link.text:Make internal payment (custom)`,
  },
  /**
   * Use hooks to perform additional logic at different stages of Payments journey. For eg,
   * 1. Use onSave hook to perform some action(s) before a payment is saved for validation
   * 2. Use onSubmit hook to perform some action(s) before a payment is submitted for processing
   */
  hooks: {
    onSave: (({ doneFn }: PaymentHooksParams) => {
      doneFn();
    }) as PaymentHooksCallbackFn,
    onSubmit: (({ doneFn }: PaymentHooksParams) => {
      doneFn();
    }) as PaymentHooksCallbackFn,
  },
  customFields: {
    customInitiator: InitiatorComponent,
  },
};
