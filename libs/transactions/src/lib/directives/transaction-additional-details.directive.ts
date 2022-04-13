import { Directive, TemplateRef } from "@angular/core";


@Directive({selector: 'ng-template[bbTransactionAdditionalDetails]'})
export class TransactionAdditionalDetailsTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}