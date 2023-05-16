import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PERMISSIONS } from '@backbase-gsa/internal-ach-positive-pay-shared-data';
import { HeadingModule } from '@backbase/ui-ang/heading';

@Component({
  selector: 'bb-ach-positive-pay-journey',
  templateUrl: './ach-positive-pay-journey.component.html',
  imports: [HeadingModule, RouterModule],
  standalone: true,
})
export class AchPositivePayJourneyComponent {
  permissions = PERMISSIONS;

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
