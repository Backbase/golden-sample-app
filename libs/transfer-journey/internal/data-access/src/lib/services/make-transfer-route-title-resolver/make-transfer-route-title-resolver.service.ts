import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  ResolveFn,
  RedirectCommand,
} from '@angular/router';
import { MakeTransferJourneyConfiguration } from '../make-transfer-journey-config/make-transfer-journey-config.service';

@Injectable()
export class MakeTransferRouteTitleResolverService
  implements Resolve<string | RedirectCommand | null>
{
  resolve(route: ActivatedRouteSnapshot): string | RedirectCommand | null {
    return !this.config.slimMode ? route.data['title'] : '';
  }
  constructor(private config: MakeTransferJourneyConfiguration) {}
}
