import { Injectable } from "@angular/core";
import { ActivatedRoute, CanActivate, Router } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { MakeTransferJourneyState } from "./make-transfer-journey-state.service";

@Injectable()
export class MakeTransferJourneyStoreGuard implements CanActivate {
  canActivate() {
    return this.transferStore.transfer
      .pipe(
        tap((data) => {
          if (!data) {
            this.router.navigate(['../make-transfer'], { relativeTo: this.route });
          }
        }),
        map(() => true),
    );
  }
  constructor(
    public readonly transferStore: MakeTransferJourneyState, 
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}
}
