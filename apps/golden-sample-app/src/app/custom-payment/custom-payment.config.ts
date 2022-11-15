import { Validators } from '@angular/forms';
import '@angular/localize/init';
import {
  Frequencies,
  ScheduleFields,
  CounterPartyFields,
  InitiatePaymentConfig,
  InitiatorFields,
  PaymentBaseFields,
  PaymentComponents,
  PaymentFormGroup,
  PaymentHooksParams,
  PaymentTypeConfig,
  RemittanceInfoFields,
  ReviewScreens,
  PaymentHooksCallbackFn,
} from '@backbase/initiate-payment-journey-ang';
import { InitiatorComponent } from './components/initiator/initiator.component';

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
        label: $localize`:@@internal-config.initiator-label:From`,
        placeholder: $localize`:@@internal-config.initiator-placeholder:Select an account`,
        cssClasses: ['col-12', 'bb-block', 'bb-block--lg'],
        validators: [Validators.required],
        validationMessages: [
          {
            name: 'required',
            message: 'Please select an account from the list to transfer from',
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
        label: $localize`:@@internal-config.beneficiary-label:To`,
        placeholder: $localize`:@@internal-config.beneficiary-placeholder:Select an account`,
        cssClasses: ['col-12', 'bb-block', 'bb-block--lg'],
        validationMessages: [
          {
            name: 'required',
            message: 'Please select an account from the list to transfer to',
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
        heading: $localize`:@@internal-config.remittance-info-heading:Payment details`,
        headingType: 'h2',
        headingClasses: ['mb-0'],
        separatorLine: true,
      },
    },
    {
      type: PaymentComponents.amount,
      name: RemittanceInfoFields.amountCurrencyGroup,
      options: {
        label: 'Amount',
        cssClasses: ['d-block', 'align-top'],
        currencies: ['USD'],
        defaultValue: {
          amount: '0.00',
        },
        validators: [Validators.required],
        validationMessages: [
          {
            name: 'invalidAmount',
            message: 'Please enter an amount of this transfer',
          },
          {
            name: 'fundingBalence',
            message: 'Funding account balance is less than payment amount.',
          },
        ],
      },
      hooks: {},
    },
    {
      type: PaymentComponents.textarea,
      name: RemittanceInfoFields.description,
      options: {
        label: 'Add Note',
        placeholder: $localize`:@@internal-config.add-Enter transfer description-placeholder:Enter transfer description`,
        showCharCounter: true,
        minLength: 0,
        rows: 2,
        maxLength: 140,
        helperText: $localize`:@@internal-config.add-memo-helper-text: (Optional)`,
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
  name: $localize`:@@internal-config.name:Internal Transfer`,
  // dummy payment type and business function for the sake of this example
  paymentType: 'INTERNAL_TRANSFER',
  businessFunction: 'A2A Transfer',
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
      $localize`:Make a Payment Link@@main.make-a-payment.link.text:Make internal payment (custom)`,
  },
  /**
   * Use hooks to perform additiona logic at different stages of Payments journey. For eg,
   * 1. Use onSave hook to perform some action(s) before a payment is saved for validation
   * 2. Use onSubmit hook to perform some action(s) before a payment is submitted for processing
   */
  hooks: {
    onSave: (({ form, doneFn }: PaymentHooksParams) => {
      doneFn();
    }) as PaymentHooksCallbackFn,
    onSubmit: (({ form, doneFn }: PaymentHooksParams) => {
      doneFn();
    }) as PaymentHooksCallbackFn,
  },
  customFields: {
    customInitiator: InitiatorComponent,
  },
};
