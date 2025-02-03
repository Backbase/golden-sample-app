import { Component, Inject, InjectionToken } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PERMISSIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';
import { HeadingModule } from '@backbase/ui-ang/heading';
import {
  ACH_POSITIVE_PAY_JOURNEY_TRANSLATIONS,
  achPositivePayJourneyTranslations,
  AchPositivePayJourneyTranslations,
} from '../../../translations-catalog';

@Component({
  selector: 'bb-ach-positive-pay-journey',
  templateUrl: './ach-positive-pay-journey.component.html',
  imports: [HeadingModule, RouterModule],
  standalone: true,
})
export class AchPositivePayJourneyComponent {
  permissions = PERMISSIONS;

  private readonly defaultTranslations: AchPositivePayJourneyTranslations =
    achPositivePayJourneyTranslations;
  public readonly translations: AchPositivePayJourneyTranslations;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    @Inject(ACH_POSITIVE_PAY_JOURNEY_TRANSLATIONS)
    private readonly overridingTranslations: Partial<AchPositivePayJourneyTranslations>
  ) {
    this.translations = {
      ...this.defaultTranslations,
      ...Object.fromEntries(
        Object.entries(this.overridingTranslations ?? {}).map(
          ([key, value]) => [key, value ?? this.defaultTranslations[key]]
        )
      ),
    };
  }

  openNewBlockerModal() {
    this.router.navigate([{ outlets: { modal: 'new' } }], {
      relativeTo: this.route,
    });
  }
}
