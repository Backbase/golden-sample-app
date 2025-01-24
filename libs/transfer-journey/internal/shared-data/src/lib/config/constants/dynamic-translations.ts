import '@angular/localize/init';

export const TRANSLATIONS = {
  makeTransferTitle: $localize`:Make Transfer Title - 'Make a transfer'|This string is used as the title for the make transfer page. It is presented to the user as the header of the page when they are making a transfer. This title is located at the top of the make transfer page.@@make-transfer-journey.header.text:Make a transfer`,
  maxError: $localize`:Make Transfer Form Max Validation Error - 'There is not enough balance'|This string is used as a validation error message for the make transfer form. It is presented to the user when they attempt to make a transfer that exceeds their available balance. This error message is located in the make transfer form layout.@@transfer.form.maxError:There is not enough balance`,
  limitError: (maxLimit: number) =>
    $localize`:Make Transfer Form Limit Validation Error - 'You cannot make a transfer greater than \${maxLimit}'|This string is used as a validation error message for the make transfer form. It is presented to the user when they attempt to make a transfer that exceeds the specified maximum limit. This error message is located in the make transfer form layout.@@transfer.form.limitError:You cannot make a transfer greater than ${maxLimit}`,
};
