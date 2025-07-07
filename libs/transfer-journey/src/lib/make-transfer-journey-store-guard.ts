import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class MakeTransferJourneyStoreGuard {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  canActivate() {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (!state || !state['transfer']) {
      return this.router.parseUrl('../make-transfer');
    }
    return true;
  }
}
