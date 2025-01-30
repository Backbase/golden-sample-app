import {
  Component,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  Output,
} from '@angular/core';
import { Transfer } from '@backbase-gsa/transfer-journey/internal/shared-data';
import { ButtonModule } from '@backbase/ui-ang/button';

export const TRANSFER_JOURNEY_MAKE_TRANSFER_SUMMARY_TRANSLATIONS =
  new InjectionToken<Translations>(
    'transfer_journey_make_transfer_summary_translations'
  );
export interface Translations {
  [key: string]: string;
}

@Component({
  selector: 'bb-make-transfer-summary',
  templateUrl: 'make-transfer-summary.component.html',
  imports: [ButtonModule],
  standalone: true,
  providers: [
    {
      provide: TRANSFER_JOURNEY_MAKE_TRANSFER_SUMMARY_TRANSLATIONS,
      useValue: {
        'transfer.summary.close.text': $localize`:Summary Close button label - 'Close'|This string is used as the label for the
  'Close' button in the transfer summary form. It is presented to the user as the button to be
  pressed to close the modal and cancel the transfer. This label is
  located in the make a transfer summary form layout@@transfer.summary.close.text:Close - overriden`,
      },
    },
  ],
})
export class MakeTransferSummaryComponent {
  @Input() transfer: Transfer | undefined;
  @Output() submitTransfer = new EventEmitter<void>();
  @Output() closeTransfer = new EventEmitter<void>();

  public readonly translations: Translations = {
    'transfer.summary.heading.label':
      $localize`:Summary heading label - 'Are you sure to send out this transfer'|This string is used as the label for the
header of the summary's transfer in the summary of the transfer before proceeding with it. It is presented to the user when
the user needs to confirm if the details of the transfer are correct. This label is
located in the summary for make a transfer layout@@transfer.summary.heading.label:Are you sure to send out this transfer`,
    'transfer.summary.account.description.label':
      $localize`:Summary account description label - 'it will be send to account'|This string is used as the label for the
  account description label in the summary of the transfer before proceeding with it. It is presented to the user when
  the user needs to confirm if the details of the transfer are correct. This label is
  located in the summary for make a transfer layout@@transfer.summary.account.description.label:it will be send to account`,
    'transfer.summary.amount.description.label':
      $localize`:Summary amount description label - 'With amount of'|This string is used as the label for the
  amount description label in the summary of the transfer before proceeding with it. It is presented to the user when
  the user needs to confirm if the details of the transfer are correct. This label is
  located in the summary for make a transfer layout@@transfer.summary.amount.description.label:With amount of`,
    'transfer.summary.submit.text':
      $localize`:Summary Submit button label - 'Submit'|This string is used as the label for the
  'Submit' button in the transfer summary form. It is presented to the user as the button to be
  pressed when the data in form is ready to make a transfer. This label is
  located in the make a transfer summary form layout@@transfer.summary.submit.text:Submit`,
    'transfer.summary.close.text':
      $localize`:Summary Close button label - 'Close'|This string is used as the label for the
  'Close' button in the transfer summary form. It is presented to the user as the button to be
  pressed to close the modal and cancel the transfer. This label is
  located in the make a transfer summary form layout@@transfer.summary.close.text:Close`,
  };

  constructor(
    @Inject(TRANSFER_JOURNEY_MAKE_TRANSFER_SUMMARY_TRANSLATIONS)
    private overridingTranslations: Translations
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = { ...this.translations, ...this.overridingTranslations };
  }

  submit(): void {
    this.submitTransfer.emit();
  }

  close(): void {
    this.closeTransfer.emit();
  }
}
