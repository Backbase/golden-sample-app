import { Injectable, TemplateRef } from '@angular/core';
import { AdditionalDetailsContext } from '../directives/transaction-additional-details.directive';

@Injectable({
  providedIn: 'root',
})
export class ExtensionTemplatesService {
  additionalDetailsTemplate: TemplateRef<AdditionalDetailsContext> | undefined;
}
