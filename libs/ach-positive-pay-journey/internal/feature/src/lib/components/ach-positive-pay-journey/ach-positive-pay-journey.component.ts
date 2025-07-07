import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PERMISSIONS } from '@backbase/ach-positive-pay-journey/internal/shared-data';
import { EntitlementsModule } from '@backbase/foundation-ang/entitlements';
import { PageHeaderModule } from '@backbase/ui-ang/page-header';
import { IconModule } from '@backbase/ui-ang/icon';
import { ButtonModule } from '@backbase/ui-ang/button';

@Component({
  selector: 'bb-ach-positive-pay-journey',
  templateUrl: './ach-positive-pay-journey.component.html',
  standalone: true,
  imports: [
    PageHeaderModule,
    RouterModule,
    EntitlementsModule,
    IconModule,
    ButtonModule,
  ],
})
export class AchPositivePayJourneyComponent {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  permissions = PERMISSIONS;

  openNewBlockerModal() {
    this.router.navigate([{ outlets: { modal: 'new' } }], {
      relativeTo: this.route,
    });
  }
}
