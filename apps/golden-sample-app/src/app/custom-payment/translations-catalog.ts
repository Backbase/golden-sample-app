export interface CustomPaymentOptionsTranslations {
  label?: string;
  placeholder?: string;
  validationMessage?: {
    required?: string;
    invalidAmount?: string;
    fundingBalence?: string;
  };
  heading?: string;
  helperText?: string;
}
export interface CustomPaymentFieldOptions {
  customInitiator: CustomPaymentOptionsTranslations;
  internalAccountSelector: CustomPaymentOptionsTranslations;
  remittanceInfoHeader: CustomPaymentOptionsTranslations;
  remittanceInfoAmountCurrencyGroup: CustomPaymentOptionsTranslations;
  remittanceInfoDescription: CustomPaymentOptionsTranslations;
}
export interface InternalTransfersPaymentConfig {
  name: string;
  businessFunction: string;
}
export interface CustomPaymentConfigTranslations {
  header: string;
}
export const internalTransfersPaymentConfigTranslations: InternalTransfersPaymentConfig =
  {
    name: $localize`:Internal Transfer Name - 'Internal Transfer'|This string is used as the name for the internal transfer payment type configuration. It is presented to the user when they are selecting or viewing the internal transfer payment type. This name is located in the internal transfer payment type configuration.@@internal-config.name:Internal Transfer`,
    businessFunction: $localize`:Business Function for Internal Transfer - 'A2A Transfer'|This string is used as the business function identifier for the internal transfer payment type configuration. It is used internally to specify the type of business function associated with the internal transfer. This identifier is located in the internal transfer payment type configuration.@@internal-config.business-function:A2A Transfer`,
  };
export const customPaymentConfigTranslations: CustomPaymentConfigTranslations =
  {
    header: $localize`:Make a Payment Link - 'Make internal payment (custom)'|This string is used as the header text for the custom payment form. It is presented to the user when they are making an internal payment using the custom payment form. This header is located at the top of the custom payment form layout.@@main.make-a-payment.link.text:Make internal payment (custom)`,
  };
