import '@angular/localize/init';

import {
  CounterPartyFields,
  Frequencies,
  InitiatePaymentConfig,
  InitiatorFields,
  PaymentBaseFields,
  PaymentComponents,
  PaymentFormGroup,
  PaymentHooksCallbackFn,
  PaymentHooksParams,
  PaymentTypeConfig,
  RemittanceInfoFields,
  ReviewScreens,
  ScheduleFields,
} from '@backbase/initiate-payment-journey-ang';

import { InitiatorComponent } from './components/initiator/initiator.component';
import { Validators } from '@angular/forms';
import {
  customPaymentConfigTranslations,
  internalTransfersPaymentConfigTranslations,
  paymentFormGroupTranslations,
} from './translations-catalog';

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
        label: paymentFormGroupTranslations.customInitiator.label,
        placeholder: paymentFormGroupTranslations.customInitiator.placeholder,
        cssClasses: ['col-12', 'bb-block', 'bb-block--lg'],
        validators: [Validators.required],
        validationMessages: [
          {
            name: 'required',
            message:
              paymentFormGroupTranslations.customInitiator.validationMessage
                ?.required ?? '',
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
        label: paymentFormGroupTranslations.internalAccountSelector.label,
        placeholder:
          paymentFormGroupTranslations.internalAccountSelector.placeholder,
        cssClasses: ['col-12', 'bb-block', 'bb-block--lg'],
        validationMessages: [
          {
            name: 'required',
            message:
              paymentFormGroupTranslations.internalAccountSelector
                .validationMessage?.required ?? '',
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
        heading: paymentFormGroupTranslations.remittanceInfoHeader.heading,
        headingType: 'h2',
        headingClasses: ['mb-0'],
        separatorLine: true,
      },
    },
    {
      type: PaymentComponents.amount,
      name: RemittanceInfoFields.amountCurrencyGroup,
      options: {
        label:
          paymentFormGroupTranslations.remittanceInfoAmountCurrencyGroup.label,
        cssClasses: ['d-block', 'align-top'],
        currencies: ['USD'],
        defaultValue: {
          amount: '0.00',
        },
        validators: [Validators.required],
        validationMessages: [
          {
            name: 'invalidAmount',
            message:
              paymentFormGroupTranslations.remittanceInfoAmountCurrencyGroup
                .validationMessage?.invalidAmount ?? '',
          },
          {
            name: 'fundingBalence',
            message:
              paymentFormGroupTranslations.remittanceInfoAmountCurrencyGroup
                .validationMessage?.fundingBalence ?? '',
          },
        ],
      },
      hooks: {},
    },
    {
      type: PaymentComponents.textarea,
      name: RemittanceInfoFields.description,
      options: {
        label: paymentFormGroupTranslations.remittanceInfoDescription.label,
        placeholder:
          paymentFormGroupTranslations.remittanceInfoDescription.placeholder,
        showCharCounter: true,
        minLength: 0,
        rows: 2,
        maxLength: 140,
        helperText:
          paymentFormGroupTranslations.remittanceInfoDescription.helperText,
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
  name: internalTransfersPaymentConfigTranslations.name,
  // dummy payment type and business function for the sake of this example
  paymentType: 'INTERNAL_TRANSFER',
  businessFunction: internalTransfersPaymentConfigTranslations.businessFunction,
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
    header: () => customPaymentConfigTranslations.header,
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
