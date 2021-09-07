import { Inject, Injectable } from "@angular/core";
import { CONDITIONS, PropertyResolver } from "@backbase/foundation-ang/web-sdk";
import { from } from "rxjs";

@Injectable()
export class MakeTransferPermissionsService {
  unlimitedAmountPerTransaction$ = from(this.conditions.resolveEntitlements('Payments.transfer.limitless'));
  constructor( 
    @Inject(CONDITIONS)
    private readonly conditions: PropertyResolver
   ) {}
}