export const paymentFormGroupTranslations: CustomPaymentFieldOptions = {
  customInitiator: {
    label: $localize`:Initiator Label - 'From'|This string is used as a label for the initiator account selection field in the custom payment form. It is presented to the user when they need to select an account to transfer from. This label is located in the custom payment form layout.@@internal-config.initiator-label:From`,
    placeholder: $localize`:Initiator Placeholder - 'Select an account'|This string is used as a placeholder for the initiator account selection field in the custom payment form. It is presented to the user when they need to select an account to transfer from. This placeholder is located in the custom payment form layout.@@internal-config.initiator-placeholder:Select an account`,
    validationMessage: {
      required: $localize`:Initiator Required Field Validation Message - 'Please select an account from the list to transfer from'|This string is used as a validation message for the initiator account selection field in the custom payment form. It is presented to the user when they attempt to submit the form without selecting an account to transfer from. This message is located in the custom payment form layout.@@mediator:Please select an account from the list to transfer from`,
    },
  },
  internalAccountSelector: {
    label: $localize`:Beneficiary Label - 'To'|This string is used as a label for the beneficiary account selection field in the custom payment form and in the internal transfer form. It is presented to the user when they need to select an account to transfer to. This label is located in the custom payment form layout and in the internal transfer form layout.@@internal-config.beneficiary-label:To`,
    placeholder: $localize`:Beneficiary Placeholder - 'Select an account'|This string is used as a placeholder for the beneficiary account selection field in the custom payment form and in the internal transfer form. It is presented to the user when they need to select an account to transfer to. This placeholder is located in the custom payment form layout and in the internal transfer form layout.@@internal-config.beneficiary-placeholder:Select an account`,
    validationMessage: {
      required: $localize`:Beneficiary Required Field Validation Message - 'Please select an account from the list to transfer to'|This string is used as a validation message for the beneficiary account selection field in the custom payment form. It is presented to the user when they attempt to submit the form without selecting an account to transfer to. This message is located in the custom payment form layout.@@internal-config.beneficiary-required-messag:Please select an account from the list to transfer to`,
    },
  },
  remittanceInfoHeader: {
    heading: $localize`:Payment details heading - 'Payment details'|This string is used as a heading for the remittance info as a header in the custom payment journey.It is presented to the user when they need to check the remittent of payment details@@internal-config.remittance-info-heading:Payment details`,
  },
  remittanceInfoAmountCurrencyGroup: {
    label: $localize`:Amount Label - 'Amount'|This string is used as a label for the amount input field in the custom payment form. It is presented to the user when they need to enter the amount for the transfer. This label is located in the custom payment form layout.@@internal-config.amount-label:Amount`,
    validationMessage: {
      invalidAmount: $localize`:Invalid Amount Validation Message - 'Please enter an amount of this transfer'|This string is used as a validation message for the amount input field in the custom payment form. It is presented to the user when they enter an invalid amount for the transfer. This message is located in the custom payment form layout.@@internal-config.invalid-amount-message:Please enter an amount of this transfer`,
      fundingBalence: $localize`:Funding Balance Validation Message - 'Funding account balance is less than payment amount.|This string is used as a validation message for the amount input field in the custom payment form. It is presented to the user when the funding account balance is less than the payment amount. This message is located in the custom payment form layout.@@internal-config.funding-balance-message:Funding account balance is less than payment amount.`,
    },
  },
  remittanceInfoDescription: {
    label: $localize`:Add Note Label - 'Add Note'|This string is used as a label for the note input field in the custom payment form. It is presented to the user when they need to add a note or description for the transfer. This label is located in the custom payment form layout.@@internal-config.add-note-label:Add Note`,
    placeholder: $localize`:Add Note Placeholder - 'Enter transfer description'|This string is used as a placeholder for the note input field in the custom payment form. It is presented to the user when they need to add a note or description for the transfer. This placeholder is located in the custom payment form layout.@@internal-config.add-Enter transfer description-placeholder:Enter transfer description`,
    helperText: $localize`:Add Note Helper Text - ' (Optional)'|This string is used as helper text for the note input field in the custom payment form. It is presented to the user to indicate that adding a note or description for the transfer is optional. This helper text is located in the custom payment form layout.@@internal-config.add-memo-helper-text: (Optional)`,
  },
};
export const counterPartyCustomPaymentTranslations: CustomPaymentOptionsTranslations =
  {
    label: $localize`:Beneficiary Label - 'To'|This string is used as a label for the beneficiary account selection field in the custom payment form and in the internal transfer form. It is presented to the user when they need to select an account to transfer to. This label is located in the custom payment form layout and in the internal transfer form layout.@@internal-config.beneficiary-label:To`,
    placeholder: $localize`:Beneficiary Placeholder - 'Select an account'|This string is used as a placeholder for the beneficiary account selection field in the custom payment form and in the internal transfer form. It is presented to the user when they need to select an account to transfer to. This placeholder is located in the custom payment form layout and in the internal transfer form layout.@@internal-config.beneficiary-placeholder:Select an account`,
    validationMessage: {
      required: $localize`:Beneficiary Required Field Validation Message - 'Please select an account from the list to transfer to'|This string is used as a validation message for the beneficiary account selection field in the custom payment form. It is presented to the user when they attempt to submit the form without selecting an account to transfer to. This message is located in the custom payment form layout.@@internal-config.beneficiary-required-messag:Please select an account from the list to transfer to`,
    },
  };
export const remittanceInfoCustomPaymentTranslations: CustomPaymentOptionsTranslations =
  {
    heading: $localize`:Payment details heading - 'Payment details'|This string is used as a heading for the remittance info as a header in the custom payment journey.It is presented to the user when they need to check the remittent of payment details@@internal-config.remittance-info-heading:Payment details`,
  };
