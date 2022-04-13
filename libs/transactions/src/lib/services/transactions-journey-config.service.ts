import { Injectable, TemplateRef } from '@angular/core';

@Injectable()
export class TransactionsJourneyConfiguration {
  pageSize = 20;
  slimMode = true;
  additionalDetailsTpl: TemplateRef<any> | undefined = undefined;
}