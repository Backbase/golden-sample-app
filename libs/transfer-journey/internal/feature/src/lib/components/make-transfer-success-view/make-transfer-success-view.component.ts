import { Component, Inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import '@angular/localize/init';

import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ButtonModule } from '@backbase/ui-ang/button';
import {
  TRANSFER_JOURNEY_MAKE_TRANSFER_SUCCESS_VIEW_TRANSLATIONS,
  TransferJourneyMakeTransferSuccessViewTranslations,
  transferJourneyMakeTransferSuccessViewTranslations,
} from '../../../translations-catalog';

@Component({
  templateUrl: 'make-transfer-success-view.component.html',
  imports: [AsyncPipe, NgIf, ButtonModule],
  standalone: true,
})
export class MakeTransferSuccessViewComponent {
  transfer$ = this.transferStore.transfer$;

  public readonly translations: TransferJourneyMakeTransferSuccessViewTranslations;

  constructor(
    private readonly transferStore: MakeTransferJourneyState,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(TRANSFER_JOURNEY_MAKE_TRANSFER_SUCCESS_VIEW_TRANSLATIONS)
    private readonly overridingTranslations: Partial<TransferJourneyMakeTransferSuccessViewTranslations>
  ) {
    this.translations = {
      ...transferJourneyMakeTransferSuccessViewTranslations,
      ...Object.fromEntries(
        Object.entries(this.overridingTranslations ?? {}).map(
          ([key, value]) => [
            key,
            value ?? transferJourneyMakeTransferSuccessViewTranslations[key],
          ]
        )
      ),
    };
  }

  close(): void {
    this.router.navigate(['../make-transfer'], { relativeTo: this.route });
  }
}
