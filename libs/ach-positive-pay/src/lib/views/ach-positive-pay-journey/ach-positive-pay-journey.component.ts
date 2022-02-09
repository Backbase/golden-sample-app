import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PERMISSIONS } from '../../constants/permissions';

@Component({
  selector: 'bb-ach-positive-pay-journey',
  templateUrl: './ach-positive-pay-journey.component.html',
})
export class AchPositivePayJourneyComponent {
  permissions = PERMISSIONS;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {}

  openNewBlockerModal() {
    this.router.navigate([{ outlets: { modal: 'new' } }], { relativeTo: this.route });
  }
}
