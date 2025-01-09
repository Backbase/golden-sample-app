import '@angular/localize/init';

export const TRANSLATIONS = {
  makeTransferTitle: $localize`:make transfer title|header of the page@@make-transfer-journey.header.text:Make a transfer`,
  maxError: $localize`:make transfer form max validation error|max value error form@@transfer.form.maxError:There is not enough balance`,
  limitError: (maxLimit: number) =>
    $localize`:make transfer form limit validation error|limit value error form@@transfer.form.limitError:You cannot make a transfer greater than ${maxLimit}`,
};
