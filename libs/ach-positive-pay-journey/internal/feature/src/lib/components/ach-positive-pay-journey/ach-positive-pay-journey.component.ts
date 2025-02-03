import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PERMISSIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';
import { HeadingModule } from '@backbase/ui-ang/heading';
import {
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
  private _translations: AchPositivePayJourneyTranslations = {
    ...achPositivePayJourneyTranslations,
  };

  @Input()
  set translations(value: Partial<AchPositivePayJourneyTranslations>) {
    this._translations = { ...achPositivePayJourneyTranslations, ...value };
  }

  get translations(): AchPositivePayJourneyTranslations {
    return this._translations;
  }

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  openNewBlockerModal() {
    this.router.navigate([{ outlets: { modal: 'new' } }], {
      relativeTo: this.route,
    });
  }
}
