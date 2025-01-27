import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PERMISSIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';
import { HeadingModule } from '@backbase/ui-ang/heading';
import {
  ACH_POSITIVE_PAY_JOURNEY_TRANSLATIONS,
  Translations,
} from './translations.provider';

@Component({
  selector: 'bb-ach-positive-pay-journey',
  templateUrl: './ach-positive-pay-journey.component.html',
  imports: [HeadingModule, RouterModule],
  standalone: true,
})
export class AchPositivePayJourneyComponent {
  permissions = PERMISSIONS;

  public readonly translations: Translations = {
    'ach-positive-pay-journey.heading.title':
      this.overridingTranslations['ach-positive-pay-journey.heading.title'] ||
      $localize`:ACH positive pay title - 'ACH Positive Pay'|This string is used as the
      title for the heading in the ACH Positive Pay journey component. It is
      presented to the user as the main heading of the page when they are
      viewing the ACH Positive Pay journey. This title is located at the top of
      the ACH Positive Pay journey page.@@ach-positive-pay-journey.heading.title:ACH Positive Pay`,
    'ach-positive-pay-journey.heading.new-blocker.button':
      this.overridingTranslations[
        'ach-positive-pay-journey.heading.new-blocker.button'
      ] ||
      $localize`:New ACH Blocker - 'New ACH Blocker'|This string is used as the label for a
      button that opens the New ACH Blocker dialog with a form. It is presented
      to the user as a button to create a new ACH Blocker. This button is
      located in the ACH Positive Pay journey
      page.@@ach-positive-pay-journey.heading.new-blocker.button:New ACH Blocker`,
  };

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    @Inject(ACH_POSITIVE_PAY_JOURNEY_TRANSLATIONS)
    private overridingTranslations: Translations
  ) {
    // If APP_TRANSLATIONS is not provided, set the default value as an empty object
    this.overridingTranslations = this.overridingTranslations || {};
  }

  openNewBlockerModal() {
    this.router.navigate([{ outlets: { modal: 'new' } }], {
      relativeTo: this.route,
    });
  }
}
