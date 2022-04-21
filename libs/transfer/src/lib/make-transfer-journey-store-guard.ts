import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';

@Injectable()
export class MakeTransferJourneyStoreGuard implements CanActivate {
  canActivate() {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (!state || !state['transfer']) {
      return this.router.parseUrl('../make-transfer');
    }
    return true;
  }
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}
}
