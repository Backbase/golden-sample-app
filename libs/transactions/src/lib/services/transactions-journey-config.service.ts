import { Injectable, TemplateRef } from '@angular/core';
import { AdditionalDetailsContext } from '../directives/transaction-additional-details.directive';

@Injectable()
export class TransactionsJourneyConfiguration {
  pageSize = 20;
  slimMode = true;
  additionalDetailsTpl: TemplateRef<AdditionalDetailsContext> | undefined = undefined;
}