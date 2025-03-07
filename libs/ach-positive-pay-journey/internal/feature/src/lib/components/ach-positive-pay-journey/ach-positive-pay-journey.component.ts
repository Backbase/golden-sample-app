import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PERMISSIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';
import { HeadingModule } from '@backbase/ui-ang/heading';
import {
  ACH_POSITIVE_PAY_JOURNEY_TRANSLATIONS,
  AchPositivePayJourneyTranslations,
  achPositivePayJourneyTranslations as defaultTranslations,
} from '../../../translations-catalog';
import { TranslationsBase } from '@backbase-gsa/shared-translations';

@Component({
  selector: 'bb-ach-positive-pay-journey',
  templateUrl: './ach-positive-pay-journey.component.html',
  imports: [HeadingModule, RouterModule],
  standalone: true,
})
export class AchPositivePayJourneyComponent extends TranslationsBase<AchPositivePayJourneyTranslations> {
  permissions = PERMISSIONS;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    @Inject(ACH_POSITIVE_PAY_JOURNEY_TRANSLATIONS)
    private readonly _translations: Partial<AchPositivePayJourneyTranslations>
  ) {
    super(defaultTranslations, _translations);
  }

  openNewBlockerModal() {
    this.router.navigate([{ outlets: { modal: 'new' } }], {
      relativeTo: this.route,
    });
  }
}
