import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Transfer } from '@backbase-gsa/transfer-journey/internal/shared-data';
import { ButtonModule } from '@backbase/ui-ang/button';
import {
  TRANSFER_JOURNEY_MAKE_TRANSFER_SUMMARY_TRANSLATIONS,
  transferJourneyMakeTransferSummaryTranslations,
  TransferJourneyMakeTransferSummaryTranslations,
} from '../../../translations-catalog';

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

  private readonly defaultTranslations: TransferJourneyMakeTransferSummaryTranslations =
    transferJourneyMakeTransferSummaryTranslations;
  public readonly translations: TransferJourneyMakeTransferSummaryTranslations;

  constructor(
    @Inject(TRANSFER_JOURNEY_MAKE_TRANSFER_SUMMARY_TRANSLATIONS)
    private readonly overridingTranslations: TransferJourneyMakeTransferSummaryTranslations
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
    this.translations = {
      ...this.defaultTranslations,
      ...this.overridingTranslations,
    };
  }

  submit(): void {
    this.submitTransfer.emit();
  }

  close(): void {
    this.closeTransfer.emit();
  }
}
