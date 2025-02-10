import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { MakeTransferJourneyState } from '@backbase-gsa/transfer-journey/internal/data-access';
import { ButtonModule } from '@backbase/ui-ang/button';
import {
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
  private _translations: TransferJourneyMakeTransferSuccessViewTranslations = {
    ...transferJourneyMakeTransferSuccessViewTranslations,
  };

  @Input()
  set translations(
    value: Partial<TransferJourneyMakeTransferSuccessViewTranslations>
  ) {
    this._translations = {
      ...transferJourneyMakeTransferSuccessViewTranslations,
      ...value,
    };
  }

  get translations(): TransferJourneyMakeTransferSuccessViewTranslations {
    return this._translations;
  }

  close(): void {
    this.router.navigate(['../make-transfer'], { relativeTo: this.route });
  }

  constructor(
    private readonly transferStore: MakeTransferJourneyState,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}
}
