import { Component, Inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ButtonModule } from '@backbase/ui-ang/button';
import { TRANSFER_JOURNEY_MAKE_TRANSFER_SUCCESS_VIEW_TRANSLATIONS, Translations } from './translations.provider';

@Component({
  templateUrl: 'make-transfer-success-view.component.html',
  imports: [AsyncPipe, NgIf, ButtonModule],
  standalone: true,
})
export class MakeTransferSuccessViewComponent {
  transfer$ = this.transferStore.transfer$;

  close(): void {
    this.router.navigate(['../make-transfer'], { relativeTo: this.route });
  }

  public readonly translations: Translations = {
    'transfer.success.close.text':
      this.overridingTranslations['transfer.success.close.text'] ||
      $localize`:Close button label - 'Close'|This string is used as the label for the
      close button in the transfer success view. It is presented to the user
      when they want to close the success message after making a transfer. This
      label is located in the transfer success view component.
      @@transfer.success.close.text:Close`,
  };

  constructor(
    private readonly transferStore: MakeTransferJourneyState,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(TRANSFER_JOURNEY_MAKE_TRANSFER_SUCCESS_VIEW_TRANSLATIONS)
    private overridingTranslations: Translations
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
  }
}
