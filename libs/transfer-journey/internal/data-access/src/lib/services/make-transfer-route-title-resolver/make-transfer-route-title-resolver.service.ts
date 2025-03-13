import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand } from '@angular/router';
import { MakeTransferJourneyConfiguration } from '../make-transfer-journey-config/make-transfer-journey-config.service';

@Injectable()
export class MakeTransferRouteTitleResolverService {
  resolve(route: ActivatedRouteSnapshot): string | RedirectCommand {
    return !this.config.slimMode ? route.data['title'] : '';
  }
  constructor(private config: MakeTransferJourneyConfiguration) {}
}
