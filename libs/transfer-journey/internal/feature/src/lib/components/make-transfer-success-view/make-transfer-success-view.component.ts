import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ButtonModule } from '@backbase/ui-ang/button';
import { $localize } from '@angular/localize/init';

export interface Translations {
  [key: string]: string;
}

@Component({
  templateUrl: 'make-transfer-success-view.component.html',
  imports: [AsyncPipe, NgIf, ButtonModule],
  standalone: true,
})
export class MakeTransferSuccessViewComponent {
  transfer$ = this.transferStore.transfer$;
  @Input()
  public readonly translations: Translations = {};
  public readonly defaultTranslations: Translations = {
    'transfer.success.close.text': $localize`:Close button label - 'Close'|This string is used as the label for the
      close button in the transfer success view. It is presented to the user
      when they want to close the success message after making a transfer. This
      label is located in the transfer success view component.
      @@transfer.success.close.text:Close`,
  };

  close(): void {
    this.router.navigate(['../make-transfer'], { relativeTo: this.route });
  }

  constructor(
    private readonly transferStore: MakeTransferJourneyState,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.translations = {
      ...this.defaultTranslations,
      ...this.translations,
    };
  }
}
