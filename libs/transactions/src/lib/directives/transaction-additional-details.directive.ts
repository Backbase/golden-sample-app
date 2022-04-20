import { Directive, TemplateRef } from "@angular/core";
import { TransactionItem } from "@backbase/data-ang/transactions";

export type AdditionalDetailsContext = {
  $implicit: Pick<TransactionItem, 'additions' | 'counterPartyAccountNumber' | 'location' | 'merchant'>
}

@Directive({selector: 'ng-template[bbTransactionAdditionalDetails]'})
export class TransactionAdditionalDetailsTemplateDirective {
  constructor(public templateRef: TemplateRef<AdditionalDetailsContext>) {}

  static ngTemplateContextGuard(dir: TransactionAdditionalDetailsTemplateDirective, ctx: unknown): ctx is AdditionalDetailsContext { 
      return true
  };
}