import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { PageHeaderModule } from '@backbase/ui-ang/page-header';
import { IfEntitlementsDirective } from '@backbase/foundation-ang/entitlements';
import { PERMISSIONS } from '@backbase-gsa/ach-positive-pay-journey/internal/shared-data';

@Component({
  selector: 'bb-ach-positive-pay-journey',
  templateUrl: './ach-positive-pay-journey.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderModule,
    IfEntitlementsDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
