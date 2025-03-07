import { Component, Inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import '@angular/localize/init';

import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ButtonModule } from '@backbase/ui-ang/button';
import {
  TRANSFER_JOURNEY_MAKE_TRANSFER_SUCCESS_VIEW_TRANSLATIONS,
  TransferJourneyMakeTransferSuccessViewTranslations,
  transferJourneyMakeTransferSuccessViewTranslations as defaultTranslations,
} from '../../../translations-catalog';
import { TranslationsBase } from '@backbase-gsa/shared-translations';

@Component({
  templateUrl: 'make-transfer-success-view.component.html',
  imports: [AsyncPipe, NgIf, ButtonModule],
  standalone: true,
})
export class MakeTransferSuccessViewComponent extends TranslationsBase<TransferJourneyMakeTransferSuccessViewTranslations> {
  transfer$ = this.transferStore.transfer$;

  constructor(
    private readonly transferStore: MakeTransferJourneyState,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(TRANSFER_JOURNEY_MAKE_TRANSFER_SUCCESS_VIEW_TRANSLATIONS)
    private readonly _translations: Partial<TransferJourneyMakeTransferSuccessViewTranslations>
  ) {
    super(defaultTranslations, _translations);
  }

  close(): void {
    this.router.navigate(['../make-transfer'], { relativeTo: this.route });
  }
}
