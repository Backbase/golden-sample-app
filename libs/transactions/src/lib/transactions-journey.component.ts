import { AfterContentChecked, Component, ContentChild } from '@angular/core';
import { TransactionAdditionalDetailsTemplateDirective } from './directives/transaction-additional-details.directive';
import { ExtensionTemplatesService } from './services/extension-templates.service';

@Component({
  selector: 'bb-transactions-journey',
  templateUrl: 'transactions-journey.component.html',
})
export class TransactionsJourneyComponent implements AfterContentChecked {
  @ContentChild(TransactionAdditionalDetailsTemplateDirective) additionalDetailsTemplate?: TransactionAdditionalDetailsTemplateDirective;

  constructor(private readonly extensionTemplateService: ExtensionTemplatesService) {}
  
  ngAfterContentChecked() {
    this.extensionTemplateService.additionalDetailsTemplate = this.additionalDetailsTemplate?.templateRef;
  }
}
