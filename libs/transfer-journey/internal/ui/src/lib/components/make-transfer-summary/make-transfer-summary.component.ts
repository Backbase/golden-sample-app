import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transfer } from '@backbase-gsa/transfer-journey/internal/shared-data';
import { ButtonModule } from '@backbase/ui-ang/button';

import {
  transferJourneyMakeTransferSummaryTranslations,
  TransferJourneyMakeTransferSummaryTranslations,
} from '../../../translations-catalog';
@Component({
  selector: 'bb-make-transfer-summary',
  templateUrl: 'make-transfer-summary.component.html',
  imports: [ButtonModule],
  standalone: true,
})
export class MakeTransferSummaryComponent {
  @Input() transfer: Transfer | undefined;
  @Output() submitTransfer = new EventEmitter<void>();
  @Output() closeTransfer = new EventEmitter<void>();
  private _translations: TransferJourneyMakeTransferSummaryTranslations = {
    ...transferJourneyMakeTransferSummaryTranslations,
  };

  @Input()
  set translations(
    value: Partial<TransferJourneyMakeTransferSummaryTranslations>
  ) {
    this._translations = {
      ...transferJourneyMakeTransferSummaryTranslations,
      ...value,
    };
  }

  get translations(): TransferJourneyMakeTransferSummaryTranslations {
    return this._translations;
  }

  submit(): void {
    this.submitTransfer.emit();
  }

  close(): void {
    this.closeTransfer.emit();
  }
}
